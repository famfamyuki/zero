import OpenAI from 'openai';
import { architectureReviewRequestSchema } from '@/lib/architecture-review/schemas';
import { validateArchitectureEvidence } from '@/lib/architecture-review/evidence-validation';
import { OpenAIArchitectureReviewer } from '@/lib/architecture-review/providers/openai';
import { assembleArchitectureReviewResult, InvalidReviewerOutputError } from '@/lib/architecture-review/result-validation';
import { createReviewerEnvelope } from '@/lib/architecture-review/reviewer-envelope';
import { ARCHITECTURE_REVIEWER_INSTRUCTION, createArchitectureReviewerDataEnvelope } from '@/lib/architecture-review/prompt';
import { ARCHITECTURE_REVIEW_EVIDENCE_VERSION, ARCHITECTURE_REVIEW_RESULT_VERSION, ARCHITECTURE_REVIEWER_VERSION, type ArchitectureReviewErrorCode } from '@/types/architecture-review';
import { authenticatePaidRequest } from '@/lib/paid-architecture-review/auth';
import { estimateActualCostMicroUsd, estimateWorstCaseCostMicroUsd, parsePaidArchitectureReviewConfig } from '@/lib/paid-architecture-review/config';
import { paidJson } from '@/lib/paid-architecture-review/http';
import { readPaidArchitectureReviewAccess } from '@/lib/paid-architecture-review/access';
import { finalizePaidReview, markPaidReviewProviderStarted, reservePaidReview } from '@/lib/paid-architecture-review/quota';
import { ZodError } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_BYTES = 512*1024;
const TIMEOUT_MS = 45_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const failure = (status: number, error: ArchitectureReviewErrorCode) => paidJson({ version: '0.1.0', error }, { status });

export async function POST(request: Request) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BYTES) return failure(413, 'input_too_large');
  let text: string;
  try { text = await request.text(); } catch { return failure(400, 'invalid_request'); }
  if (new TextEncoder().encode(text).byteLength > MAX_BYTES) return failure(413, 'input_too_large');

  const config = parsePaidArchitectureReviewConfig();
  if (!config) return failure(503, 'review_disabled');
  let user;
  try { user = await authenticatePaidRequest(request); } catch { return failure(503, 'entitlement_unavailable'); }
  if (!user) return failure(401, 'authentication_required');
  const requestId = request.headers.get('idempotency-key');
  if (!requestId) return failure(400, 'idempotency_key_required');
  if (!UUID.test(requestId)) return failure(400, 'invalid_idempotency_key');

  let json: unknown;
  try { json = JSON.parse(text); } catch { return failure(400, 'invalid_request'); }
  if (typeof json === 'object' && json !== null && 'version' in json && (json as { version?: unknown }).version !== '0.1.0') return failure(400, 'unsupported_contract_version');
  const parsed = architectureReviewRequestSchema.safeParse(json);
  if (!parsed.success) return failure(400, 'invalid_request');
  const evidence = validateArchitectureEvidence(parsed.data.evidence);
  if (!evidence) return failure(422, 'invalid_evidence');

  const access = await readPaidArchitectureReviewAccess(user.id, config);
  if (access.state === 'no_entitlement') return failure(403, 'paid_entitlement_required');
  if (access.state === 'billing_blocked') return failure(403, 'billing_inactive');
  if (access.state === 'sync_degraded') return failure(503, 'entitlement_unavailable');
  if (access.state === 'quota_exhausted') return failure(429, 'quota_exhausted');
  if (access.state === 'review_disabled') return failure(503, 'review_disabled');

  const { providerInput } = createReviewerEnvelope(evidence);
  const providerEnvelopeBytes = new TextEncoder().encode(JSON.stringify({ instruction: ARCHITECTURE_REVIEWER_INSTRUCTION, data: createArchitectureReviewerDataEnvelope(providerInput, parsed.data.locale) })).byteLength;
  const worstCaseCost = estimateWorstCaseCostMicroUsd(providerEnvelopeBytes, config);
  if (worstCaseCost === null) return failure(503, 'review_disabled');
  let reserved = false;
  const release = async (outcome: string, category: string) => {
    if (!reserved) return;
    try { await finalizePaidReview({ userId: user.id, requestId, state: 'released', outcome, failureCategory: category }); } catch { /* stale recovery safely releases credit */ }
  };

  try {
    const outcome = await reservePaidReview({
      userId: user.id, requestId, quotaLimit: config.includedReviews,
      reviewVersion: ARCHITECTURE_REVIEW_RESULT_VERSION, evidenceVersion: ARCHITECTURE_REVIEW_EVIDENCE_VERSION,
      reviewerVersion: ARCHITECTURE_REVIEWER_VERSION, providerId: 'openai', modelId: config.modelId,
      preflightCostMicroUsd: worstCaseCost, costProfileVersion: `micro-usd-per-million:${config.costProfileModelId}`,
    });
    if (outcome === 'reserved') return failure(409, 'review_in_progress');
    if (outcome === 'consumed') return failure(409, 'review_already_completed');
    if (outcome === 'released') return failure(409, 'review_attempt_closed');
    if (outcome === 'quota_exhausted') return failure(429, 'quota_exhausted');
    if (outcome === 'billing_inactive') return failure(403, 'billing_inactive');
    if (outcome === 'entitlement_unavailable') return failure(503, 'entitlement_unavailable');
    if (outcome !== 'new') return failure(503, 'accounting_unavailable');
    reserved = true;
  } catch {
    return failure(503, 'accounting_unavailable');
  }

  if (providerEnvelopeBytes > config.maxProviderInputBytes || worstCaseCost > config.maxWorstCaseCostMicroUsd) {
    await release('request_cost_limit_exceeded', 'request_cost_limit_exceeded');
    return failure(422, 'request_cost_limit_exceeded');
  }

  const reviewer = new OpenAIArchitectureReviewer(undefined, config.modelId, config.maxOutputTokens);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    await markPaidReviewProviderStarted(user.id, requestId);
    const draft = await reviewer.review({ evidence, locale: parsed.data.locale }, { signal: controller.signal });
    const result = assembleArchitectureReviewResult(draft, evidence, { providerId: reviewer.providerId, modelId: reviewer.model, locale: parsed.data.locale });
    const actualCost = estimateActualCostMicroUsd(reviewer.usage.inputTokens, reviewer.usage.outputTokens, config);
    try {
      await finalizePaidReview({ userId: user.id, requestId, state: 'consumed', outcome: 'valid_result', failureCategory: null, usage: reviewer.usage, postCallCostMicroUsd: actualCost, costEstimateStatus: actualCost === null ? 'unknown' : 'estimated' });
    } catch {
      return failure(503, 'accounting_unavailable');
    }
    return paidJson({ version: '0.1.0', result });
  } catch (error) {
    if (error instanceof InvalidReviewerOutputError || error instanceof ZodError || error instanceof SyntaxError || (error instanceof Error && error.message === 'invalid_reviewer_output')) {
      await release('invalid_reviewer_output', 'invalid_reviewer_output'); return failure(502, 'invalid_reviewer_output');
    }
    if (controller.signal.aborted) { await release('provider_timeout', 'provider_timeout'); return failure(504, 'provider_timeout'); }
    if (error instanceof OpenAI.RateLimitError) { await release('rate_limited', 'rate_limited'); return failure(429, 'rate_limited'); }
    if (error instanceof OpenAI.APIError) { await release('provider_error', 'provider_error'); return failure(502, 'provider_error'); }
    if (error instanceof Error && error.message === 'provider_start_accounting_unavailable') { await release('accounting_unavailable', 'provider_start_accounting_unavailable'); return failure(503, 'accounting_unavailable'); }
    await release('provider_error', 'provider_error'); return failure(502, 'provider_error');
  } finally {
    clearTimeout(timeout);
  }
}
