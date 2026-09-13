# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-09-13**  
Status: **Coordination snapshot; live repository/Production checks win**  
Scope: Concise top-level lifecycle, blocker, authority state, and scoped evidence needed to understand where development stands.

This file is intentionally **not** a deployment registry, near-term execution plan, roadmap, packet copy, risk register, or release-history archive. `docs/roadmap/PROGRAM_BOARD.md` owns the active execution sequence and blocker routing.

## 0. Live-state rule

Before Product/Architecture/Roadmap, implementation, QA, release, or current-state decisions, re-check as applicable:

1. latest GitHub `main` / repository reality;
2. latest Vercel Production deployment and actual Production behavior;
3. authoritative active packet under `docs/specs/`;
4. durable Product / Architecture / Development / Roadmap authorities;
5. `docs/roadmap/PROGRAM_BOARD.md` and `docs/roadmap/RISK_REGISTER.md`;
6. this snapshot;
7. ADRs / historical chats / old SHAs.

Do not persist a mutable GitHub-main or latest-deployment identity here as a current claim. Scoped historical release identities may remain when needed to distinguish lifecycle evidence.

Canonical owners:

- Product → `docs/PRODUCT_MASTER.md`
- Architecture → `docs/ARCHITECTURE.md`
- Development Governance → `docs/DEVELOPMENT_RULES.md`
- roles/lifecycle ownership → `docs/CHAT_ROLE_REGISTRY.md`
- roadmap sequence → `docs/roadmap/MASTER_ROADMAP.md`
- promotion / AI / Mutation authority → `docs/roadmap/EXECUTION_GATES.md`
- evaluation trust / scale direction → `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- current execution / packet index / blocker ownership → `docs/roadmap/PROGRAM_BOARD.md`
- durable risks → `docs/roadmap/RISK_REGISTER.md`
- commercial value/pricing/launch contract → `docs/roadmap/MONETIZATION_ARCHITECTURE.md`

---

# 1. Stable current-state facts

The deterministic free core remains protected independently of paid/provider availability, including Builder/Design, Templates, AgentGraph JSON Import/Export, CrewAI Static Import entrypoint, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python export.

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

The bounded `GPT-6 Astra Challenge Launch Hardening` packet is **Sprint Complete / Production Verified**. It strengthened the deterministic/manual first-value loop without changing the durable Product definition, paid lifecycle, roadmap stage status, AI Authority, or Mutation Authority.

The first-Live sequencing decision remains accepted in ADR-0011. PR #59 released the `02` operational amendment and paid-launch runbook procedure, and W01 independently verified that specification release **PASS WITH NOTES**. The procedure is **Specified / released / release-verified**, but Phase 0 evidence, QA containment, first-Live behavior, and PAUC AC-30 remain unverified/incomplete.

A stakeholder priority now defers final commercial activation until AgentGraph Studio's Product development has advanced further. `01` preserved the entire commercial safety contract and selected the Evaluation Trust Product Sprint instead of enabling billing now.

Current Product packet:

```text
AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1
= SPECIFIED

Capability
= Architecture Review Evaluation Trust Foundation v0
= Gold Dataset + Quality Metrics

Next owner
= C01 — Current Sprint Implementation
```

Selection authority:

`docs/decisions/ADR-0012-select-architecture-review-evaluation-trust-foundation.md`

The `02` specification was completed against live GitHub `main` `7a6783d6037759243e17680d024b6b4e6e642894` and the current evaluator/fixture/harness reality. That SHA is specification-baseline evidence, not a durable claim about today's future mutable main.

---

# 2. Current lifecycle summary

`PROGRAM_BOARD.md` is authoritative for the full execution sequence. The current summary is:

```text
Commercial-enablement preparation release
= MERGED / PAID-OFF PRODUCTION VERIFIED

Stage 1 Architecture Review + Paid Access public-launch lifecycle
= OPEN
= commercial activation DEFERRED
= Production paid Architecture Review DISABLED / FAIL-CLOSED
= first-Live procedure SPECIFIED / RELEASED / RELEASE-VERIFIED
= Phase 0 external prerequisites NOT COMPLETE
= QA containment NOT VERIFIED / NOT READY
= PAUC AC-30 NOT COMPLETE
= Paid Access Production Verified NO
= commercial Sprint NOT COMPLETE

GPT-6 Astra Challenge Launch Hardening
= SPRINT COMPLETE / PRODUCTION VERIFIED
= W01 PASS WITH NOTES

Architecture Review Evaluation Trust Foundation v0
= SPECIFIED
= next owner C01
= implementation not yet complete

Commercial Validation Gate M0
= NOT REACHED

Gate A
= NOT REACHED

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED
```

The commercial lifecycle remains **OPEN / FAIL-CLOSED / DEFERRED ACTIVATION**. Deferral does not remove or weaken commercial-use hosting, Auth, Stripe Live, provider controls, Firewall/containment, first-Live, financial QA, or AC-30 requirements. Those obligations must be re-checked fresh if/when activation is explicitly resumed.

The previous commercial blocker remains real for public paid exposure:

```text
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER
Related durable risks: R-008 / R-020 / R-021
```

It is currently a deferred **commercial-activation blocker**, not a blocker to the independently justified Evaluation Trust Product Sprint while the paid path remains disabled.

The current Product risk/evidence target is:

```text
R-001 — Evaluator semantic quality may be insufficient for stronger recommendation authority
= Critical / WATCH
```

Specification completion does not resolve the risk. The Sprint must still implement and later gather measurement evidence.

---

# 3. Why Evaluation Trust is the current Product priority

The existing Architecture Review formal evaluation provides meaningful release-safety evidence:

- 10 synthetic A–J fixtures;
- 3 runs each / 30 reviews total;
- 210 / 210 current semantic rubric checks in the recovered formal run;
- zero hard violations in that run.

However, the current harness does not yet measure the core semantic-quality questions required before stronger evaluator authority can be considered:

- issue precision / recall;
- good-workflow false positives;
- flawed-workflow false negatives / issue coverage;
- top-1 / top-k priority agreement;
- strength recognition against reviewed expectations;
- acceptable alternative interpretations;
- repeated-run material-finding stability;
- semantics-preserving variant stability.

The current fixtures are also small; the largest current A–J fixture contains eight nodes. This establishes that large-workflow behavior remains **Unknown**, not that a scoped/hierarchical scale solution is already required.

`02` has now specified the bounded foundation needed to measure those questions. The contract retains the current release-safety checks, adds versioned candidate/human-approved annotation states, deterministic matching/scoring, report/version metadata, and separate repeated-run vs representation-stability semantics. It deliberately does not invent permanent Gate thresholds or a second LLM judge.

---

# 4. Current next authority

The immediate owner is:

```text
C01 — Current Sprint Implementation
```

C01 must implement `AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1` exactly as Specified without inventing Product behavior.

Implementation scope includes:

- repository-owned strict benchmark dataset/rubric/scorer/report contracts;
- A–J fixture fingerprint/provenance validation;
- candidate vs human-approved-gold annotation eligibility without fabricated review provenance;
- deterministic issue/strength/Unknown matching, including target/Evidence/recommendation support;
- precision/recall, good FP, flawed FN/coverage, top-1/top-3, strength, Unknown, and stability metrics with exact N/A/exclusion handling;
- two explicit non-semantic variants: layout-only position change and node/edge collection ordering;
- provider-independent offline quality validation/scorer/report tests;
- compatibility with the existing A–J hard/safety release harness;
- an optional provider-backed quality command only with explicit spend ceiling and existing provider/data governance.

C01 must not relabel candidate annotations as expert gold without real human review provenance, add a permanent promotion threshold, change the Production evaluator/model/prompt to improve scores, or pull in Project/Workspace, persisted Intent, scale architecture, Guided Improvement, Semantic Patch, or commercial activation.

Normal lifecycle remains:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Complete
→ W01 QA Complete
→ C01 exact approved release
→ W01 Production Verified as applicable
→ 00 Sprint Complete
→ 01 Evidence / Gate Review / Explicit Next Selection
```

---

# 5. Commercial activation resumption rule

Commercial activation is preserved but deliberately not in the current execution path.

At minimum:

```text
current Evaluation Trust Sprint completes normal lifecycle
→ 00 reconciles current Product/commercial evidence and stakeholder priority
→ 01 explicitly decides whether commercial activation resumes or another Product dependency is selected
```

Completion of the selected Sprint does **not** automatically authorize commercial activation.

If activation later resumes, the existing safe order remains authoritative:

```text
fresh Phase 0 prerequisite verification
→ QA-only containment + independent W01 proof while paid-off
→ bounded first-Live entitlement/webhook bootstrap
→ immediate paid-off entitled kill-switch proof
→ bounded cost-guard proof before provider invocation
→ paid-off again
→ existing PAUC AC-30
→ separately verified public-enable transition
```

No current Product selection authorizes Stripe Live charging, Vercel plan/account changes, Firewall/WAF mutation, provider configuration mutation, first-Live windows, or AC-30 execution now.

---

# 6. Scoped historical release evidence

These are historical scoped evidence, **not** today's mutable main/deployment identity.

## 6.1 Commercial-enablement preparation release — PR #35

```text
W01 Pass A approved candidate
= 107f2db9ac7d9b4f6c02f708ebe7a343b14b00ed

Released commit at W01 Pass B
= 6c026189657c8211dd1b5922119a252d3335e705

Candidate/released tree
= b0a8dad3d05b8220025d401f6fdf9ba508b32b63

W01 result
= PASS_B_WITH_NOTES
= paid-off preparation milestone only
```

Meaning preserved: `Preparation release Production Verified ≠ Paid Access AC-30 Production Verified`.

## 6.2 Astra launch-hardening release

```text
W01 Pass A approved candidate
= 5c3d6784d8b12bea48539ef1e8cd62c5000b9699

Released main at W01 Pass B
= 3cdce0161fe00d38aca8ba8e2bd0949bbc5899d0

Candidate/released tree
= 6710fba8e84e96012a0d3cf98439383ab8dc4ffe

W01-verified Production deployment
= dpl_Gu9mN3xJ61AxBZPdy2RXdKsfZ9py
= READY
= target=production

W01 result
= PASS WITH NOTES / Production Verified
```

The Astra release proved the scoped deterministic/manual first-value journey and related regressions. It did not prove commercial activation, calibrated evaluator quality, stronger AI authority, or mutation authority.

## 6.3 First-Live procedure specification release — PR #59

```text
W01 Pass A approved candidate
= a6c5990a5eff090c196ba65fb71a9f2971d37443

Released main at PR #59
= 157e33f064dbca75a3098392901f9017562106fb

Approved/released tree
= a5831dff58e46b5bd2210bc7bc83337cc572162c

W01 post-release result
= PASS WITH NOTES
= specification release independently verified
```

This closes only the PR #59 specification-release verification. It does not verify Phase 0 external prerequisites, WAF containment, first-Live behavior, paid entitlement/quota/provider/financial behavior, or AC-30.

---

# 7. Known / Inferred / Unknown

## Known

- deterministic free-core operation remains independent of the disabled paid path;
- Astra launch hardening is Sprint Complete / Production Verified;
- Production paid Architecture Review remains disabled / fail-closed at the last inspected Production state relevant to the prior decision;
- commercial activation is explicitly deferred while its safety requirements remain preserved;
- PAUC AC-30 remains incomplete and Paid Access Production Verified remains NO;
- `AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1` is now Specified and routes to C01;
- the specification retains the current hard/safety evaluation and adds deterministic quality/stability measurement contracts;
- A–J seed annotations remain candidate unless real human review provenance is present;
- Gate A and Gate B are not reached; Stage 2 is not selected;
- AI Authority and Mutation Authority are unchanged;
- the current Architecture Review formal evidence has 30 successful reviews, 210/210 current semantic checks, and zero hard violations;
- the current evaluator scoring does not yet establish gold-set precision/recall, false-positive/false-negative behavior, or top-issue agreement;
- the current A–J fixture set does not provide representative large-workflow scale evidence.

## Inferred

- implementing the benchmark/gold foundation first is the smallest way to determine whether the next real dependency is evaluator quality, context, navigation, or scale;
- commercial activation can remain deferred without creating a new core architecture dependency because the selected benchmark foundation and deterministic free core do not require public paid enablement.

## Unknown / evidence-dependent

- actual issue precision/recall on human-approved benchmark annotations;
- good-workflow false-positive rate and flawed-workflow false-negative behavior;
- top-issue priority agreement and material finding stability;
- how many A–J annotations will achieve human-approved-gold status and whether new fixtures are later needed after measured evidence;
- large-workflow quality/latency/failure behavior and the size at which scoped/hierarchical evaluation would become necessary;
- whether persisted Intent/Constraints materially improves evaluator correctness;
- whether provider-backed Review Workspace/Locate is a meaningful usability bottleneck;
- commercial-use hosting eligibility and the rest of the Phase 0 activation evidence;
- actual Live entitlement/quota/provider/financial behavior;
- eventual commercial activation timing.

Unknown means insufficient evidence, not evidence of absence.

---

# 8. Snapshot discipline

Update this file only when a small number of stable coordination facts materially change: top-level lifecycle, blocker, authority state, or scoped release evidence needed to disambiguate current coordination.

Do not duplicate latest mutable main/deployment identity, Phase-by-phase execution plans, item-level prerequisite matrices, full risk definitions, packet AC, roadmap stages, commercial architecture, transient Preview deployments, or historical chat narratives. Those belong to live systems or their canonical owners.
