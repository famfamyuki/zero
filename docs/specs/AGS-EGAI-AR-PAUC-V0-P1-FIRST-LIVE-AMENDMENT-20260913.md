# AGS-EGAI-AR-PAUC-V0-P1 — First-Live Bootstrap Operational Amendment

Status: **Specified amendment / execution conditionally blocked**  
Owner: `02 — UX & Implementation Specification`  
Base packet: `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md`  
Operational procedure: `docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md`  
Product/Architecture decision: `docs/decisions/ADR-0011-edge-contained-first-live-bootstrap.md`  
Specified: **2026-09-13**  
Scope: **QA-only edge-contained first-Live bootstrap inside the already-selected Stage 1 Paid Access lifecycle**

This amendment resolves the first-Live circular procedure gap without creating a new Product capability, paid tier, authority envelope, or roadmap packet. It preserves the complete PAUC contract, including AC-30. It does **not** authorize a Live window until the preconditions below are actually verified.

At specification time ADR-0011 is carried by PR #58 (`docs: post-Astra gate review`) and is not yet merged to `main`. This amendment is therefore authored as a dependent specification. It must not be merged to `main` ahead of the accepted 01 decision it implements. If PR #58 changes before merge, re-check the ADR and this amendment for drift.

---

## 1. Exact problem resolved

With `ARCHITECTURE_REVIEW_PAID_ENABLED=false`, current Production correctly fails closed: Checkout and provider-backed review return `review_disabled` before a first Live entitlement can exist. Yet Live entitled-user kill-switch and reservation/cost-guard evidence require a legitimate Live entitlement.

The permitted bootstrap resolves that circularity as:

```text
all non-circular Phase G prerequisites VERIFIED
→ QA-only edge containment VERIFIED while paid-off
→ first bounded Live deployment/window
→ real application Checkout
→ signed Stripe Live webhook + normal reconciliation
→ legitimate QA entitlement + quota projection
→ immediate paid-off deployment
→ entitled-user kill-switch proof
→ second bounded Live deployment/window
→ request cost-guard rejection before provider invocation
→ immediate paid-off deployment
→ AC-30 READY
→ existing AC-30 under the same QA containment
→ public access only as a later independently verified transition
```

No manual entitlement, quota grant/edit, fake webhook, Test Mode substitution, direct database bootstrap, unrestricted public window, or successful provider call before the cost-guard proof is permitted.

---

## 2. Specification evidence baseline

Known at specification time:

- GitHub `main` was `3cdce0161fe00d38aca8ba8e2bd0949bbc5899d0`.
- Vercel Production deployment `dpl_Gu9mN3xJ61AxBZPdy2RXdKsfZ9py` was `READY`, `target=production`, and reported the same `githubCommitSha`.
- Production `GET /api/billing/architecture-review/offer` returned `enabled=false`, `price=null`, `includedReviews=null`, `policyUrls=null`.
- signed-out `GET /api/billing/architecture-review/access` returned `401 authentication_required`.
- the connected Vercel team was live-observed as plan `hobby`.
- current Vercel plan documentation provides WAF custom rules on Hobby, including path/IP matching and deny actions, but Hobby is not accepted by the existing PAUC commercial-hosting prerequisite for paid launch.
- the current application switch is deployment environment configuration. A changed `ARCHITECTURE_REVIEW_PAID_ENABLED` value is not treated as active until a deployment serving the Production domain is independently observed with the intended behavior.

External-dependent / Unknown at specification time:

- whether the account has been moved to a commercial-use-eligible hosting plan/contract;
- the current published Vercel Firewall custom-rule inventory, priority, and remaining rule capacity;
- the QA operator's stable public egress IP/CIDR;
- merchant/legal/privacy/tax/refund/support approvals;
- final Stripe Live Price/Portal/Tax configuration evidence;
- Production Auth delivery evidence;
- provider budget/alert/hard-ceiling evidence;
- financial QA approval;
- Test Mode lifecycle evidence;
- actual Live entitlement/quota/provider/financial behavior.

These Unknowns are Phase 0 prerequisites, not Product decisions delegated to C01.

---

## 3. Exact route containment contract

### 3.1 QA-contained route set

While any bootstrap or AC-30 paid-enabled window is possible, a Vercel WAF custom **deny** rule must protect the following exact paths from every source **except** the approved stable QA egress source set:

```text
/api/architecture-review
/api/billing/architecture-review/offer
/api/billing/architecture-review/checkout
/api/billing/architecture-review/refresh
/api/billing/portal
```

Use exact path matching, not a broad `/api/*` prefix. The rule may match all methods for those exact paths; current application methods remain authoritative.

### 3.2 Explicit exclusions

Do **not** place these routes behind the QA-source deny rule:

- `/api/webhook` — Stripe must reach the signed Live webhook from Stripe infrastructure. Signature validation remains the application security boundary. The route already reconciles paid subscriptions with `allowDisabled: true`, including after the paid switch returns false.
- `/api/billing/architecture-review/access` — authenticated, read-only access projection remains reachable. Blocking it with an edge non-JSON response would unnecessarily degrade signed-in client state; it does not create entitlement, quota, Checkout, Portal sessions, or provider invocation.
- unrelated free-core routes and the root Product UI.
- unrelated template purchase Checkout routes.
- public Terms / Privacy / Support destinations.

A no-signature request to `/api/webhook` may be used only as a reachability probe: application `400 missing_signature` proves that containment did not accidentally catch the route. It is **not** Live webhook lifecycle evidence.

### 3.3 Rule ordering

Published custom-rule order must be:

```text
1. QA paid-route containment DENY
2. existing /api/architecture-review rate-limit rule
3. other unrelated project rules
```

The containment rule predicate is:

```text
exact path ∈ QA-contained route set
AND source IP/CIDR ∉ approved QA source set
→ DENY
```

Do not implement this with a system-bypass rule. The QA source simply does not match the deny predicate, so subsequent WAF defenses—including the existing review rate limit—still apply.

Existing review rate-limit contract remains `POST /api/architecture-review`, 5 requests / 60 seconds / client IP or stricter.

### 3.4 Source handling

The QA source must be a stable operator-controlled public egress IP/CIDR known before the window opens. Shared/public VPN egress, a source expected to rotate during the window, or a source that may include uncontrolled public users is not acceptable.

Raw source IP/CIDR values belong only in restricted Vercel/release records. Repository docs, PRs, chat, screenshots, analytics, and public QA reports record only a bounded identifier such as `QA_SOURCE_SET_PRESENT=true` and the number/hash of approved entries if needed.

If the source changes or its exclusivity becomes uncertain, the window aborts.

---

## 4. Firewall rollout and verification contract

Containment is established while the application is still paid-off.

1. Verify commercial-use hosting eligibility and current WAF custom-rule capacity. Do not delete unrelated security rules merely to make room.
2. Create the exact containment predicate initially with action `log` while `ARCHITECTURE_REVIEW_PAID_ENABLED=false`.
3. From the QA source, probe every protected path and confirm it would not match the non-QA deny predicate.
4. From an independently controlled non-QA source, probe every protected path and confirm the log rule matches that source/path set.
5. Confirm `/api/webhook` and free-core routes are outside the predicate.
6. Change action to `deny`, publish, and record rule priority/state.
7. Repeat the two-source probes while still paid-off:
   - non-QA source: all five protected paths are edge-denied;
   - QA source: requests reach the application and receive normal paid-off/auth responses;
   - webhook reachability probe reaches application handling;
   - deterministic free core remains usable.
8. W01 independently verifies containment effectiveness before any paid-enabled deployment is promoted.

Saved/draft rules are not evidence; only the published rule is operative.

---

## 5. Paid switch is a deployment transition

`ARCHITECTURE_REVIEW_PAID_ENABLED` is not treated as an instantaneous runtime toggle.

Every `false → true` or `true → false` transition must be recorded as:

```text
Production env/config intent
→ deployment/redeploy of the exact approved source revision
→ READY
→ target=production / primary Production domain serves that deployment
→ githubCommitSha identity verified
→ observed application switch behavior verified
```

Before the first Live window, create/verify a fresh paid-off Production baseline deployment using all approved final Production configuration except `ARCHITECTURE_REVIEW_PAID_ENABLED=false`. Record it as the emergency paid-off rollback target.

### Emergency close

If a paid-enabled window must close before a normal redeploy completes:

1. immediately promote/rollback to the pre-verified paid-off deployment;
2. update the project Production switch configuration back to `false` so a later deploy cannot silently re-enable;
3. deploy/verify the canonical paid-off state;
4. keep QA edge containment published;
5. preserve billing/webhook/quota records for reconciliation.

Rollback/promotion is containment, not proof that project environment configuration was corrected.

---

## 6. Operational state machine

| State | Public/non-QA | QA source | Switch / provider | Exit condition |
|---|---|---|---|---|
| `PAID_OFF_PUBLIC` | Free core public; offer disabled; protected paid operations unavailable | Same paid-off behavior | switch false; provider unavailable through paid route | all Phase 0 prerequisites verified |
| `QA_CONTAINMENT_STAGED` | paid-off; log-only candidate produces no access change | paid-off | switch false | two-source log predicate correct |
| `QA_CONTAINMENT_READY` | five protected paths edge-denied; free core public; paid UI must remain disabled/unavailable | protected routes reach app but app still paid-off | switch false | W01 containment proof + paid-off baseline deployment recorded |
| `FIRST_LIVE_WINDOW` | protected paid routes remain edge-denied; free core public; public paid UI not usable | offer/Checkout available; create first legitimate Live subscription only | switch true deployment; **no review request permitted** | entitlement/quota confirmed or abort; hard 15-minute ceiling |
| `ENTITLEMENT_CONFIRMED` | unchanged containment | legitimate active QA entitlement + quota projection observed | no provider review | immediately close switch |
| `PAID_OFF_KILL_SWITCH_PROOF` | edge containment retained; public paid remains unavailable | entitled QA user gets `review_disabled`; access projection may still show entitlement | switch false; provider count 0; quota unchanged | kill-switch evidence PASS |
| `SECOND_LIVE_WINDOW` | protected paid routes edge-denied; free core public | one defined cost-guard probe only | switch true; provider must not start | 422 cost rejection + release proven or abort; hard 15-minute ceiling |
| `COST_GUARD_PROVEN` | unchanged | entitlement remains; quota restored after release | provider count 0 | immediately close switch |
| `PAID_OFF_POST_BOOTSTRAP` | paid unavailable; containment retained | active QA entitlement can be read but review disabled | switch false | W01 accepts bootstrap evidence |
| `AC30_READY` | still QA-contained; not public | same legitimate QA subscription is the AC-30 entitlement source | paid-off between test windows | W01 authorizes AC-30 execution |
| `AC30_IN_PROGRESS` | paid routes remain non-QA denied | W01-controlled Live QA only | paid-enabled only for authorized AC-30 segments | AC-30 PASS or any failure → close switch |
| `AC30_PASS` | no automatic public access | QA evidence complete | paid switch returns false before public transition | final public transition separately authorized |
| `FAIL_CLOSED` | paid unavailable; free core remains | paid unavailable except read-only reconciliation/access as defined | switch false; containment retained | root cause/reconciliation + fresh authorization |
| `PUBLIC_ENABLEMENT_ELIGIBLE` | no change yet | no change | state means prerequisites/evidence permit considering removal | explicit transition authorization |
| `PUBLIC_ENABLEMENT_TRANSITION` | containment removal + paid enablement is itself independently verified Production config change | normal paid contract | exact approved revision/config | W01 public Production verification |

`AC30_PASS` does not equal `Paid Access Production Verified` until release/config identity and public-transition evidence required by the base packet are complete.

---

## 7. Phase 0 — mandatory non-circular prerequisites

No Live window starts until `00` has recorded all applicable rows below as VERIFIED with named authorized operators and restricted evidence references:

- commercial-use-eligible Vercel hosting/account for the intended paid use;
- public Terms / Privacy / Support and merchant/legal/privacy/tax/refund/support approvals;
- Stripe Live recurring monthly Price, Portal, Tax, and approved launch configuration;
- written financial QA charge/cancel/full-refund authorization;
- Production Auth delivery/session/redirect evidence;
- provider dedicated project, warning/critical/hard-ceiling budget controls, and exercised alert path;
- Stripe Test Mode lifecycle/control evidence required by the existing runbook;
- Production paid-off WAF/rate-limit and free-core baseline;
- exact release/source revision and Production deployment identity;
- Vercel Firewall current published-rule inventory/capacity and operator permission;
- stable exclusive QA egress source;
- any other Phase G A/B/C prerequisite still required by the Program Board/base PAUC.

Current live-observed Hobby status is therefore an execution blocker until commercial hosting eligibility is resolved. Technical WAF availability on Hobby does not satisfy the commercial hosting requirement.

---

## 8. First bounded Live window — entitlement bootstrap

Preconditions: `QA_CONTAINMENT_READY`, Phase 0 all VERIFIED, QA user already authenticated if practical, paid-off rollback deployment recorded, financial operator available.

Procedure:

1. 00 authorizes the specific first window in the restricted release record.
2. Vercel configuration operator changes only the approved paid switch state required for the window and deploys the exact approved source revision.
3. W01 verifies Production identity, edge containment from non-QA, QA-source application reachability, and that the window clock starts only when the paid-enabled deployment actually serves the primary Production domain.
4. Controlled QA user starts normal application Checkout through `/api/billing/architecture-review/checkout`.
5. Confirm Stripe Checkout is the approved Live monthly subscription; no manual subscription/entitlement/quota mutation.
6. The return URL is not treated as entitlement evidence.
7. Observe the real signed Live webhook at `/api/webhook`, normal reconciliation, legitimate entitlement `active`/equivalent eligible state, confirmed billing period, and quota projection `10`.
8. Do **not** invoke `/api/architecture-review` for a successful or provider-reaching review in this window.
9. As soon as entitlement/quota evidence is confirmed, close the paid switch using §5 and verify the paid-off deployment.

Hard ceiling: 15 minutes from the moment the paid-enabled deployment serves Production. If signed webhook/reconciliation is incomplete at the deadline, close the switch. The webhook remains reachable while paid-off and may reconcile a late legitimate event; do not create a second subscription until state/financial reconciliation is complete.

---

## 9. Immediate paid-off kill-switch proof

With the same legitimate QA entitlement and QA containment still active:

1. verify Production is now serving the paid-off deployment;
2. verify QA `offer.enabled=false`;
3. send one otherwise-valid review request as the entitled QA user;
4. require application `503 review_disabled`;
5. prove provider invocation count did not increase;
6. prove quota `consumed` and `reserved` did not increase/change;
7. smoke deterministic free core;
8. keep signed webhook reconciliation operational.

Any provider start or quota mutation is a blocker and forces `FAIL_CLOSED`.

---

## 10. Second bounded Live window — cost guard first

Preconditions: kill-switch proof PASS, entitlement remains legitimate/eligible, quota is unchanged, containment remains verified.

The cost-guard probe is a synthetic, non-sensitive Architecture Review request that:

- satisfies `architectureReviewRequestSchema` and `validateArchitectureEvidence`;
- recomputes the evidence fingerprint using the repository canonicalizer rather than forging a stale fingerprint;
- uses no user/private workflow text;
- keeps HTTP request size below the route 512 KiB limit;
- produces a serialized provider envelope greater than `ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES` (currently 32,768 bytes) **or** a deterministic worst-case estimate over the configured request ceiling;
- is first proven in non-Production/Test Mode against the same code path.

Procedure:

1. authorize and deploy paid-enabled state under the same containment;
2. reverify non-QA edge denial and exact Production identity;
3. submit exactly one new-idempotency-key cost-guard probe;
4. require `422 request_cost_limit_exceeded`;
5. require one reservation attempt to settle `released` with no quota consumption;
6. require provider-start/invocation count to remain zero;
7. replay the same idempotency key only if needed to verify closed/idempotent accounting; it must not create a new provider invocation or consumption;
8. immediately return to paid-off Production and verify it.

Hard ceiling: 15 minutes. No successful provider-backed Architecture Review is permitted before this proof passes.

---

## 11. AC-30 evidence carry-forward — no duplicate subscription

The first-Live subscription created in §8 is the legitimate QA subscription used for the existing AC-30 sequence. Do **not** start a second subscription merely to repeat AC-30 steps 3–4; the current Checkout contract rejects an already active subscription and duplicate charging is not useful evidence.

W01 may count §8 as the `real subscription → signed webhook → entitlement/quota` segment of AC-30 only when:

- W01 independently observed/verified the evidence;
- the same controlled QA identity/subscription is used;
- exact source/deployment/config identity is recorded;
- no manual entitlement/quota mutation occurred;
- financial reconciliation remains unambiguous.

Likewise, §§9–10 may satisfy the AC-30 kill-switch/cost-guard subchecks when the same exact revision/config chain remains applicable. If code, paid configuration, containment semantics, or evidence identity changes, repeat the affected proof.

After `AC30_READY`, W01 may open further QA-contained paid-enabled segments needed for the remaining existing AC-30 requirements, including valid provider consume, non-consumption failure, idempotency, lifecycle/payment blocking/recovery, quota exhaustion, WAF, free-core regression, cancellation, and refund. Public/non-QA paid routes remain edge-denied throughout.

This carry-forward avoids duplicate risky/financial operations; it does not weaken or mark AC-30 complete early.

---

## 12. Abort / rollback contract

Immediately close the paid switch, keep containment published, stop progression, and preserve reconciliation records when any of the following occurs:

- 15-minute bootstrap window timeout;
- missing/late signed webhook past the window deadline;
- webhook/reconciliation failure or mismatch;
- unexpected public/non-QA reachability of any contained route;
- public paid offer/Checkout availability during a QA-only window;
- QA source/capacity/rule-priority uncertainty;
- entitlement state or billing period mismatch;
- quota limit/counters mismatch;
- any provider invocation before the cost-guard proof allows provider use;
- cost guard fails to release its reservation;
- duplicate subscription/charge or financial uncertainty;
- Production deployment/main SHA/config identity uncertainty;
- relevant runtime error affecting paid accounting/auth/containment;
- operator loses ability to execute immediate paid-off rollback;
- any secret/privacy/data exposure concern.

General rule:

```text
uncertainty
→ immediate paid-off rollback if needed
→ project switch configuration false
→ verify paid-off Production
→ stop dependent actions
→ preserve records needed for reconciliation
→ no authority bypass
```

A late signed webhook after close may be reconciled because the webhook is deliberately outside containment and uses disabled-safe reconciliation. Late reconciliation is evidence to resolve before retry, not permission to reopen automatically.

---

## 13. Operator/action authority

| Action | Authorized role | Preconditions | Boundary |
|---|---|---|---|
| record prerequisite readiness / authorize next controlled phase | `00` release coordinator | required evidence rows complete | does not perform W01 verdict or Product selection |
| publish/reorder/rollback WAF rules | authorized Vercel configuration operator | 00 authorization; exact rule contract; W01 observation when required | no source IP in public repo/evidence; no system bypass |
| change Production paid switch / deploy / rollback | authorized Vercel release/config operator | containment verified; exact approved source; phase authorization | only specified switch transition; no unrelated env/provider change |
| authenticate and perform QA Checkout/review actions | controlled QA operator | assigned QA identity; current phase permits action | no manual DB/entitlement/quota edits |
| inspect Stripe Live config; cancel/refund QA charge | authorized Stripe/financial operator | written financial QA authority | no manual entitlement mutation; restricted financial refs only |
| implement repository code/harness change if a discovered mechanical gap requires it | `C01` | separately handed exact implementation scope | no Product/commercial semantic invention |
| independent containment/bootstrap/AC-30/public-transition verdict | `W01` | exact candidate/config/evidence | self-test/operator evidence is not a substitute |
| Product/Architecture/security authority decision outside ADR-0011 | `01` / applicable authority | genuine semantic gap | 02/C01/operator must not invent it |

Raw IPs, emails, auth tokens, Stripe object/charge/subscription IDs, provider credentials, personal data, workflow/Evidence bodies, prompts, provider responses, and review prose are restricted and must not be committed or placed in public reports.

---

## 14. Public/degraded UX contract

During `QA_CONTAINMENT_READY`, `FIRST_LIVE_WINDOW`, `SECOND_LIVE_WINDOW`, and QA-contained AC-30:

- deterministic free core remains publicly available;
- non-QA requests to `/api/billing/architecture-review/offer` are edge-denied;
- current client failure handling must resolve that condition to the existing disabled/unavailable paid-review state, not an enabled price/Subscribe state;
- non-QA Checkout/refresh/portal/review are edge-denied;
- no public user is invited to purchase during the QA-only window;
- policy/support pages remain reachable;
- the QA source may see the real enabled offer only during a paid-enabled deployment.

W01 must verify this from a non-QA source after every transition to paid-enabled state. If the current client instead exposes price/Subscribe or a broken paid state to non-QA traffic, abort; do not silently add Product UX semantics in operations.

---

## 15. Financial handling

Exactly one initial controlled QA subscription/charge is expected for the first-Live bootstrap unless a failure occurs before charge creation.

- retain that same legitimate subscription through kill-switch, cost-guard, and AC-30 so the tests use the real entitlement lifecycle;
- do not create another subscription while entitlement/financial state is unresolved;
- if the run aborts after a charge exists, authorized financial operator cancels and issues a full refund once Stripe/reconciliation state is safe to act on;
- after successful AC-30, cancel and full-refund the QA charge as already required by the runbook/base PAUC;
- cancellation/refund occurs through authorized Stripe operations, not direct entitlement/quota database edits;
- signed webhook reconciliation remains authoritative for application entitlement lifecycle.

The restricted record stores bounded result categories plus financial reference needed for audit. Public repository/reporting stores no customer email, user ID, charge/subscription/session/event IDs, receipt URL, token, or secret.

---

## 16. Evidence contract

For every state transition record, as applicable:

### Public/privacy-safe evidence

- state name and UTC timestamps;
- GitHub source SHA / approved candidate SHA;
- Vercel deployment ID, `READY`, target, primary-domain observation, `githubCommitSha` equality;
- effective paid switch state (`true` / `false`) without unrelated environment values;
- containment state (`draft/log/deny`), published priority, exact public path set, `QA_SOURCE_SET_PRESENT` and bounded source count/hash only;
- QA-source vs non-QA probe result category / HTTP status;
- offer enabled/disabled category;
- signed-webhook processing/reconciliation category, without event/object ID in public evidence;
- entitlement state category and quota counts;
- reservation outcome (`new/reserved/released/consumed/...`) and consume/release result;
- provider-start/invocation count/result category;
- free-core smoke result;
- runtime error category;
- cancellation/refund completion category.

### Restricted-only evidence

- raw QA source IP/CIDR;
- QA email/user identity;
- auth/session tokens;
- Stripe Price/Customer/Subscription/Checkout/Event/Charge/Refund identifiers when operationally necessary;
- provider/project secret references;
- financial receipt/reference details;
- request idempotency keys;
- any personal data.

Never retain workflow/Evidence body, prompt, provider response, review prose, secret values, or credentials merely for this procedure.

Reports must explicitly separate:

```text
Configured expectation
Static/code/config evidence
Observed Production behavior
Known / Inferred / Unknown
```

---

## 17. Acceptance Criteria

**FL-AC-01 — Phase 0 preserved**  
No Live paid window can start until all non-circular Phase G prerequisites are independently evidenced, including commercial-use-eligible hosting.

**FL-AC-02 — Exact route containment**  
Published WAF deny protects exactly the five specified paid-facing paths from non-QA sources while free core, authenticated read-only access, and Stripe webhook remain outside that deny rule.

**FL-AC-03 — Two-source proof**  
While paid-off, W01 observes non-QA edge denial and QA-source application reachability for every contained path, plus webhook/free-core reachability.

**FL-AC-04 — No bypass**  
Containment uses a deny predicate; no system-bypass rule or broader security bypass is introduced for the QA source.

**FL-AC-05 — Rule order**  
Containment deny precedes the existing review rate-limit; QA traffic remains subject to that rate-limit.

**FL-AC-06 — Deployment-bound switch**  
Every switch transition records the exact deployed source identity and observed effective state; environment configuration intent alone is not treated as runtime state.

**FL-AC-07 — First entitlement only through normal Live path**  
First entitlement is created only by Production Auth → normal app Checkout → approved Stripe Live subscription → signed Live webhook → reconciliation, with no manual entitlement/quota mutation.

**FL-AC-08 — No provider in first window**  
Provider-start/invocation count is zero through first entitlement acquisition.

**FL-AC-09 — Immediate paid-off proof**  
After entitlement confirmation, paid-off state is restored and entitled QA review returns `review_disabled` with zero provider invocation and zero quota mutation; free core remains operational.

**FL-AC-10 — Cost guard before provider**  
Second Live window returns `request_cost_limit_exceeded` for the defined valid synthetic request, releases reservation idempotently, consumes no quota, and starts/invokes provider zero times.

**FL-AC-11 — Hard window bound**  
Each first/second bootstrap paid-enabled window closes no later than 15 minutes after the paid-enabled deployment becomes effective, or earlier immediately after target evidence.

**FL-AC-12 — Abort is fail-closed**  
Every listed uncertainty/failure closes to paid-off, retains containment, preserves reconciliation records, and blocks progression.

**FL-AC-13 — Public UX remains unavailable**  
From a non-QA source during any QA-only paid-enabled state, paid offer/Checkout/review are not usable or represented as publicly available.

**FL-AC-14 — Webhook remains reachable**  
Containment never blocks Stripe webhook; real signed Live lifecycle evidence is still required and no fake/test webhook substitutes.

**FL-AC-15 — Financial continuity**  
The same initial QA subscription is reused through bootstrap/AC-30 where valid, duplicate charging is avoided, and abort/final cleanup specifies cancel + full refund.

**FL-AC-16 — AC-30 preserved**  
Bootstrap evidence may satisfy matching AC-30 segments only when independently verified and unchanged; AC-30 still requires valid consume, non-consumption failure, idempotency/lifecycle/quota/WAF/kill-switch/free-core/financial cleanup and does not become complete early.

**FL-AC-17 — Public enablement separate**  
QA-only success does not remove containment or enable public paid access. Containment removal/public enablement is a separately authorized Production configuration transition with fresh W01 evidence.

**FL-AC-18 — Privacy-safe evidence**  
Public/repository evidence contains no source IP, email, token, Stripe sensitive reference, credential, personal data, workflow/Evidence body, prompt, provider response, or review prose.

**FL-AC-19 — No authority expansion**  
No new tier/price/quota/provider/model/evaluator semantics, persistence, Stage, AI Authority, Mutation Authority, or M0/Gate conclusion is introduced.

**FL-AC-20 — Exact identity**  
Every W01 Live verdict identifies exact GitHub candidate/main SHA, Vercel deployment, target/domain, and `githubCommitSha`; `READY` alone is insufficient.

---

## 18. Test / verification matrix

| Verification | Environment / owner | Required result |
|---|---|---|
| route inventory regression | repository / C01 or W01 | five contained paths and two explicit exclusions match current route reality |
| config/readiness | local/Preview / C01 | existing commercial checks remain green; no semantic weakening |
| Test Mode lifecycle | Preview/Test / C01 + W01 | existing PAUC/runbook Test Mode evidence complete; not counted as Live |
| containment log dry-run | Production paid-off / W01 + Vercel operator | exact non-QA predicate matches; QA source/free core/webhook excluded |
| containment deny | Production paid-off / W01 | two-source FL-AC-02..05 PASS |
| first Live entitlement | Production QA-only / W01 | FL-AC-06..08 PASS |
| paid-off kill switch | Production QA-only / W01 | FL-AC-09 PASS |
| synthetic cost guard | Test first, then Production QA-only / W01 | FL-AC-10 PASS |
| public/degraded UX | Production non-QA / W01 | FL-AC-13 PASS |
| rollback drill | Production paid-off or bounded QA window / W01 + operator | paid-off rollback/effective switch false can be demonstrated without losing reconciliation |
| AC-30 remaining path | Production QA-only / W01 | original PAUC AC-30 remains fully satisfied |
| public transition | Production / W01 | only after eligibility; containment removal + public paid behavior independently verified |
| privacy/evidence review | restricted + public records / W01 | FL-AC-18 PASS |

Repository behavior changes, if any are later discovered to be necessary, still require normal `npm run docs:check`, `npm test`, `npm run typecheck`, `npm run build`, applicable `npm run verify`, exact candidate, and fresh W01 Pass A. This amendment itself does not pre-authorize a code change.

---

## 19. Requirement traceability

| Requirement | Upstream authority / evidence | AC / verification |
|---|---|---|
| QA-only edge-contained sequencing | ADR-0011 | FL-AC-01..17 |
| paid entitlement + quota only | base PAUC / ADR-0006 | FL-AC-07, 09, 10, 16 |
| commercial operations before paid launch | ADR-0007 / Monetization Architecture / PAUC AC-29 | FL-AC-01, 15, 17 |
| provider abuse/cost containment | R-008 / base PAUC | FL-AC-02..05, 08..10 |
| entitlement/quota/accounting integrity | R-020 / base PAUC | FL-AC-07, 09, 10, 15, 16 |
| external operational readiness | R-021 / Program Board Phase G | FL-AC-01, 20 |
| Evidence Before Intelligence / no runtime overclaim | Product/Architecture/Development Rules | evidence contract + W01 observation |
| secret/privacy boundary | Security/Data/Development Rules | FL-AC-18 |
| independent QA/release identity | Development Rules / Role Registry | FL-AC-03, 06, 20 |
| no roadmap/AI/Mutation promotion | Execution Gates / ADR-0011 | FL-AC-19 |

---

## 20. Definition of Ready resolution

| DoR item | Resolution |
|---|---|
| first-Live circular dependency | Resolved by §§1, 8–11 |
| current Production/platform constraints inspected | Resolved in §2; actual firewall inventory remains an explicit external prerequisite, not an undefined procedure |
| route containment feasible/unambiguous | Resolved in §§3–4 |
| webhook not broken | Explicit exclusion + reachability proof in §§3–4 |
| switch transitions / owners | Resolved in §§5, 13 |
| expected evidence / failure behavior | Resolved in §§12, 16 |
| non-QA traffic safely excluded | Resolved by edge contract + W01 two-source proof |
| free core independent | Required throughout state machine/AC |
| financial cleanup | Resolved in §15 |
| security/privacy/data handling | Resolved in §§13, 16 |
| PAUC AC-30 intact | Resolved in §11 / FL-AC-16 |
| W01 independent verification points | Resolved in §§17–18 |
| Acceptance Criteria / Test Matrix / traceability | §§17–19 |
| Product decision remaining for C01 | None known |

**Procedure Definition of Ready: SATISFIED.**

Classification:

```text
first-Live procedure
= SPECIFIED / EXECUTION-READY CONTRACT

actual first-Live execution
= BLOCKED UNTIL PHASE 0 EXTERNAL PREREQUISITES + W01 CONTAINMENT PROOF
```

This distinction is mandatory. `Specified` does not mean the current Hobby account, external approvals, Live Stripe configuration, WAF inventory, QA source, or financial QA are ready.

---

## 21. Handoff / next owner

Because current external prerequisites are not verified and the connected Vercel team is still Hobby, do **not** hand directly to C01 for paid enablement.

Next executable coordination:

```text
02 procedure Specified
→ 00 reconciles/records Phase 0 prerequisite evidence
→ authorized account / Vercel / Stripe / Auth / provider / financial operators close their owned prerequisites
→ W01 independently verifies QA containment while paid-off
→ only then first bounded Live window may be authorized
```

No repository Product/runtime code change is currently required by this specification. If implementation reality later proves a mechanical repository change is required, 00/02 prepares an exact C01 scope; C01 must not invent a bootstrap bypass.

After AC-30 and public transition are independently verified, normal lifecycle returns to `00` for commercial Sprint completion review, then `01` performs Evidence → Gate Review → Explicit Next Selection. No automatic Stage/Gate/AI/Mutation promotion follows.