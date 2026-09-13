# ADR-0011 — Edge-contained first Live bootstrap for paid Architecture Review

Status: **Accepted**  
Date: **2026-09-13**  
Decision owner: `01 — Product Architecture & Roadmap`

## Context

The selected Stage 1 Architecture Review / Paid Access lifecycle remains open after the commercial-enablement preparation release. Production paid Architecture Review is intentionally fail-closed, PAUC AC-30 is not complete, Commercial Validation Gate M0 and Gate A are not reached, and no additional Stage 1.5 or Stage 2 capability is selected.

The paid-launch runbook records a circular first-launch dependency. With no legitimate Live entitlement yet, the fail-closed Production application cannot create one through the normal Checkout route. At the same time, Phase G requires Live webhook/reconciliation and entitled-user kill-switch/cost-guard evidence before unrestricted public paid enablement. Test Mode or fake/manual entitlement cannot substitute for that Live evidence.

The completed `AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1` packet materially improves confidence in the deterministic free-core first-value loop and release behavior, but it does not supply paid entitlement, billing, quota, provider-control, commercial-validation, Gate A, Gate B, AI-authority, or mutation-authority evidence.

At the 2026-09-13 review, live repository/Production identity was:

- GitHub `main`: `3cdce0161fe00d38aca8ba8e2bd0949bbc5899d0`;
- Vercel Production deployment: `dpl_Gu9mN3xJ61AxBZPdy2RXdKsfZ9py`, `READY`, `target=production`, matching `githubCommitSha`;
- Production paid Architecture Review remained disabled/fail-closed;
- the Vercel team still reported Hobby, so the separately required commercial-use hosting prerequisite remained unresolved.

Vercel Firewall currently supports route/path and IP-based custom rules. That makes an edge-contained verification window feasible in principle, but configuration evidence remains an external prerequisite and must not be inferred from platform capability.

## Decision

### 1. No new roadmap capability is selected

Post-Astra review result:

```text
Explicit Next Selection
= NO NEW CAPABILITY / NO NEW ROADMAP PACKET
```

Continue the already-selected Stage 1 paid Architecture Review / Paid Access lifecycle. Astra completion does not promote Gate A, Stage 1.5, Gate B, Stage 2, AI Authority, Mutation Authority, or Commercial Validation Gate M0.

### 2. Resolve the first-launch circularity through a bounded QA-only Live verification window

The permitted Product/Architecture sequencing is:

1. **Close every non-circular Phase G prerequisite first.** Commercial-use hosting, public policy/operations approvals, Stripe Live configuration, financial-QA approval, Production Auth, provider controls, Test Mode lifecycle/control evidence, Production WAF baseline, exact release identity, and all other independently satisfiable prerequisites remain mandatory.
2. **Install and independently verify edge containment before changing the paid switch.** Production paid/billing routes required for the verification window must be denied to non-QA traffic and allowed only from the controlled QA source/operator boundary. The deterministic free core remains public and independent. Exact rule scope/order, privacy-safe source handling, rollback, and evidence belong to the `02` procedure specification; no source IP or secret is stored in repository docs.
3. **First bounded Live window:** under that containment only, temporarily set the existing paid switch true and use the real Production Auth + application Checkout path with the approved Live monthly Price to create the first legitimate QA subscription. Observe the signed Live webhook/reconciliation to the normal entitlement and quota read model. Do not invoke a successful provider-backed review in this first window.
4. **Return to fail-closed immediately after entitlement/reconciliation evidence is captured.** Confirm the entitled QA user is blocked with `review_disabled`, with zero provider invocation and zero quota consumption, while the deterministic free core still works. This is the Live entitled kill-switch proof; it does not make paid access public.
5. **Second bounded Live window:** only after the first entitlement exists and prior evidence passes, re-enable under the same edge containment and exercise the cost-guard rejection **before any successful provider-backed review**. Required result: zero provider invocation and idempotent reservation release. Any uncertainty or failure returns the switch to false and stops progression.
6. **Only after those Phase G proofs pass may W01 proceed into the existing AC-30 financial-QA sequence.** The real subscription → entitlement → reservation → valid consume and non-consumption paths remain mandatory. Test Mode, manual entitlement/quota edits, fake webhooks, or an unrestricted public bootstrap are not acceptable substitutes.
7. **Public access remains blocked until W01 has completed the applicable live verification and the final public configuration is independently reverified.** Removing QA-only containment is a material Production configuration transition, not evidence already obtained from the contained window.

This is a sequencing decision inside the existing paid lifecycle. It does not create a new paid tier, entitlement model, quota rule, API, provider authority, or Product capability.

### 3. Specification ownership

`02 — UX & Implementation Specification` must amend the existing paid-launch contract/runbook before execution. The procedure must define at minimum:

- exact Production routes covered by containment;
- allow/deny and rate-limit ordering;
- controlled QA source/operator authority without storing secrets or personal data in repository docs;
- preconditions for each switch transition;
- exact evidence required after Checkout, webhook/reconciliation, entitlement/quota projection, kill-switch, and cost-guard steps;
- abort, disable, rollback, and re-enable conditions;
- treatment of public offer/degraded UI while edge containment is active;
- financial charge/cancel/refund handling;
- W01 re-QA and final Production-verification expectations;
- confirmation that all non-circular Phase G prerequisites remain prerequisites.

If `02` finds that the existing implementation cannot safely realize this sequence without a new Product/security semantic decision, it must return that decision to `01`; `C01` must not invent a bootstrap bypass.

## Rationale

This is the smallest sufficient architecture because it:

- uses the existing real Checkout, signed webhook, entitlement, quota, kill-switch, and cost-guard contracts rather than introducing manual entitlement authority;
- keeps non-QA users outside the Live bootstrap window instead of treating a temporary verification enablement as public launch;
- preserves fail-closed behavior between evidence steps;
- obtains the missing Live evidence in dependency order;
- keeps AC-30 as the full end-to-end Production proof rather than weakening it;
- preserves the deterministic free core independently of billing/provider state;
- does not manufacture a new Sprint merely because a currently selected lifecycle has an operational sequencing gap.

## Consequences

- `COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER` remains active until the external prerequisites, procedure specification, controlled Live evidence, and W01 AC-30 requirements are actually satisfied.
- `R-008`, `R-020`, and `R-021` remain applicable; this decision changes mitigation sequencing, not their durable state.
- The current Vercel Hobby state remains a separate blocker under the existing commercial-use-hosting requirement.
- `PAUC AC-30 = NOT COMPLETE` until W01 executes and passes it.
- `Commercial Validation Gate M0 = NOT REACHED` until Paid Access is Production Verified and sufficient real paid evidence exists.
- `Gate A = NOT REACHED`; no Astra or commercial-bootstrap evidence is treated as evaluator-quality promotion evidence.
- `Stage 1.5 = NONE SELECTED`, `Gate B = NOT REACHED`, `Stage 2 = NOT SELECTED`.
- AI Authority and Mutation Authority remain unchanged.

## Alternatives considered

### Manual entitlement/quota grant

Rejected. It would bypass the selected entitlement authority and would not prove the signed Live billing/reconciliation path.

### Fake/test webhook in Production

Rejected. It would not be Live Stripe evidence and would weaken the existing PAUC/AC-30 distinction.

### Stripe Dashboard-created subscription as the primary bootstrap

Not selected as the default path. Although it could create a legitimate Stripe object, it would not exercise the normal application Checkout path that the launch contract is intended to validate. `02` may use it only if a later explicit authority decision establishes it as an equivalent Stripe-approved Live mechanism without weakening entitlement authority.

### Temporarily enable paid access for the general public

Rejected. Missing pre-enable evidence must not be collected by exposing an unrestricted paid path.

### Select a new Stage 1.5 or Stage 2 packet while commercial work is blocked

Deferred. Astra completion did not add evaluator-quality, adoption/context demand, commercial-validation, or stronger-authority evidence sufficient to justify such selection now.

## Migration / compatibility impact

No schema, persistence, provider payload, entitlement rule, quota rule, API contract, evaluator behavior, AI Authority, or Mutation Authority change is authorized by this ADR. Existing saved work and deterministic free-core behavior remain protected.

## Related docs / packets

- `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md`
- `docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/MONETIZATION_ARCHITECTURE.md`
- `docs/specs/AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1.md`
