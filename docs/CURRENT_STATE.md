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

Latest live checks on 2026-09-05 confirm:

```text
GitHub main
= 916151238ffa1ecbbc44347f362cd3313776d804

Vercel Production
= READY
= target=production
= githubCommitSha matches main

Production Architecture Review offer
= enabled=false
= price=null
= includedReviews=null

Vercel team plan
= Hobby
```

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
= PROCEED_TO_PAID_LAUNCH_CANDIDATE

Paid Architecture Review access
= ACTIVE PAID ENTITLEMENT REQUIRED
+ REMAINING SERVER-ENFORCED QUOTA REQUIRED

Initial included quota
= 10 reviews per monthly Stripe billing period
= PROVISIONAL LAUNCH CONFIGURATION

Production paid Architecture Review
= DISABLED / FAIL-CLOSED until release gates pass

Immediate Production paid switch
= NOT YET

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

# 3. Current Product / commercial decision

The authoritative near-term sequence is in `docs/roadmap/PROGRAM_BOARD.md`.

Current decision:

> Complete the existing Architecture Review commercial path through a final paid-launch candidate in Stripe Test Mode while public Production remains disabled. Provider-backed Architecture Review requires verified active paid entitlement and remaining quota. Provisional launch configuration is USD 12/month, quota 10, and the approved bounded request/provider-budget profile.

The free product remains independently useful. Billing/auth/provider failure must not disable deterministic Builder, Templates, JSON Import/Export, Readiness, Execution Preview, Resource Analysis, Unified Preflight, or deterministic CrewAI Python export.

The selected quota is provisional rather than durable. It may be recalibrated after real paid usage/cost evidence. This does not weaken `MONETIZATION_ARCHITECTURE.md` / ADR-0007 or mark M0 reached.

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
= complete commercial readiness on Draft PR #35
= enforce paid-entitlement-only provider access
= wire USD 12/month, quota 10, final request-cost envelope, Stripe Tax-ready Checkout, and 20/40/50 USD provider budget readiness
= verify the logical commercial path in Stripe Test Mode as far as connected credentials allow

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

- Vercel Hobby → Pro immediately before public paid launch;
- Stripe Test → Live and a real Production USD 12 monthly Price/Portal configuration;
- merchant identity, tax registration/geography, and legal approval;
- Production provider project with USD 20 warning, USD 40 critical, and USD 50 hard monthly ceiling;
- public Terms / Privacy / Support URLs and approved refund/tax operational material;
- Production Supabase Auth email delivery/redirect readiness;
- controlled QA account and approved financial handling;
- Production WAF configuration and verification path;
- fresh independent QA for the final changed revision.

The included quota is no longer Unknown: the initial provisional value is 10 reviews per monthly billing period.

C01 must not invent the remaining unresolved launch values. W01 must not bypass entitlement/quota or weaken AC-30.

---

# 6. Known / Inferred / Unknown

## Known

- Stage 1 implementation is QA Complete and released.
- latest live GitHub main and Vercel Production currently match at `916151238ffa1ecbbc44347f362cd3313776d804`.
- Production Architecture Review offer currently remains disabled with no public price/quota exposed.
- Vercel team is currently on Hobby and therefore remains a commercial launch blocker until hosting eligibility is changed and reverified.
- provider-backed Architecture Review is selected as paid-entitlement-only.
- the initial provisional included quota is 10 reviews per monthly billing period.
- deterministic free features remain operational and must remain independent of paid/provider availability.
- commercial preparation continues on isolated Draft PR #35; main merge and Production paid enablement are not yet authorized.
- Gate A is not reached; Stage 1.5/Stage 2 are not selected; AI and Mutation Authority are unchanged.

## Inferred

- A 10-review monthly quota is a conservative initial operating value relative to the current successful-review benchmark distribution, while still allowing meaningful repeated use.
- The quota can be recalibrated later without changing the fundamental free/paid product boundary.

## Unknown / evidence-dependent

- merchant legal identity / tax registration and final legal material approval;
- Production Stripe Live evidence;
- Vercel Pro commercial eligibility after upgrade;
- Production provider budget enforcement evidence;
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
