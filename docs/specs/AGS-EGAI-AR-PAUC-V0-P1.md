# AGS-EGAI-AR-PAUC-V0-P1 — Architecture Review Paid Access & Usage Control v0

Status: **Specified**  
Owner: `02 — UX & Implementation Specification`  
Selected by: `01 — Product Architecture & Roadmap` through the current Program Board / accepted monetization decisions  
Specification baseline: GitHub `main` `baf349bccdd0baf1a7b0e04a639dd4be13a1ad38`; live repository/Production reality always supersedes this historical baseline  
Coupled milestone: `docs/specs/AGS-EGAI-AR-V0-P1.md` — Stage 1 Evidence-Grounded AI Architecture Review v0

This packet is the smallest sufficient paid-access release prerequisite for provider-backed Architecture Review. It does **not** expand Stage 1 evaluator scope, AI authority, semantic mutation authority, or the deterministic product contract.

---

## 0. Decision summary

The initial provider-backed Architecture Review uses an AgentGraph-owned provider credential and is available only to an authenticated user with a server-verified paid entitlement and remaining server-enforced quota.

The request path is:

```text
User action
→ server-verified Supabase identity
→ local Stripe-derived entitlement read model
→ atomic quota reservation
→ request-cost guard
→ existing Stage 1 provider review
→ Stage 1 result validation
→ atomic consume or release
→ user result / bounded failure
```

Authority is intentionally separated:

```text
Stripe subscription state
  = commercial billing source

Supabase entitlement read model
  = server runtime authorization projection of Stripe state

Quota tables / atomic RPCs
  = usage authority

Architecture Review provider adapter
  = AI evaluation only

Provider budget / WAF / application kill switch
  = operator cost/abuse defense in depth
```

Billing state is not quota state. Quota state is not provider cost accounting. None of these becomes workflow semantic authority.

---

# 1. Goal and user problem

Stage 1 Architecture Review cannot be publicly released with an operator-funded provider credential while requests are unauthenticated/unlimited. The user needs a clear path to:

1. sign in;
2. understand that deterministic AgentGraph features remain free while provider-backed Architecture Review is paid and usage-limited;
3. purchase the initial monthly Architecture Review access offering;
4. see entitlement/quota state and billing-period reset date;
5. request a review only when server authority allows it;
6. receive a valid review or a clear failure without being silently charged a review unit when the provider/validation fails;
7. manage/cancel the subscription through Stripe-hosted billing management.

This packet is a Production release prerequisite, not evidence that the subscription model has been commercially validated.

---

# 2. Upstream fixed boundaries

The following are fixed by `ADR-0006`, `ADR-0007`, `MONETIZATION_ARCHITECTURE.md`, the active Stage 1 packet, Product/Architecture masters, and the current Program Board:

- AgentGraph owns the provider credential and provider cost for the initial offering.
- Initial provider-backed Architecture Review is paid access.
- Unlimited provider-backed review is prohibited.
- User quota is hard-enforced server-side.
- BYOK is not part of the initial offering.
- Deterministic builder, Templates, JSON Import/Export, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python export remain free and AI-independent.
- Stage 1 remains advisory Architecture Review (`AE1`); this packet grants no additional AI authority.
- No Proposal → Semantic Patch → Apply or other semantic mutation is introduced.
- Commercial Validation Gate M0 remains separate from AI authority/promotion gates.
- Paid Access `Production Verified` means the access/control mechanism works in Production; it does **not** mean the price/quota/subscription model is commercially validated.
- The existing Stage 1 request/result/evidence contracts remain authoritative and unchanged unless this packet explicitly adds an access/accounting error around the provider request.
- Existing one-time template checkout/purchase behavior remains separate and backward-compatible.

---

# 3. Current reality at specification time

## Known

- Current `main` has Stripe server support and one-time template Checkout (`mode=payment`) plus a Stripe webhook that records completed template purchases.
- Current `main` has browser Supabase and server service-role Supabase clients.
- Current typed database surface contains `templates` and `purchases`; no entitlement/quota/usage tables or RPCs exist.
- Current `main` has no application sign-in/session UX or server request authentication path.
- The Stage 1 implementation branch currently exposes `POST /api/architecture-review` with a 512 KiB request cap, 45 second provider timeout, `Cache-Control: no-store`, validated structured result, and no automatic provider retry.
- Stage 1 already specifies a Production edge/WAF contract of at least 5 requests per 60 seconds per client IP for `POST /api/architecture-review`.
- Production currently renders `100% Free Tool`; this becomes contradictory once public paid Architecture Review is enabled.
- Current Vercel Production is `READY`, `target=production`, and its `githubCommitSha` matches the specification-time `main` SHA.
- The current Vercel team is on Hobby. Current Vercel Terms state Hobby is personal/non-commercial use; therefore a paid public launch on the current hosting plan is blocked until commercial-use eligibility is changed and reverified.

## Inferred

- Supabase is the smallest sufficient identity/persistence platform because it is already an application dependency and `ADR-0006` names it as the preferred entitlement store.
- Stripe-hosted Checkout + Customer Portal is the smallest sufficient billing UX because custom card/payment-management UI would add PCI/security/product scope without user value for v0.

## Unknown / evidence-dependent

- Public launch price, currency, and included review count.
- Representative and high-percentile successful/failed provider cost distributions for the final Production evaluator configuration.
- Paid willingness-to-pay, repeat-use, cancellation, refund/support, and quota-utilization evidence.
- Whether the current Production Supabase project has email Auth delivery/configuration ready for public use.
- Final legal/tax/refund-policy content and public URLs until commercial launch operations approve them.

These Unknowns do **not** require C01 to choose Product policy. They are explicit launch configuration/operations gates defined below.

---

# 4. Included scope

## Included

- Supabase Auth email magic-link sign-in/sign-out for the initial individual paid user identity.
- Server verification of Supabase access tokens; client-provided user IDs are never authoritative.
- One individual recurring monthly Stripe Architecture Review subscription path.
- Stripe Customer mapping and Stripe-derived entitlement read model in Supabase.
- Subscription lifecycle handling for active, cancel-at-period-end, past-due/payment failure, unpaid, incomplete, paused, canceled/deleted, and degraded/unknown synchronization states.
- Server-authoritative quota keyed to the Stripe subscription billing period.
- Atomic reservation, provider-start marker, consume, release, stale-reservation recovery, idempotency, and one in-flight review per user.
- Provider input/output/cost guard before provider invocation.
- Privacy-safe operational cost/usage ledger metadata.
- Application paid-review kill switch and explicit configuration validation.
- Existing Stage 1 Architecture Review endpoint integration without widening evaluator payload or result scope.
- Stripe-hosted billing portal for payment method/invoice access and cancel-at-period-end.
- Paid offer/access/quota/error/loading/degraded UX in the Architecture Review surface.
- Removal of the contradictory `100% Free Tool` claim; deterministic free-core messaging remains explicit.
- Minimal additive commercial-funnel analytics with strict allowlists and preservation of existing events.
- Additive database migration and typed database updates.
- Independent QA and Production release verification contract.

## Deferred / Out of Scope

- Team, Enterprise, organization/RBAC, collaboration, seats, marketplace, creator payouts.
- Multiple paid tiers, annual billing, trials, usage-based overages, credit packs, quota top-ups, rollover, family/shared quota.
- BYOK.
- Custom payment form, custom invoice engine, in-app refund processing, tax engine, or merchant-of-record implementation.
- General account/profile system beyond the minimum sign-in/sign-out identity required here.
- Self-service account deletion UI; support-assisted deletion behavior is defined only for data handling.
- Persistent Architecture Review result/history.
- Any evaluator rubric/model authority expansion.
- Guided Improvement, Semantic Patch, Apply, or workflow mutation.
- Changes to `GraphDocumentV1`, JSON import/export semantics, deterministic Preflight, or CrewAI export semantics.
- Commercial Validation Gate M0 outcome or any assumption that recurring value is proven.

---

# 5. Architecture and authority model

## PAUC-R01 — Free-core failure isolation

No auth, Stripe, Supabase billing-table, quota, provider, or paid-control failure may disable or alter deterministic free features. Paid state is read only by the paid Architecture Review surface and provider-backed Architecture Review route.

## PAUC-R02 — Server authority

The browser may display cached/last-fetched entitlement and quota state for UX only. It may never authorize a provider request. Every provider-backed request re-establishes, on the server:

1. paid feature enabled/configured;
2. authenticated Supabase user;
3. eligible entitlement state and current period;
4. atomic quota availability/reservation;
5. request-cost guard;
6. provider invocation.

## PAUC-R03 — Billing authority

Stripe is authoritative for commercial subscription state. Runtime provider requests do not synchronously ask Stripe on every review. Stripe lifecycle events and explicit low-frequency reconciliation update a Supabase read model used by the review hot path.

## PAUC-R04 — Quota authority

Supabase transactional quota state is authoritative for whether an entitled user may start a new provider-backed review. Stripe metadata, client counters, PostHog, and UI state are not quota authority.

## PAUC-R05 — AI/mutation authority

This packet preserves Stage 1 `AE1 — Review` only. It adds no proposal, patch, apply, tool/security recommendation authority, or mutation operation.

---

# 6. Identity and user states

## 6.1 Initial authentication method

Use Supabase Auth email magic-link/passwordless sign-in as the only new v0 authentication method.

- No social OAuth, password account flow, SSO, organization identity, or anonymous paid identity.
- Client obtains/refreshes the Supabase session through `@supabase/supabase-js`.
- Paid API calls send the current Supabase access token in `Authorization: Bearer <token>`.
- Server authenticates with `supabase.auth.getUser(accessToken)` using a server-side Supabase client/service role and uses only the verified returned `user.id` as identity.
- Email address is not accepted as authorization identity and is never written to PostHog/logs by this packet.
- Session expiry before reservation returns an authentication error and performs no provider call or usage change.

Production enablement requires working email delivery/redirect configuration on the Production Supabase project.

## 6.2 User-visible access states

The paid Architecture Review UI must map server state into exactly these semantic states:

| State | Meaning | Provider action |
|---|---|---|
| `signed_out` | no verified user session | blocked; show sign-in |
| `no_entitlement` | signed in, no eligible paid subscription | blocked; show paid offer |
| `checkout_syncing` | checkout returned but entitlement webhook/reconciliation not yet authoritative | blocked; show syncing/refresh path |
| `active` | Stripe-derived active entitlement, current period valid, quota available | allowed |
| `active_canceling` | Stripe status still active and `cancel_at_period_end=true`; current period valid | allowed until period end |
| `quota_exhausted` | active entitlement but consumed + reserved has reached period limit | blocked until next eligible period |
| `billing_blocked` | `past_due`, `unpaid`, `incomplete`, `incomplete_expired`, `paused`, `canceled`, deleted, or other non-active Stripe state | blocked; show billing-management/recovery path |
| `sync_degraded` | local entitlement cannot be trusted after a known reconciliation failure or period expiry without a confirmed new period | fail closed; no provider call |
| `review_disabled` | application kill switch/config/provider-cost profile prevents paid review | blocked; deterministic features remain available |

Client rendering may have transient `loading` and request `running` states; those are UX states, not entitlement authority.

---

# 7. Stripe subscription lifecycle

## PAUC-R06 — Initial plan contract

Internal stable plan key:

```text
architecture_review_individual_monthly_v0
```

The marketing label must be `Architecture Review`; do not introduce `Pro`, Team, Enterprise, or a durable tier hierarchy in this packet.

A server-only `STRIPE_ARCHITECTURE_REVIEW_PRICE_ID` selects exactly one active recurring monthly Stripe Price. C01 must not hard-code a public amount or invent the launch price. The checkout/offer code validates that the configured Price is active and recurring with interval `month`; an invalid/missing price fails closed while paid review is disabled/unavailable.

No free trial, quantity selection, annual interval, promotion-code flow, overage, or metered billing is enabled by this packet.

## PAUC-R07 — Checkout

Create a separate authenticated route for Architecture Review subscription Checkout. Do **not** repurpose `/api/checkout` or its template metadata semantics.

Required Stripe Checkout properties:

- `mode: subscription`
- existing/created Stripe Customer mapped to verified Supabase `user_id`
- `client_reference_id = user_id`
- subscription/session metadata includes only bounded identifiers: `kind=architecture_review_subscription_v0`, `plan_key`, `user_id`
- exactly the configured Price ID, quantity 1
- no trial
- success returns to the application with a non-authoritative billing-success marker
- cancel returns to the Architecture Review paid-offer surface

Checkout redirect/query parameters never grant entitlement.

Checkout request retries use an `Idempotency-Key` UUID and Stripe idempotency. The server checks current entitlement before creating a session. If an eligible subscription already exists, it does not create another subscription and directs the user to billing management instead.

If a duplicate active Architecture Review subscription is nevertheless observed for one user, entitlement becomes `sync_degraded`/blocked and an operational error is recorded; the system must not silently combine quotas or bill multiple subscriptions as one entitlement.

## PAUC-R08 — Customer Portal

Use a dedicated configured Stripe Customer Portal configuration. The initial portal must permit:

- payment method management;
- invoice/receipt access;
- cancellation at period end.

It must not offer plan switching, quantity/seats, annual conversion, overage, Team/Enterprise, or other unselected product options.

`STRIPE_BILLING_PORTAL_CONFIGURATION_ID` is required before public paid enablement.

## PAUC-R09 — Lifecycle mapping

Runtime entitlement mapping is conservative:

- Stripe `active` + current period valid → eligible.
- `active` + `cancel_at_period_end=true` → eligible only until `current_period_end`; no new period is assumed.
- `past_due` → blocked immediately after the state is reconciled; no provider-funded grace period in v0.
- `unpaid`, `incomplete`, `incomplete_expired`, `paused`, `canceled`, deleted, or unexpected status → blocked.
- `trialing` is not an approved v0 product state; if encountered through misconfiguration, fail closed as `billing_blocked`.
- Local period expiry without a newly reconciled active period → `sync_degraded`/blocked.
- Payment recovery/new active period becomes available only after webhook or explicit reconciliation updates the server read model.

## PAUC-R10 — Webhook handling

Extend the existing signature-verified `/api/webhook` without breaking template purchases.

- Existing `checkout.session.completed` for `mode=payment` + template metadata retains current purchase behavior.
- Architecture Review subscription events are identified by explicit `kind/plan_key` metadata and/or the mapped subscription/customer; they must never be inserted as template purchases.
- Handle at minimum `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, and `invoice.payment_failed` where relevant to reconciliation.
- Webhook event IDs are deduplicated in a metadata-only table.
- Subscription lifecycle events reconcile the current Stripe Subscription snapshot rather than blindly applying possibly out-of-order stale event payload state.
- A reconciliation failure returns a retryable server failure and marks an already-known affected entitlement `sync_degraded` where that can be done safely; it never grants optimistic access.
- Replaying the same webhook or reconciliation is idempotent.

Runtime review requests do not call Stripe unless the user explicitly uses the bounded billing-refresh recovery path; that recovery path is not called automatically for every review.

---

# 8. Server-side entitlement read model

## PAUC-R11 — Entitlement record

Supabase stores one current Architecture Review entitlement projection per user/subscription with at least:

- `user_id` — verified Supabase UUID;
- `plan_key`;
- `stripe_subscription_id`;
- `stripe_price_id`;
- raw bounded `stripe_status`;
- `cancel_at_period_end`;
- `current_period_start`;
- `current_period_end`;
- `sync_state` = `healthy | degraded`;
- `last_stripe_event_id` where available;
- `last_synced_at`;
- timestamps.

The application derives `active`, `active_canceling`, `billing_blocked`, or `sync_degraded`; it does not store a user-editable entitlement flag.

A missing row is `no_entitlement`, not an implicit free allowance.

---

# 9. Quota contract

## PAUC-R12 — Quota unit

One quota unit means one **valid, post-validated Architecture Review result** produced for an accepted user request.

- Provider timeout/error/rate limit/invalid structured output consumes zero user units.
- Pre-provider validation/cost-guard rejection consumes zero user units.
- A valid result consumes exactly one unit before it is returned to the client.
- No fractional units, rollover, overage, purchased credits, or shared quota.

## PAUC-R13 — Quota period and reset

Quota period is the Stripe subscription `current_period_start` → `current_period_end`, not a calendar month and not a client clock month.

A period row snapshots the configured included-review limit when that period is first used. Changing the configured quota later does not silently alter the current in-progress period; the new value applies to a subsequent period/new subscription after release approval.

No cron-based reset is required. A newly reconciled eligible Stripe period creates/uses a new quota-period row. If there is no confirmed new eligible period, access stays blocked after the old period ends.

## PAUC-R14 — Included quota configuration

`ARCHITECTURE_REVIEW_INCLUDED_REVIEWS` is a required positive integer **when paid review is enabled**. There is no Production fallback/default that guesses a commercial quota.

- test fixtures may use a small explicit value such as `3`; that number is not Product policy;
- Production with missing/invalid quota config must keep paid review disabled/fail closed;
- the launch value is selected by `01`/commercial release evidence, not by C01.

## PAUC-R15 — Atomic availability

Availability is:

```text
consumed_count + reserved_count < quota_limit_snapshot
```

Reservation and this check occur in one database transaction/RPC. Client counters cannot race past the quota.

Exactly one active `reserved` review is allowed per user in v0. A second concurrent request is rejected before provider invocation.

---

# 10. Persistence and migration contract

The current repository has no Supabase migration directory. C01 introduces additive SQL under:

```text
supabase/migrations/<timestamp>_architecture_review_paid_access_v0.sql
```

and updates `types/database.ts` to match.

No workflow schema/document migration occurs.

## PAUC-R16 — Required tables

### `billing_customers`

Minimum fields:

- `user_id uuid primary key references auth.users(id)`
- `stripe_customer_id text unique not null`
- `created_at`, `updated_at`

### `architecture_review_entitlements`

Minimum fields as PAUC-R11; unique user/current subscription constraints must prevent two subscriptions from being treated as one entitlement.

### `architecture_review_usage_periods`

Minimum fields:

- `user_id`
- `stripe_subscription_id`
- `period_start`, `period_end`
- `quota_limit_snapshot`
- `consumed_count`
- `reserved_count`
- timestamps

Unique key identifies one user/subscription/period.

### `architecture_review_usage_attempts`

Metadata only:

- `request_id uuid primary key`
- `user_id`
- period/subscription foreign identity
- `state = reserved | consumed | released`
- `provider_started_at` nullable
- `reservation_expires_at`
- bounded `provider_outcome`
- `review_version`, `evidence_version`, `reviewer_version`, `provider_id`, `model_id` where available
- input/output/total token counts where returned by provider, nullable
- preflight worst-case cost estimate and post-call cost estimate in integer micro-USD, nullable
- cost estimate profile/version/status
- bounded failure category
- timestamps

Do **not** store workflow JSON, Evidence payload, prompt text, provider request/response body, findings, recommendations, result prose, node/target text, email, payment method, or secrets.

### `stripe_webhook_events`

Minimum metadata-only dedupe state:

- `event_id text primary key`
- `event_type`
- `state = processing | processed | failed`
- `event_created_at`
- `processed_at` nullable
- bounded failure category nullable

No raw webhook JSON persistence is required.

## PAUC-R17 — Database access boundary

- Enable RLS on all new public tables.
- Add no browser `anon`/`authenticated` policies granting direct billing/quota/usage access.
- All writes and authoritative reads are server-side through the service-role boundary.
- Atomic reserve/start/finalize/release logic must execute transactionally in SQL/RPC or an equivalent database transaction; read-then-write in separate client operations is insufficient.
- Security-definer RPCs, if used, revoke direct execution from browser roles and validate all inputs.

## PAUC-R18 — Retention/deletion/export

- App DB entitlement/quota/attempt metadata is retained only as necessary for active billing support, M0 evidence, abuse/cost reconciliation, and dispute debugging; v0 operational target is a maximum of 180 days for closed usage-attempt metadata unless a documented legal/accounting requirement requires longer retention.
- Current entitlement/customer mappings live while the account/subscription relationship exists.
- No workflow/Evidence/result content is retained by this packet.
- No app-specific billing-data export UI is added. Stripe Customer Portal provides invoices/receipts; workflow JSON/export remains unchanged and free.
- No self-service account deletion UI is added. A support-assisted account deletion must cancel/resolve an active Stripe subscription first, then delete app entitlement/quota/customer mappings with the Supabase user. Stripe may retain legally required billing records according to its/public commercial policy; this must be disclosed by the final Privacy/Terms material.
- C01 must implement bounded cleanup for expired webhook-dedupe/closed usage metadata without requiring a browser client. A scheduled job is optional; safe opportunistic/server maintenance is acceptable if it enforces the same retention contract.

---

# 11. Usage reservation, idempotency, concurrency, and failure semantics

## PAUC-R19 — Idempotency key

`POST /api/architecture-review` requires `Idempotency-Key` containing a valid UUID generated once for each explicit user review action.

The key is scoped by authenticated user and bound to one usage attempt. Reuse never invokes the provider twice.

Replay behavior:

| Existing attempt | Server behavior |
|---|---|
| none | atomically reserve if eligible/quota available |
| `reserved` | return `review_in_progress`; no provider call/no second reservation |
| `consumed` | return `review_already_completed`; no provider call/no second unit |
| `released` | return `review_attempt_closed`; no provider call; explicit retry requires a new user action/new key |

Stage 1 does not persist review results, so a completed idempotent replay is deliberately **not** reconstructed from stored prose. This is a known v0 limitation, not permission to persist the result.

## PAUC-R20 — Reservation lifecycle

Required state machine:

```text
reserved
├─> provider_started
│    ├─> valid post-validated result -> consumed
│    └─> provider/timeout/rate-limit/invalid-output failure -> released
└─> pre-provider reject/config/cost guard -> released
```

`provider_started` is represented by timestamp/metadata while the attempt remains reserved; it is not a separate credit state.

- Reserve before provider invocation.
- Mark provider started immediately before the external provider call.
- Consume in an idempotent transaction only after Stage 1 result validation succeeds and before returning success.
- Release in an idempotent transaction on all defined non-valid-result paths.
- `consumed` is terminal for automatic processing.
- Provider invocation is never automatically retried.
- Database finalization may use a bounded retry because the operation itself is idempotent; it must never cause a second provider invocation.

## PAUC-R21 — Stale reservation recovery

Reservation TTL is 15 minutes in v0, safely beyond the Stage 1 45 second provider timeout.

On access/reserve maintenance, a reservation older than TTL is reclaimed atomically:

- if provider was never marked started → release with `stale_before_provider`; user unit not consumed;
- if provider was marked started but no terminal result was durably recorded → release user credit with `unknown_after_provider_start`; never auto-retry provider; record operator cost status as unknown/bounded incident metadata.

This prioritizes user-credit safety while retaining operator cost visibility. It must not leave a user permanently blocked by a crashed request.

## PAUC-R22 — Accounting failure after provider result

If the provider returns a valid result but the server cannot durably transition the reservation to `consumed`, the result is **not** returned as a successful paid review. Return `accounting_unavailable`; do not invoke the provider again. The reservation is later reconciled/released according to PAUC-R21 unless a bounded idempotent finalization retry succeeds.

---

# 12. Provider request-cost guard and provider boundary

## PAUC-R23 — Existing Stage 1 limits preserved

Preserve at least:

- request body maximum: 512 KiB;
- provider timeout: 45 seconds;
- provider automatic retries: 0;
- Production edge/WAF contract: at least as restrictive as 5 requests / 60 seconds / client IP for `POST /api/architecture-review`;
- `Cache-Control: no-store` on sensitive AI responses.

## PAUC-R24 — Pre-provider cost guard

After Stage 1 evidence validation and quota reservation, build the **exact minimized/redacted provider envelope** already defined by the Stage 1 packet. Before external invocation, enforce all configured bounds:

- `ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES`
- `ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS`
- `ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD`
- model-matched input/output price profile used only for operator cost estimation/guarding.

All are server-only configuration. When paid review is enabled, missing/invalid guard configuration fails closed.

The cost upper bound must never knowingly under-estimate token usage. v0 may use UTF-8 provider-envelope byte length as a conservative upper bound on input token count unless a tested model-compatible tokenizer provides an equally safe or tighter upper bound. Output tokens are hard-capped in the provider request.

Worst-case preflight estimate uses integer arithmetic from the input upper bound + configured output-token maximum + model-matched cost profile. If either the input bound or worst-case cost ceiling is exceeded:

- no provider call;
- release reservation;
- return `request_cost_limit_exceeded`;
- do not silently truncate workflow/Evidence/provider envelope.

The configured model ID and cost-profile model ID must match. A material model/provider change requires a corresponding reviewed cost profile and Stage 1 evaluator change governance before paid enablement.

## PAUC-R25 — Post-call operator cost metadata

Normalize provider usage metadata when available (input/output/total tokens) and store only bounded numeric/version metadata in the usage attempt. Compute an operational cost estimate using the versioned cost profile. If provider usage metadata is unavailable, store cost estimate status `unknown` rather than fabricating precision.

User quota consumption remains exactly one successful valid review regardless of token count; provider cost is not exposed as user metered billing in v0.

## PAUC-R26 — Provider payload boundary

Paid/auth/billing/quota metadata is never added to the AI provider prompt/envelope. The provider payload remains exactly the Stage 1 minimized workflow-derived semantic/evidence subset and aliases. Secrets, provider credentials, Stripe IDs, Supabase IDs, email, quota data, payment state, analytics identity, tool parameter values, and workflow presentation state are excluded.

---

# 13. API contract additions

All new responses carrying paid/auth state use `Cache-Control: no-store`.

## 13.1 `GET /api/billing/architecture-review/offer`

Public metadata-only offer endpoint. Returns only when configuration is valid enough to display an offer:

```ts
{
  version: '0.1.0',
  planKey: 'architecture_review_individual_monthly_v0',
  displayName: 'Architecture Review',
  enabled: boolean,
  price: enabled ? {
    currency: string,
    unitAmount: number,
    interval: 'month'
  } : null,
  includedReviews: enabled ? number : null
}
```

The amount/currency are read from the configured Stripe Price; the server does not maintain a second hard-coded price. The quota comes from validated server config.

## 13.2 `GET /api/billing/architecture-review/access`

Requires authenticated user. Returns bounded state only:

```ts
{
  version: '0.1.0',
  state:
    | 'no_entitlement'
    | 'active'
    | 'active_canceling'
    | 'quota_exhausted'
    | 'billing_blocked'
    | 'sync_degraded'
    | 'review_disabled',
  quota: null | {
    limit: number,
    consumed: number,
    reserved: number,
    remaining: number,
    periodEnd: string
  },
  cancelAtPeriodEnd: boolean
}
```

No Stripe customer/subscription IDs, email, payment details, provider-cost data, or workflow data are returned.

## 13.3 `POST /api/billing/architecture-review/checkout`

Requires authenticated user + `Idempotency-Key`. No client-supplied price/quota/user ID. Returns Stripe-hosted Checkout URL or a bounded error.

## 13.4 `POST /api/billing/portal`

Requires authenticated user and mapped Stripe customer. Returns Stripe-hosted Customer Portal URL.

## 13.5 `POST /api/billing/architecture-review/refresh`

Requires authenticated user. Explicit recovery action only. It may query Stripe and reconcile the current Architecture Review subscription. Rate-limit it separately so it cannot become a Stripe-amplification endpoint. It is not part of the normal review hot path.

## 13.6 `POST /api/architecture-review`

The Stage 1 JSON body and successful result shape remain unchanged. Add server requirements:

- valid bearer authentication;
- valid `Idempotency-Key` UUID;
- paid entitlement/quota/request-cost guard described above.

Add bounded access/accounting error codes while preserving Stage 1 codes:

- `authentication_required` → 401
- `paid_entitlement_required` → 403
- `billing_inactive` → 403
- `entitlement_unavailable` → 503
- `quota_exhausted` → 429
- `review_in_progress` → 409
- `review_already_completed` → 409
- `review_attempt_closed` → 409
- `idempotency_key_required` / `invalid_idempotency_key` → 400
- `request_cost_limit_exceeded` → 422
- `accounting_unavailable` → 503
- `review_disabled` → 503

Existing Stage 1 `invalid_request`, `unsupported_contract_version`, `invalid_evidence`, `input_too_large`, `review_unavailable`, `rate_limited`, `provider_timeout`, `provider_error`, and `invalid_reviewer_output` remain semantically intact.

Provider/access errors must not reveal whether another user/customer/subscription exists.

---

# 14. UX / information architecture

The paid access UX belongs inside the Architecture Review surface; do not turn the whole editor into an account/billing application.

## 14.1 Signed out

Architecture Review shows:

- title: `AI Architecture Review`;
- clear statement that deterministic Preflight remains free;
- email field + `Email me a sign-in link`;
- privacy/provider disclosure link;
- no checkout until identity is verified.

Submitting email has loading/success/error states. Do not reveal whether an email already has an account.

## 14.2 Signed in, no entitlement

Show the offer from the server offer endpoint:

- `Architecture Review` monthly price formatted from Stripe currency/amount;
- included review count and `per billing period` wording;
- no `unlimited` claim;
- value-first summary: evidence-grounded architecture review over the current workflow;
- CTA `Subscribe and unlock Architecture Review`;
- Terms, Privacy, support links;
- explicit provider-processing disclosure;
- deterministic Preflight/free export remain usable behind/alongside the paywall.

Do not call this commercially validated, `Pro`, enterprise-ready, or guaranteed to save a fixed amount of money/time.

## 14.3 Active / active-canceling

Before a review:

- show `remaining / limit` as supporting usage information, not the primary value headline;
- show human-readable billing-period reset/end date;
- `active_canceling` states that access remains until the shown period end and provides `Manage billing`;
- review CTA is enabled only after current access state is loaded and server says available.

Client disabling is UX only; server enforcement remains authoritative.

## 14.4 Quota exhausted

Show:

- `You’ve used the included Architecture Reviews for this billing period.`
- reset/end date;
- `Manage billing` if useful;
- no overage/top-up/upgrade CTA, because those products are not selected;
- deterministic Preflight remains available.

## 14.5 Billing blocked / degraded sync

`billing_blocked`: explain that Architecture Review is paused because billing needs attention; offer `Manage billing` and `Refresh billing status`.

`sync_degraded`: say access cannot be verified right now; provider review is temporarily unavailable; offer bounded refresh/retry. Never say the subscription is definitely canceled when the state is only uncertain.

## 14.6 Provider/accounting failures

For provider timeout/error/rate limit/invalid output, state that the review was not completed and the included review allowance was not used.

For `request_cost_limit_exceeded`, state that this workflow/request exceeds the current paid-review safety limit, no provider review ran, and allowance was not used. Do not silently evaluate a truncated subset.

For `accounting_unavailable`, do not show the generated review result. State that the review could not be completed safely and allowance will be reconciled/released; explicit retry is a new user action after state refresh.

## 14.7 Checkout synchronization

After returning from Stripe, display `Confirming your subscription…` while polling the local access endpoint for a short bounded UX window. If still unavailable, stop polling and show `Refresh billing status`; do not grant access from the URL query alone.

---

# 15. Public messaging consistency

The current Production badge `100% Free Tool` is incompatible with a paid AI feature.

This packet replaces it with neutral localized free-core messaging before public paid enablement:

- English badge: `Free Core`
- Japanese badge: `無料コア機能`

Where paid Architecture Review is described, use the factual boundary:

- EN: `Deterministic workflow design and Preflight remain free. AI Architecture Review is a paid, usage-limited feature.`
- JA: `決定論的なワークフロー設計とPreflightは無料のままです。AI Architecture Reviewは利用上限のある有料機能です。`

`Free Templates` may remain because templates covered by the existing free contract are still free. Donation/support messaging may remain but must not imply that every product capability is free.

---

# 16. Analytics, logging, privacy, and provider disclosure

## PAUC-R27 — Existing analytics preservation

Do not remove/rename existing events. The Stage 1 branch events `architecture_review_requested`, `architecture_review_completed`, and `architecture_review_failed` remain the review-attempt analytics contract. Add bounded property `access_mode = paid_subscription_v0` to those three; do not create duplicate `paid_review_succeeded/failed` events for the same action.

Add only these commercial-funnel client events:

- `paid_review_offer_shown` — `offer_version`, `access_state`
- `paid_review_checkout_started` — `offer_version`
- `paid_review_quota_exhausted` — `offer_version`
- `paid_review_subscription_management_opened` — `offer_version`

All must be added to the existing explicit PostHog event/property allowlist.

Never send to PostHog:

- Supabase user ID or email;
- Stripe customer/subscription/session/price IDs;
- exact payment method/invoice data;
- workflow/Evidence/provider payload/prompt/result/findings/recommendations;
- node IDs/text, imported source, tool parameter values;
- quota request IDs;
- provider credentials or secrets.

The server billing/usage database, not PostHog, is authoritative for billing/quota/cost reconciliation. M0 analysis may use privacy-safe aggregates derived from it.

## PAUC-R28 — Logs

Application/runtime logs contain only bounded operational identifiers/categories: request ID where safe, route, state transition category, webhook event ID/type, provider/model/reviewer versions, bounded token/cost metadata, and sanitized error category. No email, workflow/Evidence text, prompts, Stripe webhook bodies, provider output, or secrets.

## PAUC-R29 — Privacy/provider disclosure

The paid offer must disclose that the minimum necessary workflow-derived representation is sent to the configured AI provider for Architecture Review and that secrets/tool parameter values are excluded. Public Privacy material must identify/category the provider and billing processor as applicable before paid launch.

---

# 17. Security, abuse, runaway-cost, and kill-switch controls

## PAUC-R30 — Secrets

Server-only:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` / provider credential
- cost-profile and guard configuration that is not intentionally public

Never serialize them to client bundles, error payloads, analytics, docs examples with real values, or logs.

Public Supabase anon/client token remains only within its intended Supabase public-client boundary and never grants direct access to paid tables.

## PAUC-R31 — Defense in depth

Quota is necessary but not sufficient. Preserve/add:

- Stage 1 request body cap;
- Stage 1 5/60s/IP Production edge/WAF requirement or stricter;
- one in-flight review/user;
- hard user quota;
- no automatic provider retry;
- provider timeout;
- pre-provider input/output/worst-case cost guard;
- provider account budget/alerts where supported;
- application kill switch;
- privacy-safe usage/cost monitoring.

## PAUC-R32 — Application kill switch

`ARCHITECTURE_REVIEW_PAID_ENABLED` defaults/fails to `false`. Enabling paid review requires all mandatory billing/quota/cost/provider configuration to validate.

When false/invalid:

- no paid provider invocation;
- checkout may be disabled if the offer is not launch-ready;
- Architecture Review shows bounded unavailable state;
- deterministic editor/Preflight/import/export/code export continue to work.

Provider-account budget controls and WAF are operator/platform controls and remain separate from the app quota. A provider budget alert may trigger operators to disable the app kill switch, but quota code does not pretend to be the provider budget system.

---

# 18. Commercial enablement gate: price/quota, hosting, operations

This packet is implementation-ready without guessing commercial values, but **public paid enablement is conditional**.

## Known / fixed for implementation

- one individual recurring monthly plan;
- paid provider-backed review only;
- hard server quota;
- no unlimited/BYOK/trial/annual/overage/Team/Enterprise;
- no Production default price/quota;
- Stripe Price is the price/currency source;
- quota is server config snapshotted per billing period;
- fail closed when required commercial/cost configuration is absent.

## Evidence-dependent launch inputs

Before `ARCHITECTURE_REVIEW_PAID_ENABLED=true` on public Production, `01`/release ownership must explicitly supply/approve:

1. active monthly Stripe Price ID, including amount/currency;
2. `ARCHITECTURE_REVIEW_INCLUDED_REVIEWS`;
3. provider input/output/cost-guard configuration derived from current evaluator benchmark/cost evidence;
4. working Stripe Customer Portal configuration;
5. Terms URL, Privacy URL, Support/contact URL;
6. approved refund-policy/support path in public commercial material (no in-app automatic refund workflow is required here);
7. tax/VAT/consumption-tax approach configured/approved for the launch market(s);
8. commercial-use-eligible hosting/account plan;
9. Production Supabase Auth email delivery/redirect configuration;
10. provider disclosure and billing-processor disclosure as required.

C01 must not invent any of these values. Missing inputs leave the feature disabled and are a `COMMERCIAL_BLOCKER` for public paid launch, not a reason to widen implementation scope.

## Safe initial configuration

The safe initial runtime state is paid review **disabled**. Test/preview environments use explicit Stripe test Price/quota/cost values. Public Production is enabled only after the above inputs and W01 release checks are satisfied.

## M0 re-evaluation

Price/quota are provisional until M0 has sufficient real paid evidence. Re-evaluate when enough evidence exists for:

- paid conversion/value/WTP;
- repeat review/subscription continuation;
- quota utilization/exhaustion;
- successful and failed provider cost distribution including high-percentile/high-usage cases;
- payment/infra variable cost and contribution scenarios;
- cancellation/refund/support signals;
- workflow-size/provider-cost correlation where privacy-safe;
- any material model/provider/prompt/rubric change.

Do not use average provider cost alone and do not treat Paid Access Production Verified as M0 success.

---

# 19. Migration and backward compatibility

## PAUC-R33 — Additive migration

- New database objects are additive; existing `templates`/`purchases` records are untouched.
- Existing `/api/checkout` one-time template flow remains `mode=payment` and retains current success/cancel behavior unless a mechanical metadata discriminator is added solely to make webhook routing explicit.
- Existing template purchase webhook behavior remains accepted and tested.
- No existing Graph/JSON/Evidence/result schema rewrite.
- Stage 1 API body/success result remains compatible; paid access adds authentication/idempotency/access error requirements before provider use.

## PAUC-R34 — Rollback/degraded direction

If paid controls or billing sync fail after deployment:

1. set `ARCHITECTURE_REVIEW_PAID_ENABLED=false`;
2. stop new paid provider reviews/checkouts as applicable;
3. keep subscription/billing records intact for recovery/support;
4. keep deterministic free features operational;
5. do not destructively drop paid tables as an emergency rollback;
6. reconcile Stripe/Supabase state before re-enable.

A code rollback that changes behavior after QA invalidates the prior QA approval and follows the canonical lifecycle.

---

# 20. Accessibility and responsive requirements

- All sign-in/subscribe/manage/review/retry controls are keyboard operable with visible focus.
- Interactive targets preserve the existing minimum usable touch-target direction (at least 44 CSS px where the current UI contract applies).
- Status is never communicated by color alone.
- Loading, checkout-sync, quota-exhausted, billing-blocked, sync-degraded, provider failure, and accounting failure have readable text and appropriate `aria-live` announcements without repeatedly spamming screen readers.
- Sign-in email has associated label, autocomplete/email semantics, and errors linked to the field.
- Focus moves to the resulting status/error after modal/panel state transitions where needed; closing/returning restores a sensible trigger focus.
- Paid-state content works at current mobile/tablet/desktop breakpoints without horizontal clipping or hiding the deterministic Preflight escape path.
- Long localized price/date/error strings wrap safely in English and Japanese.

---

# 21. Acceptance Criteria

## Access / authority

**AC-01** — An unauthenticated `POST /api/architecture-review` never invokes the provider and returns `authentication_required` when paid review is enabled.  
**AC-02** — A signed-in user without eligible entitlement cannot invoke the provider; browser/UI manipulation cannot bypass server entitlement.  
**AC-03** — `active` and `active_canceling` within the confirmed Stripe period are the only billing states eligible to proceed; all other/uncertain states fail closed.  
**AC-04** — Stripe is not called on every normal Architecture Review request; runtime reads the server entitlement projection.

## Quota / idempotency

**AC-05** — Atomic reservation prevents `consumed + reserved` from exceeding the period quota under concurrent requests.  
**AC-06** — At most one in-flight reserved review exists per user.  
**AC-07** — Same authenticated user + same `Idempotency-Key` never invokes provider twice or consumes two units.  
**AC-08** — A valid post-validated review consumes exactly one unit before success is returned.  
**AC-09** — Pre-provider rejection, provider timeout/error/rate-limit/invalid output consumes zero user units and releases reservation.  
**AC-10** — Stale reservation recovery follows PAUC-R21 and does not permanently strand quota.  
**AC-11** — Quota resets only through a newly confirmed Stripe billing period; no client/calendar reset and no unconfirmed renewal access.

## Cost/security/provider

**AC-12** — Paid review cannot be enabled with missing/invalid provider, quota, Stripe Price, or request-cost guard configuration.  
**AC-13** — Oversize/high-worst-case-cost request is rejected before provider without silent truncation and without consuming quota.  
**AC-14** — Provider request has explicit output-token cap, 45s timeout, zero automatic retries, and preserved 512 KiB outer request cap.  
**AC-15** — Provider payload remains the Stage 1 minimized/redacted envelope; no auth/billing/quota/secret metadata is added.  
**AC-16** — No raw workflow/Evidence/prompt/provider response/result/email/payment data appears in paid-control DB ledger, PostHog, or application logs.  
**AC-17** — Production edge/WAF verifies at least the Stage 1 5 requests/60 seconds/client-IP contract plus app one-in-flight/user and quota controls.

## Billing lifecycle

**AC-18** — Subscription Checkout is separate from template one-time checkout; both paths and webhook handling pass regression tests.  
**AC-19** — Repeated/out-of-order Stripe lifecycle events reconcile idempotently without granting stale entitlement or duplicating quota periods.  
**AC-20** — `past_due`/payment failure blocks provider access after reconciliation; payment recovery requires reconciled active state.  
**AC-21** — Cancel-at-period-end user retains access only through the shown current period end; no new period is inferred.  
**AC-22** — Known webhook/reconciliation uncertainty produces `sync_degraded`, not optimistic access.

## UX/free core/analytics

**AC-23** — Deterministic Preflight, Templates, JSON Import/Export, CrewAI export, and editor behavior remain available when signed out, quota exhausted, billing failed, Stripe/Supabase billing tables unavailable, provider unavailable, or paid kill switch is off.  
**AC-24** — Paid UX covers signed-out, offer, checkout syncing, active, active-canceling, quota exhausted, billing blocked, sync degraded, disabled, running, and defined failure states in EN/JA with keyboard/focus/responsive behavior.  
**AC-25** — Public `100% Free Tool` claim is removed/replaced with `Free Core` / `無料コア機能`; paid review copy truthfully preserves the free deterministic boundary.  
**AC-26** — Existing analytics events retain meaning; additive paid events/properties pass the explicit allowlist/privacy tests.  
**AC-27** — Existing Architecture Review successful result contract and AI authority remain unchanged; no semantic mutation exists.

## Commercial/release

**AC-28** — Public paid enablement is impossible by configuration until required Price/quota/cost/portal/legal-support/provider/hosting inputs are supplied.  
**AC-29** — Production paid launch occurs only on a commercial-use-eligible hosting plan/account; current Hobby state is not accepted.  
**AC-30** — Production verification demonstrates the live Stripe subscription → entitlement → quota reservation → valid review consume path and at least one non-consumption failure path using a controlled QA account, while preserving the free core.  
**AC-31** — Paid Access `Production Verified` documentation explicitly states that M0/commercial validation remains pending until sufficient paid evidence exists.

---

# 22. Test Matrix

| Area | Required test | Minimum cases |
|---|---|---|
| Auth helper | unit/route | missing/malformed/expired token; valid Supabase user; body user-id ignored |
| Entitlement mapping | unit | active; canceling; period expired; past_due; unpaid; incomplete; paused; canceled; trialing/misconfig; degraded |
| Stripe checkout | route/mock + test mode | recurring monthly configured Price; no entitlement; existing active user; idempotent retry; invalid config |
| Stripe webhook | unit/integration | template payment regression; subscription checkout; created/updated/deleted; invoice paid/failed; duplicate event; out-of-order reconciliation; Stripe fetch failure |
| Access endpoint | route | every server access state; no sensitive IDs returned |
| Quota reserve RPC | DB integration | first reserve; exact limit; exhausted; two concurrent reserves; one-in-flight constraint; period boundary |
| Idempotency | DB/route integration | reserved replay; consumed replay; released replay; different user same UUID cannot cross-authorize |
| Reservation recovery | DB integration | stale before provider; stale after provider-start; terminal attempts not changed |
| Consume/release | DB integration | exactly-once consume; double finalize; provider errors release; DB transient finalize retry |
| Cost guard | unit | input-byte bound; output token bound; worst-case cost bound; model/cost-profile mismatch; integer overflow/invalid env; no truncation |
| Provider adapter | unit/integration | output token cap passed; usage metadata normalized; no provider retry; existing Stage 1 validation preserved |
| Architecture Review route | route | 401/403/409/422/429/503; no provider on blocked paths; success consumes exactly one |
| Free-core isolation | regression | editor/templates/import/export/Preflight/code export work signed-out, quota-exhausted, billing/provider/DB paid failure, kill-switch off |
| Analytics | unit | old events preserved; new events/property allowlists; forbidden payload fields stripped; no PII/content |
| Logging | focused review/test | no raw request/Evidence/provider/billing secret/email output |
| Accessibility | component/manual | labels, keyboard, focus return, aria-live, non-color status, 44px target direction |
| Responsive/i18n | component/manual | mobile/tablet/desktop; long EN/JA strings; price/date formatting; no clipped deterministic escape path |
| Messaging | UI | no `100% Free Tool`; free deterministic + paid AI boundary present |
| Commercial config | unit/release | paid enabled false by default; missing any mandatory config fails closed |
| Production abuse | W01 live | 5/60s/IP or stricter verified; quota/user concurrency prevents provider amplification |

Implementation Complete additionally requires:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

plus the active Stage 1 packet's evaluator contract/benchmark requirements for any merged Stage 1 evaluator code. Paid-control work must not waive/redefine those evaluation checks.

---

# 23. Independent QA — W01 Pass A requirements

W01 must independently verify at the exact candidate revision:

1. all ACs that are testable pre-release;
2. additive DB migration, RLS/no-browser-policy boundary, transactional reserve/finalize semantics;
3. auth cannot be spoofed by client user ID/email;
4. Stripe test-mode subscription lifecycle including duplicate/reordered webhooks and payment failure/recovery;
5. existing template purchase flow regression;
6. quota concurrency/idempotency/stale-reservation failure injection;
7. no provider call on unauthenticated, ineligible, exhausted, concurrent, cost-guard, disabled, or degraded paths;
8. valid review consumes once; provider/validation failures release;
9. provider-cost metadata is bounded and contains no workflow/result text;
10. Stage 1 payload/result/evaluator-authority boundary is unchanged;
11. free-core failure isolation;
12. PostHog/logging privacy allowlists;
13. accessibility/responsive/i18n states;
14. kill-switch behavior;
15. exact candidate passes `docs:check`, tests, typecheck, build, and applicable Stage 1 evaluation checks.

QA verdict uses PASS / PASS WITH NOTES / FAIL-BLOCKED with Blocker / Non-blocker / Known Note classification. Only W01 marks QA Complete.

Any code/behavior change after QA Complete invalidates the approval and requires Pass A again.

---

# 24. Production Verification — W01 Pass B requirements

Public paid Production verification must confirm all of the following; otherwise do not mark Production Verified:

## Repository/deployment identity

- latest GitHub `main`;
- released revision equals the QA-approved revision/change set;
- Vercel deployment `READY`;
- `target=production`;
- correct Production domain/alias;
- `GitHub main SHA = Vercel Production githubCommitSha`.

## Commercial hosting/operations

- hosting/account is currently commercial-use eligible under then-current terms; current Hobby plan is insufficient as of packet specification;
- Production paid feature config has explicit approved Price/quota/cost-guard values;
- Stripe Price is active/monthly and Customer Portal configuration exposes only selected v0 management capabilities;
- Terms/Privacy/Support URLs are reachable and paid/provider/billing disclosures are present;
- tax/refund/support operational path has been approved outside C01 and is not contradicted by UI;
- Production Supabase Auth email magic-link works for the QA account.

## Live paid flow

Using a controlled QA account and the real Production billing path (or an equivalent Stripe-approved live-mode verification mechanism that does not bypass entitlement authority):

1. signed-out review is blocked with no provider invocation;
2. sign-in works;
3. checkout does not grant access from return URL alone;
4. live subscription reconciles to active entitlement;
5. access endpoint shows quota/current period;
6. one valid Architecture Review succeeds and atomically consumes one unit;
7. a forced/controlled provider or validation failure path consumes zero unit;
8. repeated same idempotency key does not consume/invoke twice;
9. billing portal is reachable and cancel-at-period-end state is reflected correctly;
10. quota exhaustion test is performed with a controlled low test/QA quota configuration or equivalent non-destructive production-safe method without changing the public paid contract;
11. paid kill switch blocks provider while deterministic free core remains operational;
12. relevant Vercel/runtime errors/logs show no secret/content leakage;
13. actual Production no longer claims `100% Free Tool`.

If completing a real Production charge creates a financial transaction, record the controlled QA handling according to the approved support/refund/accounting procedure; do not bypass the live entitlement system by directly editing quota/entitlement merely to claim Production Verified.

Production Verified does **not** close M0, R-018, or R-019 and does not promote AI authority.

---

# 25. Requirement traceability

| Requirement | Upstream authority / risk | AC / verification |
|---|---|---|
| Paid provider-backed review; AgentGraph-owned credential; no unlimited/BYOK | ADR-0006, MONETIZATION_ARCHITECTURE | AC-01..17, AC-28 |
| Billing ≠ entitlement ≠ quota ≠ cost ledger | ADR-0006, R-020 | AC-03..11, AC-19..22 |
| Stripe authoritative billing + server entitlement read model | ADR-0006 | AC-03, AC-04, AC-19..22 |
| Atomic hard quota/idempotency/failure-safe accounting | ADR-0006, R-008, R-020 | AC-05..11 |
| Provider request/cost guard + budget defense | ADR-0006, SECURITY_RELIABILITY_BASELINE, R-008, R-019 | AC-12..17 |
| Minimal provider payload / no content leakage | Stage 1 packet, DATA_AND_AI_GOVERNANCE, R-009 | AC-15, AC-16 |
| Free deterministic core isolated from paid/provider failure | Product Master, Architecture, Development Rules, ADR-0006 | AC-23 |
| No AI authority/mutation expansion | Product Master, EXECUTION_GATES, ADR-0007 | AC-27 |
| Commercial values provisional; M0 separate | ADR-0007, MONETIZATION_ARCHITECTURE, R-018/R-019 | AC-28, AC-31 |
| Commercial operations and truthful messaging | MONETIZATION_ARCHITECTURE, R-021 | AC-25, AC-28..31 |
| Commercial-use hosting prerequisite | ADR-0006, R-021 | AC-29 + W01 Pass B |
| Existing template billing backward compatibility | ADR-0006, repository reality | AC-18 |
| Analytics/privacy preservation | DEVELOPMENT_RULES, DATA_AND_AI_GOVERNANCE | AC-16, AC-26 |
| Accessibility/responsive states | DEVELOPMENT_RULES, ENGINEERING_EXECUTION_GOVERNANCE | AC-24 |
| Independent QA / exact Production evidence | CHAT_ROLE_REGISTRY, DEVELOPMENT_RULES | W01 Pass A/B |

---

# 26. Definition of Ready evaluation

The packet resolves the applicable Definition of Ready dimensions:

- **Product problem / dependency:** provider-funded Stage 1 public release requires paid identity/quota/cost control; selected upstream.
- **Smallest scope / Out of Scope:** one individual monthly paid Architecture Review only; no future tier/team/BYOK/mutation scope.
- **Architecture / authority:** Stripe billing, Supabase entitlement, quota DB, provider evaluator, operator cost controls are explicitly separated.
- **Identity / data / persistence:** exact identity source, tables, RLS boundary, retention/deletion/export direction, provider payload, logs/analytics defined.
- **Security / reliability:** fail-closed, idempotency, concurrency, timeout, no provider retry, WAF, cost guard, kill switch, degraded sync defined.
- **Migration / compatibility:** additive DB objects; existing template checkout/purchases and workflow contracts protected.
- **UX / errors / loading / degraded / accessibility / responsive:** explicit state matrix and copy boundaries defined.
- **Analytics regression:** existing events preserved; exact additive allowlist defined.
- **Acceptance Criteria / tests:** AC-01..31 and Test Matrix are implementation-testable.
- **Release / rollback / Production verification:** explicit W01 Pass A/B, commercial enablement prerequisites, rollback/disable direction defined.
- **Traceability:** compact source → requirement/AC mapping included.

The remaining Unknowns — public price/currency, included quota, cost-guard numeric thresholds, final legal/tax/support launch inputs, commercial hosting upgrade, and Production Auth configuration — are **not delegated to C01**. The implementation is fail-closed/configurable; these are explicit pre-enable release inputs owned by Product/commercial/release authority and independently verified by W01.

Therefore this packet satisfies Definition of Ready for implementation and is **Specified**.

---

# 27. Durable C01 handoff

C01 must start from latest `main`, re-read this packet and the coupled Stage 1 packet, then implement only this scope.

Required implementation order is dependency-safe, not a Product-priority change:

1. additive Supabase migration/types + atomic quota/accounting functions;
2. server auth helper + minimum Supabase Auth UX;
3. Stripe customer/subscription Checkout, webhook reconciliation, access/portal/refresh routes while preserving template purchase flow;
4. paid configuration parser + fail-closed kill switch;
5. integrate entitlement/reservation/cost guard/finalize around the existing Stage 1 provider route without changing evaluator semantics/result contract;
6. paid UI/messaging/access/quota/error/degraded states;
7. analytics allowlist additions and privacy/logging checks;
8. tests/failure injection/migration verification;
9. run `npm run docs:check`, `npm test`, `npm run typecheck`, `npm run build`, plus coupled Stage 1 evaluator checks;
10. hand exact candidate revision to W01 Pass A.

C01 may make mechanical implementation choices that preserve this contract, but must escalate rather than decide if implementation would require changing price/quota Product policy, AI authority, provider payload semantics, free-core boundaries, billing lifecycle semantics, retention/privacy scope, or public commercial launch requirements.
