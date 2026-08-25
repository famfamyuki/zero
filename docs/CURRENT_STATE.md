# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-08-25**  
This file is a coordination snapshot, **not** a replacement for live GitHub/Vercel checks.

## 0. Live-state rule

Before using any SHA or deployment below as current, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior

If live state differs, live state wins and this file should be updated after the relevant Sprint/release decision.

---

# 1. Product baseline

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

---

# 2. Current selected major milestone

## Stage 1 — Evidence-Grounded AI Architecture Review v0

Current authoritative packet:

- `docs/specs/AGS-EGAI-AR-V0-P1.md`

Packet status in the specification: **Specified**.

Observed repository activity on 2026-08-25 shows implementation work has begun on branch:

- `feat/evidence-grounded-architecture-review-v0`

Observed implementation commit:

- `04c7464241911ffba68ee75d1007577825fcf4b2` — `Add evidence-grounded architecture review`

Therefore the overall Sprint is at least **Implementation Started**, but it must not be considered Implementation Complete, QA Complete, Production Verified, or Sprint Complete until the required gates are independently verified.

---

# 3. Main / Production snapshot before product-master documentation merge

GitHub `main` observed:

- SHA: `abe22da888dd6c79e663cdced07370323991af9c`
- Commit: `Add evidence-grounded architecture review specification`

Vercel Production observed:

- state: `READY`
- target: `production`
- `githubCommitSha`: `abe22da888dd6c79e663cdced07370323991af9c`

At that observation point:

```text
GitHub main SHA = Vercel Production githubCommitSha
```

This SHA is a snapshot only. It will become stale after future merges.

---

# 4. Stage 1 product intent

The current milestone adds an evidence-grounded architecture interpretation layer without replacing deterministic Preflight.

Required architecture ordering:

```text
Canonical Workflow
→ existing deterministic analysis
→ Evidence Contract
→ AI reasoning
→ Architecture Evaluation
```

Current v0 intentionally keeps deterministic Preflight authoritative and independent from AI availability.

Current v0 also intentionally defers later roadmap work including semantic mutation, Semantic Patch, Apply, persisted Workflow Intent, runtime tracing, framework-neutral compilation, collaboration, and marketplace.

---

# 5. Status model

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

Do not advance a status based on assumptions.

For Stage 1, implementation activity exists, but the later statuses require explicit verification.

---

# 6. Required next gates for Stage 1

Before **Implementation Complete**:

- implementation scope matches `AGS-EGAI-AR-V0-P1`
- `npm test` passes
- `npx tsc --noEmit` passes
- `npm run build` passes
- packet-defined AI/evidence tests pass

Before **QA Complete**:

- Independent QA against Acceptance Criteria
- grounding/Unknown/invalidation/failure cases checked
- existing Preflight/import/export/transpiler/analytics regressions checked
- accessibility and stale-result behavior checked as specified

Before **Production Verified**:

- merge/release to `main`
- Vercel `READY`
- `target=production`
- Production smoke
- relevant runtime errors checked
- GitHub `main` SHA equals Vercel Production `githubCommitSha`

---

# 7. Coordination rule for chats / Work / Codex

All development surfaces should read the repository documents instead of relying on a prior chat's remembered state.

Recommended reading order:

1. `AGENTS.md`
2. `docs/PRODUCT_MASTER.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DEVELOPMENT_RULES.md`
5. `docs/roadmap/MASTER_ROADMAP.md`
6. this snapshot
7. active packet under `docs/specs/`

For current Sprint implementation details, the active packet is authoritative even when the long-term Master describes a later architecture direction.
