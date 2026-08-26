# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-08-26**  
Status: **Coordination snapshot — not a live deployment registry**

Before any current-state, implementation, QA, release, roadmap-promotion, or commercial-launch decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior
4. active packet under `docs/specs/`

Do not use a SHA or status written here as proof of live state. The canonical source hierarchy and reading paths are in `docs/README.md`.

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

The durable Product/Architecture/Roadmap definition lives in `PRODUCT_MASTER.md`, `ARCHITECTURE.md`, and `roadmap/MASTER_ROADMAP.md`; it is not repeated here.

---

# 2. Current selected major milestone

## Stage 1 — Evidence-Grounded AI Architecture Review v0

Authoritative packet:

- `docs/specs/AGS-EGAI-AR-V0-P1.md`

Packet document status: **Specified**.

Observed implementation work exists on:

- `feat/evidence-grounded-architecture-review-v0`

Therefore the Sprint is at least **Implementation Started** until newer live repository/QA evidence proves a later lifecycle state.

Branch existence alone is not evidence of Implementation Complete, QA Complete, Production Verified, or Sprint Complete.

### Current Stage 1 intent

Stage 1 adds evidence-grounded architecture interpretation while keeping deterministic Preflight authoritative and AI-independent:

```text
Canonical Workflow
→ deterministic analysis
→ Evidence Contract
→ AI reasoning
→ Architecture Evaluation
```

Current v0 intentionally defers:

- semantic mutation / Apply
- Semantic Patch
- persisted top-level Workflow Intent
- runtime tracing/evidence
- framework-neutral compilation
- collaboration
- marketplace
- broader Stage 1.5 Import/Workspace/History foundation unless separately selected

Commercial planning does not change these Stage 1 scope boundaries.

---

# 3. Current Production release blocker / selected prerequisite

Provider-backed Architecture Review must remain unreleased until paid entitlement and server-enforced usage control are specified, implemented, and independently verified.

Accepted direction:

- AgentGraph Studio owns the provider credential and provider cost
- initial Production Architecture Review access is paid-plan only
- unlimited provider-backed review is not approved
- a hard server-enforced user quota is required
- BYOK is not part of the initial offering
- free deterministic Preflight, portability, and deterministic export remain AI-independent

Durable decisions:

- cost/access boundary → `docs/decisions/ADR-0006-paid-access-for-provider-backed-architecture-review.md`
- commercial validation → `docs/decisions/ADR-0007-commercial-validation-before-paid-expansion.md`
- commercial architecture/M0 → `docs/roadmap/MONETIZATION_ARCHITECTURE.md`

Selected next specification work:

> **Architecture Review Paid Access & Usage Control v0**

Before public paid launch, its packet must resolve the applicable price, included quota, entitlement lifecycle, commercial-operations behavior, privacy-safe measurement, and other launch requirements defined by the commercial architecture.

Keep the distinction:

```text
Paid Access implemented / Production Verified
≠ Initial subscription model commercially validated
```

The first paid offering remains a commercial-validation phase until M0 has enough real evidence for a scoped decision.

---

# 4. What remains before Stage 1 completion

The exact Acceptance Criteria/Test Matrix come from `AGS-EGAI-AR-V0-P1.md`; engineering lifecycle requirements come from `docs/DEVELOPMENT_RULES.md`.

Stage 1 must still demonstrate, at minimum:

- packet scope implementation
- required docs/test/typecheck/build verification
- packet-defined AI/evidence evaluation checks
- Independent QA against packet Acceptance Criteria
- grounding / Unknown / invalidation / provider-failure behavior
- regression protection for existing Preflight/import/export/transpiler/analytics
- accessibility/stale-result/security/privacy behavior as specified

For the provider-backed paid Production offering, the coupled Paid Access & Usage Control prerequisite and applicable commercial-launch requirements must also be satisfied.

Production Verified still requires live Production evidence, including GitHub `main` SHA = Vercel Production `githubCommitSha`, as defined in `DEVELOPMENT_RULES.md`.

---

# 5. After Stage 1

Do not mechanically select Stage 2.

Expected evidence flow:

```text
Stage 1 Production evidence
├→ Gate A — Evaluation Trust & Scale
└→ M0 — Commercial Validation when sufficient paid evidence exists
→ select quality / scale / context / repeat-value foundation only as justified
→ Stage 1.5 packet(s) where justified
→ Gate B — Evaluator Authority Expansion
→ Stage 2 Guided Improvement only when evidence supports it
```

Gate A and M0 answer different questions. M0 must not block independently justified evaluator safety/quality hardening while commercial sample size is insufficient.

Current Stage 1.5 candidate areas remain:

- CrewAI static import
- Project / Local Workspace
- persisted Intent & Constraints
- Review / Locate improvements
- revision / evaluation-history foundations

These are candidates, not a mandatory Sprint sequence or a prebuilt Pro bundle. Selection remains governed by `EXECUTION_GATES.md` and `PROGRAM_BOARD.md`.

---

# 6. Current operating mode

The project remains in **development-only focus mode**.

Canonical persistent lanes remain:

```text
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification
C01 Current Sprint Implementation
W01 Independent QA & Production Verification
```

Role boundaries, lifecycle handoff, replacement policy, and noncanonical-lane rules live only in `docs/CHAT_ROLE_REGISTRY.md`; they are not duplicated here.

Current commercial/Product gate decisions including M0 remain Product Architecture decisions under lane `01`.

---

# 7. Immediate coordination summary

```text
Current major milestone:
Stage 1 — Evidence-Grounded AI Architecture Review v0

Observed lifecycle floor:
Implementation Started

Current release blocker:
Provider-backed review lacks Production-verified paid entitlement + hard usage control

Selected next specification:
Architecture Review Paid Access & Usage Control v0

After Stage 1:
Production evidence → Gate A and, when sufficient paid evidence exists, M0 → explicit smallest next selection
```
