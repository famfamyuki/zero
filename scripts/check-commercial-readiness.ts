import { inspectPaidArchitectureReviewReadiness } from '../lib/paid-architecture-review/config';

const readiness = inspectPaidArchitectureReviewReadiness(process.env);
const requireEnabled = process.argv.includes('--require-enabled');
const ready = readiness.configurationReady && (!requireEnabled || readiness.enabledRequested);

const report = {
  status: ready ? 'ready' : 'blocked',
  mode: requireEnabled ? 'enabled-production' : 'pre-enable',
  enabledRequested: readiness.enabledRequested,
  configurationReady: readiness.configurationReady,
  issues: readiness.issues,
};

console.log(JSON.stringify(report, null, 2));

if (!ready) process.exitCode = 1;
