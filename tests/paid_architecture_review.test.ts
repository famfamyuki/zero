import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { estimateActualCostMicroUsd, estimateWorstCaseCostMicroUsd, parsePaidArchitectureReviewConfig } from '../lib/paid-architecture-review/config';
import { readBearerToken } from '../lib/paid-architecture-review/auth';
import { sanitizeAnalyticsProperties } from '../lib/analytics-config';

const completeEnv: Record<string, string | undefined> = {
  ARCHITECTURE_REVIEW_PAID_ENABLED: 'true', STRIPE_SECRET_KEY: 'test', STRIPE_WEBHOOK_SECRET: 'test',
  STRIPE_ARCHITECTURE_REVIEW_PRICE_ID: 'price_test', STRIPE_BILLING_PORTAL_CONFIGURATION_ID: 'bpc_test',
  SUPABASE_SERVICE_ROLE_KEY: 'test', NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-test', OPENAI_API_KEY: 'test',
  ARCHITECTURE_REVIEW_MODEL: 'model-reviewed', ARCHITECTURE_REVIEW_COST_PROFILE_MODEL: 'model-reviewed',
  ARCHITECTURE_REVIEW_INCLUDED_REVIEWS: '3', ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES: '100000',
  ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS: '2000', ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD: '500000',
  ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS: '2000000',
  ARCHITECTURE_REVIEW_OUTPUT_MICRO_USD_PER_MILLION_TOKENS: '8000000',
  ARCHITECTURE_REVIEW_TERMS_URL: 'https://example.com/terms', ARCHITECTURE_REVIEW_PRIVACY_URL: 'https://example.com/privacy',
  ARCHITECTURE_REVIEW_SUPPORT_URL: 'https://example.com/support',
  ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED: 'true',
  ARCHITECTURE_REVIEW_COMMERCIAL_OPERATIONS_APPROVED: 'true',
  ARCHITECTURE_REVIEW_SUPABASE_AUTH_APPROVED: 'true',
};

test('paid review is disabled by default and every commercial/cost dependency fails closed', () => {
  assert.equal(parsePaidArchitectureReviewConfig({}), null);
  assert.ok(parsePaidArchitectureReviewConfig(completeEnv));
  for (const key of Object.keys(completeEnv)) {
    if (key === 'ARCHITECTURE_REVIEW_PAID_ENABLED') continue;
    const missing = { ...completeEnv };
    delete missing[key];
    assert.equal(parsePaidArchitectureReviewConfig(missing), null, key);
  }
  assert.equal(parsePaidArchitectureReviewConfig({ ...completeEnv, ARCHITECTURE_REVIEW_INCLUDED_REVIEWS: '0' }), null);
  assert.equal(parsePaidArchitectureReviewConfig({ ...completeEnv, ARCHITECTURE_REVIEW_INCLUDED_REVIEWS: '3.5' }), null);
  assert.equal(parsePaidArchitectureReviewConfig({ ...completeEnv, ARCHITECTURE_REVIEW_COST_PROFILE_MODEL: 'other-model' }), null);
  assert.equal(parsePaidArchitectureReviewConfig({ ...completeEnv, ARCHITECTURE_REVIEW_TERMS_URL: 'http://example.com' }), null);
});

test('cost guard uses conservative byte upper bound and integer micro-USD accounting', () => {
  const config = parsePaidArchitectureReviewConfig(completeEnv)!;
  assert.equal(estimateWorstCaseCostMicroUsd(100, config), 16_200);
  assert.equal(estimateActualCostMicroUsd(100, 50, config), 600);
  assert.equal(estimateActualCostMicroUsd(null, 50, config), null);
  assert.equal(estimateWorstCaseCostMicroUsd(Number.MAX_SAFE_INTEGER, config), null);
});

test('bearer parsing accepts only one bounded token and never trusts body identity', () => {
  assert.equal(readBearerToken(new Request('https://example.test')), null);
  assert.equal(readBearerToken(new Request('https://example.test', { headers: { authorization: 'Basic nope' } })), null);
  assert.equal(readBearerToken(new Request('https://example.test', { headers: { authorization: 'Bearer token-value' } })), 'token-value');
  assert.equal(readBearerToken(new Request('https://example.test', { headers: { authorization: 'Bearer one two' } })), null);
});

test('migration provides additive RLS tables, atomic quota, one-in-flight, stale recovery, and idempotent finalize', () => {
  const sql = readFileSync('supabase/migrations/20260826190000_architecture_review_paid_access_v0.sql', 'utf8');
  for (const table of ['billing_customers','architecture_review_entitlements','architecture_review_usage_periods','architecture_review_usage_attempts','stripe_webhook_events']) assert.match(sql, new RegExp(`create table if not exists public\\.${table}`));
  assert.equal((sql.match(/enable row level security/g) ?? []).length, 5);
  assert.match(sql, /architecture_review_one_reserved_per_user[\s\S]*where state = 'reserved'/);
  assert.match(sql, /consumed_count \+ reserved_count <= quota_limit_snapshot/);
  assert.match(sql, /reservation_expires_at <= now\(\)/);
  assert.match(sql, /stale_before_provider/);
  assert.match(sql, /unknown_after_provider_start/);
  assert.match(sql, /if v_attempt\.state <> 'reserved' then return v_attempt\.state/);
  assert.match(sql, /revoke all on function public\.reserve_architecture_review[\s\S]*from public,anon,authenticated/);
  assert.doesNotMatch(sql, /workflow_json|evidence_payload|prompt_text|provider_response|customer_email/);
});

test('review hot path enforces auth, idempotency, entitlement, reservation, cost guard, start, consume/release in order', () => {
  const route = readFileSync('app/api/architecture-review/route.ts', 'utf8');
  const body = route.slice(route.indexOf('export async function POST'));
  const ordered = ['parsePaidArchitectureReviewConfig','authenticatePaidRequest','idempotency-key','readPaidArchitectureReviewAccess','reservePaidReview','maxProviderInputBytes','markPaidReviewProviderStarted','reviewer.review','assembleArchitectureReviewResult','state: \'consumed\''].map((needle) => body.indexOf(needle));
  assert.ok(ordered.every((index) => index >= 0));
  assert.deepEqual([...ordered].sort((a,b)=>a-b), ordered);
  assert.match(route, /state: 'released'/);
  assert.match(route, /request_cost_limit_exceeded/);
  assert.match(route, /accounting_unavailable/);
  assert.doesNotMatch(route, /getStripe|subscriptions\.retrieve/);
});

test('billing routes preserve subscription/template separation and webhook reconciliation is deduplicated', () => {
  const checkout = readFileSync('app/api/billing/architecture-review/checkout/route.ts', 'utf8');
  const template = readFileSync('app/api/checkout/route.ts', 'utf8');
  const webhook = readFileSync('app/api/webhook/route.ts', 'utf8');
  assert.match(checkout, /mode: 'subscription'/);
  assert.match(checkout, /quantity: 1/);
  assert.match(checkout, /Idempotency-Key|idempotency-key/);
  assert.doesNotMatch(checkout, /trial_period_days|allow_promotion_codes: true|mode: 'payment'/);
  assert.match(template, /mode: 'payment'/);
  assert.match(webhook, /session\.mode === 'payment'/);
  assert.match(webhook, /stripe_webhook_events/);
  assert.match(webhook, /reconcileArchitectureReviewSubscription/);
  assert.doesNotMatch(webhook, /console\.|JSON\.stringify\(event|request\.json/);
});

test('paid analytics strip identity, billing IDs, quota IDs, and workflow/provider content', () => {
  const privateData = { email:'x@example.com',user_id:'u',stripe_customer_id:'cus',subscription_id:'sub',price_id:'price',request_id:'r',workflow:'secret',prompt:'secret',result:'secret',model_id:'secret' };
  assert.deepEqual(sanitizeAnalyticsProperties('paid_review_offer_shown',{offer_version:'0.1.0',access_state:'no_entitlement',...privateData}),{offer_version:'0.1.0',access_state:'no_entitlement'});
  assert.deepEqual(sanitizeAnalyticsProperties('paid_review_checkout_started',{offer_version:'0.1.0',...privateData}),{offer_version:'0.1.0'});
});

test('paid UX is scoped to Architecture and preserves free-core, accessibility, responsive and failure language', () => {
  const ui = readFileSync('components/editor/unified-preflight/ArchitectureReviewStageContent.tsx','utf8');
  const translations = readFileSync('lib/i18n/translations.ts','utf8');
  for (const text of ['Email me a sign-in link','Subscribe and unlock Architecture Review','Confirming your subscription','Manage billing','Refresh billing status','Access cannot be verified right now','paid, usage-limited feature']) assert.match(ui,new RegExp(text));
  assert.match(ui,/autoComplete="email"/);
  assert.match(ui,/aria-live="polite"/);
  assert.match(ui,/min-h-11/);
  assert.match(translations,/zeroCostBadge: 'Free Core'/);
  assert.match(translations,/zeroCostBadge: '無料コア機能'/);
  assert.doesNotMatch(translations,/100% Free Tool/);
});
