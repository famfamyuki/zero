# AgentGraph Studio — Evaluation Trust & Scale Plan

Status: **Authoritative cross-stage product/architecture plan**  
Scope: Evaluation-engine trust, design-time/runtime relationship, benchmark quality, large-workflow evaluation scale, and evaluation-oriented navigation.  
Current implementation scope remains governed by the active packet under `docs/specs/`.

## 0. Source-of-truth and scope rule

This document refines the durable Product/Architecture/Roadmap direction. It does **not** expand the current Stage 1 packet automatically.

Priority remains:

1. latest GitHub `main` / repository reality
2. latest Vercel Production / actual Production behavior
3. active packet under `docs/specs/`
4. `docs/PRODUCT_MASTER.md`
5. `docs/ARCHITECTURE.md`
6. `docs/roadmap/MASTER_ROADMAP.md`
7. this cross-stage plan where evaluation trust/scale is the question
8. historical plans/chats

If a future Sprint implements any item below, it must first be explicitly Selected and Specified.

---

# 1. Why Evaluation Trust Is a Core Product Concern

AgentGraph Studio's long-term differentiator is not merely that it can draw or export workflows. The product becomes materially more valuable when users can trust it to:

- understand a workflow's architecture
- distinguish deterministic facts from AI interpretation
- identify important weaknesses without inventing problems
- explain why a weakness matters
- cite the Evidence that supports the judgement
- recommend a justified improvement direction
- preserve uncertainty where facts are unavailable
- later verify whether an approved change improved the design and, where runtime evidence exists, actual behavior

The evaluation engine therefore directly affects Product trust.

A safe output contract is necessary but not sufficient. The product must prove both:

```text
Evaluation Safety
+
Evaluation Quality
```

Evaluation Safety includes grounding, schema validity, knowledge discipline, failure isolation, and no silent mutation.

Evaluation Quality includes correctness, issue coverage, false-positive control, prioritization, usefulness, stability, and scale behavior.

Do not equate a structurally valid AI response with a high-quality architecture review.

---

# 2. Design-time Evaluation and Runtime Evaluation Are Complementary

AgentGraph Studio should not choose between design-time and runtime evaluation as if one makes the other unnecessary.

They answer different questions.

## 2.1 Design-time evaluation

Primary question:

```text
Should this workflow architecture be run or implemented in this form?
```

Design-time evaluation can identify issues before runtime cost, credentials, deployment, or production data are required, including:

- unnecessary architecture complexity
- fragmented or overloaded responsibilities
- weak task/output contracts
- deep dependencies
- high context fan-in
- redundant or unused configured resources
- questionable orchestration choices
- missing design-time control boundaries where supported by structured evidence

Design-time evaluation is the first-value evaluation layer because preventable structural problems are cheapest to fix before execution.

## 2.2 Runtime evaluation

Primary question:

```text
What actually happened when this workflow ran?
```

Runtime evidence may later establish facts that static design cannot know, including:

- actual latency
- actual token/resource use
- actual retries/failures
- actual tool calls
- actual paths/trajectories
- actual human intervention
- actual side effects
- observed output/behavioral quality

Runtime-only facts must remain `Unknown` before runtime evidence exists.

## 2.3 Final product loop

The strongest long-term product loop is:

```text
Workflow Source
→ Deterministic Design-time Analysis
→ Design-time Evidence
→ AI Architecture Evaluation
→ Improvement Proposal
→ Safe User-controlled Change
→ Re-verification
→ User-owned Runtime
→ Runtime Evidence
→ Design vs Actual
→ Behavioral Evaluation
→ Improve Again
```

Runtime evaluation extends design-time evaluation; it does not replace it.

The UI and product language must not imply that a clean design-time review guarantees runtime success or production readiness.

---

# 3. Evaluation Trust Standard

An evaluator should be treated as trustworthy only to the degree supported by measured evidence.

## 3.1 Structural trust

Required foundations include:

- versioned Evidence Contract
- deterministic Evidence provenance
- valid Evidence references
- valid target references
- `Known / Inferred / Unknown` discipline
- deterministic / heuristic / external-dependent separation
- prompt-injection resistance for workflow-authored text
- runtime-validated structured output
- provider failure isolation
- no silent workflow mutation

These are necessary release gates but do not alone prove semantic quality.

## 3.2 Semantic quality

Benchmarking should measure whether the evaluator:

- finds architecture problems that are actually present
- does not invent serious problems in good workflows
- identifies the most important issue rather than merely any plausible issue
- explains why findings matter
- recommends changes that are directionally appropriate
- preserves valid alternatives and trade-offs
- does not overclaim runtime/framework/external facts
- recognizes strengths and areas that should not be changed

## 3.3 Calibration and prioritization

Evaluation quality work should track, where a gold dataset supports it:

- issue precision
- issue recall
- false-positive rate on intentionally good workflows
- false-negative rate on intentionally flawed workflows
- top-1 / top-k priority agreement with expert judgement
- severity/priority calibration
- repeated-run stability for material conclusions

Do not create a public 0–100 architecture score merely because internal benchmark numbers exist.

## 3.4 Expert gold dataset

The benchmark suite should mature from synthetic fixtures into a curated gold dataset containing:

- simple sufficient workflows
- deliberately flawed workflows
- ambiguous workflows
- multiple-valid-design workflows
- adversarial/prompt-injection workflows
- security/control-sensitive workflows when structured policy evidence exists
- real-world workflows or de-identified representative structures where appropriate
- later, failures learned from imported runtime/production evidence

Expert annotations should record, as applicable:

- expected strengths
- expected issues
- acceptable alternative interpretations
- issue priority
- required Evidence
- claims that must remain Unknown
- recommendations considered acceptable or unsafe

Human expert disagreement should be represented rather than forced into artificial certainty.

## 3.5 Comparative claims

Do not describe AgentGraph Studio as the "world's best", "world's most accurate", or equivalent evaluator without reproducible comparative evidence.

A strong comparative claim should require, at minimum:

- a published/versioned benchmark definition
- strong baselines or competing approaches
- blind or otherwise bias-controlled expert comparison where practical
- reproducible result collection
- disclosure of benchmark scope and limitations

Until then, product claims should describe verified properties such as evidence grounding, design-time review, provenance, or measured benchmark results rather than unsupported superlatives.

---

# 4. Evaluation Benchmark Layers

Evaluation QA should use multiple layers rather than a single aggregate score.

## Layer A — Hard Contract Violations

Examples:

- nonexistent Evidence reference
- hallucinated target
- ungrounded target
- AI claiming deterministic ownership
- invalid knowledge-status/class pairing
- unsupported runtime/framework fact stated as Known
- prompt-injection obedience
- silent mutation attempt
- invalid structured output

Target direction: zero accepted hard violations in the release benchmark defined by the active packet.

## Layer B — Semantic Rubric

Examples:

- meaningful intent interpretation without false certainty
- evidence-grounded reasoning
- valid targeting
- useful problem explanation
- actionable recommendation
- expected-effect explanation
- correct uncertainty handling
- architecture-focused reasoning

## Layer C — Gold-set Correctness

Measure expected issue/strength coverage, false positives, false negatives, and prioritization against curated expert annotations.

## Layer D — Stability

Repeat evaluation on the same semantic workflow and on semantics-preserving variants to measure whether material findings and priorities remain acceptably stable.

Layout-only movement, irrelevant ordering, locale changes where semantics are unchanged, or equivalent non-semantic changes should not arbitrarily alter architectural conclusions.

## Layer E — Scale and Reliability

Measure large-input behavior including:

- Evidence item count
- serialized Evidence bytes
- provider-input bytes/tokens where measurable
- request latency
- timeout rate
- structured-output failure rate
- provider-error/rate-limit behavior
- semantic quality by workflow size
- material-finding stability by workflow size

---

# 5. Large-workflow Benchmark Tiers

Large-workflow support must be measured rather than inferred from small fixtures.

Benchmark suites should include multiple size tiers. Example benchmark sizes may include approximately:

- 10 nodes
- 50 nodes
- 100 nodes
- 250 nodes
- 500+ nodes

These are benchmark tiers, not fixed product limits.

Each tier should include different topology classes, such as:

- wide parallel/fan-out structures
- deep dependency chains
- high fan-in synthesis points
- many-agent fragmented structures
- tool-heavy structures
- mixed hierarchical/sequential structures where supported
- repeated similar blocks that test disambiguation
- sparse and dense dependency graphs

A feature must not be described as supporting "large workflows" solely because the API accepts a large payload. Evaluation quality and navigation must remain usable at that scale.

---

# 6. Scale Architecture Direction

The current/small-workflow evaluator may use a single Evidence bundle and a single reviewer call where that remains sufficient.

Long-term large-workflow evaluation should avoid assuming that the entire graph must always be reasoned over in one monolithic prompt.

Preferred scale direction:

```text
Deterministic Global Scan
→ Architecture Region / Relevant Subgraph Selection
→ Local Evidence Evaluation
→ Cross-region Dependency Analysis
→ Global Synthesis
→ Priority Ranking
```

Possible region boundaries may later come from deterministic graph structure, semantic modules, explicit groups where semantically appropriate, or evaluator-oriented partitioning. Visual grouping alone must not silently become semantic partitioning.

## 6.1 No silent truncation

If provider/context/API limits prevent complete evaluation, the product must not silently drop part of the workflow and present the result as a complete global review.

Use an explicit state such as partial/scoped/unsupported-for-full-review according to the future packet contract.

## 6.2 Scoped evaluation

Large workflows should eventually support explicit review scope, for example:

- entire workflow
- selected subgraph
- selected group/department as a navigation scope
- selected finding neighborhood
- dependency path
- selected node plus connected context

A scoped review must identify itself as scoped and must not imply conclusions about unreviewed parts of the workflow.

## 6.3 Global synthesis

Local findings are not enough. A large-workflow evaluator must still detect cross-region concerns such as:

- duplicated responsibilities across regions
- long cross-region dependency chains
- central bottlenecks
- policy/control boundary crossings
- global orchestration complexity
- repeated or conflicting output contracts

---

# 7. Large-workflow Search, Locate, Filter, and Focus

Search is a core understandability capability for large workflows, not merely a convenience feature.

The long-term Stage 4 UX remains responsible for the full large-workflow navigation system, but evaluation-scale dependencies may justify an earlier, explicitly Selected foundation Sprint.

## 7.1 Searchable objects

Search should eventually cover relevant user-facing and evaluation-addressable fields, including:

- node label/name
- Agent role
- Agent goal
- Task label/description
- Tool label/type
- Output contract
- group/department name
- node/target identifiers where useful
- Architecture Review findings
- Evidence summaries/identifiers in advanced views

Sensitive/private workflow content must remain subject to existing privacy rules; search is local/product functionality and must not create new analytics leakage.

## 7.2 Locate → Expand → Focus

A finding or search result should be able to navigate directly to its target:

```text
Search Result / Finding
→ Locate Target
→ Expand Collapsed Ancestors
→ Move / Zoom to Target
→ Highlight Target
→ Optionally Isolate Relevant Dependencies
```

The target-addressable Evidence model should be reused for this navigation instead of inventing a separate identity system.

## 7.3 Filters and issue-oriented navigation

Useful directions include:

- Agent / Task / Tool filters
- priority/severity filters
- finding-class filters
- Known / Inferred / Unknown filters where useful
- issue-only view
- dependency-path isolation
- group-level finding summaries
- outline/tree navigator

## 7.4 Evaluation scope selector

Search/filter/navigation may later provide an explicit entry point to scoped evaluation:

```text
Search / Select
→ Relevant Targets/Subgraph
→ Scoped Evidence
→ Scoped Architecture Review
```

Selection must be deterministic/addressable and the review must clearly state the evaluated scope.

---

# 8. Roadmap Integration

## Stage 1 — Evidence-Grounded AI Architecture Review

The current `AGS-EGAI-AR-V0-P1` packet remains unchanged by this document.

After Stage 1 v0 evidence is available, Product Architecture should evaluate whether a separate **Evaluation Trust & Scale hardening Sprint** is needed before Stage 2 Guided Improvement.

The decision should use measured evidence rather than automatically inserting or skipping such a Sprint.

## Stage 2 — Guided Improvement

Do not increase automation authority faster than evaluation trust.

Improvement Proposal quality depends on finding quality. If evaluation precision/prioritization is not sufficiently demonstrated, improve the evaluator before expanding automatic recommendation scope.

## Stage 3 — Safe Transformation

Semantic Patch safety does not compensate for a poor upstream finding. The chain remains:

```text
Trustworthy Finding
→ Justified Proposal
→ Validated Patch
→ User-controlled Apply
```

## Stage 4 — Large Workflow UX

Full search/filter/outline/grouping/focus capabilities remain Stage 4 scope unless separately Selected earlier.

A lightweight Search / Locate / Scoped Evidence foundation may be moved earlier only through explicit Product Architecture review when it is a dependency for trustworthy evaluation scale.

## Stage 8 / 9 — Runtime Evidence and Behavioral Evaluation

Runtime evidence should feed back into evaluator quality:

- confirm or falsify design-time hypotheses
- create Design vs Actual evidence
- reveal classes of issues missed by static review
- create curated regression fixtures
- improve future evaluation rubrics without converting runtime-specific facts into universal static rules

---

# 9. Decision Gate Before Expanding Evaluator Authority

Before materially expanding from architecture review into stronger automated improvement, Product Architecture should review at least:

- hard-violation benchmark results
- semantic rubric results
- good-workflow false-positive behavior
- flawed-workflow issue coverage
- expert gold-set progress
- top-issue prioritization quality
- repeated-run stability
- current known workflow-size limits
- input-size/latency/failure behavior
- whether large-workflow Search/Locate/Scoped Evaluation is now a dependency

Possible outcomes:

- proceed to Guided Improvement
- select Evaluation Quality hardening first
- select Evaluation Scale foundation first
- select a combined Trust & Scale Sprint if the simplest sufficient dependency solution requires both

Do not mechanically advance the roadmap by stage number.

---

# 10. Durable Invariants

Unless explicitly revised through Product Architecture review:

1. design-time evaluation remains a first-class product value even after runtime evidence exists
2. runtime evidence complements rather than replaces deterministic design-time analysis
3. safe structured output does not by itself prove semantic evaluation quality
4. evaluation quality must be benchmarked against expected issues and false positives, not prose appearance alone
5. unsupported superlative quality claims require comparative evidence
6. large-workflow support requires measured quality/reliability, not payload acceptance alone
7. large workflows must not be silently truncated for AI review
8. scoped reviews must disclose their scope
9. Search / Locate / Focus must reuse stable workflow/Evidence addressing where practical
10. visual grouping must not silently define semantic or runtime boundaries
11. evaluation authority must not grow faster than evaluation trust
12. active Sprint scope changes only through explicit selection/specification, never by implication from this plan
