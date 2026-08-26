# ADR-0008 — Non-engineer professional usability and assisted architecture drafting

Status: **Accepted**  
Date: **2026-08-27**

## Context

AgentGraph Studio is a professional workflow architecture engineering tool, but its intended final product should not require every user to already understand CrewAI, Python, JSON schemas, graph modeling, or framework-specific terminology before reaching core value.

The Product Platform strategy already describes a workspace-centric final UX and three strategic entry modes:

- Import Existing Workflow
- Describe New Workflow
- Start from Template

It also describes AI Architecture Drafting as a possible flow from user intent to a reviewable architecture proposal. However, the durable Product Master did not yet state a specific non-engineer usability contract, and the Master Roadmap did not explicitly place `Describe New Workflow` inside the staged AI-authority model.

Without an explicit decision, two opposite failure modes are possible:

1. the product remains technically strong but requires framework/graph knowledge before users can reach value; or
2. a future “beginner mode” hides complexity by creating a separate simplified semantic model or by allowing AI to create/apply architecture without the same evidence, validation, uncertainty, and user-control rules.

Both outcomes conflict with the intended product direction.

## Decision

### 1. Adopt one semantic product with progressive disclosure

AgentGraph Studio will use the same canonical workflow semantics for technical and non-technical professional users.

The product may present different levels of detail, but it must not create a separate simplified semantic truth for beginners.

Required UX direction:

- goal-first entry before framework-first configuration where practical;
- plain-language explanation before raw technical evidence;
- progressive disclosure for advanced settings, Evidence, JSON, generated code, and framework details;
- safe/default configuration where it does not hide semantic choices or unsupported assumptions;
- explicit `Known / Inferred / Unknown` and trade-off disclosure regardless of user expertise;
- technical detail remains inspectable rather than removed.

A target non-engineering professional user should be able to reach the product's review/decision value without first understanding CrewAI internals, Python, JSON, or graph-schema terminology.

### 2. Preserve the final goal-first entry model

The intended final Start / Project Home should support, when the required capabilities exist:

```text
Import Existing Workflow
Describe New Workflow
Start from Template
Recent Projects / Workflows
```

This is a final-state Product direction. It does not mean every entry mode belongs in the current Sprint.

### 3. Place `Describe New Workflow` under scoped architecture-proposal authority

AI-assisted new-workflow drafting is an architecture proposal capability, not a Stage 1.5 authority-free adoption foundation.

It belongs inside the same capability-scoped authority discipline as `AE2 — Architecture Proposal` in `docs/roadmap/EXECUTION_GATES.md`.

Therefore it must not be selected merely because it could reduce onboarding friction. Selection requires Gate B or an explicit equivalent scoped authority decision supported by evidence for the intended proposal scope.

The preferred flow is:

```text
Declared Intent / Constraints
→ AI Architecture Draft Proposal
→ Explain Responsibilities / Boundaries / Assumptions
→ Deterministic Validation
→ Architecture Review
→ User Accepts / Edits
→ Workflow Source
```

The generated draft is advisory until the user accepts it. It must not silently persist or apply unsupported semantics.

### 4. Keep AI drafting separate from semantic mutation

Creating a proposed initial architecture from declared intent does not authorize later mutation of an existing workflow.

`Describe New Workflow` does not grant Semantic Patch or Apply authority. Existing safe-transformation rules remain:

```text
Finding
→ Improvement Proposal
→ Semantic Patch
→ Validation
→ Preview
→ User Apply
```

### 5. Require task-level usability evidence in relevant future packets

When a future packet materially changes Start, Review, Changes, Build, onboarding, or AI-assisted drafting for intended non-engineering professional users, its Definition of Ready / Acceptance Criteria should define the relevant task-level usability outcome.

Examples include whether a representative user can:

- choose an appropriate entry path;
- understand the top review issue and why it matters;
- locate the affected workflow area;
- compare an improvement or draft architecture option;
- understand uncertainty/trade-offs;
- complete the intended action without requiring framework/code/schema knowledge that is not essential to the decision.

This does not require a heavyweight permanent usability program for every packet. The evidence depth should match the capability and risk.

## Rationale

This decision preserves the product's professional engineering depth while reducing avoidable conceptual load.

Progressive disclosure is preferred over a separate beginner product because it:

- keeps one source of semantic truth;
- avoids divergent behavior and migration cost;
- preserves Evidence and user ownership;
- allows expert users to inspect technical detail;
- lets non-engineering users reason in goals, problems, effects, and trade-offs;
- keeps AI authority tied to measured trust rather than to UX convenience.

Placing assisted drafting under `AE2` also resolves the roadmap ambiguity without pulling a new authority-expanding feature into Stage 1.5.

## Consequences

- `docs/PRODUCT_MASTER.md` must state the durable progressive-disclosure / non-engineer professional usability contract.
- `docs/roadmap/MASTER_ROADMAP.md` must place assisted new-workflow drafting as a Stage 2 / AE2-capability direction, not a Stage 1.5 automatic candidate.
- `docs/roadmap/PROGRAM_BOARD.md` should track the capability as a future candidate with its evidence/dependency boundary.
- `docs/roadmap/RISK_REGISTER.md` should track failure to reach first value because of unnecessary technical/conceptual load.
- Current Stage 1 Architecture Review scope and the current Paid Access & Usage Control packet do not expand.
- No persisted schema migration is required by this decision.
- No separate `BeginnerWorkflow` / simplified graph schema is introduced.

## Alternatives considered

### Keep the usability direction only in Product Platform strategy

Rejected because the final UX direction would remain weakly connected to the authoritative Product and Roadmap contracts.

### Put `Describe New Workflow` in Stage 1.5

Rejected as the default placement because AI architecture drafting expands proposal authority. Stage 1.5 may improve onboarding through import, templates, Review/Locate, Intent/Constraints, or other foundations without silently granting AE2 authority.

### Create a separate beginner semantic model or beginner application

Rejected because it would duplicate product truth, increase synchronization/migration cost, and risk inconsistent review/build behavior.

### Let AI generate and immediately apply a workflow for simplicity

Rejected because ease of use does not justify bypassing validation, uncertainty, review, or user control.

## Migration / compatibility impact

None for current persisted workflow formats.

Existing Visual Builder, Templates, JSON Import/Export, deterministic CrewAI Python export, Readiness, Execution Preview, Resource Analysis, Unified Preflight, accessibility, responsive behavior, and analytics remain protected unless a future selected packet explicitly changes them.

## Related docs / packets

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- `docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`
- current packets under `docs/specs/`
