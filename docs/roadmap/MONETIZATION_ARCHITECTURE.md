# AgentGraph Studio — Monetization Architecture

Status: **Authoritative cross-stage commercial architecture**  
Scope: Paid value contract, free/paid boundary, unit economics, pricing evidence, commercial validation, commercial-operations readiness, and monetization-driven roadmap evidence.  
This document refines `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md` and complements `docs/decisions/ADR-0006-paid-access-for-provider-backed-architecture-review.md`. It does **not** expand an active implementation packet automatically.

## 0. Source-of-truth and scope rule

For current implementation decisions use, in order:

1. latest GitHub `main` / repository reality
2. latest Vercel Production / actual Production behavior
3. active packet under `docs/specs/`
4. Product / Architecture / Development governance
5. Master Roadmap / Execution Gates
6. this monetization architecture for commercial-boundary and commercial-evidence decisions
7. Program Board / Risk Register / Current State

Commercial strategy must not be used to pull future Pro, Team, Enterprise, Workspace, History, Review Delta, collaboration, or marketplace capabilities into the current Sprint without explicit Product selection and specification.

---

# 1. Commercial product definition

AgentGraph Studio should not sell a generic provider call, token bundle, or opaque AI answer.

The paid individual value proposition is:

> **Evidence-grounded, reproducible architecture evaluation for workflows that matter.**

The paid value is created by the combination of:

```text
Canonical Workflow
+ Deterministic Preflight
+ Versioned Evidence
+ Evidence-grounded AI reasoning
+ Structured findings
+ Explicit Known / Inferred / Unknown
+ Traceable targets / limitations
```

A provider-backed Architecture Review may be the first monetized surface, but the durable business model should monetize repeated engineering trust rather than access to raw model inference.

Product rule:

```text
Provider cost control
≠ Paid value validation
```

A safe entitlement/quota system proves that cost is bounded. It does not prove that users receive enough recurring value to retain a subscription.

---

# 2. Free value contract

The free product must remain independently useful and must not become a nonfunctional demo merely to force conversion.

Current durable free direction includes, where implemented:

- visual/manual workflow design
- templates
- JSON portability/import/export
- deterministic Readiness
- deterministic Execution Preview
- deterministic Resource Analysis
- Unified Preflight
- deterministic CrewAI Python export
- supported deterministic/import/compatibility capabilities explicitly designated free

Invariant:

> Deterministic Preflight, portability, and deterministic export must not depend on paid AI availability, Stripe availability, entitlement storage, or the AI provider.

The free wedge exists to let users understand AgentGraph's engineering model and reach meaningful deterministic value before paying.

---

# 3. Initial paid product boundary

The initial commercial offering follows `ADR-0006`:

- one individual recurring monthly paid plan
- provider-backed Architecture Review is paid-entitlement only
- AgentGraph Studio owns the provider credential and provider cost
- BYOK is out of scope initially
- unlimited review is prohibited
- a hard server-enforced user quota is mandatory
- annual billing, free trials, usage overages, credit packs, Team pooled quotas, and Enterprise provider options are out of scope for the initial packet

The first paid plan is intentionally the **smallest sufficient commercial architecture**, not the final Pro product.

Initial paid launch must therefore be treated as a commercial-validation phase, not as evidence that Architecture Review alone is a durable recurring subscription.

---

# 4. Paid Value Contract

The initial paid experience must communicate and deliver value as an engineering review, not as an AI consumption counter.

The user should understand that a paid review provides:

- architecture interpretation grounded in AgentGraph Evidence
- structured strengths / prioritized findings / uncertainties
- traceability from findings to evidence and workflow targets where supported
- explicit limitations instead of unsupported certainty
- evaluator/version metadata sufficient for product reproducibility expectations
- failure isolation from the deterministic product

Do not position the paid feature primarily as:

- “N AI calls”
- “N prompts”
- “N tokens”
- generic chatbot access

Quota is a cost/safety contract. It is not the product's primary value language.

---

# 5. Commercial architecture

The initial paid request path should remain conceptually:

```text
Authenticated User
→ Subscription Entitlement
→ Quota State
→ Atomic Reservation
→ Request Cost Guard
→ Architecture Review Provider
→ Domain Validation
→ Valid User Result
→ Quota Consumption
→ Operational Cost Ledger
```

Required separation:

```text
Billing state
≠ Quota state
≠ User-visible credit consumption
≠ Operator provider-cost accounting
```

A failed user-visible review may consume zero user units while still creating real operator provider cost. The operational ledger must preserve that distinction without storing workflow/Evidence/result prose merely for accounting.

---

# 6. Unit economics contract

Pricing and quota decisions must use measured distributions, not average-token guesses alone.

At minimum measure:

## 6.1 Variable AI cost

- successful-review provider cost distribution
- a practical high percentile such as P95
- failed/timeout/invalid-result provider cost
- input/output usage by representative workflow size/topology
- evaluator model / reasoning setting / output-limit effect

## 6.2 Commercial variable cost

Where material, include:

- payment processing
- incremental hosting/compute
- database/storage/egress
- fraud/refund/chargeback cost
- support burden attributable to the paid feature

Do not pretend fixed infrastructure cost and per-user marginal cost are identical. Model both where useful.

## 6.3 Contribution model

For a proposed plan configuration, evaluate at minimum:

```text
Net collected revenue
- payment/tax costs borne by AgentGraph
- expected successful-review provider cost
- expected failed-attempt provider cost
- material incremental infrastructure cost
= commercial contribution before fixed company costs
```

Model more than one utilization case, including a high-usage case near the included quota. A positive average with unacceptable high-usage loss is not sufficient evidence for a safe quota.

Do not establish a permanent margin threshold before representative evidence exists. Follow the operational-quality maturity model:

```text
UNMEASURED
→ BASELINED
→ PROVISIONAL_TARGET
→ CALIBRATED_TARGET
→ ENFORCED / ALERTED where justified
```

---

# 7. Pricing evidence contract

Public price and included quota require **both** cost evidence and user-value evidence.

Required evidence classes:

## Cost evidence

- measured successful/failed provider cost
- representative workflow-size distribution
- proposed included-quota cost envelope
- payment/hosting/database costs material to the plan

## Value / willingness-to-pay evidence

Use privacy-safe signals appropriate to the launch stage, such as:

- paywall exposure → checkout start → paid activation
- first paid review completion
- repeat paid review after a later semantic workflow change
- quota utilization distribution
- subscription continuation / cancellation behavior when enough time has elapsed
- cancellation/refund/support reasons
- direct pricing/value feedback where collected
- evidence that users inspect findings/evidence/targets instead of treating the result as disposable text

Do not infer willingness to pay from page views, free usage, or API cost alone.

Price selection principle:

```text
Cost sustainability
+ User-perceived professional value
+ Willingness-to-pay evidence
→ Public price / quota decision
```

Configuration-backed provisional price/quota values are acceptable before launch. They do not become a durable Product contract merely because they are implemented.

---

# 8. Commercial Validation Gate — M0

`M0` is a commercial evidence gate for the initial individual paid model.

It is **not** a new AI-authority gate and does not replace Gate A/B/C. It must not block evaluator safety/quality hardening that is independently justified.

## 8.1 Entry condition

M0 requires:

- Architecture Review provider-backed capability is otherwise release-ready
- Paid Access & Usage Control packet is Production Verified
- commercial-use-eligible hosting is verified
- price/quota configuration is explicitly provisional or approved
- commercial-operations launch requirements in this document are satisfied for the intended launch scope
- enough real paid usage exists to evaluate the question being asked; do not manufacture a conclusion from an empty sample

## 8.2 Gate question

> Does the current paid individual offering demonstrate sustainable professional value and acceptable unit economics strongly enough to treat the model as validated for its current scope or to expand it?

## 8.3 Evidence to review

Review, when available and privacy-safe:

- paid conversion funnel
- first paid review activation
- valid-result / failure / timeout rate
- repeat review behavior
- workflow-change → re-review behavior where measurable
- quota utilization distribution
- successful and failed provider-cost distributions
- contribution under representative utilization cases
- refund / cancellation / support signals
- evaluator usefulness/quality evidence from Gate A where commercial value depends on it

Commercial evidence must not overrule evaluator safety. Strong conversion is not permission to expand AI authority.

## 8.4 Allowed outcomes

M0 may conclude:

1. **VALIDATE_CURRENT_SCOPE** — current paid individual model is supported within a defined scope.
2. **ADJUST_PRICE_OR_QUOTA** — value exists but configuration is economically or commercially mismatched.
3. **SELECT_REPEAT_VALUE_FOUNDATION** — evidence shows recurring value is limited by a specific Stage 1.5 dependency such as Project/Workspace, revision/evaluation history, Review Delta foundation, import, or Review/Locate usability.
4. **LIMIT_OR_PAUSE_PAID_EXPANSION** — evidence is insufficient or economics/value are not acceptable; keep the offering limited while fixing the measured constraint.
5. **REBASELINE_AFTER_MATERIAL_CHANGE** — model/provider/prompt/rubric or cost structure changed enough to invalidate prior economics.

No M0 outcome automatically selects all Stage 1.5 capabilities.

---

# 9. Relationship to Gate A and Stage 1.5

After Stage 1 Production evidence, evaluator and commercial questions are related but distinct:

```text
Stage 1 Production Evidence
├→ Gate A — Evaluation Trust & Scale
└→ M0 — Commercial Validation when sufficient paid evidence exists
```

Gate A asks whether evaluator quality/scale/context needs hardening.

M0 asks whether the current paid value and economics are validated and which commercial dependency, if any, limits repeat use.

Next Sprint selection should use all relevant evidence rather than forcing a rigid serial order.

Examples:

- poor evaluator quality → select quality hardening even if checkout conversion looks good
- strong one-time value but weak repeat use tied to missing revision context → consider the smallest revision/history foundation
- strong value but high P95 cost → adjust request guard/model/quota/price before broadening access
- weak conversion with little product usage → do not build Team features merely to seek higher ARPU

---

# 10. Privacy-safe commercial measurement

Commercial measurement must not create a hidden workflow-content warehouse.

Allowed measurement should prefer bounded metadata such as:

- anonymous/authenticated stable product identity as permitted by policy
- entitlement/plan state
- checkout/subscription lifecycle state
- quota counters / reservation outcome
- review request outcome
- model/reviewer versions
- bounded token/cost metadata
- workflow size buckets or non-content structural metrics when explicitly approved
- timestamps / failure categories

Do not put raw workflow text, Evidence bodies, provider prompts, findings, or result prose into analytics events merely to understand conversion or usage.

Suggested commercial funnel concepts for a future packet include:

```text
paid_value_shown
checkout_started
subscription_activated
paid_review_started
paid_review_succeeded
paid_review_failed
quota_exhausted
subscription_management_opened
subscription_cancelled
```

Exact event names/schema belong to the implementation packet and analytics allowlist. This document defines the measurement questions, not an automatic analytics implementation.

---

# 11. Commercial operations launch gate

A technically correct Stripe integration is not sufficient for a public paid launch.

Before public paid launch, the responsible packet/QA must make the applicable minimum commercial behavior explicit and verifiable:

- plan name, price, currency, included quota, quota period
- subscription start/renewal/cancellation behavior
- what happens after cancellation and at period end
- quota reset semantics
- provider failure / invalid-result credit behavior
- refund policy and operational path
- payment failure / past-due / billing-sync degraded behavior
- customer-visible subscription management path
- receipt/invoice behavior available through the chosen billing stack
- tax/VAT/consumption-tax handling or an explicitly approved merchant/tax approach appropriate to the launch scope
- Terms / paid service terms as applicable
- Privacy disclosure including provider-backed evaluation data flow
- support/contact path for billing and failed paid reviews
- commercial-use-eligible hosting verification

Do not build speculative enterprise legal/compliance systems for the first launch. Do not omit basic paid-service lifecycle behavior merely because Stripe handles payment collection.

---

# 12. Monetization-driven roadmap decision rules

Commercial evidence may influence roadmap priority when it identifies a concrete product dependency.

Strong positive signals for a Stage 1.5 repeat-value foundation include:

- users receive useful initial reviews but do not return because revisions cannot be compared
- users repeatedly recreate/re-import work because project/workflow identity is missing
- users cannot reach paid first value efficiently because existing CrewAI projects cannot be safely imported
- users inspect review results but cannot locate affected targets efficiently
- ambiguity from missing intent/context materially reduces review usefulness and paid retention

Do not select future capabilities merely because they appear monetizable in theory.

Examples of invalid selection logic:

- “Teams pay more, therefore build Team now.”
- “History is a Pro feature, therefore build all persistence.”
- “Usage is low, therefore add unlimited AI.”
- “Provider cost is cheap, therefore make review free.”
- “Conversion is high, therefore AI mutation authority can expand.”

Use:

```text
Observed constraint
→ Product/Architecture interpretation
→ Gate decision
→ Smallest coherent packet
```

---

# 13. Expansion boundaries

The following remain separate Product decisions/packets:

- free trial
- annual billing
- overage billing
- credit packs
- multiple individual plan tiers
- Team pooled quota
- collaboration billing
- Enterprise contracts
- BYOK
- private/BYO provider
- self-hosted/private evaluation
- marketplace monetization
- hosted-runtime monetization

Expansion should be justified by evidence, not by a desire to copy standard SaaS packaging.

---

# 14. Success condition

The initial monetization architecture is successful when AgentGraph can truthfully say:

```text
Free users receive useful deterministic engineering value.
Paid users receive evidence-grounded architecture intelligence.
Usage cannot create unbounded operator liability.
Failed reviews are accounted for fairly.
Price and quota are based on measured cost and value evidence.
Recurring value is validated rather than assumed.
Commercial expansion follows evidence instead of feature pressure.
```

The long-term business should compound around repeated trust, review history, regression control, safe improvement, team quality control, and governance while preserving user ownership of source/runtime.
