# ADR-0007 — Commercial validation before paid expansion

Status: **Accepted**  
Date: **2026-08-26**

## Context

`ADR-0006-paid-access-for-provider-backed-architecture-review.md` established the minimum safe commercial boundary for provider-backed Architecture Review: paid entitlement, hard server-enforced quota, atomic/idempotent usage accounting, per-request cost guards, provider budget controls, and a commercial-use-eligible hosting requirement.

Those controls solve an important operator-liability problem, but they do not establish that the initial paid individual offering delivers enough recurring professional value to support a durable subscription.

The first paid Architecture Review release may initially contain substantially less recurring-value surface than the long-term Pro direction. Project/Workspace, revision/evaluation history, Review Delta, Scenario/Acceptance suites, advanced Guided Improvement, and other repeated-use capabilities remain later candidates and must not be pulled into the current Sprint automatically.

Pricing also has two independent evidence requirements:

```text
Cost sustainability
+
User value / willingness to pay
```

Provider token economics alone cannot determine a good price. Conversely, strong user demand does not authorize unsafe quotas, unbounded provider cost, or stronger AI authority.

## Decision

### 1. Establish a Commercial Validation Gate

Adopt **Commercial Validation Gate M0** for the initial individual paid model.

M0 is defined in `docs/roadmap/MONETIZATION_ARCHITECTURE.md`.

M0 asks whether the current paid individual offering demonstrates sufficient professional value and acceptable unit economics to treat the commercial model as validated for its current scope or to expand it.

M0 is separate from evaluator authority gates:

- Gate A/B/C continue to govern evaluation trust, recommendation authority, and safe transformation authority.
- M0 governs commercial validation and paid-expansion decisions.
- Commercial evidence must never override evaluator safety or grant mutation/security-sensitive authority.

### 2. Treat the first paid release as a validation phase

Implementing subscription billing and quota enforcement does not itself validate the recurring business model.

After the Paid Access & Usage Control packet is Production Verified and public paid launch requirements are satisfied, the initial paid offering must be treated as a commercial-validation phase until M0 has enough real evidence to reach a scoped conclusion.

An empty or tiny sample must remain `Unknown`/insufficient evidence rather than being converted into a positive or negative business conclusion.

### 3. Preserve Stage sequencing and packet discipline

M0 does not create a new mandatory implementation Stage between Stage 1 and Gate A.

After Stage 1 Production evidence, technical and commercial evidence may progress in parallel:

```text
Stage 1 Production Evidence
├→ Gate A — Evaluation Trust & Scale
└→ M0 — Commercial Validation when sufficient paid evidence exists
```

Evaluator hardening justified by Gate A must not be blocked while waiting for commercial sample size.

Stage 1.5 selection may use M0 evidence when repeat use, import friction, revision identity, history, Review/Locate, or context is shown to be a concrete commercial dependency. M0 does not automatically select those capabilities.

### 4. Define the paid value contract

The initial paid product is not positioned primarily as model calls, tokens, or generic chatbot access.

The paid individual value is:

> **Evidence-grounded, reproducible architecture evaluation for workflows that matter.**

Quota remains a cost/safety mechanism. It is not the primary product value language.

### 5. Require dual-evidence pricing

Public price and included quota must be selected using both:

- measured cost/unit-economics evidence; and
- user-value / willingness-to-pay evidence appropriate to the launch stage.

Acceptable signals may include paid funnel behavior, first paid review activation, repeat review, quota utilization, subscription continuation/cancellation, support/refund reasons, direct price/value feedback, and evidence that users meaningfully inspect the structured review.

Do not infer willingness to pay from page views, free usage, or provider cost alone.

### 6. Require commercial-operations readiness before public paid launch

The paid-access packet or an explicitly coupled launch packet must define and make verifiable the applicable minimum paid-service lifecycle behavior, including:

- plan/price/currency/quota period
- renewal/cancellation/end-of-period behavior
- quota reset
- failed-review credit behavior
- payment failure / degraded billing sync
- refund path/policy
- subscription management
- receipt/invoice behavior available through the billing stack
- tax/VAT/consumption-tax approach appropriate to launch scope
- Terms/privacy/provider disclosure as applicable
- billing/support contact path
- commercial-use-eligible hosting

This requirement does not authorize speculative enterprise compliance scope.

## Rationale

AgentGraph's core commercial risk has two sides:

1. users may create unbounded provider cost; and
2. users may not receive enough recurring value to keep paying.

`ADR-0006` primarily addresses the first. M0 makes the second an explicit evidence problem instead of an assumption.

Separating M0 from Gate A/B/C preserves the project's authority model. A highly converting but inaccurate evaluator is not acceptable. A highly accurate evaluator with poor repeat value may need a different product foundation rather than stronger AI authority.

The decision also prevents common roadmap errors such as building Team features to chase ARPU before individual value is proven, adding all history/workspace capabilities because they appear monetizable, or making AI free merely because provider unit cost falls.

## Consequences

- `docs/roadmap/MONETIZATION_ARCHITECTURE.md` becomes the authoritative cross-stage commercial architecture.
- Program Board must track M0 as a decision gate and preserve the Paid Access & Usage Control packet as the immediate release prerequisite.
- Risk Register must track paid-value, unit-economics, billing-lifecycle, and commercial-operations risks separately from provider-abuse risk.
- Current State must distinguish “paid access designed/implemented” from “commercial model validated.”
- A successful paid launch does not automatically justify Team, Enterprise, overages, annual billing, free trials, credit packs, BYOK, or other packaging expansion.
- Stage 1.5 repeat-value foundations may gain priority only when evaluator/product/commercial evidence identifies a concrete dependency.
- Price/quota changes after material model/provider/prompt/rubric changes may require re-baselining even if subscription entitlement itself is unchanged.

## Alternatives considered

### Treat paid entitlement as sufficient commercialization proof

Rejected. Billing infrastructure proves collectability and access control, not recurring user value.

### Make M0 a hard blocker before Gate A

Rejected. Evaluator safety/quality work may be clearly necessary before enough paid traffic exists; commercial sample size must not block technical risk reduction.

### Build the full long-term Pro bundle before charging

Rejected. That would pull Stage 1.5/Stage 2 capabilities forward without evidence and materially enlarge scope before the first commercial value is tested.

### Use provider cost plus a markup as the pricing method

Rejected. It ignores user-perceived value and willingness to pay and risks both underpricing and overpricing.

### Make the provider-backed review free to maximize adoption

Rejected for the initial operator-funded model because cost safety and entitlement remain unresolved by traffic growth alone.

## Migration / compatibility impact

- No change to `GraphDocumentV1`, deterministic analysis, import/export, code generation, Evidence contracts, or Architecture Review result contracts.
- No automatic change to the current Stage 1 implementation packet.
- No automatic schema/event implementation is authorized by this ADR.
- Paid Access & Usage Control specification should trace to this ADR for pricing evidence, commercial operations, and M0 measurement readiness where applicable.

## Related docs / packets

- `docs/decisions/ADR-0006-paid-access-for-provider-backed-architecture-review.md`
- `docs/roadmap/MONETIZATION_ARCHITECTURE.md`
- `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/specs/AGS-EGAI-AR-V0-P1.md`
