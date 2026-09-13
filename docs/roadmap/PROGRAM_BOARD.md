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

No new Product Sprint is manufactured while the already-selected commercial lifecycle remains open. The smallest sufficient next work is closure of the existing `COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER`, including specification of the first-Live bootstrap procedure selected in `docs/decisions/ADR-0011-edge-contained-first-live-bootstrap.md` and completion of the remaining external prerequisites.

Commercial Validation Gate M0 remains separate from Stage/Gate promotion and is not reached by technical readiness, Astra launch hardening, or launch participation alone.

---

# 2. Packet index

`Specified` in packet headers describes specification maturity, not release completion. Live repository/Production evidence wins.

| Packet | Role in current plan | Recorded lifecycle / remaining work |
|---|---|---|
| `AGS-EGAI-AR-V0-P1` | Base Architecture Review contract | Stage 1 lifecycle open; paid-access amendment applies |
| `AGS-EGAI-AR-PAUC-V0-P1` | Active paid access/control contract | Preparation released; first-Live procedure amendment + external readiness + live AC-30 remain open |
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

---

# 3. Commercial lifecycle

## Phase A–F — preparation milestone COMPLETE

The paid-off commercial preparation release is implemented, independently QA-approved, released, and Production Verified in its scoped fail-closed state. It includes the selected Auth/entitlement/quota/Stripe/provider-control/policy/runbook preparation. The public paid switch remains false.

The provisional launch inputs remain USD 12/month, 10 reviews per confirmed monthly billing period, the recorded request-cost/provider-budget profile, Stripe Tax-ready Checkout subject to external approval, approved cancellation/refund/support policy, commercial-use-eligible hosting before public paid enablement, and controlled live-QA cancellation/full refund handling. These are launch inputs, not M0 evidence or permanent Product constants.

## Phase G — external prerequisites + controlled Production paid enablement — PENDING / BLOCKED

`00` coordinates the evidence matrix. Named operators and restricted evidence records remain required. Rows are `UNVERIFIED`, `BLOCKED`, or `VERIFIED`; secrets, personal data, source IPs, tokens, and financial details do not belong in this public board.

Evidence classes: **A** = configuration/external approval; **B** = non-Production Test Mode demonstration; **C** = Production paid-off demonstration; **D** = controlled Live Production demonstration. Test Mode does not substitute for AC-30.

| Class / item | Environment and prerequisites | Owner / verifier | Required completion evidence / state |
|---|---|---|---|
| A — Release identity | exact current candidate/revision | C01 / W01 | required checks, approved change set, READY/target/domain/SHA evidence |
| A — Hosting eligibility | Production account + intended commercial scope | 00 + account owner / W01 | current commercial-use hosting eligibility; observed Hobby state remains unresolved |
| A — Public policies / operations | public HTTPS destinations + external approvals | 00 + responsible approvers / W01 | Terms/Privacy/Support reachability and merchant/legal/privacy/tax/refund/support approval |
| A — Stripe Live configuration | Production-linked Live account | C01 + merchant/operator / W01 | approved monthly Price, bounded Portal and Tax configuration |
| A — Provider controls | dedicated Production provider project | C01 + provider operator / W01 | budget/warning/critical/hard-ceiling configuration and exercised alert path |
| A — Financial QA approval | before any Live charge | 00 + financial operator / W01 | written charge/cancel/full-refund handling approval |
| B — Test Mode lifecycle | isolated local/Preview Test Mode | C01 + test operator / W01 | Checkout, signed reconciliation, quota, consume/release, replay, cancellation/recovery; not AC-30 |
| B — Cost guard / entitled kill switch | Test Mode entitlement | C01 / W01 | zero-call cost rejection + reservation release; disabled-path zero call/quota; not Live proof |
| C — Production Auth | Production paid-off | C01 + Auth operator / W01 | magic-link/session/redirect evidence without secrets |
| C — WAF / disabled baseline | Production paid-off | C01 + hosting operator / W01 | required rate-limit/effectiveness, disabled paid path, free-core smoke |
| D-bootstrap — first Live entitlement / webhook lifecycle | all non-circular A/B/C prerequisites verified; QA-only edge containment specified and verified | 02 specifies; C01/config operators execute; W01 verifies | **SEQUENCING DECIDED / PROCEDURE SPECIFICATION PENDING** — real Production Auth + normal application Checkout + signed Live webhook under a QA-only edge-contained window; no manual entitlement/quota or fake webhook |
| D-bootstrap — entitled kill switch | legitimate Live QA entitlement exists; paid switch returned false | W01 | `review_disabled`, zero provider invocation, zero quota consumption, free-core smoke |
| D-bootstrap — cost guard | same legitimate Live entitlement; second QA-only contained window | W01 | cost rejection before any successful provider review; zero provider invocation + idempotent reservation release |
| D — Live financial QA / AC-30 | Phase G prerequisites/bootstrap proofs complete; controlled enablement authorized | W01 + authorized operators | real subscription → entitlement → reservation → valid consume, non-consumption failure, lifecycle/abuse/WAF/kill-switch checks, cancellation/full refund, release identity |

### 01 first-launch sequencing decision — COMPLETE; 02 procedure specification required

`01` accepted `docs/decisions/ADR-0011-edge-contained-first-live-bootstrap.md`.

Product/Architecture boundary:

```text
all independently satisfiable A/B/C prerequisites VERIFIED
→ QA-only edge containment installed + independently evidenced
→ first bounded Live window: real app Checkout → signed Live webhook → legitimate entitlement/quota
→ switch false again
→ entitled kill-switch proof while fail-closed
→ second bounded Live window: cost-guard rejection before any successful provider review
→ only then continue into existing W01 AC-30 sequence
→ public access remains blocked until final independent verification
```

The containment mechanism must keep non-QA traffic out of paid/billing routes while preserving the public deterministic free core. Exact route scope, firewall rule ordering, operator authority, public degraded-state behavior, abort/disable/re-enable conditions, financial handling, and final containment-removal verification are **not** invented here; `02` must make the existing PAUC/runbook implementation-ready. Restricted operator evidence remains outside repository docs.

This resolves the `01` safety/sequencing decision but **does not unblock execution yet**. Phase G remains BLOCKED until `02` specifies the procedure, applicable independent review is complete, and all external prerequisites are actually evidenced.

Any discovered Product/security semantic gap returns to `01`; `C01` must not create a bootstrap bypass.

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
- Vercel team was live-observed on 2026-09-13 as Hobby, so the existing commercial-use hosting prerequisite remains unresolved;
- PAUC AC-30 is not complete;
- the circular first-launch Product sequencing decision is resolved by ADR-0011, but the `02` operational specification and prerequisite evidence remain incomplete.

Smallest safe response:

> Keep Production paid review fail-closed. Do not select a new roadmap capability. `02` specifies the ADR-0011 QA-only first-Live bootstrap inside the existing PAUC/runbook contract while `00` closes external prerequisites. Only after that procedure and evidence are independently acceptable may the controlled paid path advance to W01 AC-30.

| Work / decision | State | Next owner/action |
|---|---|---|
| Commercial-enablement preparation release — PR #35 | **COMPLETE / PAID-OFF PRODUCTION VERIFIED** | remain fail-closed |
| GPT-6 Astra Challenge launch hardening | **SPRINT COMPLETE / PRODUCTION VERIFIED** | regression/history reference only |
| Post-Astra Gate Review | **COMPLETE — NO NEW CAPABILITY SELECTED** | continue existing Stage 1 paid lifecycle |
| Public paid Architecture Review launch | **BLOCKED / NOT ENABLED** | close external prerequisites + first-Live procedure spec/evidence |
| First-Live Product sequencing decision | **COMPLETE — ADR-0011** | `02` specifies exact procedure in existing PAUC/runbook authority |
| Controlled paid enablement | **BLOCKED / PROCEDURE SPECIFICATION + PREREQUISITES PENDING** | no execution until specified and independently acceptable |
| Live financial QA / PAUC AC-30 | **NOT COMPLETE** | `W01` after Phase G is ready |
| Commercial Validation Gate M0 | **NOT REACHED** | after Paid Access Production Verified + sufficient real paid evidence |
| Gate A | **NOT REACHED** | Astra/preparation do not satisfy evaluator trust/scale gate |
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

→ 02 specify ADR-0011 first-Live bootstrap within existing PAUC/runbook
→ 00 + named operators close external commercial/hosting/Auth/Stripe/WAF/provider-control prerequisites
→ W01 independently reviews/verifies required evidence and exact procedure revision
→ controlled edge-contained first-Live bootstrap as specified
→ W01 live paid Production Verification / AC-30
→ 00 commercial Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Conditional routing:

```text
new Product/commercial/security semantic decision required → 01
resulting procedure / Product-facing specification gap → 02
specified implementation/configuration → C01 / authorized operators
independent QA / Production verification → W01
```

Rules:

- Preparation release Production Verified is not Paid Access AC-30 Production Verified.
- Astra Sprint Complete is not commercial Sprint Complete.
- Stage order is dependency direction, not an automatic queue.
- M0 is separate from evaluator authority and roadmap promotion.
- Gate A and Gate B remain NOT REACHED; Stage 2 remains NOT SELECTED.
- Stage 1.5 remains a selection band; no candidate is selected by list order.
- AI Authority and Mutation Authority remain unchanged until applicable gates explicitly change them.
- ADR-0011 authorizes **specification of the safe sequence**, not unrestricted paid execution; Production remains fail-closed until the lifecycle permits each controlled step.
- Do not grow this board into a historical archive; completed detail belongs in packets/PRs/ADRs/evidence documents.
