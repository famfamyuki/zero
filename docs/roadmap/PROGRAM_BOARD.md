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
= QA COMPLETE
+ RELEASE EXECUTION COMPLETE
+ PRODUCTION VERIFICATION BLOCKED

Production paid Architecture Review
= DISABLED / FAIL-CLOSED

W01 Pass B
= BLOCKED

Production Verified
= NO

Sprint Complete
= NO

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
= 01 — Product Architecture & Roadmap

Current next action
= explicit Commercial Enablement decision
```

The earlier evaluator-quality/API-credit blocker is resolved for the released candidate: the required 30-review evaluation completed, W01 Pass A completed, and the QA-approved tree was released. The current blocker is now the mandatory Production paid/commercial verification path.

Commercial Validation Gate M0 remains separate. A technically released or even Production Verified paid-access mechanism does not prove recurring commercial value.

---

# 2. Current execution board

| Capability / decision | Program state | Evidence / dependency | Next action |
|---|---|---|---|
| Evidence-Grounded AI Architecture Review v0 | **QA Complete / released / Production Verification BLOCKED** | QA-approved source `8887a5f2...`; released main/Production `8db0de7d...`; release identity matched; paid review disabled in Production | Keep fail-closed until commercial enablement is explicitly selected and prerequisites are available; then fresh W01 Pass B |
| Architecture Review Paid Access & Usage Control v0 | **Implemented, QA Complete, released; live paid path not Production Verified** | Active paid-access packet AC-28..31 / Pass B; current offer disabled; mandatory live Stripe/Auth/entitlement/quota evidence unavailable | 01 decides `ENABLE_PREP`, `HOLD_DISABLED`, or justified packet-status review; C01 must not invent Product/commercial values |
| Commercial Enablement decision | **PENDING 01** | Requires hosting eligibility, approved Price/quota/cost guard, legal/support/refund/tax path, Production Auth, controlled QA handling, WAF verification | 01 selects the smallest sufficient next action; no automatic Stage 1.5/Stage 2 scope |
| CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics | **Sprint Complete / Production Verified** | `docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md`; `ADR-0009` | Remains complete; no source-boundary, Stage, AI-authority, or mutation-authority expansion |
| Existing-Capability Product Identity & Review Journey UX Restructuring | **Sprint Complete / Production Verified** | `docs/specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md` | Remains complete |
| Commercial Validation Gate M0 | **NOT REACHED / future evidence gate** | Requires Paid Access Production Verified plus sufficient real paid evidence under `MONETIZATION_ARCHITECTURE.md` | Evaluate only when enough real paid evidence exists for the scoped commercial question |

---

# 3. Stage 1.5 selection trigger matrix

Stage 1.5 remains a selection band, not a backlog. 01 selects only the smallest coherent packet whose trigger is supported by evidence.

| Candidate | Positive selection trigger | Do not select merely because |
|---|---|---|
| Persisted Intent & Constraints | Missing declared context materially limits evaluation/proposal usefulness; expert or Product evidence identifies ambiguity as the bottleneck | It appears in the long-term WorkflowDocument model |
| Scenario / Acceptance foundation | Critical expected behavior cannot be represented adequately by architecture/intent alone and later verification needs a durable expectation contract | Runtime/simulation work is conceptually attractive |
| Review / Locate | Users/evaluations cannot efficiently connect findings to targets, or scoped evaluation requires stronger addressable navigation than current contracts provide | Large-workflow UX appears in the roadmap |
| Project / Local Workspace | Repeat use, revision identity, or multi-workflow ownership materially requires durable local/project context | Workspace sounds useful or monetizable |
| Revision / Evaluation History | Review Delta, proposal provenance, stale detection, safe transformation, or measured repeat-use friction needs persistent ancestry/history | A history screen would be convenient |

No Stage 1.5 candidate is selected by the current Production blocker. Commercial enablement work must not silently pull these future capabilities into scope.

---

# 4. Current blocker and re-check condition

```text
Blocker / Risk IDs:
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER
R-008 / R-020 / R-021 as applicable

Observed evidence:
- latest Stage 1 release is deployed to Production on the approved tree
- paid Architecture Review offer is disabled / fail-closed
- deterministic free core remains operational
- W01 Pass B is BLOCKED because mandatory live paid-path evidence cannot yet be collected

Affected packet/gate:
Stage 1 Production Verified / Sprint Complete / Gate A entry

Smallest safe response:
Keep paid review disabled until 01 explicitly selects commercial enablement and all required launch/QA prerequisites are supplied or approved. Do not weaken AC-30, bypass entitlement/quota, or reinterpret deployment READY as Production Verified.

Owner lanes:
01 Product/commercial decision
→ 02 only if a specification gap exists
→ C01 for authorized configuration/implementation only
→ W01 fresh Pass B
→ 00 Sprint closure only after Production Verified

Re-check condition:
Approved commercial/Production prerequisites are live and a controlled W01 Pass B can execute the packet-defined Production path without bypasses.
```

Required prerequisites include, as applicable:

- commercial-use-eligible hosting/account
- approved Production Price / currency / included quota
- approved provider cost guard and operator budget controls
- active monthly Stripe Price and bounded Customer Portal configuration
- Terms / Privacy / Support / refund / tax operational path
- Production Supabase Auth email delivery/redirect configuration
- controlled QA account and approved financial handling
- Production WAF verification method

If code or behavior changes after QA Complete, prior Pass A approval must be re-evaluated before Production verification.

---

# 5. Planning reconciliation checkpoint

**This is a required operating step.** When development reaches a material checkpoint, reconcile the near-term plan before the next normal authority handoff.

Material checkpoints include:

- `Selected`
- `Specified`
- `Implementation Complete`
- `QA Complete`
- release/merge execution of the approved revision
- `Production Verified` or a blocked Production Verification result
- `Sprint Complete`
- blocker activation/resolution
- Gate / Stage / selection / next-authority change
- material Production reality that invalidates the current plan

At each such checkpoint, `00` must verify and update, **as applicable**:

```text
docs/CURRENT_STATE.md
docs/roadmap/PROGRAM_BOARD.md
docs/roadmap/RISK_REGISTER.md
```

Rules:

- live repository/Production reality is checked first;
- stale plan text must not be handed to the next lane as current state;
- update only documents whose meaning materially changed;
- do not rewrite planning documents for every commit, CI run, metric fluctuation, or transient note;
- preserve Product intent, architecture boundaries, gates, authority, Acceptance Criteria, regression constraints, and Production verification semantics;
- if a normal handoff would proceed while these planning documents materially contradict live state, reconcile first;
- emergency Production safety response may proceed immediately, but planning reconciliation follows as soon as the safe state is established.

This checkpoint is part of the development plan itself so current-state maintenance is not treated as optional cleanup after implementation.

---

# 6. Coordination discipline

After a Sprint completes:

```text
Evidence
→ Gate Review
→ Explicit Next Selection
```

An explicit decision may select work or may result in `DEFER / no new Sprint`.

Current path:

```text
Stage 1 QA Complete
→ release execution complete
→ W01 Pass B BLOCKED
→ 00 reconciles live state and plan
→ 01 Commercial Enablement decision
→ authorized prerequisites/configuration as needed
→ W01 fresh Pass B
→ 00 Sprint Complete only after Production Verified
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Rules:

- Stage order is dependency direction, not an automatic implementation queue.
- No remaining Stage 1.5 candidate is automatically Selected.
- `Gate A = NOT REACHED` while Stage 1 is not Production Verified.
- `Gate B = NOT REACHED`; Stage 2 remains `NOT SELECTED`.
- AI Authority and Mutation Authority remain capability-scoped and unchanged until an applicable gate explicitly changes them.
- M0 commercial validation is separate from AI authority/stage promotion.
- Keep completed packet detail in the packet/PR/ADR rather than growing this board into a historical archive.
