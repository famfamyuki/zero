# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-09-05**  
Status: **Coordination snapshot; live repository/Production checks win**  
Scope: Concise answer to where development is now, what is blocked, and which canonical lane acts next.

This file is **not** a deployment registry, roadmap copy, packet copy, or historical release archive.

## 0. Live-state rule

Before implementation, QA, release, roadmap promotion, commercial launch, or current-state decisions, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior
4. the relevant authoritative packet under `docs/specs/`

Authority references:

- Product → `docs/PRODUCT_MASTER.md`
- Architecture → `docs/ARCHITECTURE.md`
- Engineering execution → `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- roles/lifecycle ownership → `docs/CHAT_ROLE_REGISTRY.md`
- roadmap → `docs/roadmap/MASTER_ROADMAP.md`
- promotion / AI / mutation authority → `docs/roadmap/EXECUTION_GATES.md`
- near-term execution plan → `docs/roadmap/PROGRAM_BOARD.md`
- durable risks → `docs/roadmap/RISK_REGISTER.md`
- commercial value/pricing/launch contract → `docs/roadmap/MONETIZATION_ARCHITECTURE.md`

---

# 1. Current Production baseline

Current Production includes the established deterministic product foundation plus Stage 1 Architecture Review and paid-access controls in a **disabled / fail-closed** state.

The deterministic free core remains operational independently of paid/provider availability, including the protected builder, templates, portability, deterministic Preflight analysis, and deterministic CrewAI export paths.

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

---

# 2. Current lifecycle state

| Track | Current state | Next condition |
|---|---|---|
| Stage 1 — Evidence-Grounded AI Architecture Review + Paid Access & Usage Control | **QA Complete / release execution complete / Production Verification BLOCKED** | commercial/Production prerequisites become ready; final exact revision passes fresh W01 QA; controlled Production paid path passes W01 Pass B |
| CrewAI Static Import v0 | **Sprint Complete / Production Verified** | remains complete |
| Existing-Capability Product Identity & Review Journey UX Restructuring | **Sprint Complete / Production Verified** | remains complete |

Current stage/gate/authority state:

```text
Commercial Enablement Decision
= ENABLE_PREP

Production paid Architecture Review
= DISABLED / FAIL-CLOSED

Public paid switch
= NOT APPROVED

W01 Pass B
= BLOCKED

Production Verified
= NO

Sprint Complete
= NO

Gate A
= NOT REACHED

Additional Stage 1.5 capability
= NONE SELECTED

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED
```

The earlier evaluator-quality/API-budget blocker is resolved. The current blocker is the Production paid/commercial verification path.

---

# 3. Current execution decision

The authoritative near-term sequence is in `docs/roadmap/PROGRAM_BOARD.md`.

Current decision:

> Continue existing `ENABLE_PREP` by finishing all price-independent commercial readiness first. Defer final Public Price / Currency / Included quota / numeric request-cost envelope / aggregate provider budget until the final commercial-configuration step.

This is a sequencing decision only. It does not weaken or replace the pricing-evidence contract in `docs/roadmap/MONETIZATION_ARCHITECTURE.md` / ADR-0007.

Current working isolation:

```text
commercial branch
= codex/commercial-enablement-prep-20260905

Draft PR
= #35

main merge
= NOT AUTHORIZED YET

ARCHITECTURE_REVIEW_PAID_ENABLED
= false
```

---

# 4. Current next authority

```text
C01
= complete price-independent commercial readiness on Draft PR #35

then

01
= decide final commercial configuration
  (Price / Currency / quota / numeric economics / launch policy inputs)

then

02
= only if a final Product-facing specification gap remains

then

C01
= apply final approved configuration and produce final launch-candidate revision

then

W01
= fresh Pass A on the exact final revision
```

Release/verification afterward remains:

```text
W01 QA Complete
→ C01 merge/release exact approved revision
→ controlled Production paid enable
→ W01 Pass B / AC-30
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

---

# 5. Active blocker and remaining launch prerequisites

```text
Blocker:
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER
```

Remaining prerequisites include, as applicable:

- commercial-use-eligible hosting/account;
- final approved Price / currency / included quota;
- final approved numeric request-cost guard and provider budget controls;
- active recurring monthly Stripe Price and bounded Customer Portal configuration;
- Terms / Privacy / Support / refund / tax operational path;
- Production Supabase Auth email delivery/redirect readiness;
- controlled QA account and approved financial handling;
- Production WAF configuration and verification path;
- fresh independent QA for the final changed revision.

C01 must not invent unresolved Product/commercial values. W01 must not bypass entitlement/quota or weaken AC-30.

---

# 6. Known / Inferred / Unknown

## Known

- Stage 1 implementation is QA Complete and released.
- Production paid Architecture Review remains intentionally disabled/fail-closed in the verified current posture.
- deterministic free features remain operational.
- `ENABLE_PREP` is selected; immediate public paid activation is not.
- commercial preparation continues on an isolated Draft PR.
- final numeric commercial values are deferred until the final configuration step.
- Gate A is not reached; Stage 1.5/Stage 2 are not selected; AI and Mutation Authority are unchanged.

## Inferred

- Deferring final numeric commercial values removes an unnecessary sequencing blocker without changing the durable pricing/launch contract.
- Completing price-independent readiness first should reduce late implementation uncertainty before final commercial configuration and independent QA.

## Unknown / evidence-dependent

- final Public Price / Currency / Included quota;
- final numeric request-cost envelope and provider monthly budget;
- final tax/refund/legal/support launch approval;
- Production Auth controlled-account behavior;
- live Stripe subscription/entitlement/quota behavior;
- Production WAF behavior;
- controlled financial QA result;
- paid-path Production Verification;
- commercial validation / recurring paid value under M0.

Unknown means insufficient evidence, not evidence of absence.

---

# 7. Planning discipline

`docs/roadmap/PROGRAM_BOARD.md` is the single near-term execution plan.

Update planning documents only when lifecycle, blocker, gate, selection, authority, release, or Production meaning materially changes. Do not copy transient commit/deployment facts into multiple planning documents.

Canonical lanes remain:

```text
00 — Program Control & Current State
01 — Product Architecture & Roadmap
02 — UX & Implementation Specification
C01 — Current Sprint Implementation
W01 — Independent QA & Production Verification
```

`QA Complete ≠ Production Verified`.  
`Release execution ≠ Production Verified`.  
`Sprint Complete ≠ automatic Stage promotion`.
