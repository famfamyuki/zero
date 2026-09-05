# AgentGraph Studio — Program Board

Status: **Authoritative near-term execution coordination**  
Scope: Current lifecycle state, active blocker, current execution sequence, and next lane/action.  
This board intentionally does **not** duplicate long-term roadmap content, completed packet detail, detailed release history, or durable risk definitions.

## 0. Live-state rule

Before using this board for a decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior where relevant
4. the authoritative packet under `docs/specs/` for selected/current work

Live repository/Production reality wins over copied SHAs or historical chat state.

Document ownership:

- Product definition → `docs/PRODUCT_MASTER.md`
- Architecture → `docs/ARCHITECTURE.md`
- long-term stage sequence → `docs/roadmap/MASTER_ROADMAP.md`
- promotion / AI authority / mutation authority → `docs/roadmap/EXECUTION_GATES.md`
- commercial value/pricing evidence/launch contract → `docs/roadmap/MONETIZATION_ARCHITECTURE.md`
- packet scope / AC / implementation contract → `docs/specs/`
- durable risks → `docs/roadmap/RISK_REGISTER.md`
- concise current snapshot → `docs/CURRENT_STATE.md`
- this board → near-term execution order, blocker ownership, and next handoff

---

# 1. Current program state

```text
Stage 1 Architecture Review / Paid Access track
= QA COMPLETE
+ RELEASE EXECUTION COMPLETE
+ PRODUCTION VERIFICATION BLOCKED

Commercial Enablement Decision
= PROCEED_TO_PAID_LAUNCH_CANDIDATE

Paid Architecture Review access boundary
= AUTHENTICATED ACTIVE PAID ENTITLEMENT ONLY
+ REMAINING SERVER-ENFORCED QUOTA REQUIRED

Initial included quota
= 10 Architecture Reviews per Stripe monthly billing period
= PROVISIONAL LAUNCH CONFIGURATION

Immediate Production paid switch
= NOT YET

Production paid Architecture Review
= DISABLED / FAIL-CLOSED until release gates pass

W01 Pass B
= BLOCKED

Production Verified
= NO

Sprint Complete
= NO

Gate A
= NOT REACHED

Additional Stage 1.5 capability
= NONE SELECTED

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED
```

The provider-backed Architecture Review is intentionally not a free API surface. A user must have a server-verified active paid entitlement and remaining server-enforced quota before provider invocation. Deterministic free-core capabilities remain independently useful and must not depend on billing, entitlement, quota, or provider availability.

The initial quota of 10 reviews per monthly billing period is an explicit 01 provisional launch configuration. It is not a durable Product contract and may be recalibrated after real usage/cost evidence without changing the free/paid boundary.

The evaluator-quality/API-budget blocker is no longer current. The active blocker is the mandatory Production paid/commercial verification path.

Commercial Validation Gate M0 remains separate from Stage/Gate promotion and is not reached by technical readiness or launch alone.

---

# 2. Active execution plan

Current working branch:

`codex/commercial-enablement-prep-20260905`

Current Draft PR:

`#35 — Prepare commercial enablement without activating paid Production`

The active sequencing decision is:

> Complete the current paid-access implementation through a final paid-launch candidate in Stripe Test Mode. Architecture Review remains paid-entitlement-only; provisional launch configuration is USD 12/month with quota 10 and the approved request-cost/provider-budget envelope. Public Production remains disabled.

This decision does **not** weaken the pricing-evidence requirements in `MONETIZATION_ARCHITECTURE.md` or ADR-0007. The quota is a provisional launch configuration explicitly authorized by 01; M0 and later recalibration still depend on real paid evidence.

## Phase A — C01 commercial readiness completion

Owner: `C01`

On the isolated commercial branch, complete as far as possible without inventing unresolved launch values:

- Production Auth readiness and fail-closed identity boundaries;
- hard paid-entitlement-only enforcement for provider-backed Architecture Review;
- Stripe subscription lifecycle / webhook / entitlement / Customer Portal readiness;
- monthly quota implementation with `includedReviews = 10` for the initial launch configuration;
- quota reservation/consume/release/idempotency/degraded-state hardening;
- request-cost guard using the approved 32,768-byte / 4,096-output-token / 250,000-micro-USD envelope and paid-review kill-switch integration readiness;
- WAF Production-verification runbook;
- provider project budget/alerts verification runbook for USD 20 warning / USD 40 critical / USD 50 hard monthly ceiling;
- Terms / Privacy / Support URL wiring and commercial degraded states;
- controlled financial QA / AC-30 runbook;
- secret-safe commercial readiness diagnostics;
- required tests and regressions.

Mandatory invariant during Phase A:

```text
ARCHITECTURE_REVIEW_PAID_ENABLED=false
main merge=PROHIBITED
Production activation=PROHIBITED
free deterministic core remains operational
```

## Phase B — 01 final launch configuration closure — COMPLETE

Owner: `01`

The following provisional launch inputs were supplied to C01 on 2026-09-05:

- USD 12.00/month in USD;
- quota 10 per confirmed monthly Stripe billing period;
- `gpt-5.6-sol`, 32,768 provider-input bytes, 4,096 output tokens, 4,000,000/20,000,000 micro-USD per million input/output tokens, and 250,000 micro-USD worst-case request ceiling;
- USD 20 warning / USD 40 critical / USD 50 hard monthly provider budget;
- Stripe Tax-ready Checkout with jurisdiction/registration still externally approved;
- month-to-month cancellation, no default prorated refund, support-mediated duplicate/error/material-failure refunds, and statutory rights preserved;
- existing Vercel project retained, Hobby → Pro immediately before Live/public enablement;
- live QA subscription cancellation and full refund with restricted metadata-only record.

Included monthly quota is already selected provisionally at **10 reviews per monthly billing period** and should not be reopened unless new safety evidence makes that value unreasonable before launch.

## Phase C — 02 only if a Product-facing specification gap remains

Owner: `02`, conditional

Use 02 only for unresolved user-visible behavior such as final price/tax/legal/support presentation. Do not reopen already-specified billing/auth/quota architecture merely because final values were selected.

## Phase D — C01 final configuration and launch-candidate revision

Owner: `C01`

Apply only the approved final values/configuration and finish any resulting implementation changes on the same isolated branch. Paid Production remains disabled.

## Phase E — W01 fresh Pass A

Owner: `W01`

Run independent QA on the **exact final branch revision** after all behavior/configuration changes are complete. Prior QA is not sufficient if PR #35 changed code/behavior afterward.

## Phase F — C01 merge/release exact QA-approved revision

Owner: `C01`

Merge/release only the exact W01-approved revision through required CI/protection and only when commercial launch prerequisites are ready.

## Phase G — controlled Production paid enable + W01 Pass B

Owners: `C01` for controlled release/config action, then `W01` for independent verification

Only after the correct Production revision and external prerequisites are live:

```text
ARCHITECTURE_REVIEW_PAID_ENABLED=true
→ paid entitlement + quota=10 enforced server-side
→ W01 Pass B / AC-30 immediately
```

If the paid Production path fails or blocks, disable paid Architecture Review again. Enabling alone is not Production Verified.

## Phase H — Sprint closure and next selection

```text
W01 Production Verified
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

No Stage 1.5/Stage 2 capability is automatically selected by commercial enablement.

---

# 3. Active blocker

```text
Blocker:
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER

Related durable risks:
R-008 / R-020 / R-021
```

Known current facts:

- Stage 1 implementation and paid-access controls are released;
- Production paid Architecture Review remains disabled / fail-closed;
- deterministic free core remains operational;
- W01 Pass B cannot complete until the real paid path and external commercial prerequisites are available;
- the intended public provider-backed Architecture Review path is paid-entitlement-only;
- the provisional initial quota is 10 reviews per monthly billing period.

Remaining launch prerequisites include, as applicable:

- commercial-use-eligible hosting/account;
- approved final Price / currency;
- approved numeric request-cost guard and provider budget controls;
- active monthly Stripe Price and bounded Customer Portal configuration;
- Terms / Privacy / Support / refund / tax operational path;
- Production Supabase Auth email delivery/redirect configuration;
- controlled QA account and approved financial handling;
- Production WAF configuration and verification path.

Smallest safe response:

> Continue the existing commercial branch through a complete paid-launch candidate, enforce paid entitlement + quota before provider invocation, use the provisional quota of 10/month, keep unresolved final values fail-closed, and perform fresh independent QA before merge/release.

Re-check condition:

The exact final launch-candidate revision and all required external commercial prerequisites are ready for independent W01 verification without entitlement/quota bypasses.

---

# 4. Current execution board

| Work / decision | State | Next owner/action |
|---|---|---|
| Stage 1 Architecture Review + Paid Access | QA Complete / released / Production Verification BLOCKED | Keep Production paid path disabled until final launch candidate and W01 verification are ready |
| Commercial enablement implementation | **ACTIVE — PROCEED TO PAID LAUNCH CANDIDATE** | `C01` completes Phase A on Draft PR #35 |
| Paid API boundary | **SELECTED** | Provider-backed review requires authenticated active paid entitlement + remaining quota |
| Initial included quota | **SELECTED — PROVISIONAL** | 10 reviews per monthly billing period |
| Final Price / Currency / numeric economics | **NOT YET CLOSED** | `01` Phase B after implementation readiness |
| Product-facing final commercial UX gap | **CONDITIONAL** | `02` only if Phase B leaves an unresolved specification gap |
| Fresh independent pre-release QA | **NOT YET** | `W01` after final configuration on exact final revision |
| Commercial Validation Gate M0 | **NOT REACHED** | Evaluate only after Paid Access is Production Verified and sufficient real paid evidence exists |
| Stage 1.5 / Stage 2 selection | **NONE / NOT SELECTED** | Remain unchanged until the normal post-Sprint 01 Gate/selection review |

---

# 5. Planning reconciliation checkpoint

At material lifecycle/blocker/gate/release/Production-verification changes, `00` re-checks live reality and updates, only where meaning changed:

```text
docs/CURRENT_STATE.md
docs/roadmap/PROGRAM_BOARD.md
docs/roadmap/RISK_REGISTER.md
```

Do not update these files for every commit, CI run, transient metric, or Preview deployment.

Keep responsibilities separate:

- Program Board = near-term execution order / blocker / next owner;
- Current State = concise snapshot;
- Risk Register = durable risk definitions/states;
- Master Roadmap / Execution Gates = long-term sequence and promotion authority;
- active packet = implementation contract.

---

# 6. Coordination discipline

Current canonical path:

```text
Stage 1 QA Complete / released
→ W01 Pass B BLOCKED
→ 01 PROCEED_TO_PAID_LAUNCH_CANDIDATE
→ C01 commercial readiness + paid-only + quota 10/month
→ 01 final Price/Currency/economics/launch closure
→ 02 only if final Product-facing spec gap remains
→ C01 final launch-candidate revision
→ W01 fresh Pass A
→ C01 merge/release exact approved revision
→ controlled paid Production enable
→ W01 Pass B / AC-30
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Rules:

- Stage order is dependency direction, not an automatic implementation queue.
- `Gate A = NOT REACHED` while Stage 1 is not Production Verified.
- `Gate B = NOT REACHED`; Stage 2 remains `NOT SELECTED`.
- AI Authority and Mutation Authority remain unchanged until an applicable gate explicitly changes them.
- M0 is separate from evaluator authority/stage promotion.
- Do not grow this board into a historical archive; completed detail belongs in packets/PRs/ADRs/evidence documents.
