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

Two commercial statuses remain distinct:

```text
Commercial-enablement preparation release — PR #35
= MERGED
+ PAID-OFF PRODUCTION VERIFIED

Stage 1 Architecture Review / Paid Access public-launch lifecycle
= OPEN
+ PAID PRODUCTION NOT ENABLED
+ PAUC AC-30 NOT COMPLETE
```

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

The bounded Astra packet is complete:

```text
AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1
= SPRINT COMPLETE / PRODUCTION VERIFIED
= W01 PASS WITH NOTES
= free-core / first-value / presentation hardening only
= no paid-launch bypass
= no Stage/Gate promotion
= AI Authority UNCHANGED
= Mutation Authority UNCHANGED
```

Its verified release materially strengthens confidence in the existing deterministic/manual first-value loop, representative launch path, export continuity, responsive path, saved-work preservation, and fail-closed paid regression. It does **not** prove paid entitlement/billing/quota/provider behavior, PAUC AC-30, commercial willingness-to-pay, Gate A evaluator quality, Stage 1.5 need, Gate B readiness, Stage 2 readiness, AI-authority expansion, or mutation authority.

Post-Sprint `01` review on 2026-09-13 records:

```text
Evidence → Gate Review → Explicit Next Selection

Gate result
= DEFER PROMOTION / CONTINUE EXISTING STAGE 1 PAID LIFECYCLE

Explicit Next Selection
= NO NEW CAPABILITY / NO NEW ROADMAP PACKET
```

No new Product Sprint is manufactured while the already-selected commercial lifecycle remains open. The smallest sufficient next work is closure of the existing `COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER`. The first-Live sequencing decision is accepted in ADR-0011 and the operational amendment/runbook are now **Specified and released** by PR #59; execution remains blocked on Phase 0 evidence plus the required independent W01 release/containment verification.

Commercial Validation Gate M0 remains separate from Stage/Gate promotion and is not reached by technical readiness, Astra launch hardening, or launch participation alone.

---

# 2. Packet index

`Specified` in packet headers describes specification maturity, not release completion or execution readiness. Live repository/Production evidence wins.

| Packet | Role in current plan | Recorded lifecycle / remaining work |
|---|---|---|
| `AGS-EGAI-AR-V0-P1` | Base Architecture Review contract | Stage 1 lifecycle open; paid-access amendment applies |
| `AGS-EGAI-AR-PAUC-V0-P1` | Active paid access/control contract | Preparation released; first-Live amendment **Specified/released**; Phase 0 external readiness, W01 release/containment verification, controlled Live proofs, and AC-30 remain open |
| `AGS-EGAI-AR-COMMERCIAL-POLICY-UX-V0-P1` | Coupled policy UX amendment | Preparation code implemented; public content/approval and launch evidence remain prerequisites |
| `AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1` | Completed bounded free-core launch hardening | **Sprint Complete / Production Verified** on 2026-09-13; regression/history reference only |
| `AGS-CREWAI-STATIC-IMPORT-V0-P1` | Completed capability contract / regression reference | Sprint Complete / Production Verified |
| `AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1` | Completed UX contract / regression reference | Sprint Complete / Production Verified |

The paid-launch lifecycle remains part of the same already-selected Stage 1 work because the PAUC specification and launch runbook require live paid enablement and AC-30 before Paid Access can become Production Verified and the commercial Sprint can close. Reclassifying controlled paid enablement / AC-30 as an unrelated future packet would weaken existing gate semantics.

## Completed bounded packet — Astra Challenge Launch Hardening

Completed lifecycle:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Complete
→ W01 QA Complete
→ C01 exact approved release
→ W01 Production Verified
→ 00 Sprint Complete
```

Scoped completion evidence:

- W01-approved candidate: `5c3d6784d8b12bea48539ef1e8cd62c5000b9699`;
- released `main` at W01 verification: `3cdce0161fe00d38aca8ba8e2bd0949bbc5899d0`;
- candidate/released Git tree: `6710fba8e84e96012a0d3cf98439383ab8dc4ffe`;
- verified Production deployment: `dpl_Gu9mN3xJ61AxBZPdy2RXdKsfZ9py`, `READY`, `target=production`;
- W01 verified the primary Production alias and `GitHub main SHA = Vercel Production githubCommitSha` for that release;
- historical rejected candidate `a39918d` remains rejection history, not current status.

Remaining Astra Known Notes are non-blocking and are routed in §5; none expands the commercial Sprint or selects a new roadmap stage.

## First-Live procedure specification release — PR #59

PR #59 turned ADR-0011 into the authoritative implementation/operations-ready amendment and paid-launch runbook procedure without enabling paid Production.

Scoped release facts handed over by C01 and live-rechecked by `00` during this reconciliation:

- W01 Pass A: **PASS WITH NOTES / QA Complete** on approved head `a6c5990a5eff090c196ba65fb71a9f2971d37443`;
- released `main`: `157e33f064dbca75a3098392901f9017562106fb`;
- approved/released tree: `a5831dff58e46b5bd2210bc7bc83337cc572162c`;
- Vercel deployment `dpl_8N4W2xbeQU1k2XxZFQjShDmvSnCc` is live-observed `READY`, `target=production`, on the primary aliases with matching `githubCommitSha`;
- public Architecture Review offer remains live-observed `enabled=false`, `price=null`, `includedReviews=null`, `policyUrls=null`.

These are **release facts, not W01 Production Verified**. Because PR #59 materially changes Security/QA/Production operational authority, it is outside the pure-documentation maintenance fast path. W01 must independently perform the narrow post-release identity/baseline verification before this semantic documentation release is classified Production Verified. That check is distinct from later WAF containment verification, first-Live windows, and AC-30.

---

# 3. Commercial lifecycle

## Phase A–F — preparation milestone COMPLETE

The paid-off commercial preparation release is implemented, independently QA-approved, released, and Production Verified in its scoped fail-closed state. It includes the selected Auth/entitlement/quota/Stripe/provider-control/policy/runbook preparation. The public paid switch remains false.

The provisional launch inputs remain USD 12/month, 10 reviews per confirmed monthly billing period, the recorded request-cost/provider-budget profile, Stripe Tax-ready Checkout subject to external approval, approved cancellation/refund/support policy, commercial-use-eligible hosting before public paid enablement, and controlled live-QA cancellation/full refund handling. These are launch inputs, not M0 evidence or permanent Product constants.

## Phase G — external prerequisites + controlled Production paid enablement — PENDING / BLOCKED

`00` coordinates the evidence matrix. Named operators and restricted evidence records remain required. Rows are `UNVERIFIED`, `BLOCKED`, `PARTIAL`, or `VERIFIED`; secrets, personal data, source IPs, tokens, and financial details do not belong in this public board.

Evidence classes: **A** = configuration/external approval; **B** = non-Production Test Mode demonstration; **C** = Production paid-off demonstration; **D** = controlled Live Production demonstration. Test Mode does not substitute for AC-30.

The current states below reflect evidence available to `00` at this reconciliation only. External/account facts are not promoted to `VERIFIED` from documentation or past observations alone.

| Class / item | Current evidence state | Owner / verifier | Next concrete action |
|---|---|---|---|
| A — Release identity | **PARTIAL — C01/00 release facts observed; W01 post-release verification pending** | C01 / W01 | W01 independently confirm approved/released tree identity, main CI, READY/production/domain/SHA equality, and paid-off unchanged baseline for PR #59 |
| A — Hosting eligibility | **BLOCKED / UNVERIFIED** — current Vercel team plan label was live-observed as `hobby`; commercial-use eligibility is not inferred from that label alone | 00 + account owner / W01 | account owner supplies current commercial-use eligibility/plan-contract evidence; W01 verifies the evidence before any Live window |
| A — Public policies / operations | **UNVERIFIED** | 00 + responsible merchant/legal/privacy/tax/refund/support approvers / W01 | provide public HTTPS Terms/Privacy/Support reachability plus written approvals in restricted evidence record |
| A — Stripe Live configuration | **UNVERIFIED** | C01 + merchant/operator / W01 | verify the approved recurring USD 12 monthly Live Price, bounded Portal configuration, Stripe Tax configuration, and launch configuration without exposing secrets |
| A — Provider controls | **UNVERIFIED** | C01 + provider operator / W01 | verify dedicated Production provider project/key, warning/critical/hard ceiling, matching cost profile, and exercised alert path |
| A — Financial QA approval | **UNVERIFIED** | 00 + financial operator / W01 | obtain written authorization for the controlled charge, cancellation, and full-refund procedure and name the restricted operator |
| B — Test Mode lifecycle | **UNVERIFIED** | C01 + test operator / W01 | complete required Test Mode Checkout/webhook/reconciliation/quota/consume-release/replay/cancellation-recovery evidence under the runbook; not AC-30 |
| B — Cost guard / entitled kill switch | **UNVERIFIED** | C01 / W01 | prove the required non-Production control paths and synthetic cost-guard fixture before the corresponding Live proofs |
| C — Production Auth | **UNVERIFIED** | C01 + Auth operator / W01 | verify Production magic-link delivery/session/allowed redirects without recording personal/token values |
| C — WAF / paid-off baseline | **UNVERIFIED** — paid offer is currently observed fail-closed, but current published Firewall inventory/capacity/operator authority, QA source set, rate-limit effectiveness, and two-source containment evidence are not established | C01 + hosting operator / W01 | inspect current Firewall rule inventory/capacity and operator authority; establish stable exclusive QA source; verify paid-off rate-limit/free-core baseline; then stage §5 containment for W01 verification |
| D-bootstrap — first Live entitlement / webhook lifecycle | **SPECIFIED / EXECUTION BLOCKED** | 00 authorizes only after prerequisites; C01/config operators execute; W01 verifies | no Live action until all Phase 0 A/B/C prerequisites are VERIFIED, PR #59 release verification is accepted, and §5 QA containment is independently VERIFIED |
| D-bootstrap — entitled kill switch | **NOT READY** | W01 | after a legitimate Live QA entitlement exists and switch is returned false, prove `review_disabled`, zero provider invocation, zero quota mutation, free-core smoke |
| D-bootstrap — cost guard | **NOT READY** | W01 | after kill-switch proof PASS, use the second contained window to prove cost rejection before provider invocation and idempotent reservation release |
| D — Live financial QA / AC-30 | **NOT READY / NOT COMPLETE** | W01 + authorized operators | only after bootstrap proofs complete, execute the existing real subscription → entitlement → valid consume/non-consumption/cancellation/refund AC-30 sequence |

### First-Live sequencing and procedure — SPECIFIED / RELEASED; execution still blocked

`01` accepted `docs/decisions/ADR-0011-edge-contained-first-live-bootstrap.md` and `02` completed the authoritative procedure in:

- `docs/specs/AGS-EGAI-AR-PAUC-V0-P1-FIRST-LIVE-AMENDMENT-20260913.md`;
- `docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md`.

PR #59 released that specification to `main` without enabling paid Production.

The specified sequence is:

```text
all Phase 0 non-circular prerequisites VERIFIED
→ QA-only edge containment staged and W01-verified while paid-off
→ first bounded Live window: real app Checkout → signed Live webhook → legitimate entitlement/quota
→ switch false again
→ entitled kill-switch proof while fail-closed
→ second bounded Live window: cost-guard rejection before any successful provider review
→ switch false again
→ existing W01 AC-30 sequence
→ public transition only through later independent verification
```

Specification maturity and execution readiness are deliberately separate:

```text
Procedure = SPECIFIED / RELEASED
Execution readiness = BLOCKED
```

No route/firewall/config/Stripe/provider/entitlement/quota mutation is authorized from specification status alone. Phase G remains blocked until the Phase 0 evidence is actually VERIFIED and W01 independently accepts the paid-off containment evidence. Any newly discovered Product/security semantic gap returns to `01`; C01/config operators must not invent a bootstrap bypass.

## Phase H — W01 live paid Production verification / AC-30 — PENDING

W01 executes the existing real Production financial QA only after Phase G is ready. A failed or incomplete AC-30 means Paid Access is not Production Verified and the switch returns fail-closed if safety/accounting is uncertain.

## Phase I — commercial Sprint closure and later selection

```text
W01 Paid Access Production Verified / AC-30 PASS
→ 00 commercial Sprint Complete review
→ 01 Evidence → Gate Review → Explicit Next Selection
```

No Stage 1.5/Stage 2 capability is automatically selected by commercial enablement.

---

# 4. Active blocker / current execution board

```text
Blocker:
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER

Related durable risks:
R-008 / R-020 / R-021
```

Known current facts:

- commercial preparation is paid-off Production Verified;
- Astra launch hardening is separately Sprint Complete / Production Verified;
- Production paid Architecture Review remains disabled / fail-closed;
- deterministic free core remains operational;
- the real paid entitlement/quota/financial path remains unverified;
- ADR-0011 sequencing and the first-Live operational amendment/runbook are now Specified and released;
- Phase 0 evidence remains incomplete;
- `00` live-observed the connected Vercel team plan label as `hobby` during this reconciliation, but commercial-use eligibility remains a separate external verification and is not inferred from a plan label alone;
- PAUC AC-30 is not complete;
- PR #59 has W01 Pass A approval, but the post-release W01 identity/baseline verification remains pending and is separate from later containment/Live/AC-30 verification.

Smallest safe response:

> Keep Production paid review fail-closed. Treat the first-Live procedure as Specified but not executable. W01 first performs the narrow PR #59 post-release identity/baseline verification; in parallel `00` and named operators close the Phase 0 external prerequisites. Only after Phase 0 and W01 paid-off containment evidence are VERIFIED may the controlled Live bootstrap begin.

| Work / decision | State | Next owner/action |
|---|---|---|
| Commercial-enablement preparation release — PR #35 | **COMPLETE / PAID-OFF PRODUCTION VERIFIED** | remain fail-closed |
| GPT-6 Astra Challenge launch hardening | **SPRINT COMPLETE / PRODUCTION VERIFIED** | regression/history reference only |
| Post-Astra Gate Review | **COMPLETE — NO NEW CAPABILITY SELECTED** | continue existing Stage 1 paid lifecycle |
| Public paid Architecture Review launch | **BLOCKED / NOT ENABLED** | close Phase 0 prerequisites + bootstrap/AC-30 evidence |
| First-Live Product sequencing decision | **COMPLETE — ADR-0011** | no further Product decision unless a new semantic/security gap appears |
| First-Live operational procedure | **SPECIFIED / RELEASED — PR #59** | W01 post-release verification, then Phase 0/containment evidence; no Live execution yet |
| PR #59 semantic documentation release | **W01 PASS A COMPLETE / PASS B PENDING** | W01 independently verify exact released revision/Production identity and paid-off unchanged baseline only |
| QA edge containment | **NOT VERIFIED / NOT READY** | after relevant Phase 0 evidence, C01/authorized hosting operator stages exact runbook rule; W01 independently verifies while paid-off |
| Controlled paid enablement | **BLOCKED / PHASE 0 + CONTAINMENT PENDING** | no execution until all prerequisites and containment are VERIFIED |
| Live financial QA / PAUC AC-30 | **NOT COMPLETE** | W01 after bootstrap Phase G is ready |
| Commercial Validation Gate M0 | **NOT REACHED** | after Paid Access Production Verified + sufficient real paid evidence |
| Gate A | **NOT REACHED** | Astra/preparation/bootstrap docs do not satisfy evaluator trust/scale gate |
| Additional Stage 1.5 capability | **NONE SELECTED** | defer until evidence justifies one |
| Gate B | **NOT REACHED** | no authority expansion |
| Stage 2 | **NOT SELECTED** | no Guided Improvement selection |
| AI Authority | **UNCHANGED** | existing capability-scoped authority only |
| Mutation Authority | **UNCHANGED** | no semantic apply authority added |

---

# 5. Post-Astra Known Notes / risk classification

Astra evidence changes confidence in the current free-core journey and launch presentation; it does not change the prerequisites for Gate A, M0, Stage 1.5 selection, Gate B, Stage 2, AI Authority, or Mutation Authority.

- **Dependency audit: 4 existing findings (`high 3 / critical 1`)** — exploitability/reachability remains `Unknown` from the Astra evidence. Classify as **conditional security triage**, not an automatic Product Sprint. If current security review proves Production reachability/exploitability, route the smallest remediation and re-evaluate launch impact.
- **Screen-reader speech / full physical-device matrix not verified** — **deferred accessibility verification / Known Note**. Computed accessible-name/focus evidence remains valid; revisit in focused accessibility QA or related UI work.
- **Live analytics transport not proven during W01 browser verification** — **conditional business-evidence gap**. Preserve contract/privacy evidence, but do not count unproven live delivery as activation/conversion evidence for M0.
- **GitHub Actions Node 20 deprecation annotation** — **deferred engineering maintenance signal**. Resolve before upstream deprecation becomes a CI/release blocker; it does not create Product scope now.

No new durable Risk Register ID/state is required from these notes on current evidence. R-008/R-020/R-021 continue to describe the blocking commercial exposure. Revisit the Risk Register only when a trigger/state materially changes.

---

# 6. Coordination discipline

Current canonical near-term path:

```text
Astra bounded packet
= SPRINT COMPLETE / PRODUCTION VERIFIED

Explicit Next Selection
= NO NEW CAPABILITY / NO NEW ROADMAP PACKET

ADR-0011 sequencing
= COMPLETE

First-Live amendment/runbook
= SPECIFIED / RELEASED by PR #59

→ W01 narrow PR #59 post-release identity + paid-off baseline verification
→ 00 + named operators close Phase 0 commercial/hosting/Auth/Stripe/WAF/provider-control/Test Mode prerequisites
→ C01 / authorized hosting operator stage the exact QA containment only when its prerequisites are ready
→ W01 independently verifies containment while paid-off
→ controlled edge-contained first-Live bootstrap as specified
→ W01 bootstrap proofs + live paid Production Verification / AC-30
→ 00 commercial Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Conditional routing:

```text
new Product/commercial/security semantic decision required → 01
resulting procedure / Product-facing specification gap → 02
specified implementation/configuration → C01 / authorized operators
independent QA / Production verification → W01
current-state/prerequisite coordination → 00
```

Rules:

- Preparation release Production Verified is not Paid Access AC-30 Production Verified.
- Astra Sprint Complete is not commercial Sprint Complete.
- `Specified` does not mean external prerequisites are verified or a Live window is authorized.
- PR #59 post-release verification is not the same as W01 containment verification, Live bootstrap proof, or AC-30.
- Stage order is dependency direction, not an automatic queue.
- M0 is separate from evaluator authority and roadmap promotion.
- Gate A and Gate B remain NOT REACHED; Stage 2 remains NOT SELECTED.
- Stage 1.5 remains a selection band; no candidate is selected by list order.
- AI Authority and Mutation Authority remain unchanged until applicable gates explicitly change them.
- Do not grow this board into a historical archive; completed detail belongs in packets/PRs/ADRs/evidence documents.
