# AgentGraph Studio — Master Roadmap

Status: **Authoritative long-term sequencing**  
Roadmap stages express dependency order and product direction, not guaranteed dates.

Execution/promotion governance is defined in:

- `docs/roadmap/EXECUTION_GATES.md`

Evaluation-quality/scale direction is defined in:

- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`

Commercial/adoption sequencing is defined in:

- `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`

## 0. Source-of-truth rule

The current active packet under `docs/specs/` defines the implementation scope of the current Sprint. This roadmap must not be used to pull later-stage features into the current packet.

Stage status terms:

- Current Product
- Planned
- Long-term Vision
- Conditional / Business Validation Required

When a stage completes, the next stage is **not automatically selected**. Use `docs/roadmap/EXECUTION_GATES.md`, current repository/Production reality, and measured evidence.

---

# 1. Roadmap Logic

The roadmap is derived from the Product North Star:

```text
Understand
→ Evaluate
→ Improve
→ Verify
→ Own
```

The sequencing principle is:

1. establish reliable deterministic facts
2. make architecture understandable/evaluable and establish measurable trust in the evaluator
3. resolve evaluation quality/scale limits before expanding authority
4. strengthen adoption/context foundations where they materially improve first value, evaluator context, repeat use, or migration leverage
5. create architecture proposals, including improvement directions or new-workflow drafts, only as evaluator/proposal authority is justified
6. make semantic changes safe and reviewable
7. scale navigation/evaluation to larger workflows as required
8. add policy/security boundaries
9. make architecture reusable/composable
10. compile/package for user ownership
11. incorporate runtime evidence
12. evaluate behavior, not only static design
13. generalize target compilation
14. add collaboration/distribution only where product value is validated

Operational execution model:

```text
Stage 0 — Deterministic Foundation
↓
Stage 1 — Evidence-Grounded Architecture Review
↓
Gate A — Evaluation Trust & Scale
↓
Stage 1.5 — Adoption & Context Foundation selection band
↓
Gate B — Evaluator Authority Expansion
↓
Stage 2 — Guided Improvement
↓
Gate C — Safe Transformation Readiness
↓
Stage 3 — Safe Transformation
↓
Later stages / gates as dependencies justify
```

Stage 1.5 is not one mandatory mega-Sprint. It is a planned selection band from which the smallest coherent foundation packet(s) should be selected.

---

# Stage 0 — Deterministic Foundation

Status: **Current Product / Completed foundation**

Core capabilities include:

- Visual Workflow Builder
- templates
- JSON portability/import/export
- deterministic CrewAI Python export
- Readiness
- Execution Preview
- Resource Analysis
- Unified Preflight Review
- first-value activation/measurement infrastructure

Purpose:

Create a deterministic engineering baseline that later AI reasoning can cite rather than recreate.

Exit condition:

Users can design/import a workflow and inspect structured deterministic readiness, execution structure, and resource implications before export/run.

---

# Stage 1 — Evidence-Grounded AI Architecture Review

Status: **Planned / current selected major milestone; packet status controls actual implementation state**

Primary value:

```text
Understand → Evaluate → early Improve guidance → Verify
```

Core capabilities:

- versioned Evidence Contract derived from deterministic analysis
- structured AI Architecture Review
- evidence-grounded findings
- Known / Inferred / Unknown
- deterministic / heuristic / external-dependent separation
- strengths and prioritized weaknesses
- problem / why / evidence / recommendation
- review limitations/unknowns
- server-side provider integration
- provider failure isolation
- Architecture Review UX
- evaluation benchmark/regression harness

Current authoritative packet:

- `docs/specs/AGS-EGAI-AR-V0-P1.md`

Important scope discipline:

Current v0 intentionally defers direct mutation, Semantic Patch, Apply, persisted top-level Workflow Intent, runtime tracing, framework-neutral compilation, marketplace, and large-workflow navigation/scale work not explicitly included in the packet.

Exit condition:

A user can explicitly request an architecture-level review and understand the most important strengths, weaknesses, uncertainties, and justified improvement direction without AI inventing deterministic facts or modifying the workflow.

Stage 1 Production release is **not** itself permission to expand AI authority. Gate A follows.

---

# Gate A — Evaluation Trust & Scale

Status: **Planned decision gate; not automatically part of the current Stage 1 packet**

Primary purpose:

Determine what measured evaluator hardening/scale/context work is required before stronger automation authority.

Authoritative plans:

- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- `docs/roadmap/EXECUTION_GATES.md`

Key concerns:

- separate Evaluation Safety from Evaluation Quality
- grow from contract tests into expert-annotated gold datasets
- measure issue precision/recall and good-workflow false positives
- measure top-issue prioritization and repeated-run stability
- test adversarial and ambiguous architectures
- benchmark approximately 10 / 50 / 100 / 250 / 500+ node tiers as benchmark sizes, not product limits
- measure Evidence/input size, latency, timeout/failure behavior, and semantic quality by size
- introduce scoped/hierarchical evaluation when monolithic review is no longer sufficient
- prohibit silent truncation of large workflows
- determine when Search / Locate / Focus / Scoped Evaluation becomes an evaluator dependency
- avoid unsupported evaluator-superiority claims without reproducible comparative evidence

Decision outcomes may include:

- select Evaluation Quality hardening
- select Evaluation Scale foundation
- select Search/Locate/Scoped Evidence foundation
- select Adoption & Context foundation work that does not expand mutation authority
- select a combined minimal dependency Sprint
- when evidence and context are sufficient, proceed toward Gate B / Stage 2

Gate thresholds must be tied to a versioned dataset/rubric and must not be invented as permanent values before calibration is mature.

---

# Stage 1.5 — Adoption & Context Foundation

Status: **Planned selection band; evidence-driven, not one mandatory Sprint**

Primary value:

```text
Access first value faster
+
Understand with better context
+
Create legitimate repeat-use/revision foundations
```

Candidate capability threads:

- CrewAI existing-project static import / semantic mapping
- Project / Local Workspace identity and persistence foundation
- persisted Intent & Constraints
- dedicated Review Workspace / finding navigation / Locate improvements
- revision/evaluation-history foundation

Strategic reason:

The strongest adoption wedge is not requiring users to redraw existing systems before receiving value. Returning users also need stable project/workflow/revision context before later safe change and Review Delta become trustworthy.

Architecture references:

- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`

Selection discipline:

- do not implement all candidate threads at once by default
- select the smallest coherent packet that current evidence justifies
- do not create speculative Graph V2
- imported unsupported/dynamic behavior remains Unknown/inferred/lossy/unsupported rather than fabricated
- multi-workflow value must not require proprietary cloud lock-in
- Stage 1.5 does not silently grant direct AI mutation authority

`Describe New Workflow` / AI-assisted Architecture Drafting is **not** an authority-free Stage 1.5 default. It creates a new architecture proposal and therefore belongs under the scoped proposal-authority decision described at Gate B / Stage 2. Stage 1.5 may still reduce non-engineer first-value friction through import, templates, Review/Locate, Intent/Constraints, or other evidence-justified foundations without granting `AE2` merely for onboarding convenience.

Exit condition for a selected Stage 1.5 packet depends on that packet. The selection band as a whole is complete only when Product Architecture decides no further Adoption/Context prerequisite is required before Gate B/Stage 2.

---

# Gate B — Evaluator Authority Expansion

Status: **Planned decision gate**

Primary purpose:

Decide whether the evaluator is reliable and sufficiently contextualized for structured architecture proposals within a defined scope, including Guided Improvement and any separately selected new-workflow drafting capability.

Review at minimum:

- Gate A quality evidence/current limitations
- good-workflow false-positive control
- flawed-workflow issue coverage
- top-issue prioritization quality
- repeated-run stability
- intent/context quality for the proposal scope
- evidence-groundability of proposed recommendations
- revision/provenance sufficiency where an existing workflow is being changed
- large-workflow scope disclosure

Decision question:

> Is the reviewer/proposal system reliable enough that users should reasonably act on structured architecture proposals within the proposed scope?

If no, select evaluator/context hardening instead of mechanically entering Stage 2.

---

# Stage 2 — Guided Improvement

Status: **Planned**

Primary value:

```text
Evaluate → Improve
```

Capabilities:

- convert findings into structured Improvement Proposals
- multiple architecture alternatives where justified
- minimal-change vs reliability-first vs simplicity/resource options
- expected effects
- risks
- assumptions
- trade-offs
- proposal provenance
- AI-assisted new-workflow Architecture Drafting (`Describe New Workflow`) from declared Intent/Constraints when separately selected inside an approved `AE2` scope
- for new-workflow drafting, explain responsibilities, boundaries, assumptions, and important unknowns before user acceptance
- deterministically validate a proposed new workflow and run Architecture Review before treating the draft as an accepted workflow source

Preferred new-workflow drafting flow:

```text
Declared Intent / Constraints
→ AI Architecture Draft Proposal
→ Explain Responsibilities / Boundaries / Assumptions
→ Deterministic Validation
→ Architecture Review
→ User Accepts / Edits
→ Workflow Source
```

A draft is advisory until the user accepts it. No direct semantic apply to an existing workflow is authorized by this capability.

No direct semantic apply unless Stage 3 safety contracts are present.

Evaluation/proposal authority must not grow faster than measured trust. Gate B is a prerequisite for materially stronger automated recommendations or AI-assisted architecture drafting.

Exit condition:

Users can compare meaningful improvement directions and understand why they differ before any graph mutation. Where AI-assisted new-workflow drafting has been explicitly selected, users can also produce a reviewable, validated architecture proposal from declared intent without the product presenting the generated architecture as automatically correct.

---

# Gate C — Safe Transformation Readiness

Status: **Planned decision gate**

Required before semantic AI-supported apply.

Mandatory direction:

- trustworthy upstream finding/proposal
- semantic revision identity / stale detection
- versioned Semantic Patch
- base-revision validation
- structural/semantic validation
- before/after deterministic analysis
- policy/compatibility validation where relevant
- semantic diff preview
- transactional user-controlled apply
- failure leaves source unchanged

Authoritative gate details: `docs/roadmap/EXECUTION_GATES.md`.

---

# Stage 3 — Safe Transformation

Status: **Planned**

Primary value:

```text
Improve → Verify
```

Capabilities:

- workflow revision identity / stale detection
- Semantic Patch contract
- semantic diff
- patch validation
- structural/semantic validation
- before/after deterministic analysis
- before/after AI evaluation where appropriate
- risk classification
- selective user apply
- transactional apply
- revision history / undo direction

Required invariant:

```text
Proposal → Patch → Validation → Preview → User Apply
```

A safe patch pipeline does not compensate for a poor upstream finding. Trustworthy Finding → Justified Proposal remains a prerequisite for reliable transformation.

Exit condition:

AI-supported improvements can modify workflow semantics only through an explicit, reviewable, validated, reversible user-controlled path.

---

# Stage 4 — Large Workflow UX

Status: **Planned**

Primary value:

Make complex workflows understandable and evaluable without changing semantics merely for visualization.

Capabilities:

- Visual Group / Department
- nested grouping
- collapse/expand
- outline/tree navigator
- block/node search across relevant labels, roles, goals, task text, tool types, output contracts, groups, findings, and stable target identifiers where appropriate
- search/filter
- semantic zoom
- dependency path isolation
- issue-only view
- group-level finding/preflight summaries
- finding/search-result → target navigation
- Locate → Expand → Focus
- boundary-edge aggregation for collapsed groups
- explicit scoped review entry points where a future packet defines scoped Evidence/Evaluation contracts

Invariant:

```text
Visual Group ≠ Semantic Module ≠ Runtime Orchestration
```

Navigation/search scope must not silently become execution meaning. A scoped Architecture Review must identify itself as partial/scoped and must not imply conclusions about unreviewed regions.

Roadmap flexibility:

The full Stage 4 UX remains here. A lightweight Search / Locate / Scoped Evidence foundation may be selected earlier through Gate A/Stage 1.5 when measured evaluator scale or Review usability makes it a dependency.

Exit condition:

Large workflows remain navigable and evaluable while visual organization stays separate from execution meaning, and users can reliably locate findings/targets without scanning the entire canvas manually.

---

# Stage 5 — Security & Policy Engineering

Status: **Planned**

Primary value:

Evaluate consequential agent behavior with explicit capability and policy evidence rather than prompt-only judgement.

Capabilities:

- permission/capability model
- network/filesystem/external mutation/credential/sensitive-data metadata
- reversibility / impact scope
- built-in tool capability registry
- explicit Unknown for custom/unknown tools
- human-approval requirements
- policy packs
- `PASS / REVIEW / BLOCK`
- policy impact in evaluation and proposed changes

Important distinction:

This stage is **workflow-level Security & Policy Engineering**. AgentGraph Studio's own platform/product security and reliability baseline applies now and is defined in `docs/SECURITY_RELIABILITY_BASELINE.md`.

Exit condition:

Security/human-control findings are grounded in structured capability/policy evidence and high-impact changes cannot bypass explicit control requirements.

---

# Stage 6 — Reusable Module System

Status: **Planned**

Primary value:

Turn parts of workflow architecture into reusable engineering artifacts.

Capabilities:

- Semantic Module / subgraph
- explicit inputs/outputs/ports
- parameters
- requirements/dependencies
- versioning
- module-level validation/evaluation
- integration compatibility preview
- duplicate/collision checks

Visual Group remains separate.

Exit condition:

Reusable workflow components can be composed and evaluated as semantic artifacts rather than copied as raw canvas fragments.

---

# Stage 7 — Portable Build Toolchain

Status: **Planned**

Primary value:

```text
Verify → Own
```

Capabilities:

- Build Manifest
- project bundle
- executable export compatibility gate
- target capability/lossiness reporting
- generated-project verification
- machine-readable analysis results
- headless CLI
- Git-friendly semantic diff direction
- CI integration

Potential CLI direction:

```text
agentgraph validate
agentgraph analyze
agentgraph evaluate
agentgraph diff
agentgraph policy
agentgraph compatibility
agentgraph build
```

Exit condition:

Users can treat workflow source and build output as portable engineering artifacts outside the visual site.

---

# Stage 8 — Runtime Evidence

Status: **Long-term Vision**

Primary value:

Bring observed execution back into the same Evidence model without replacing design-time evaluation.

Capabilities:

- trace/metric import adapters
- OpenTelemetry direction subject to current standards
- framework-native observability adapters
- actual path/tool/retry/error/latency/resource evidence
- human-intervention evidence
- runtime provenance
- Design vs Actual foundation

Principle:

```text
Own your runtime, bring your observability.
```

Runtime Evidence ingestion/persistence follows `docs/DATA_AND_AI_GOVERNANCE.md`.

Exit condition:

AgentGraph can compare design-time assumptions with imported real execution evidence without requiring proprietary hosted execution.

---

# Stage 9 — Behavioral Evaluation

Status: **Long-term Vision**

Primary value:

Evaluate agent behavior and trajectories, not only static workflow structure.

Capabilities:

- scenario/synthetic fixtures
- mocked tools
- dry-run/simulation direction
- expected path/outcome definitions
- trajectory/tool-use checks
- failure/retry/approval scenarios
- runtime outcome vs designed expectation
- production failures promoted into regression fixtures under appropriate privacy governance
- runtime evidence used to confirm/falsify design-time hypotheses and improve future evaluator benchmarks without turning runtime-specific observations into universal static rules

Exit condition:

Evaluation can answer whether the implemented workflow behavior actually satisfies critical scenarios and constraints.

---

# Stage 10 — Framework-neutral Compilation

Status: **Long-term Vision**

Preferred sequence:

```text
Target Capability Contract
→ Lossiness Contract
→ Canonical Semantic Boundaries
→ Minimal Framework-neutral IR
→ CrewAI compiler through IR
→ Second target
```

Do not preselect or implement a second framework solely to claim multi-framework support.

Framework expansion must satisfy the relevant gate in `docs/roadmap/EXECUTION_GATES.md`.

Exit condition:

CrewAI remains strong while the core can represent and validate another target without scattered framework-specific conditionals or silent semantic loss.

---

# Stage 11 — Collaboration / Distribution

Status: **Conditional / product-demand driven**

Possible capabilities:

- cloud save/share
- comments/reviews
- team workspace
- RBAC
- package sharing
- review links
- organizational workflow libraries

Do not make cloud collaboration a prerequisite for local/user-owned value.

Before major collaboration scope, underlying identity/revision/data-governance contracts must be mature enough; use the collaboration/enterprise gate in `docs/roadmap/EXECUTION_GATES.md`.

Exit condition:

Only pursue substantial collaboration scope when individual engineering value and workflow artifact contracts are mature enough to support it cleanly.

---

# Stage 12 — Marketplace

Status: **Conditional / Business Validation Required**

Possible distribution objects:

- workflow templates/packages
- semantic modules
- policy packs
- evaluation packs
- project starters

Marketplace should build on mature artifact/version/compatibility/provenance contracts rather than define them.

Monetization, creator payouts, hosted execution, and machine-economy concepts are not fixed roadmap requirements.

Exit condition:

Proceed only if there is evidence that third-party distribution materially improves product value and is supported by trustworthy package/compatibility contracts.

---

# 2. Cross-stage Dependencies

Key dependency chains:

```text
Deterministic Analysis
→ Evidence
→ AI Evaluation
→ Evaluation Trust / Calibration
→ Context / Repeat-use Foundation where required
→ Improvement Proposal
→ Semantic Patch
→ Revision / Diff / Apply
```

```text
Declared Intent / Constraints
→ scoped AE2 Architecture Proposal authority
→ AI New-Workflow Draft
→ Deterministic Validation
→ Architecture Review
→ User Accept / Edit
```

```text
Small-workflow Evaluation
→ Scale Benchmark
→ Search / Locate / Scoped Evidence when needed
→ Local / Cross-region Evaluation
→ Global Synthesis
```

```text
External Source
→ Static Import / Mapping Diagnostics
→ Canonical Semantics
→ Evidence / Review
→ Project / Revision History
```

```text
Current Graph V1
→ Canonical Semantic Projection
→ Stable identity/revision
→ Additive contracts
→ explicit persisted V2 only when required
```

```text
Semantic Source Boundaries
→ Large Workflow Organization
→ Semantic Module
→ Package Distribution
```

```text
Permission/Side-effect Model
→ Policy
→ Safe Improvement
→ Security-aware Compatibility
```

```text
Target Capability
→ Lossiness
→ Build Manifest
→ Framework-neutral IR
```

```text
Design-time Evidence
→ Runtime Evidence
→ Design vs Actual
→ Behavioral Evaluation
→ Curated Evaluation Regression Fixtures
```

---

# 3. Prioritization Rules

When choosing the next Sprint, evaluate:

1. direct user value in the North Star loop
2. architectural leverage for later stages
3. dependency criticality
4. risk of expensive later migration if deferred
5. simplicity of a sufficient solution
6. preservation of portability/user ownership
7. evidence-groundability
8. human control/safety
9. compatibility with existing Production
10. whether the feature is actually demand-dependent
11. whether evaluator authority is growing faster than measured evaluator trust
12. whether claimed large-workflow support is measured for both quality and usability
13. whether the change improves access to first value
14. whether it creates legitimate repeat-use/revision value
15. whether it broadens data/provider/security boundaries and has the required governance
16. whether the intended professional user can reach the relevant core value without unnecessary framework/code/schema knowledge, using progressive disclosure rather than a divergent simplified semantic model

Do not prioritize primarily by marketing novelty or feature count.

Use the scorecard and promotion rules in `docs/roadmap/EXECUTION_GATES.md` for major stage/gate decisions.

---

# 4. Roadmap Change Rule

A roadmap change should be reflected here only after Product Architecture review.

For each material change document:

- what changed
- why
- dependency impact
- whether a stage moved, split, merged, or became conditional
- whether existing active packet scope changes
- whether migration/security/data ownership boundaries changed

Material durable changes should also create/update an ADR under `docs/decisions/`.

Never silently reinterpret a current packet because the long-term roadmap changed.
