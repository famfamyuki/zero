import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { sourceFiles } from './harness-state.mjs';

// A fast, deliberately bounded signature check, not a full-history scanner.
export function secretKinds(text) {
  const signatures = [
    ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
    ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
    ['stripe-secret', /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{20,}\b/],
    ['openai-key', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/],
    ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
    ['supabase-secret', /\bsb_secret_[A-Za-z0-9_-]{20,}\b/],
  ];
  return signatures.filter(([, pattern]) => pattern.test(text)).map(([kind]) => kind);
}

export function scanSecrets(root) {
  const findings = [];
  for (const file of sourceFiles(root)) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    const stat = lstatSync(path);
    if (stat.isSymbolicLink() || !stat.isFile()) {
      findings.push({ file, kind: 'unsupported-file-type' }); continue;
    }
    if (stat.size > 5 * 1024 * 1024) {
      findings.push({ file, kind: 'file-too-large-for-local-scan' }); continue;
    }
    for (const kind of secretKinds(readFileSync(path, 'utf8'))) findings.push({ file, kind });
  }
  return findings;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const findings = scanSecrets(process.cwd());
    if (findings.length) {
      console.error('Secret check failed (paths and categories only; no matching values):');
      for (const finding of findings) console.error(JSON.stringify(finding));
      process.exitCode = 1;
    } else console.log('Local source secret-signature check passed; ignored files and Git history were not scanned.');
  } catch {
    console.error('Secret check could not complete. Treat this as a failure, not a clean scan.');
    process.exitCode = 1;
  }
}
