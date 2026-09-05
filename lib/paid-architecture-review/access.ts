import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { PAID_ARCHITECTURE_REVIEW_VERSION, type PaidArchitectureReviewAccess } from '@/types/paid-architecture-review';
import type { PaidArchitectureReviewConfig } from './config';

const disabled = (): PaidArchitectureReviewAccess => ({ version: PAID_ARCHITECTURE_REVIEW_VERSION, state: 'review_disabled', quota: null, cancelAtPeriodEnd: false });

export async function readPaidArchitectureReviewAccess(userId: string, config: PaidArchitectureReviewConfig | null): Promise<PaidArchitectureReviewAccess> {
  if (!config) return disabled();
  const admin = getSupabaseAdmin();
  const { data: entitlement, error } = await admin.from('architecture_review_entitlements').select('*').eq('user_id', userId).maybeSingle();
  if (error) return { version: PAID_ARCHITECTURE_REVIEW_VERSION, state: 'sync_degraded', quota: null, cancelAtPeriodEnd: false };
  if (!entitlement) return { version: PAID_ARCHITECTURE_REVIEW_VERSION, state: 'no_entitlement', quota: null, cancelAtPeriodEnd: false };
  if (entitlement.sync_state !== 'healthy') return { version: PAID_ARCHITECTURE_REVIEW_VERSION, state: 'sync_degraded', quota: null, cancelAtPeriodEnd: entitlement.cancel_at_period_end };
  const now = Date.now();
  if (entitlement.stripe_status !== 'active') return { version: PAID_ARCHITECTURE_REVIEW_VERSION, state: 'billing_blocked', quota: null, cancelAtPeriodEnd: entitlement.cancel_at_period_end };
  if (Date.parse(entitlement.current_period_start) > now || Date.parse(entitlement.current_period_end) <= now) return { version: PAID_ARCHITECTURE_REVIEW_VERSION, state: 'sync_degraded', quota: null, cancelAtPeriodEnd: entitlement.cancel_at_period_end };

  const { data: period, error: periodError } = await admin.from('architecture_review_usage_periods').select('*')
    .eq('user_id', userId).eq('stripe_subscription_id', entitlement.stripe_subscription_id)
    .eq('period_start', entitlement.current_period_start).eq('period_end', entitlement.current_period_end).maybeSingle();
  if (periodError) return { version: PAID_ARCHITECTURE_REVIEW_VERSION, state: 'sync_degraded', quota: null, cancelAtPeriodEnd: entitlement.cancel_at_period_end };
  const limit = period?.quota_limit_snapshot ?? config.includedReviews;
  const consumed = period?.consumed_count ?? 0;
  const reserved = period?.reserved_count ?? 0;
  const quota = { limit, consumed, reserved, remaining: Math.max(0, limit - consumed - reserved), periodEnd: entitlement.current_period_end };
  return {
    version: PAID_ARCHITECTURE_REVIEW_VERSION,
    state: quota.remaining === 0 ? 'quota_exhausted' : entitlement.cancel_at_period_end ? 'active_canceling' : 'active',
    quota,
    cancelAtPeriodEnd: entitlement.cancel_at_period_end,
  };
}
