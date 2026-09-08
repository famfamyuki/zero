import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fingerprint, preflight, isolatedCheckEnv } from '../scripts/harness-state.mjs';
import { scanSecrets, secretKinds } from '../scripts/check-secrets.mjs';

function fixture(run: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), 'ags-harness-'));
  try {
    execFileSync('git', ['init', '--quiet'], { cwd: root });
    writeFileSync(join(root, '.node-version'), process.versions.node + '\n');
    writeFileSync(join(root, '.gitignore'), '.harness/\n.env.local\n');
    writeFileSync(join(root, 'source.txt'), 'first\n');
    execFileSync('git', ['add', '.'], { cwd: root });
    execFileSync('git', ['-c', 'user.name=Harness Test', '-c', 'user.email=harness@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture'], { cwd: root });
    run(root);
  } finally {
    // root is exclusively the concrete directory returned by mkdtemp above.
    rmSync(root, { recursive: true, force: true });
  }
}

test('preflight reports a detached dirty checkout with missing cached main without changing Git state', () => fixture((root) => {
  execFileSync('git', ['checkout', '--detach', '--quiet'], { cwd: root });
  writeFileSync(join(root, 'source.txt'), 'changed');
  const before = fingerprint(root);
  const result = preflight(root);
  assert.equal(result.cachedMain, null);
  assert.equal(result.branch, '(detached)');
  assert.equal(result.dirty, true);
  assert.equal(fingerprint(root), before);
}));

test('source fingerprint changes for unstaged/new/deleted files but not ignored evidence', () => fixture((root) => {
  const before = fingerprint(root);
  mkdirSync(join(root, '.harness'));
  writeFileSync(join(root, '.harness/verification.json'), '{}');
  assert.equal(fingerprint(root), before);
  writeFileSync(join(root, 'new.txt'), 'new');
  const added = fingerprint(root);
  assert.notEqual(added, before);
  writeFileSync(join(root, 'source.txt'), 'changed');
  const changed = fingerprint(root);
  assert.notEqual(changed, added);
  rmSync(join(root, 'source.txt'));
  assert.notEqual(fingerprint(root), changed);
}));

test('secret signatures report categories without returning synthetic credential values', () => {
  const synthetic = ['sk', 'live', 'A'.repeat(30)].join('_');
  assert.deepEqual(secretKinds(synthetic), ['stripe-secret']);
  assert.equal(JSON.stringify(secretKinds(synthetic)).includes(synthetic), false);
  assert.deepEqual(secretKinds('STRIPE_SECRET_KEY=\nOPENAI_API_KEY=\n'), []);
});

test('normal verification strips service credentials and refuses dotenv-loaded environments', () => fixture((root) => {
  const env = isolatedCheckEnv(root, { NODE_ENV: 'test', PATH: 'test-path', OPENAI_API_KEY: 'fixture', STRIPE_SECRET_KEY: 'fixture', ARCHITECTURE_REVIEW_PAID_ENABLED: 'true' });
  assert.equal(env.PATH, 'test-path');
  assert.equal(env.OPENAI_API_KEY, undefined);
  assert.equal(env.STRIPE_SECRET_KEY, undefined);
  assert.equal(env.ARCHITECTURE_REVIEW_PAID_ENABLED, 'false');
  writeFileSync(join(root, '.env.local'), '');
  assert.throws(() => isolatedCheckEnv(root), /clean verification worktree/);
}));

test('scanner catches new untracked credentials, excludes ignored files, and does not leak values', () => fixture((root) => {
  const synthetic = ['ghp', 'B'.repeat(36)].join('_');
  writeFileSync(join(root, '.env.local'), synthetic);
  assert.deepEqual(scanSecrets(root), []);
  writeFileSync(join(root, 'accidental.txt'), synthetic);
  assert.deepEqual(scanSecrets(root), [{ file: 'accidental.txt', kind: 'github-token' }]);
  assert.equal(JSON.stringify(scanSecrets(root)).includes(synthetic), false);
}));

function verificationFixture(root: string, failing: boolean, drift = false) {
  mkdirSync(join(root, 'scripts'));
  copyFileSync('scripts/verify.mjs', join(root, 'scripts/verify.mjs'));
  copyFileSync('scripts/harness-state.mjs', join(root, 'scripts/harness-state.mjs'));
  for (const file of ['check-secrets.mjs', 'check-docs.mjs', 'run-tests.mjs']) {
    writeFileSync(join(root, 'scripts', file), failing && file === 'check-docs.mjs' ? 'process.exit(7);' : 'process.exit(0);');
  }
  mkdirSync(join(root, 'node_modules/typescript/bin'), { recursive: true });
  mkdirSync(join(root, 'node_modules/next/dist/bin'), { recursive: true });
  writeFileSync(join(root, 'node_modules/typescript/bin/tsc'), 'process.exit(0);');
  writeFileSync(join(root, 'node_modules/next/dist/bin/next'), drift ? "require('node:fs').writeFileSync('source.txt','changed during build');" : 'process.exit(0);');
  return spawnSync(process.execPath, ['scripts/verify.mjs'], { cwd: root, encoding: 'utf8' });
}

test('verification fails fast and replaces an old pass with failure evidence', () => fixture((root) => {
  mkdirSync(join(root, '.harness'));
  writeFileSync(join(root, '.harness/verification.json'), JSON.stringify({ status: 'passed' }));
  const result = verificationFixture(root, true);
  assert.equal(result.status, 1);
  const record = JSON.parse(readFileSync(join(root, '.harness/verification.json'), 'utf8'));
  assert.equal(record.status, 'failed');
  assert.equal(record.checks.length, 2);
  assert.equal(record.checks[1].exitCode, 7);
}));

test('verification rejects source changes made while checks are running', () => fixture((root) => {
  const result = verificationFixture(root, false, true);
  assert.equal(result.status, 1);
  const record = JSON.parse(readFileSync(join(root, '.harness/verification.json'), 'utf8'));
  assert.equal(record.checks.length, 5);
  assert.equal(record.status, 'failed');
}));

test('verification never calls matching sources independent QA', () => fixture((root) => {
  const result = verificationFixture(root, false);
  assert.equal(result.status, 0);
  const record = JSON.parse(readFileSync(join(root, '.harness/verification.json'), 'utf8'));
  assert.equal(record.status, 'passed');
  assert.equal(record.independentQA, 'not-performed');
  assert.equal(record.sourceFingerprint, fingerprint(root));
}));
