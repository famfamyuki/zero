import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, isAbsolute } from 'node:path';
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

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : [];
  });
}

for (const markdownPath of [
  join(repoRoot, 'AGENTS.md'),
  join(repoRoot, 'README.md'),
  ...markdownFiles(join(repoRoot, 'docs')),
  ...(existsSync(join(repoRoot, '.agents/skills')) ? markdownFiles(join(repoRoot, '.agents/skills')) : []),
]) {
  const markdown = readFileSync(markdownPath, 'utf8').replace(/```[^\n]*\n[\s\S]*?```/g, '');
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
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

    const resolvedTarget = resolve(dirname(markdownPath), targetWithoutAnchor);
    const fromRoot = relative(repoRoot, resolvedTarget);
    if (fromRoot === '..' || fromRoot.startsWith('../') || fromRoot.startsWith('..\\') || isAbsolute(fromRoot)) {
      failures.push(`Markdown link escapes repository root in ${relative(repoRoot, markdownPath)}: ${rawTarget}`);
      continue;
    }

    if (!existsSync(resolvedTarget)) {
      failures.push(`Broken link in ${relative(repoRoot, markdownPath)}: ${rawTarget}`);
    }
  }
}

const boardPath = join(repoRoot, 'docs/roadmap/PROGRAM_BOARD.md');
if (existsSync(boardPath)) {
  for (const match of readFileSync(boardPath, 'utf8').matchAll(/`(AGS-[A-Z0-9-]+)`/g)) {
    if (!existsSync(join(repoRoot, 'docs/specs', `${match[1]}.md`))) {
      failures.push(`Program Board references missing packet: ${match[1]}`);
    }
  }
}

const specsDir = join(repoRoot, 'docs/specs');
if (existsSync(specsDir) && statSync(specsDir).isDirectory()) {
  const packets = readdirSync(specsDir).filter((name) => name.endsWith('.md'));
  if (packets.length === 0) {
    failures.push('docs/specs must contain at least one authoritative packet while Program Board declares packet routing.');
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

  const preservedSemanticGroups = [
    ['Known / Inferred / Unknown'],
    ['Proposal', 'Semantic Patch', 'Validation', 'Preview', 'User Apply'],
    ['Stage 1.5'],
    ['Commercial Validation'],
    ['Pure documentation maintenance fast path'],
  ];

  for (const group of preservedSemanticGroups) {
    const missing = group.filter((term) => !developmentRules.includes(term));
    if (missing.length > 0) {
      failures.push(`Development Rules missing preserved governance semantic terms: ${missing.join(', ')}`);
    }
  }
}

const governancePointerPath = join(repoRoot, 'docs/ENGINEERING_EXECUTION_GOVERNANCE.md');
if (existsSync(governancePointerPath)) {
  const pointer = readFileSync(governancePointerPath, 'utf8');
  if (!pointer.includes('Compatibility pointer') || !pointer.includes('DEVELOPMENT_RULES.md')) {
    failures.push('Engineering Execution Governance must remain an explicit compatibility pointer to Development Rules.');
  }
}

const agentsPath = join(repoRoot, 'AGENTS.md');
if (existsSync(agentsPath)) {
  const agentLines = readFileSync(agentsPath, 'utf8').split(/\r?\n/).length;
  if (agentLines > 180) {
    console.warn(`AGENTS.md has ${agentLines} lines; review whether router detail has started duplicating durable authorities.`);
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
