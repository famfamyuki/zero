# AgentGraph Studio Development Documentation

This directory is the shared durable development knowledge base for Chat, Work, Codex, and human contributors.

## Navigation shortcut

For a lossless responsibility map and task-based smallest sufficient reading paths, use [`DEVELOPMENT_PLAN_MAP.md`](./DEVELOPMENT_PLAN_MAP.md). It is a non-authoritative navigation aid and does not replace or alter any document below.

## Read first

1. [`PRODUCT_MASTER.md`](./PRODUCT_MASTER.md) — final product definition, North Star, durable product principles
2. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — long-term architecture boundaries and evolution
3. [`DEVELOPMENT_RULES.md`](./DEVELOPMENT_RULES.md) — implementation, QA, Git, regression, and release gates
4. [`ENGINEERING_EXECUTION_GOVERNANCE.md`](./ENGINEERING_EXECUTION_GOVERNANCE.md) — Definition of Ready, version lifecycle, traceability, operational-quality maturity, repository/docs enforcement
5. [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md) — authoritative development operating model for Chat / Work / Codex
6. [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md) — authoritative stage sequencing and dependency logic
7. [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md) — stage promotion, evaluator authority, Stage 1.5 selection, safe-transformation/mutation gates
8. [`roadmap/PROGRAM_BOARD.md`](./roadmap/PROGRAM_BOARD.md) — near-term capability/gate/blocker coordination
9. [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md) — durable cross-stage risks
10. [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) — evaluator trust, benchmark quality, scale, Search/Locate/Scoped Evaluation
11. [`roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`](./roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md) — product platform/commercial sequencing
12. [`roadmap/MONETIZATION_ARCHITECTURE.md`](./roadmap/MONETIZATION_ARCHITECTURE.md) — paid value contract, unit economics, pricing evidence, Commercial Validation Gate M0, and paid-launch readiness
13. [`SECURITY_RELIABILITY_BASELINE.md`](./SECURITY_RELIABILITY_BASELINE.md) — platform security/reliability baseline
14. [`DATA_AND_AI_GOVERNANCE.md`](./DATA_AND_AI_GOVERNANCE.md) — data classification, persistence/provider boundaries, evaluator/model governance
15. [`architecture/SEMANTIC_MODEL_EVOLUTION.md`](./architecture/SEMANTIC_MODEL_EVOLUTION.md) — semantic-model migration runway
16. [`architecture/IMPORT_WORKSPACE_CONTRACT.md`](./architecture/IMPORT_WORKSPACE_CONTRACT.md) — import, mapping, Workspace/Project, revision/local-first contract
17. [`architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`](./architecture/SCENARIO_ACCEPTANCE_CONTRACT.md) — designed expectations and static-to-runtime verification bridge
18. [`decisions/`](./decisions/) — durable Product/Architecture/operating-model ADRs
19. [`CURRENT_STATE.md`](./CURRENT_STATE.md) — coordination snapshot; live checks win
20. [`specs/`](./specs/) — authoritative implementation packets for selected/current Sprints

## Source-of-truth hierarchy

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

Durable Product/Architecture/Roadmap documents do not automatically expand an active packet.

---

# Development operating model

The canonical model is defined in [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md) and `ADR-0005-minimal-development-only-operating-model.md` under [`decisions/`](./decisions/).

The current project is in **development-only focus mode**. The permanent operating model is intentionally limited to five lanes.

## Canonical lanes

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

There is no permanent canonical `03`, `04`, `05`, `06`, or `W00` during development-only focus mode.

This does **not** remove those activities from possibility. It means they do not justify permanent independent lanes now.

- release execution is a C01 lifecycle step after W01 pre-release QA;
- pure release/current-state coordination is handled by 00;
- Production verification remains independently owned by W01;
- cross-document Work tasks may be performed under 00/01/02 authority without creating W00;
- Marketing/SNS/Analytics/Growth tasks are temporary/noncanonical until explicitly reintroduced.

## Lifecycle / handoff

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started / Implementation Complete
→ W01 independent QA / QA Complete
→ C01 merge + release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Important boundaries:

- implementation self-test is not Independent QA;
- release execution is not Production Verified;
- if code/behavior changes after QA Complete, return to W01 before release;
- a completed Sprint does not automatically promote the roadmap.

## Why W00 is not permanent

Work is a surface/capability, not automatically an authority.

When 00/01/02 need broad repository/document work, they may use Work mode while retaining the same role authority. GitHub docs are the durable Development Master, so a permanent W00 role is redundant.

## Context-length / replacement policy

Do not recreate every surface on a fixed schedule.

- `00`, `01`, `02`: may remain long-lived while role boundaries stay clean;
- `C01`: prefer a fresh Codex task per packet or materially separate PR;
- `W01`: prefer a fresh independent Work session per packet/release cycle.

Replace a long-lived chat when stale Sprints/SHAs, unrelated work, or repeated instruction overrides interfere with GitHub-grounded reasoning.

A new/replacement role needs only:

```text
ここは00として使います。
ここは01として使います。
ここは02として使います。
ここはC01として使います。
ここはW01として使います。
```

The assistant must recover role meaning from current GitHub `main`, not old prompts.

---

# Roadmap execution / promotion

For stage/gate decisions read:

- [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md)
- [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md)
- [`roadmap/PROGRAM_BOARD.md`](./roadmap/PROGRAM_BOARD.md)
- [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md)
- [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) when evaluator quality/scale is involved
- [`roadmap/MONETIZATION_ARCHITECTURE.md`](./roadmap/MONETIZATION_ARCHITECTURE.md) when paid value, pricing/quota, unit economics, commercial launch, or commercial-validation evidence is involved

Use:

```text
Evidence
→ Gate Review
→ Explicit Next Selection
```

Stage 1.5 is a selection band, not a mandatory backlog. AI authority is capability-scoped; mutation scope is separately gated. Commercial Validation Gate M0 is likewise evidence-driven and does not automatically select a paid-expansion feature.

---

# Definition of Ready / traceability / versioning

Before a Selected capability becomes implementation-ready, apply [`ENGINEERING_EXECUTION_GOVERNANCE.md`](./ENGINEERING_EXECUTION_GOVERNANCE.md).

Non-trivial packets should trace:

```text
Product / Architecture / Gate / Scenario / Risk
→ Packet requirement / AC
→ test / fixture / Production verification
```

Durable contract versions use the lifecycle defined there. Do not silently reinterpret legacy semantics or remove readers merely because a new writer exists.

---

# Architecture migration / Scenario / Security / Data

For persisted workflow changes, import/Workspace/revision, or declared Intent/Constraints read:

- [`architecture/SEMANTIC_MODEL_EVOLUTION.md`](./architecture/SEMANTIC_MODEL_EVOLUTION.md)
- [`architecture/IMPORT_WORKSPACE_CONTRACT.md`](./architecture/IMPORT_WORKSPACE_CONTRACT.md)

For designed expectations preserve:

```text
Configured expectation
≠ Static evidence of support
≠ Observed runtime behavior
```

and read [`architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`](./architecture/SCENARIO_ACCEPTANCE_CONTRACT.md).

Security/data-sensitive work must preserve:

- [`SECURITY_RELIABILITY_BASELINE.md`](./SECURITY_RELIABILITY_BASELINE.md)
- [`DATA_AND_AI_GOVERNANCE.md`](./DATA_AND_AI_GOVERNANCE.md)

---

# Repository enforcement

Normal PR/main verification is:

```text
npm ci
→ npm run docs:check
→ npm test
→ npm run typecheck
→ npm run build
```

Branch Protection / Rulesets should require the `test-typecheck-build` check for normal merges. Live repository settings must be verified rather than inferred from docs.

## Current packet

Always inspect [`specs/`](./specs/) and latest `main` before work. The active packet is authoritative for its scope even when future architecture is described elsewhere.

## Codex entrypoint

Root [`../AGENTS.md`](../AGENTS.md) is the compact repository contributor entrypoint. Durable detail belongs in these GitHub documents rather than duplicated prompts or memory.
