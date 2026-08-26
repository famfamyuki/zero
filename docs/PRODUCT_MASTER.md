# AgentGraph Studio — Product Master Plan

Status: **Authoritative long-term Product and product-strategy direction**  
Scope: Product definition, North Star, category position, durable Product principles, adoption/value wedge, final-state UX, strategic moat, value ladder, and durable Product boundaries.

Current implementation details remain governed by repository reality and the active packet under `docs/specs/`. Use `docs/README.md` for the canonical source hierarchy and task-based reading paths.

---

# 1. Final Product Definition and Strategic Position

AgentGraph Studio is a **Portable AI Workflow Architecture Engineering Toolchain**.

It treats AI-agent workflows as versioned engineering artifacts that can be:

- designed or imported
- understood
- statically verified
- evaluated with evidence-grounded AI reasoning
- improved through explicit proposals
- reviewed through semantic change previews
- re-evaluated after change
- compiled into user-owned artifacts
- evaluated against target-framework capabilities
- later compared against runtime evidence

AgentGraph Studio is not defined by the canvas. The canvas is one human interface to workflow source/semantics.

The same underlying semantics should eventually serve:

- Visual UI
- CLI
- CI
- Git / PR review
- IDE / coding agents
- Architecture Review
- reusable packages/modules

Internal Product category:

> **Portable AI Workflow Architecture Engineering Toolchain**

External strategic category may evolve toward:

> **AI Workflow Architecture Intelligence & Control Layer**

Long-term promise:

> Before an important AI workflow is trusted, changed, or shipped, AgentGraph Studio helps the user understand what it is, identify architecture risks, explain why they matter, compare safer improvements, verify the change, and retain ownership of the resulting system.

Desired habit:

```text
Build / Import Workflow
→ AgentGraph Review
→ Resolve / Accept Findings
→ Verify
→ Build / Ship
```

Later, where team/CI value is justified:

```text
Workflow Change / Pull Request
→ AgentGraph Continuous Review
→ Architecture / Policy Delta
→ Human Decision
→ Ship
```

AgentGraph should become a place important AI workflows are **checked**, not merely another place they are visually drawn.

Strategic business objective:

- large global user reach
- durable recurring revenue based on repeated engineering value
- retention through trustworthy revision/review/governance workflows rather than artificial lock-in
- increasing value from workflow history, policies, revisions, team process, and engineering integrations
- defensible semantic/evaluation intelligence that is difficult to reproduce with a generic LLM wrapper

Durable value should compound through:

```text
Useful Free Entry
→ Repeated Professional Use
→ Team Quality Control
→ Organization Governance
→ Durable Platform Moat
```

Macroeconomic predictions or speculative automation timelines must not force Product contracts or rushed scope. Build assets whose value compounds regardless of external timing.

---

# 2. Product North Star and Recurring Loop

Primary Product loop:

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

For a durable business, this must become recurrent rather than one-shot:

```text
Import / Design
→ Review
→ Improve
→ Verify
→ Build
→ Change Later
→ Review Delta
→ Re-verify
→ Runtime Evidence Later
→ Improve Again
```

Retention should come from the fact that workflows change and deserve repeated verification, not from trapping source/runtime.

Every major capability should strengthen this loop or be a clear prerequisite for it.

---

# 3. Core User Questions

A mature AgentGraph Studio should help answer:

- What is this workflow trying to accomplish?
- What is structurally true about it?
- What is already designed well?
- What are the largest architecture weaknesses?
- Why do those weaknesses matter?
- Which issue should be fixed first?
- Is the architecture more complex than necessary?
- Are agent responsibilities well separated?
- Are task boundaries and dependencies appropriate?
- Are tools/models/output contracts appropriate for the stated intent?
- Is human approval missing where consequences require it?
- What is Known, Inferred, or Unknown?
- What improvement options exist and what are their trade-offs?
- What exactly changes if a proposal is applied?
- Did the change improve the workflow after re-evaluation?
- Can the target framework represent the workflow without silent loss?
- Can the user export and own source/runtime?
- Did real runtime behavior match design-time expectations?

---

# 4. Product Constitution

## 4.1 Simplest Sufficient Architecture

AgentGraph must not reward complexity for its own sake.

More agents, tasks, tools, hierarchy, or orchestration are not automatically better. Prefer the simplest design that satisfies intent/constraints while maintaining required reliability, control, and portability.

An architectural layer should have a defensible reason such as:

- distinct responsibility
- distinct expertise/model strategy
- tool/security boundary
- approval/trust boundary
- concurrency/isolation requirement
- reusable semantic boundary

Otherwise, merge/simplify may be better.

## 4.2 Evidence Before Intelligence

Required ordering:

```text
Workflow Source
→ Deterministic Analysis
→ Evidence
→ AI Reasoning
→ Evaluation
```

AI must not replace facts that can be computed reliably. Readiness, Execution Preview, and Resource Analysis remain part of the Deterministic Evidence Layer after AI capabilities exist.

## 4.3 AI Is Advisory, Not Authority

AI may interpret architecture, trade-offs, intent fit, complexity, and improvement direction. It is not deterministic truth or an infallible gate.

AI findings must be:

- structured
- evidence-grounded where current workflow facts are relevant
- bounded by what is actually known
- explicit about assumptions/unknowns where needed

Authority expansion is capability-scoped and governed by `roadmap/EXECUTION_GATES.md`.

## 4.4 Knowledge Status and Finding Class

Use first-class knowledge states:

- `Known`
- `Inferred`
- `Unknown`

Do not fabricate certainty for missing intent, runtime behavior, provider properties, framework support, cost, or latency.

Keep finding origin separate:

- `Deterministic`
- `Heuristic`
- `External-dependent`

Finding class and epistemic certainty are different axes.

## 4.5 No Silent Semantic Change

AI must never silently change workflow meaning.

Long-term change flow:

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

Mechanical/schema-preserving repair may have lighter UX; semantic change requires explicit user review.

## 4.6 User-owned Source and Runtime

Proprietary hosted execution must not be the only path to value.

Preferred lifecycle:

```text
Visual / Textual Authoring
→ Workflow Source
→ Build
→ Portable Project
→ User Git Repository
→ User Runtime
```

Cloud save/collaboration may exist separately.

## 4.7 CrewAI-first, Not CrewAI-locked

CrewAI is the current primary target/import path. Deliver a strong CrewAI experience before expanding frameworks.

Framework neutrality must be earned through semantic/capability contracts, not claimed through broad but lossy support.

## 4.8 No Silent Lossy Conversion

Target capability should eventually distinguish:

- `SUPPORTED`
- `SUPPORTED_WITH_MAPPING`
- `LOSSY`
- `UNSUPPORTED`

Semantic loss must be surfaced.

---

# 5. Adoption and First-value Wedge

The strongest adoption wedge is not “draw a workflow from scratch.” It is:

> **Bring an existing or newly designed workflow and get useful architecture insight quickly.**

Target first-value flow:

```text
Open AgentGraph
→ Import Existing Workflow OR Start New
→ Deterministic Preflight
→ Evidence-Grounded Architecture Review
→ Top Strengths / Risks / Unknowns
→ Locate each finding
→ See a justified next action
```

This lets AgentGraph complement existing builders rather than requiring migration before value.

Progressive entry modes:

1. **Import Existing Workflow** — highest strategic leverage
2. **Describe New Workflow** — AI-assisted architecture proposal with rationale and user review
3. **Design Manually / Template** — direct visual authoring

AI drafting direction:

```text
Describe Intent
→ AI Architecture Proposal
→ Explain Responsibilities / Boundaries / Assumptions
→ Deterministic Validation
→ Architecture Review
→ User Accepts / Edits
```

AI drafting must not bypass review by presenting generated architecture as automatically correct.

Existing-project import, Workspace/Project identity, Intent/Constraints, Scenario/Acceptance, Review Delta, and revision/history are implemented only through explicitly Selected packets and their dedicated architecture contracts/roadmap stages.

---

# 6. Final Product Workspaces and UX Direction

The final UX should not force all capabilities into the current right-side Preflight panel. The mature desktop shell should become workspace-centric.

Primary navigation should remain small:

```text
Design
Review
Changes
Build
```

Secondary/contextual capabilities may include:

- Evidence
- History
- Runtime
- Library
- Settings / Policies

Evidence remains a first-class domain concept without necessarily being a permanent top-level destination.

## 6.1 Start / Project Home

Preferred entry:

```text
AgentGraph Studio

Import Existing Workflow
Describe New Workflow
Start from Template

Recent Projects / Workflows
```

First-value messaging should emphasize architecture review/trust rather than only a free visual canvas.

## 6.2 Design

Create/import/edit workflow architecture and intent.

Conceptual layout:

```text
Left: Palette / Outline / Search
Center: Canvas
Right: Selected-item Inspector
```

Canvas remains powerful but is one workspace, not the whole product.

## 6.3 Review

Architecture-level evaluation should answer:

- inferred or declared purpose
- overall assessment
- top problems
- strengths
- fix-first recommendation
- alternatives/trade-offs
- unknowns

Signature interaction:

```text
Finding
→ Locate Target
→ Expand Context
→ Focus / Highlight
→ Explain Evidence
```

Users should not need to manually scan a large canvas to discover where a finding applies.

## 6.4 Changes

Improvement proposals, semantic diff, patch risk, before/after comparison, and selective user-controlled apply.

Primary mental model is semantic change, not raw JSON diff:

```text
Current vs Proposed
→ Resolved Findings / New Risks / Trade-offs
→ Semantic Operations
→ Validation
→ Before / After Review
→ Apply Selected Changes
```

## 6.5 Evidence

Deterministic technical evidence including validation, Readiness, execution structure, resource analysis, policy/security, compatibility, and later runtime evidence.

## 6.6 Build

Build should mature from a toolbar export action into an engineering endpoint:

```text
Target
Compatibility
Lossiness
Validation
Required Inputs / Secrets
Generated Artifacts
Build Manifest
Export Portable Project
```

## 6.7 History

Workflow revisions, semantic diffs, evaluation history, change provenance, and Review Delta foundations.

## 6.8 Runtime

Later: imported traces/metrics and Design vs Actual.

## 6.9 Library

Templates, reusable modules, policy/evaluation packages, and only later a marketplace if validated.

## 6.10 Mobile

Do not optimize mobile as a miniature desktop graph editor. Prioritize:

- review findings
- evidence inspection
- node/task details
- proposal comparison
- approval/reject decisions
- quick parameter edits

Desktop remains primary for architecture authoring; mobile should be strong for review/decision workflows.

## 6.11 Product chrome simplification

As the shell matures:

- `Save` should mean project/workspace persistence; JSON export should be named export
- destructive `Clear Canvas` should not dominate primary header chrome
- template access should converge into Start/Library rather than remain redundant
- code export should move toward Build
- support/donation affordances should not dominate mature engineering chrome
- persistent explanatory banners should move toward onboarding/contextual education once the shell is self-explanatory

Do not make these changes inside unrelated packets.

---

# 7. Neutral Architecture Review

Architecture Review acts as an **Independent Architecture Reviewer**, not an upsell mechanism and not merely a display of existing settings.

When applicable, findings should communicate:

```text
Problem
Why it matters
Evidence
Recommendation
Expected effect
Alternatives / Trade-offs
Assumptions / Unknowns
```

The review must identify strengths so users know what not to change.

Avoid arbitrary public 0–100 architecture scoring until a calibrated, meaningful scoring contract exists.

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

UI may group these into fewer understandable pillars.

---

# 8. Intent, Constraints, Scenario, and Review Delta

Architecture quality is relative to purpose. Long-term evaluation should represent, when selected and specified:

- objective
- success criteria
- prototype vs production
- reliability priority
- cost sensitivity
- latency sensitivity
- privacy/local-only constraints
- human-approval requirements
- side-effect constraints
- target/provider/model constraints
- portability requirements

Missing intent remains Unknown. Inferred intent must not silently become persisted truth.

Scenario/Acceptance direction expresses designed expectations such as:

```text
Given <input / situation>
Expected <path / behavior / constraint / outcome>
Must / Must Not <critical property>
```

Examples include required human approval, sensitive-data restrictions, retry/escalation expectations, or routing requirements.

Preserve:

```text
Designed Expectation
→ Static Review
→ Behavioral Test Later
→ Runtime Evidence
→ Expected vs Actual
```

and never confuse configured expectation with observed runtime behavior.

Review Delta should eventually answer:

- What changed since the last trusted revision?
- Which findings were resolved?
- Which new risks appeared?
- Did architecture quality improve or regress?
- Did constraints or compatibility change?

This requires revision-aware history rather than isolated AI responses.

Exact semantic ownership lives in the dedicated architecture contracts and selected packets.

---

# 9. Guided Improvement and Safe Transformation

An evaluation finding may produce multiple improvement directions such as:

- minimal change
- reliability-first
- lower complexity
- stronger human control
- lower resource use

A proposal is advisory and does not modify source.

Domain-level Semantic Patch operations may eventually include:

- add/update/remove agent
- add/update/remove task
- add/remove dependency
- assign/reassign agent
- bind/unbind tool
- update output contract
- update intent/constraint
- add approval requirement
- create/move visual group where appropriate

Each semantic proposal must bind to a `baseRevision` or equivalent stale-detection identity before apply.

Before/After UX must show benefits **and regressions/trade-offs**, not only a positive summary.

Required invariant:

```text
Finding
→ Improvement Proposal
→ Semantic Patch
→ Validation
→ Before / After
→ User Apply
→ New Revision
→ Re-evaluate
```

---

# 10. Large Workflow and Composition Model

Keep distinct:

```text
Visual Group ≠ Semantic Module ≠ Runtime Orchestration
```

- **Visual Group / Department** — presentation/logical navigation; collapse/expand does not alter execution semantics
- **Semantic Module** — reusable subgraph with explicit inputs/outputs/requirements/versioning
- **Runtime Orchestration** — target-framework execution structures such as CrewAI Crew/Flow

Large-workflow UX should eventually support:

- outline/tree navigator
- nested grouping
- collapse/expand
- semantic zoom
- search/filter
- dependency-path isolation
- issue-only view
- group-level finding summaries
- Locate → Expand → Focus

Scale claims and scoped evaluation are governed by `roadmap/EVALUATION_TRUST_AND_SCALE.md` and `roadmap/EXECUTION_GATES.md`.

---

# 11. Permission, Side-effect, and Policy Direction

The semantic model should eventually represent capabilities including:

- network
- filesystem read/write
- external API
- external mutation
- credential access
- sensitive-data access
- human approval requirement
- reversibility / impact scope

Unknown custom-tool capability remains Unknown rather than guessed safe.

Policy Packs may express:

- Local-only
- No external mutation
- Human approval required
- Approved models only
- Data handling constraints
- Structured output required

Policy outcomes may use `PASS / REVIEW / BLOCK`. Policy enforcement must not exist only inside an LLM prompt.

---

# 12. Portability, Build, Headless Core, and Continuous Review

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

Workflow source is authoritative; generated framework code is a build artifact.

Build metadata should eventually track source revision, schema/compiler versions, target framework/capability snapshot, requirements, compatibility/lossiness, generated files, and artifact hashes.

Core semantics/deterministic analysis must not become React-only logic.

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

The same core contracts should serve UI, CLI, CI, coding agents, and integrations.

Continuous Review direction:

```text
Workflow / Code Change
→ Headless Semantic Import
→ Deterministic Analysis
→ Architecture / Policy Review
→ Semantic Delta
→ Machine-readable Result
→ PR / CI Feedback
```

This is a high-leverage retention/distribution mechanism because review happens where engineering changes already occur.

Framework capability intelligence should become a capability engine rather than a generic comparison page:

```text
Workflow Requirements
+ Architecture Semantics
+ Target Capability Snapshot
→ SUPPORTED
→ SUPPORTED_WITH_MAPPING
→ LOSSY
→ UNSUPPORTED
```

Explain **why** a target fits or loses semantics.

---

# 13. Runtime Evidence and Design vs Actual

Execution Preview is not runtime simulation, and static evaluation is not runtime evidence.

Runtime evidence may later establish:

- actual path/tool invocation
- retries/failures
- observed latency/resource use
- actual human intervention/approval
- actual side effects

Long-term comparison includes:

- expected path vs actual path
- configured tool vs invoked tool
- predicted bottleneck vs observed latency
- expected retry risk vs observed retries
- required approval vs observed approval
- resource estimate vs observed use
- expected side effect vs observed side effect

Use adapter-oriented observability rather than requiring proprietary tracing. Runtime failures should become curated evaluation/regression fixtures where privacy/governance permits.

Runtime evidence extends design-time evaluation; it does not replace it.

---

# 14. Distribution and Marketplace

Marketplace is **Conditional / Business Validation Required**, not a prerequisite for Product completion.

Reusable artifact contracts should be useful without a marketplace:

- Workflow Package
- Module Package
- Policy Pack
- Evaluation Pack

Possible metadata:

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

Marketplace monetization, creator payouts, hosted runtime/control plane, and machine-economy concepts must not be frozen into durable Product contracts before demand is validated.

---

# 15. Durable Strategic Moat

The moat should not be the canvas, generic prompts, connector count, or a proprietary runtime users must adopt.

AgentGraph should compound:

1. **Canonical Workflow Semantic Model** — stable architecture semantics independent of one visual surface
2. **Evidence & Provenance Model** — machine-readable connection between deterministic facts, AI reasoning, policy, compatibility, and later runtime evidence
3. **Architecture Evaluation Engine** — versioned evaluator contracts/rubrics, evidence grounding, calibration, failure boundaries
4. **Expert-Calibrated Evaluation Corpus** — good/flawed/ambiguous/adversarial workflows with expert annotations, acceptable alternatives, and disagreement
5. **Semantic Change Safety Engine** — revision identity, domain diff, validation, stale detection, before/after analysis, transactional apply
6. **Framework Capability Knowledge** — versioned capability/lossiness knowledge grounded in target versions and user requirements
7. **Policy & Governance Contracts** — reusable policies, capability semantics, approval requirements, auditability
8. **Workflow Change History** — user-owned revision/evaluation context that improves the user's own engineering process

Private workflow content must not become a hidden training asset or competitive claim without explicit policy/consent.

Competitive strategy:

Do not attempt to win primarily through:

- largest connector catalog
- broadest hosted automation runtime
- fastest generic natural-language generation
- largest template count
- generic multi-framework comparison tables
- proprietary runtime lock-in

AgentGraph should occupy the layer **between workflow construction and production trust** and complement CrewAI/LangGraph/Dify/n8n/code/future ecosystems through import/semantic mapping, architecture intelligence, verification, and user-owned build/runtime.

---

# 16. Commercial Value Ladder

Detailed current commercial architecture, unit economics, pricing evidence, and M0 live in `roadmap/MONETIZATION_ARCHITECTURE.md` and the relevant ADRs. This section defines only long-term Product value boundaries.

Current invariant:

- deterministic Preflight, portability, and deterministic export remain useful free capabilities
- provider-backed Architecture Review may be paid-entitlement only with bounded usage
- quota is a cost/safety mechanism, not the primary value proposition
- paid expansion does not grant stronger AI authority

## Free / Community

Purpose: maximize useful first value and ecosystem adoption without crippling the core Product.

Likely value:

- local/manual workflow design
- supported import
- deterministic Preflight
- JSON portability
- deterministic CrewAI build/export
- basic templates
- basic compatibility information where implemented

## Pro

Purpose: monetize repeated individual professional value.

Potential value:

- bounded provider-backed Architecture Review
- multiple projects/workflows
- persisted evaluation/revision history
- Review Delta/regression
- Scenario/Acceptance suites
- advanced Improvement Proposals
- advanced compatibility/migration analysis
- richer build verification

These are candidates, not a preselected bundle for the current Sprint.

## Team

Purpose: monetize shared quality control after individual value is proven.

Potential value:

- shared workspace
- review/approval flows
- comments
- shared policies/evaluation packs
- Git/PR/CI integration
- team history
- team-scale roles/permissions

## Enterprise

Purpose: monetize governance, privacy, and organizational control after underlying contracts mature.

Potential value:

- SSO / enterprise RBAC
- audit/export controls
- organization policy enforcement
- private/BYO evaluation provider
- private/self-hosted evaluation where justified
- organization capability registries
- compliance/security integration boundaries
- enterprise support

Principle:

> Charge primarily for repeated trust, quality control, history, collaboration, governance, and advanced intelligence — not for trapping source/runtime.

---

# 17. Product-led Adoption, Metrics, and Selection Rules

Desired Product adoption loop:

```text
Free Import / Deterministic Value
→ Clear Useful Review Finding
→ Share / Export Review where privacy permits
→ Return after Workflow Change
→ Review Delta / Scenarios / History
→ Pro
→ Team Review / CI
→ Team
→ Governance / Policy
→ Enterprise
```

High-leverage distribution surfaces include:

- import adapters
- shareable review artifacts with privacy controls
- CLI
- GitHub/PR checks
- portable reports/build manifests
- framework/community integrations

Do not add growth mechanics that degrade trust or manipulate review results.

Useful Product outcome measures include:

- time from first open/import to first useful review
- supported import success rate
- percentage of reviews with a user-inspected finding/evidence target
- false-positive rate on known-good benchmark workflows
- top-issue agreement on gold fixtures
- review return rate after semantic workflow change
- proposal viewed/compared/selectively applied where implemented
- regressions caught by Review Delta/scenarios
- workflows/projects per returning user
- CLI/CI review adoption when available
- conversion associated with repeated quality-control value rather than page views alone

These metrics inform Product quality; they do not make growth dashboards a core engineering priority.

When considering a capability, evaluate whether it materially improves at least one of:

1. **Trust** — more reliable evaluation/verification
2. **Access** — more existing workflows reach first value with less rework
3. **Understanding** — architecture/evidence becomes easier to comprehend
4. **Improvement Loop** — finding can lead to a safely better design
5. **Repeat Use** — legitimate value when workflows change later
6. **Ownership** — stronger portability/user control
7. **Scale** — larger/more complex workflows without hidden uncertainty
8. **Governance** — organization-grade quality/security control
9. **Defensibility** — compounding semantic/evaluation/capability assets
10. **Monetizable Value** — recurring professional/team value without weakening the free first-value wedge

A feature is not prioritized merely because a competitor has it.

Exact Stage sequencing remains authoritative in `roadmap/MASTER_ROADMAP.md`, and promotion/selection remains evidence-driven through `roadmap/EXECUTION_GATES.md` and `roadmap/PROGRAM_BOARD.md`.

---

# 18. Feature Status Vocabulary and Durable Non-goals

Always distinguish:

- **Current Product** — exists in current Production
- **Planned** — selected/roadmapped but not necessarily implemented
- **Long-term Vision** — architecture direction, not current commitment
- **Conditional / Business Validation Required** — pursue only with evidence of demand/value

Never describe roadmap language as current Production functionality.

Unless explicitly revisited:

- do not optimize development priority around marketing/growth dashboards
- do not become a generic automation platform by chasing every connector
- do not make proprietary hosted execution mandatory or central to the business model
- do not equate more agents with better architecture
- do not collapse deterministic Evidence and AI judgement into one opaque score
- do not publish arbitrary architecture scores before scoring is meaningful/calibrated
- do not claim “best architecture/evaluator” without comparative evidence
- do not hide uncertainty to make AI output look more impressive
- do not silently auto-fix semantic workflow meaning
- do not silently degrade semantics when compiling/importing
- do not treat visual grouping as runtime orchestration
- do not require proprietary AgentGraph observability for runtime insight
- do not position generic framework comparison as the primary moat
- do not force source/runtime lock-in as primary monetization
- do not let Team/Enterprise surface area outrun proven individual value and mature contracts
- do not make marketplace economics a dependency of core Product completion

---

# 19. Product Completion and Strategic Success

AgentGraph approaches its intended final form when a user can take an existing or new workflow through:

```text
Import / Design
→ Understand Intent & Architecture
→ Deterministic Evidence
→ Evidence-backed Evaluation
→ Locate / Explain Findings
→ Compare Improvement Options
→ Safe User-controlled Semantic Change
→ Re-evaluation
→ Scenario / Regression Verification
→ Target Compatibility / Build
→ User-owned Runtime
→ Optional Runtime Evidence
→ Continuous Review
```

while maintaining:

- provenance
- portability
- reproducibility
- explicit Known/Inferred/Unknown boundaries
- separation of deterministic fact, AI judgement, external-dependent knowledge, and observed runtime evidence
- visible lossiness/compatibility
- user control over semantic change

Long-term strategic success is the user habit:

> **If an AI workflow matters, review it with AgentGraph before trusting the change.**

The moat emerges from trusted semantic contracts, evaluation calibration, revision history, policy/capability intelligence, and engineering integrations — not merely from having more visual nodes or features than competitors.
