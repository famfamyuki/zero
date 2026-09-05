# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-09-05**  
Status: **Coordination snapshot; live repository/Production checks win**  
Scope: Concise answer to where development is now, which lifecycle state is valid, what is blocked, and which canonical lane acts next.

This file is **not** a deployment registry, packet copy, roadmap copy, or historical archive.

## 0. Live-state rule

Before any implementation, QA, release, roadmap-promotion, commercial-launch, or current-state decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior
4. the relevant authoritative packet under `docs/specs/`

A SHA below is evidence only unless it has just been live-verified.

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
- Visual Workflow Builder
- workflow templates
- JSON import/export portability
- deterministic CrewAI Python export
- CrewAI Static Import v0 for the supported static subset
- Unified Preflight with Architecture, Readiness, Execution Preview, and Resource Analysis
- Stage 1 Architecture Review implementation and paid-access controls deployed in **fail-closed disabled** state
- existing analytics/first-value measurement foundation

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

The deterministic free core remains operational independently of paid/provider availability.

---

# 2. Current lifecycle state

| Track | Current state | Authority / packet | Next condition |
|---|---|---|---|
| Stage 1 — Evidence-Grounded AI Architecture Review + coupled Paid Access & Usage Control | **QA Complete / release execution complete / Production Verification BLOCKED** | `docs/specs/AGS-EGAI-AR-V0-P1.md` and `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md` | 01 decides commercial enablement; required Production prerequisites become available; W01 performs a fresh Pass B |
| CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics | **Sprint Complete / Production Verified** | `docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md`; `ADR-0009` | Remains complete; no automatic source/Stage/authority expansion |
| Existing-Capability Product Identity & Review Journey UX Restructuring | **Sprint Complete / Production Verified** | `docs/specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md` | Remains complete |

Stage 1 release evidence currently reconciles as:

```text
QA-approved source
= 8887a5f2b282fc55f051dbaeefda2eca7d24de5c

Released main / Production revision at W01 Pass B
= 8db0de7d66846cb92db612098162ea8e27a6c874

Release identity at W01 Pass B
= MATCH

Production paid Architecture Review
= DISABLED / FAIL-CLOSED

W01 Pass B
= BLOCKED

Production Verified
= NO

Sprint Complete
= NO
```

The earlier evaluator-quality/API-budget blocker is no longer current: the required 30-review evaluation and W01 Pass A completed before release. The remaining blocker is Production paid/commercial verification.

Subsequent documentation-only commits may advance `main` and Production deployment SHAs without changing Stage 1 behavior. Always re-check live repository/deployment identity before using any SHA as current state.

---

# 3. Stage / gate / authority state

```text
Stage 1
= QA COMPLETE
+ RELEASE EXECUTION COMPLETE
+ PRODUCTION VERIFICATION BLOCKED

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

- Stage 1 is not Production Verified, so Gate A is not reached.
- Gate B therefore is not reached and Stage 2 is not selected.
- No Stage 1.5 capability is automatically selected from the roadmap.
- Commercial Validation Gate M0 remains separate from AI authority/stage promotion and is not reached merely by technical release readiness.

---

# 4. Active blocker

```text
Blocker:
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER

Observed Production state at W01 Pass B:
- deployment READY / target=production
- Stage 1 release identity matched the QA-approved change set
- paid Architecture Review offer disabled
- review endpoint fails closed with review_disabled
- deterministic free core remains operational

Why blocked:
The active paid-access packet requires live controlled-account Production evidence for sign-in, Stripe subscription, entitlement reconciliation, quota/current-period projection, successful review consumption, non-consumption failure behavior, idempotency, billing portal/cancel-at-period-end, quota exhaustion, kill-switch isolation, and related commercial/hosting prerequisites.
```

Required prerequisites include, as applicable:

- commercial-use-eligible hosting/account
- explicitly approved Production Price / currency / included quota
- approved provider cost guard and operator budget controls
- Stripe Production Price and Customer Portal configuration
- Terms / Privacy / Support / refund / tax operational path
- Production Supabase Auth email delivery/redirect configuration
- controlled QA account and approved financial handling
- Production WAF verification path

C01 must not invent these Product/commercial values. W01 must not bypass entitlement/quota or weaken AC-30.

---

# 5. Current coordination / next authority

```text
Current next authority
= 01 — Product Architecture & Roadmap

Decision required
= explicit Commercial Enablement decision

Allowed high-level outcomes
= ENABLE_PREP
  or HOLD_DISABLED
  or PACKET_STATUS_REVIEW only if a real contract contradiction exists
```

If public paid enablement is selected, use the smallest sufficient commercial/operational prerequisite packet or authorized configuration path; do not pull future Stage 1.5/Stage 2 capabilities into the work.

After prerequisites are live, return to `W01` for a **fresh Pass B**. If code or behavior changes after QA Complete, re-evaluate Pass A validity before release/verification.

---

# 6. Known / Inferred / Unknown

## Known

- Stage 1 implementation is QA Complete and released on the exact approved tree.
- W01 verified release identity matching at the Stage 1 Pass B attempt; current `main` / Production SHA must still be live-checked before each material decision.
- paid Architecture Review is currently disabled/fail-closed in the verified Production state.
- deterministic free features remain operational.
- W01 Pass B is blocked because mandatory live paid-path evidence is unavailable.
- Gate A is not reached; Stage 2 is not selected; AI and Mutation Authority are unchanged.

## Inferred

- The current disabled state is an intentional safety posture while commercial/Production prerequisites remain unsatisfied; it is not evidence of paid-path Production correctness.

## Unknown / evidence-dependent

- Production Auth email delivery and controlled-account sign-in.
- live Stripe checkout/subscription and entitlement reconciliation.
- successful provider-backed review/result rendering in Production.
- quota consume/non-consume/idempotency/exhaustion behavior in Production.
- billing portal/cancel behavior in Production.
- Production WAF enforcement.
- final approved public Price/quota/cost-guard and commercial operations readiness.
- commercial validation / recurring paid value under M0.

Unknown means insufficient evidence, not evidence of absence.

---

# 7. Planning reconciliation rule

Near-term planning update discipline is authoritative in `docs/roadmap/PROGRAM_BOARD.md`.

After a material lifecycle, blocker, gate, selection, authority, release, or Production-verification milestone, reconcile the current planning documents **before the next normal lane handoff** so stale snapshots do not become operating input.

Do not update planning documents for every commit or transient metric; update them when the program state materially changes.

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

`QA Complete ≠ Production Verified`.  
`Release execution ≠ Production Verified`.  
`Sprint Complete ≠ automatic Stage promotion`.
