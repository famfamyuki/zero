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

export type PaidArchitectureReviewReadinessIssueCode =
  | 'missing_configuration'
  | 'invalid_positive_integer'
  | 'invalid_https_url'
  | 'model_cost_profile_mismatch'
  | 'approval_required';

export interface PaidArchitectureReviewReadinessIssue {
  key: string;
  code: PaidArchitectureReviewReadinessIssueCode;
}

export interface PaidArchitectureReviewReadinessReport {
  enabledRequested: boolean;
  configurationReady: boolean;
  issues: readonly PaidArchitectureReviewReadinessIssue[];
  config: PaidArchitectureReviewConfig | null;
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

const pushMissing = (
  issues: PaidArchitectureReviewReadinessIssue[],
  env: Record<string, string | undefined>,
  key: string,
) => {
  if (!env[key]) issues.push({ key, code: 'missing_configuration' });
};

const pushPositiveIntegerIssue = (
  issues: PaidArchitectureReviewReadinessIssue[],
  env: Record<string, string | undefined>,
  key: string,
): number | null => {
  const value = positiveInteger(env[key]);
  if (!value) issues.push({ key, code: env[key] ? 'invalid_positive_integer' : 'missing_configuration' });
  return value;
};

const pushHttpsUrlIssue = (
  issues: PaidArchitectureReviewReadinessIssue[],
  env: Record<string, string | undefined>,
  key: string,
): string | null => {
  const value = publicHttpsUrl(env[key]);
  if (!value) issues.push({ key, code: env[key] ? 'invalid_https_url' : 'missing_configuration' });
  return value;
};

export function inspectPaidArchitectureReviewReadiness(
  env: Record<string, string | undefined> = process.env,
): PaidArchitectureReviewReadinessReport {
  const issues: PaidArchitectureReviewReadinessIssue[] = [];

  for (const key of [
    'STRIPE_SECRET_KEY',
    'STRIPE_ARCHITECTURE_REVIEW_PRICE_ID',
    'STRIPE_BILLING_PORTAL_CONFIGURATION_ID',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY',
    'ARCHITECTURE_REVIEW_MODEL',
    'ARCHITECTURE_REVIEW_COST_PROFILE_MODEL',
  ]) pushMissing(issues, env, key);

  const includedReviews = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_INCLUDED_REVIEWS');
  const maxProviderInputBytes = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES');
  const maxOutputTokens = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS');
  const maxWorstCaseCostMicroUsd = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD');
  const inputMicroUsdPerMillionTokens = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS');
  const outputMicroUsdPerMillionTokens = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_OUTPUT_MICRO_USD_PER_MILLION_TOKENS');
  const termsUrl = pushHttpsUrlIssue(issues, env, 'ARCHITECTURE_REVIEW_TERMS_URL');
  const privacyUrl = pushHttpsUrlIssue(issues, env, 'ARCHITECTURE_REVIEW_PRIVACY_URL');
  const supportUrl = pushHttpsUrlIssue(issues, env, 'ARCHITECTURE_REVIEW_SUPPORT_URL');

  const modelId = env.ARCHITECTURE_REVIEW_MODEL;
  const costProfileModelId = env.ARCHITECTURE_REVIEW_COST_PROFILE_MODEL;
  if (modelId && costProfileModelId && modelId !== costProfileModelId) {
    issues.push({ key: 'ARCHITECTURE_REVIEW_COST_PROFILE_MODEL', code: 'model_cost_profile_mismatch' });
  }

  for (const key of [
    'ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED',
    'ARCHITECTURE_REVIEW_COMMERCIAL_OPERATIONS_APPROVED',
    'ARCHITECTURE_REVIEW_SUPABASE_AUTH_APPROVED',
  ]) {
    if (env[key] !== 'true') issues.push({ key, code: 'approval_required' });
  }

  const configurationReady = issues.length === 0;
  const config = configurationReady
    ? {
        enabled: true as const,
        planKey: ARCHITECTURE_REVIEW_PLAN_KEY,
        stripePriceId: env.STRIPE_ARCHITECTURE_REVIEW_PRICE_ID!,
        portalConfigurationId: env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID!,
        includedReviews: includedReviews!,
        modelId: modelId!,
        costProfileModelId: costProfileModelId!,
        maxProviderInputBytes: maxProviderInputBytes!,
        maxOutputTokens: maxOutputTokens!,
        maxWorstCaseCostMicroUsd: maxWorstCaseCostMicroUsd!,
        inputMicroUsdPerMillionTokens: inputMicroUsdPerMillionTokens!,
        outputMicroUsdPerMillionTokens: outputMicroUsdPerMillionTokens!,
        termsUrl: termsUrl!,
        privacyUrl: privacyUrl!,
        supportUrl: supportUrl!,
      }
    : null;

  return {
    enabledRequested: env.ARCHITECTURE_REVIEW_PAID_ENABLED === 'true',
    configurationReady,
    issues,
    config,
  };
}

export function parsePaidArchitectureReviewConfig(
  env: Record<string, string | undefined> = process.env,
  options: { allowDisabled?: boolean } = {},
): PaidArchitectureReviewConfig | null {
  const readiness = inspectPaidArchitectureReviewReadiness(env);
  if (!options.allowDisabled && !readiness.enabledRequested) return null;
  return readiness.config;
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
