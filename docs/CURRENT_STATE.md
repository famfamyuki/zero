# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-08-29**  
Status: **Coordination snapshot; live repository/Production checks win**  
Scope: Concise answer to where development is now, which lifecycle states are valid, what is blocked, and which canonical lane acts next.

This file is **not** a deployment registry, packet copy, roadmap copy, or historical archive.

## 0. Live-state rule

Before any implementation, QA, release, roadmap-promotion, commercial-launch, or current-state decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior
4. the relevant authoritative packet under `docs/specs/`

A SHA below is closure evidence only unless it has just been live-verified.

Authority references:

- Product → `docs/PRODUCT_MASTER.md`
- Architecture → `docs/ARCHITECTURE.md`
- Engineering execution → `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- roles/lifecycle ownership → `docs/CHAT_ROLE_REGISTRY.md`
- roadmap → `docs/roadmap/MASTER_ROADMAP.md`
- promotion / AI / mutation authority → `docs/roadmap/EXECUTION_GATES.md`
- near-term blockers/triggers → `docs/roadmap/PROGRAM_BOARD.md`
- durable risks → `docs/roadmap/RISK_REGISTER.md`

---

# 1. Current Production baseline

Current Production includes:

- Product journey organized around `Overview | Design | Preflight`
- Visual Workflow Builder as the Design surface
- workflow templates
- JSON import/export portability
- deterministic CrewAI Python export
- CrewAI Static Import v0 for the supported static subset
- Unified Preflight:
  - Readiness
  - Execution Preview
  - Resource Analysis
- existing analytics/first-value measurement foundation

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Production capability detail belongs in the implementation code and packet; this snapshot only records the current program-level baseline.

---

# 2. Current lifecycle state

| Track | Current state | Authority / packet | Next condition |
|---|---|---|---|
| Stage 1 — Evidence-Grounded AI Architecture Review + coupled Paid Access & Usage Control | **FAIL-BLOCKED / QA incomplete** | `docs/specs/AGS-EGAI-AR-V0-P1.md` and `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md` | Resume only when the evaluation-budget condition in §4 is satisfied |
| CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics | **Sprint Complete / Production Verified** | `docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md`; `ADR-0009` | Remains complete; no automatic source/Stage/authority expansion |
| Existing-Capability Product Identity & Review Journey UX Restructuring | **Sprint Complete / Production Verified** | `docs/specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md`; decision class `HARDEN_FIRST` | 01 performs Evidence → Gate Review → Explicit Next Selection |

Current coordination state:

```text
Current next authority
= 01 — Product Architecture & Roadmap

Current next action
= Evidence → Gate Review → Explicit Next Selection

Next capability
= NOT YET SELECTED

Newly selected work
= NONE pending explicit 01 selection
```

The held Stage 1 packets remain authoritative for that blocked track; `Newly selected work = NONE` means no additional packet has been selected after the completed UX-hardening Sprint.

---

# 3. Stage / gate / authority state

```text
Stage 1 Architecture Review
= FAIL-BLOCKED / QA incomplete

Gate A
= NOT REACHED

Additional Stage 1.5 capability
= NONE

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED
```

Why:

- Stage 1 itself is not Production Verified, so Gate A is not reached.
- Gate B therefore is not reached and Stage 2 is not selected.
- CrewAI Static Import completion and UX hardening completion are separate API-independent Sprints; neither promotes Stage 1 or expands AI/mutation authority.
- Stage 1.5 remains an evidence-driven selection band, not an automatic backlog.
- Commercial Validation Gate M0 is separate from AI authority/stage promotion.

---

# 4. Active blocker and resume condition

Stage 1 remains held because the required provider-backed evaluation evidence is incomplete.

Known blocker evidence:

- W01 observed 25/30 structured schema failures in an earlier required evaluation.
- C01 grounding hardening materially improved a later run but still produced 1/30 hard violations.
- a subsequent confirmation run could not complete after `credit_balance_exhausted`.
- unmerged evaluator hardening remains blocked WIP, not an approved candidate.

Do not merge/release the provider-backed Architecture Review and do not lower its gates because evaluation funding is unavailable.

Resume condition is unchanged:

```text
OpenAI evaluation budget available
→ C01 completes required packet 30-run evaluation
→ zero hard violations
→ >= 90% semantic rubric
→ new exact candidate revision
→ W01 full Pass A on that exact revision
→ normal merge/release/Production verification lifecycle
```

Paid-access implementation evidence may be preserved, but:

```text
Paid capability technically ready / Production Verified
≠ subscription model commercially validated
```

M0 commercial validation requires sufficient real paid Production evidence under `docs/roadmap/MONETIZATION_ARCHITECTURE.md`.

---

# 5. Recent completed Sprint evidence

These identifiers preserve closure traceability only; live checks still supersede them.

| Sprint | QA-approved revision | Production-verified implementation revision | State |
|---|---|---|---|
| CrewAI Static Import v0 | `634cf507ae55e60122bc59c3e20b4c5abce60bad` | `bbc200504877f1b3f48b13945a5ed925214ec572` | Sprint Complete / Production Verified |
| Existing-Capability Product Identity & Review Journey UX Restructuring | `84eb403a7bcc9cf113f41e32b7fbddab28d8de81` | `7e4e6f92aa9ae849559252140f9e4031a3104f2b` | Sprint Complete / Production Verified |

Detailed Acceptance Criteria, implementation scope, explicit deferrals, regression requirements, and Production smoke evidence remain in the relevant packet, PR, W01 evidence, and ADRs. Do not reproduce them here.

---

# 6. Known / Unknown relevant to next selection

## Known

- the current Production Product identity/review journey hardening is shipped and Production Verified;
- CrewAI Static Import v0 is shipped and Production Verified;
- the provider-backed Stage 1 track remains blocked by evaluator evidence/budget;
- no additional Stage 1.5 capability or Stage 2 work is currently Selected;
- AI Authority and Mutation Authority have not expanded.

## Unknown / insufficient evidence

- dedicated CrewAI import success/failure/apply/repeat-use telemetry is still insufficient to infer adoption or repeat-use friction;
- Stage 1 evaluator release quality cannot be re-confirmed until the complete required evaluation can run;
- no remaining Stage 1.5 candidate should be treated as selected without new Product/Production evidence and an explicit 01 decision.

Unknown means insufficient evidence, not evidence of absence or lack of demand.

---

# 7. Next action

Canonical flow now is:

```text
Completed UX hardening Sprint
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
→ 02 only after a new work item is explicitly Selected
```

01 must not mechanically select Stage 2 or another Stage 1.5 candidate merely to keep development moving.

The held Stage 1 track remains independently resumable only when its existing evaluation-budget re-check condition is satisfied; resuming that held track is not a new Product-priority decision.

---

# 8. Operating model

Canonical lanes remain exactly:

```text
00 — Program Control & Current State
01 — Product Architecture & Roadmap
02 — UX & Implementation Specification
C01 — Current Sprint Implementation
W01 — Independent QA & Production Verification
```

Lifecycle ownership remains:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started / Implementation Complete
→ W01 QA Complete
→ C01 release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Authoritative role details remain in `docs/CHAT_ROLE_REGISTRY.md`; do not duplicate them further in this snapshot.
