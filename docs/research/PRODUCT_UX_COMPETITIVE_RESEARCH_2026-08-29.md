# AgentGraph Studio — Product / UX Competitive Research

Status: **Research Evidence / Proposal — Non-authoritative, not integrated into the Product plan**  
Date: **2026-08-29**  
Research baseline: GitHub `main` at `2878173cca1f29ff1ea9f3b54c64c9cba45b91a3`  
Intended consumer: **01 Product Architecture & Roadmap**, then **02 UX & Implementation Specification** only after an explicit selection  

## 0. Authority and scope boundary

This document preserves competitive research, Production observations, and Product/UX proposals for a future 01 review.

It is deliberately separate from:

- `docs/PRODUCT_MASTER.md`;
- `docs/ARCHITECTURE.md`;
- `docs/roadmap/MASTER_ROADMAP.md`;
- `docs/roadmap/PROGRAM_BOARD.md`;
- `docs/CURRENT_STATE.md`;
- active implementation packets under `docs/specs/`.

This document does **not**:

- select a new capability;
- change a roadmap stage or gate;
- change Current State;
- authorize implementation;
- authorize Stage 2;
- expand AI Authority;
- expand Mutation Authority;
- change an active packet;
- supersede any durable Product, Architecture, Roadmap, Risk, or governance document.

Any future use must follow:

```text
Research Evidence
→ 01 Gate / Product review
→ Explicit SELECT / HARDEN_FIRST / FOUNDATION_FIRST / DEFER
→ 02 specification only if selected
```

## 1. Current-state facts preserved by this research

At the research baseline:

```text
CrewAI Static Import v0 = Sprint Complete / Production Verified
post-completion 01 review = complete
Explicit Next Selection = DEFER
Selected next capability = NONE
Additional Stage 1.5 packet = NONE
Stage 2 = NOT SELECTED
AI Authority = UNCHANGED
Mutation Authority = UNCHANGED
```

The Stage 1 Architecture Review / Paid Access track remains held and QA incomplete. It must not be represented as a Production capability or as permission to expand evaluator authority.

## 2. Executive conclusions

1. Current Production is most likely to be perceived as a polished **CrewAI visual workflow builder with Preflight**, rather than as a **Portable AI Workflow Architecture Engineering Toolchain**.
2. The Canvas is valuable and should remain an important design and comprehension surface, but it should not necessarily remain the Product's sole or dominant entry point.
3. Existing deterministic Preflight is a strong differentiator. In particular, the UI distinguishes validation, readiness guidance, static execution planning, resource structure, and runtime Unknowns.
4. The nearest Product opportunity is not a larger feature set. It is making existing evidence easier to understand through clearer positioning, entry hierarchy, finding structure, issue location, and responsive review UX.
5. The North Star should become an information architecture and artifact-lifecycle model, not only marketing copy:

   ```text
   Entry → Understand → Evaluate → Improve → Verify → Own
   ```

6. Competitors are strongest where they connect findings, runs, or traces to an exact location and provide comparison/history. AgentGraph should learn from these interaction patterns without copying hosted-runtime or opaque-AI authority models.
7. AgentGraph should not compete primarily as a generic automation platform, hosted workflow runtime, integration marketplace, or one-prompt workflow generator.
8. A plausible repeat-use thesis is **repeated verification of changing source/workflow artifacts**, rather than repeated manual diagram creation. This remains an inference pending Production evidence.

## 3. Production UX observations

Production observed: <https://zero-six-khaki.vercel.app/>

### 3.1 First impression

The Production title and hero communicate:

- Preflight Engineering for CrewAI workflows;
- visual design;
- deterministic Python export;
- JSON or CrewAI import;
- readiness, execution structure, and resource implications before running.

Within approximately 5–10 seconds, a user can reasonably identify CrewAI, a visual graph, Preflight, and export. The following are much less visible:

- the broader portable architecture-engineering direction;
- deterministic Evidence as the core Product asset;
- the difference between configured, static, inferred, and observed facts;
- the fact that the Canvas is one interface to a workflow artifact rather than the Product definition;
- the long-term Understand → Evaluate → Improve → Verify → Own loop.

The visual area is dominated by the Canvas. This is the primary reason the Product appears more like a workflow builder than an architecture engineering toolchain.

### 3.2 First value

Production starts with a minimal supported Crew example rather than a completely empty canvas. This reduces blank-state friction.

Available entry actions include:

- templates;
- JSON import;
- CrewAI Python static import;
- manual node creation;
- deterministic Python export.

Observed friction:

- the four start paths are not presented as an explicit choice based on what the user already has;
- CrewAI Static Import is visually one header action among many despite its importance to source-first first value;
- the initial sample does not clearly explain what the user should learn by reviewing it;
- after Preflight, there is no explicit guided loop from highest-priority finding to target, edit, re-evaluation, and ownership;
- Export has high visual prominence before the user has necessarily understood or evaluated the workflow.

### 3.3 Builder

Observed strengths:

- Agent, Task, and Tool node types are visually distinct;
- the desktop three-column palette / Canvas / inspector composition is understandable;
- node edit actions, connection legend, minimap, zoom, fit, and fullscreen are present;
- the selected workflow begins small enough to understand.

Observed or inferred friction:

- Canvas, templates, global settings, and many header actions compete for attention;
- the inspector's selected-target state and global-config state could be more explicit;
- large-workflow comprehension is likely to degrade as node cards remain large and the Canvas remains the main navigation model;
- Locate is present, but the UI could make the relationship between a selected finding, its target, and the relevant path more persistent.

### 3.4 Analysis experience

Unified Preflight currently exposes:

```text
Overview
├─ Readiness
├─ Execution
└─ Resources
```

Important strengths:

- Readiness states that it is non-blocking guidance and distinct from validation.
- Findings expose impact, target, suggested action, Locate, and Details.
- Execution states that it is a static code-generation plan and that nothing is executed or simulated.
- Resources states that it is static analysis and does not predict runtime cost or timing.
- Runtime cost, duration, token consumption, actual tool calls, tool duration, and actual iteration count are explicitly listed as Unknown from static configuration alone.
- Ruleset/analysis versions are visible.

Primary UX gap:

Findings do not yet consistently read as a complete engineering diagnostic object answering:

```text
What happened?
Why?
Where?
How important?
What evidence supports it?
What should I do next?
What remains Unknown?
```

### 3.5 Import and export

Production exposes JSON import/export, CrewAI Python static import, and deterministic CrewAI Python export.

The architecture direction is coherent:

```text
External supported source
→ static parse
→ semantic mapping
→ diagnostics / provenance
→ existing canonical projection
→ deterministic analysis
→ deterministic export
```

The Product experience can make this value more visible by treating Source and Mapping as part of the user's journey rather than only as a header action.

This research did not upload a private project or claim unsupported import behavior. Detailed mapping-report interaction beyond repository specifications remains outside direct Production observation.

### 3.6 Responsive and accessibility

At a 390 × 844 viewport:

- a mobile header and bottom action bar are present;
- Preflight remains reachable;
- the Canvas shows mobile-specific interaction guidance;
- the bottom action row extends horizontally beyond the visible viewport;
- the initial Task is outside the first visible Canvas region;
- a sticky support banner reduces the usable vertical area.

The DOM exposes useful accessibility semantics for the Canvas, Preflight complementary region, tabs, tabpanels, Locate actions, and Canvas controls. This research did not complete a formal keyboard or screen-reader audit.

## 4. Competitive landscape

### 4.1 AI workflow and agent builders

#### Langflow

Known from current official documentation:

- Projects contain flows.
- Users can create a blank flow, use a template, duplicate, or import.
- The visual editor is paired with a Playground, Logs, Share, API, MCP, and export.
- Components use an inspector with progressive disclosure.
- A user can inspect individual component output after a run.

Sources:

- <https://docs.langflow.org/concepts-overview>
- <https://docs.langflow.org/concepts-flows>
- <https://docs.langflow.org/next/logging>

#### Flowise

Known from current official documentation:

- Assistant, Chatflow, and Agentflow provide explicit complexity tiers.
- The platform combines visual building, tracing, evaluation, human-in-the-loop, API/SDK, and workspaces.

Source: <https://docs.flowiseai.com/>

#### Dify

Known from current official documentation:

- A workflow can be tested as a whole or by running an individual step.
- Cached variables support targeted debugging without restarting the entire flow.
- Last-run logs help locate a failing node.

Source: <https://docs.dify.ai/en/guides/application-orchestrate/creating-an-application>

#### LangSmith Studio / LangGraph tooling

Known from current official documentation:

- Studio visualizes source-defined graph architecture.
- It connects graph view with threads, intermediate states, tool calls, traces, prompt iteration, experiments, and time travel.
- Graph mode and simpler Chat mode serve different audiences.

Sources:

- <https://docs.langchain.com/langsmith/studio>
- <https://docs.langchain.com/oss/python/langgraph/use-time-travel>

#### Vellum AI development platform

Known from current official documentation:

- Workflow Sandbox, Evaluations, Deployments, and execution monitoring are separate but connected surfaces.
- Deployments create versioned releases; inputs, outputs, latency, and step details are logged.
- Read-only workflow diagrams are reused in evaluation, release, and execution contexts.
- Historical definitions can be restored into a new editable version rather than silently edited in place.

Sources:

- <https://docs.vellum.ai/product/workflows/introduction>
- <https://docs.vellum.ai/changelog/2024/2024-03>
- <https://docs.vellum.ai/changelog/2024/2024-05>

### 4.2 Automation and workflow tools

#### n8n

Known pattern:

- execution history is connected to workflow debugging;
- previous execution data can be retried against the currently saved workflow.

Source: <https://docs.n8n.io/workflows/executions/all-executions/>

#### Make

Known pattern:

- errors and warnings are distinguished;
- the affected module is highlighted directly in the scenario;
- the user can inspect the bundle, error origin/type/message, and handling outcome;
- scenario history combines runs and change logs.

Sources:

- <https://help.make.com/introduction-to-errors-and-warnings>
- <https://help.make.com/scenario-history>

#### Pipedream

Known pattern:

- the inspector lists workflow events;
- an event opens its step-by-step execution logs;
- an error links to the exact workflow step;
- events can be replayed;
- Event History supports workflow/status/time filtering.

Sources:

- <https://pipedream.com/docs/workflows/building-workflows/inspect>
- <https://pipedream.com/docs/workflows/event-history>

#### Zapier Canvas

Known pattern:

- the Canvas is also used for process/system planning, not only executable automation;
- groups, collapse, human steps, split paths, auto-layout, and activity/ROI metadata help explain systems.

Source: <https://zapier.com/blog/zapier-canvas-guide/>

### 4.3 AI evaluation and observability

#### LangSmith

Known pattern:

- datasets, experiments, evaluators, scores, and execution traces are connected by test case;
- multiple application versions can be compared against the same dataset;
- offline and online evaluation are treated as distinct evidence contexts.

Sources:

- <https://docs.langchain.com/langsmith/evaluation-concepts?mode=ui>
- <https://docs.langchain.com/langsmith/evaluation-types>

#### Braintrust

Known pattern:

- an experiment is compared with a selected baseline;
- each test case exposes score deltas and improved/regressed status;
- diff and aggregate views answer both local and overall change questions.

Source: <https://www.braintrust.dev/docs/evaluate/compare-experiments>

#### Arize Phoenix

Known pattern:

- traces are used to understand a run;
- datasets group examples;
- experiments compare versions on the same inputs;
- observed failure modes can be encoded as evaluators for future regression detection;
- deterministic code evaluators and LLM-based evaluators are distinct.

Sources:

- <https://arize.com/docs/phoenix/quickstart>
- <https://arize.com/docs/phoenix/datasets-and-experiments/how-to-experiments/run-experiments>

#### Humanloop

Known pattern:

- Prompt configuration, Version, Log, Dataset, Evaluator, and Evaluation are separate concepts;
- multiple versions are compared on the same task and criteria.

Sources:

- <https://humanloop.com/docs/explanation/prompts>
- <https://humanloop.com/docs/v5/guides/evals/run-evaluation-ui>

## 5. Best patterns to learn from

### 5.1 Finding-to-location navigation

Learn from Make, Pipedream, IDE Problems panels, and trace viewers:

```text
Finding list
→ select finding
→ persistent target highlight
→ relevant path/edge emphasis
→ evidence/details in context
→ return to finding
```

AgentGraph already has Locate. The opportunity is to make location a persistent part of explanation rather than a momentary convenience action.

### 5.2 Separate authoring, evaluation, and release/ownership surfaces

Vellum's Sandbox / Evaluations / Deployments pattern demonstrates that the same graph can be shown in multiple contexts without making the Canvas the only application shell.

For AgentGraph, the analogous long-term separation may be:

```text
Source / Mapping
Design
Review
Verification
Export / Ownership
```

This is an IA proposal, not a selection of Project, History, or new persistence.

### 5.3 Baseline comparison and regression-first review

Braintrust demonstrates that history becomes valuable when it answers:

- what improved;
- what regressed;
- which examples changed;
- what the baseline was.

If AgentGraph later gains revision/evaluation history, its value should center on deterministic finding delta, Unknown changes, compatibility changes, and unresolved regressions rather than merely listing timestamps.

### 5.4 Turn observed failures into repeatable evidence

Phoenix, Braintrust, and Vellum connect Production traces/executions to future evaluation datasets or test cases.

The AgentGraph-compatible long-term form is:

```text
Observed runtime evidence
→ scenario / regression-fixture candidate
→ compare designed expectation, static evidence, and observed behavior
```

Runtime Evidence remains future scope and must follow the existing data/AI governance contracts.

### 5.5 Progressive disclosure

Use progressive disclosure to distinguish:

- basic semantic fields;
- engineering controls;
- target-specific configuration;
- evidence/provenance;
- advanced or unsupported semantics.

Do not use progressive disclosure to hide lossiness, material Unknowns, security implications, or authority boundaries.

### 5.6 Read-only history with explicit restore

If history is selected later, past revisions should be read-only. Editing an old state should create a new revision/restored branch of work rather than silently rewrite historical evidence.

## 6. Patterns not to copy

1. Prompt-to-graph generation that applies changes without evidence, semantic diff, validation, and explicit user control.
2. Treating visual grouping as execution or module semantics.
3. Treating a successful run as proof of architecture quality or scenario correctness.
4. Competing on integration-marketplace breadth.
5. Making a proprietary hosted runtime the center of Product value.
6. Presenting an arbitrary overall architecture score without calibrated benchmark evidence.
7. Mixing deterministic findings and AI recommendations without visible ownership, evidence class, and knowledge status.
8. Creating cloud lock-in solely to manufacture repeat use.
9. Weakening free deterministic Preflight to create an artificial AI-paywall upgrade moment.
10. Copying opaque AI mutation simply because it creates a faster demo.

## 7. Competitive comparison matrix

| Dimension | Current AgentGraph Studio | Competitor pattern | Gap | Opportunity | Copying risk |
|---|---|---|---|---|---|
| Positioning | CrewAI Preflight, visual design, export | Outcome/runtime/evaluation-first | Toolchain identity is weak | Lead with architecture evidence and ownership | Abstract enterprise language |
| First Value | Sample, templates, imports | Guided template/import/test event | Recommended path unclear | Existing source / example / manual choice | Wizard overload |
| Onboarding | Direct Canvas entry | Project/template/import entry | JTBD not explicit | Source-first onboarding | More choices without guidance |
| Builder | Three-column Canvas | Typed ports, shortcuts, auto-layout | Density and context state | Selection breadcrumb, compact/focus modes | Generic-builder competition |
| Navigation | Header actions and panels | Project and lifecycle surfaces | Product lifecycle not visible | Source / Design / Review / Export grouping | Implied unselected capabilities |
| Inspector | Node or global config | Context-specific inspectors | Selected context could be stronger | Target header and field grouping | UI-driven domain changes |
| Diagnostics | Readiness findings | Problems/error/trace panels | Evidence anatomy incomplete | What/Why/Where/Impact/Next | Mixing AI/deterministic output |
| Evidence | Ruleset/version/Unknowns | Trace and test-case evidence | Provenance is distributed | Evidence/source facts drawer | Raw-data overload |
| Issue location | Locate action | Error-to-step/span-to-node | Focus may be transient | Persistent issue-selected mode | Visual scope becomes semantics |
| Comprehension | Canvas + Execution Preview | Outline, trace path, read-only graph | Few non-Canvas views | Summary and execution outline | Premature semantic model |
| Import | JSON and bounded CrewAI static import | Native flow/project import | Value/provenance entry is quiet | First-class Source & Mapping journey | Overclaiming unsupported semantics |
| Export | JSON and CrewAI Python | API/deploy/embed/runtime | Compatibility/lossiness story can grow | Preserved/lost/unknown summary | Hosted-runtime competition |
| Evaluation | Deterministic Preflight | Datasets/experiments | No comparison/history | Improve current diagnostic UX first | Premature Stage 2 |
| History | Session-oriented | Revision/run/evaluation history | Repeat verification unsupported | Research demand and triggers | Auto-selecting persistence |
| Persistence | Local/current baseline | Cloud projects/workspaces | Stable identity may become needed | Evidence-gathering candidate | Lock-in/schema migration |
| Collaboration | Not central | Comments/RBAC/share | No team review | Later, conditional | Premature enterprise scope |
| AI interaction | Held advisory design | Copilots generate/change | Not in Production | Evidence-grounded differentiation | Authority expansion |
| Mutation safety | No silent mutation; gated future | Direct AI edits | Safe current boundary | Preserve proposal/diff direction | Copying demo speed |
| Accessibility | Useful ARIA baseline | Product-dependent | Formal audit incomplete | Task-based keyboard/SR audit | Visual-only interactions |
| Responsive | Mobile shell and Canvas | Often monitor/review-first | Overflow and exploration friction | Mobile review-first | Full authoring parity |
| Monetization | Deterministic core remains free | Usage/history/team/runtime tiers | Future message conflict possible | Explain capability boundary | Artificial feature hiding |

## 8. Proposed Product experience

This section is a future IA proposal. Any screen requiring an unselected capability is explicitly conditional.

### 8.1 Entry

```text
What do you have?
├─ Existing supported CrewAI source
│  └─ Import and inspect mapping
├─ Existing AgentGraph JSON
│  └─ Open portable workflow
├─ I want to explore
│  └─ Open an annotated example
└─ I want to design
   └─ Start manually
```

### 8.2 Understand

Show a workflow summary before requiring Canvas interpretation:

- source type;
- process;
- agent/task/tool counts;
- import mapping state;
- deterministic evidence availability;
- primary execution outline;
- runtime facts that are unavailable;
- CTA to open visual design.

Canvas remains a strong view inside Understand/Design, not necessarily the sole Home.

### 8.3 Evaluate

Organize Preflight around user questions:

```text
Can it be exported?
What will happen statically?
What deserves attention?
What cannot be known here?
```

Use a stable finding anatomy:

```text
What happened?
Why does it matter?
Where is it?
Evidence owner/type/version
Impact
Suggested user action
Remaining Unknowns
```

Architecture Review remains conditional on the held Stage 1 release satisfying its unchanged gates.

### 8.4 Improve

Current safe interaction:

```text
Select finding
→ Locate target
→ user edits in Inspector
→ result becomes stale
→ user explicitly re-evaluates
```

No AI-generated proposal or mutation is implied.

### 8.5 Verify

Current-capability direction:

- re-run deterministic Preflight;
- show current/stale analysis state;
- confirm export eligibility;
- identify active ruleset/analysis version.

Conditional/future:

- before/after finding delta;
- revision comparison;
- target compatibility;
- Scenario verification;
- Design Evidence vs Runtime Evidence.

### 8.6 Own

Current:

- JSON portability;
- deterministic CrewAI Python export;
- user-owned source/runtime direction.

Future/conditional:

- Build Manifest;
- compatibility/lossiness report;
- CLI/CI;
- Git-friendly semantic diff.

### 8.7 Possible future IA

```text
Home
└─ Start / Resume
   ├─ Import Source
   ├─ Open JSON
   ├─ Example
   └─ Manual Build

Workflow
├─ Overview
├─ Source & Mapping
├─ Design
│  ├─ Canvas
│  ├─ Outline [Conditional]
│  └─ Inspector
├─ Review
│  ├─ Findings
│  ├─ Execution
│  ├─ Resources
│  └─ Architecture [Conditional: held Stage 1]
├─ Export
└─ History [Conditional: not selected]
```

Do not introduce Project/Workspace as a committed navigation concept unless 01 explicitly selects the required identity/persistence foundation.

## 9. Proposal classification

### A. UI polish

- Reframe hero hierarchy around Import → Understand → Preflight → Own.
- Group header actions by Start / Review / Export intent.
- Explain CrewAI supported-subset import value near the action.
- Standardize finding cards around What / Why / Where / Impact / Next.
- Create shared visual vocabulary for Static, Configured, Known, Inferred, Unknown, and Not Observed.
- Replace mobile action overflow with explicit priority plus More.
- Reduce competition from the mobile support banner during review.

### B. UX restructuring

- Reframe initial entry as Existing Source / Example / Manual Build.
- Make Preflight Overview prioritize user questions and actionable findings.
- Add a persistent issue-selected mode connecting finding, target, path, and inspector.
- Treat Canvas as a Design view within a broader workflow experience.
- Optimize mobile for review, location, and inspection before full authoring parity.

### C. Product capability candidates — not selected

- lightweight workflow outline/search;
- revision/evaluation delta;
- persisted Intent & Constraints;
- dedicated Review Workspace/Locate foundation;
- Scenario/Acceptance persistence.

### D. Architecture-affecting proposals — not selected

- stable Project / Workflow / Semantic Revision / Layout identity;
- source/import provenance attached to revisions;
- persistent evaluation history;
- any persistence or provider-boundary expansion.

### E. Future vision

- Design Evidence vs Runtime Evidence;
- CLI/CI and machine-readable verification;
- Proposal → Semantic Patch → Validation → Preview → User Apply;
- framework-neutral compilation only after its existing gate;
- conditional collaboration/distribution.

## 10. Opportunity assessment

Scale:

- Value/impact: High / Medium / Low.
- Dependency/complexity/risk: High means greater burden or risk.

| ID | Class | Proposal | User value | First-value | Repeat-use | Differentiation | Architecture dependency | Complexity | Migration risk | Security/data risk | AI authority impact | Mutation impact | Regression risk | Confidence | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 | UI polish | Hero/value hierarchy | High | High | Medium | High | Low | Low | Low | Low | Low | Low | Medium | High | Production, docs |
| A2 | UI polish | Header action grouping | High | High | Low | Medium | Low | Medium | Low | Low | Low | Low | Medium | High | Production, competitor |
| A3 | UI polish | Import value and supported boundary | High | High | Medium | High | Low | Low | Low | Low | Low | Low | Low | High | Production, docs |
| A4 | UI polish | Stable finding anatomy | High | High | Medium | High | Low | Medium | Low | Low | Low | Low | Medium | High | Production, competitor |
| A5 | UI polish | Evidence-status vocabulary | High | Medium | Medium | High | Low | Medium | Low | Low | Low | Low | Medium | High | Production, docs |
| A6 | UI polish | Mobile action prioritization | High | High | Medium | Low | Low | Medium | Low | Low | Low | Low | Medium | High | Production |
| B1 | UX restructuring | Source/example/manual entry | High | High | Medium | High | Low | Medium | Low | Low | Low | Low | Medium | High | Production, competitor, docs |
| B2 | UX restructuring | Finding-first Preflight Overview | High | High | Medium | High | Low | Medium | Low | Low | Low | Low | Medium | High | Production, competitor |
| B3 | UX restructuring | Persistent issue-selected mode | High | Medium | High | High | Low–Medium | Medium | Low | Low | Low | Low | Medium | Medium | Production, competitor, inference |
| B4 | UX restructuring | Canvas as Design view | High | High | Medium | High | Medium | High | Low–Medium | Low | Low | Low | High | Medium | Production, docs, inference |
| B5 | UX restructuring | Mobile review-first | High | High | Medium | Medium | Low–Medium | Medium | Low | Low | Low | Low | Medium | High | Production, competitor |
| C1 | Capability candidate | Outline/search | High | Medium | High | High | Medium | Medium | Low | Low | Low | Low | Medium | Medium | Competitor, docs, inference |
| C2 | Capability candidate | Evaluation/revision delta | High | Low | High | High | High | High | Medium–High | Medium | Medium | Low | High | Medium | Competitor, docs, inference |
| C3 | Capability candidate | Persisted Intent/Constraints | Medium–High | Medium | High | High | High | High | High | Medium–High | Medium–High | Low | High | Low–Medium | Docs, inference |
| D1 | Architecture-affecting | Stable artifact/revision identity | High | Low | High | High | High | High | High | High | Low | Low | High | Medium | Docs, competitor |
| E1 | Future | Design vs Runtime Evidence | High | Low | High | High | High | High | High | High | Medium | Medium | High | Medium | Docs, competitor |
| E2 | Future | CLI/CI verification | High | Low | High | High | High | High | Medium | Medium | Low–Medium | Low | High | Medium | Docs, competitor |
| E3 | Future | Safe semantic patch/apply | High | Low | High | High | High | High | High | High | High | High | High | Low for timing | Docs |

None of these assessments constitutes an implementation priority or selection.

## 11. Feature opportunity map

### Current evidence supports further Product discussion

- positioning hierarchy;
- entry-path clarity;
- Preflight finding anatomy;
- static/runtime/Unknown vocabulary;
- issue-to-target navigation;
- mobile action overflow and review-first behavior;
- stronger Import → Preflight journey communication.

### Evidence needed before selecting broader capability work

- CrewAI import start/success/blocked/apply/abandon funnel;
- import-to-Preflight conversion;
- Locate use and edit-after-Locate behavior;
- re-evaluation rate;
- time to export/ownership;
- returning use of the same workflow/source;
- workflow-size navigation friction;
- demand for Canvas alternatives such as outline/search;
- demand among Project, History, Intent, and Review/Locate candidates;
- professional willingness to pay for repeated value rather than one-shot review.

### Later / conditional

- Project / Local Workspace;
- revision/evaluation history;
- persisted Intent & Constraints;
- Scenario/Acceptance persistence;
- review delta;
- large-workflow outline/search/scoped evaluation;
- Runtime Evidence;
- CLI/CI;
- Semantic Patch/Apply;
- collaboration.

### Do not pursue as the primary strategy

- generic integration marketplace;
- proprietary hosted runtime as the core Product;
- framework-count expansion for marketing;
- opaque AI workflow generation;
- unsupported overall score;
- chat-first replacement of architecture interaction;
- cloud collaboration as a prerequisite for local/user-owned value;
- Canvas grouping reused as execution/module semantics.

## 12. Differentiation thesis candidates

### Thesis A

AgentGraph Studio is a portable AI workflow architecture engineering toolchain that shows what is Known and Unknown before execution, evaluates the workflow from deterministic Evidence, and lets the user own the resulting artifact.

### Thesis B

AgentGraph Studio safely reads existing AI workflow source, turns it into inspectable architecture evidence, and helps users understand risks before exporting to their own runtime.

### Thesis C

AgentGraph Studio does not silently let AI rewrite workflow semantics. Evidence, proposals, validation, preview, and user-controlled apply remain separate authority boundaries.

### Thesis D

Other tools help users run AI workflows. AgentGraph Studio helps users understand what they are about to own.

## 13. Proposed Product/UX principles

1. The artifact, not the Canvas, is the Product.
2. Show Evidence before recommendation.
3. Every finding answers What / Why / Where / Impact / Next.
4. Configured, static, inferred, and observed states must look different.
5. Import shortens the path to understanding without hiding conversion loss.
6. Location is part of an explanation, not an optional convenience.
7. The UI reveals the current AI and mutation authority boundary.
8. Re-evaluation makes change consequences visible.
9. Portability remains visible at every ownership boundary.
10. Progressive disclosure reduces cognitive load without hiding material risk or Unknowns.

## 14. Recommended next research

### Production/user evidence

1. Run a five-second comprehension test with approximately five CrewAI users:
   - What is this Product?
   - Who is it for?
   - What can it prove?
   - What should the user do first?
2. Test the complete supported task:

   ```text
   Import
   → Mapping report
   → Apply
   → Preflight
   → Locate
   → Edit
   → Re-evaluate
   → Export
   ```

3. Test mobile as a review/inspection task before assuming mobile authoring parity.
4. Test finding location on approximately 10 / 50 / 100-node workflows.
5. Define the minimum privacy-safe telemetry needed to distinguish demand, failure, and friction.

### Competitive evidence gaps

- authenticated Langflow, Dify, n8n, Vellum, Relevance AI, and Gumloop internal screens;
- current CrewAI Enterprise authoring/review experience;
- direct accessibility and keyboard comparisons;
- actual upgrade/quota moments;
- architecture-visualization products with issue-first UX.

## 15. Known / Inferred / Unknown

### Known

- The research baseline is current GitHub `main` at `2878173cca1f29ff1ea9f3b54c64c9cba45b91a3`.
- CrewAI Static Import v0 is Sprint Complete / Production Verified.
- The post-completion decision is DEFER with no next capability selected.
- Stage 1 remains held/QA incomplete.
- Stage 2 is not selected.
- AI Authority and Mutation Authority are unchanged.
- Production contains templates, JSON import/export, bounded CrewAI static import, Canvas, Inspector, Unified Preflight, and deterministic CrewAI Python export.
- Preflight separates Readiness, Execution, and Resources and explicitly lists runtime Unknowns.
- A mobile shell exists, but the 390px-wide action bar overflows and the Canvas requires exploration to see the full initial workflow.
- The cited competitors currently document the patterns attributed to them above.

### Inferred

- First-time users are likely to categorize AgentGraph primarily as a CrewAI visual builder.
- Canvas-first IA weakens the visibility of source provenance, deterministic evidence, review, verification, and ownership.
- Existing-feature positioning and diagnostic UX are the safest near-term opportunity area.
- Repeat use may be driven more by repeated verification of changing artifacts than by repeated manual diagram creation.
- Static/Unknown/ownership boundaries can become a visible competitive advantage rather than only an internal engineering principle.

### Unknown

- CrewAI import usage, completion, mapping-block, apply, and abandonment rates.
- Whether imported workflows proceed to Preflight and export.
- Whether returning users need to revisit the same workflow.
- Relative demand for Project, History, Intent, and Review/Locate foundations.
- Commercial willingness to pay and repeat-value behavior for Architecture Review.
- Detailed behavior of login-required competitor surfaces not directly accessed during this research.
- Whether users require full mobile authoring or primarily mobile review.

## 16. Handoff to 01 Product Architecture

### Strongest opportunities to review

- Reframe Product meaning from Canvas-first builder to artifact/evidence/ownership toolchain.
- Make Import a first-class first-value entry.
- Standardize Preflight as an evidence-centered diagnostic experience.
- Strengthen finding-to-target comprehension.
- Make mobile review-first.
- Turn portability, Unknown discipline, static boundaries, and advisory AI into visible Product value.

### Questions for 01

1. What is the primary entry object: Workflow, Source, Project, or Review?
2. Should Canvas remain the Product Home or become a Design view within a broader artifact experience?
3. Which repeat-use hypothesis should be tested first: re-import, revision comparison, review delta, or compatibility verification?
4. What exact Production evidence would satisfy a remaining Stage 1.5 selection trigger?
5. How should free deterministic value and future paid AI value be explained without weakening Preflight?
6. How should CrewAI-first positioning and portable-toolchain positioning be sequenced?
7. Is a bounded UX restructuring of existing capabilities worth explicit selection, while keeping all new Stage 1.5 capabilities, Stage 2, AI Authority, and Mutation Authority unchanged?

## 17. Conditional handoff to 02 UX Specification

Only after an explicit 01 selection, 02 should answer:

1. How should existing features express Entry → Understand → Evaluate → manual Improve → Verify → Own?
2. What fields and interactions are mandatory for a finding detail?
3. How should Locate focus, highlighting, return navigation, and screen-reader announcements behave?
4. Which mobile actions are primary, secondary/More, or desktop-only?
5. How should mapping diagnostics and Preflight findings share visual vocabulary without conflating semantics?
6. How should `Known / Inferred / Unknown` remain distinct from `Deterministic / Heuristic / External-dependent`?
7. How can the IA remain extensible without presupposing Project, History, Stage 2, or mutation capabilities?

## 18. Final non-selection statement

This research does not decide what should be implemented now.

It records:

- strongest opportunities;
- evidence gaps;
- competitor patterns;
- Product/UX proposals;
- questions for 01 and 02.

The authoritative next action remains an explicit 01 decision under current governance. Until then:

```text
Selected next capability = NONE
Stage 2 = NOT SELECTED
AI Authority = UNCHANGED
Mutation Authority = UNCHANGED
```
