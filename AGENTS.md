# AgentGraph Studio — Repository Instructions

This repository is the implementation source for **AgentGraph Studio**.

Before material Product, Architecture, Specification, Implementation, QA, or Release work, read current `main` versions of the relevant durable documents.

Baseline references:

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
- monetization/pricing/paid launch/commercial validation → `docs/roadmap/MONETIZATION_ARCHITECTURE.md`
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
→ historical Chat / Work / Codex / old SHAs
```

A SHA in docs is a snapshot/baseline unless explicitly live-verified.

## Development operating model

`docs/CHAT_ROLE_REGISTRY.md` is authoritative.

Current development-only model uses exactly five canonical lanes:

```text
Chat:
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification

Codex:
C01 Current Sprint Implementation

Work:
W01 Independent QA & Production Verification
```

Core separation:

```text
GitHub main = durable truth
Chat        = Product / specification / coordination reasoning
Codex       = packet-bound repository implementation
Work        = independent verification when independence matters
```

There is no permanent canonical `03`, `04`, `05`, `06`, or `W00` in development-only focus mode.

Complex repository/document work may use Work mode under the existing `00`, `01`, or `02` authority; using Work does not create a W00 role.

Lifecycle authority:

```text
Selected                → 01
Specified               → 02
Implementation Started  → C01
Implementation Complete → C01
QA Complete             → W01
normal merge/release    → C01 after W01 QA of the same revision
Production Verified     → W01
Sprint Complete         → 00
```

Normal handoff:

```text
01 → 02 → C01 → W01 QA → C01 release → W01 Production verification → 00 → 01
```

If implementation/behavior changes after QA Complete, re-run independent QA before release.

A short role declaration such as `ここは01として使います。` is sufficient. Resolve it from current `main`; do not ask for old prompts or stale state.

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

After a stage use:

```text
Evidence → Gate Review → Explicit Next Selection
```

Stage 1.5 is a selection band, not a mandatory backlog.

Commercial Validation Gate M0 is likewise evidence-driven. Paid entitlement/cost control does not by itself prove recurring value, and commercial conversion must not expand AI authority. Use `docs/roadmap/MONETIZATION_ARCHITECTURE.md` for paid-value, price/quota, unit-economics, and paid-expansion decisions.

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

Normal `main` merges must use the required repository CI/protection path. Live Branch Protection/Ruleset state must be checked rather than inferred from docs.

## Independent QA and release

Implementation self-test is not Independent QA.

`W01` performs pre-release independent QA. After QA Complete, `C01` may merge/release only the same approved revision. Any behavior-changing fix invalidates that QA approval and returns to W01.

Before **Production Verified**, W01 independently confirms:

- latest GitHub `main`;
- released code corresponds to the QA-approved change set;
- Vercel `READY`;
- `target=production`;
- correct alias/domain;
- actual Production smoke for changed behavior;
- relevant runtime errors;
- `GitHub main SHA = Vercel Production githubCommitSha`.

Do not mark QA Complete or Production Verified from implementation self-report or deployment READY alone.

## Context policy

- `00`, `01`, `02` may be long-lived while role context stays clean;
- prefer a fresh `C01` Codex task per packet/material PR;
- prefer a fresh `W01` Work session per packet/release cycle;
- replace a long-lived chat when stale Sprints/SHAs or unrelated work interfere with GitHub-grounded reasoning;
- do not recreate every lane on a fixed schedule.

## Dormant/noncanonical work

Marketing/SNS/analytics/growth are not canonical persistent development lanes during the current focus period. If temporarily needed, use task-specific conversations first. Add a durable role only when repeated evidence shows a genuine independent authority/context boundary.
