# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-09-06**  
Status: **Coordination snapshot; live repository/Production checks win**  
Scope: Concise answer to where development is now, what is blocked, and which canonical lane acts next.

This file is **not** a deployment registry, roadmap copy, packet copy, or historical release archive.

## 0. Live-state rule

Before implementation, QA, release, roadmap promotion, commercial launch, or current-state decisions, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior
4. the relevant authoritative packet under `docs/specs/`

Do not treat a release-baseline SHA recorded below as the perpetual current `main`; documentation-only reconciliation commits may legitimately advance `main` afterward without changing the verified product behavior.

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

# 1. PR #35 paid-off Production verification baseline

The scoped W01 Pass B verification for the commercial-enablement preparation release established:

```text
PR #35
= MERGED

PR #35 released commit at W01 Pass B
= 6c026189657c8211dd1b5922119a252d3335e705

Released tree
= b0a8dad3d05b8220025d401f6fdf9ba508b32b63

W01-verified Vercel Production deployment for that release
= dpl_8we4kQoxMRXhGCdzccpNK81P2H6i
= READY
= target=production
= githubCommitSha matched the then-current released main

Production Architecture Review offer at verification
= enabled=false
= price=null
= includedReviews=null
= policyUrls=null

Vercel team plan observed at verification
= Hobby
```

The commercial-enablement preparation release was therefore Production Verified while the paid Architecture Review path remained **disabled / fail-closed**. Subsequent current-state documentation commits do not change that scoped release conclusion unless they change product behavior; always re-check live `main` and Production for the present deployment identity.

The deterministic free core remains independent of paid/provider availability, including Builder / Design, Templates, AgentGraph JSON Import/Export, CrewAI Static Import entrypoint, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python export.

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

---

# 2. Current lifecycle state

| Track | Current state | Next condition |
|---|---|---|
| Commercial-enablement preparation release — PR #35 | **MERGED / PAID-OFF PRODUCTION VERIFIED** | remains complete as a scoped preparation milestone |
| Stage 1 — Architecture Review + Paid Access public launch lifecycle | **OPEN / PAID PRODUCTION NOT ENABLED / AC-30 NOT COMPLETE** | external launch prerequisites ready → controlled paid enablement → W01 live financial QA / AC-30 |
| CrewAI Static Import v0 | **Sprint Complete / Production Verified** | remains complete |
| Existing-Capability Product Identity & Review Journey UX Restructuring | **Sprint Complete / Production Verified** | remains complete |

Current stage/gate/authority state:

```text
Commercial Enablement Decision
= PROCEED_TO_PAID_LAUNCH_CANDIDATE

Provider-backed Architecture Review access
= AUTHENTICATED ACTIVE PAID ENTITLEMENT REQUIRED
+ REMAINING SERVER-ENFORCED QUOTA REQUIRED

Provisional launch configuration
= USD 12.00 / month
= 10 reviews per confirmed monthly Stripe billing period

Commercial-enablement preparation release
= PRODUCTION VERIFIED while paid-off

W01 preparation-release Pass B
= PASS_B_WITH_NOTES

Production paid Architecture Review
= DISABLED / FAIL-CLOSED

Paid Access Production Verified under PAUC AC-30
= NO

Current commercial Sprint Complete
= NO

Commercial Validation Gate M0
= NOT REACHED

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

The scoped Production Verification above applies only to the **paid-off preparation release**. It does not satisfy `AGS-EGAI-AR-PAUC-V0-P1` AC-30, which requires the real Production Stripe subscription → entitlement → quota reservation → valid review consume path plus a non-consumption failure path using a controlled QA account.

---

# 3. Commercial preparation release vs paid launch

PR #35 is no longer an active Draft PR. Its W01-approved candidate and released identity are:

```text
W01 Pass A approved candidate
= 107f2db9ac7d9b4f6c02f708ebe7a343b14b00ed

PR #35 released commit at W01 Pass B
= 6c026189657c8211dd1b5922119a252d3335e705

Candidate tree
= b0a8dad3d05b8220025d401f6fdf9ba508b32b63

Released tree
= b0a8dad3d05b8220025d401f6fdf9ba508b32b63

Candidate-to-released-main file diff
= EMPTY
```

00 records this as a **completed sub-release / milestone inside the already-selected commercial Sprint**, not as completion of the paid-launch packet followed by a newly selected future lifecycle.

Reason: the current PAUC packet, Monetization Architecture, Program Board sequence, and paid-launch runbook already define controlled Production enablement and AC-30 as part of the selected paid-launch lifecycle. Reclassifying those required gates as unrelated future work would silently weaken the existing release contract.

The free product remains independently useful. Billing/auth/provider failure must not disable deterministic Builder, Templates, JSON Import/Export, Readiness, Execution Preview, Resource Analysis, Unified Preflight, CrewAI Static Import, or deterministic CrewAI Python export.

---

# 4. Current next authority

The current blocker is primarily **external/commercial Production readiness**, not a missing implementation specification.

For the active packet index, item-level external-readiness ownership, and permitted evidence preparation while launch is blocked, use `docs/roadmap/PROGRAM_BOARD.md`. Evidence preparation is not formal Gate A passage, a new Sprint selection, or permission to enable paid Production. The recorded PR #35 baseline does not certify later behavior-changing revisions.

Canonical routing is:

```text
00
= maintain blocker/current-state coordination while external prerequisites are unresolved

C01
= next actionable implementation/release lane once the already-defined Production prerequisites are evidenced
= apply only approved live configuration / controlled paid enablement actions
= do not invent Product, merchant, legal, tax, support, or policy semantics

then

W01
= independently verify the exact live paid path
= execute Production financial QA / AC-30

then, only if W01 passes

00
= Sprint Complete review

then

01
= Evidence → Gate Review → Explicit Next Selection
```

Use `01` before C01 only if a remaining prerequisite requires a new Product/commercial selection, scope change, or semantic decision. Use `02` only if such a decision creates an unresolved Product-facing implementation-specification gap. W01 does not act again until new independently verifiable paid-launch evidence exists.

No noncanonical permanent lane is created for merchant/legal/tax/support or release operations.

---

# 5. Active blocker and remaining launch prerequisites

```text
Blocker:
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER

Related durable risks:
R-008 / R-020 / R-021
```

The preparation release does not close the public paid-launch blocker.

Remaining prerequisites/evidence include, as applicable:

- independently verified commercial-use hosting eligibility; current Vercel team still reports Hobby until live state says otherwise;
- final public Terms / Privacy / Support content, reachability, and merchant/legal/privacy/tax/refund/support approvals;
- Production Supabase Auth email delivery / redirects / controlled-account readiness;
- Stripe Live monthly Price, dedicated Customer Portal, webhook/reconciliation lifecycle, and live billing controls;
- Production WAF configuration and effectiveness evidence;
- Production provider budget / alert / hard-ceiling evidence for the approved bounded profile;
- controlled entitled-user kill-switch exercise;
- controlled live financial QA / PAUC AC-30;
- paid-path W01 Production Verification.

The following are already Known as **provisional launch configuration**, not durable commercial validation:

- base price: USD 12.00/month;
- included quota: 10 reviews per confirmed monthly billing period;
- approved request-cost envelope and provider budget thresholds defined by the current packet/runbook.

Commercial Validation Gate M0 remains pending even after a future successful paid launch until sufficient real paid evidence exists.

---

# 6. Known / Inferred / Unknown

## Known

- PR #35 is merged and the released tree matches the W01-approved candidate tree.
- at the scoped W01 Pass B, PR #35 released commit `6c026189657c8211dd1b5922119a252d3335e705` matched Vercel Production deployment `dpl_8we4kQoxMRXhGCdzccpNK81P2H6i` and its `githubCommitSha`.
- the PR #35 preparation release is Production Verified **only in this paid-off scope**.
- the real paid Production path is not enabled and PAUC AC-30 is not complete.
- Production Architecture Review remains required to fail closed until the paid-launch prerequisites are satisfied.
- the Vercel team was independently observed as Hobby during this reconciliation; commercial-use hosting eligibility remains unresolved until independently approved/verified for the intended launch.
- provider-backed Architecture Review remains paid-entitlement-only with provisional USD 12/month and quota 10.
- Gate A and M0 are not reached; Stage 1.5/Stage 2 are not selected; AI and Mutation Authority are unchanged.
- current GitHub/Vercel deployment identity must be obtained from live systems, not inferred from the PR #35 release-baseline SHA in this snapshot.

## Inferred

- Keeping the preparation code live while the public offer remains fail-closed reduces release coupling without weakening the paid-launch gate, provided future enablement still follows the runbook and fresh independent verification.
- No new 02 packet is currently required unless external approval changes user-visible Product semantics.

## Unknown / evidence-dependent

- commercial-use hosting eligibility for the actual public paid launch;
- final merchant/legal/privacy/tax/refund/support approval and public-policy readiness;
- Production Supabase Auth controlled-user behavior;
- Stripe Live subscription/Portal/webhook lifecycle behavior;
- Production provider budget/alert/hard-ceiling effectiveness;
- Production WAF behavior;
- controlled entitled-user kill-switch result;
- controlled financial QA / AC-30 result;
- paid-path Production Verification;
- commercial validation / recurring paid value under M0.

Unknown means insufficient evidence, not evidence of absence.

---

# 7. Planning discipline

`docs/roadmap/PROGRAM_BOARD.md` is the single near-term execution plan.

Update planning documents only when lifecycle, blocker, gate, selection, authority, release, or Production meaning materially changes. Do not copy transient commit/deployment facts into multiple planning documents except where a scoped release identity is necessary to disambiguate current lifecycle state.

Canonical lanes remain:

```text
00 — Program Control & Current State
01 — Product Architecture & Roadmap
02 — UX & Implementation Specification
C01 — Current Sprint Implementation
W01 — Independent QA & Production Verification
```

`Preparation release Production Verified ≠ Paid Access AC-30 Production Verified`.  
`QA Complete ≠ Production Verified`.  
`Release execution ≠ Production Verified`.  
`Sprint Complete ≠ automatic Stage promotion`.
