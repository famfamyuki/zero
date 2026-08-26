# ADR-0006 — Paid access for provider-backed Architecture Review

Status: **Accepted**  
Date: **2026-08-26**

## Context

Evidence-Grounded AI Architecture Review v0 uses a server-side provider credential owned by AgentGraph Studio. Releasing that endpoint without entitlement and usage controls would expose the operator to unbounded provider cost. IP rate limiting reduces burst abuse but does not establish a user entitlement or monthly cost ceiling.

The deterministic product foundation already provides useful free value through workflow design, Readiness, Execution Preview, Resource Analysis, Unified Preflight, JSON portability, and deterministic CrewAI export.

## Decision

- Provider-backed Architecture Review will be available only through a paid AgentGraph Studio entitlement in its initial Production offering.
- AgentGraph Studio will own and pay for the provider credential; user-supplied API keys (BYOK) are not part of this initial offering.
- Paid access must have a server-enforced hard usage quota. Unlimited provider-backed review is not approved.
- Authentication, entitlement verification, quota accounting, concurrency/idempotency behavior, reset semantics, and failure-consumption rules must be specified in a dedicated implementation packet before Production release.
- Free users retain the existing deterministic workflow builder, analysis, portability, and export capabilities. The paid boundary must not make deterministic Preflight depend on AI availability.
- WAF/rate limiting, provider budget controls, and a feature kill switch are defense-in-depth controls; none replaces user entitlement and quota enforcement.
- The exact plan price, included review count, quota period, overage behavior, and subscription lifecycle semantics remain specification decisions. This ADR does not set those values.

## Rationale

Paid entitlement with a hard quota aligns recurring provider cost with recurring professional value while preserving a useful free deterministic product. It avoids the adoption and secret-handling burden of BYOK without accepting unlimited operator liability.

## Consequences

- Evidence-Grounded AI Architecture Review v0 must not be released as an unrestricted public provider endpoint.
- A paid-access and usage-control packet becomes a release prerequisite for the provider-backed feature.
- The packet requires explicit Stripe/Supabase/auth, security, privacy, data lifecycle, analytics, degraded-mode, and migration review.
- Live evaluator benchmarking may use a separately controlled release/evaluation credential, but benchmark access does not grant Production user entitlement.
- Future BYOK, free trials, credit packs, usage-based billing, team quotas, or enterprise private-provider options require separate decisions or packets.

## Alternatives considered

### Free operator-funded Architecture Review

Rejected for the initial Production offering because IP rate limiting alone cannot bound aggregate provider cost.

### BYOK as the primary offering

Rejected for the initial offering because it adds user setup friction and a separate credential security/lifecycle contract.

### Unlimited paid Architecture Review

Rejected because subscription revenue alone does not bound per-user provider cost.

## Migration / compatibility impact

- No change to `GraphDocumentV1`, JSON import/export, deterministic analysis, or generated CrewAI source.
- Existing Architecture Review domain/evidence contracts remain applicable.
- The paid-access packet must define additive entitlement/quota storage and backward-compatible UI/API behavior.

## Related docs / packets

- `docs/specs/AGS-EGAI-AR-V0-P1.md`
- `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`

