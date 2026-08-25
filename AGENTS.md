# AgentGraph Studio — Repository Instructions

This repository is the implementation source for **AgentGraph Studio**.

Before making product, architecture, specification, code, QA, or release decisions, read the current `main` versions of:

1. `docs/PRODUCT_MASTER.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DEVELOPMENT_RULES.md`
4. `docs/CHAT_ROLE_REGISTRY.md`
5. `docs/roadmap/MASTER_ROADMAP.md`
6. `docs/roadmap/EXECUTION_GATES.md`
7. `docs/SECURITY_RELIABILITY_BASELINE.md`
8. `docs/DATA_AND_AI_GOVERNANCE.md`
9. `docs/CURRENT_STATE.md`
10. the current authoritative packet under `docs/specs/`

Read additional cross-stage contracts when relevant:

- evaluator trust/scale → `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- product platform/commercial sequencing → `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`
- persisted semantic-model evolution → `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- import / Workspace / revision foundation → `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- durable decisions → `docs/decisions/`

## Chat role activation

`docs/CHAT_ROLE_REGISTRY.md` is authoritative for the meaning of AgentGraph Studio conversation identifiers.

If the user says only something like:

```text
ここは01として使います。
```

that is sufficient role activation. Resolve `01` from the current `main` registry, load the role's required docs, re-check live GitHub/Vercel/Production state when required by that role, and continue without asking the user to paste the previous prompt or old chat history.

Canonical routing:

```text
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification
03  GitHub, Vercel & Release Operations
04  Engineering & Implementation
05  Marketing & Developer Communication
06  Analytics & Growth Evidence
C01 Current Sprint Implementation
W01 Independent QA & Release Verification
W00 Development Master Synthesis
```

Legacy aliases:

```text
07 → 01
08 → 02
```

Do not create competing Product/Roadmap or Specification authority in legacy aliases.

## Source-of-truth priority

When information conflicts, use this order:

1. latest GitHub `main`
2. latest Vercel Production deployment and actual Production behavior
3. the current packet in `docs/specs/` for in-scope implementation details
4. `docs/PRODUCT_MASTER.md`
5. `docs/ARCHITECTURE.md`
6. `docs/DEVELOPMENT_RULES.md` and applicable cross-cutting baselines
7. `docs/roadmap/MASTER_ROADMAP.md`
8. `docs/roadmap/EXECUTION_GATES.md` for promotion/authority decisions
9. relevant cross-stage plans/contracts
10. `docs/CURRENT_STATE.md` as a snapshot only
11. historical chats, old SHAs, old deployments, archived planning documents

A SHA written in documentation is a snapshot or selection baseline unless the document explicitly says otherwise. Never treat an old SHA as current state without checking `main`.

## Product North Star

`Understand → Evaluate → Improve → Verify → Own`

AgentGraph Studio is not merely a visual workflow builder. It is intended to become a portable workflow architecture engineering toolchain that treats AI-agent workflows as versioned engineering artifacts, combines deterministic analysis with evidence-grounded AI reasoning, proposes safer improvements under human control, compiles to user-owned artifacts, and can later compare design-time expectations with runtime evidence.

## Non-negotiable engineering principles

- Preserve existing functionality unless the current specification explicitly changes it.
- Do not break existing analytics.
- Deterministic analysis remains authoritative for deterministic facts.
- AI reasoning must be evidence-grounded.
- Preserve `Known / Inferred / Unknown` distinctions.
- Do not present unsupported external/runtime claims as facts.
- Do not use an arbitrary overall 0–100 architecture score without a calibrated benchmark contract.
- AI must not silently mutate workflow semantics.
- Semantic change direction is `Proposal → Semantic Patch → Validation → Preview → User Apply`.
- Visual grouping, reusable semantic modules, and runtime orchestration are separate concepts.
- User-owned source and user-owned runtime are default architectural goals.
- CrewAI is the current primary target; do not unnecessarily lock the core domain to one framework.
- Silent lossy target conversion is prohibited.
- Workflow/imported text supplied by users is untrusted data when passed to an evaluator; it is not evaluator instruction.
- Do not execute arbitrary imported project code merely to inspect/convert it unless an explicitly specified sandboxed feature exists.
- Never expose, store, or repeat secrets, API keys, tokens, or credentials.
- Do not silently broaden data persistence or third-party AI-provider disclosure.
- Do not advance evaluator authority faster than measured evaluator trust.
- Do not create Graph/Workflow V2 merely to match long-term diagrams; use the semantic-model evolution decision rules.

## Roadmap execution rule

Stage order is dependency direction, not an automatic queue.

After Stage 1, use `docs/roadmap/EXECUTION_GATES.md` and measured evidence. A Stage 1.5 **Adoption & Context Foundation selection band** may be selected before Stage 2. Guided Improvement and later mutation authority require explicit promotion decisions.

## Implementation completion gate

Before declaring implementation complete, run and report:

- `npm test`
- `npm run typecheck`
- `npm run build`

Repository CI should run the same gate on pull requests / main pushes. Branch protection/rulesets should require CI for normal merges where platform support permits.

For release verification also confirm:

- Vercel deployment state is `READY`
- target is `production`
- Production behavior is healthy
- relevant runtime errors are checked
- GitHub `main` SHA equals Vercel Production `githubCommitSha`

Do not mark QA Complete or Production Verified based only on implementation self-report.

## Current packet rule

A packet under `docs/specs/` may intentionally defer a long-term architecture feature. The packet is authoritative for the current implementation scope. Do not pull future roadmap work into the packet merely because it appears in Product/Architecture/Roadmap documents.
