# AgentGraph Studio Development Documentation

This directory is the shared development knowledge base for ChatGPT chats, Work, Codex, and human contributors.

## Read first

1. [`PRODUCT_MASTER.md`](./PRODUCT_MASTER.md) — final product definition, North Star, durable product principles
2. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — long-term architecture boundaries and evolution
3. [`DEVELOPMENT_RULES.md`](./DEVELOPMENT_RULES.md) — implementation, QA, Git, analytics regression, and release gates
4. [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md) — canonical meaning of chat IDs (`00`–`06`, `C01`, `W01`, `W00`) plus legacy `07`/`08` aliases, decision authority and handoffs
5. [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md) — authoritative stage sequencing and dependency logic
6. [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md) — stage entry/exit, promotion evidence, Stage 1.5 selection, evaluator-authority and safe-transformation gates
7. [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) — evaluator trust, benchmark quality, large-workflow scale, Search/Locate/Scoped Evaluation
8. [`roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`](./roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md) — category position, adoption wedge, durable moat, monetization boundaries, final workspace UX
9. [`SECURITY_RELIABILITY_BASELINE.md`](./SECURITY_RELIABILITY_BASELINE.md) — AgentGraph platform security, production reliability, operational and release baseline
10. [`DATA_AND_AI_GOVERNANCE.md`](./DATA_AND_AI_GOVERNANCE.md) — data classification, persistence, provider boundaries, evaluator/model change governance
11. [`architecture/SEMANTIC_MODEL_EVOLUTION.md`](./architecture/SEMANTIC_MODEL_EVOLUTION.md) — Graph V1 → future semantic-model migration runway
12. [`architecture/IMPORT_WORKSPACE_CONTRACT.md`](./architecture/IMPORT_WORKSPACE_CONTRACT.md) — import, mapping, Workspace/Project, revision and local-first architecture contract
13. [`decisions/`](./decisions/) — durable Product/Architecture/operating-model decision records
14. [`CURRENT_STATE.md`](./CURRENT_STATE.md) — coordination snapshot; always re-check live GitHub/Vercel first
15. [`specs/`](./specs/) — authoritative implementation packets for selected/current Sprints

## Source-of-truth hierarchy

For current implementation work:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ Product Master
→ Architecture Master
→ Development Rules / cross-cutting baselines
→ Master Roadmap
→ Execution Gates for promotion decisions
→ relevant cross-stage plans/contracts
→ Current State snapshot
→ historical plans/chats
```

The Product/Architecture/Roadmap documents and cross-stage plans describe durable direction. They do not automatically expand the scope of an active packet.

## Chat / Work role activation

Chat identifiers are durable routing keys defined in [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md).

A new conversation may be initialized with only a short role declaration such as:

```text
ここは01として使います。
```

The assistant should then recover the canonical role from current GitHub `main`, load the required documents, re-check live state when the role requires it, and continue without asking the user to paste the previous role prompt or old chat history.

Canonical active chat IDs:

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

Legacy compatibility:

```text
07 → 01
08 → 02
```

Do not maintain competing roadmap/specification authorities in legacy chats.

## Roadmap execution / promotion

When deciding what happens after a stage or whether AI authority may expand, read:

- [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md)
- [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md)
- [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) when evaluator quality/scale is involved

Stage 1 does not mechanically imply Stage 2. The execution model allows evidence-driven quality/scale hardening and a Stage 1.5 **Adoption & Context Foundation selection band** before evaluator authority expands.

## Architecture migration / adoption foundation

Before changing persisted workflow schemas, import semantics, Workspace/Project identity, revision/history, or declared Intent/Constraints, also read:

- [`architecture/SEMANTIC_MODEL_EVOLUTION.md`](./architecture/SEMANTIC_MODEL_EVOLUTION.md)
- [`architecture/IMPORT_WORKSPACE_CONTRACT.md`](./architecture/IMPORT_WORKSPACE_CONTRACT.md)

Do not create Graph V2 merely because the long-term target model is known.

## Security, reliability, data, and AI governance

All relevant packets must preserve:

- [`SECURITY_RELIABILITY_BASELINE.md`](./SECURITY_RELIABILITY_BASELINE.md)
- [`DATA_AND_AI_GOVERNANCE.md`](./DATA_AND_AI_GOVERNANCE.md)

These are cross-cutting constraints, not late-stage features. Workflow-level policy/security remains a distinct product capability.

## Product platform / commercialization strategy

When a decision concerns category position, competitive differentiation, import/adoption wedge, Project/Workspace direction, review-centric UX, durable moat, recurring-use loop, Free/Pro/Team/Enterprise value boundaries, or Git/CI distribution, also read:

- [`roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`](./roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md)

Marketing/access analytics remain outside the center of engineering prioritization; existing analytics remains a regression constraint.

## Current packet

Always inspect [`specs/`](./specs/) and latest `main` before work. A packet intentionally deferring future architecture remains authoritative for its scope.

## Repository enforcement

Pull requests and `main` pushes should pass the repository CI workflow:

```text
npm ci
→ npm test
→ npm run typecheck
→ npm run build
```

Branch protection/rulesets should require the CI check for normal merges where the GitHub plan/account supports enforcement. The absence of platform enforcement never waives the manual release gate in `DEVELOPMENT_RULES.md`.

## Codex

Root [`../AGENTS.md`](../AGENTS.md) is the compact contributor entrypoint. Keep durable detail here instead of duplicating every master document there.
