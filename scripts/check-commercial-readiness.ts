import { inspectPaidArchitectureReviewReadiness } from '../lib/paid-architecture-review/config';

const testMode = process.argv.includes('--test-mode');
const readiness = inspectPaidArchitectureReviewReadiness(process.env, { target: testMode ? 'test' : 'production' });
const requireEnabled = process.argv.includes('--require-enabled');
const ready = readiness.configurationReady && (!requireEnabled || readiness.enabledRequested);

const categoryFor = (key: string) => {
  if (key === 'ARCHITECTURE_REVIEW_PAID_ENABLED') return 'FINAL ENABLE SWITCH';
  if (key.includes('SUPABASE')) return 'AUTH READINESS';
  if (key.includes('STRIPE')) return 'STRIPE READINESS';
  if (key.includes('PROVIDER_BUDGET')) return 'PROVIDER BUDGET';
  if (key.includes('WAF')) return 'WAF';
  if (key.includes('POLICY') || key.includes('TERMS_URL') || key.includes('PRIVACY_URL') || key.includes('SUPPORT_URL')) return 'POLICY URLS';
  if (key.includes('FINANCIAL_QA')) return 'FINANCIAL QA';
  if (key.endsWith('_APPROVED')) return 'EXTERNAL OPERATIONAL APPROVALS';
  return 'PRODUCT CONFIG';
};

console.log(ready ? 'READY' : 'BLOCKED');
if (!ready) {
  const issues: Array<{ key: string; code: string }> = [...readiness.issues];
  if (requireEnabled && !readiness.enabledRequested && !readiness.issues.some((issue) => issue.key === 'ARCHITECTURE_REVIEW_PAID_ENABLED')) {
    issues.push({ key: 'ARCHITECTURE_REVIEW_PAID_ENABLED', code: 'enablement_required' });
  }
  const categories = new Map<string, typeof issues>();
  for (const issue of issues) categories.set(categoryFor(issue.key), [...(categories.get(categoryFor(issue.key)) ?? []), issue]);
  for (const [category, categoryIssues] of categories) {
    console.log(`[${category}]`);
    for (const issue of categoryIssues) console.log(`- ${issue.key}: ${issue.code}`);
  }
}

if (!ready) process.exitCode = 1;
