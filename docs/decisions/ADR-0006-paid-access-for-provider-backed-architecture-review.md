# ADR-0006 — Paid access for provider-backed Architecture Review

Status: **Accepted**  
Date: **2026-08-26**

## Context

Evidence-Grounded AI Architecture Review v0 uses a server-side provider credential owned by AgentGraph Studio. Releasing that endpoint without entitlement and usage controls would expose the operator to unbounded provider cost. IP rate limiting reduces burst abuse but does not establish a user entitlement, per-user quota, or aggregate provider-cost ceiling.

The deterministic product foundation already provides useful free value through workflow design, Readiness, Execution Preview, Resource Analysis, Unified Preflight, JSON portability, and deterministic CrewAI export.

The current Production hosting account was verified as Vercel Hobby on 2026-08-26. Current Vercel Terms state that Hobby is for personal or non-commercial use. A paid commercial Production launch therefore requires a commercial-use-eligible hosting plan or a separately approved hosting change. This hosting eligibility must be re-verified at release time rather than treated as a permanent vendor assumption.

## Decision

### Initial commercial boundary

- Provider-backed Architecture Review will be available only through a paid AgentGraph Studio entitlement in its initial Production offering.
- AgentGraph Studio will own and pay for the provider credential; user-supplied API keys (BYOK) are not part of this initial offering.
- Paid access must have a server-enforced hard usage quota. Unlimited provider-backed review is not approved.
- The initial commercial product shape is one individual paid plan with recurring monthly billing and an included Architecture Review quota. Annual billing, free trials, overage billing, credit packs, Team pooled quotas, and Enterprise provider options are out of scope for the initial packet.
- The exact plan price and included review count are not fixed by this ADR. They must be selected before paid launch using measured evaluator cost and product-value evidence rather than guessed token economics.
- Free users retain the existing deterministic workflow builder, analysis, portability, and export capabilities. The paid boundary must not make deterministic Preflight depend on AI availability.

### Runtime entitlement architecture

- A signed-in user identity is required for paid Architecture Review entitlement and quota enforcement.
- Stripe is authoritative for commercial billing events and subscription lifecycle.
- Runtime Architecture Review requests must not synchronously call Stripe to decide entitlement on every review.
- Stripe webhook events must maintain a server-side entitlement read model suitable for low-latency review authorization.
- Supabase is the preferred current storage foundation for additive entitlement and usage-control state because the repository already contains server-side Supabase and Stripe integration. The implementation packet may refine exact tables/functions without changing this responsibility boundary.
- Subscription state and Architecture Review quota state are separate concerns. Billing state determines entitlement; quota state determines whether an entitled user may consume another provider-backed review.

### Quota reservation and idempotency

- Quota enforcement must be server-side and atomic.
- A review request must reserve one usage unit before provider invocation so concurrent requests cannot exceed the user's hard quota.
- Every user-visible review attempt must have an idempotency identity. Replaying the same accepted request must not consume multiple review units.
- A valid Architecture Review result consumes the reserved unit.
- A failure before provider invocation releases the reservation and consumes no unit.
- Provider timeout, provider error, or invalid reviewer output must not silently charge the user a successful-review unit when no valid result is delivered. The packet must define release/recovery behavior explicitly and idempotently.
- Provider invocation may still incur operator cost even when the user-facing unit is released. Such attempts must remain visible in internal operational cost accounting without exposing workflow content.
- Quota exhaustion must fail closed before provider invocation.

### Usage and cost accounting

- Commercial usage accounting must be separate from raw workflow/evaluation persistence.
- The minimum operational ledger must be able to correlate an authenticated user, billing period, idempotent review request, reservation/consumption/release state, provider invocation outcome, reviewer/model version, bounded token/usage metrics available from the provider, bounded cost metadata or derived cost estimate, failure category, and timestamps.
- Billing/usage tables must not store raw workflow text, Evidence bodies, provider prompts, or Architecture Review result prose merely for accounting.
- User-visible quota accounting and internal provider-cost accounting are related but not identical. A failed attempt may have zero user credit consumption while still recording non-zero operator cost.
- Pricing and included quota must be reviewed against measured successful-review and failed-review cost distributions before launch and after material evaluator/provider/model changes.

### Per-request and aggregate cost controls

- A hard monthly user quota is necessary but not sufficient because a single large review may cost materially more than an ordinary review.
- The paid-access packet must define a pre-provider request-cost guard using bounded input size/token estimation and provider output limits.
- Requests above the supported full-review cost/size envelope must be rejected explicitly before provider invocation. Silent evidence truncation or lossy review is prohibited.
- Provider output must have an explicit bounded maximum appropriate to the Architecture Review result contract.
- Existing body-size, timeout, concurrency, no-automatic-retry, and WAF/rate-limit controls remain required.
- Provider account/project budget controls, operational alerts, and a server-side feature kill switch are defense in depth. None replaces entitlement or quota enforcement.
- A global commercial safety threshold must allow provider-backed review to be disabled without disabling deterministic Preflight, import/export, or code generation.

### Commercial hosting gate

- Paid Production launch is blocked while the serving environment is on a hosting plan whose current terms prohibit commercial use.
- Before Production Verified for the paid offering, W01 must verify the actual hosting plan and current commercial-use eligibility in addition to the normal GitHub-main/Vercel-Production SHA and smoke requirements.
- If Vercel remains the Production host, the current Hobby environment must be upgraded to an eligible paid plan before commercial launch unless Vercel's then-current terms have changed and are explicitly re-verified.

## Pricing calibration gate

The initial paid plan may be implemented with configuration-backed price/quota values, but public launch values require evidence.

Before paid launch, measure at minimum:

- successful-review provider cost distribution, including a practical upper percentile such as P95
- provider cost from failed/invalid/timeout attempts
- input/output usage by representative workflow sizes
- impact of the configured evaluator model, reasoning settings, and result limits
- expected included-review cost at the proposed quota
- payment/hosting/database fixed and variable costs material to the plan

The exact price and quota are then selected as a Product Architecture decision. A broad working hypothesis such as a low-double-digit monthly review quota may be tested, but it must not become a durable contract without the above evidence.

A material model/provider/prompt/rubric/representation change that changes cost or behavior triggers re-evaluation under `docs/DATA_AND_AI_GOVERNANCE.md`; entitlement must not be treated as permission to ignore evaluator cost drift.

## Rationale

Paid entitlement with a hard quota aligns recurring provider cost with recurring professional value while preserving a useful free deterministic product. It avoids the adoption and secret-handling burden of BYOK without accepting unlimited operator liability.

Separating Stripe billing authority from a local entitlement read model avoids adding a third-party billing round trip to each Architecture Review request. Atomic quota reservation plus idempotency bounds concurrent consumption. Separating user-visible credits from internal provider-cost accounting prevents users being charged for unusable results while preserving operator visibility into real cost.

Per-request cost guards are required because request count alone does not bound cost across differently sized workflows. Explicit rejection is preferable to silent truncation because AgentGraph's product contract prohibits silent lossy behavior.

## Consequences

- Evidence-Grounded AI Architecture Review v0 must not be released as an unrestricted public provider endpoint.
- A paid-access and usage-control packet becomes a release prerequisite for the provider-backed feature.
- The packet requires explicit auth, Stripe subscription/webhook, Supabase entitlement/quota state, atomic reservation/idempotency, cost accounting, request-cost guard, security, privacy, data lifecycle, analytics, degraded-mode, migration, hosting-plan, and Production verification review.
- Architecture Review availability may degrade independently. Deterministic Preflight, JSON portability, and deterministic CrewAI export must remain operational when paid entitlement, billing synchronization, quota storage, or the AI provider is unavailable.
- Live evaluator benchmarking may use a separately controlled release/evaluation credential, but benchmark access does not grant Production user entitlement.
- Future BYOK, free trials, annual billing, credit packs, usage-based overage, Team pooled quotas, or Enterprise private-provider options require separate decisions or packets.
- No change is authorized here to AI mutation authority, Stage 2/3 scope, collaboration, marketplace, or proprietary hosted runtime direction.

## Definition of Ready input for the paid-access packet

Before C01 implementation starts, 【02】 must make the following explicit enough that implementation does not make Product Architecture decisions:

1. authentication mechanism and account UX
2. Stripe product/price/subscription and webhook event lifecycle
3. entitlement states and stale/degraded billing-sync behavior
4. quota period, included count, reservation/consume/release state machine, and reset semantics
5. idempotency key ownership, replay rules, and concurrency behavior
6. exact database objects, indexes/constraints/RLS or server-only access rules, migrations, retention, deletion, and export implications
7. Architecture Review API authorization order and error contract
8. per-request input/output/cost guard and no-silent-truncation behavior
9. provider usage/cost ledger fields and privacy exclusions
10. WAF/rate limit, provider budget/alerting, kill switch, and abuse cases
11. UI states for signed-out, free, paid-active, quota exhausted, billing degraded, review unavailable, and subscription management
12. analytics allowlist that excludes workflow/Evidence/AI content
13. Stripe/Supabase/provider failure handling and user-credit consumption rules
14. migration/backward compatibility with existing template checkout/purchase behavior
15. Vercel commercial-plan migration/verification or approved hosting alternative
16. acceptance criteria, tests, Independent QA scope, and Production smoke evidence
17. pricing/quota configuration ownership and the evidence required to approve public launch values

## Alternatives considered

### Free operator-funded Architecture Review

Rejected for the initial Production offering because IP rate limiting alone cannot bound aggregate provider cost.

### BYOK as the primary offering

Rejected for the initial offering because it adds user setup friction and a separate credential security/lifecycle contract.

### Unlimited paid Architecture Review

Rejected because subscription revenue alone does not bound per-user provider cost.

### Per-request metered billing from day one

Rejected for the initial offering because it adds user-visible billing complexity and does not improve the core first paid value enough to justify the additional accounting, pricing, tax/support, and UX surface. A simple recurring plan with a hard included quota is the smallest sufficient commercial architecture.

### Synchronous Stripe lookup on every review

Rejected because billing-provider availability and latency should not sit directly in the hot path of every AI evaluation request when a webhook-maintained entitlement read model is sufficient.

## Migration / compatibility impact

- No change to `GraphDocumentV1`, JSON import/export, deterministic analysis, or generated CrewAI source.
- Existing Architecture Review domain/evidence contracts remain applicable.
- Existing template purchase code is not automatically converted into subscription entitlement logic. The paid-access packet must preserve existing behavior unless an explicit migration/change is specified.
- The paid-access packet must define additive entitlement/quota/usage storage and backward-compatible UI/API behavior.

## Related docs / packets

- `docs/specs/AGS-EGAI-AR-V0-P1.md`
- `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`

