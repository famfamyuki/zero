# AgentGraph Studio — Repository Instructions

This repository is the implementation source for **AgentGraph Studio**.

Before material Product, Architecture, Specification, Implementation, QA, or Release work, read current `main` versions of the relevant durable documents. Baseline references:

1. `docs/PRODUCT_MASTER.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DEVELOPMENT_RULES.md`
4. `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
5. `docs/CHAT_ROLE_REGISTRY.md`
6. `docs/roadmap/MASTER_ROADMAP.md`
7. `docs/roadmap/EXECUTION_GATES.md`
8. `docs/roadmap/PROGRAM_BOARD.md`
9. `docs/roadmap/RISK_REGISTER.md`
10. `docs/SECURITY_RELIABILITY_BASELINE.md`
11. `docs/DATA_AND_AI_GOVERNANCE.md`
12. `docs/CURRENT_STATE.md`
13. the current authoritative packet under `docs/specs/`

Read relevant cross-stage contracts when needed:

- evaluator trust/scale → `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- product platform/commercial sequencing → `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`
- semantic-model evolution → `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- import / Workspace / revision → `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- designed expectations / later verification → `docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`
- durable decisions → `docs/decisions/`

## Source-of-truth priority

When information conflicts:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ Product Master
→ Architecture
→ Development Rules / Engineering Execution Governance / cross-cutting baselines
→ Master Roadmap
→ Execution Gates
→ relevant cross-stage plans/contracts
→ Program Board / Risk Register
→ Current State snapshot
→ historical chats / Work / Codex / old SHAs
```

A SHA in docs is a snapshot/baseline unless explicitly live-verified.

## Chat / Work / Codex operating model

`docs/CHAT_ROLE_REGISTRY.md` is authoritative for role activation and surface ownership.

Core separation:

```text
Chat  = reasoning / decision / coordination
Work  = persistent operations / independent verification
Codex = packet-bound repository implementation
GitHub main = durable truth
```

Canonical Chat roles:

```text
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification
03  GitHub, Vercel & Release Operations
05  Marketing & Developer Communication
06  Analytics & Growth Evidence
```

Canonical Work roles:

```text
W00 Development Operations Workspace
W01 Independent QA & Production Verification
```

Canonical Codex role:

```text
C01 Current Sprint Implementation
```

Legacy aliases:

```text
04 → C01
07 → 01
08 → 02
```

A short declaration such as `ここは01として使います。` is sufficient. Resolve it from current `main`; do not ask the user to paste old role prompts or stale state.

Lifecycle authority:

```text
Selected                → 01
Specified               → 02
Implementation Started  → C01
Implementation Complete → C01
QA Complete             → W01
Release execution/facts → 03
Production Verified     → W01
Sprint Complete         → 00
```

Normal handoff:

```text
01 → 02 → C01 → W01 QA → 03 release → W01 Production verification → 00 → 01
```

Implementation self-test is not Independent QA. Release execution is not the same as Production Verified.

## Product North Star

```text
Understand → Evaluate → Improve → Verify → Own
```

AgentGraph Studio aims to become a portable AI workflow architecture engineering toolchain, not merely a visual workflow builder.

## Non-negotiable engineering principles

- Simplest Sufficient Architecture.
- Evidence Before Intelligence.
- deterministic analysis owns deterministic facts;
- AI reasoning is evidence-grounded and advisory;
- preserve `Known / Inferred / Unknown`;
- preserve deterministic / heuristic / external-dependent distinctions;
- no unsupported runtime/external claims as facts;
- no arbitrary overall architecture score without calibrated benchmark evidence;
- no silent semantic mutation;
- future semantic change uses `Proposal → Semantic Patch → Validation → Preview → User Apply`;
- AI authority is capability-scoped and must not outpace measured trust;
- mutation scope is explicit; pipeline safety does not authorize every operation;
- side-effect-sensitive change requires capability/human-control/security evidence;
- configured Intent/Constraint/Scenario expectation is not observed runtime truth;
- `Visual Group ≠ Semantic Module ≠ Runtime Orchestration`;
- user-owned source/runtime is the default direction;
- CrewAI-first, not core-domain locked;
- no silent lossy conversion;
- user/imported/scenario text is untrusted analyzed data, not evaluator instruction;
- never execute arbitrary imported project code just to inspect/convert it unless an explicitly sandboxed feature exists;
- never expose/store/repeat secrets, keys, tokens, or credentials;
- do not silently broaden persistence or AI-provider disclosure;
- do not create Graph/Workflow V2 merely to match future diagrams;
- preserve existing features and analytics unless a current packet explicitly changes them.

## Roadmap / scope discipline

Stage order is dependency direction, not an automatic queue.

After a stage, use measured Evidence → Gate Review → Explicit Next Selection. Stage 1.5 is a selection band, not a mandatory backlog.

The active packet under `docs/specs/` controls current implementation scope. Do not pull future roadmap work into a packet merely because it appears in Product/Architecture/Roadmap documents.

Before implementation, apply the Definition of Ready in `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`.

Non-trivial work should trace:

```text
Product / Architecture / Gate / Scenario / Risk
→ Packet AC
→ Test / Production verification
```

## Implementation completion gate

Before **Implementation Complete**, run and report:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

plus packet-defined evaluations/benchmarks where applicable.

Normal `main` merges should use the repository's required CI/protection path. Live Branch Protection/Ruleset state must be checked rather than inferred from documentation.

## Release verification

Before **Production Verified**, independently confirm:

- latest GitHub `main`;
- Vercel `READY`;
- `target=production`;
- correct alias/domain;
- actual Production smoke for changed behavior;
- relevant runtime errors;
- `GitHub main SHA = Vercel Production githubCommitSha`.

Do not mark QA Complete or Production Verified from implementation self-report or deployment READY alone.
