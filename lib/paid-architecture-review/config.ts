import { ARCHITECTURE_REVIEW_PLAN_KEY } from '@/types/paid-architecture-review';

export interface PaidArchitectureReviewConfig {
  enabled: true;
  planKey: typeof ARCHITECTURE_REVIEW_PLAN_KEY;
  stripePriceId: string;
  portalConfigurationId: string;
  includedReviews: number;
  modelId: string;
  costProfileModelId: string;
  maxProviderInputBytes: number;
  maxOutputTokens: number;
  maxWorstCaseCostMicroUsd: number;
  inputMicroUsdPerMillionTokens: number;
  outputMicroUsdPerMillionTokens: number;
  termsUrl: string;
  privacyUrl: string;
  supportUrl: string;
}

const positiveInteger = (value: string | undefined): number | null => {
  if (!value || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const publicHttpsUrl = (value: string | undefined): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

export function parsePaidArchitectureReviewConfig(
  env: Record<string, string | undefined> = process.env,
  options: { allowDisabled?: boolean } = {},
): PaidArchitectureReviewConfig | null {
  if (!options.allowDisabled && env.ARCHITECTURE_REVIEW_PAID_ENABLED !== 'true') return null;

  const includedReviews = positiveInteger(env.ARCHITECTURE_REVIEW_INCLUDED_REVIEWS);
  const maxProviderInputBytes = positiveInteger(env.ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES);
  const maxOutputTokens = positiveInteger(env.ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS);
  const maxWorstCaseCostMicroUsd = positiveInteger(env.ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD);
  const inputMicroUsdPerMillionTokens = positiveInteger(env.ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS);
  const outputMicroUsdPerMillionTokens = positiveInteger(env.ARCHITECTURE_REVIEW_OUTPUT_MICRO_USD_PER_MILLION_TOKENS);
  const termsUrl = publicHttpsUrl(env.ARCHITECTURE_REVIEW_TERMS_URL);
  const privacyUrl = publicHttpsUrl(env.ARCHITECTURE_REVIEW_PRIVACY_URL);
  const supportUrl = publicHttpsUrl(env.ARCHITECTURE_REVIEW_SUPPORT_URL);
  const modelId = env.ARCHITECTURE_REVIEW_MODEL;
  const costProfileModelId = env.ARCHITECTURE_REVIEW_COST_PROFILE_MODEL;

  if (
    !env.STRIPE_SECRET_KEY || !env.STRIPE_ARCHITECTURE_REVIEW_PRICE_ID
    || !env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID || !env.STRIPE_WEBHOOK_SECRET
    || !env.SUPABASE_SERVICE_ROLE_KEY || !env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || !env.OPENAI_API_KEY || !modelId || !costProfileModelId || modelId !== costProfileModelId
    || !includedReviews || !maxProviderInputBytes || !maxOutputTokens
    || !maxWorstCaseCostMicroUsd || !inputMicroUsdPerMillionTokens || !outputMicroUsdPerMillionTokens
    || !termsUrl || !privacyUrl || !supportUrl
    || env.ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED !== 'true'
    || env.ARCHITECTURE_REVIEW_COMMERCIAL_OPERATIONS_APPROVED !== 'true'
    || env.ARCHITECTURE_REVIEW_SUPABASE_AUTH_APPROVED !== 'true'
  ) return null;

  return {
    enabled: true,
    planKey: ARCHITECTURE_REVIEW_PLAN_KEY,
    stripePriceId: env.STRIPE_ARCHITECTURE_REVIEW_PRICE_ID,
    portalConfigurationId: env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID,
    includedReviews,
    modelId,
    costProfileModelId,
    maxProviderInputBytes,
    maxOutputTokens,
    maxWorstCaseCostMicroUsd,
    inputMicroUsdPerMillionTokens,
    outputMicroUsdPerMillionTokens,
    termsUrl,
    privacyUrl,
    supportUrl,
  };
}

export function estimateWorstCaseCostMicroUsd(
  providerEnvelopeBytes: number,
  config: Pick<PaidArchitectureReviewConfig, 'maxOutputTokens' | 'inputMicroUsdPerMillionTokens' | 'outputMicroUsdPerMillionTokens'>,
): number | null {
  if (!Number.isSafeInteger(providerEnvelopeBytes) || providerEnvelopeBytes < 0) return null;
  // One UTF-8 byte per token is deliberately conservative and cannot under-estimate tokens.
  const inputCost = Math.ceil((providerEnvelopeBytes * config.inputMicroUsdPerMillionTokens) / 1_000_000);
  const outputCost = Math.ceil((config.maxOutputTokens * config.outputMicroUsdPerMillionTokens) / 1_000_000);
  const total = inputCost + outputCost;
  return Number.isSafeInteger(total) ? total : null;
}

export function estimateActualCostMicroUsd(
  inputTokens: number | null,
  outputTokens: number | null,
  config: Pick<PaidArchitectureReviewConfig, 'inputMicroUsdPerMillionTokens' | 'outputMicroUsdPerMillionTokens'>,
): number | null {
  if (inputTokens === null || outputTokens === null || inputTokens < 0 || outputTokens < 0) return null;
  const total = Math.ceil((inputTokens * config.inputMicroUsdPerMillionTokens + outputTokens * config.outputMicroUsdPerMillionTokens) / 1_000_000);
  return Number.isSafeInteger(total) ? total : null;
}
