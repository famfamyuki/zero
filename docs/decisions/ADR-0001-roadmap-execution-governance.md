# ADR-0001 — Roadmap Execution Governance

Status: **Accepted**  
Date: **2026-08-26**

## Context

AgentGraph Studio already had strong long-term Product, Architecture, Evaluation Trust, and Commercial Strategy documents, but two execution risks remained:

1. the Master Roadmap sequenced Stage 1 directly toward Guided Improvement while the newer product strategy identified an Adoption & Context foundation as a likely near-term dependency/first-value wedge;
2. roadmap gates described what to measure but did not define a durable promotion-governance process that separates packet release criteria from authority-expansion criteria.

Additional cross-cutting concerns—semantic-model migration, import/workspace identity, platform security/reliability, data/AI governance, and repository enforcement—also needed authoritative homes rather than being rediscovered packet by packet.

## Decision

Adopt an explicit execution-governance layer:

```text
Stage 1 — Evidence-Grounded Architecture Review
→ Gate A — Evaluation Trust & Scale
→ Stage 1.5 — Adoption & Context Foundation selection band
→ Gate B — Evaluator Authority Expansion
→ Stage 2 — Guided Improvement
→ Gate C — Safe Transformation Readiness
→ Stage 3 — Safe Transformation
```

Stage 1.5 is not one mandatory monolithic Sprint. It is a planned selection band for the smallest evidence-justified combination of import, workspace, declared intent/context, review navigation, and revision/evaluation-history foundations.

Promotion decisions use `docs/roadmap/EXECUTION_GATES.md` and measured evidence. Packet release criteria are not automatically permanent promotion thresholds for later evaluator authority.

The following cross-cutting documents are established:

- `docs/roadmap/EXECUTION_GATES.md`
- `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`

Repository CI should enforce test/typecheck/build, and branch protection/rulesets should make required checks non-bypassable for normal changes where platform capabilities allow.

## Rationale

This preserves the long-term Product North Star while reducing three risks:

- evaluator authority growing faster than measured trust;
- premature Graph V2 / architecture rewrites;
- first-value and repeat-use dependencies being added opportunistically without a coherent migration model.

It also distinguishes AgentGraph platform security from future workflow-policy evaluation and makes model/prompt/evaluator changes governed engineering changes rather than invisible environment-variable swaps.

## Consequences

Positive:

- roadmap and commercial strategy use one execution model;
- promotion decisions become auditable and evidence-based;
- import/workspace work can proceed without prematurely granting AI mutation authority;
- future semantic migration has explicit triggers;
- data/security/reliability rules are reusable across packets.

Costs:

- more explicit gate/decision documentation is required;
- future threshold calibration needs expert datasets/benchmarks;
- repository governance must be maintained alongside product code.

## Alternatives considered

### Continue Stage 1 → Stage 2 mechanically

Rejected because current strategy identifies import/context/repeat-use foundations that may have higher leverage and because evaluator quality may not justify increased authority yet.

### Make Stage 1.5 a fixed mega-Sprint

Rejected because import, workspace, intent, history, and review navigation should be selected in the smallest sufficient combination based on evidence.

### Create Graph V2 immediately

Rejected because current Graph V1 remains functional and active packets intentionally preserve it. A migration runway is safer than speculative rewrite.

## Migration / compatibility impact

No current Production workflow format changes. No active Stage 1 packet scope changes. Existing analytics and deterministic functionality remain regression constraints.

## Related docs / packets

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`
- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`
- `docs/specs/AGS-EGAI-AR-V0-P1.md`
