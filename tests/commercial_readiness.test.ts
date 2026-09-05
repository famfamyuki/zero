import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { inspectPaidArchitectureReviewReadiness } from '../lib/paid-architecture-review/config';

const completeEnv: Record<string, string> = {
  ARCHITECTURE_REVIEW_PAID_ENABLED: 'false',
  STRIPE_SECRET_KEY: 'secret-test-value',
  STRIPE_WEBHOOK_SECRET: 'webhook-test-value',
  STRIPE_ARCHITECTURE_REVIEW_PRICE_ID: 'price_test',
  STRIPE_BILLING_PORTAL_CONFIGURATION_ID: 'bpc_test',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-test-value',
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-test-value',
  OPENAI_API_KEY: 'provider-test-value',
  ARCHITECTURE_REVIEW_MODEL: 'model-reviewed',
  ARCHITECTURE_REVIEW_COST_PROFILE_MODEL: 'model-reviewed',
  ARCHITECTURE_REVIEW_INCLUDED_REVIEWS: '3',
  ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES: '100000',
  ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS: '2000',
  ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD: '500000',
  ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS: '2000000',
  ARCHITECTURE_REVIEW_OUTPUT_MICRO_USD_PER_MILLION_TOKENS: '8000000',
  ARCHITECTURE_REVIEW_TERMS_URL: 'https://example.com/terms',
  ARCHITECTURE_REVIEW_PRIVACY_URL: 'https://example.com/privacy',
  ARCHITECTURE_REVIEW_SUPPORT_URL: 'https://example.com/support',
  ARCHITECTURE_REVIEW_STRIPE_LIVE_MODE_APPROVED: 'true',
  ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED: 'true',
  ARCHITECTURE_REVIEW_COMMERCIAL_OPERATIONS_APPROVED: 'true',
  ARCHITECTURE_REVIEW_SUPABASE_AUTH_APPROVED: 'true',
  ARCHITECTURE_REVIEW_PROVIDER_BUDGET_APPROVED: 'true',
  ARCHITECTURE_REVIEW_WAF_APPROVED: 'true',
  ARCHITECTURE_REVIEW_COMMERCIAL_POLICY_APPROVED: 'true',
  ARCHITECTURE_REVIEW_FINANCIAL_QA_APPROVED: 'true',
};

test('environment template inventories every readiness key, fixes quota at 10, and contains no secrets', () => {
  const template = readFileSync('.env.example', 'utf8');
  for (const key of Object.keys(completeEnv)) assert.match(template, new RegExp(`^${key}=`, 'm'), key);
  for (const key of [
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'OPENAI_API_KEY',
    'STRIPE_ARCHITECTURE_REVIEW_PRICE_ID',
    'STRIPE_BILLING_PORTAL_CONFIGURATION_ID',
  ]) assert.match(template, new RegExp(`^${key}=$`, 'm'), key);
  assert.match(template, /^ARCHITECTURE_REVIEW_INCLUDED_REVIEWS=10$/m);
  assert.match(template, /^ARCHITECTURE_REVIEW_PAID_ENABLED=false$/m);
  assert.doesNotMatch(template, /sk_(?:live|test)_|price_[A-Za-z0-9]|https:\/\/[^\s=]+|\b\d+\.\d+\b/);
});

test('commercial readiness is inspectable before the paid feature is enabled', () => {
  const readiness = inspectPaidArchitectureReviewReadiness(completeEnv);
  assert.equal(readiness.enabledRequested, false);
  assert.equal(readiness.configurationReady, true);
  assert.deepEqual(readiness.issues, []);
  assert.ok(readiness.config);
});

test('commercial readiness names blockers without exposing configured values', () => {
  const env = {
    ...completeEnv,
    ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED: 'false',
    ARCHITECTURE_REVIEW_TERMS_URL: 'http://example.com/terms',
    ARCHITECTURE_REVIEW_INCLUDED_REVIEWS: '0',
    ARCHITECTURE_REVIEW_COST_PROFILE_MODEL: 'other-model',
  };
  const readiness = inspectPaidArchitectureReviewReadiness(env);
  assert.equal(readiness.configurationReady, false);
  assert.deepEqual(readiness.issues, [
    { key: 'ARCHITECTURE_REVIEW_INCLUDED_REVIEWS', code: 'invalid_positive_integer' },
    { key: 'ARCHITECTURE_REVIEW_TERMS_URL', code: 'invalid_https_url' },
    { key: 'ARCHITECTURE_REVIEW_COST_PROFILE_MODEL', code: 'model_cost_profile_mismatch' },
    { key: 'ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED', code: 'approval_required' },
  ]);
  const serialized = JSON.stringify(readiness.issues);
  for (const value of ['secret-test-value', 'webhook-test-value', 'service-role-test-value', 'provider-test-value']) {
    assert.equal(serialized.includes(value), false);
  }
});

test('every required commercial dependency fails closed with a key and code', () => {
  for (const key of Object.keys(completeEnv)) {
    if (key === 'ARCHITECTURE_REVIEW_PAID_ENABLED') continue;
    const env = { ...completeEnv };
    delete env[key];
    const readiness = inspectPaidArchitectureReviewReadiness(env);
    assert.equal(readiness.configurationReady, false, key);
    assert.ok(readiness.issues.some((issue) => issue.key === key), key);
    assert.equal(readiness.config, null, key);
  }
});

test('invalid booleans, identifiers, public URLs, quota and cost bounds fail closed', () => {
  const cases: Array<[string, string, string]> = [
    ['ARCHITECTURE_REVIEW_PAID_ENABLED', 'yes', 'invalid_boolean'],
    ['STRIPE_ARCHITECTURE_REVIEW_PRICE_ID', 'product_not_price', 'invalid_identifier'],
    ['STRIPE_BILLING_PORTAL_CONFIGURATION_ID', 'portal_not_configuration', 'invalid_identifier'],
    ['NEXT_PUBLIC_SUPABASE_URL', 'http://example.supabase.co', 'invalid_https_url'],
    ['ARCHITECTURE_REVIEW_TERMS_URL', 'https://localhost/terms', 'invalid_https_url'],
    ['ARCHITECTURE_REVIEW_PRIVACY_URL', 'https://user:password@example.com/privacy', 'invalid_https_url'],
    ['ARCHITECTURE_REVIEW_INCLUDED_REVIEWS', '0', 'invalid_positive_integer'],
    ['ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES', '1.5', 'invalid_positive_integer'],
    ['ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS', '-1', 'invalid_positive_integer'],
    ['ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD', '9007199254740992', 'invalid_positive_integer'],
    ['ARCHITECTURE_REVIEW_PROVIDER_BUDGET_APPROVED', 'TRUE', 'approval_required'],
  ];
  for (const [key, value, code] of cases) {
    const readiness = inspectPaidArchitectureReviewReadiness({ ...completeEnv, [key]: value });
    assert.equal(readiness.configurationReady, false, key);
    assert.ok(readiness.issues.some((issue) => issue.key === key && issue.code === code), key);
  }
});

test('commercial readiness CLI supports pre-enable and enabled-production modes', () => {
  const baseEnv = { ...process.env, ...completeEnv };
  const preEnable = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/check-commercial-readiness.ts'],
    { env: baseEnv, encoding: 'utf8' },
  );
  assert.equal(preEnable.status, 0, preEnable.stderr);
  assert.equal(preEnable.stdout.trim(), 'READY');

  const disabledProduction = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/check-commercial-readiness.ts', '--require-enabled'],
    { env: baseEnv, encoding: 'utf8' },
  );
  assert.equal(disabledProduction.status, 1);
  assert.match(disabledProduction.stdout, /^BLOCKED/m);
  assert.match(disabledProduction.stdout, /ARCHITECTURE_REVIEW_PAID_ENABLED: enablement_required/);
  assert.match(disabledProduction.stdout, /\[FINAL ENABLE SWITCH\]/);

  const enabledProduction = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/check-commercial-readiness.ts', '--require-enabled'],
    { env: { ...baseEnv, ARCHITECTURE_REVIEW_PAID_ENABLED: 'true' }, encoding: 'utf8' },
  );
  assert.equal(enabledProduction.status, 0, enabledProduction.stderr);
  assert.equal(enabledProduction.stdout.trim(), 'READY');
});
