import { inspectPaidArchitectureReviewReadiness } from '../lib/paid-architecture-review/config';

const readiness = inspectPaidArchitectureReviewReadiness(process.env);
const requireEnabled = process.argv.includes('--require-enabled');
const ready = readiness.configurationReady && (!requireEnabled || readiness.enabledRequested);

console.log(ready ? 'READY' : 'BLOCKED');
if (!ready) {
  for (const issue of readiness.issues) console.log(`- ${issue.key}: ${issue.code}`);
  if (requireEnabled && !readiness.enabledRequested && !readiness.issues.some((issue) => issue.key === 'ARCHITECTURE_REVIEW_PAID_ENABLED')) {
    console.log('- ARCHITECTURE_REVIEW_PAID_ENABLED: enablement_required');
  }
}

if (!ready) process.exitCode = 1;
