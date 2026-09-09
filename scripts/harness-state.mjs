import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readlinkSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd();
}

export function sourceFiles(root) {
  return [...new Set(git(root, ['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean))].sort();
}

export function isolatedCheckEnv(root, source = process.env) {
  if (readdirSync(root).some((file) => /^\.env(?:$|\.)/.test(file) && file !== '.env.example')) {
    throw new Error('Use a clean verification worktree without .env files; do not delete your development credentials.');
  }
  const env = Object.fromEntries(Object.entries(source).filter(([key]) => !/KEY|SECRET|TOKEN|SUPABASE|STRIPE|OPENAI|ARCHITECTURE_REVIEW|APP_BASE_URL/i.test(key)));
  env.ARCHITECTURE_REVIEW_PAID_ENABLED = 'false';
  env.NEXT_TELEMETRY_DISABLED = '1';
  return env;
}

// Hash actual bytes, including unstaged/new files; do not write to Git's index.
// A local comparison aid, not a signed QA approval or a Git tree object.
export function fingerprint(root) {
  const hash = createHash('sha256');
  for (const file of sourceFiles(root)) {
    const path = join(root, file);
    hash.update(JSON.stringify(file));
    if (!existsSync(path)) { hash.update('deleted\0'); continue; }
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) { hash.update('symlink\0' + readlinkSync(path)); continue; }
    if (!stat.isFile()) throw new Error('Non-file Git entry requires manual verification');
    hash.update(String(stat.mode & 0o111));
    hash.update(createHash('sha256').update(readFileSync(path)).digest());
  }
  return hash.digest('hex');
}

export function preflight(cwd) {
  const root = git(cwd, ['rev-parse', '--show-toplevel']);
  const expectedNode = readFileSync(join(root, '.node-version'), 'utf8').trim();
  const head = git(root, ['rev-parse', 'HEAD']);
  let cachedMain = null;
  let ahead = null;
  let behind = null;
  try {
    cachedMain = git(root, ['rev-parse', 'refs/remotes/origin/main']);
    [ahead, behind] = git(root, ['rev-list', '--left-right', '--count', 'HEAD...refs/remotes/origin/main']).split(/\s+/).map(Number);
  } catch { /* A clone without origin/main remains explicitly unknown. */ }
  const dirty = Boolean(git(root, ['status', '--porcelain', '--untracked-files=normal']));
  const warnings = [];
  if (dirty) warnings.push('Existing changes: inspect ownership; never automatically reset, stash, clean, or overwrite.');
  if (behind) warnings.push('HEAD lacks cached main commits: establish the authorized base before implementation.');
  if (process.versions.node !== expectedNode) warnings.push('Node differs from .node-version: use the pinned runtime before claiming reproducible verification.');
  if (!cachedMain) warnings.push('No cached origin/main; current main is unknown.');
  return { observedAt: new Date().toISOString(), root, head, branch: git(root, ['branch', '--show-current']) || '(detached)', cachedMain, mainFreshness: 'cached-only; this command never contacts GitHub', ahead, behind, dirty, node: process.versions.node, expectedNode, packetIndex: 'docs/roadmap/PROGRAM_BOARD.md#packet-index', warnings };
}
