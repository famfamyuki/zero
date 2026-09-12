import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const currentConsumers = [
  'docs/roadmap/EXECUTION_GATES.md',
  'docs/roadmap/RISK_REGISTER.md',
];

const legacyAuthority = 'ENGINEERING_EXECUTION_GOVERNANCE';
const failures = currentConsumers.filter((path) =>
  readFileSync(resolve(repoRoot, path), 'utf8').includes(legacyAuthority),
);

if (failures.length > 0) {
  console.error('Current authorities must cite DEVELOPMENT_RULES directly:');
  for (const path of failures) console.error(`- ${path}`);
  process.exit(1);
}

console.log('Current authority reference check passed.');
