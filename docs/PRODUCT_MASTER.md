# AgentGraph Studio — Product Master Plan

Status: **Authoritative long-term product direction**  
Scope: Product definition, North Star, product principles, final-state user experience, durable product boundaries.  
Current implementation details are governed by the active packet under `docs/specs/`.

## 0. Source-of-truth rule

This document defines the long-term Product direction. It does not override current repository reality or an active implementation packet.

When there is a conflict:

1. latest GitHub `main`
2. latest Vercel Production and actual Production behavior
3. active packet under `docs/specs/`
4. this Product Master
5. `docs/ARCHITECTURE.md`
6. `docs/roadmap/MASTER_ROADMAP.md`
7. historical plans/chats

Do not interpret roadmap or future-state language as evidence that a feature exists in Production.

---

# 1. Final Product Definition

AgentGraph Studio is a **Portable AI Workflow Architecture Engineering Toolchain**.

It treats AI-agent workflows as versioned engineering artifacts that can be:

- designed
- understood
- statically verified
- evaluated with evidence-grounded AI reasoning
- improved through explicit proposals
- reviewed through semantic change previews
- compiled into user-owned artifacts
- evaluated against target-framework capabilities
- later compared against runtime evidence

AgentGraph Studio is not defined by the canvas. The canvas is one human interface to the workflow source.

The same underlying workflow semantics should eventually be usable through:

- Visual UI
- CLI
- CI
- Git review
- IDE / coding agents
- Architecture Review
- reusable packages/modules

---

# 2. Product North Star

Primary product loop:

```text
Understand
→ Evaluate
→ Improve
→ Verify
→ Own
```

Expanded lifecycle:

```text
Describe Intent
→ Design / Import
→ Understand
→ Deterministic Verification
→ AI Architecture Evaluation
→ Review Weaknesses and Strengths
→ Compare Improvement Directions
→ Review Semantic Change
→ Apply under User Control
→ Re-evaluate
→ Target Compatibility Check
→ Compile / Build
→ User-owned Runtime
→ Optional Runtime Evidence
→ Design vs Actual
→ Improve Again
```

Every major feature should strengthen this loop or be a clear prerequisite for it.

---

# 3. Core User Questions

A mature AgentGraph Studio should help a user answer:

- What is this workflow trying to accomplish?
- What is structurally true about the workflow?
- What is already designed well?
- What are the largest architecture weaknesses?
- Why do those weaknesses matter?
- Which issue should be fixed first?
- Is the architecture more complex than necessary?
- Are agent responsibilities well separated?
- Are task boundaries and dependencies appropriate?
- Are tools/models/output contracts appropriate for the stated intent?
- Is human approval missing where the workflow has consequential effects?
- What is known, inferred, or unknown?
- What improvement options exist and what are their trade-offs?
- What exactly would change if a proposal were applied?
- Did the proposal improve the workflow after re-evaluation?
- Can the target framework represent the workflow without silent loss?
- Can the user export and own the source/runtime?
- Did real runtime behavior match the design-time expectations?

---

# 4. Product Constitution

## 4.1 Simplest Sufficient Architecture

AgentGraph Studio must not reward complexity for its own sake.

More agents, more tasks, more tools, hierarchy, or orchestration are not automatically better. An architecture recommendation should prefer the simplest design that satisfies the user's intent and constraints while maintaining required reliability, control, and portability.

An agent or architectural layer should have a defensible reason such as:

- distinct responsibility
- distinct expertise/model strategy
- tool/security boundary
- approval/trust boundary
- concurrency or isolation requirement
- reusable semantic boundary

If not, merge/simplify may be the better recommendation.

## 4.2 Evidence Before Intelligence

Required ordering:

```text
Workflow Source
→ Deterministic Analysis
→ Evidence
→ AI Reasoning
→ Evaluation
```

AI must not replace deterministic facts that can be computed reliably.

Current Readiness, Execution Preview, and Resource Analysis are not obsolete once AI exists. They form part of the Deterministic Evidence Layer.

## 4.3 AI Is Advisory, Not Authority

AI may interpret architecture, trade-offs, intent fit, complexity, and improvement directions. It must not be treated as an infallible gate or source of deterministic truth.

AI findings must be:

- structured
- evidence-grounded where the claim depends on current workflow facts
- bounded by what is actually known
- explicit about assumptions and unknowns where needed

## 4.4 Knowledge Status

Use first-class distinctions:

- `Known`
- `Inferred`
- `Unknown`

Do not convert missing user intent, runtime behavior, provider properties, framework support, cost, or latency into fabricated certainty.

## 4.5 Finding Classes

Preserve the distinction between:

- `Deterministic`
- `Heuristic`
- `External-dependent`

The class describes where the judgement originates; knowledge status describes epistemic certainty. They are not the same axis.

## 4.6 No Silent Semantic Change

AI must never silently change workflow meaning.

Long-term semantic-change flow:

```text
Finding
→ Improvement Proposal
→ Semantic Patch
→ Patch Validation
→ Workflow Validation
→ Re-analysis
→ Before / After Preview
→ User Selection
→ Transactional Apply
→ New Revision
```

Mechanical/schema-preserving repairs may have lighter UX, but semantic changes require explicit user review.

## 4.7 User-owned Source and Runtime

AgentGraph Studio must not make proprietary hosted execution the only path to value.

Preferred lifecycle:

```text
Visual / Textual Authoring
→ Workflow Source
→ Build
→ Portable Project
→ User Git Repository
→ User Runtime
```

Cloud save/collaboration may exist separately. User ownership is a product principle.

## 4.8 CrewAI-first, Not CrewAI-locked

CrewAI is the current primary compilation target. The product should deliver a strong CrewAI experience before attempting multiple frameworks.

Long-term core contracts should avoid unnecessary framework lock-in so that capability checking and a minimal framework-neutral representation can be introduced later.

## 4.9 No Silent Lossy Conversion

A target capability result should eventually distinguish:

- `SUPPORTED`
- `SUPPORTED_WITH_MAPPING`
- `LOSSY`
- `UNSUPPORTED`

Loss of workflow semantics must be surfaced, never silently degraded.

---

# 5. Final Product Workspaces

The final UX should not force all capabilities into the current right-side Preflight panel.

Long-term primary workspaces:

## Design

Create/import/edit workflow architecture and intent.

## Review

Architecture-level evaluation that answers:

- inferred or declared purpose
- overall assessment
- top problems
- strengths
- fix-first recommendation
- alternatives/trade-offs
- unknowns

## Changes

Improvement proposals, semantic diff, patch risk, before/after comparison, selective apply.

## Evidence

Deterministic technical evidence including validation, Readiness, execution structure, resource analysis, policy/security, compatibility, and later runtime evidence.

## Build

Target capability, compatibility, lossiness, compiler/build manifest, portable project export.

## History

Workflow revisions, semantic diffs, evaluation history, change provenance.

## Runtime

Later: imported traces/metrics and Design vs Actual.

## Library

Templates, reusable modules, policy/evaluation packages, and only later a marketplace if validated.

---

# 6. Neutral Architecture Review

Architecture Review acts as an **Independent Architecture Reviewer**, not as an AgentGraph upsell mechanism and not as a display of existing settings.

User-facing findings should, when applicable, communicate:

```text
Problem
Why it matters
Evidence
Recommendation
Expected effect
Alternatives / Trade-offs
Assumptions / Unknowns
```

The review must also identify strengths so users know what not to change.

Avoid an arbitrary overall 0–100 architecture score until a calibrated, meaningful scoring contract exists.

Long-term evaluation dimensions may include:

- Goal Fit
- Agent Design
- Task Design
- Orchestration
- Context & Data Flow
- Tool Design
- Model Strategy
- Output Contracts
- Reliability & Recovery
- Human Control
- Security & Side Effects
- Maintainability
- Scalability / Modularity
- Resource Efficiency
- Portability / Compatibility
- Testability
- Observability

UI may group these into a smaller number of understandable pillars.

---

# 7. Intent and Constraint Profile

Long-term evaluation should judge a workflow against the user's actual purpose and constraints, not against generic best practices alone.

The product should eventually represent concepts such as:

- objective
- success criteria
- prototype vs production
- reliability priority
- low-cost preference
- latency sensitivity
- local-only constraint
- security sensitivity
- human approval required
- network forbidden
- external mutation forbidden
- model/provider constraints
- portability requirements

Missing intent remains Unknown. AI may infer likely purpose for explanation, but inferred intent must not silently become persisted truth.

Current packets may intentionally defer persisted Workflow Intent.

---

# 8. Improvement and Safe Transformation

## Stage: Guided Improvement

An evaluation finding should be able to produce one or more improvement directions, for example:

- minimal change
- reliability-first
- lower complexity
- stronger human control
- lower resource use

A proposal is advisory and does not modify the workflow.

## Stage: Semantic Patch

Domain-level operations should express meaningful changes rather than expose raw JSON diff as the primary user model.

Potential operations include:

- add/update/remove agent
- add/update/remove task
- add/remove dependency
- assign/reassign agent
- bind/unbind tool
- update output contract
- update intent/constraint
- add approval requirement
- create/move visual group where appropriate

Each semantic proposal should be bound to a `baseRevision` or equivalent stale-detection identity before apply.

## Before / After

Improvement UX must show benefits **and regressions/trade-offs**, not only a positive sales-style summary.

---

# 9. Large Workflow Model

Three concepts must remain distinct:

```text
Visual Group ≠ Semantic Module ≠ Runtime Orchestration
```

## Visual Group / Department

Presentation/logical organization for navigating a large canvas. Collapse/expand must not silently alter execution semantics.

## Semantic Module

Reusable workflow subgraph with explicit inputs/outputs/requirements/versioning.

## Runtime Orchestration

Framework execution structures such as CrewAI Crew/Flow or future target-specific orchestration.

Large-workflow UX should eventually include:

- outline/tree navigator
- nested grouping
- collapse/expand
- semantic zoom
- search/filter
- dependency path isolation
- issue-only view
- group-level finding summaries
- Locate → Expand → Focus

---

# 10. Permission, Side-effect, and Policy Direction

The semantic model should eventually be able to represent tool/action capabilities including:

- network
- filesystem read/write
- external API
- external mutation
- credential access
- sensitive-data access
- human approval requirement
- reversibility / impact scope

Unknown custom-tool capability remains Unknown rather than guessed safe.

Policy Packs may eventually express policies such as:

- Local-only
- No external mutation
- Human approval required
- Approved models only
- Data handling constraints
- Structured output required

Policy outcome can use explicit states such as `PASS / REVIEW / BLOCK`. Policy enforcement should not exist only inside an LLM prompt.

---

# 11. Portability and Build Direction

Long-term portable project shape may include:

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

The workflow source is authoritative; generated framework code is a build artifact.

Build metadata should eventually track source revision, schema/compiler versions, target framework/capability snapshot, requirements, compatibility/lossiness, generated files, and artifact hashes.

---

# 12. Headless Core

Core semantics and deterministic analysis must not become React-only logic.

Long-term machine interfaces may support:

```text
agentgraph validate
agentgraph analyze
agentgraph evaluate
agentgraph diff
agentgraph policy
agentgraph compatibility
agentgraph build
```

The same core contracts should serve Visual UI, CLI, CI, coding agents, and future integrations.

---

# 13. Runtime Evidence Direction

Execution Preview is not runtime simulation, and static evaluation is not runtime evidence.

Long-term evaluation expands from design-time evidence to observed behavior:

- expected path vs actual path
- expected tool vs invoked tool
- predicted bottleneck vs observed latency
- expected retry risk vs observed retries
- configured approval vs actual approval behavior
- resource estimate vs observed use
- expected side effects vs observed side effects

Use adapter-oriented observability rather than requiring proprietary tracing. OpenTelemetry and framework-native traces are natural integration directions, subject to current standards at implementation time.

Runtime failures should eventually feed curated evaluation/regression fixtures rather than only dashboards.

---

# 14. Distribution and Marketplace

Marketplace is **Conditional / Business Validation Required**, not a prerequisite for product completion.

Reusable artifact contracts should be useful even without a marketplace, e.g.:

- Workflow Package
- Module Package
- Policy Pack
- Evaluation Pack

Possible package metadata:

- name/version
- source/schema version
- intent/use case
- inputs/outputs
- dependencies
- required tools/models
- permissions
- target compatibility
- provenance
- evaluation snapshot
- license/publisher

Marketplace monetization, creator payouts, hosted runtime/control plane, and machine-economy concepts must not be frozen into durable product contracts before demand is validated.

---

# 15. Feature Status Vocabulary

Always distinguish:

- **Current Product** — exists in current Production
- **Planned** — selected/roadmapped but not necessarily implemented
- **Long-term Vision** — architecture direction, not current commitment
- **Conditional / Business Validation Required** — only pursue with evidence of demand/value

Never describe a roadmap feature as current Production functionality.

---

# 16. Durable Non-goals

Unless explicitly revisited through Product Architecture decision:

- do not optimize development priority around marketing/growth dashboards
- do not make proprietary hosted execution mandatory
- do not equate more agents with better architecture
- do not collapse deterministic evidence and AI judgement into one opaque score
- do not silently auto-fix semantic workflow meaning
- do not silently degrade semantics when compiling to a target
- do not treat visual grouping as runtime orchestration
- do not require proprietary AgentGraph observability for runtime insight

---

# 17. Product Completion Standard

AgentGraph Studio approaches its intended final form when a user can take a workflow from design or import through:

```text
Understand
→ Evidence-backed Evaluation
→ Explainable Improvement Options
→ Safe User-controlled Change
→ Re-verification
→ Compatibility-aware Build
→ User Ownership
→ Optional Runtime Feedback
```

while maintaining provenance, portability, reproducibility, and clear boundaries between deterministic fact, AI inference, external-dependent knowledge, and unknowns.
