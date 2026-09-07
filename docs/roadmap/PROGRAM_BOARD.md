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

The recorded reconciliation on 2026-09-06 established two distinct statuses. These are scoped baseline claims, not a fresh verification of today's Production:

```text
Commercial-enablement preparation release — PR #35
= MERGED
+ PAID-OFF PRODUCTION VERIFIED

Stage 1 Architecture Review / Paid Access public launch lifecycle
= OPEN
+ PAID PRODUCTION NOT ENABLED
+ PAUC AC-30 NOT COMPLETE
```

The scoped PR #35 release identity and candidate/release tree comparison are retained in `docs/CURRENT_STATE.md`, sections 1 and 3. Reuse that evidence by reference rather than treating the old SHA as latest main. Later behavior-changing releases require their own QA/release evidence; PR #35 approval does not cover them automatically.

Commercial state remains:

```text
Commercial Enablement Decision
= PROCEED_TO_PAID_LAUNCH_CANDIDATE

Paid Architecture Review access boundary
= AUTHENTICATED ACTIVE PAID ENTITLEMENT ONLY
+ REMAINING SERVER-ENFORCED QUOTA REQUIRED

Provisional launch configuration
= USD 12.00 / month
= 10 Architecture Reviews per confirmed monthly Stripe billing period

Production paid Architecture Review
= DISABLED / FAIL-CLOSED

Production offer
= enabled=false
= price=null
= includedReviews=null
= policyUrls=null

Paid Access Production Verified under AC-30
= NO

Current commercial Sprint Complete
= NO

Commercial Validation Gate M0
= NOT REACHED

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

The scoped preparation-release Production Verification does **not** satisfy PAUC AC-30. AC-30 requires the real Production Stripe subscription → entitlement → quota reservation → valid review consume path plus a non-consumption failure path with a controlled QA account.

Commercial Validation Gate M0 remains separate from Stage/Gate promotion and is not reached by technical readiness or launch alone.

---

# 2. Active execution plan

## Packet index

`Specified` in packet headers describes specification maturity, not current release completion. The lifecycle below reflects the recorded coordination baseline; live repository/Production evidence wins.

| Packet | Role in current plan | Recorded lifecycle / remaining work |
|---|---|---|
| `AGS-EGAI-AR-V0-P1` | Base Architecture Review contract | Stage 1 lifecycle open; paid access amendment also applies |
| `AGS-EGAI-AR-PAUC-V0-P1` | Active paid access/control contract | Preparation released; external readiness and live AC-30 remain open |
| `AGS-EGAI-AR-COMMERCIAL-POLICY-UX-V0-P1` | Coupled policy UX amendment | Preparation code implemented; public content/approval and launch evidence remain prerequisites |
| `AGS-CREWAI-STATIC-IMPORT-V0-P1` | Completed capability contract / regression reference | Recorded Sprint Complete / Production Verified; not new implementation scope |
| `AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1` | Completed UX contract / regression reference | Recorded Sprint Complete / Production Verified; not new implementation scope |

All packet paths are under `docs/specs/`. This index does not grant new QA approval or supersede packet Acceptance Criteria.

The earlier branch/PR preparation sequence is complete. PR #35 is merged and is no longer the active Draft PR.

00 classifies the merged preparation release as a **completed sub-release / milestone inside the already-selected commercial Sprint**. The paid-launch lifecycle remains part of the same selected packet because the PAUC specification and launch runbook already require live paid enablement and AC-30 before Paid Access can become Production Verified and the Sprint can close.

Reclassifying controlled paid enablement / AC-30 as an unrelated future packet would silently weaken the existing gate semantics and is therefore not done by 00.

## Phase A — Commercial readiness implementation — COMPLETE

Owner: `C01`

PR #35 contains the selected commercial preparation implementation, including:

- Production Auth / fail-closed identity boundaries;
- hard paid-entitlement-only provider access;
- Stripe subscription lifecycle / webhook / entitlement / Customer Portal readiness;
- monthly quota implementation with initial `includedReviews = 10`;
- quota reservation/consume/release/idempotency/degraded-state hardening;
- request-cost guard and paid-review kill-switch integration readiness;
- WAF and provider-budget Production-verification runbooks;
- Terms / Privacy / Support URL wiring and commercial degraded states;
- controlled financial QA / AC-30 runbook;
- secret-safe commercial readiness diagnostics;
- required tests and regressions.

The public Production switch remains false.

## Phase B — 01 provisional commercial configuration closure — COMPLETE

Owner: `01`

The approved provisional launch inputs remain:

- USD 12.00/month in USD;
- quota 10 per confirmed monthly Stripe billing period;
- `gpt-5.6-sol`, 32,768 provider-input bytes, 4,096 output tokens, 4,000,000/20,000,000 micro-USD per million input/output tokens, and 250,000 micro-USD worst-case request ceiling;
- USD 20 warning / USD 40 critical / USD 50 hard monthly provider budget;
- Stripe Tax-ready Checkout with jurisdiction/registration still externally approved;
- month-to-month cancellation, no default prorated refund, support-mediated duplicate/error/material-failure refunds, and statutory rights preserved;
- existing Vercel project retained, with commercial-use hosting eligibility required before public paid enablement;
- live QA subscription cancellation and full refund with restricted metadata-only record.

These are launch configuration, not Commercial Validation Gate M0 evidence or permanent Product constants.

## Phase C — Product-facing commercial policy UX closure — COMPLETE FOR PREPARATION CODE

Owner: `02` specification / `C01` implementation

`AGS-EGAI-AR-COMMERCIAL-POLICY-UX-V0-P1.md` is implemented in the preparation release. External hosted Terms / Privacy / Support content and merchant/legal/privacy/tax/support approvals remain Production prerequisites.

Return to `01` only if external approval requires a Product/commercial semantic change. Return to `02` only if that decision creates a new user-visible specification gap.

## Phase D — W01 Pass A on final preparation candidate — COMPLETE

Owner: `W01`

Approved candidate:

`107f2db9ac7d9b4f6c02f708ebe7a343b14b00ed`

## Phase E — C01 preparation merge/release — COMPLETE

Owner: `C01`

The exact approved candidate tree was merged as:

`6c026189657c8211dd1b5922119a252d3335e705`

The candidate-to-released-main file diff is empty. Required main CI passed.

## Phase F — W01 paid-off Production verification — COMPLETE

Owner: `W01`

Result:

```text
PASS_B_WITH_NOTES
```

Verified scope:

- correct main / released tree identity;
- correct Vercel Production deployment and SHA equality;
- paid offer disabled/fail-closed;
- no public price/quota/policy links or Subscribe CTA;
- free deterministic core preserved;
- no relevant observed runtime errors/secrets in the reviewed evidence.

This completes the **preparation sub-release only**.

## Phase G — External prerequisites + controlled Production paid enablement — PENDING / BLOCKED

`00` coordinates the checklist below. Owner means responsibility for obtaining evidence, not permission to approve merchant decisions or bypass independent verification. Actual account/merchant operators must be identified before an external action. Each row starts **UNVERIFIED** in this planning review: no new evidence was checked here; configuration is not necessarily absent.

| Item | Evidence coordinator / approver | Next action and completion evidence | Contract |
|---|---|---|---|
| Release identity | C01 / W01 verifies | Reconcile latest main and later changes against the exact QA-approved revision; record fresh deployment identity and required checks | Runbook §§2, 7 |
| Hosting eligibility | 00 + account owner / W01 verifies | Obtain current account/plan eligibility evidence for intended commercial use | Runbook §2 |
| Public policies and operations | 00 + merchant/operator / 01 for changed Product semantics | Identify approvers; obtain approved public URLs and merchant/privacy/tax/refund/support approvals | Policy UX packet §16; runbook §2 |
| Production Auth | C01 + account operator / W01 verifies | Record controlled-account magic-link delivery and allowed-redirect results without secrets | Runbook §2 |
| Stripe configuration | C01 + merchant/operator / W01 verifies | Verify Live Price/Portal settings and Test Mode lifecycle evidence; real paid-path proof remains Phase H | Runbook §§2, 4, 6 |
| Provider controls | C01 + provider-account operator / W01 verifies | Record budget, notification, hard-ceiling, cost-guard and controlled kill-switch evidence | Runbook §3 |
| WAF | C01 + hosting operator / W01 verifies | Record rule configuration and controlled effectiveness evidence | Runbook §5 |
| Financial QA readiness | 00 + merchant/operator / W01 executes | Obtain controlled-user and charge/cancel/refund handling approval before Phase H | Policy UX EPP-07; runbook §6 |

For each item, `00` records `state / named operator / evidence reference / verified-at / next action / re-check date` in the restricted release record. Use UNVERIFIED, BLOCKED (with reason), or VERIFIED; do not invent completion dates or claim verification from configuration alone. Keep secrets, personal data, and financial references out of this public board. Re-check dates are agreed with the operator. The runbook owns procedures; this table only routes work and evidence.

Rows may be prepared independently where dependencies permit. Paid enablement still waits for all pre-enable requirements; Test Mode is not AC-30. If safe verification needs a new procedure, resolve it explicitly instead of bypassing it or marking it complete.

The following must be evidenced before the defined C01 enablement action is executable:

- commercial-use hosting eligibility;
- approved public Terms / Privacy / Support content and merchant/legal/privacy/tax/refund/support operations;
- Production Supabase Auth delivery/redirect readiness and controlled QA account;
- Stripe Live monthly Price / Portal / webhook-reconciliation lifecycle;
- Production WAF configuration/effectiveness;
- Production provider budget / alert / hard-ceiling evidence;
- controlled entitled-user kill-switch evidence;
- approved live financial QA handling.

Once those prerequisites are ready and no Product semantics changed, owner is `C01` for the already-defined controlled configuration/release action:

```text
ARCHITECTURE_REVIEW_PAID_ENABLED=true
→ paid entitlement + quota=10 enforced server-side
→ no unrelated feature changes
```

If any prerequisite changes Product/commercial semantics or launch scope, route to `01` first; use `02` only for a resulting Product-facing specification gap.

## Phase H — W01 live paid Production verification / AC-30 — PENDING

Owner: `W01`

W01 must independently execute the real Production financial QA defined by `docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md`, including the live Stripe subscription → entitlement → quota → valid consume path, a non-consumption failure path, WAF/kill-switch checks, and free-core smoke.

A failed or incomplete AC-30 means Paid Access is not Production Verified and the paid switch must return to fail-closed if safety/accounting is uncertain.

## Phase I — Sprint closure and next selection

```text
W01 Paid Access Production Verified / AC-30 PASS
→ 00 Sprint Complete review
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

- PR #35 preparation code is merged and paid-off Production Verified;
- Production paid Architecture Review remains disabled / fail-closed;
- deterministic free core remains operational;
- provisional price, quota, request-cost envelope, and provider-budget thresholds are selected;
- the real paid Production entitlement/quota/financial path is not Production Verified;
- the Vercel team currently reports Hobby, so intended public commercial-use hosting eligibility remains unresolved until independently verified/approved;
- PAUC AC-30 has not been completed.

Remaining launch prerequisites include, as applicable:

- commercial-use-eligible hosting/account;
- public Terms / Privacy / Support reachability plus merchant/legal/privacy/tax/refund/support approval;
- Production Supabase Auth email delivery/redirect configuration;
- active Stripe Live monthly Price and bounded Customer Portal configuration;
- live webhook/reconciliation lifecycle evidence;
- controlled QA account and approved financial handling;
- Production WAF configuration and verification path;
- provider budget/alert/hard-ceiling evidence;
- controlled kill-switch exercise;
- W01 live paid financial QA / AC-30.

Smallest safe response:

> Keep the preparation release live with paid review fail-closed. Do not reopen already-specified Product configuration. Close the remaining external Production prerequisites; then let C01 perform only the defined controlled paid-enable/configuration action and let W01 independently execute AC-30.

Re-check condition:

All external launch prerequisites and the exact controlled paid-enable configuration are ready for independent W01 live verification without entitlement/quota bypasses.

---

# 4. Current execution board

| Work / decision | State | Next owner/action |
|---|---|---|
| Commercial-enablement preparation release — PR #35 | **COMPLETE / PAID-OFF PRODUCTION VERIFIED** | Remains fail-closed; no reopening without a real change |
| Public paid Architecture Review launch | **BLOCKED / NOT ENABLED** | Close external Production prerequisites before enablement |
| Paid API boundary | **SELECTED** | Authenticated active paid entitlement + remaining quota required |
| Public price / currency | **SELECTED — PROVISIONAL** | USD 12.00/month; reassess only from later evidence or new safety/commercial input |
| Initial included quota | **SELECTED — PROVISIONAL** | 10 reviews per confirmed monthly billing period |
| Request-cost / provider budget profile | **SELECTED — PROVISIONAL; LIVE EVIDENCE PENDING** | Verify Production provider controls before enablement |
| Product-facing commercial policy UX | **SPECIFIED + IMPLEMENTED; EXTERNAL CONTENT/APPROVAL PENDING** | `01`/`02` only if external approval changes Product-facing semantics |
| W01 preparation Pass A | **COMPLETE** | candidate `107f2db9…` |
| W01 paid-off preparation Pass B | **COMPLETE — PASS_B_WITH_NOTES** | scoped preparation milestone only |
| Controlled paid enablement | **NOT READY** | `C01` after prerequisites are evidenced |
| Live financial QA / PAUC AC-30 | **NOT COMPLETE** | `W01` after controlled paid enablement/evidence is ready |
| Commercial Validation Gate M0 | **NOT REACHED** | Evaluate only after Paid Access is Production Verified and sufficient real paid evidence exists |
| Gate A | **NOT REACHED** | no promotion from preparation release alone |
| Stage 1.5 / Stage 2 selection | **NONE / NOT SELECTED** | remain unchanged until the normal post-Sprint 01 Gate/selection review |

---

# 5. Planning reconciliation checkpoint

## Planning work while launch is blocked

`01` may prepare an evidence inventory and candidate comparison under Execution Gates §2 without declaring Gate A reached. First reuse existing formal evaluation and implementation evidence, recording revision/model/rubric, coverage, limitations, and gaps. Check any claimed UX gap against the completed Product Identity & Review Journey packet; do not reselect existing Locate/return behavior as new work.

The next planning output is a bounded evidence/gap summary, not an automatic feature backlog. If evidence justifies independent hardening/foundation work, `01` must explicitly select it, preserve the open commercial Sprint and AC-30 obligations, and route it through `02` before C01 implementation. Otherwise record DEFER and the evidence needed to revisit. Formal Gate A retains its Production prerequisite; M0 paid-sample collection is separate. No new feature, AI authority, mutation authority, or paid provider run is authorized here.

## Reconciliation ownership

At material lifecycle/blocker/gate/release/Production-verification changes, `00` re-checks live reality and updates, only where meaning changed:

```text
docs/CURRENT_STATE.md
docs/roadmap/PROGRAM_BOARD.md
docs/roadmap/RISK_REGISTER.md
```

No Risk Register state change is required by the preparation release itself: R-008 and R-021 remain blocking for public paid launch, and R-020 remains applicable until the live billing/entitlement/quota lifecycle is independently verified.

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
PR #35 preparation release
= MERGED + PAID-OFF PRODUCTION VERIFIED

→ external commercial / hosting / Auth / Stripe / WAF / provider-control prerequisites
→ C01 controlled paid-enable/configuration action
→ W01 live paid Production Verification / AC-30
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Conditional routing:

```text
new Product/commercial semantic decision required
→ 01

resulting Product-facing specification gap
→ 02

otherwise
→ do not reopen 01/02 merely because external configuration evidence is pending
```

Rules:

- Preparation release Production Verified is not Paid Access AC-30 Production Verified.
- Stage order is dependency direction, not an automatic implementation queue.
- `Gate A = NOT REACHED` while the selected Stage 1 paid-access lifecycle is not fully Production Verified and Gate A evidence review has not occurred.
- `Gate B = NOT REACHED`; Stage 2 remains `NOT SELECTED`.
- AI Authority and Mutation Authority remain unchanged until an applicable gate explicitly changes them.
- M0 is separate from evaluator authority/stage promotion.
- Do not grow this board into a historical archive; completed detail belongs in packets/PRs/ADRs/evidence documents.
