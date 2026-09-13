# ADR-0012 — Select Architecture Review Evaluation Trust Foundation v0

Status: **Accepted**  
Date: **2026-09-13**

## Context

AgentGraph Studio's durable Product direction is a **Portable AI Workflow Architecture Engineering Toolchain** with the North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

The bounded Astra launch-hardening Sprint is complete and Production Verified. The Stage 1 Architecture Review / Paid Access commercial lifecycle remains open, but the stakeholder priority has changed: final commercial activation work such as commercial hosting eligibility, Stripe Live, first-Live windows, QA containment, and PAUC AC-30 will be resumed only after AgentGraph Studio's Product development has advanced further.

This priority change must not weaken or delete the existing paid-launch safety contract. Production paid Architecture Review remains disabled / fail-closed, and all existing Phase 0, containment, first-Live, and AC-30 requirements remain mandatory whenever commercial activation resumes.

At this decision point, live evidence showed:

- GitHub `main` at `2870a61cc615ddd56188b9c99f005deeb7069870`;
- latest Vercel Production deployment `dpl_28sdRLfwJwJtmyWRKbdXMhMsQjFF`, `READY`, `target=production`, with matching `githubCommitSha`;
- the primary Production offer reports `enabled=false`, `price=null`, `includedReviews=null`, and no public policy URLs;
- the connected Vercel team plan label remains `hobby`;
- no Vercel runtime errors were returned for the inspected 24-hour window.

The existing Architecture Review evaluator has meaningful **release-safety** evidence, but not yet sufficient **semantic-quality calibration** for stronger authority. The recovered formal evaluation contains 30 successful synthetic reviews, 210/210 current semantic rubric checks, and zero hard violations. However, the current harness uses ten small A–J fixtures, at most eight nodes, repeated three times each. Its semantic scorer checks grounding, valid targets, knowledge discipline, explanation presence, a high-level direction, and whether at least one fixture focus term appears. It does not measure issue-level precision/recall, good-workflow false positives, flawed-workflow false negatives, expert top-issue agreement, or semantics-preserving stability.

This gap maps directly to durable Risk `R-001` and to the Evaluation Trust & Scale authority. It is also a core moat dependency: a safe structured response is not by itself evidence that the evaluator identifies the right architecture problem or prioritizes it correctly.

By contrast, current evidence does **not** establish that:

- large-workflow scale degradation is already the active Product bottleneck;
- persisted Intent/Constraints are the dominant cause of review disagreement;
- Project/Workspace persistence is required for the next first-value step;
- revision/evaluation history is required before the current evaluator can be calibrated;
- Review Workspace / Locate is the current limiting usability problem for provider-backed findings.

Those remain valid future directions, but selecting them before measuring evaluator quality would add broader architecture or persistence scope without evidence that they are the smallest current dependency.

## Decision

Select **Architecture Review Evaluation Trust Foundation v0 — Gold Dataset + Quality Metrics** as the next Product development Sprint.

Packet:

`AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1`

Lifecycle after this decision:

```text
AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1
= Selected
→ next authority: 02 — UX & Implementation Specification
```

This is an **independently justified pre-Gate-A Product foundation selection**, not Gate A passage, Stage promotion, or evaluator-authority expansion.

Simultaneous authority state remains:

```text
Commercial activation
= OPEN / FAIL-CLOSED / DEFERRED ACTIVATION

Production paid Architecture Review
= DISABLED / FAIL-CLOSED

PAUC AC-30
= NOT COMPLETE

Paid Access Production Verified
= NO

Commercial Sprint Complete
= NO

M0
= NOT REACHED

Gate A
= NOT REACHED

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED
```

### Product objective

Create a versioned, reproducible benchmark foundation that can distinguish:

```text
"The reviewer returned a valid evidence-grounded result"
from
"The reviewer identified and prioritized the right architecture issues"
```

The packet should turn the existing release-oriented evaluator harness into a foundation capable of measuring semantic quality without granting the evaluator any stronger Product authority.

### Included for 02 specification

02 should specify the smallest coherent implementation around:

1. **Versioned benchmark dataset and rubric contract**
   - repository-owned, privacy-safe fixtures/annotations;
   - explicit dataset/rubric versioning and provenance;
   - represent human disagreement / acceptable alternatives rather than forcing artificial certainty;
   - preserve historical A–J fixture provenance rather than silently relabeling existing fixtures as expert gold.

2. **Gold annotation shape** capable of recording, where applicable:
   - expected strengths;
   - expected architecture issues;
   - acceptable alternative interpretations;
   - issue priority / top issue where a unique priority is justified;
   - required Evidence / target support;
   - claims that must remain `Unknown`;
   - acceptable and unsafe recommendation directions.

3. **Minimum benchmark classes**
   - intentionally good / simple-sufficient workflows;
   - deliberately flawed workflows;
   - ambiguous or multiple-valid-design workflows;
   - adversarial / prompt-injection workflows;
   - current representative architecture patterns where they can be annotated reproducibly.

4. **Deterministic quality scoring/reporting** that can derive from annotations/results, as applicable:
   - existing hard-violation results;
   - issue precision / recall;
   - good-workflow false-positive behavior;
   - flawed-workflow false-negative / issue-coverage behavior;
   - top-1 / top-k priority agreement where annotated;
   - strength recognition;
   - uncertainty / `Unknown` preservation;
   - repeated-run material-finding stability.

5. **Semantics-preserving stability foundation**
   - explicit benchmark variants or transformation contract for changes that should not materially alter review conclusions, such as layout-only changes and other non-semantic representation differences supported by the current model;
   - no claim of stability until measured.

6. **Benchmark report metadata**
   - dataset/rubric version;
   - evaluator/reviewer/prompt/model versions as governed;
   - workflow fixture identity and relevant topology/size metadata;
   - Evidence/input size metadata where already deterministically available;
   - reproducible result summary suitable for later Gate review.

7. **Provider-independent testability**
   - dataset validation, annotation validation, scorer correctness, and report aggregation must be testable without a live provider;
   - any provider-backed benchmark execution remains explicit, bounded, and subject to the existing provider/budget/governance controls.

02 owns exact schemas, matching semantics, benchmark fixture count, annotation-review workflow, bounded live-run procedure, and Acceptance Criteria. 02 must not invent permanent numeric promotion thresholds merely to complete the packet; thresholds must be tied to a versioned dataset/rubric and later calibration evidence.

### Deferred

The following are intentionally deferred until the new quality evidence shows they are the next dependency:

- 50 / 100 / 250 / 500+ node provider-backed scale benchmark execution;
- scoped / hierarchical evaluator implementation;
- broad large-workflow Search / Filter / Outline UX;
- Architecture Review-specific Review Workspace redesign;
- Project / Local Workspace identity;
- persisted Intent & Constraints;
- revision / evaluation history;
- Scenario / Acceptance persistence;
- multi-framework expansion.

Large-workflow size/topology metadata may be made compatible with the benchmark report, but the packet must not claim or implement large-workflow support merely from that metadata.

### Out of Scope

This selection does **not** authorize:

- Stripe Live configuration or charging;
- Vercel plan/account changes;
- Firewall/WAF changes;
- first-Live windows or AC-30 execution;
- public paid enablement;
- provider/model/prompt/rubric production changes merely to improve a score;
- new AI recommendation authority;
- Guided Improvement / Stage 2;
- Semantic Patch / Apply;
- Mutation Authority expansion;
- managed runtime / hosted execution;
- cloud/team/collaboration persistence;
- Graph/Workflow major-version migration;
- arbitrary imported-code execution;
- a public 0–100 architecture score;
- unsupported comparative superlatives.

## Commercial activation priority

The commercial lifecycle is preserved, not cancelled.

Current priority state becomes:

```text
Stage 1 Paid Access lifecycle
= OPEN

Activation work
= DEFERRED

Public paid path
= FAIL-CLOSED
```

The released ADR-0011 / first-Live amendment / paid-launch runbook remain authoritative for eventual activation. Existing Phase 0, containment, first-Live, financial, and AC-30 obligations remain intact.

Commercial activation may be reconsidered only through an explicit later priority decision after Product development has advanced. At minimum, this newly selected Product Sprint should complete its normal lifecycle before that reconsideration, but its completion does **not** automatically authorize or resume commercial activation. At resumption, all external/account/configuration evidence must be re-checked fresh; stale Phase 0 assumptions cannot be promoted to Verified.

This sequencing creates no new Product architecture dependency. It deliberately keeps the deterministic free core and the selected evaluator-quality work independent from commercial hosting, Stripe Live, or paid-provider availability.

## Rationale

### Why Evaluation Trust is selected

The most important current Product uncertainty is not whether the evaluator can return schema-valid prose. That is already substantially covered. The missing evidence is whether it reliably finds the **right** issue, avoids inventing issues in a good workflow, ranks the important issue correctly, and remains materially stable.

Improvement authority should not grow faster than evaluation trust. Building the benchmark/gold foundation first is therefore the smallest step that directly advances `Evaluate` and prepares evidence needed before stronger `Improve` authority can be considered.

### Why scale implementation is not selected yet

The current benchmark is small, so large-workflow behavior is `Unknown`. Unknown is not evidence of failure. Implementing scoped/hierarchical evaluation or large-graph navigation now would prematurely choose a solution before measuring where quality/reliability actually breaks.

### Why Stage 1.5 context/persistence is not selected yet

Project/Workspace, persisted Intent/Constraints, and history are strategically important, but each adds persistence/identity/governance scope. Current evidence has not shown that missing context is the dominant cause of evaluator disagreement or that repeat-use history is the immediate Product bottleneck. The benchmark foundation should make those needs measurable.

### Why Review Workspace / Locate is not selected yet

Review/Locate is a strong strategic UX direction, but the provider-backed review remains fail-closed publicly and there is no current Production evidence that finding navigation is the main blocker. The deterministic Astra journey already improved field-level Locate for the free-core review loop. Evaluator trust is the clearer unresolved dependency.

### Why no combined packet

Combining quality calibration with Workspace, Intent, Review UX, or scale implementation would obscure causality and enlarge the packet before evidence shows those capabilities are required. The benchmark foundation can reveal which of those candidates should be selected next.

## Gate and authority consequences

- Gate A remains **NOT REACHED** because the Paid Access Stage 1 lifecycle is not Production Verified and sufficient calibrated evaluation evidence does not yet exist.
- This packet prepares evaluation evidence; it does not pass Gate A.
- Gate B remains **NOT REACHED**.
- Stage 2 remains **NOT SELECTED**.
- AI Authority remains **UNCHANGED** at the current capability-scoped review authority.
- Mutation Authority remains **UNCHANGED**.
- Existing paid-access/AC-30 gates are not relaxed.

## Risks

- `R-001` remains a Critical WATCH risk until measured evidence improves confidence; selection of work does not prove the risk resolved.
- `R-002` evaluator drift remains governed; dataset/rubric/version metadata should make future change comparisons safer.
- `R-003` scale degradation remains WATCH and must not be converted into a large-workflow support claim without measured evidence.
- `R-004` context-poor recommendations remains WATCH; the selected benchmark can provide future evidence for whether Intent/Constraints becomes necessary.
- `R-008`, `R-020`, and `R-021` continue to block commercial activation/public paid exposure, but do not block this independently justified Product-quality work while paid Production remains fail-closed.

## Alternatives considered

### Full Evaluation Trust & Scale Sprint

Not selected. It would combine semantic calibration, large-scale benchmarking, potentially scoped evaluation, and navigation before current evidence identifies where scale actually fails.

### Project / Local Workspace identity

Not selected. It adds persistence/identity/migration boundaries beyond the immediate evaluator-quality uncertainty.

### Persisted Intent & Constraints

Not selected. The need is plausible but not yet evidenced as the dominant source of review error. The selected benchmark should reveal whether ambiguity/context drives misses or disagreements.

### Revision / Evaluation History

Not selected. It is valuable for repeated professional use and later safe change, but depends on identity/persistence and does not first answer whether the current evaluator is semantically trustworthy.

### Review Workspace / Locate foundation

Not selected. Strategically valuable, but current evidence does not show it is a larger blocker than evaluator quality calibration.

### No new Product selection

Rejected under the new stakeholder priority. Commercial activation can remain safely fail-closed while a Product-quality packet with independent value advances. The Risk Register explicitly permits unrelated deterministic Product operation or independently justified evaluator-quality work even when commercial launch risks remain blocking for public paid exposure.

## Consequences

- `AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1` becomes **Selected**.
- next owner becomes `02 — UX & Implementation Specification`.
- commercial activation is no longer the current execution priority, but its lifecycle remains open and fail-closed.
- no Stage promotion or AI/Mutation authority expansion occurs.
- `02` must turn the selected scope into an implementation-ready specification without pulling in scale architecture, persistence, Guided Improvement, or commercial activation.

## Related authorities

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`
- `docs/CURRENT_STATE.md`
