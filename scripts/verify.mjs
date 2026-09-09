import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint, preflight, isolatedCheckEnv } from './harness-state.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const recordPath = join(root, '.harness', 'verification.json');
const steps = [
  ['npm run secrets:check', ['scripts/check-secrets.mjs']],
  ['npm run docs:check', ['scripts/check-docs.mjs']],
  ['npm test', ['scripts/run-tests.mjs']],
  ['npm run typecheck', ['node_modules/typescript/bin/tsc', '--noEmit']],
  ['npm run build', ['node_modules/next/dist/bin/next', 'build']],
];
mkdirSync(dirname(recordPath), { recursive: true });
const record = { schemaVersion: 1, kind: 'implementation-self-check', status: 'running', startedAt: new Date().toISOString(), environment: null, sourceFingerprint: null, checks: [], independentQA: 'not-performed', browser: 'run npm run test:e2e separately', externalEvaluation: 'not-performed' };
const save = () => writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n');
save(); // Invalidate any previous successful record before starting.
try {
  // null means Unknown until this run successfully collects the value.
  record.environment = preflight(root);
  record.sourceFingerprint = fingerprint(root);
  save();
  if (record.environment.node !== record.environment.expectedNode) throw new Error('Use the exact Node version in .node-version.');
  const env = isolatedCheckEnv(root);
  for (const [command, args] of steps) {
    console.log(command);
    const started = Date.now();
    const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', timeout: 20 * 60 * 1000, env });
    record.checks.push({ command, exitCode: result.status, signal: result.signal, durationMs: Date.now() - started });
    save();
    if (result.error || result.status !== 0) throw new Error('Verification step failed; see command output.');
  }
  if (fingerprint(root) !== record.sourceFingerprint) throw new Error('Source changed during verification; rerun on the final source.');
  record.status = 'passed';
} catch (error) {
  record.status = 'failed';
  console.error(error.message);
  process.exitCode = 1;
} finally {
  record.finishedAt = new Date().toISOString();
  save();
  console.log('Local evidence: .harness/verification.json (not independent QA).');
}
