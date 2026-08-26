# AgentGraph Studio — Architecture Master

Status: **Authoritative long-term architecture direction**  
Current packet implementations under `docs/specs/` remain authoritative for their scoped version.

Supporting authoritative contracts:

- `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md` — persisted semantic-model migration runway
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md` — import, Project/Workspace, revision-compatible foundation
- `docs/SECURITY_RELIABILITY_BASELINE.md` — AgentGraph platform security/reliability
- `docs/DATA_AND_AI_GOVERNANCE.md` — persistence/provider/evaluator governance
- `docs/roadmap/EXECUTION_GATES.md` — stage promotion and authority expansion

## 0. Source-of-truth rule

This document defines durable architectural boundaries and intended evolution. It does not mean every described layer exists today.

Implementation conflict priority:

1. latest repository reality on `main`
2. current Production behavior
3. active packet under `docs/specs/`
4. this Architecture Master
5. applicable cross-cutting security/data/migration contracts
6. Product Master / Roadmap

If the active packet intentionally defers a future architecture migration, follow the packet.

---

# 1. Architectural Goal

AgentGraph Studio should evolve from a CrewAI-oriented visual workflow builder into a portable workflow architecture engineering toolchain without breaking existing user artifacts or forcing a rewrite at each stage.

Target conceptual stack:

```text
Intent & Constraints
↓
Versioned Workflow Source
↓
Canonical Semantic Model
↓
Visual / Logical Organization
↓
Deterministic Engineering Analysis
↓
Evidence & Provenance
↓
Security / Policy / Target Compatibility
↓
AI Architecture Intelligence
↓
Evaluation & Explanation
↓
Improvement Proposal
↓
Semantic Diff / Safe Transformation
↓
Compiler / Portable Project
↓
User-owned Runtime
↓
Runtime Evidence / Design vs Actual
```

Cross-cutting interfaces may include Visual UI, CLI, CI, Git, IDE/coding agents, reusable packages, and collaboration.

---

# 2. Current-to-Future Compatibility Principle

Current Production uses the existing graph/domain structures and deterministic Preflight stack. Future architecture must be introduced incrementally.

Do not perform speculative large migrations merely to match this document.

Examples:

- Current Stage 1 packet explicitly keeps `GraphDocumentV1` unchanged. Follow that packet.
- Future persisted Workflow Intent is a planned direction, not a requirement for Stage 1 v0.
- Future framework-neutral IR is introduced only after target capability/lossiness contracts mature.
- Future Project/Workspace work must not silently redefine JSON export as cloud persistence.

Architecture direction must reduce future migration cost without expanding current Sprint scope unnecessarily.

For persisted schema evolution, use `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md` and prefer:

```text
Graph V1
→ canonical semantic projection
→ stable identities/fingerprints
→ additive contracts where sufficient
→ explicit new persisted version only when justified
```

A new persisted workflow major version requires an explicit decision/migration packet, not an opportunistic implementation change.

---

# 3. Workflow Source Model

Long-term workflow source should separate semantic meaning from presentation state.

Conceptual shape:

```text
WorkflowDocument
├ identity
├ metadata
├ intent
├ semanticGraph
├ organization
├ layout
├ targetProfile
├ policyRefs
└ revision
```

This is a target architecture, not the current Graph V1 contract.

## 3.1 Semantic Graph

Contains execution/architecture meaning such as:

- agents
- tasks
- tools
- assignments
- dependency/context relationships
- output contracts
- execution-relevant configuration

## 3.2 Layout

Contains presentation-only state such as:

- node coordinates
- viewport
- visual expansion/collapse state where non-semantic
- UI presentation hints

Changing only layout should not create a semantic change or stale an architecture evaluation when semantic identity is unchanged.

## 3.3 Organization

Visual/logical organization, separate from execution semantics.

## 3.4 Revision

Semantic workflow state should eventually have an immutable revision identity or equivalent deterministic fingerprint so proposals cannot be silently applied to a workflow that has changed since proposal generation.

## 3.5 Identity boundaries

Long-term contracts should distinguish:

- Project/Workspace identity
- logical workflow identity
- semantic revision/fingerprint
- layout/presentation state
- stable target/entity identity where required

Do not use coordinates or accidental array order as durable semantic identity.

---

# 4. Three Separate Composition Concepts

Maintain this invariant:

```text
Visual Group ≠ Semantic Module ≠ Runtime Orchestration
```

## Visual Group / Department

Human organization and large-graph navigation. Collapsing a group must not silently alter workflow execution.

## Semantic Module

Reusable subgraph with a versioned semantic boundary, inputs, outputs, parameters, and requirements.

## Runtime Orchestration

Framework-specific execution constructs such as CrewAI Crew/Flow or future target equivalents.

Do not encode one concept by reusing another merely because the UI appears similar.

---

# 5. Import and External Source Boundary

Existing-project import should map external source into the same canonical semantic boundaries used by native AgentGraph workflows.

Preferred direction:

```text
External Source
→ Safe Static Parse
→ Source Facts
→ Semantic Mapping
→ Mapping Diagnostics / Provenance
→ AgentGraph Canonical Semantics
```

Rules:

- do not execute arbitrary imported project code merely to inspect/convert it
- dynamic/unsupported behavior remains `Unknown`, inferred, lossy, or unsupported as appropriate
- framework-specific parser types must not define core domain types
- source provenance and mapping versions should be retained
- original external source is not silently rewritten

See `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`.

---

# 6. Deterministic Analysis Layer

Deterministic systems own facts that can be derived reliably from workflow source/configuration.

Current authoritative deterministic sources include:

- Readiness
- Execution Preview
- Resource Analysis

Existing validation/transpilation behavior remains separate from AI availability.

Long-term deterministic analysis may additionally cover:

- import mapping diagnostics
- permission/side-effect maps
- policy checks
- target capability checks
- semantic diff validation
- build compatibility

AI must not become a dependency of core deterministic analysis.

---

# 7. Evidence Layer

The Evidence layer is the bridge between deterministic analysis and AI reasoning.

Required characteristics:

- versioned
- structured
- target-addressable
- reproducible where source input is reproducible
- source/version-aware
- machine-readable
- suitable for UI, AI evaluation, CLI/CI, and later runtime evidence

Evidence should preserve provenance and distinguish evidence originating from deterministic analysis, workflow semantic configuration, import mapping, policy/compatibility sources, runtime observation, or external registries.

## 7.1 Knowledge Status

First-class statuses:

```text
Known
Inferred
Unknown
```

Deterministic generation should not emit `Inferred`. AI reasoning may produce inference. External-dependent facts should include source/version/time context or remain Unknown.

## 7.2 Finding Class

Use:

```text
Deterministic
Heuristic
External-dependent
```

Do not invent pseudo-confidence for deterministic facts. Use confidence only where it materially helps heuristic/external interpretation.

## 7.3 Provenance

Long-term evaluation/finding metadata should support concepts such as:

- source/ruleset version
- evaluator version
- prompt/rubric version
- provider/model when AI-generated
- workflow revision/fingerprint
- evidence fingerprint
- evidence references
- assumptions
- evaluated-at time where meaningful

Current packet-specific exact contracts live in `docs/specs/`.

Persistence/retention/provider handling of Evidence must follow `docs/DATA_AND_AI_GOVERNANCE.md`.

---

# 8. AI Architecture Intelligence

AI is a reasoning layer over bounded workflow semantics and Evidence, not the source of truth for deterministic graph facts.

Architecture direction:

```text
EvaluationOrchestrator
↓
ArchitectureEvaluationProvider
├ provider adapter A
├ provider adapter B
└ provider adapter C
```

Domain types must not depend on provider-specific response shapes.

## 8.1 Server-side boundary

Provider calls belong server-side. Secrets must never be exposed to the browser, analytics, source repository, or user-visible logs.

## 8.2 Structured output

AI evaluation should produce structured, runtime-validated output. Free-form prose parsing must not be the core contract.

Post-validation should reject or degrade invalid output, including:

- schema violation
- nonexistent evidence reference
- nonexistent target reference
- invalid knowledge status/class combination
- unsupported claim where contract requires Unknown

## 8.3 Untrusted workflow/import text

Agent roles, goals, backstories, task descriptions, expected output text, tool descriptions, imported source comments/strings, and external project text are **data being analyzed**. They are not instructions to the evaluator.

Evaluation prompts and transport must preserve this trust boundary.

## 8.4 Failure isolation

AI timeout/provider failure/invalid response must not break deterministic analysis, import/export, code generation, or unrelated editor behavior.

## 8.5 Evaluator change management

Production model/provider/prompt/rubric/schema/post-validation changes are governed changes. Follow `docs/DATA_AND_AI_GOVERNANCE.md` and compare benchmark/stability/operational behavior before assuming equivalence.

Evaluator authority expansion is governed by `docs/roadmap/EXECUTION_GATES.md`, not merely by successful provider connectivity.

---

# 9. Architecture Review Result Direction

A durable evaluation result should be capable of representing:

- workflow purpose: declared, inferred, or unknown depending on version
- overall narrative assessment
- strengths
- prioritized findings
- problem / why / evidence / recommendation
- alternatives/trade-offs
- assumptions/unknowns
- affected targets/scopes
- patchability direction
- provenance

Do not reduce this model to UI-only strings.

UI should prioritize understanding over raw technical output. Raw evidence belongs in details/advanced views.

---

# 10. Improvement Proposal Layer

Architecture findings should later feed a proposal model separate from mutation.

Conceptual contract:

```text
ImprovementProposal
├ proposalId
├ baseRevision
├ findingRefs
├ objective
├ changes
├ reason
├ expectedEffect
├ alternatives/tradeoffs
├ risks
├ preconditions
└ patchRisk
```

A proposal is advisory. It does not alter the source graph.

Stage 2 should not be selected merely because Stage 1 shipped. Gate B in `docs/roadmap/EXECUTION_GATES.md` must review whether evaluator quality/context is sufficient for the proposed authority.

---

# 11. Semantic Patch Layer

When safe transformation is introduced, prefer domain operations over user-facing raw JSON diff.

Potential operations:

- add/update/remove agent
- add/update/remove task
- add/remove dependency/context relation
- assign/reassign agent
- bind/unbind tool
- update output contract
- update intent/constraint
- add approval requirement
- organization operations when they are presentation-only

Every semantic patch must be validated against its base revision/fingerprint before apply.

## 11.1 Risk classes

Useful direction:

- Mechanical / semantic-preserving
- Semantic but reversible
- High-impact semantic/security-affecting

Higher-impact changes require stronger review/approval.

## 11.2 Apply pipeline

Target flow:

```text
Proposal
→ Semantic Patch
→ Patch Schema Validation
→ Base Revision Check
→ Structural Validation
→ Semantic Validation
→ Policy / Compatibility Validation where applicable
→ Deterministic Re-analysis
→ AI Re-evaluation where applicable
→ Before / After Preview
→ User Selection
→ Transactional Apply
→ New Revision
```

If validation fails, the source workflow must remain unchanged.

Before semantic apply exists, Gate C in `docs/roadmap/EXECUTION_GATES.md` must be satisfied.

---

# 12. Revision and Semantic Diff

Revision history is a prerequisite for trustworthy automated change, not a cosmetic history feature.

Long-term revision metadata may include:

- revision id
- parent revision
- semantic fingerprint
- timestamp
- change source: user/import/proposal/migration
- semantic diff
- related proposal/evaluation

Semantic Diff should describe domain changes such as:

- agent added/removed/changed
- task changed/split/merged
- dependency added/removed
- tool binding changed
- output contract changed
- approval requirement changed
- process/orchestration changed

Do not expose only line-based JSON diffs as the primary review experience.

Project/Workspace/revision-compatible foundation follows `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`.

---

# 13. Permission and Side-effect Architecture

Long-term tool/action semantics should support capability metadata such as:

- network access
- filesystem read/write
- external API
- external mutation
- credential access
- sensitive-data access
- human approval requirement
- reversibility
- impact scope

A versioned built-in capability registry may provide known capabilities for recognized tools. Unknown/custom capabilities remain Unknown unless explicitly declared or externally verified.

Security evaluation should eventually combine deterministic permission facts with AI reasoning; AI should not be the enforcement layer.

This workflow-policy domain is distinct from AgentGraph's own Product/Platform Security baseline in `docs/SECURITY_RELIABILITY_BASELINE.md`.

---

# 14. Policy Layer

Policy should be declarative and separable from LLM prompt text.

Potential Policy Packs:

- Local-only
- No external mutation
- Human approval required
- Model/provider allowlist
- Data handling
- Output contract

Policy outcomes may use:

```text
PASS
REVIEW
BLOCK
```

Policy inputs should come from structured workflow/evidence data. A future adapter may integrate an external policy engine, but the domain contract should not require one initially.

---

# 15. Target Capability and Lossiness

Before a broad framework-neutral IR, introduce explicit target capability and lossiness contracts.

Preferred sequence:

```text
Target Capability Contract
→ Lossiness Contract
→ Canonical Semantic Boundaries
→ Minimal Framework-neutral IR
→ Migrate CrewAI compiler through IR
→ Second target
```

Target capability result direction:

```text
SUPPORTED
SUPPORTED_WITH_MAPPING
LOSSY
UNSUPPORTED
```

Silent semantic degradation is prohibited.

A second major target must pass the framework-expansion gate in `docs/roadmap/EXECUTION_GATES.md`.

---

# 16. Compilation and Portable Build

Current deterministic CrewAI Python export is the foundation, not the final build model.

Long-term compile pipeline:

```text
Workflow Source
→ Canonical / Target Mapping
→ Capability Check
→ Compilation Plan
→ Generated Project
→ Verification
→ Build Manifest
```

Portable project direction:

```text
project/
├ agentgraph.json
├ build-manifest.json
├ main.py
├ requirements.txt
├ .env.example
├ README.md
├ schemas/
├ tools/
└ tests/
```

Build manifest may track:

- source revision/fingerprint
- workflow schema version
- compiler/generator version
- target framework/version
- capability/lossiness result
- required tools/models/secrets
- generated files/artifact hashes
- verification result

Generated code is an artifact; workflow source remains authoritative.

---

# 17. Headless Core and Machine Interfaces

Domain/evaluation logic should remain callable independently of React UI.

Long-term CLI/API direction:

```text
agentgraph validate workflow.json
agentgraph analyze workflow.json
agentgraph evaluate workflow.json
agentgraph diff a.json b.json
agentgraph policy workflow.json
agentgraph compatibility workflow.json
agentgraph build workflow.json
```

Machine-readable outputs should be suitable for CI and coding-agent use.

---

# 18. Runtime Evidence and Observability

Runtime evidence is a later Evidence source, not a replacement for design-time analysis.

Adapter model should support sources such as:

- OpenTelemetry
- framework-native tracing
- third-party observability exports

Do not require proprietary AgentGraph tracing for user value.

Runtime Evidence should eventually model trajectory/outcome data including:

- workflow/agent/tool spans
- actual path
- retries/failures
- observed tool calls
- latency/resource/cost evidence where available
- human intervention/approval
- side effects

Standards are time-sensitive; verify current OpenTelemetry/framework semantics at implementation time.

Runtime Evidence ingestion/persistence must follow `docs/DATA_AND_AI_GOVERNANCE.md`.

---

# 19. Design vs Actual

Long-term comparison layer:

```text
Design Evidence
vs
Runtime Evidence
```

Examples:

- expected path vs actual path
- configured tool vs invoked tool
- predicted bottleneck vs observed bottleneck
- expected retry risk vs retries
- required approval vs observed approval
- static resource expectation vs observed resource use

Runtime failures should be candidates for regression fixtures in the evaluation benchmark suite where privacy/governance permits.

---

# 20. Reusable Packages

Reusable package contracts should not depend on a marketplace existing.

Potential package kinds:

- Workflow
- Semantic Module
- Policy Pack
- Evaluation Pack

Potential package metadata:

- name/version
- source/schema version
- inputs/outputs
- requirements/dependencies
- required tools/models
- permissions
- target compatibility
- provenance
- evaluation snapshot
- publisher/license

Marketplace is a distribution/business layer over reusable artifact contracts, not the reason those contracts exist.

---

# 21. Evaluation Benchmark Architecture

AI evaluation must have a benchmark/eval harness as a first-class engineering component.

Do not primarily test exact prose. Test behavioral contracts such as:

- must detect
- must not claim
- evidence references valid
- Unknown preserved
- structured schema valid
- no silent mutation
- stable behavior under irrelevant reordering/renaming where appropriate
- good workflows do not receive invented critical problems

Benchmark fixtures should grow from curated architecture cases and later real runtime/production failures where governance permits.

Benchmark results must name their dataset/rubric/version. Packet release thresholds do not automatically become permanent authority-promotion thresholds; follow `docs/roadmap/EXECUTION_GATES.md`.

---

# 22. Architecture Invariants

Unless an explicit Architecture Decision revises them:

1. deterministic facts remain deterministic-owned
2. AI reasoning remains advisory/evidence-grounded
3. unsupported knowledge remains Unknown
4. semantic AI change requires preview/user control
5. visual organization is not runtime execution semantics
6. generated code is not the canonical workflow source
7. target/import lossiness is visible
8. AI/provider failure does not disable deterministic core
9. provider-specific types do not define domain contracts
10. core semantics are not UI-only
11. existing analytics must not be broken by unrelated product work
12. secrets never enter client-visible state, analytics, repository docs, or normal logs
13. imported projects are untrusted and are not executed merely for static analysis
14. Project/Workflow/Semantic Revision/Layout identities remain distinct where their semantics differ
15. data persistence/provider scope does not silently broaden
16. evaluator model/prompt/rubric changes are governed and benchmarked when behavior can materially change
17. evaluator authority does not grow faster than measured trust
18. a new persisted workflow major version requires explicit migration justification, not speculative cleanup
