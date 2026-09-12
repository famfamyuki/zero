# AgentGraph Studio — Final UI Visual Target

Status: **Conceptual long-term visual reference**  
Scope: A non-binding visual target for the mature AgentGraph Studio product experience.  
Authority: Subordinate to `docs/PRODUCT_MASTER.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md`, `docs/roadmap/MASTER_ROADMAP.md`, `docs/roadmap/EXECUTION_GATES.md`, and the active packet selected through `docs/roadmap/PROGRAM_BOARD.md`.

> This reference is deliberately **not** current Product state, current Sprint scope, a roadmap promotion, an implementation-ready specification, or evidence that any depicted future capability exists.

## 1. Why this reference exists

The generated UI image from the 2026-09-12 planning session is retained as a North Star-style design reference so future Product / UX work has a concrete picture of what a mature AgentGraph Studio could feel like.

The target is not the exact pixels. The durable value is the information architecture and hierarchy:

```text
Understand
→ Evaluate
→ Improve
→ Verify
→ Own
```

The mature product should feel like an engineering workspace around a versioned workflow artifact, not merely a visual graph editor.

Repository vector reference:

- `docs/assets/final-ui-target.svg`

Planning-session high-fidelity image identity:

- generated: 2026-09-12
- original session filename: `エージェントグラフの証拠ワークスペース.png`
- dimensions: `1586 × 992`
- SHA-256: `04576210b911c4c121d9288dd4f047d9eebf20fc6d0d82369eec7aba1cb4e10f`

The PNG itself is not authoritative Product evidence. The repository SVG and this document preserve the intended composition and semantics in a versionable form.

## 2. Visual direction

Preserve the existing AgentGraph Studio visual lineage unless a later UX packet explicitly changes it:

- dark navy / slate engineering-tool surface;
- restrained indigo / violet / emerald / teal accents;
- strong status hierarchy rather than decorative color;
- dense desktop information layout that remains understandable rather than dashboard-for-dashboard's-sake;
- clear visual distinction between deterministic evidence, advisory AI judgement, proposals, validation, and observed runtime evidence;
- no implication that a score, confidence percentage, framework target, account state, or runtime claim is real merely because it appears in a conceptual mock.

The UI should look like a durable engineering workbench for AI workflow architecture, evidence, change control, build portability, and later runtime comparison.

## 3. Primary workspace model

The long-term top-level workspaces remain those defined by Product Master:

```text
Design
Review
Changes
Evidence
Build
History
Runtime
Library
```

The conceptual image uses `Evidence` as the active workspace because Evidence is the clearest visual expression of the Product's durable differentiation. This does **not** mean Evidence must be the default landing workspace.

### Design

Create, import, inspect, and edit workflow architecture and intent.

### Review

Present evidence-grounded architecture evaluation, strengths, weaknesses, uncertainties, and fix-first guidance.

### Changes

Compare improvement proposals, semantic patches, risks, validation outcomes, and before/after meaning before user-controlled apply.

### Evidence

Unify inspectable engineering records from deterministic analysis, architecture evaluation, accepted/proposed semantic change, build compatibility, and later imported runtime evidence.

### Build

Expose target capability, compatibility, lossiness, build manifest, generated artifacts, and portable project export.

### History

Show workflow revisions, semantic diffs, evaluation history, build provenance, and change provenance.

### Runtime

Later capability for imported traces/metrics and Design vs Actual comparison. Static configured expectations must never be presented as observed runtime truth.

### Library

Templates, reusable modules, policy/evaluation packages, and only later distribution/marketplace behavior where explicitly validated and selected.

## 4. Core desktop composition

The target desktop composition has four persistent layers.

### A. Global header

The header should make the current artifact and Product lifecycle legible at all times:

- AgentGraph Studio identity;
- active primary workspace;
- workflow/project context;
- revision/version identity where applicable;
- search / quick navigation where justified;
- concise status indicators;
- the North Star should be reflected through behavior and information architecture rather than repeated as marketing copy everywhere.

Account/workspace chrome shown in any conceptual render is **not** authorization for cloud persistence, collaboration, RBAC, or account-bound workflow storage. Those remain subject to Product, Data/AI Governance, Security, and roadmap gates.

### B. Left workflow outline / navigator

A mature large-workflow experience should support an outline/tree that can help the user navigate:

- semantic workflow objects;
- visual groups where they exist;
- agents;
- tasks;
- tools/integrations;
- approval/control boundaries;
- later modules where explicitly introduced.

The intended interaction model is:

```text
Search / Locate / Focus
```

This must preserve the semantic boundary:

```text
Visual Group ≠ Semantic Module ≠ Runtime Orchestration
```

The navigator is for understanding and locating architecture; it must not silently create execution meaning.

### C. Main evidence / work area

The center area should prioritize the engineering record. A mature Evidence workspace may present a progression such as:

```text
Static Analysis
→ Architecture Review
→ Semantic Change / Preview
→ Build / Compatibility
→ Runtime Evidence
```

These are not equivalent evidence classes. The UI must preserve provenance and epistemic boundaries.

A user should be able to distinguish at a glance:

- deterministic static facts;
- heuristic/advisory AI findings;
- external-dependent claims;
- Known / Inferred / Unknown;
- configured expectation;
- actual observed runtime evidence;
- proposal vs applied revision;
- current revision vs stale evaluation/build result.

### D. Right contextual rail

The right rail is a compact decision-support layer, not a second source of truth. It may surface context such as:

- AI authority / advisory boundary;
- current compatibility/lossiness summary;
- Design vs Actual summary;
- Evidence summary;
- current ownership/export state;
- relevant blockers or unknowns.

The rail should link back to inspectable underlying evidence rather than replace it.

## 5. Evidence-first hierarchy

The visual target should preserve the Product Constitution order:

```text
Workflow Source
→ Deterministic Analysis
→ Evidence
→ AI Reasoning
→ Evaluation
```

The visual hierarchy should therefore make deterministic evidence at least as inspectable as AI prose.

A mature review result should allow a user to trace:

```text
Finding
→ Why it matters
→ Evidence
→ Recommendation
→ Expected effect
→ Alternatives / trade-offs
→ Assumptions / Unknowns
```

AI remains advisory. The UI must not visually imply that model confidence is equivalent to deterministic fact or Product authority.

## 6. Safe change UX target

The conceptual UI includes a Before / After region because semantic-change control is a defining mature-product behavior.

The durable flow remains:

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

The mature Changes experience should make the following visible before apply:

- exact semantic operations;
- base revision / stale state;
- deterministic validation results;
- benefits;
- regressions / trade-offs;
- policy/security implications where applicable;
- compatibility/lossiness implications where applicable;
- user-controlled final apply.

The presence of an `Apply` button in a conceptual mock does **not** grant current Mutation Authority. Mutation Authority remains independently gated by the applicable Execution Gate and selected packet.

## 7. Build and ownership target

The mature UI should make ownership a visible Product outcome rather than an export afterthought.

The intended direction is:

```text
Workflow Source
→ Validate / Evaluate
→ Capability Check
→ Build Manifest
→ Portable Project
→ User Git Repository
→ User Runtime
```

Build UI should eventually communicate target results such as:

- `SUPPORTED`
- `SUPPORTED_WITH_MAPPING`
- `LOSSY`
- `UNSUPPORTED`

No target framework shown in a conceptual mock is automatically selected. CrewAI remains the current primary target. A second target requires the roadmap/gate sequence and must not be implemented merely because it appeared in this reference image.

## 8. Runtime evidence target

The long-term Runtime / Evidence relationship should make `Design vs Actual` easy to understand without collapsing static and runtime truth.

Examples of future comparisons include:

- expected path vs actual path;
- expected tool vs invoked tool;
- predicted bottleneck vs observed latency;
- expected retry risk vs observed retries;
- configured approval vs actual approval behavior;
- resource estimate vs observed use;
- expected side effects vs observed side effects.

Runtime evidence is a long-term direction and remains subject to Data & AI Governance, Security/Reliability, architecture contracts, and an explicitly selected packet.

## 9. Important non-requirements in the reference image

The generated image contains visually useful placeholders that must **not** be copied into implementation requirements without separate evidence and specification.

Specifically:

- arbitrary confidence percentages are illustrative only;
- arbitrary overall health/architecture percentages are illustrative only and conflict with Product rules if treated as uncalibrated Product truth;
- named secondary framework compatibility rows are illustrative only;
- cloud `Personal Workspace` style account chrome is illustrative only;
- multi-user sharing/collaboration is not implied;
- marketplace behavior is not implied;
- runtime traces are not implied as current Product capability;
- AI-assisted apply is not implied as current Mutation Authority;
- any counts, timestamps, version numbers, pass/fail totals, or score values in the mock are presentation placeholders;
- no visual element overrides the active packet, Execution Gates, Security/Data governance, or live repository/Production reality.

## 10. Responsive and accessibility direction

The dense desktop target must not become desktop-only Product architecture.

Future packets implementing portions of this target should explicitly define:

- keyboard navigation;
- focus order and restoration;
- non-color-only status communication;
- screen-reader naming and announcements;
- responsive collapse priorities;
- which panels become drawers / tabs / sequential views on narrow screens;
- how Before / After and evidence provenance remain understandable on mobile;
- reduced-information views without hiding semantic warnings or Unknowns.

The objective is not to display every panel simultaneously at every breakpoint. The objective is to preserve Product meaning and decision context.

## 11. Relationship to roadmap and active work

This reference does not change the current execution state.

As of the repository baseline from which this reference was recorded:

- deterministic free core remains the protected current foundation;
- the bounded GPT-6 Astra Challenge launch-hardening packet is separately selected and does not inherit this long-term scope;
- Stage 1 / paid Architecture Review lifecycle remains governed by its active packets and commercial blockers;
- Gate A / later Stage 1.5 selection / Gate B / Stage 2 / Gate C / Stage 3 remain governed by `MASTER_ROADMAP.md` and `EXECUTION_GATES.md`;
- AI Authority remains capability-scoped;
- Mutation Authority remains independently gated.

Nothing in this visual reference may be used to pull future work into the active Sprint automatically.

## 12. How future teams should use this reference

Use this file during Product/UX specification as a **directional composition test**, not as a pixel-copy mandate.

For any future packet, ask:

1. Which part of the North Star loop does this capability strengthen?
2. Is the relevant upstream Stage/Gate satisfied and explicitly selected?
3. What is deterministic evidence vs AI interpretation vs external/runtime evidence?
4. Does the proposed UI preserve Known / Inferred / Unknown?
5. Does it prevent silent semantic mutation?
6. Does it make user ownership clearer?
7. Does it remain simpler than an equally effective alternative?
8. Does the visual target need to change because real usage evidence now supports a better design?

If evidence later proves a different UI is better, change this target. The image is a planning aid, not a permanent design constraint.
