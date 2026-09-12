# AgentGraph Studio — Execution & Promotion Gates

Status: **Authoritative cross-stage execution governance**  
Scope: stage entry/exit, promotion, AI authority, mutation authority, evidence requirements, and roadmap execution discipline.

This document makes the roadmap executable. It does **not** expand an active packet.

Supporting authorities:

- `docs/roadmap/PROGRAM_BOARD.md` — current execution/blocker coordination
- `docs/roadmap/RISK_REGISTER.md` — durable program risks
- `docs/DEVELOPMENT_RULES.md` — Definition of Ready, version lifecycle, traceability, operational-quality maturity, repository/docs enforcement
- `docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md` — designed expectation vs verification

## 0. Source-of-truth and execution rule

When information conflicts, use:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ Product Master
→ Architecture
→ Development Rules / applicable Security & Data baselines
→ Master Roadmap
→ Execution Gates
→ relevant specialized plans/contracts
→ Program Board / Risk Register
→ Current State snapshot
→ ADR / historical Chat / Work / Codex / old SHAs
```

Historical chats, old SHAs, and compatibility paths are evidence/history, not current authority.

A roadmap stage becomes implementation scope only after explicit **Selected → Specified**. Stage order is dependency direction, not an automatic queue:

```text
Stage work
→ Evidence
→ Gate Review
→ Explicit decision
→ Selected packet
```

Gate outcomes may be `PROCEED`, `PROCEED_WITH_CONDITIONS`, `HARDEN_FIRST`, `FOUNDATION_FIRST`, or `DEFER`. Material durable promotion decisions belong in `docs/decisions/`.

Before implementation, apply the Definition of Ready in `docs/DEVELOPMENT_RULES.md`.

---

# 1. Gate A — Evaluation Trust & Scale

Applies after Stage 1 Architecture Review reaches Production Verified and enough evaluation evidence exists. Evidence preparation does not pass the gate, close Stage 1, relax paid-access/AC-30 requirements, or select future work. While launch prerequisites are blocked, `01` may inventory existing evaluation evidence and identify gaps; that does not itself authorize provider spending, a new packet, or stronger authority.

Review at minimum:

- **Structural safety:** zero accepted hard contract violations in the defined release benchmark; invalid Evidence/targets, Known/Inferred/Unknown violations, prompt-injection obedience, silent mutation, failure isolation, and schema/runtime validation.
- **Semantic quality:** versioned expert-annotated evidence where available; issue precision/recall, good-workflow false positives, flawed-workflow false negatives, top-1/top-k priority agreement, severity calibration, recommendation usefulness/safety, strength recognition, uncertainty preservation.
- **Stability:** repeated runs and semantics-preserving variants, including layout-only and irrelevant ordering/renaming invariance where appropriate.
- **Scale/reliability:** representative topology/size tiers around 10/50/100/250/500+ nodes as benchmark sizes, not product limits; Evidence/input size, latency, timeout/error rate, structured-output failure rate, semantic degradation, and full/scoped-review behavior. Silent truncation is prohibited.

Permanent promotion thresholds must not be invented before the dataset/rubric is mature. Thresholds are versioned, tied to a named dataset/rubric, based on decision-useful samples, reviewed after material evaluator change, and labeled `Provisional` or `Calibrated`. A packet-specific live-evaluation target is a release signal for that packet, not automatically the permanent threshold for stronger AI authority.

Operational quality follows `docs/DEVELOPMENT_RULES.md`:

```text
UNMEASURED
→ BASELINED
→ PROVISIONAL_TARGET
→ CALIBRATED_TARGET
→ ENFORCED / ALERTED where justified
```

Gate A may select quality hardening, scale foundation, Search/Locate/Scoped Evidence, Adoption & Context foundation, or the smallest coherent combined dependency packet. Commercial sample sufficiency for M0 is not a prerequisite for independently justified evaluator hardening.

---

# 2. Stage 1.5 — Adoption & Context Foundation selection band

Stage 1.5 is a **selection band**, not one mandatory Sprint. Candidate threads include:

- CrewAI existing-project static import / semantic mapping
- Project / Local Workspace foundation
- persisted Intent & Constraints
- Scenario / Acceptance foundation when measured evidence shows it is required
- Review Workspace / finding navigation
- revision/evaluation-history foundation

Select only the smallest set that materially improves first value, evaluator context, repeat use, migration leverage, review understandability, or explicit expected-behavior context. Record an explicit selection in `docs/roadmap/PROGRAM_BOARD.md`; appearing in the roadmap is not selection.

Required boundaries remain: no speculative Graph V2, hidden cloud lock-in, direct semantic AI apply, or fabricated dynamic/imported facts. Unsupported/dynamic import behavior remains Unknown or explicitly lossy. Configured expectations are not observed runtime behavior. Prefer revision-compatible identity where it reduces later migration cost.

Stage 1.5 may proceed before stronger evaluator authority if the selected packet does not silently expand that authority.

---

# 3. Gate B — Evaluator Authority Expansion

Before Stage 2 materially increases recommendation authority, review Gate A evidence plus false-positive control, prioritization quality, repeated-run stability, intent/context sufficiency, evidence-groundability, revision/provenance, and disclosed large-workflow limitations.

Decision question:

> Is the evaluator reliable enough that users should reasonably act on structured proposals inside the proposed authority scope?

If not, select evaluator/context hardening instead of Stage 2.

## 3.1 AI Authority Envelope

Authority is capability-scoped:

- `AE0 — Explain`: explain existing deterministic Evidence/limitations.
- `AE1 — Review`: advisory evidence-grounded strengths/findings/priorities.
- `AE2 — Architecture Proposal`: propose agent/task/dependency/output architecture changes; no executable patch.
- `AE3 — Resource/Tool/Model Proposal`: recommendations whose external properties require suitable evidence.
- `AE4 — Security/Control Proposal`: permission/approval/data/policy/control recommendations requiring appropriate capability evidence.
- `AE5 — Architecture Patch`: architecture-only semantic patch scope after Gate C and explicit mutation approval.
- `AE6 — Side-effect-sensitive Patch`: stronger scope affecting consequential capabilities; requires Gate C plus stronger control evidence.

A higher level for one capability class does not authorize unrelated classes. Stage 2 normally begins with a defined `AE2` scope, not automatic AE3/AE4. AE5/AE6 require Gate C. Benchmark evidence must match the authority granted. Unknown external/runtime/provider properties remain Unknown without suitable evidence.

Every material gate record states the approved envelope.

---

# 4. Gate C — Safe Transformation Readiness

Required before semantic workflow mutation. Mandatory prerequisites:

- trustworthy upstream finding/proposal
- immutable revision identity or deterministic stale detection
- versioned Semantic Patch
- patch/base-revision/structural/semantic validation
- before/after deterministic analysis
- policy/compatibility validation when applicable
- semantic diff preview
- transactional apply; failure leaves source unchanged
- explicit user selection/approval
- rollback/undo direction

Invariant:

```text
Finding
→ Proposal
→ Patch
→ Validation
→ Before / After
→ User Apply
→ New Revision
```

Patch safety does not compensate for poor upstream evaluation.

## 4.1 Mutation scope is separate from pipeline safety

Gate C records the allowed mutation scope. Passing the patch pipeline does not authorize every operation.

**Architecture-only scope** may include agent/task responsibility, dependency/context, assignment, and output-contract changes that do not themselves introduce consequential external capabilities. These changes remain user-controlled and still require revision, validation, before/after, and apply safeguards.

**Side-effect-sensitive scope** includes changes that can alter consequential external actions, sensitive access/disclosure, approval/policy boundaries, insufficiently known tool capabilities, or irreversible/high-impact effects. Do not authorize this scope from architecture-patch mechanics alone. Introduce the minimum structured capability/human-control/policy evidence first; Unknown custom-tool capability is not assumed safe.

Preferred sequencing:

```text
Gate C pipeline readiness
→ AE5 Architecture-only Safe Transformation
→ measure quality/safety
→ capability/human-control foundation as required
→ explicit AE6 decision
```

---

# 5. Later promotion gates

## Gate D — Large Workflow claim readiness

Do not claim generic large-workflow support from payload acceptance. Document tested size/topology, full vs scoped review limits, semantic quality, navigation usability, latency/failure behavior, unsupported tiers, and no-silent-truncation behavior. If monolithic review is insufficient, prefer deterministic global scan → relevant region selection → local evaluation → cross-region analysis → global synthesis. Scoped review must disclose scope.

## Gate E — Framework expansion

Before a second major target: Target Capability and Lossiness contracts exist, CrewAI remains strong, canonical boundaries are sufficient, unsupported semantics are explicit, and implementation does not devolve into scattered framework-name conditionals.

Preferred sequence:

```text
Target Capability
→ Lossiness
→ Canonical Boundaries
→ Minimal Framework-neutral IR
→ CrewAI through IR
→ second target
```

## Gate F — Collaboration / Enterprise expansion

Substantial collaboration must not outrun individual engineering value. Verify workflow/project identity, revision/history, evaluation provenance, applicable policy/capability contracts, privacy/data governance, access-control model, and auditability. Collaboration is not a prerequisite for local/user-owned value.

---

# 6. Sprint selection scorecard

For each candidate Sprint evaluate: North Star value; dependency criticality; architectural leverage; migration cost avoided; simplest sufficient solution; evidence-groundability; human control/safety; portability/ownership; Production regression risk; evaluation-trust impact; first-value access; repeat-use value; scale relevance; governance/defensibility relevance; demand dependence; whether evidence supports the requested AI authority envelope; whether mutation depends on missing capability/security foundations; and whether Scenario/Acceptance context is required.

Marketing novelty and feature count must not dominate. Before specification, apply `docs/DEVELOPMENT_RULES.md` Definition of Ready.

---

# 7. Promotion record

Every non-trivial gate decision records at minimum:

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

Update Program Board and Risk Register when a material gate decision changes near-term sequencing or risk state. A historical promotion record never replaces live GitHub/Vercel evidence.
