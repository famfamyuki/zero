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

Near-term sequencing remains:

```text
Stage 1 Architecture Review
→ Gate A Evaluation Trust & Scale
→ smallest justified Stage 1.5 foundation work
→ Gate B scoped authority decision
→ Stage 2 Guided Improvement only inside an approved authority envelope
→ Gate C safe transformation readiness
→ Stage 3 transformation only inside an approved mutation scope
```

---

# 2. Current execution board

| Capability / decision | Program state | Primary dependency | Evidence / gate required | Next action |
|---|---|---|---|---|
| Evidence-Grounded AI Architecture Review v0 | Current selected major milestone; Production release blocked | Stage 0 deterministic foundation plus paid access/cost control | Active packet AC, implementation checks, Independent QA, paid entitlement/quota prerequisite, Production verification | Keep provider-backed review unreleased until the paid-access packet is implemented and independently verified |
| Architecture Review Paid Access & Usage Control v0 | Selected release prerequisite | `ADR-0006`, existing auth/Stripe/Supabase reality, provider cost evidence | Dedicated packet covering server-side entitlement, hard quota, idempotent accounting, security/privacy, degraded mode, and release verification | 【02】specifies the smallest implementation-ready packet; C01 starts only after Definition of Ready |
| Evaluation Quality hardening | Candidate after Stage 1 | Production evaluator evidence | Gate A gold-set / safety / quality / stability evidence | Select only if evaluator quality is the limiting dependency |
| Evaluation Scale foundation | Candidate after Stage 1 | Measured size/topology degradation | Gate A scale/reliability evidence | Select only if full-review quality or reliability degrades materially |
| Search / Locate / Scoped Evidence | Candidate after Stage 1 | Review usability or scale bottleneck | Gate A evidence showing navigation/scope is a dependency | Select minimal addressable navigation foundation |
| Persisted Intent & Constraints | Stage 1.5 candidate | Evaluation ambiguity / proposal context | Ambiguity evidence and Scenario/Acceptance contract alignment | Select when missing declared context materially limits review/proposal quality |
| Scenario / Acceptance Contract | Cross-stage foundation | Intent/context and later behavioral verification | `architecture/SCENARIO_ACCEPTANCE_CONTRACT.md` | Introduce only through a selected packet that defines persistence/UX scope |
| CrewAI static import | Stage 1.5 candidate | Safe static semantic mapping | Mapping feasibility, diagnostics quality, import security review | Select when import materially improves access to first value |
| Project / Local Workspace | Stage 1.5 candidate | Repeat-use / identity / revision needs | Persistence/data governance and identity contract | Select when repeat-use/revision value requires durable project identity |
| Revision / Evaluation History | Stage 1.5 candidate | Review Delta / proposal provenance | Revision identity and persistence contract | Select before features that require durable historical comparison |
| Guided Improvement | Planned | Gate B | Scoped evaluator authority approval | Do not select as a blanket AI-authority expansion |
| Safe Transformation | Planned | Gate C | Patch/revision/validation + approved mutation scope | Start architecture-only unless capability/policy prerequisites are present |
| Security / Policy Engineering | Planned | Capability model and structured evidence | Relevant roadmap gate / packet | May contribute prerequisite foundations earlier when transformation scope requires them |

This board is intentionally small. Do not turn it into a duplicate full roadmap.

---

# 3. Stage 1.5 selection trigger matrix

Stage 1.5 is a selection band, not a backlog that must be completed in order.

| Candidate | Positive selection trigger | Do not select merely because |
|---|---|---|
| Persisted Intent & Constraints | Expert/evaluator evidence shows ambiguity materially harms review or proposal quality | It appears in the long-term WorkflowDocument model |
| Scenario / Acceptance foundation | Critical expected behavior cannot be represented by architecture/intent alone and later verification needs a durable expectation contract | Simulation/runtime work is attractive conceptually |
| Review / Locate | Users/evals cannot efficiently connect findings to targets, or scoped evaluation requires addressable selection | Large-workflow UX is on the roadmap |
| Static CrewAI import | Existing-project import substantially lowers first-value friction and static mapping can preserve Unknown/lossiness correctly | Multi-framework import sounds strategically broad |
| Project / Local Workspace | Repeat use, revision identity, or multi-workflow ownership requires durable local/project context | Cloud accounts/collaboration may exist later |
| Revision / Evaluation History | Review Delta, proposal provenance, stale detection, or safe transformation needs persistent ancestry/history | A history screen would be convenient |
| Evaluation Scale foundation | Quality, latency, failure rate, or truncation risk materially worsens by measured size/topology | A fixed node-count threshold has been guessed |

Selection should identify the **smallest coherent packet** that resolves the measured dependency.

---

# 4. Blocker and dependency model

Use these categories:

- `PRODUCT_BLOCKER` — value/contract contradiction prevents specification
- `EVALUATION_BLOCKER` — evaluator safety/quality/context is insufficient for planned authority
- `ARCHITECTURE_BLOCKER` — missing identity/version/semantic contract would create expensive migration or unsafe behavior
- `SECURITY_BLOCKER` — missing trust/capability/control boundary prevents safe implementation
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
- every Scenario/Acceptance requirement implemented must trace to an explicit test or documented future-verification limitation
- do not create a repository-wide heavy requirements-management system unless scale justifies it

---

# 6. Program review cadence

Update this board when one of the following occurs:

- a Sprint becomes Selected / Specified / Implementation Complete / QA Complete / Production Verified / Sprint Complete
- Gate A/B/C/D/E/F produces a decision
- a new Stage 1.5 foundation packet is selected
- a program-level blocker appears or clears
- a risk changes the likely sequencing
- a durable Product/Architecture decision changes dependencies

Do not update merely for every commit.

---

# 7. Program completion discipline

A completed Sprint does not automatically move the roadmap.

Required flow:

```text
Sprint Complete
→ update evidence/current limitations
→ gate/selection review if applicable
→ explicit next Selected packet
→ specification
```

The Program Board communicates this state; `docs/roadmap/EXECUTION_GATES.md` remains authoritative for promotion decisions.
