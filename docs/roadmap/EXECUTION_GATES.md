# AgentGraph Studio — Execution & Promotion Gates

Status: **Authoritative cross-stage execution governance**  
Scope: Stage entry/exit criteria, promotion decisions, evaluator authority expansion, evidence requirements, safe-transformation scope, and roadmap execution discipline.

This document turns the long-term roadmap into an executable development program. It does **not** expand an active implementation packet.

Supporting execution documents:

- `docs/roadmap/PROGRAM_BOARD.md` — current milestone/candidate/blocker coordination and Stage 1.5 trigger matrix
- `docs/roadmap/RISK_REGISTER.md` — durable program risks and escalation state
- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md` — Definition of Ready, version lifecycle, traceability, operational-quality maturity, repository/docs enforcement
- `docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md` — designed-expectation and later verification contract

## 0. Source-of-truth rule

Priority remains:

1. latest GitHub `main` / repository reality
2. latest Vercel Production / actual Production behavior
3. active packet under `docs/specs/`
4. `docs/PRODUCT_MASTER.md`
5. `docs/ARCHITECTURE.md`
6. `docs/roadmap/MASTER_ROADMAP.md`
7. this document for stage promotion / execution-gate decisions
8. relevant cross-stage plans/contracts
9. `docs/roadmap/PROGRAM_BOARD.md` for near-term coordination
10. historical plans/chats

A roadmap stage is not implementation scope until work is explicitly **Selected** and **Specified**.

Before a packet advances to implementation, apply the Definition of Ready in `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`.

---

# 1. Why gates exist

AgentGraph Studio contains capabilities whose authority and migration cost increase over time. A stage must therefore advance because prerequisites are demonstrated, not because the previous stage number was completed.

Use this model:

```text
Stage work
→ measurable evidence
→ gate review
→ explicit decision
→ next Selected packet
```

Possible gate outcomes:

- `PROCEED`
- `PROCEED_WITH_CONDITIONS`
- `HARDEN_FIRST`
- `FOUNDATION_FIRST`
- `DEFER`

Every non-trivial promotion decision should record:

- evidence reviewed
- known limitations
- decision
- rationale
- dependency impact
- approved AI authority envelope where applicable
- approved mutation scope where applicable
- follow-up requirement

Material durable decisions belong in `docs/decisions/`.

---

# 2. Gate A — Stage 1 Evaluation Trust & Scale

Applies after **Stage 1 — Evidence-Grounded AI Architecture Review** reaches Production Verified and enough evaluation evidence exists.

Required review dimensions:

## Structural safety

- hard contract violations
- invalid Evidence/target acceptance
- Known/Inferred/Unknown violations
- prompt-injection obedience
- silent mutation behavior
- provider-failure isolation
- schema/runtime validation failures

Direction: accepted hard violations in the defined release benchmark must remain **zero**.

## Semantic quality

Track with a versioned expert-annotated dataset where available:

- issue precision
- issue recall
- false-positive rate on intentionally good workflows
- false-negative rate on intentionally flawed workflows
- top-1 and top-k priority agreement with expert judgement
- severity/priority calibration
- recommendation usefulness/safety
- strength recognition
- uncertainty preservation

## Stability

Measure repeated runs and semantics-preserving variants:

- material finding stability
- priority stability
- layout-only invariance
- irrelevant ordering/renaming invariance where semantically appropriate

## Scale / reliability

Benchmark multiple topology and size tiers, including approximately 10 / 50 / 100 / 250 / 500+ nodes as benchmark sizes rather than hard limits:

- Evidence bytes/items
- provider input size
- latency
- timeout/error rate
- structured-output failure rate
- semantic quality degradation
- partial/scoped/full-review behavior

No silent truncation is permitted.

## Threshold policy

Do **not** invent permanent numeric promotion thresholds before the gold dataset and expert process are sufficiently mature.

Thresholds must be:

- versioned
- tied to a named dataset/rubric
- based on enough samples to be decision-useful
- reviewed when model/prompt/rubric changes materially
- recorded as `Provisional` or `Calibrated`

The current packet's live-eval target is a release signal for that packet, not automatically the permanent Stage 2 authority threshold.

Operational latency/failure targets follow the maturity model in `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`:

```text
UNMEASURED
→ BASELINED
→ PROVISIONAL_TARGET
→ CALIBRATED_TARGET
→ ENFORCED / ALERTED where justified
```

Gate A may select:

- direct quality hardening
- scale foundation
- Search / Locate / Scoped Evidence foundation
- Adoption & Context work that increases first value without expanding AI mutation authority
- a combined minimal dependency Sprint

---

# 3. Stage 1.5 — Adoption & Context Foundation selection band

Stage 1.5 is a **planned selection band**, not one mandatory monolithic Sprint.

Candidate capabilities:

- CrewAI existing-project static import / semantic mapping
- Project / Local Workspace foundation
- persisted Intent & Constraints
- Scenario / Acceptance foundation when explicit designed expectations are a measured dependency
- dedicated Review Workspace / finding navigation
- revision/evaluation-history foundation

Selection rule:

Choose only the smallest set that materially improves one or more of:

- Access to first value
- evaluator context
- repeat use after workflow change
- migration leverage for later safe transformation
- review understandability
- explicit expected-behavior context needed for later verification

Use the trigger matrix in `docs/roadmap/PROGRAM_BOARD.md`; do not select a candidate merely because it appears in the roadmap.

Stage 1.5 work may proceed even when evaluator authority is not yet ready for Stage 2, provided it does not silently expand AI authority.

Required boundaries:

- no speculative Graph V2 rewrite
- no hidden cloud lock-in
- no direct semantic AI apply
- imported dynamic/unsupported behavior remains Unknown or explicitly lossy
- revision-compatible identity should be preferred where it reduces later migration cost
- configured Scenario/Acceptance expectations must not be represented as observed runtime truth

---

# 4. Gate B — Evaluator Authority Expansion

Required before Stage 2 materially increases automated recommendation authority.

Gate B reviews:

- Gate A quality evidence and current limitations
- false-positive control on known-good workflows
- top-issue prioritization quality
- stability under repeated runs
- whether intent/context/scenario quality is sufficient for the planned proposal scope
- whether proposal claims can be evidence-grounded
- whether revision/provenance foundations are sufficient for traceability
- whether large-workflow scope limitations are disclosed

Decision question:

> Is the reviewer reliable enough that users should reasonably act on its structured improvement proposals **inside the proposed authority scope**?

If not, select evaluator/context hardening instead of mechanically entering Stage 2.

## 4.1 AI Authority Envelope

AI authority must be approved by capability class, not treated as one global on/off switch.

Use the following durable authority levels as a planning vocabulary:

- `AE0 — Explain`: explain existing deterministic Evidence / limitations; no new architecture judgement required
- `AE1 — Review`: evidence-grounded strengths/findings/priorities; advisory only
- `AE2 — Architecture Proposal`: propose changes to agent/task/dependency/output architecture; no executable patch
- `AE3 — Resource/Tool/Model Proposal`: recommend tool/model/resource changes whose external properties may require structured/external evidence
- `AE4 — Security/Control Proposal`: recommend permission, approval, sensitive-data, policy, or side-effect controls; requires appropriate capability/policy evidence
- `AE5 — Architecture Patch`: generate/apply-approved semantic patches limited to an explicitly approved architecture-only mutation scope under Gate C
- `AE6 — Side-effect-sensitive Patch`: semantic patches that can change external mutation, credentials, sensitive data, approval/policy, or consequential tool behavior; requires stronger capability/control prerequisites in addition to Gate C

Rules:

1. Approval of a higher level for one capability class does not automatically approve unrelated classes.
2. Stage 2 normally begins with `AE2` inside a defined scope; it does not automatically authorize `AE3` or `AE4`.
3. `AE5`/`AE6` require Gate C and an explicit mutation-scope decision.
4. Benchmark evidence must match the authority being granted. Good architecture-review quality alone is not evidence that security/tool recommendations are reliable.
5. Unknown external/runtime/provider properties remain Unknown unless supported by appropriate evidence.
6. A gate record must state the approved envelope, e.g. `AE2: agent/task/dependency architecture only`.

This envelope prevents evaluator authority from expanding faster than measured trust in the specific type of decision.

---

# 5. Gate C — Safe Transformation Readiness

Required before Stage 3 allows semantic workflow mutation.

Mandatory prerequisites:

- trustworthy upstream finding/proposal contract
- immutable revision identity or deterministic stale-detection equivalent
- versioned Semantic Patch contract
- patch schema validation
- base-revision validation
- structural/semantic validation
- before/after deterministic analysis
- policy/compatibility validation where relevant
- semantic diff preview
- transactional apply
- failure leaves source unchanged
- user selection/approval
- rollback/undo direction

Required invariant:

```text
Finding
→ Proposal
→ Patch
→ Validation
→ Before / After
→ User Apply
→ New Revision
```

Patch safety does not compensate for poor upstream evaluation quality.

## 5.1 Mutation scope is separate from pipeline safety

Passing the generic patch pipeline does **not** authorize every semantic operation.

Gate C must record an explicit allowed mutation scope.

### Architecture-only mutation scope

This may be selected first when its upstream evaluation/proposal evidence is sufficient. Typical examples include, subject to the active packet:

- agent/task architecture changes
- responsibility boundary changes
- dependency/context relationship changes
- assignment changes
- output-contract changes
- other semantic operations that do not themselves introduce or change consequential external capabilities

Even architecture-only changes remain user-controlled and must pass revision/validation/before-after requirements.

### Side-effect-sensitive mutation scope

Treat as a stronger boundary when a patch can change or introduce, for example:

- external mutation capability
- credential access
- sensitive-data access/disclosure
- filesystem/network authority where consequential
- human-approval requirements
- policy/security boundaries
- tool bindings whose capabilities are not sufficiently Known
- irreversible or high-impact effects

Do not authorize this scope solely because architecture patch mechanics are safe.

Before side-effect-sensitive mutation, the selected packet must define sufficient structured capability/human-control/policy evidence and enforcement/validation boundaries. A minimal capability/control foundation may therefore be pulled forward before the full later Security & Policy Engineering stage when required as a prerequisite.

Unknown/custom tool capability must not be optimistically treated as safe.

## 5.2 Recommended Stage 3 sequencing

Preferred default:

```text
Gate C pipeline readiness
→ AE5 Architecture-only Safe Transformation
→ measure transformation quality/safety
→ introduce capability/human-control foundation as required
→ explicit approval for AE6 Side-effect-sensitive Transformation
```

This is a safety/dependency boundary, not a requirement to split the public roadmap into new numbered stages.

---

# 6. Gate D — Large Workflow claim readiness

Do not claim generic "large workflow support" from payload acceptance alone.

Before such a claim, document:

- tested size/topology tiers
- full vs scoped review limits
- semantic quality by tier
- navigation usability
- latency/failure behavior
- any unsupported tier
- no-silent-truncation behavior

If monolithic evaluation is insufficient, prefer:

```text
Deterministic Global Scan
→ Relevant Region/Subgraph Selection
→ Local Evaluation
→ Cross-region Analysis
→ Global Synthesis
```

Scoped review must disclose scope.

---

# 7. Gate E — Framework expansion

Before a second major target framework:

- Target Capability Contract exists
- Lossiness Contract exists
- current CrewAI behavior remains strong
- canonical semantic boundaries are sufficient
- unsupported semantics are explicit
- migration does not rely on scattered framework-name conditionals

Preferred sequence:

```text
Target Capability
→ Lossiness
→ Canonical Boundaries
→ Minimal Framework-neutral IR
→ CrewAI through IR
→ second target
```

---

# 8. Gate F — Collaboration / Enterprise expansion

Substantial collaboration/governance should not outrun individual engineering value.

Before major Team/Enterprise scope, verify that the underlying individual contracts are mature enough:

- workflow/project identity
- revision/history
- evaluation provenance
- policy/capability contracts where relevant
- privacy/data governance
- access-control model
- auditability

Collaboration is not a prerequisite for local/user-owned value.

---

# 9. Sprint selection scorecard

For each candidate Sprint, evaluate:

1. North Star user value
2. dependency criticality
3. architectural leverage
4. migration cost avoided by doing it now
5. simplest sufficient solution
6. evidence-groundability
7. human control/safety
8. portability/user ownership
9. Production regression risk
10. evaluation trust impact
11. access to first value
12. repeat-use value
13. scale relevance
14. governance/defensibility relevance
15. demand dependence
16. whether the required AI authority envelope is actually supported by evidence
17. whether the proposed mutation scope depends on capability/security foundations not yet present
18. whether Scenario/Acceptance context is required to judge correctness

Marketing novelty and feature count must not dominate this scorecard.

Before specification, also pass the Definition of Ready in `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`.

---

# 10. Promotion record template

For a gate decision, record at minimum:

```text
Gate:
Date:
Repository main SHA:
Production SHA/status:
Evidence set / benchmark version:
Known limitations:
Decision:
Approved AI authority envelope (if applicable):
Approved mutation scope (if applicable):
Rationale:
Selected next packet or action:
Conditions / follow-ups:
Risk IDs affected:
```

Do not treat a historical promotion record as current repository state; live GitHub/Vercel reality always wins.

Update `docs/roadmap/PROGRAM_BOARD.md` and `docs/roadmap/RISK_REGISTER.md` when a material gate decision changes near-term sequencing or risk state.
