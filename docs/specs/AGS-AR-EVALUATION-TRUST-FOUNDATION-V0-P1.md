# AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1 — Architecture Review Evaluation Trust Foundation v0

Status: **Selected**  
Selection owner: `01 — Product Architecture & Roadmap`  
Next owner: `02 — UX & Implementation Specification`  
Selected: **2026-09-13**  
Decision: `docs/decisions/ADR-0012-select-architecture-review-evaluation-trust-foundation.md`

This packet records the selected Product scope only. It is **not implementation-ready** until `02` completes the specification and moves it to `Specified`.

---

# 0. Product objective

Establish a versioned, reproducible Architecture Review benchmark foundation that can measure semantic evaluation quality rather than treating structurally valid, evidence-grounded output as sufficient proof of evaluator trust.

Target distinction:

```text
Valid grounded review
≠
Correct and well-prioritized review
```

This Sprint should improve the evidence available for Product/Gate decisions without expanding the evaluator's current authority.

---

# 1. Selection evidence

Current Architecture Review evidence includes a recovered full live-evaluation run with:

- 10 synthetic fixtures A–J;
- 3 runs per fixture;
- 30 successful reviews;
- 210 / 210 current semantic rubric checks;
- zero hard violations.

The current evaluator harness is useful release-safety evidence, but its quality rubric is intentionally shallow relative to the durable Evaluation Trust contract. The current semantic checks cover items such as valid Evidence references, valid targets, knowledge discipline, explanation presence, high-level direction, and fixture focus terms. The current fixture set is also small; the largest current fixture contains eight nodes.

Missing measured evidence includes:

- issue precision / recall against curated expected issues;
- good-workflow false-positive behavior;
- flawed-workflow false-negative / issue-coverage behavior;
- top-1 / top-k issue-priority agreement;
- strength recognition against annotated expectations;
- calibrated handling of acceptable alternative interpretations;
- repeated-run material-finding stability;
- semantics-preserving variant stability.

The selected packet addresses this measurement foundation before stronger evaluator authority is considered.

---

# 2. Included scope for `02`

`02` must produce the smallest implementation-ready specification covering the following capability.

## 2.1 Versioned benchmark dataset / rubric

Define a repository-owned, privacy-safe, versioned benchmark contract with:

- dataset version;
- rubric version;
- fixture identity/provenance;
- annotation provenance/review status;
- explicit support for acceptable alternative interpretations and human disagreement;
- deterministic validation of the dataset/annotation shape.

Existing A–J fixtures may be reused or migrated where useful, but must not be silently relabeled as expert gold without the required annotations/review provenance.

## 2.2 Gold annotation model

The annotation contract must be capable of representing, where applicable:

- expected strengths;
- expected issues;
- acceptable alternative issue formulations;
- expected priority / top issue where uniquely justified;
- required Evidence and target support;
- claims that must remain `Unknown`;
- acceptable recommendation directions;
- unsafe / unsupported recommendation directions.

Do not force a unique answer where multiple architectures or interpretations are valid.

## 2.3 Minimum benchmark classes

The v0 benchmark must cover a coherent minimum set spanning:

- intentionally good / simple-sufficient workflows;
- deliberately flawed workflows;
- ambiguous workflows;
- multiple-valid-design workflows;
- adversarial / prompt-injection workflows.

`02` owns the exact number and fixture composition, subject to reproducibility and smallest-sufficient scope.

## 2.4 Quality metrics / scoring foundation

Specify deterministic scoring/report aggregation capable of measuring, when annotations support the metric:

- existing hard violations;
- issue precision;
- issue recall / issue coverage;
- good-workflow false positives;
- flawed-workflow false negatives;
- top-1 / top-k priority agreement;
- strength recognition;
- uncertainty / `Unknown` preservation;
- material-finding stability across repeated runs.

Matching semantics must be explicit. Do not depend on an unbounded second LLM judge merely to determine whether the benchmark passed unless separately justified and governed.

## 2.5 Semantics-preserving stability foundation

Specify how the benchmark represents transformations or variants that should preserve architecture conclusions under the current semantic model, including at least layout-only changes where supported.

The Product must not claim stability merely because the same workflow was run several times. The benchmark must distinguish repeated-run stability from representation-invariance where practical.

## 2.6 Reproducible benchmark reporting

Reports should carry enough governed metadata to compare runs, including as applicable:

- dataset/rubric version;
- reviewer/evaluator/prompt/model version;
- fixture identity;
- topology / node-edge counts;
- Evidence/input size where deterministically available;
- per-metric results;
- hard violations;
- aggregate results;
- run count and completion/failure state.

Exact schemas and storage location are owned by `02`.

## 2.7 Provider-independent testability

Dataset validation, scorer logic, metric aggregation, and report validation must be testable without a live provider.

Any live/provider-backed benchmark remains:

- explicit;
- bounded;
- budget-aware;
- governed by existing provider/data rules;
- separate from normal provider-free deterministic core operation.

Selection of this packet does not itself authorize new provider spend.

---

# 3. Deferred

The following are valid future directions but are **not selected in this packet**:

- 50 / 100 / 250 / 500+ node provider-backed scale benchmark execution;
- scoped / hierarchical Architecture Review implementation;
- broad large-workflow Search / Filter / Outline features;
- dedicated Architecture Review Workspace redesign;
- expanded finding Locate/Focus UX beyond changes proven necessary by this packet;
- Project / Local Workspace identity;
- persisted Intent & Constraints;
- revision / evaluation history;
- Scenario / Acceptance persistence;
- generic multi-framework evaluation.

The report/data model may carry size/topology metadata so future scale work can reuse it, but this packet must not claim large-workflow support or select a scale solution by implication.

---

# 4. Out of scope / authority boundaries

No:

- Stage 2 Guided Improvement;
- stronger AI recommendation authority;
- automatic alternative architecture generation;
- Semantic Patch generation;
- Apply / semantic mutation;
- Mutation Authority expansion;
- production evaluator/provider/model/prompt changes solely to improve benchmark scores;
- public 0–100 architecture score;
- unsupported quality superlatives;
- Graph/Workflow major-version migration;
- Project/Workspace/cloud/team persistence;
- managed runtime / hosted execution;
- arbitrary imported-code execution;
- framework-expansion claim;
- Stripe Live activation;
- Vercel account/plan mutation;
- Firewall/WAF mutation;
- first-Live execution;
- PAUC AC-30 execution;
- public paid enablement.

Preserve:

```text
Evidence Before Intelligence
Known / Inferred / Unknown
Deterministic facts remain deterministic-owned
Configured expectation ≠ Static evidence ≠ Observed runtime behavior
Visual Group ≠ Semantic Module ≠ Runtime Orchestration
Proposal ≠ Mutation
```

AI Authority: **UNCHANGED**.  
Mutation Authority: **UNCHANGED**.

---

# 5. Commercial lifecycle relationship

The Stage 1 Paid Access lifecycle remains:

```text
OPEN / FAIL-CLOSED / DEFERRED ACTIVATION
```

This packet does not close, replace, or weaken the commercial lifecycle.

Existing requirements remain authoritative for eventual resumption, including:

- Phase 0 external prerequisites;
- QA-only containment;
- first-Live procedure;
- kill-switch / cost-guard proof;
- PAUC AC-30;
- independent Production verification.

Commercial activation resumes only through a later explicit priority decision. Completion of this packet does not automatically authorize Live billing or paid Production.

---

# 6. Gate relationship

This is a Product foundation packet that can prepare future Gate evidence.

It does **not** mean:

```text
Gate A = passed
Gate B = passed
Stage 2 = selected
```

Current state remains:

```text
Gate A = NOT REACHED
Gate B = NOT REACHED
Stage 2 = NOT SELECTED
AI Authority = UNCHANGED
Mutation Authority = UNCHANGED
```

`02` must not invent permanent Gate thresholds in the implementation specification. Any later threshold decision belongs to the applicable Product/Gate authority and must be grounded in a versioned dataset/rubric plus observed evidence.

---

# 7. Definition of Ready target for `02`

Before moving this packet to `Specified`, `02` should make the following implementation-ready:

- exact dataset and annotation schemas;
- exact issue/strength matching semantics;
- metric definitions and denominator/edge-case behavior;
- repeated-run and semantics-preserving stability definitions;
- initial fixture/annotation set and provenance rules;
- offline validation/scorer test matrix;
- live benchmark execution boundary, if any;
- budget/abort/failure handling for provider-backed runs, if any;
- report schema/versioning;
- migration/compatibility with the existing A–J release-evaluation harness;
- privacy/data-handling boundaries;
- Acceptance Criteria and requirement traceability;
- explicit Deferred / Out of Scope enforcement.

If 02 discovers that a Product decision is genuinely required—for example, a benchmark concept cannot be defined without selecting persisted Intent, Workspace identity, or a new AI judge authority—it must return that issue to `01` rather than silently expanding scope.

---

# 8. Expected lifecycle

```text
01 Selected
→ 02 Specified
→ C01 Implementation Complete
→ W01 Independent QA / QA Complete
→ C01 exact approved release
→ W01 Production Verified where changed Production behavior exists
→ 00 Sprint Complete
→ 01 Evidence / Gate Review / Explicit Next Selection
```

The packet is currently only at **Selected**.
