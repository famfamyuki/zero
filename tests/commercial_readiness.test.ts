import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
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
  ARCHITECTURE_REVIEW_COMMERCIAL_HOSTING_APPROVED: 'true',
  ARCHITECTURE_REVIEW_COMMERCIAL_OPERATIONS_APPROVED: 'true',
  ARCHITECTURE_REVIEW_SUPABASE_AUTH_APPROVED: 'true',
};

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

test('commercial readiness CLI supports pre-enable and enabled-production modes', () => {
  const baseEnv = { ...process.env, ...completeEnv };
  const preEnable = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/check-commercial-readiness.ts'],
    { env: baseEnv, encoding: 'utf8' },
  );
  assert.equal(preEnable.status, 0, preEnable.stderr);
  assert.match(preEnable.stdout, /"status": "ready"/);
  assert.match(preEnable.stdout, /"mode": "pre-enable"/);
  assert.match(preEnable.stdout, /"enabledRequested": false/);

  const disabledProduction = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/check-commercial-readiness.ts', '--require-enabled'],
    { env: baseEnv, encoding: 'utf8' },
  );
  assert.equal(disabledProduction.status, 1);
  assert.match(disabledProduction.stdout, /"status": "blocked"/);

  const enabledProduction = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/check-commercial-readiness.ts', '--require-enabled'],
    { env: { ...baseEnv, ARCHITECTURE_REVIEW_PAID_ENABLED: 'true' }, encoding: 'utf8' },
  );
  assert.equal(enabledProduction.status, 0, enabledProduction.stderr);
  assert.match(enabledProduction.stdout, /"status": "ready"/);
  assert.match(enabledProduction.stdout, /"enabledRequested": true/);
});
