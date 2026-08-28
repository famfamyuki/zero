# AgentGraph Studio — Program Board

Status: **Authoritative near-term execution coordination**  
Scope: Current milestone, gate readiness, candidate foundations, blockers, evidence triggers, and next actions.  
This document does not replace live GitHub/Vercel checks, the Product Master, Master Roadmap, Execution Gates, or an active implementation packet.

## 0. Live-state rule

Before using this board for a decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior where relevant
4. the current authoritative packet under `docs/specs/`

Do not treat an old SHA copied into a board update as current state.

---

# 1. Program objective

The execution program exists to move the product through the North Star without expanding authority faster than evidence supports:

```text
Understand
→ Evaluate
→ Improve
→ Verify
→ Own
```

Near-term sequencing currently has one held provider-backed track and one separately selected deterministic foundation track:

```text
Stage 1 Architecture Review + Paid Access & Usage Control
= held / QA incomplete while required evaluator evidence cannot be completed
├→ when evaluation budget returns: resume bounded evaluator hardening → exact-candidate W01 QA → release lifecycle
└→ independently selected Stage 1.5 foundation: CrewAI Static Import v0
    → Specified packet: docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md
    → separate C01 implementation / W01 QA / release lifecycle

Stage 1 Production evidence, when eventually available
├→ Gate A Evaluation Trust & Scale
└→ M0 Commercial Validation when sufficient paid evidence exists
→ smallest further justified Stage 1.5 foundation work, if any
→ Gate B scoped authority decision
→ Stage 2 Guided Improvement only inside an approved authority envelope
→ Gate C safe transformation readiness
→ Stage 3 transformation only inside an approved mutation scope
```

Specifying CrewAI Static Import v0 does not declare Stage 1 complete, pass Gate A, or expand AI/mutation authority.

M0 is a commercial evidence gate, not an AI-authority gate. It does not block clearly justified evaluator safety/quality work while commercial evidence is still immature.

---

# 2. Current execution board

| Capability / decision | Program state | Primary dependency | Evidence / gate required | Next action |
|---|---|---|---|---|
| Evidence-Grounded AI Architecture Review v0 | Current selected major milestone; **FAIL-BLOCKED / QA incomplete** | Reliable structured evaluator output plus paid access/cost control | Active packet requires 30 live runs, zero hard violations, >= 90% semantic rubric, exact-candidate Independent QA, and Production verification | Keep unreleased; resume bounded evaluator hardening only when evaluation budget is available, then produce a new candidate and repeat full W01 Pass A |
| Architecture Review Paid Access & Usage Control v0 | Specified release prerequisite; database/access/billing controls substantially QA-verified but overall QA cannot complete while the coupled evaluator gate fails | `ADR-0006`, `ADR-0007`, existing auth/Stripe/Supabase reality, coupled Stage 1 evaluator trust | Exact-candidate packet AC/test matrix and W01 Pass A remain mandatory; behavior-changing evaluator fixes invalidate prior candidate approval | Preserve verified migration/access evidence, but do not merge/release until the coupled evaluator fix passes and the new exact revision completes full W01 QA |
| CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics | **Specified — ready for separate C01 implementation** | `docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md`, current graph/domain model, safe static semantic mapping, import security boundary | Packet AC/test matrix, `ADR-0009`, `IMPORT_WORKSPACE_CONTRACT`, R-007/R-006, exact-candidate Independent QA, Production verification | Start a fresh C01 task/branch from latest `main`; implement only the packet; no arbitrary code execution, no silent loss, no Graph V2, no AI/mutation authority expansion; keep held evaluator WIP separate |
| Commercial Validation Gate M0 | Planned evidence gate after paid Production usage exists | Paid Access & Usage Control Production Verified; privacy-safe commercial measurement; real paid usage | `MONETIZATION_ARCHITECTURE.md`: value/WTP evidence, repeat-use behavior, quota utilization, provider-cost distributions, contribution cases, cancellation/refund/support signals | Do not treat the initial subscription model as commercially validated until M0 has sufficient evidence; use the result to adjust price/quota or identify one concrete repeat-value dependency |
| Evaluation Quality hardening | Candidate after Stage 1 | Production evaluator evidence | Gate A gold-set / safety / quality / stability evidence | Select only if evaluator quality is the limiting dependency |
| Evaluation Scale foundation | Candidate after Stage 1 | Measured size/topology degradation | Gate A scale/reliability evidence | Select only if full-review quality or reliability degrades materially |
| Search / Locate / Scoped Evidence | Candidate after Stage 1 | Review usability or scale bottleneck | Gate A evidence or M0/product evidence showing navigation/scope is a concrete dependency | Select minimal addressable navigation foundation |
| Persisted Intent & Constraints | Stage 1.5 candidate | Evaluation ambiguity / proposal context | Ambiguity evidence and Scenario/Acceptance contract alignment; commercial evidence may strengthen priority if missing context materially harms paid usefulness | Select when missing declared context materially limits review/proposal quality |
| Scenario / Acceptance Contract | Cross-stage foundation | Intent/context and later behavioral verification | `architecture/SCENARIO_ACCEPTANCE_CONTRACT.md` | Introduce only through a selected packet that defines persistence/UX scope |
| Project / Local Workspace | Stage 1.5 candidate | Repeat-use / identity / revision needs | Persistence/data governance and identity contract; evidence that durable project identity is a repeat-use dependency | Select when repeat use, revision identity, or multi-workflow ownership requires durable local/project context |
| Revision / Evaluation History | Stage 1.5 candidate | Review Delta / proposal provenance | Revision identity and persistence contract; evidence that inability to compare/revisit reviews limits repeat value | Select before features that require durable historical comparison and when evidence justifies the persistence foundation |
| Guided Improvement | Planned | Gate B | Scoped evaluator authority approval | Do not select as a blanket AI-authority expansion |
| Safe Transformation | Planned | Gate C | Patch/revision/validation + approved mutation scope | Start architecture-only unless capability/policy prerequisites are present |
| Security / Policy Engineering | Planned | Capability model and structured evidence | Relevant roadmap gate / packet | May contribute prerequisite foundations earlier when transformation scope requires them |

This board is intentionally small. Do not turn it into a duplicate full roadmap or a permanent growth dashboard.

---

# 3. Stage 1.5 selection trigger matrix

Stage 1.5 is a selection band, not a backlog that must be completed in order.

Commercial evidence can strengthen a selection only when it identifies a concrete product dependency. It does not convert a theoretically monetizable feature into an automatic priority.

| Candidate | Positive selection trigger | Do not select merely because |
|---|---|---|
| Persisted Intent & Constraints | Expert/evaluator evidence shows ambiguity materially harms review or proposal quality; paid-use evidence may reinforce that context is limiting value | It appears in the long-term WorkflowDocument model |
| Scenario / Acceptance foundation | Critical expected behavior cannot be represented by architecture/intent alone and later verification needs a durable expectation contract | Simulation/runtime work is attractive conceptually |
| Review / Locate | Users/evals cannot efficiently connect findings to targets, or scoped evaluation requires addressable selection; paid review users fail to inspect/act because location is unclear | Large-workflow UX is on the roadmap |
| Static CrewAI import | Existing-project import substantially lowers first-value friction and static mapping can preserve Unknown/lossiness correctly | Multi-framework import sounds strategically broad |
| Project / Local Workspace | Repeat use, revision identity, or multi-workflow ownership requires durable local/project context | Cloud accounts/collaboration may exist later or Workspace sounds like a Pro feature |
| Revision / Evaluation History | Review Delta, proposal provenance, stale detection, safe transformation, or measured repeat-value friction needs persistent ancestry/history | A history screen would be convenient or seems easy to monetize |
| Evaluation Scale foundation | Quality, latency, failure rate, or truncation risk materially worsens by measured size/topology | A fixed node-count threshold has been guessed |

Current selection result:

```text
Static CrewAI import trigger = satisfied for the selected v0 direction
Decision = FOUNDATION_FIRST
Specified packet = docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md
Next authority = C01
```

The selection is grounded in access-to-first-value and architectural reuse, not merely in avoiding API cost.

---

# 4. Blocker and dependency model

Use these categories:

- `PRODUCT_BLOCKER` — value/contract contradiction prevents specification
- `EVALUATION_BLOCKER` — evaluator safety/quality/context is insufficient for planned authority
- `ARCHITECTURE_BLOCKER` — missing identity/version/semantic contract would create expensive migration or unsafe behavior
- `SECURITY_BLOCKER` — missing trust/capability/control boundary prevents safe implementation
- `COMMERCIAL_BLOCKER` — a public paid launch/expansion cannot safely or truthfully proceed because entitlement/economics/pricing evidence/commercial-operations readiness is insufficient
- `REPOSITORY_BLOCKER` — CI/merge/release enforcement cannot guarantee required engineering gates
- `PRODUCTION_BLOCKER` — deployment/runtime behavior does not match release requirements

A blocker must state:

```text
Blocker:
Evidence:
Affected capability/gate:
Smallest safe resolution:
Owner lane:
Re-check condition:
```

Do not hide blockers inside general notes.

Current Stage 1 blocker:

```text
Blocker: EVALUATION_BLOCKER — structured evaluator reliability remains below the zero-hard-violation release gate, and the API credit required for another complete live evaluation is currently unavailable.
Evidence: W01 observed 25/30 structured schema failures; C01 grounding hardening materially improved a later run but still produced 1/30 hard violations, and a subsequent confirmation run stopped satisfying the evaluation contract after credit_balance_exhausted.
Affected capability/gate: Stage 1 Architecture Review Implementation Complete / W01 QA Complete / provider-backed paid release.
Smallest safe resolution: retain grounding/schema hardening as blocked WIP; restore bounded evaluation funding; complete the prescribed C01 live evaluation; create a new candidate; repeat full W01 Pass A.
Owner lane: C01 for implementation/self-evaluation, W01 for exact-candidate independent QA, 00/01 for hold/selection coordination.
Re-check condition: evaluation budget is available and a complete 30-run result can be collected without quota interruption.
```

This blocker does not authorize skipping Stage 1 gates. It also does not block the separately Specified deterministic CrewAI Static Import v0 packet because that packet has its own Product/Architecture rationale and does not depend on live provider calls or stronger AI authority.

---

# 5. Cross-document traceability

Every new implementation packet must include a compact traceability table:

| Requirement / capability | Upstream source | Packet AC / test |
|---|---|---|
| `<requirement>` | Product / Architecture / Gate / Scenario / Risk reference | AC number + test/fixture |

Rules:

- use stable requirement labels inside the packet when a packet is large enough that prose-only cross-reference becomes ambiguous
- every authority-expanding capability must trace to an Execution Gate decision
- every data/security-sensitive capability must trace to the applicable governance review
- paid access/pricing/quota/commercial-launch requirements must trace to `ADR-0006`, `ADR-0007`, and `MONETIZATION_ARCHITECTURE.md` where applicable
- static-import requirements must trace to `ADR-0009`, `IMPORT_WORKSPACE_CONTRACT`, and relevant R-006/R-007 boundaries
- every Scenario/Acceptance requirement implemented must trace to an explicit test or documented future-verification limitation
- do not create a repository-wide heavy requirements-management system unless scale justifies it

---

# 6. Program review cadence

Update this board when one of the following occurs:

- a Sprint becomes Selected / Specified / Implementation Complete / QA Complete / Production Verified / Sprint Complete
- Gate A/B/C/D/E/F or M0 produces a decision
- a new Stage 1.5 foundation packet is selected
- a program-level blocker appears or clears
- a risk changes the likely sequencing
- a durable Product/Architecture/commercial decision changes dependencies

Do not update merely for every commit, checkout, subscription event, or metric fluctuation.

---

# 7. Program completion discipline

A completed Sprint does not automatically move the roadmap or validate the business model.

Required flow:

```text
Sprint Complete
→ update evidence/current limitations
→ gate/selection review if applicable
→ explicit next Selected packet
→ specification
```

For paid work, distinguish:

```text
Paid capability Production Verified
≠ Commercial model validated
```

M0 is evaluated only when enough real paid evidence exists for the question being asked. The Program Board communicates this state; `docs/roadmap/EXECUTION_GATES.md` remains authoritative for AI/stage promotion decisions and `docs/roadmap/MONETIZATION_ARCHITECTURE.md` is authoritative for M0/commercial-validation decisions.
