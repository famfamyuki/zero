# Architecture Review Paid Launch Runbook

Status: **Launch-candidate operations contract; paid Production remains disabled until the canonical release gate**  
Scope: external readiness, W01 financial QA/AC-30 evidence, incident disablement, and rollback for `architecture_review_individual_monthly_v0`.

This runbook records the Product-approved provisional launch configuration. It does not approve merchant identity, tax registration/geography, merge, release, or paid enablement; W01 independently verifies the exact approved revision.

## 1. Immutable launch boundary

```text
Provider-backed Architecture Review = paid entitlement only
Included quota = 10 valid reviews / confirmed monthly Stripe billing period
Public base price = USD 12.00 / month (provisional launch configuration)
Tax = Stripe Tax, calculated separately when applicable under approved jurisdiction/configuration
Overage / rollover / trial / annual / top-up / multiple tiers = none
Free deterministic core = independent of Auth, Stripe, quota DB, and provider state
```

Keep `ARCHITECTURE_REVIEW_PAID_ENABLED=false` in Production until every checklist below is evidenced and the QA-approved revision is deployed. Never authorize from email, browser state, client user ID, checkout return URL, analytics, or Stripe metadata alone.

## 1.1 First-launch procedure gap — BLOCKED

The existing pre-enable requirements are not a safe executable first-launch sequence yet. With no pre-existing legitimate Live entitlement, Production paid-off Checkout returns `503 review_disabled` (`app/api/billing/architecture-review/checkout/route.ts`, `parsePaidArchitectureReviewConfig`). The review route also stops before entitlement/reservation/cost-guard execution when paid-off. Section 6 obtains a legitimate Live subscription/entitlement only after controlled enablement, while Program Board Phase G requires Live webhook-reconciliation and entitled-user control evidence beforehand. Section 1's “every checklist” rule must not be used to assume those later Live checks already passed.

**Procedure unresolved / BLOCKED:** (1) first Live entitlement acquisition and pre-enable Live webhook lifecycle proof; (2) environment and ordering for the pre-enable entitled-user kill-switch and cost-guard/reservation-release proof. No existing Live user is assumed. Non-Production Test Mode evidence under §§3–4 and Production paid-off Auth/WAF/disabled/free-core evidence can be prepared independently, but neither resolves these procedure gaps or satisfies AC-30. Configuration/approval, Test Mode, paid-off, and post-enable Live evidence are separately routed in [Program Board Phase G](../roadmap/PROGRAM_BOARD.md#phase-g--external-prerequisites--controlled-production-paid-enablement--pending--blocked).

`00` tracks both blockers. `01` must resolve any safety/sequence/authority decision; `02` must specify the permitted first-entitlement source, environment, containment, exact ordering, responsible operators, completion evidence, financial handling and abort/disable/re-enable conditions in the authoritative packet/runbook. W01 independently reviews that revision; C01 may implement only specified changes through the normal protected PR lifecycle. Until resolution and prerequisite evidence, keep Production paid-off and do not start §6. Do not move or waive mandatory evidence, grant manual entitlement/quota, treat test/fake webhooks as Live proof, or infer a bootstrap exception from PAUC §24's equivalent Stripe-approved mechanism wording. This gap record authorizes no new procedure.

## 2. Pre-enable evidence packet

Record values in the restricted release record; do not paste secret values into tickets, chat, screenshots, logs, or this repository.

- Exact GitHub branch/head and W01 Pass A approved revision.
- Vercel Preview is `READY`, `target != production`, and `githubCommitSha` equals branch head.
- `npm run docs:check`, `npm test`, `npm run typecheck`, `npm run build`, and `npm run commercial:check` pass on that revision.
- `npm run commercial:check:enabled` passes only in a restricted launch-candidate environment with the final switch value; the public Production switch remains false.
- Commercial-use hosting eligibility is verified under current vendor terms.
- Supabase Production magic-link delivery and allowed redirect URLs are verified without logging email/token values.
- One active USD 12.00, licensed, recurring monthly Stripe Price is configured; no trial, promotion, metering, quantity transform, annual option, seats, or alternate plan is exposed.
- The dedicated Stripe Customer Portal configuration permits payment method, invoice/receipt, and cancel-at-period-end only.
- Terms, Privacy, and Support URLs are public HTTPS URLs, reachable without authentication, and contain the approved paid/provider/billing disclosures.
- Stripe Tax is enabled for Checkout; merchant identity, tax registration/configuration, refund/charge handling, launch geography, and support ownership have written external approval.

## 3. Provider budget and kill switch

Use a dedicated Production provider project/key. Configure and independently record:

- warning at USD 20 monthly spend, critical at USD 40, and a hard monthly ceiling at USD 50;
- alert recipients and an exercised notification path;
- the model exactly matching `ARCHITECTURE_REVIEW_MODEL` and `ARCHITECTURE_REVIEW_COST_PROFILE_MODEL`;
- model `gpt-5.6-sol`, input envelope maximum 32,768 bytes, output maximum 4,096 tokens, input/output rates 4,000,000/20,000,000 micro-USD per million tokens, and worst-case request ceiling 250,000 micro-USD.

Before enablement, prove that a cost-guard rejection invokes the provider zero times and releases the reservation. Exercise the app kill switch with a controlled entitled user: the review returns `review_disabled`, provider invocation and quota change are zero, while Builder, Templates, JSON Import/Export, CrewAI Static Import, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python Export still work.

## 4. Stripe Test Mode launch-candidate verification

Keep `ARCHITECTURE_REVIEW_PAID_ENABLED=false` in public Production. In a local or Preview test environment, use Test Mode objects and run:

```text
npm run commercial:check:test
npm run commercial:verify:stripe-test
```

The verification requires a Test Mode key, the configured USD 12 monthly Price, and the dedicated Portal configuration. Exercise Checkout, signed webhook reconciliation, entitlement activation, quota 10 projection, valid-result consume, failure release, idempotent replay, cancel-at-period-end, invoice/receipt access, and `past_due` recovery with Stripe Test Clocks/test payment methods where applicable. Confirm Checkout uses `automatic_tax.enabled=true`; no jurisdiction or registration conclusion is inferred from Test Mode.

Incident action: set `ARCHITECTURE_REVIEW_PAID_ENABLED=false`, confirm the offer reports `enabled=false`, stop new provider review/checkout actions, retain billing/quota records, and reconcile Stripe/Supabase before any re-enable. Do not drop paid tables or infer that the provider budget control repaired entitlement state.

## 5. Vercel WAF contract

Configure an edge rule matching exactly `POST /api/architecture-review` at **5 requests per 60 seconds per client IP or stricter**. Application quota and one-in-flight controls are defense in depth, not substitutes.

W01 verifies from a controlled source:

1. requests within the allowed window reach the application normally;
2. the next request is edge-blocked with the configured bounded response;
3. blocked requests produce zero provider invocation, zero reservation, and zero consumption;
4. unrelated free routes and the deterministic core remain available;
5. the live rule scope, threshold, deployment/project, timestamp, and privacy-safe evidence are recorded.

## 6. W01 Pass B financial QA / AC-30

Use a controlled QA user and the real Production magic-link plus Stripe live subscription path. Do not directly edit entitlement/quota, grant manual quota, or substitute fake webhook/test mode for live evidence.

1. Confirm signed-out review is blocked and provider invocation is zero.
2. Request and complete the real magic link; verify session establishment, bearer authentication, refresh, logout, expired-token rejection, and invalid-token rejection without exposing token/email.
3. Start subscription Checkout. Confirm `mode=subscription`, one configured monthly Price, quantity one, and no disallowed product controls.
4. Confirm the return URL alone grants nothing. Observe the signed webhook and entitlement reconciliation to `active` with a confirmed Stripe period and quota `10`.
5. Replay the same webhook and an older/out-of-order lifecycle event. Confirm current Stripe state is reconciled and quota/entitlement are not duplicated.
6. Run one valid review. Confirm one provider invocation and exactly one transition from reserved to consumed (`remaining` 10 → 9).
7. Exercise a controlled failure path after reservation (timeout, provider error, or invalid structured result). Confirm no consumption and an idempotent release. Record any operator cost as metadata only.
8. Replay the same idempotency key. Confirm zero additional invocation and zero additional consumption.
9. Verify the Customer Portal, invoice/receipt access, payment-method management, and cancel-at-period-end. Confirm `active_canceling` remains eligible only to the shown period end.
10. Exercise `past_due`/payment failure and recovery through real Stripe lifecycle controls. Confirm no new provider use while blocked and no optimistic recovery before reconciliation.
11. Exhaust the quota using the approved production-safe procedure. The public contract remains 10; do not lower public quota or manually edit DB state. Confirm the 10th valid reservation is allowed, the 11th is `quota_exhausted`, and the 11th invokes provider zero times.
12. Run the WAF and kill-switch checks in sections 3 and 5, then smoke the complete free deterministic core.
13. Inspect relevant Vercel/Supabase/Stripe/provider operational evidence for bounded categories only—no email, token, workflow/Evidence body, prompt, provider response, review prose, source code, or secret.

After live financial QA, cancel the QA subscription and issue a full refund of the QA charge. The restricted record contains only the charge/receipt reference, cancellation result, refund completion, operator, and timestamps. Never retain email, token, workflow/Evidence, prompt, provider output/review prose, or secrets. A failed or incomplete step means Production Verified is not declared; disable the paid switch if safety or accounting is uncertain.

## 7. Evidence and release identity

The W01 report must separate `Known / Inferred / Unknown` and include:

```text
GitHub main SHA
W01-approved candidate SHA
Vercel deployment ID / READY / target=production / aliases
Vercel githubCommitSha
GitHub main SHA = Vercel githubCommitSha result
Stripe/Supabase/provider/WAF verification timestamps and bounded outcomes
paid switch state before, during, and after controlled verification
free-core smoke result
```

Implementation self-test, Preview `READY`, deployment `READY`, Stripe test mode, or a fake webhook is not Independent QA or Production Verification.
