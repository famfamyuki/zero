# AgentGraph Studio Development Documentation

This directory is the shared durable development knowledge base for ChatGPT chats, Work, Codex, and human contributors.

## Read first

1. [`PRODUCT_MASTER.md`](./PRODUCT_MASTER.md) — final product definition, North Star, durable product principles
2. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — long-term architecture boundaries and evolution
3. [`DEVELOPMENT_RULES.md`](./DEVELOPMENT_RULES.md) — implementation, QA, Git, analytics regression, and release gates
4. [`ENGINEERING_EXECUTION_GOVERNANCE.md`](./ENGINEERING_EXECUTION_GOVERNANCE.md) — Definition of Ready, version lifecycle, traceability, operational-quality maturity, repository/docs enforcement
5. [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md) — authoritative Chat / Work / Codex operating model, role authority, lifecycle ownership, aliases, reset policy, handoffs
6. [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md) — authoritative stage sequencing and dependency logic
7. [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md) — stage promotion, evaluator authority, Stage 1.5 selection, safe-transformation/mutation gates
8. [`roadmap/PROGRAM_BOARD.md`](./roadmap/PROGRAM_BOARD.md) — near-term capability/gate/blocker coordination
9. [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md) — durable cross-stage risks
10. [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) — evaluator trust, benchmark quality, scale, Search/Locate/Scoped Evaluation
11. [`roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`](./roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md) — product platform/commercial sequencing
12. [`SECURITY_RELIABILITY_BASELINE.md`](./SECURITY_RELIABILITY_BASELINE.md) — platform security/reliability baseline
13. [`DATA_AND_AI_GOVERNANCE.md`](./DATA_AND_AI_GOVERNANCE.md) — data classification, persistence/provider boundaries, evaluator/model governance
14. [`architecture/SEMANTIC_MODEL_EVOLUTION.md`](./architecture/SEMANTIC_MODEL_EVOLUTION.md) — semantic-model migration runway
15. [`architecture/IMPORT_WORKSPACE_CONTRACT.md`](./architecture/IMPORT_WORKSPACE_CONTRACT.md) — import, mapping, Workspace/Project, revision/local-first contract
16. [`architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`](./architecture/SCENARIO_ACCEPTANCE_CONTRACT.md) — designed expectations and static-to-runtime verification bridge
17. [`decisions/`](./decisions/) — durable Product/Architecture/operating-model ADRs
18. [`CURRENT_STATE.md`](./CURRENT_STATE.md) — coordination snapshot; live checks win
19. [`specs/`](./specs/) — authoritative implementation packets for selected/current Sprints

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
→ historical chats / Work / Codex / old SHAs
```

Durable Product/Architecture/Roadmap documents do not automatically expand an active packet.

---

# Chat / Work / Codex operating model

The canonical model is defined in [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md) and ADR-0004 under [`decisions/`](./decisions/).

The key distinction is:

```text
Role / authority
≠
Execution surface / conversation instance
```

Use:

```text
Chat  = reasoning / decision / coordination
Work  = persistent operational workspace / independent verification
Codex = packet-bound repository implementation
GitHub main = durable truth
```

## Canonical Chat roles

```text
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification
03  GitHub, Vercel & Release Operations
05  Marketing & Developer Communication
06  Analytics & Growth Evidence
```

`04` is no longer a separate canonical persistent implementation chat.

## Canonical Work roles

```text
W00 Development Operations Workspace
W01 Independent QA & Production Verification
```

`W00` is not a competing Development Master. GitHub docs are the Development Master/source of truth.

## Canonical Codex role

```text
C01 Current Sprint Implementation
```

`C01` is the single normal implementation authority for a current Specified packet.

## Legacy aliases

```text
04 → C01
07 → 01
08 → 02
```

A new/replacement surface needs only a short declaration such as:

```text
ここは01として使います。
```

The assistant must recover current role meaning from GitHub rather than asking for an old prompt.

## Lifecycle / handoff

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started / Implementation Complete
→ W01 Independent QA / QA Complete
→ 03 merge + release operations
→ W01 Production Verified
→ 00 Sprint Complete
→ 01 next gate / next selection
```

Important boundaries:

- implementation self-test is not Independent QA;
- release execution is not the Production Verified verdict;
- a completed Sprint does not automatically promote the roadmap;
- Marketing/Analytics evidence may inform decisions but does not automatically own Product priority.

## Context-length / replacement policy

Do not recreate every surface on a fixed schedule.

- `00/01/02/03/05/06`: may stay long-lived while role boundaries remain clean;
- `C01`: prefer a fresh Codex session/task per packet or materially separate PR;
- `W01`: prefer a fresh independent QA workspace/session per packet/release cycle;
- `W00`: may stay persistent but must refresh from latest GitHub on every substantive task.

Replace a long-lived conversation when old Sprints/SHAs or unrelated work start interfering with current decisions. One-line activation is enough to recover the role.

---

# Roadmap execution / promotion

For stage/gate decisions read:

- [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md)
- [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md)
- [`roadmap/PROGRAM_BOARD.md`](./roadmap/PROGRAM_BOARD.md)
- [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md)
- [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) when evaluator quality/scale is involved

Use:

```text
Evidence
→ Gate Review
→ Explicit Next Selection
```

Stage 1.5 is a selection band, not a mandatory backlog. AI authority is capability-scoped; mutation scope is separately gated.

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
