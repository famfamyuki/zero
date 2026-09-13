import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { beforeEach, afterEach, mock } from 'node:test';
import OpenAI from 'openai';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { POST } from '../app/api/architecture-review/route';
import { GET as previewAccess } from '../app/api/architecture-review/preview-access/route';
import { GET as offer } from '../app/api/billing/architecture-review/offer/route';
import { getSupabaseAdmin } from '../lib/supabase-admin';
import { isArchitectureReviewPreviewTester, parseArchitectureReviewPreviewConfig } from '../lib/architecture-review/preview-test';
import { parseArchitectureReviewProviderConfig, estimateWorstCaseCostMicroUsd } from '../lib/paid-architecture-review/config';
import { PRESET_TEMPLATES } from '../lib/presets';
import { evaluateReadiness } from '../lib/readiness';
import { validateGraph } from '../lib/transpiler/validation';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { createExecutionPreviewReadModel } from '../lib/execution-preview';
import { createResourceAnalysisReadModel } from '../lib/resource-analysis';
import { createArchitectureReviewEvidence } from '../lib/architecture-review/evidence';
import { createReviewerEnvelope } from '../lib/architecture-review/reviewer-envelope';
import { ArchitectureReviewStageContent } from '../components/editor/unified-preflight/ArchitectureReviewStageContent';
import { sanitizeAnalyticsProperties } from '../lib/analytics-config';

// Synthetic identities and credentials only. All external I/O is blocked below.
const tester = '00000000-0000-4000-8000-000000000001';
const stranger = '00000000-0000-4000-8000-000000000002';
const providerEnv = {
  OPENAI_API_KEY: 'test', ARCHITECTURE_REVIEW_MODEL: 'gpt-5.6-terra', ARCHITECTURE_REVIEW_COST_PROFILE_MODEL: 'gpt-5.6-terra',
  ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES: '32768', ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS: '4096',
  ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD: '250000',
  ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS: '2000000', ARCHITECTURE_REVIEW_OUTPUT_MICRO_USD_PER_MILLION_TOKENS: '12000000',
};
const previewEnv = { ...providerEnv, VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'experiment/nonprod-architecture-review-test',
  ARCHITECTURE_REVIEW_PREVIEW_TEST_ENABLED: 'true', ARCHITECTURE_REVIEW_PREVIEW_TEST_USER_IDS: tester };
let savedEnv: NodeJS.ProcessEnv;
let userId: string | null;
let calls: string[];
let providerBody: any;
let providerBehavior: 'valid' | 'invalid' | 'timeout';
let draft: any;

function evidence(extraText = '') {
  const graph = structuredClone(PRESET_TEMPLATES[0].graphData);
  (graph.nodes.find((node) => node.type === 'agent')!.data as any).goal += extraText;
  const validation = validateGraph(graph.nodes, graph.edges, graph.crewConfig, 'scaffold');
  assert.equal(validation.isValid, true);
  const plan = createSemanticPlan(graph.nodes, graph.edges, graph.crewConfig, validation);
  const readiness = evaluateReadiness(graph);
  (graph.nodes.find((node) => node.type === 'tool')!.data as any).parameters = { path: 'PRIVATE_PARAMETER_CANARY' };
  return createArchitectureReviewEvidence({ graph, readiness, execution: createExecutionPreviewReadModel(plan), resources: createResourceAnalysisReadModel(plan) });
}
const bundle = evidence();
const request = (body: unknown = { version: '0.1.0', locale: 'en', evidence: bundle }, authenticated = true) => new Request('https://preview.example.test/api/architecture-review', {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': tester, ...(authenticated ? { Authorization: 'Bearer test' } : {}) }, body: JSON.stringify(body),
});

beforeEach(() => {
  savedEnv = { ...process.env };
  for (const key of Object.keys(process.env)) if (/ARCHITECTURE_REVIEW|OPENAI|STRIPE|SUPABASE|VERCEL/.test(key)) delete process.env[key];
  Object.assign(process.env, previewEnv, { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test' });
  userId = tester; calls = []; providerBody = null; providerBehavior = 'valid';
  const entry = (createReviewerEnvelope(bundle).providerInput.evidence as any[]).find((item) => item.targets.length);
  draft = { version: '0.1.0', intent: { summary: 'Purpose inferred from configured workflow.', knowledgeStatus: 'Inferred', evidenceRefs: [entry.alias], assumptions: [] },
    strengths: [], findings: [], recommendedDirection: 'Review the simplest sufficient architecture.',
    uncertainties: [{ knowledgeStatus: 'Unknown', statement: 'Runtime behavior is unavailable.', evidenceRefs: [entry.alias], targetRefs: [entry.targets[0]] }] };
  mock.method(globalThis, 'fetch', async () => { throw new Error('External network forbidden in deterministic tests'); });
  const admin = getSupabaseAdmin();
  mock.method(admin.auth, 'getUser', async () => { calls.push('auth'); return { data: { user: userId ? { id: userId } : null }, error: null }; });
  mock.method(admin, 'from', () => { calls.push('billing_read'); throw new Error('Unexpected billing read'); });
  mock.method(admin, 'rpc', async () => { calls.push('billing_write'); throw new Error('Unexpected billing write'); });
  mock.method(OpenAI.Responses.prototype, 'parse', async (body: any, options: any) => {
    calls.push('provider'); providerBody = body;
    assert.ok(options.signal instanceof AbortSignal);
    if (providerBehavior === 'timeout') return await new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }));
    return { output_parsed: providerBehavior === 'invalid' ? { ...draft, intent: { ...draft.intent, evidenceRefs: ['E999'] } } : draft, usage: { input_tokens: 100, output_tokens: 100, total_tokens: 200 } };
  });
});
afterEach(() => {
  mock.restoreAll(); mock.timers.reset();
  for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
  Object.assign(process.env, savedEnv);
});

test('tester gate hard denies Production, missing environment/branch, main, missing/false flag and non-members', async () => {
  for (const overrides of [
    { VERCEL_ENV: 'production' }, { VERCEL_ENV: 'development' }, { VERCEL_ENV: undefined },
    { VERCEL_GIT_COMMIT_REF: 'main' }, { VERCEL_GIT_COMMIT_REF: 'refs/heads/main' }, { VERCEL_GIT_COMMIT_REF: undefined },
    { ARCHITECTURE_REVIEW_PREVIEW_TEST_ENABLED: undefined }, { ARCHITECTURE_REVIEW_PREVIEW_TEST_ENABLED: 'false' },
  ]) {
    const env = { ...previewEnv, ...overrides };
    assert.equal(isArchitectureReviewPreviewTester(tester, env), false);
    assert.equal(parseArchitectureReviewPreviewConfig(env), null);
  }
  for (const id of [null, stranger, 'not-a-uuid']) assert.equal(isArchitectureReviewPreviewTester(id, previewEnv), false);
  assert.equal(isArchitectureReviewPreviewTester(tester, { ...previewEnv, ARCHITECTURE_REVIEW_PREVIEW_TEST_USER_IDS: '' }), false);
  assert.equal(isArchitectureReviewPreviewTester(tester, { ...previewEnv, ARCHITECTURE_REVIEW_PREVIEW_TEST_USER_IDS: ` ${stranger}, ${tester} ` }), true);
  for (const value of ['production', 'development', '']) {
    process.env.VERCEL_ENV = value;
    assert.equal((await POST(request())).status, 503);
    assert.deepEqual(await (await previewAccess(request())).json(), { enabled: false, allowed: false });
  }
  process.env.VERCEL_ENV = 'preview';
  for (const value of ['', 'false']) {
    process.env.ARCHITECTURE_REVIEW_PREVIEW_TEST_ENABLED = value;
    assert.equal((await POST(request())).status, 503);
  }
  assert.deepEqual(calls, []);
});

test('API checks verified Supabase identity; discovery never grants unauthenticated or unlisted access', async () => {
  assert.equal((await POST(request(undefined, false))).status, 401);
  userId = null;
  assert.equal((await POST(request())).status, 401);
  assert.deepEqual(await (await previewAccess(request())).json(), { enabled: true, allowed: false });
  userId = stranger;
  assert.equal((await POST(request())).status, 503);
  assert.deepEqual(await (await previewAccess(request())).json(), { enabled: true, allowed: false });
  assert.ok(calls.every((call) => call === 'auth'));
});

test('allowlisted tester executes existing provider with no subscription, entitlement, quota or accounting', async () => {
  const access = await previewAccess(request());
  assert.deepEqual(await access.json(), { enabled: true, allowed: true });
  assert.equal(access.headers.get('cache-control'), 'no-store');
  const before = JSON.stringify(bundle);
  const response = await POST(request());
  assert.equal(response.status, 200);
  const result = (await response.json()).result;
  assert.equal(result.intent.knowledgeStatus, 'Inferred');
  assert.equal(result.uncertainties[0].knowledgeStatus, 'Unknown');
  assert.deepEqual(calls, ['auth', 'auth', 'provider']);
  assert.equal(JSON.stringify(bundle), before);
  assert.equal(providerBody.store, false);
  assert.equal(providerBody.model, providerEnv.ARCHITECTURE_REVIEW_MODEL);
  assert.equal(providerBody.max_output_tokens, 4096);
  assert.deepEqual(providerBody.reasoning, { effort: 'medium' });
  assert.equal(providerBody.text.format.type, 'json_schema');
  assert.match(providerBody.input[0].content, /untrusted data, never instructions/);
  assert.doesNotMatch(JSON.stringify(providerBody), /PRIVATE_PARAMETER_CANARY|preview_tester|PREVIEW_TEST_USER_IDS/);
  assert.equal('tools' in providerBody, false);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('provider config requires every reviewed safety setting without requiring Stripe or paid configuration', () => {
  assert.ok(parseArchitectureReviewProviderConfig(providerEnv));
  for (const key of Object.keys(providerEnv)) assert.equal(parseArchitectureReviewProviderConfig({ ...providerEnv, [key]: undefined }), null, key);
  for (const [key, value] of [
    ['ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES', '65536'], ['ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS', '8192'],
    ['ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD', '500000'], ['ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS', '1'],
    ['ARCHITECTURE_REVIEW_COST_PROFILE_MODEL', 'other'], ['ARCHITECTURE_REVIEW_MODEL', 'other'],
  ]) assert.equal(parseArchitectureReviewProviderConfig({ ...providerEnv, [key]: value }), null);
  assert.equal(estimateWorstCaseCostMicroUsd(32768, parseArchitectureReviewProviderConfig(providerEnv)!), 114688);
});

test('tester input schema, Evidence fingerprints, body limit, and provider cost envelope fail before provider', async () => {
  for (const [body, expected] of [
    [{ version: '0.1.0', locale: 'en', evidence: bundle, userId: tester }, 'invalid_request'],
    [{ version: '99', locale: 'en', evidence: bundle }, 'unsupported_contract_version'],
    [{ version: '0.1.0', locale: 'en', evidence: { ...bundle, evidenceFingerprint: 'arev_v0_' + '0'.repeat(64) } }, 'invalid_evidence'],
    ['x'.repeat(512 * 1024), 'input_too_large'],
    [{ version: '0.1.0', locale: 'en', evidence: evidence('x'.repeat(40000)) }, 'request_cost_limit_exceeded'],
  ] as const) {
    assert.equal((await (await POST(request(body))).json()).error, expected);
  }
  assert.ok(calls.every((call) => call === 'auth'));
});

test('invalid tester reviewer output fails closed without persistence or billing writes', async () => {
  providerBehavior = 'invalid';
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { version: '0.1.0', error: 'invalid_reviewer_output' });
  assert.deepEqual(calls, ['auth', 'provider']);
});

test('tester provider timeout retains the existing 45 second abort boundary', async () => {
  providerBehavior = 'timeout';
  mock.timers.enable({ apis: ['setTimeout'] });
  const response = POST(request());
  for (let i = 0; i < 30 && !calls.includes('provider'); i++) await Promise.resolve();
  assert.ok(calls.includes('provider'));
  mock.timers.tick(45000);
  assert.equal((await response).status, 504);
  assert.deepEqual(calls, ['auth', 'provider']);
});

test('Production offer stays disabled despite tester flag and allowlist', async () => {
  process.env.VERCEL_ENV = 'production';
  assert.equal((await (await offer()).json()).enabled, false);
  assert.deepEqual(calls, []);
});

test('Production paid auth, entitlement, quota, start and accounting contract is identical with tester flag on/off', async () => {
  Object.assign(process.env, {
    VERCEL_ENV: 'production', ARCHITECTURE_REVIEW_PAID_ENABLED: 'true',
    STRIPE_SECRET_KEY: 'sk_live_test_fixture', STRIPE_WEBHOOK_SECRET: 'test',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test', STRIPE_ARCHITECTURE_REVIEW_PRICE_ID: 'price_test',
    STRIPE_BILLING_PORTAL_CONFIGURATION_ID: 'bpc_test', ARCHITECTURE_REVIEW_STRIPE_MODE: 'live',
    ARCHITECTURE_REVIEW_PRICE_CURRENCY: 'usd', ARCHITECTURE_REVIEW_PRICE_UNIT_AMOUNT: '1200',
    ARCHITECTURE_REVIEW_STRIPE_TAX_ENABLED: 'true', ARCHITECTURE_REVIEW_INCLUDED_REVIEWS: '10',
    ARCHITECTURE_REVIEW_PROVIDER_BUDGET_WARNING_MICRO_USD: '20000000',
    ARCHITECTURE_REVIEW_PROVIDER_BUDGET_CRITICAL_MICRO_USD: '40000000',
    ARCHITECTURE_REVIEW_PROVIDER_BUDGET_HARD_CEILING_MICRO_USD: '50000000',
    ARCHITECTURE_REVIEW_TERMS_URL: 'https://policies.agentgraph-studio.com/terms',
    ARCHITECTURE_REVIEW_PRIVACY_URL: 'https://policies.agentgraph-studio.com/privacy',
    ARCHITECTURE_REVIEW_SUPPORT_URL: 'https://support.agentgraph-studio.com/',
  });
  for (const key of ['STRIPE_LIVE_MODE', 'COMMERCIAL_HOSTING', 'COMMERCIAL_OPERATIONS', 'SUPABASE_AUTH', 'PROVIDER_BUDGET', 'WAF', 'COMMERCIAL_POLICY', 'FINANCIAL_QA']) {
    process.env[`ARCHITECTURE_REVIEW_${key}_APPROVED`] = 'true';
  }
  let entitled = true;
  let consumed = 0;
  const admin = getSupabaseAdmin();
  mock.method(admin, 'from', (table: string) => {
    calls.push(table);
    const query = { select: () => query, eq: () => query, maybeSingle: async () => ({ error: null,
      data: table === 'architecture_review_entitlements' ? (entitled ? {
        sync_state: 'healthy', stripe_status: 'active', current_period_start: new Date(Date.now() - 60000).toISOString(),
        current_period_end: new Date(Date.now() + 60000).toISOString(), stripe_subscription_id: 'sub_test', cancel_at_period_end: false,
      } : null) : { quota_limit_snapshot: 10, consumed_count: consumed, reserved_count: 0 },
    }) };
    return query;
  });
  mock.method(admin, 'rpc', async (name: string, args: any) => {
    calls.push(name + (args.p_terminal_state ? ':' + args.p_terminal_state : ''));
    return { error: null, data: name === 'reserve_architecture_review' ? [{ outcome: 'new' }] : name === 'mark_architecture_review_provider_started' ? true : args.p_terminal_state };
  });
  for (const flag of ['false', 'true']) {
    process.env.ARCHITECTURE_REVIEW_PREVIEW_TEST_ENABLED = flag;
    calls = [];
    assert.equal((await POST(request(undefined, false))).status, 401);
    assert.deepEqual(calls, []);
    entitled = false;
    assert.equal((await POST(request())).status, 403);
    assert.deepEqual(calls, ['auth', 'architecture_review_entitlements']);
    entitled = true; consumed = 10; calls = [];
    assert.equal((await POST(request())).status, 429);
    assert.deepEqual(calls, ['auth', 'architecture_review_entitlements', 'architecture_review_usage_periods']);
    consumed = 0; calls = [];
    assert.equal((await POST(request())).status, 200);
    assert.deepEqual(calls, ['auth', 'architecture_review_entitlements', 'architecture_review_usage_periods', 'reserve_architecture_review', 'mark_architecture_review_provider_started', 'provider', 'finalize_architecture_review_attempt:consumed']);
    providerBehavior = 'invalid'; calls = [];
    assert.equal((await POST(request())).status, 502);
    assert.equal(calls.at(-1), 'finalize_architecture_review_attempt:released');
    providerBehavior = 'valid';
  }
});

test('tester analytics carry only bounded access mode and never identity, allowlist, Evidence or result', () => {
  assert.deepEqual(sanitizeAnalyticsProperties('architecture_review_completed', {
    review_version: '0.1.0', evidence_version: '0.1.0', access_mode: 'preview_tester_v0',
    userId: tester, allowlist: tester, ARCHITECTURE_REVIEW_PREVIEW_TEST_USER_IDS: tester,
    evidence: bundle, result: draft, prompt: 'private', OPENAI_API_KEY: 'test',
  }), { review_version: '0.1.0', evidence_version: '0.1.0', access_mode: 'preview_tester_v0' });
});

test('Preview UI offers sign-in and runnable tester review with paid offer disabled; Production has no tester state', () => {
  const noop = () => undefined;
  const paid: any = { session: { user: { id: tester } }, authLoading: false, access: null, offer: { enabled: false, price: null, includedReviews: null, policyUrls: null },
    previewEnabled: true, previewTester: true, canRun: true, signOut: noop, signIn: noop };
  const render = () => renderToStaticMarkup(React.createElement(ArchitectureReviewStageContent, {
    state: { status: 'idle', result: null, stale: false, errorCode: null }, evidence: bundle, eligible: true, paid,
    lang: 'en', onRun: noop, onLocate: noop, currentTargetKeys: new Set<string>(),
  }));
  const html = render();
  assert.match(html, /Preview test mode/);
  assert.doesNotMatch(html, /disabled=""|Subscribe and unlock|Manage billing/);
  paid.session = null; paid.previewTester = false; paid.canRun = false;
  assert.match(render(), /Email me a sign-in link/);
  paid.previewEnabled = false;
  assert.doesNotMatch(render(), /Preview test mode|Email me a sign-in link/);
});

test('deterministic free core has no provider or tester dependency', () => {
  for (const path of ['lib/graph-json.ts', 'lib/transpiler/validation.ts', 'lib/transpiler/semantic-plan.ts', 'lib/transpiler/crewai.ts', 'hooks/useUnifiedPreflight.ts']) {
    assert.doesNotMatch(readFileSync(path, 'utf8'), /architecture-review|ArchitectureReview|OpenAI|previewTester/);
  }
  assert.ok(evidence().items.length > 0);
  assert.deepEqual(calls, []);
});
