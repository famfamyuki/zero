import { ARCHITECTURE_REVIEW_PLAN_KEY } from '@/types/paid-architecture-review';

export interface PaidArchitectureReviewConfig {
  enabled: true;
  planKey: typeof ARCHITECTURE_REVIEW_PLAN_KEY;
  stripePriceId: string;
  portalConfigurationId: string;
  stripeMode: 'test' | 'live';
  priceCurrency: 'usd';
  priceUnitAmount: number;
  stripeTaxEnabled: boolean;
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
  providerBudgetWarningMicroUsd: number;
  providerBudgetCriticalMicroUsd: number;
  providerBudgetHardCeilingMicroUsd: number;
}

export type PaidArchitectureReviewReadinessIssueCode =
  | 'missing_configuration'
  | 'invalid_positive_integer'
  | 'invalid_boolean'
  | 'invalid_identifier'
  | 'invalid_https_url'
  | 'invalid_enum'
  | 'invalid_price_contract'
  | 'invalid_launch_configuration'
  | 'invalid_budget_thresholds'
  | 'stripe_mode_mismatch'
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

const configuredValue = (value: string | undefined): string | null => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const isPrivateHostname = (hostname: string) => {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (normalized === 'localhost' || normalized === '::1' || normalized.endsWith('.local')) return true;
  const parts = normalized.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 || parts[0] === 169 && parts[1] === 254
    || parts[0] === 192 && parts[1] === 168 || parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
};

const publicHttpsUrl = (value: string | undefined): string | null => {
  const normalized = configuredValue(value);
  if (!normalized) return null;
  try {
    const url = new URL(normalized);
    return url.protocol === 'https:' && !url.username && !url.password && !isPrivateHostname(url.hostname)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

const pushMissing = (
  issues: PaidArchitectureReviewReadinessIssue[],
  env: Record<string, string | undefined>,
  key: string,
) => {
  if (!configuredValue(env[key])) issues.push({ key, code: 'missing_configuration' });
};

const pushIdentifierIssue = (
  issues: PaidArchitectureReviewReadinessIssue[],
  env: Record<string, string | undefined>,
  key: string,
  prefix: string,
) => {
  const value = configuredValue(env[key]);
  if (!value) issues.push({ key, code: 'missing_configuration' });
  else if (!value.startsWith(prefix) || value.length <= prefix.length) issues.push({ key, code: 'invalid_identifier' });
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
  options: { target?: 'test' | 'production' } = {},
): PaidArchitectureReviewReadinessReport {
  const issues: PaidArchitectureReviewReadinessIssue[] = [];
  const target = options.target ?? 'production';

  const enabledValue = configuredValue(env.ARCHITECTURE_REVIEW_PAID_ENABLED);
  if (enabledValue && enabledValue !== 'true' && enabledValue !== 'false') {
    issues.push({ key: 'ARCHITECTURE_REVIEW_PAID_ENABLED', code: 'invalid_boolean' });
  }

  for (const key of [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY',
    'ARCHITECTURE_REVIEW_MODEL',
    'ARCHITECTURE_REVIEW_COST_PROFILE_MODEL',
  ]) pushMissing(issues, env, key);

  pushIdentifierIssue(issues, env, 'STRIPE_ARCHITECTURE_REVIEW_PRICE_ID', 'price_');
  pushIdentifierIssue(issues, env, 'STRIPE_BILLING_PORTAL_CONFIGURATION_ID', 'bpc_');

  const stripeMode = configuredValue(env.ARCHITECTURE_REVIEW_STRIPE_MODE);
  if (stripeMode !== 'test' && stripeMode !== 'live') issues.push({ key: 'ARCHITECTURE_REVIEW_STRIPE_MODE', code: 'invalid_enum' });
  if (target === 'test' && stripeMode !== 'test') issues.push({ key: 'ARCHITECTURE_REVIEW_STRIPE_MODE', code: 'invalid_enum' });
  if (target === 'production' && stripeMode !== 'live') issues.push({ key: 'ARCHITECTURE_REVIEW_STRIPE_MODE', code: 'approval_required' });
  const stripeSecretKey = configuredValue(env.STRIPE_SECRET_KEY);
  if (stripeMode && stripeSecretKey && !stripeSecretKey.startsWith(`sk_${stripeMode}_`) && !stripeSecretKey.startsWith(`rk_${stripeMode}_`)) {
    issues.push({ key: 'STRIPE_SECRET_KEY', code: 'stripe_mode_mismatch' });
  }

  const priceCurrency = configuredValue(env.ARCHITECTURE_REVIEW_PRICE_CURRENCY)?.toLowerCase();
  if (priceCurrency !== 'usd') issues.push({ key: 'ARCHITECTURE_REVIEW_PRICE_CURRENCY', code: 'invalid_price_contract' });
  const priceUnitAmount = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_PRICE_UNIT_AMOUNT');
  if (priceUnitAmount !== null && priceUnitAmount !== 1200) issues.push({ key: 'ARCHITECTURE_REVIEW_PRICE_UNIT_AMOUNT', code: 'invalid_price_contract' });

  const taxEnabled = configuredValue(env.ARCHITECTURE_REVIEW_STRIPE_TAX_ENABLED);
  if (taxEnabled !== 'true') issues.push({ key: 'ARCHITECTURE_REVIEW_STRIPE_TAX_ENABLED', code: 'invalid_boolean' });

  const includedReviews = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_INCLUDED_REVIEWS');
  const maxProviderInputBytes = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES');
  const maxOutputTokens = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS');
  const maxWorstCaseCostMicroUsd = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD');
  const inputMicroUsdPerMillionTokens = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS');
  const outputMicroUsdPerMillionTokens = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_OUTPUT_MICRO_USD_PER_MILLION_TOKENS');
  if (includedReviews !== null && includedReviews !== 10) issues.push({ key: 'ARCHITECTURE_REVIEW_INCLUDED_REVIEWS', code: 'invalid_launch_configuration' });
  const costEnvelope = [maxProviderInputBytes, maxOutputTokens, inputMicroUsdPerMillionTokens, outputMicroUsdPerMillionTokens, maxWorstCaseCostMicroUsd];
  if (costEnvelope.every((value) => value !== null)
    && !(maxProviderInputBytes === 32_768 && maxOutputTokens === 4_096 && inputMicroUsdPerMillionTokens === 4_000_000
      && outputMicroUsdPerMillionTokens === 20_000_000 && maxWorstCaseCostMicroUsd === 250_000)) {
    issues.push({ key: 'ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD', code: 'invalid_launch_configuration' });
  }
  const providerBudgetWarningMicroUsd = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_PROVIDER_BUDGET_WARNING_MICRO_USD');
  const providerBudgetCriticalMicroUsd = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_PROVIDER_BUDGET_CRITICAL_MICRO_USD');
  const providerBudgetHardCeilingMicroUsd = pushPositiveIntegerIssue(issues, env, 'ARCHITECTURE_REVIEW_PROVIDER_BUDGET_HARD_CEILING_MICRO_USD');
  if (providerBudgetWarningMicroUsd !== null && providerBudgetCriticalMicroUsd !== null && providerBudgetHardCeilingMicroUsd !== null
    && !(providerBudgetWarningMicroUsd === 20_000_000 && providerBudgetCriticalMicroUsd === 40_000_000 && providerBudgetHardCeilingMicroUsd === 50_000_000)) {
    issues.push({ key: 'ARCHITECTURE_REVIEW_PROVIDER_BUDGET_HARD_CEILING_MICRO_USD', code: 'invalid_budget_thresholds' });
  }
  const termsUrl = pushHttpsUrlIssue(issues, env, 'ARCHITECTURE_REVIEW_TERMS_URL');
  const privacyUrl = pushHttpsUrlIssue(issues, env, 'ARCHITECTURE_REVIEW_PRIVACY_URL');
  const supportUrl = pushHttpsUrlIssue(issues, env, 'ARCHITECTURE_REVIEW_SUPPORT_URL');
  pushHttpsUrlIssue(issues, env, 'NEXT_PUBLIC_SUPABASE_URL');

  const modelId = configuredValue(env.ARCHITECTURE_REVIEW_MODEL);
  const costProfileModelId = configuredValue(env.ARCHITECTURE_REVIEW_COST_PROFILE_MODEL);
  if (modelId && costProfileModelId && modelId !== costProfileModelId) {
    issues.push({ key: 'ARCHITECTURE_REVIEW_COST_PROFILE_MODEL', code: 'model_cost_profile_mismatch' });
  }

  for (const key of target === 'production' ? [
    'ARCHITECTURE_REVIEW_STRIPE_LIVE_MODE_APPROVED',
    'ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED',
    'ARCHITECTURE_REVIEW_COMMERCIAL_OPERATIONS_APPROVED',
    'ARCHITECTURE_REVIEW_SUPABASE_AUTH_APPROVED',
    'ARCHITECTURE_REVIEW_PROVIDER_BUDGET_APPROVED',
    'ARCHITECTURE_REVIEW_WAF_APPROVED',
    'ARCHITECTURE_REVIEW_COMMERCIAL_POLICY_APPROVED',
    'ARCHITECTURE_REVIEW_FINANCIAL_QA_APPROVED',
  ] : []) {
    if (env[key] !== 'true') issues.push({ key, code: 'approval_required' });
  }

  const configurationReady = issues.length === 0;
  const config = configurationReady
    ? {
        enabled: true as const,
        planKey: ARCHITECTURE_REVIEW_PLAN_KEY,
        stripePriceId: configuredValue(env.STRIPE_ARCHITECTURE_REVIEW_PRICE_ID)!,
        portalConfigurationId: configuredValue(env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID)!,
        stripeMode: stripeMode as 'test' | 'live',
        priceCurrency: priceCurrency as 'usd',
        priceUnitAmount: priceUnitAmount!,
        stripeTaxEnabled: taxEnabled === 'true',
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
        providerBudgetWarningMicroUsd: providerBudgetWarningMicroUsd!,
        providerBudgetCriticalMicroUsd: providerBudgetCriticalMicroUsd!,
        providerBudgetHardCeilingMicroUsd: providerBudgetHardCeilingMicroUsd!,
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
  const target = env.VERCEL_ENV === 'production' ? 'production' : 'test';
  const readiness = inspectPaidArchitectureReviewReadiness(env, { target });
  if (!options.allowDisabled && !readiness.enabledRequested) return null;
  return readiness.config;
}

export function estimateWorstCaseCostMicroUsd(
  providerEnvelopeBytes: number,
  config: Pick<PaidArchitectureReviewConfig, 'maxOutputTokens' | 'inputMicroUsdPerMillionTokens' | 'outputMicroUsdPerMillionTokens'>,
): number | null {
  if (!Number.isSafeInteger(providerEnvelopeBytes) || providerEnvelopeBytes < 0) return null;
  // One UTF-8 byte per token is deliberately conservative and cannot under-estimate tokens.
  const denominator = BigInt(1_000_000);
  const ceilDivide = (numerator: bigint) => (numerator + denominator - BigInt(1)) / denominator;
  const inputCost = ceilDivide(BigInt(providerEnvelopeBytes) * BigInt(config.inputMicroUsdPerMillionTokens));
  const outputCost = ceilDivide(BigInt(config.maxOutputTokens) * BigInt(config.outputMicroUsdPerMillionTokens));
  const total = inputCost + outputCost;
  return total <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(total) : null;
}

export function estimateActualCostMicroUsd(
  inputTokens: number | null,
  outputTokens: number | null,
  config: Pick<PaidArchitectureReviewConfig, 'inputMicroUsdPerMillionTokens' | 'outputMicroUsdPerMillionTokens'>,
): number | null {
  if (inputTokens === null || outputTokens === null || !Number.isSafeInteger(inputTokens) || !Number.isSafeInteger(outputTokens) || inputTokens < 0 || outputTokens < 0) return null;
  const numerator = BigInt(inputTokens) * BigInt(config.inputMicroUsdPerMillionTokens)
    + BigInt(outputTokens) * BigInt(config.outputMicroUsdPerMillionTokens);
  const total = (numerator + BigInt(999_999)) / BigInt(1_000_000);
  return total <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(total) : null;
}
