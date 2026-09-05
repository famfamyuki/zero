export const PAID_ARCHITECTURE_REVIEW_VERSION = '0.1.0' as const;
export const ARCHITECTURE_REVIEW_PLAN_KEY = 'architecture_review_individual_monthly_v0' as const;

export type PaidArchitectureReviewAccessState =
  | 'no_entitlement'
  | 'active'
  | 'active_canceling'
  | 'quota_exhausted'
  | 'billing_blocked'
  | 'sync_degraded'
  | 'review_disabled';

export interface PaidArchitectureReviewQuota {
  limit: number;
  consumed: number;
  reserved: number;
  remaining: number;
  periodEnd: string;
}
export interface PaidArchitectureReviewAccess {
  version: typeof PAID_ARCHITECTURE_REVIEW_VERSION;
  state: PaidArchitectureReviewAccessState;
  quota: PaidArchitectureReviewQuota | null;
  cancelAtPeriodEnd: boolean;
}

export type UsageAttemptReplay =
  | 'reserved'
  | 'consumed'
  | 'released'
  | 'quota_exhausted'
  | 'billing_inactive'
  | 'entitlement_unavailable';

export interface ProviderUsageMetadata {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
}
