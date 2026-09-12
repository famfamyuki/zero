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

A separate bounded launch-hardening packet is now selected for the GPT-6 Astra Challenge:

```text
GPT-6 Astra Challenge Launch Hardening
= SELECTED
= Implementation Complete (C01 self-verification, 2026-09-12)
= target Product Hunt launch 2026-09-18
= free-core / first-value / presentation hardening only
= no paid-launch bypass
= no Stage/Gate promotion
= AI Authority UNCHANGED
= Mutation Authority UNCHANGED
```

This selection does not reclassify the still-open commercial Sprint, satisfy PAUC AC-30, reach Gate A or M0, or select Stage 1.5/Stage 2. It is a time-boxed parallel packet whose purpose is to make current implemented value easier to understand and verify for the launch deadline.

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
| `AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1` | Time-boxed free-core launch hardening for the September 18 GPT-6 Astra Challenge | **Implementation Complete** by `C01` on 2026-09-12; next owner `W01` Pass A for independent QA of the exact candidate; not QA-approved or released |
| `AGS-CREWAI-STATIC-IMPORT-V0-P1` | Completed capability contract / regression reference | Recorded Sprint Complete / Production Verified; not new implementation scope |
| `AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1` | Completed UX contract / regression reference | Recorded Sprint Complete / Production Verified; not new implementation scope |

All packet paths are under `docs/specs/`. This index does not grant new QA approval or supersede packet Acceptance Criteria.

The earlier branch/PR preparation sequence is complete. PR #35 is merged and is no longer the active Draft PR.

00 classifies the merged preparation release as a **completed sub-release / milestone inside the already-selected commercial Sprint**. The paid-launch lifecycle remains part of the same selected packet because the PAUC specification and launch runbook already require live paid enablement and AC-30 before Paid Access can become Production Verified and the Sprint can close.

Reclassifying controlled paid enablement / AC-30 as an unrelated future packet would silently weaken the existing gate semantics and is therefore not done by 00.

## Parallel bounded packet — GPT-6 Astra Challenge Launch Hardening — Implementation Complete

Owner flow:

```text
01 Selected
→ 02 specification
→ C01 implementation only after Specified
→ W01 independent QA for behavior changes
→ C01 exact approved release
→ W01 Production verification
→ 00 bounded packet Sprint Complete
```

Authoritative selection packet:

- `docs/specs/AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1.md`

The packet is intentionally narrower than a roadmap-stage promotion. It may harden the current free-core first-value path, representative demo continuity, truthful launch attribution/metadata, responsive/accessibility behavior, and changed-path Production confidence. It must not add Astra as a contest-driven runtime dependency, enable paid Architecture Review, pull Stage 1.5/Stage 2 forward, expand AI/Mutation authority, add persistence/runtime verification, or bypass the open commercial blocker.

`02` specified the packet; `C01` completed implementation and required self-verification. The exact candidate goes to `W01` Pass A. See [C01 implementation evidence](../harness/ASTRA_LAUNCH_IMPLEMENTATION.md). Independent QA and candidate Production verification remain pending.

This parallel packet is permitted without closing the commercial Sprint because Program Board planning already allows explicitly selected independent hardening/foundation work while launch is blocked, provided the paid Sprint and AC-30 obligations remain explicit and unchanged.

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

`00` coordinates the evidence matrix below. Owners obtain evidence; they do not acquire merchant approval or W01 authority. Named account/merchant operators must be recorded before external action. Rows are **UNVERIFIED** unless explicitly **BLOCKED / procedure unresolved**; this review verifies no external readiness.

Evidence classes: **A** = configuration / external approval; **B** = non-Production Test Mode demonstration; **C** = Production paid-off demonstration; **D** = Live demonstration after authorized controlled enablement / AC-30. Class D is not an executable workaround for an unmet Phase G prerequisite.

| Class / item | Environment and prerequisites | Owner / independent verifier | Completion evidence and authoritative procedure |
|---|---|---|---|
| A — Release identity | Exact current candidate; Preview, then paid-off Production after normal protected PR release | C01 / W01 | Required checks, exact QA-approved change set, READY/target/domain/main-to-deployment SHA evidence; runbook §§2, 7. PR #35 approval does not cover current head or later behavior changes |
| A — Hosting eligibility | Production account; named account owner and intended commercial scope | 00 + account owner / W01 | Current plan/account commercial-use eligibility; runbook §2 |
| A — Public policies / operations | Public HTTPS destinations; named merchant/privacy/tax/refund/support approvers | 00 + responsible external approvers / W01 | Approved content/URLs, ownership, launch geography and operational approvals; Policy UX packet §16 EPP-01–06, runbook §2 |
| A — Stripe Live configuration | Production-linked Live account; approved monthly offer and merchant/tax inputs | C01 + merchant/operator / W01 | Active monthly Price, bounded Portal and Tax configuration evidence; runbook §2. Configuration alone proves no webhook lifecycle |
| A — Provider controls | Dedicated Production provider project; approved cost profile and named alert recipients | C01 + provider-account operator / W01 | Budget/warning/critical/hard-ceiling configuration, matching model/cost profile, exercised notification path; runbook §3. No inferred request rejection or kill-switch proof |
| A — Financial QA approval | Before any Live charge; controlled QA user and named operator able to cancel/refund | 00 + financial operator / W01 checks approval | Written charge/cancel/full-refund handling approval; Policy UX EPP-07, runbook §6 |
| B — Test Mode lifecycle | Isolated local/Preview Test Mode environment; configured test Price/Portal and test identity, public Production remains paid-off | C01 + test-account operator / W01 | Test Mode Checkout, signed reconciliation, quota, consume/release, replay, cancellation/recovery outcomes; runbook §4 and PAUC §23. Command success alone is not full lifecycle evidence or AC-30 |
| B — Cost guard / entitled kill switch | Non-Production test environment with legitimate Test Mode entitlement; enabled test path for reservation/rejection, disabled test path for kill switch | C01 / W01 | Zero provider calls, reservation release for cost rejection; `review_disabled`, zero quota change and free-core smoke for kill switch; runbook §§3–4, PAUC §§22–23. Does not resolve the first-launch prerequisite below |
| C — Production Auth | Production paid-off; approved Auth delivery/redirect setup and controlled account | C01 + Auth operator / W01 | Magic-link delivery/session and allowed-redirect evidence without secrets; runbook §2 |
| C — WAF / disabled baseline | Production paid-off; approved live WAF rule and controlled source | C01 + hosting operator / W01 | Rule scope/threshold and edge-block effectiveness, zero provider/reservation/consumption, disabled review/Checkout and free-core smoke; runbook §§3–5. An unentitled disabled baseline is not entitled-user or cost-guard proof |
| C required, D path only — First Live entitlement / webhook lifecycle | First Production launch with no pre-existing legitimate Live entitlement; paid-off Checkout stops at `review_disabled` | **BLOCKED / procedure unresolved — 01 decision, 02 procedure specification; 00 tracks; W01 re-QA** | Phase G requires Live reconciliation evidence, but runbook §6 steps 3–5 obtains it only after enablement. Closure requires the approved first-launch procedure and then actual signed Live reconciliation/period/quota evidence; see runbook §1.1 |
| Pre-enable environment unresolved — Entitled kill switch / cost guard | Production first-launch proof needs legitimate Live entitlement; paid-off cannot reach reservation/cost guard. B evidence is separate | **BLOCKED / procedure unresolved — 01 decision, 02 procedure specification; C01 implements only if specified; W01 verifies** | Safe environment/order and first entitlement source remain undefined. Required proof remains zero calls + reservation release for cost rejection, and zero calls/quota change + free-core smoke for entitled kill switch; runbook §§1.1, 3, 6 step 12 |
| D — Live financial QA / AC-30 | Production only after Phase G blockers and prerequisites are resolved and controlled enablement is authorized; approved charge handling | W01 + authorized financial/account operators | Entire runbook §6 / PAUC §24, including real subscription → entitlement → reservation → valid consume, non-consumption failure, lifecycle/abuse/kill-switch checks, cancellation/full refund and §7 identity evidence. Not executable while first-launch procedure is unresolved |

For each row, `00` records `state / named operator / environment / prerequisite evidence / evidence reference / verified-at / next action / re-check date` in the restricted release record. Use UNVERIFIED, BLOCKED (with reason), or VERIFIED; keep secrets, personal data, and financial references out of this public board. The runbook owns procedures; this matrix only routes evidence and explicit gaps.

**Pre-enable requirements remain mandatory:** all A approvals/configuration and release evidence; B Test Mode lifecycle/control evidence; C Production Auth, WAF/effectiveness and paid-off baseline; Production provider budget/alert/hard-ceiling evidence; and the required Live webhook-reconciliation lifecycle, controlled entitled-user kill-switch and cost-guard evidence. The two rows marked procedure unresolved cannot be marked VERIFIED from B or an unentitled C baseline. Phase G is therefore **BLOCKED**, not ready to enable and gather missing prerequisites afterward. Phase H remains mandatory after authorized enablement; Test Mode never substitutes for AC-30.

**Decision request to 01 / 02:** resolve the circular first-launch dependency documented in runbook §1.1: identify a permitted first Live entitlement acquisition path and the environment/order for pre-enable Live lifecycle, entitled kill-switch and cost-guard proof. `01` owns any safety/sequencing/Product boundary decision; `02` must specify the resulting operational/release procedure and acceptance evidence, including containment, operator authority, abort/disable/re-enable conditions, and financial handling. If no compliant procedure is defined, retain BLOCKED and paid-off. This documentation fix neither selects such a procedure nor moves/deletes a prerequisite. W01 independently reviews the resulting exact revision before C01 can use it.

Once those prerequisites are ready and no Product semantics changed, owner is `C01` for the already-defined controlled configuration/release action:

```text
ARCHITECTURE_REVIEW_PAID_ENABLED=true
→ paid entitlement + quota=10 enforced server-side
→ no unrelated feature changes
```

If any prerequisite changes Product/commercial semantics, safety boundaries, or launch sequencing/scope, route to `01` first and to `02` for the resulting specification/procedure gap. The first-launch decision request above must be resolved before the enablement action is executable.

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

> Keep the preparation release live with paid review fail-closed. Do not reopen already-specified Product configuration. Resolve the first-launch procedure blockers through 01/02 and close the remaining external Production prerequisites; then let C01 perform only the defined controlled paid-enable/configuration action and let W01 independently execute AC-30.

Re-check condition:

All external launch prerequisites and the exact controlled paid-enable configuration are ready for independent W01 live verification without entitlement/quota bypasses.

---

# 4. Current execution board

| Work / decision | State | Next owner/action |
|---|---|---|
| Commercial-enablement preparation release — PR #35 | **COMPLETE / PAID-OFF PRODUCTION VERIFIED** | Remains fail-closed; no reopening without a real change |
| Public paid Architecture Review launch | **BLOCKED / NOT ENABLED** | Close external Production prerequisites before enablement |
| GPT-6 Astra Challenge launch hardening | **Implementation Complete / INDEPENDENT QA PENDING** | `W01` Pass A independently verifies the exact C01 candidate; no paid/Stage/authority expansion |
| Paid API boundary | **SELECTED** | Authenticated active paid entitlement + remaining quota required |
| Public price / currency | **SELECTED — PROVISIONAL** | USD 12.00/month; reassess only from later evidence or new safety/commercial input |
| Initial included quota | **SELECTED — PROVISIONAL** | 10 reviews per confirmed monthly billing period |
| Request-cost / provider budget profile | **SELECTED — PROVISIONAL; LIVE EVIDENCE PENDING** | Verify Production provider controls before enablement |
| Product-facing commercial policy UX | **SPECIFIED + IMPLEMENTED; EXTERNAL CONTENT/APPROVAL PENDING** | `01`/`02` only if external approval changes Product-facing semantics |
| W01 preparation Pass A | **COMPLETE** | candidate `107f2db9…` |
| W01 paid-off preparation Pass B | **COMPLETE — PASS_B_WITH_NOTES** | scoped preparation milestone only |
| Controlled paid enablement | **BLOCKED / PROCEDURE UNRESOLVED** | `01`/`02` resolve Phase G first-launch dependency; `C01` only after approved procedure and prerequisite evidence |
| Live financial QA / PAUC AC-30 | **NOT COMPLETE** | `W01` after controlled paid enablement/evidence is ready |
| Commercial Validation Gate M0 | **NOT REACHED** | Evaluate only after Paid Access is Production Verified and sufficient real paid evidence exists |
| Gate A | **NOT REACHED** | no promotion from preparation release or challenge launch alone |
| Stage 1.5 / Stage 2 selection | **NONE / NOT SELECTED** | remain unchanged until the normal post-Sprint 01 Gate/selection review |

---

# 5. Planning reconciliation checkpoint

## Planning work while launch is blocked

`01` may prepare an evidence inventory and candidate comparison under Execution Gates §2 without declaring Gate A reached. First reuse existing formal evaluation and implementation evidence, recording revision/model/rubric, coverage, limitations, and gaps. Check any claimed UX gap against the completed Product Identity & Review Journey packet; do not reselect existing Locate/return behavior as new work.

The next planning output is a bounded evidence/gap summary, not an automatic feature backlog. If evidence justifies independent hardening/foundation work, `01` must explicitly select it, preserve the open commercial Sprint and AC-30 obligations, and route it through `02` before C01 implementation. Otherwise record DEFER and the evidence needed to revisit. Formal Gate A retains its Production prerequisite; M0 paid-sample collection is separate. No new feature, AI authority, mutation authority, or paid provider run is authorized here.

The GPT-6 Astra Challenge launch-hardening selection is one such explicitly selected bounded hardening packet. Its external September 18 deadline does not broaden its Product authority: `02` still owns specification, `C01` must not invent future capability, and behavior-changing work still requires normal independent QA and Production verification.

## Reconciliation ownership

At material lifecycle/blocker/gate/release/Production-verification changes, `00` re-checks live reality and updates, only where meaning changed:

```text
docs/CURRENT_STATE.md
docs/roadmap/PROGRAM_BOARD.md
docs/roadmap/RISK_REGISTER.md
```

No Risk Register state change is required by the launch-hardening selection itself: it introduces no durable new risk class and does not change R-008, R-020, or R-021. Revisit the Risk Register only if specification/implementation introduces a material durable risk not already covered.

Do not update these files for every commit, CI run, transient metric, or Preview deployment.

Keep responsibilities separate:

- Program Board = near-term execution order / blocker / next owner;
- Current State = concise snapshot;
- Risk Register = durable risk definitions/states;
- Master Roadmap / Execution Gates = long-term sequence and promotion authority;
- active packet = implementation contract.

---

# 6. Coordination discipline

Current canonical paid-launch path:

```text
PR #35 preparation release
= MERGED + PAID-OFF PRODUCTION VERIFIED

→ external commercial / hosting / Auth / Stripe / WAF / provider-control prerequisites
→ C01 controlled paid-enable/configuration action
→ W01 live paid Production Verification / AC-30
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Parallel bounded launch-hardening path:

```text
AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1
= SELECTED

→ 02 Specified
→ C01 behavior-changing implementation + required checks
→ W01 independent QA
→ C01 exact approved release
→ W01 Production Verified
→ 00 bounded packet Sprint Complete
```

The parallel path must not merge with, bypass, or weaken the paid-launch prerequisites. Success at the Product Hunt challenge is not Stage promotion, Gate evidence by itself, Commercial Validation, or authority expansion.

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
