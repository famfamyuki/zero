import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const requiredPaths = [
  'AGENTS.md',
  '.github/workflows/ci.yml',
  'docs/README.md',
  'docs/PRODUCT_MASTER.md',
  'docs/ARCHITECTURE.md',
  'docs/DEVELOPMENT_RULES.md',
  'docs/ENGINEERING_EXECUTION_GOVERNANCE.md',
  'docs/CHAT_ROLE_REGISTRY.md',
  'docs/CURRENT_STATE.md',
  'docs/SECURITY_RELIABILITY_BASELINE.md',
  'docs/DATA_AND_AI_GOVERNANCE.md',
  'docs/roadmap/MASTER_ROADMAP.md',
  'docs/roadmap/EXECUTION_GATES.md',
  'docs/roadmap/PROGRAM_BOARD.md',
  'docs/roadmap/RISK_REGISTER.md',
  'docs/roadmap/EVALUATION_TRUST_AND_SCALE.md',
  'docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md',
  'docs/roadmap/MONETIZATION_ARCHITECTURE.md',
  'docs/architecture/SEMANTIC_MODEL_EVOLUTION.md',
  'docs/architecture/IMPORT_WORKSPACE_CONTRACT.md',
  'docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md',
  'docs/decisions/README.md',
  'docs/specs',
];

const failures = [];

for (const relativePath of requiredPaths) {
  if (!existsSync(join(repoRoot, relativePath))) {
    failures.push(`Missing required path: ${relativePath}`);
  }
}

const docsReadmePath = join(repoRoot, 'docs/README.md');
if (existsSync(docsReadmePath)) {
  const docsReadme = readFileSync(docsReadmePath, 'utf8');
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(docsReadme)) !== null) {
    const rawTarget = match[1].trim();
    if (
      !rawTarget ||
      rawTarget.startsWith('#') ||
      rawTarget.startsWith('http://') ||
      rawTarget.startsWith('https://') ||
      rawTarget.startsWith('mailto:')
    ) {
      continue;
    }

    const targetWithoutAnchor = rawTarget.split('#')[0].split('?')[0];
    if (!targetWithoutAnchor) continue;

    const resolvedTarget = normalize(resolve(dirname(docsReadmePath), targetWithoutAnchor));
    if (!resolvedTarget.startsWith(repoRoot)) {
      failures.push(`README link escapes repository root: ${rawTarget}`);
      continue;
    }

    if (!existsSync(resolvedTarget)) {
      failures.push(`Broken docs/README.md link: ${rawTarget}`);
    }
  }
}

const specsDir = join(repoRoot, 'docs/specs');
if (existsSync(specsDir) && statSync(specsDir).isDirectory()) {
  const packets = readdirSync(specsDir).filter((name) => name.endsWith('.md'));
  if (packets.length === 0) {
    failures.push('docs/specs must contain at least one authoritative packet while CURRENT_STATE declares a current packet.');
  }
}

const developmentRulesPath = join(repoRoot, 'docs/DEVELOPMENT_RULES.md');
if (existsSync(developmentRulesPath)) {
  const developmentRules = readFileSync(developmentRulesPath, 'utf8');
  const requiredLifecycleTerms = [
    'Selected',
    'Specified',
    'Implementation Started',
    'Implementation Complete',
    'QA Complete',
    'Production Verified',
    'Sprint Complete',
  ];

  for (const term of requiredLifecycleTerms) {
    if (!developmentRules.includes(term)) {
      failures.push(`Development Rules missing lifecycle term: ${term}`);
    }
  }

  for (const command of ['npm run docs:check', 'npm test', 'npm run typecheck', 'npm run build']) {
    if (!developmentRules.includes(command)) {
      failures.push(`Development Rules missing required verification command: ${command}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Documentation integrity check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Documentation integrity check passed.');
