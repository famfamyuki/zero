# AgentGraph Studio — Master Roadmap

Status: **Authoritative long-term sequencing**  
Roadmap stages express dependency order and product direction, not guaranteed dates.

## 0. Source-of-truth rule

The current active packet under `docs/specs/` defines the implementation scope of the current Sprint. This roadmap must not be used to pull later-stage features into the current packet.

Stage status terms:

- Current Product
- Planned
- Long-term Vision
- Conditional / Business Validation Required

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
2. make architecture understandable/evaluable
3. create improvement proposals
4. make semantic changes safe and reviewable
5. scale to larger workflows
6. add policy/security boundaries
7. make architecture reusable/composable
8. compile/package for user ownership
9. incorporate runtime evidence
10. evaluate behavior, not only static design
11. generalize target compilation
12. add collaboration/distribution only where product value is validated

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

Current v0 intentionally defers direct mutation, Semantic Patch, Apply, persisted top-level Workflow Intent, runtime tracing, framework-neutral compilation, and marketplace.

Exit condition:

A user can explicitly request an architecture-level review and understand the most important strengths, weaknesses, uncertainties, and justified improvement direction without AI inventing deterministic facts or modifying the workflow.

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

No direct semantic apply unless Stage 3 safety contracts are present.

Exit condition:

Users can compare meaningful improvement directions and understand why they differ before any graph mutation.

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

Exit condition:

AI-supported improvements can modify workflow semantics only through an explicit, reviewable, validated, reversible user-controlled path.

---

# Stage 4 — Large Workflow UX

Status: **Planned**

Primary value:

Make complex workflows understandable without changing semantics merely for visualization.

Capabilities:

- Visual Group / Department
- nested grouping
- collapse/expand
- outline/tree navigator
- search/filter
- semantic zoom
- dependency path isolation
- issue-only view
- group-level finding/preflight summaries
- Locate → Expand → Focus
- boundary-edge aggregation for collapsed groups

Invariant:

```text
Visual Group ≠ Semantic Module ≠ Runtime Orchestration
```

Exit condition:

Large workflows remain navigable and evaluable while visual organization stays separate from execution meaning.

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

Bring observed execution back into the same Evidence model.

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
- production failures promoted into regression fixtures

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
→ Improvement Proposal
→ Semantic Patch
→ Revision / Diff / Apply
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

Do not prioritize primarily by marketing novelty or feature count.

---

# 4. Roadmap Change Rule

A roadmap change should be reflected here only after Product Architecture review.

For each change document:

- what changed
- why
- dependency impact
- whether a stage moved, split, merged, or became conditional
- whether existing active packet scope changes

Never silently reinterpret a current packet because the long-term roadmap changed.
