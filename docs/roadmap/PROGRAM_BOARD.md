# AgentGraph Studio — Program Board

Status: **Authoritative near-term execution coordination**  
Scope: Current lifecycle state, blockers, evidence-triggered candidate selection, and next lane/action.  
This board intentionally does **not** duplicate completed packet scope, long-term roadmap content, or detailed historical release evidence.

## 0. Live-state rule

Before using this board for a decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior where relevant
4. the authoritative packet under `docs/specs/` for any selected/current work

Do not treat a SHA copied into this board as live state. Live repository/Production checks win.

Document ownership:

- Product definition → `docs/PRODUCT_MASTER.md`
- Architecture → `docs/ARCHITECTURE.md`
- long-term stage sequence → `docs/roadmap/MASTER_ROADMAP.md`
- promotion / AI authority / mutation authority → `docs/roadmap/EXECUTION_GATES.md`
- packet scope / AC / implementation contract → `docs/specs/`
- durable risks → `docs/roadmap/RISK_REGISTER.md`
- concise current snapshot → `docs/CURRENT_STATE.md`
- this board → near-term coordination, blockers, triggers, next action

---

# 1. Current program state

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Current coordination:

```text
Stage 1 Architecture Review / Paid Access track
= FAIL-BLOCKED / QA incomplete

CrewAI Static Import v0
= Sprint Complete / Production Verified

Existing-Capability Product Identity & Review Journey UX Restructuring
= Sprint Complete / Production Verified

01 Evidence → Gate Review → Explicit Next Selection
= COMPLETE

Decision
= DEFER

Selected next capability
= NONE

Newly selected work
= NONE

Immediate 02 handoff
= NONE

Gate A
= NOT REACHED

Additional Stage 1.5 capability
= NONE

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED

Current next authority
= 00 — Program Control & Current State

Current next action
= reconcile the completed DEFER / no-selection decision, then wait for an explicit resume or evidence trigger
```

`DEFER` means current evidence does not justify a new Product capability/Sprint. It is not a Stage failure or project stop.

The held Stage 1 packets remain authoritative for that blocked track. No additional packet has been selected after the completed UX-hardening Sprint.

A completed API-independent Sprint does not complete Stage 1, reach Gate A/B, select Stage 2, or expand AI/mutation authority.

Commercial Validation Gate M0 remains a separate commercial evidence gate. It is not an AI-authority gate and no completed API-independent Sprint implies commercial validation.

---

# 2. Current execution board

| Capability / decision | Program state | Evidence / dependency | Next action |
|---|---|---|---|
| Evidence-Grounded AI Architecture Review v0 | **FAIL-BLOCKED / QA incomplete** | Required packet live evaluation has not met the release threshold; a later confirmation run was interrupted by exhausted OpenAI API project credit | Keep unreleased. Resume only under the unchanged condition in §4 |
| Architecture Review Paid Access & Usage Control v0 | Coupled Stage 1 release prerequisite; substantial implementation/QA evidence exists but overall release remains blocked with Stage 1 | `ADR-0006`, `ADR-0007`, active paid-access packet, coupled evaluator trust gate | Preserve verified evidence; do not merge/release the provider-backed track until the evaluator candidate completes full required evaluation and W01 QA |
| CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics | **Sprint Complete / Production Verified** | `docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md`; `ADR-0009` | Remains complete; no source-boundary, Stage, AI-authority, or mutation-authority expansion |
| Existing-Capability Product Identity & Review Journey UX Restructuring | **Sprint Complete / Production Verified**; `HARDEN_FIRST` | `docs/specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md`; W01 QA/Production verification completed | Post-completion 01 review complete: **DEFER / no new capability selected**; no immediate 02 handoff |
| Commercial Validation Gate M0 | Future evidence gate; not implied by technical release readiness | Requires real paid Production evidence under `docs/roadmap/MONETIZATION_ARCHITECTURE.md` | Evaluate only when enough evidence exists for the scoped commercial question |

Detailed completed Sprint scope, ACs, deferrals, and release evidence remain in the authoritative packet/PR history and should not be copied into this board.

---

# 3. Stage 1.5 selection trigger matrix

Stage 1.5 is a selection band, not a backlog. 01 selects only the smallest coherent packet whose trigger is supported by evidence.

| Candidate | Positive selection trigger | Do not select merely because |
|---|---|---|
| Persisted Intent & Constraints | Missing declared context materially limits evaluation/proposal usefulness; expert or Product evidence identifies ambiguity as the bottleneck | It appears in the long-term WorkflowDocument model |
| Scenario / Acceptance foundation | Critical expected behavior cannot be represented adequately by architecture/intent alone and later verification needs a durable expectation contract | Runtime/simulation work is conceptually attractive |
| Review / Locate | Users/evaluations cannot efficiently connect findings to targets, or scoped evaluation requires stronger addressable navigation than current contracts provide | Large-workflow UX appears in the roadmap |
| Project / Local Workspace | Repeat use, revision identity, or multi-workflow ownership materially requires durable local/project context | Workspace sounds useful or monetizable |
| Revision / Evaluation History | Review Delta, proposal provenance, stale detection, safe transformation, or measured repeat-use friction needs persistent ancestry/history | A history screen would be convenient |

Completed precedent:

```text
Static CrewAI import trigger
= satisfied for its selected v0 direction
→ FOUNDATION_FIRST
→ Sprint Complete / Production Verified
```

Latest post-UX-hardening 01 review:

```text
Evidence → Gate Review → Explicit Next Selection
= COMPLETE

Decision
= DEFER

Selected next capability
= NONE

Additional Stage 1.5 capability
= NONE

Stage 2
= NOT SELECTED
```

No remaining Stage 1.5 trigger is currently supported strongly enough to select a new packet. Evaluation quality/scale/Search-Locate outcomes after Stage 1 remain governed by Gate A and `docs/roadmap/EXECUTION_GATES.md`; do not turn them into an automatic queue here.

Available Production telemetry still does not provide dedicated CrewAI import success/failure/apply/repeat-use evidence sufficient to infer adoption or repeat-use friction. Treat this as **Unknown / insufficient evidence**, not evidence of no demand.

---

# 4. Current blocker and resume condition

```text
Blocker:
EVALUATION_BLOCKER — Stage 1 structured evaluator reliability remains below the packet's zero-hard-violation release gate, and the API credit required for another complete live evaluation is currently unavailable.

Evidence:
W01 observed 25/30 structured schema failures; C01 grounding hardening materially improved a later run but still produced 1/30 hard violations; a subsequent confirmation run could not complete after credit_balance_exhausted.

Affected capability/gate:
Stage 1 Architecture Review Implementation Complete / W01 QA Complete / provider-backed paid release.

Smallest safe resolution:
Preserve blocked WIP; restore bounded evaluation funding; complete the prescribed C01 live evaluation; create a new exact candidate; repeat full W01 Pass A.

Owner lanes:
C01 implementation/self-evaluation → W01 exact-candidate independent QA → normal release lifecycle.

Re-check condition:
OpenAI evaluation budget is available and a complete 30-run result can be collected without quota interruption.
```

Resume sequence is unchanged:

```text
OpenAI evaluation budget available
→ C01 completes required packet 30-run evaluation
→ zero hard violations
→ >= 90% semantic rubric
→ new exact candidate revision
→ W01 full Pass A on that exact revision
→ normal merge/release/Production verification lifecycle
```

This is resumption of the already-held Stage 1 track, not a new Product selection. Do not lower or bypass the evaluation gate because funding is unavailable.

---

# 5. Coordination discipline

After a Sprint completes:

```text
Evidence
→ Gate Review
→ Explicit Next Selection
```

An explicit decision may select work or may result in `DEFER / no new Sprint`.

After the current `DEFER`, the program moves again only through one of two distinct routes:

```text
Existing held Stage 1 resume condition becomes true
→ resume the existing Stage 1 lifecycle without a new Product-priority selection

OR

Concrete new Product / Production evidence satisfies a selection trigger
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Rules:

- Stage order is dependency direction, not an automatic implementation queue.
- No remaining Stage 1.5 candidate is automatically Selected.
- `Gate A = NOT REACHED` while Stage 1 itself is not Production Verified.
- `Gate B = NOT REACHED`; Stage 2 remains `NOT SELECTED`.
- AI Authority and Mutation Authority remain capability-scoped and unchanged until an applicable gate explicitly changes them.
- M0 commercial validation is separate from AI authority/stage promotion.
- Update `RISK_REGISTER.md` only when probability, impact, trigger, mitigation, or ownership materially changes.
- Keep completed packet detail in the packet/PR/ADR rather than growing this board into a historical archive.

Update this board when a lifecycle/gate/blocker/selection materially changes. Do not update it for every commit, deployment, metric fluctuation, or historical recap.
