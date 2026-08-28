# ADR-0009 — Select CrewAI Static Import v0 as the API-independent foundation packet

Status: **Accepted**  
Date: **2026-08-28**

## Context

Stage 1 Evidence-Grounded AI Architecture Review remains unreleased because its required live-evaluation gate is not satisfied and the current development API evaluation budget is exhausted. That hold must not weaken the Stage 1 release/QA gates, and it does not constitute Stage 1 completion or Gate A passage.

AgentGraph Studio nevertheless has API-independent Product/Architecture work that may proceed when it independently satisfies Product value and dependency criteria. The current Stage 1.5 selection band includes several candidates, but it is explicitly not a fixed backlog and must be selected from current evidence using the smallest coherent packet rule.

Current Production already provides deterministic value through:

- Visual Workflow Builder;
- templates;
- JSON import/export;
- deterministic CrewAI Python export;
- Unified Preflight with Readiness, Execution Preview, and Resource Analysis.

The current first-value gap for users with an existing CrewAI project is that AgentGraph Studio can import its own JSON artifact but cannot yet safely map a supported existing CrewAI source project into the current graph without manual reconstruction.

The durable import architecture already defines the preferred direction:

```text
External Source
→ Safe Static Parse
→ Source Facts
→ Semantic Mapping
→ Mapping Diagnostics / Provenance
→ AgentGraph Canonical Semantics
```

The current repository also already has `GraphData` / `GraphDocumentV1`, deterministic deserialization/validation, Preflight, and CrewAI code generation boundaries. A bounded static-import packet can therefore reuse the current semantic/product foundation without requiring a new persisted workflow version, AI provider calls, Workspace persistence, or semantic mutation authority.

## Decision

Select **CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics** as the next API-independent Stage 1.5 foundation packet.

Lifecycle state after this decision:

```text
CrewAI Static Import v0 = Selected
→ next authority: 02 specification
```

This decision is `FOUNDATION_FIRST`, not a Stage promotion.

The simultaneous roadmap state is:

```text
Stage 1 Architecture Review = held / QA incomplete
Gate A = not passed
CrewAI Static Import v0 = Selected
AI Authority = unchanged
Mutation Authority = unchanged
```

### Product objective

Allow a user with a supported existing CrewAI project to reach AgentGraph Studio's current deterministic design/preflight value without manually rebuilding the workflow first.

Preferred user-value path:

```text
Supported existing CrewAI project
→ deterministic static import
→ explicit mapping diagnostics
→ current AgentGraph workflow representation
→ current deterministic Preflight
→ inspect/edit
→ current JSON / CrewAI export paths
```

The packet must provide useful deterministic value even while provider-backed Architecture Review remains unavailable.

### Architecture boundary

The selected packet must use the current semantic model and existing deterministic systems. It must not create a speculative Graph/Workflow V2 merely for import.

Required architecture direction:

```text
External CrewAI source
→ bounded safe static parser
→ source facts
→ semantic mapper
→ mapping diagnostics + provenance
→ existing GraphData / GraphDocumentV1-compatible projection
→ existing deterministic validation / Preflight / export
```

### Required import truthfulness

The packet must preserve the import contract principles:

- imported project/source text is untrusted data;
- do not execute arbitrary imported Python to inspect or convert it;
- only explicitly supported source shapes/framework constructs may be mapped as supported;
- dynamic/unsupported behavior remains `Unknown`, inferred, lossy, or unsupported as appropriate;
- no silent lossy conversion;
- source provenance must be sufficient for diagnostics;
- original external source must not be silently rewritten;
- framework-specific parser structures must not become the core AgentGraph domain model.

The implementation specification may refine exact labels, but mapping outcomes must preserve the semantic distinction represented by the import contract's direction such as:

```text
MAPPED
MAPPED_WITH_INFERENCE
LOSSY
UNKNOWN
UNSUPPORTED
```

### Included for 02 specification

02 should specify the smallest coherent v0 around:

- explicitly bounded supported CrewAI source/project subset;
- deterministic static parsing only;
- semantic mapping into the existing graph/domain model;
- mapping diagnostics, Unknown/lossiness, and provenance;
- safe user flow for importing the supported project subset into the existing editor;
- deterministic compatibility with current validation, Unified Preflight, JSON portability, and CrewAI export where the mapped semantics are supported;
- import security limits and malicious/untrusted-input handling;
- regression protection for Visual Builder, Templates, JSON Import/Export, CrewAI Python Export, Readiness, Execution Preview, Resource Analysis, Unified Preflight, accessibility, responsive behavior, and existing analytics.

### Deferred / Out of Scope

This selection does **not** include:

- Project / Local Workspace persistence;
- cloud save/sync or collaboration;
- persisted Intent & Constraints;
- Scenario/Acceptance persistence;
- Revision / Evaluation History;
- Architecture Review or evaluator changes;
- AI-assisted parsing or AI-generated architecture;
- source synchronization/write-back;
- arbitrary Python execution or execution-assisted import;
- generic or multi-framework import;
- a new persisted Graph/Workflow major version;
- Guided Improvement;
- Semantic Patch / Apply;
- any AI or mutation authority expansion.

## Rationale

This is the smallest candidate that has independent Product value under the current hold.

It strengthens `Understand` and access to deterministic `Evaluate/Verify` foundations by reducing the manual reconstruction barrier for existing CrewAI workflows. It also reuses the current semantic/Preflight/export architecture and avoids introducing persistence or revision architecture before those dependencies are measured as necessary.

Other Stage 1.5 candidates remain valid but are not selected now:

- Persisted Intent & Constraints primarily improves evaluator/proposal context and is not the strongest independent value while Stage 1 is held.
- Review/Locate is more valuable once a review/finding surface is available or measured navigation evidence justifies it.
- Project/Local Workspace introduces a broader persistence/identity boundary than is required for this first-value problem.
- Revision/Evaluation History depends on identity/persistence and is downstream of measured repeat-use/history needs.
- Scenario/Acceptance is not selected without evidence that missing designed expectations are the current limiting dependency.
- Evaluation Scale requires evaluator evidence and is not an API-independent substitute for the held Stage 1 release.

Cost avoidance is a delivery constraint, not the reason for Product priority. The Product reason is lower first-value friction for existing CrewAI workflows with high architectural reuse and no authority expansion.

## Consequences

- `CrewAI Static Import v0` becomes **Selected** and is handed to `02` for an implementation-ready specification.
- `02` must define the supported-source contract precisely enough that `C01` does not invent import semantics.
- The Stage 1 Architecture Review hold remains unchanged and resumes only under its existing evaluation-budget/release conditions.
- No claim is made that Stage 1 is complete, Gate A passed, or Stage 2 is authorized.
- No new AI provider cost is required by the selected capability itself.
- A separate implementation branch/C01 task must be used so held evaluator WIP is not mixed with static-import work.
- R-007 remains a primary risk boundary: static import must not execute or overclaim dynamic external semantics.
- R-006 remains protected: do not create an unnecessary Graph/Workflow V2 migration.

## Alternatives considered

### Wait with all Product work until Stage 1 evaluation funding returns

Rejected because the hold is specific to provider-backed evaluation evidence. It should not block a separate deterministic foundation that independently improves first value and does not weaken the Stage 1 gates.

### Select Project / Local Workspace first

Not selected because it introduces persistence, identity, migration, and data-governance scope beyond what is required to remove the current existing-project first-value barrier.

### Select Persisted Intent & Constraints first

Not selected because its strongest current value is evaluator/proposal context. The selected static-import packet provides more immediate independent deterministic value while Stage 1 is held.

### Select Review / Locate first

Not selected because current Production does not yet expose the provider-backed Architecture Review finding workflow whose navigation it would primarily improve.

### Expand the importer to generic Python or multiple frameworks

Rejected for v0 because it would enlarge the security/mapping surface, weaken the supported-source contract, and risk silent loss or framework-driven domain coupling.

### Use AI to interpret unsupported/dynamic source

Rejected for v0 because it would reintroduce provider cost, inference uncertainty, and an unnecessary authority dependency into a packet selected specifically as a deterministic foundation.

## Migration / compatibility impact

No persisted schema major-version migration is authorized by this ADR.

The packet should project supported imported semantics into the current graph/domain boundaries wherever sufficient. Any additive metadata required for mapping diagnostics/provenance must be explicitly specified by 02 and reviewed against current serialization/export compatibility before implementation.

Existing JSON artifacts and existing deterministic editor/Preflight/export behavior remain protected unless the future Specified packet explicitly and compatibly changes them.

## Related docs / packets

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- `docs/CURRENT_STATE.md`
- current packets under `docs/specs/`
