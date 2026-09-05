# Architecture Review Paid Launch Runbook

Status: **Launch-candidate operations contract; paid Production remains disabled until the canonical release gate**  
Scope: external readiness, W01 financial QA/AC-30 evidence, incident disablement, and rollback for `architecture_review_individual_monthly_v0`.

This runbook does not approve a public Price, Currency, request-cost envelope, provider budget, tax treatment, refund policy, merge, release, or paid enablement. Product/commercial authority supplies those inputs; W01 independently verifies the exact approved revision.

## 1. Immutable launch boundary

```text
Provider-backed Architecture Review = paid entitlement only
Included quota = 10 valid reviews / confirmed monthly Stripe billing period
Overage / rollover / trial / annual / top-up / multiple tiers = none
Free deterministic core = independent of Auth, Stripe, quota DB, and provider state
```

Keep `ARCHITECTURE_REVIEW_PAID_ENABLED=false` in Production until every checklist below is evidenced and the QA-approved revision is deployed. Never authorize from email, browser state, client user ID, checkout return URL, analytics, or Stripe metadata alone.

## 2. Pre-enable evidence packet

Record values in the restricted release record; do not paste secret values into tickets, chat, screenshots, logs, or this repository.

- Exact GitHub branch/head and W01 Pass A approved revision.
- Vercel Preview is `READY`, `target != production`, and `githubCommitSha` equals branch head.
- `npm run docs:check`, `npm test`, `npm run typecheck`, `npm run build`, and `npm run commercial:check` pass on that revision.
- `npm run commercial:check:enabled` passes only in a restricted launch-candidate environment with the final switch value; the public Production switch remains false.
- Commercial-use hosting eligibility is verified under current vendor terms.
- Supabase Production magic-link delivery and allowed redirect URLs are verified without logging email/token values.
- One active, positive-amount, licensed, recurring monthly Stripe Price is configured; no trial, promotion, metering, quantity transform, annual option, seats, or alternate plan is exposed.
- The dedicated Stripe Customer Portal configuration permits payment method, invoice/receipt, and cancel-at-period-end only.
- Terms, Privacy, and Support URLs are public HTTPS URLs, reachable without authentication, and contain the approved paid/provider/billing disclosures.
- Tax, refund, charge handling, launch geography, and support ownership have written external approval.

## 3. Provider budget and kill switch

Use a dedicated Production provider project/key. In the provider console, independently record:

- a hard spend ceiling approved by 01/release authority;
- warning and critical alerts, their recipients, and an exercised notification path;
- the model exactly matching `ARCHITECTURE_REVIEW_MODEL` and `ARCHITECTURE_REVIEW_COST_PROFILE_MODEL`;
- the approved input bytes, output token cap, price profile, and worst-case request-cost ceiling.

Do not invent numeric values in this runbook. Before enablement, prove that a cost-guard rejection invokes the provider zero times and releases the reservation. Exercise the app kill switch with a controlled entitled user: the review returns `review_disabled`, provider invocation and quota change are zero, while Builder, Templates, JSON Import/Export, CrewAI Static Import, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python Export still work.

Incident action: set `ARCHITECTURE_REVIEW_PAID_ENABLED=false`, confirm the offer reports `enabled=false`, stop new provider review/checkout actions, retain billing/quota records, and reconcile Stripe/Supabase before any re-enable. Do not drop paid tables or infer that the provider budget control repaired entitlement state.

## 4. Vercel WAF contract

Configure an edge rule matching exactly `POST /api/architecture-review` at **5 requests per 60 seconds per client IP or stricter**. Application quota and one-in-flight controls are defense in depth, not substitutes.

W01 verifies from a controlled source:

1. requests within the allowed window reach the application normally;
2. the next request is edge-blocked with the configured bounded response;
3. blocked requests produce zero provider invocation, zero reservation, and zero consumption;
4. unrelated free routes and the deterministic core remain available;
5. the live rule scope, threshold, deployment/project, timestamp, and privacy-safe evidence are recorded.

## 5. W01 Pass B financial QA / AC-30

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
12. Run the WAF and kill-switch checks in sections 3–4, then smoke the complete free deterministic core.
13. Inspect relevant Vercel/Supabase/Stripe/provider operational evidence for bounded categories only—no email, token, workflow/Evidence body, prompt, provider response, review prose, source code, or secret.

If a live charge occurs, record receipt, refund/cancellation action, accounting owner, and completion under the externally approved procedure. Never improvise a refund/tax conclusion. A failed or incomplete step means Production Verified is not declared; disable the paid switch if safety or accounting is uncertain.

## 6. Evidence and release identity

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
