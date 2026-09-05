import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { ProviderUsageMetadata } from '@/types/paid-architecture-review';

export function isExpectedFinalState(actual: unknown, expected: 'consumed' | 'released'): actual is 'consumed' | 'released' {
  return actual === expected;
}

export async function reservePaidReview(input: {
  userId: string; requestId: string; quotaLimit: number; reviewVersion: string; evidenceVersion: string;
  reviewerVersion: string; providerId: string; modelId: string; preflightCostMicroUsd: number; costProfileVersion: string;
}) {
  const { data, error } = await getSupabaseAdmin().rpc('reserve_architecture_review', {
    p_user_id: input.userId, p_request_id: input.requestId, p_quota_limit: input.quotaLimit,
    p_review_version: input.reviewVersion, p_evidence_version: input.evidenceVersion,
    p_reviewer_version: input.reviewerVersion, p_provider_id: input.providerId, p_model_id: input.modelId,
    p_preflight_cost_estimate_micro_usd: input.preflightCostMicroUsd, p_cost_profile_version: input.costProfileVersion,
  });
  if (error || !data?.[0]) throw new Error('quota_reservation_unavailable');
  return data[0].outcome;
}
export async function markPaidReviewProviderStarted(userId: string, requestId: string) {
  const { data, error } = await getSupabaseAdmin().rpc('mark_architecture_review_provider_started', { p_user_id: userId, p_request_id: requestId });
  if (error || !data) throw new Error('provider_start_accounting_unavailable');
}

export async function finalizePaidReview(input: {
  userId: string; requestId: string; state: 'consumed' | 'released'; outcome: string; failureCategory: string | null;
  usage?: ProviderUsageMetadata; postCallCostMicroUsd?: number | null; costEstimateStatus?: 'estimated' | 'unknown';
}) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { data, error } = await getSupabaseAdmin().rpc('finalize_architecture_review_attempt', {
      p_user_id: input.userId, p_request_id: input.requestId, p_terminal_state: input.state,
      p_provider_outcome: input.outcome, p_failure_category: input.failureCategory,
      p_input_tokens: input.usage?.inputTokens ?? null, p_output_tokens: input.usage?.outputTokens ?? null,
      p_total_tokens: input.usage?.totalTokens ?? null, p_post_call_cost_estimate_micro_usd: input.postCallCostMicroUsd ?? null,
      p_cost_estimate_status: input.costEstimateStatus ?? null,
    });
    if (!error && isExpectedFinalState(data, input.state)) return data;
    lastError = error ?? new Error('unexpected_finalize_state');
  }
  throw lastError instanceof Error ? lastError : new Error('accounting_unavailable');
}
