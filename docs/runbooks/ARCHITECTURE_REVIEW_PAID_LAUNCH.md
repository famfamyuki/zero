# Architecture Review Paid Launch Runbook

Status: **Launch-candidate operations contract; first-Live bootstrap procedure Specified; paid public Production remains blocked**  
Scope: external readiness, QA-only edge-contained first-Live bootstrap, W01 financial QA/AC-30 evidence, public-transition verification, incident disablement, and rollback for `architecture_review_individual_monthly_v0`.

This runbook records the Product-approved provisional launch configuration and the 01-selected ADR-0011 bootstrap sequence. It does not approve merchant identity, tax registration/geography, external prerequisites, merge, public paid enablement, M0, Stage promotion, AI Authority, or Mutation Authority. W01 independently verifies observed behavior and exact release/config identity.

The scoped PAUC procedure authority is:

- `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md`;
- `docs/specs/AGS-EGAI-AR-PAUC-V0-P1-AMENDMENT-20260912.md`;
- `docs/specs/AGS-EGAI-AR-PAUC-V0-P1-FIRST-LIVE-AMENDMENT-20260913.md`.

---

## 1. Immutable launch boundary

```text
Provider-backed Architecture Review = authenticated active paid entitlement only
Included quota = 10 valid reviews / confirmed monthly Stripe billing period
Public base price = USD 12.00 / month (provisional launch configuration)
Tax = Stripe Tax, calculated separately when applicable under approved jurisdiction/configuration
Overage / rollover / trial / annual / top-up / multiple tiers = none
Free deterministic core = independent of Auth, Stripe, quota DB, and provider state
```

Production default is `ARCHITECTURE_REVIEW_PAID_ENABLED=false`.

The switch may be true only during either:

1. an explicitly authorized **QA-only edge-contained Live verification window** defined below; or
2. a later public enablement transition after all required evidence permits it.

A QA-only window is not public paid launch. Never authorize paid access from email, browser state, client user ID, checkout return URL, analytics, Stripe metadata alone, or a deployment marked only `READY`.

### 1.1 First-launch circularity — PROCEDURE SPECIFIED / EXECUTION BLOCKED ON PREREQUISITES

The old circular gap is procedurally resolved by ADR-0011 and the first-Live PAUC amendment:

```text
non-circular Phase G prerequisites VERIFIED
→ QA-only edge containment independently verified while paid-off
→ first bounded Live window: real app Checkout → signed Live webhook → legitimate QA entitlement/quota
→ immediately paid-off
→ entitled QA kill-switch proof
→ second bounded Live window: cost-guard rejection before provider invocation
→ immediately paid-off
→ existing AC-30 under the same QA containment
→ public access only through a later separately verified transition
```

Do not grant manual entitlement/quota, edit paid DB state to bootstrap, use fake/Test Mode webhooks as Live proof, create unrestricted public windows, or run a successful provider-backed review before the cost-guard proof.

The procedure is **Specified** but is not currently executable merely because it is specified. `00` must first record all §2 prerequisites as VERIFIED and W01 must verify §5 containment while paid-off.

---

## 2. Phase 0 — pre-enable evidence packet

Record values in the restricted release record; do not paste secret values into tickets, chat, screenshots, logs, or this repository.

No QA-only Live window starts until all applicable items are VERIFIED:

- Exact GitHub source revision and any W01-approved candidate/release evidence required for current code.
- Current Vercel Production deployment identity, target, primary domain, and `githubCommitSha` relationship.
- `npm run docs:check`, `npm test`, `npm run typecheck`, `npm run build`, applicable `npm run verify`, and commercial checks pass on any behavior-changing candidate.
- Commercial-use hosting eligibility is verified under current vendor terms. The live-observed Hobby account at specification time is not treated as satisfying this prerequisite.
- Current Vercel Firewall published-rule inventory, priority, custom-rule capacity, and operator authority are inspected. Do not remove unrelated security rules merely to make room.
- A stable, exclusive operator-controlled QA public egress IP/CIDR is available. Raw values remain restricted.
- Supabase Production magic-link delivery and allowed redirect URLs are verified without exposing email/token values.
- One active approved USD 12.00 licensed recurring monthly Stripe Live Price is configured; no trial, promotion, metering, quantity transform, annual option, seats, or alternate plan is exposed.
- Dedicated Stripe Customer Portal configuration permits payment method, invoice/receipt, and cancel-at-period-end only.
- Terms, Privacy, and Support URLs are public HTTPS and contain approved paid/provider/billing disclosures.
- Stripe Tax is enabled for Checkout; merchant identity, tax registration/configuration, refund/charge handling, launch geography, support ownership, and other required commercial operations have written approval.
- Financial QA approval names an authorized operator able to cancel the QA subscription and issue a full refund.
- Dedicated Production provider project/key, cost profile, budget/alerts/hard ceiling, and exercised alert path are verified.
- Stripe Test Mode lifecycle/control evidence required by §6 is complete.
- Production paid-off WAF/rate-limit and deterministic free-core baseline are verified.
- Any additional Program Board Phase G A/B/C prerequisite remains mandatory.

`npm run commercial:check:enabled` may be used only in a restricted candidate/configuration check; a pass does not authorize a Production window.

---

## 3. Provider budget and application kill switch

Use a dedicated Production provider project/key. Configure and independently record:

- warning at USD 20 monthly spend, critical at USD 40, hard monthly ceiling at USD 50;
- alert recipients and an exercised notification path;
- model exactly matching `ARCHITECTURE_REVIEW_MODEL` and `ARCHITECTURE_REVIEW_COST_PROFILE_MODEL`;
- model `gpt-5.6-sol`, provider-input envelope maximum 32,768 bytes, output maximum 4,096 tokens, input/output rates 4,000,000/20,000,000 micro-USD per million tokens, and worst-case request ceiling 250,000 micro-USD.

The **Live** entitled-user kill-switch and cost-guard proofs occur in §§9–10 after the first legitimate entitlement exists. Test Mode evidence may be prepared earlier but never substitutes for Live evidence.

The code-path contract remains:

```text
reserve accounting
→ deterministic request cost/input guard
→ release on request_cost_limit_exceeded
→ only after the guard may provider-start be marked / provider invoked
```

Therefore the §10 Live cost-guard proof must observe zero provider start/invocation and released reservation.

---

## 4. Exact paid-route containment contract

### 4.1 Contained paths

Publish a Vercel WAF custom rule that denies every source except the approved QA source set for these **exact** paths:

```text
/api/architecture-review
/api/billing/architecture-review/offer
/api/billing/architecture-review/checkout
/api/billing/architecture-review/refresh
/api/billing/portal
```

Use exact path matching, not `/api/*` or another broad prefix.

### 4.2 Explicit exclusions

Do not include:

- `/api/webhook` — Stripe must reach the signed webhook; subscription reconciliation supports paid-off state.
- `/api/billing/architecture-review/access` — authenticated read-only projection remains reachable and does not create entitlement, quota, Checkout, Portal, or provider work.
- unrelated free-core routes/root UI.
- unrelated template purchase Checkout routes.
- public Terms / Privacy / Support.

A no-signature `/api/webhook` request that reaches application `400 missing_signature` is only reachability evidence; it is not signed Live lifecycle evidence.

### 4.3 Rule predicate and order

```text
exact path ∈ contained path set
AND source IP/CIDR ∉ QA_SOURCE_SET
→ DENY
```

Order:

```text
1. QA paid-route containment deny
2. existing POST /api/architecture-review rate limit
3. unrelated project rules
```

Do not use a Vercel system-bypass rule for QA. QA traffic simply does not match the deny rule, so subsequent defenses remain active.

The existing review rate limit remains **5 requests per 60 seconds per client IP or stricter**.

### 4.4 QA source security

The QA source must be stable and exclusively operator-controlled for the window. Do not use rotating VPN/proxy egress or a shared source that can include uncontrolled public users.

Raw IP/CIDR never enters repository docs, public QA evidence, analytics, or chat. Record only restricted source details; public evidence may record bounded presence/count/hash.

A source change or uncertainty is an abort condition.

---

## 5. Establish edge containment while paid-off

Containment is independently proven before any paid-enabled deployment.

1. Confirm §2 prerequisites relevant to Vercel/account/firewall/source are VERIFIED.
2. With `ARCHITECTURE_REVIEW_PAID_ENABLED=false`, create the exact §4 predicate with action `log`.
3. Publish the log rule; a saved draft is not evidence.
4. From QA source, probe every contained path and confirm it is not classified as non-QA.
5. From a separate non-QA source, probe every contained path and confirm the predicate matches.
6. Confirm webhook and free-core routes do not match.
7. Change action to `deny`, place it above the review rate-limit, publish.
8. W01 repeats two-source probes while still paid-off:
   - non-QA: each contained path is edge-denied;
   - QA: each reaches normal application paid-off/auth handling;
   - `/api/webhook` reaches application handling;
   - deterministic free core remains operational.
9. Record project, rule state/priority, timestamp, path set, bounded source-set presence, and results without raw source IP.

No Live window starts unless W01 accepts this containment evidence.

---

## 6. Stripe Test Mode launch-candidate verification

Keep public Production paid-off. In local/Preview Test Mode use Test objects and run:

```text
npm run commercial:check:test
npm run commercial:verify:stripe-test
```

These scripts verify bounded configuration; the operator/W01 evidence packet must additionally exercise the applicable Test Mode lifecycle required by PAUC: Checkout, signed webhook reconciliation, entitlement activation, quota projection, valid-result consume, failure release, idempotent replay, cancel-at-period-end, invoice/receipt access, and `past_due` recovery using Stripe Test facilities where applicable.

Confirm Checkout uses `automatic_tax.enabled=true`. No merchant/tax-registration conclusion is inferred from Test Mode.

Test Mode never substitutes for the Live bootstrap or AC-30.

---

## 7. Paid switch / deployment transition contract

`ARCHITECTURE_REVIEW_PAID_ENABLED` is deployment configuration, not an instantaneous runtime toggle.

Every transition must be treated as:

```text
Production config intent
→ deploy/redeploy exact approved source revision
→ deployment READY
→ primary Production domain serves that deployment
→ githubCommitSha / source identity verified
→ effective offer/review behavior observed
```

Before first Live, create a fresh **paid-off baseline deployment** containing all final approved Production configuration with `ARCHITECTURE_REVIEW_PAID_ENABLED=false`. Record it as the emergency rollback target.

### Immediate fail-closed action

On abort/uncertainty:

1. immediately promote/rollback the pre-verified paid-off deployment if that is faster than a new deploy;
2. set the project Production switch configuration back to `false` so later deploys cannot silently re-enable;
3. deploy/verify the canonical paid-off state;
4. keep QA containment published;
5. preserve billing/quota/webhook records and reconcile before any retry.

Promoting an old paid-off deployment is an emergency stop, not proof that the project environment configuration has been corrected.

---

## 8. Phase 2 — first bounded Live window / legitimate entitlement

Preconditions:

- all §2 prerequisites VERIFIED;
- §5 containment W01-verified;
- paid-off rollback deployment recorded;
- controlled QA user/operator and financial operator available;
- 00 explicitly authorizes the bounded window.

Procedure:

1. If practical, establish Production QA auth before enabling paid routes.
2. Authorized Vercel operator changes only the specified paid-switch state and deploys the exact approved source revision.
3. W01 verifies Production source/deployment identity and re-probes non-QA edge denial.
4. The window begins only when the paid-enabled deployment actually serves the primary Production domain.
5. QA source verifies `/offer` is the approved enabled monthly offer.
6. Controlled QA user starts **normal application** subscription Checkout.
7. Confirm approved Stripe Live monthly Price, quantity one, no disallowed controls, and normal application return URL.
8. Do not infer entitlement from the return URL.
9. Observe real signed Stripe Live webhook and normal reconciliation to an eligible active QA entitlement with confirmed billing period and quota `10`.
10. Do **not** submit a provider-reaching or successful `/api/architecture-review` request.
11. Immediately close to paid-off using §7 once entitlement/quota evidence is confirmed.

Hard window ceiling: **15 minutes** from effective Production paid-on state. If webhook/reconciliation is incomplete at the deadline, close paid routes. The webhook remains reachable while paid-off so a legitimate late event may reconcile. Do not create a second subscription until state and charge reconciliation are unambiguous.

---

## 9. Phase 3 — entitled-user kill-switch proof while paid-off

Use the same legitimate QA entitlement while containment remains active.

1. Verify primary Production serves the paid-off deployment and `/offer` reports disabled for QA.
2. Submit one otherwise-valid Architecture Review request as the entitled QA user.
3. Require `503 review_disabled`.
4. Require provider-start/invocation count delta = 0.
5. Require quota `reserved`/`consumed` counters unchanged.
6. Verify access projection may still truthfully reflect the entitlement lifecycle.
7. Smoke Builder, Templates, JSON Import/Export, CrewAI Static Import, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python Export.
8. Confirm signed webhook reconciliation remains functional while paid-off.

Any provider start or quota mutation is a blocker. Enter fail-closed incident handling and do not proceed to §10.

---

## 10. Phase 4 — second bounded Live window / cost guard first

Preconditions: §9 PASS, entitlement remains legitimate/eligible, quota unchanged, containment still W01-verified.

### 10.1 Synthetic probe contract

Use non-sensitive synthetic Architecture Review evidence that:

- passes `architectureReviewRequestSchema` and `validateArchitectureEvidence`;
- uses a recomputed canonical evidence fingerprint;
- contains no real user/private workflow text;
- remains below the route 512 KiB HTTP body limit;
- yields provider-envelope bytes greater than the configured 32,768-byte input maximum **or** deterministically exceeds the configured worst-case request-cost ceiling;
- has already been proven in non-Production/Test Mode to reach the same `request_cost_limit_exceeded` branch.

The fixture body itself is not retained in public operational evidence.

### 10.2 Live proof

1. 00 authorizes second bounded window.
2. Deploy paid-enabled state under unchanged containment and exact approved source.
3. W01 verifies non-QA edge denial and Production identity again.
4. Submit exactly one new-idempotency-key synthetic probe.
5. Require `422 request_cost_limit_exceeded`.
6. Require the created reservation to settle `released`, with no consumption.
7. Require provider-start/invocation delta = 0.
8. If replay is used, the same idempotency key creates no extra provider invocation or consumption and accounting remains closed/idempotent.
9. Immediately return to paid-off Production and verify it.

Hard window ceiling: **15 minutes**. No successful provider-backed Architecture Review is permitted before this proof passes.

---

## 11. Bootstrap state / abort matrix

State sequence:

```text
PAID_OFF_PUBLIC
→ QA_CONTAINMENT_STAGED
→ QA_CONTAINMENT_READY
→ FIRST_LIVE_WINDOW
→ ENTITLEMENT_CONFIRMED
→ PAID_OFF_KILL_SWITCH_PROOF
→ SECOND_LIVE_WINDOW
→ COST_GUARD_PROVEN
→ PAID_OFF_POST_BOOTSTRAP
→ AC30_READY
→ AC30_IN_PROGRESS
→ AC30_PASS or FAIL_CLOSED
→ PUBLIC_ENABLEMENT_ELIGIBLE
→ PUBLIC_ENABLEMENT_TRANSITION
```

Immediately close paid routes, keep containment, stop progression, and preserve reconciliation evidence for any:

- 15-minute first/second window timeout;
- missing/late webhook past window deadline;
- reconciliation failure/mismatch;
- unexpected non-QA reachability of a contained path;
- public paid price/Subscribe/Checkout usability during QA-only window;
- WAF rule/source/priority uncertainty;
- entitlement/billing-period/quota mismatch;
- provider invocation before cost-guard proof;
- reservation leak or failed release;
- duplicate subscription/charge or financial uncertainty;
- deployment/source/config identity uncertainty;
- paid-path runtime/accounting/auth error affecting evidence integrity;
- loss of immediate rollback capability;
- secret/privacy/data exposure concern.

General rule:

```text
uncertainty
→ immediate paid-off rollback if needed
→ project switch false
→ verify paid-off Production
→ stop dependent actions
→ reconcile preserved records
→ no authority bypass
```

A late signed webhook may reconcile while paid-off. It is evidence to resolve before retry, never an automatic reopen trigger.

---

## 12. AC-30 handoff — preserve the original contract without duplicate charging

The first Live subscription from §8 is the legitimate QA subscription used for AC-30. Do **not** start a second subscription solely to repeat the subscription/entitlement leg; current Checkout correctly rejects an already active subscription.

W01 may carry §8 evidence into AC-30 steps 3–4 only if:

- W01 independently verified that exact Live path;
- the same controlled QA identity/subscription remains in use;
- source revision/deployment/config identity is recorded;
- no manual entitlement/quota mutation occurred;
- billing/reconciliation is unambiguous.

W01 may likewise carry §§9–10 into the corresponding kill-switch/cost-guard checks if no code/config/containment semantic change has occurred. Changed behavior/config requires repeating the affected proof.

Carry-forward means **reuse valid evidence**, not skip AC-30 requirements.

---

## 13. W01 Pass B financial QA / AC-30 remaining sequence

Use the same controlled QA user/subscription and real Production lifecycle. Public/non-QA paid routes remain edge-contained for the entire QA process.

1. Confirm signed-out review is blocked and provider invocation is zero.
2. Verify real Production magic-link/session establishment, bearer auth, refresh, logout, expired-token rejection, and invalid-token rejection without exposing token/email.
3. Reference and verify the §8 real Checkout/subscription evidence; do not create a duplicate subscription.
4. Reference and verify the §8 signed webhook/reconciliation evidence to active entitlement with confirmed Stripe period and quota `10`.
5. Replay/deliver the approved real lifecycle test required to verify current Stripe state is reconciled and quota/entitlement are not duplicated; do not use fake/Test Mode evidence as Live proof.
6. Under an explicitly authorized QA-contained paid-enabled segment, run one valid review. Confirm one provider invocation and one reserved→consumed transition (`remaining` 10 → 9, assuming no prior valid consumption).
7. Exercise a controlled post-reservation failure path. Confirm no consumption and idempotent release; record bounded cost metadata only.
8. Replay the same idempotency key. Confirm zero additional provider invocation and zero additional consumption.
9. Verify Customer Portal, invoice/receipt access, payment-method management, and cancel-at-period-end. Confirm `active_canceling` eligibility only to shown period end.
10. Exercise `past_due`/payment failure and recovery through real Stripe lifecycle controls. Confirm no provider use while blocked and no optimistic recovery before reconciliation.
11. Exhaust quota using the approved Production-safe procedure. The public contract remains 10; never lower public quota or edit DB state. Confirm the 10th valid reservation is allowed, the 11th is `quota_exhausted`, and the 11th provider invocation is zero.
12. Verify the §4 review rate-limit and §9 kill-switch controls; previously accepted same-revision evidence may be reused only when unchanged and still applicable.
13. Smoke complete deterministic free core.
14. Inspect relevant Vercel/Supabase/Stripe/provider operational evidence using the bounded privacy contract in §16.

Between AC-30 segments, 00/W01 may return the paid switch false while keeping containment active. A pause never removes the need to preserve/reconcile the same subscription/accounting state.

Any failed/incomplete step means AC-30 is not PASS. Close paid routes if safety/accounting/containment is uncertain.

---

## 14. Financial handling

One controlled initial QA subscription/charge is expected.

- retain that same legitimate subscription through kill-switch, cost-guard, and AC-30 when safe so evidence follows one real lifecycle;
- never create a second subscription while financial/entitlement state is unresolved;
- if bootstrap/AC-30 aborts after a charge exists, authorized financial operator cancels and issues a full refund after reconciliation is safe;
- after successful AC-30, cancel the QA subscription and issue a full refund as required by the PAUC launch contract;
- cancellation/refund uses authorized Stripe operations, never direct entitlement/quota DB edits;
- application entitlement remains driven by signed Stripe reconciliation.

Restricted record may contain the minimum financial reference needed for audit plus cancellation/refund result, operator, and timestamps. Public records must not contain customer email/user ID, Checkout/Customer/Subscription/Event/Charge/Refund IDs, receipt URL, token, or secret.

---

## 15. Public/degraded UX during QA-only verification

During QA containment and every QA-only paid-enabled window:

- deterministic free core remains public;
- non-QA `/api/billing/architecture-review/offer` is edge-denied;
- current client error handling must present the existing paid-disabled/unavailable state rather than an enabled public offer;
- non-QA Checkout/refresh/portal/review paths are edge-denied;
- general users must not see a usable price/Subscribe flow solely because the backend switch is temporarily true for QA;
- Terms/Privacy/Support remain reachable;
- the QA source may see the real enabled offer during an authorized paid-enabled deployment.

W01 verifies this from an independent non-QA source after every paid-on transition. If public UX exposes paid availability or becomes materially broken, abort rather than inventing a new Product UX in operations.

---

## 16. Evidence / privacy contract

Every state transition records, as applicable:

```text
state name + UTC timestamps
GitHub source/candidate/main SHA
Vercel deployment ID / READY / target / primary-domain observation / githubCommitSha equality
effective paid switch state
containment state + published priority + public exact path set
QA source set present/count/hash only — never raw IP in public evidence
QA vs non-QA probe result category / HTTP status
offer enabled/disabled category
signed webhook processing/reconciliation category
entitlement state category + quota counters
reservation / consume / release outcome category
provider-start / invocation count and result category
free-core smoke result
bounded runtime error category
cancellation / refund completion category
```

Restricted-only where operationally necessary:

- raw QA source IP/CIDR;
- QA email/user identity;
- auth/session tokens;
- Stripe object/event/charge/refund identifiers;
- financial receipt/reference;
- provider/project secret references;
- idempotency keys.

Never retain workflow/Evidence body, prompts, provider responses, review prose, source code, credential/secret values, or personal data merely to prove this procedure.

W01 reporting separates:

```text
Configured expectation
Static/code/config evidence
Observed Production behavior
Known / Inferred / Unknown
```

Implementation self-test, Preview READY, deployment READY, Test Mode, a return URL, or fake webhook is not Independent QA or Production Verification.

---

## 17. Operator authority

| Action | Authorized owner | Required boundary |
|---|---|---|
| Phase/prerequisite coordination and explicit bounded-window authorization | `00` | evidence coordination only; cannot pre-decide W01 verdict |
| Vercel WAF publish/reorder/rollback | authorized Vercel config operator | exact §4 rule; no public IP disclosure; no system bypass |
| paid switch config + deploy/rollback | authorized Vercel release/config operator | exact approved source, phase authorization, no unrelated env/provider change |
| Production Auth / Checkout / QA review actions | controlled QA operator | no manual DB/entitlement/quota mutation |
| Stripe Live config / cancellation / refund | authorized Stripe/financial operator | written financial authority; restricted refs |
| repository implementation if later mechanically required | `C01` | separately specified scope; no Product/commercial invention |
| containment/bootstrap/AC-30/public-transition independent verdict | `W01` | exact revision/config/evidence; operator self-test is not substitute |
| new Product/Architecture/security authority decision | `01` / applicable authority | only for genuine semantic gap outside ADR-0011 |

---

## 18. Phase 6 — public enablement is a separate transition

QA-only bootstrap success and AC-30 PASS do **not** themselves make public paid access live.

Before removing QA containment:

1. AC-30 and all required paid Production evidence are independently accepted.
2. `00` confirms no remaining Phase G blocker and records authorization for the public transition.
3. exact current `main` / W01-approved revision and paid-off Production identity are rechecked.
4. W01 records the current containment rule and expected removal/change.
5. authorized operator performs the explicitly approved containment removal/change and public paid switch deployment.
6. W01 independently verifies:
   - GitHub main SHA = Vercel Production `githubCommitSha`;
   - deployment `READY`, `target=production`, correct domain;
   - public offer/Checkout/access behavior matches PAUC;
   - review remains entitlement+quota gated;
   - WAF review rate limit remains active;
   - free deterministic core remains available;
   - no relevant runtime errors/secrets are observed.

Failure re-enters `FAIL_CLOSED`: paid switch false and QA containment restored/retained as required.

Only after this transition may Paid Access be classified Production Verified under the existing PAUC lifecycle. That still does not mark Commercial Validation Gate M0, Gate A, Stage 1.5, Stage 2, AI Authority, or Mutation Authority as advanced.

---

## 19. Current execution status

The procedure contract is implementation/operations-ready, but actual execution is conditional:

```text
first-Live procedure = SPECIFIED
current paid Production = DISABLED / FAIL-CLOSED
actual first-Live execution = BLOCKED until Phase 0 prerequisites + W01 containment proof
PAUC AC-30 = NOT COMPLETE
public paid access = NOT ENABLED
```

At the 2026-09-13 specification baseline, connected Vercel evidence still showed a Hobby team/account and the actual published Firewall inventory/source set/external approvals were not fully inspectable. `00` and named external operators own those prerequisites. Do not route paid enablement directly to C01 merely because the procedure is now specified.