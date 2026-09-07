# Commercial Input Closure Plan — 2026-09-05

Status: **Superseded research note / non-authoritative**

Superseded by:

- `docs/roadmap/PROGRAM_BOARD.md` for the authoritative near-term execution sequence;
- `docs/CURRENT_STATE.md` for the concise current snapshot;
- `docs/roadmap/MONETIZATION_ARCHITECTURE.md` and ADR-0007 for the durable pricing/value-evidence contract.

> This is a dated sequencing/evidence record. PR #35 has since merged as a paid-off preparation release, and provisional launch configuration has been selected. Use the [Program Board](../roadmap/PROGRAM_BOARD.md) and [Paid Launch Runbook](../runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md) for current work and inputs; the historical block below is not an instruction to reopen preparation.

## Why this note was superseded

This document originally treated WTP/commercial input closure as the next execution step before further commercial-readiness implementation.

01 later changed the **execution order**, not the durable pricing contract:

```text
price-independent commercial readiness first
→ final commercial configuration later
→ fresh independent QA on the exact final revision
→ release / controlled Production verification
```

The plan at supersession therefore does **not** use WTP research as a prerequisite for continuing price-independent implementation.

At that sequencing decision, Public Price, Currency, Included quota, numeric request-cost envelope, and aggregate provider budget remained unresolved Product/commercial inputs and must not be invented by C01. The evidence requirements for eventually approving those values remain governed by `MONETIZATION_ARCHITECTURE.md` / ADR-0007 unless 01 explicitly changes that durable Product contract later.

## Preserved evidence

The following evidence remains valid and is not superseded by the sequencing change:

- `docs/research/COMMERCIAL_CALIBRATION_EVIDENCE_2026-09-05.md` is accepted as **PARTIAL** provider-cost evidence;
- successful formal reviews: N=30;
- P50 provider cost: USD 0.0461076;
- observed benchmark P95: USD 0.0598480;
- max observed successful-review cost: USD 0.0730960;
- total historical estimated provider cost: USD 1.412506;
- observed benchmark P95 is not a Production P95;
- provider failure/timeout/invalid-output cost distributions remain Unknown;
- no new live provider failure calls are authorized by this note.

Current external commercial-cost observations recorded on 2026-09-05 remain research inputs only and must be re-checked when used for a final decision.

## Archived WTP survey action

The temporary PostHog survey created for provisional WTP calibration was **not launched** and has been archived.

It is not part of the current development sequence.

This does not mean willingness-to-pay or user-value evidence is considered proven or unnecessary for a future pricing decision. It only means that collecting that evidence is not blocking the current price-independent implementation work.

## Do not use this file for current sequencing

For current work, use:

```text
PROGRAM_BOARD
→ CURRENT_STATE
→ active packet / implementation branch
```

Historical safety state at supersession (not current state):

```text
Commercial Enablement = ENABLE_PREP
Public paid switch = NOT APPROVED
ARCHITECTURE_REVIEW_PAID_ENABLED = false
Draft PR #35 = UNMERGED
M0 = NOT REACHED
Gate A = NOT REACHED
Stage 1.5 = NONE SELECTED
Stage 2 = NOT SELECTED
AI Authority = UNCHANGED
Mutation Authority = UNCHANGED
```
