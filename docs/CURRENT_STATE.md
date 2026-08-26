# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-08-26**  
This file is a coordination snapshot, **not** a live deployment registry.

## 0. Live-state rule

Before any implementation, QA, release, roadmap-promotion, or current-state decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior

Do **not** use a SHA written in this file as proof of current state. Live checks win.

This file intentionally emphasizes the current milestone/status/next gate rather than embedding frequently stale deployment SHAs.

---

# 1. Current Product baseline

Current Production foundation includes:

- Visual Workflow Builder
- workflow templates
- JSON import/export portability
- deterministic CrewAI Python export
- Unified Preflight
  - Readiness
  - Execution Preview
  - Resource Analysis
- First-Value Preflight activation/measurement foundation

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Long-term direction is defined in:

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`

Cross-stage execution/governance is defined in:

- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`

---

# 2. Current selected major milestone

## Stage 1 — Evidence-Grounded AI Architecture Review v0

Current authoritative packet:

- `docs/specs/AGS-EGAI-AR-V0-P1.md`

Packet document status: **Specified**.

Observed repository implementation work exists on:

- `feat/evidence-grounded-architecture-review-v0`

Therefore the overall Sprint is at least **Implementation Started** until a newer live repository/QA state proves a later lifecycle status.

Do not infer Implementation Complete / QA Complete / Production Verified / Sprint Complete from branch existence alone.

---

# 3. Current Stage 1 product intent

The milestone adds an evidence-grounded architecture interpretation layer without replacing deterministic Preflight.

Required ordering:

```text
Canonical Workflow
→ deterministic analysis
→ Evidence Contract
→ AI reasoning
→ Architecture Evaluation
```

Current v0 intentionally keeps deterministic Preflight authoritative and AI-independent.

Current v0 also intentionally defers later work including:

- semantic mutation / Apply
- Semantic Patch
- persisted top-level Workflow Intent
- runtime tracing/evidence
- framework-neutral compilation
- collaboration
- marketplace
- broader Stage 1.5 Import/Workspace/History foundation unless separately selected

---

# 4. Required next gates for Stage 1

Before **Implementation Complete**:

- implementation scope matches `AGS-EGAI-AR-V0-P1`
- `npm run docs:check` passes
- `npm test` passes
- `npm run typecheck` passes
- `npm run build` passes
- packet-defined AI/evidence tests and evaluation requirements pass

Before **QA Complete**:

- Independent QA against Acceptance Criteria
- grounding/Unknown/invalidation/failure cases checked
- existing Preflight/import/export/transpiler/analytics regressions checked
- accessibility and stale-result behavior checked as specified
- security/privacy boundaries checked

Before **Production Verified**:

- QA-approved revision released to `main`
- Vercel `READY`
- `target=production`
- Production smoke
- relevant runtime errors checked
- GitHub `main` SHA equals Vercel Production `githubCommitSha`

---

# 5. After Stage 1

Do not mechanically select Stage 2 after Stage 1.

Use:

- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`

Expected decision flow:

```text
Stage 1 Production evidence
→ Gate A — Evaluation Trust & Scale
→ select quality/scale/context foundation as justified
→ Stage 1.5 Adoption & Context Foundation packet(s) where justified
→ Gate B — Evaluator Authority Expansion
→ Stage 2 Guided Improvement only when evidence supports it
```

Stage 1.5 candidates include CrewAI static import, Project/Local Workspace, persisted Intent & Constraints, Review/Locate improvements, and revision/evaluation-history foundations. These are candidates, not automatically one Sprint.

---

# 6. Status model

Use:

```text
Selected
→ Specified
→ Implementation Started
→ Implementation Complete
→ QA Complete
→ Production Verified
→ Sprint Complete
```

Roadmap gate/stage promotion is a separate Product Architecture decision from Sprint lifecycle status.

---

# 7. Current development operating model

The project is currently in **development-only focus mode**. Marketing/SNS/Growth/Analytics work is not maintained as permanent development lanes.

Canonical persistent lanes are exactly:

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

Default lifecycle handoff:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Complete
→ W01 independent QA / QA Complete
→ C01 merge/release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
→ 01 next Gate / selection
```

There is no permanent canonical W00/03/04/05/06 lane in development-only focus mode.

- Work mode may be used by 00/01/02 for complex repository/document work without creating a W00 authority.
- Pure release/current-state coordination belongs to 00.
- normal QA-approved merge/release belongs to C01.
- independent Production verification belongs to W01.
- if code/behavior changes after QA Complete, the QA approval is stale and must be repeated before release.

Authoritative role details are in `docs/CHAT_ROLE_REGISTRY.md` and `docs/decisions/ADR-0005-minimal-development-only-operating-model.md`.

---

# 8. Coordination / reading rule

All development surfaces should read repository documents instead of relying on a prior conversation's remembered state.

Recommended baseline reading order:

1. `AGENTS.md`
2. `docs/PRODUCT_MASTER.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DEVELOPMENT_RULES.md`
5. `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
6. `docs/roadmap/MASTER_ROADMAP.md`
7. `docs/roadmap/EXECUTION_GATES.md`
8. relevant cross-stage security/data/evaluation/import contracts
9. this snapshot
10. active packet under `docs/specs/`

For current Sprint implementation details, the active packet remains authoritative even when long-term documents describe later architecture.
