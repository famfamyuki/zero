# AgentGraph Studio — Development Prompt Authoring

Status: **Canonical execution-support guidance for development task briefs**

This file defines how to compose development prompts across Chat, Work, Codex, and
Astra-backed repository tasks. It does not create Product, Architecture, lifecycle,
QA, release, or security authority; those remain in their canonical documents and
the active packet.

## Build from current authority

Compose material prompts from:

```text
latest GitHub main / repository reality
→ current role
→ active packet / current scope
→ smallest relevant authority set
→ Goal / Scope / Out of Scope
→ role-owned completion point
→ evidence / handoff
```

Do not treat an old chat, copied prompt, documented SHA, or prior lifecycle state as
current merely because it appears in task text. Use `AGENTS.md` and
`docs/README.md` as routers and normally load only the 3–6 documents relevant to the
task.

## Prompt content

A good prompt makes these explicit when applicable:

- **Role** — `00`, `01`, `02`, `C01`, or `W01`; the Role Registry remains authoritative.
- **Outcome** — the role-owned end state, not merely the first action.
- **Current-state grounding** — require fresh repository/Production evidence when current state matters.
- **Scope / Out of Scope** — name the task-specific boundary without copying the whole roadmap.
- **Decision boundary** — routine mechanical choices may use repository evidence; undefined Product decisions stay with the owning role.
- **Execution behavior** — when authorized, continue through implementation, inspection, in-scope fixes, verification, and handoff rather than stopping at a first pass.
- **Evidence** — report actual results, remaining Known / Inferred / Unknown, and the next owner.

Reference Development Rules, the Harness, and packet-defined checks rather than
inventing weaker substitutes. Implementation self-evidence remains different from
Independent QA, and Deployment READY remains different from Production Verified.

## Prompt authors and downstream authority

Any canonical lane may author the task brief for the next lane, including `C01` and
`W01`. Authoring the prompt does not transfer the receiver's authority to the author.

```text
prompt author ≠ downstream authority owner
```

A handoff prompt should state the author role, receiver role, receiver-owned outcome,
evidence being handed over, current scope/boundaries, and decisions the receiver
owns. The author must not pre-decide the receiver's independent verdict or a decision
owned by another lane.

Examples:

- `C01` may prepare the `W01` Pass A brief, but must not imply QA is already passed or steer the independent verdict.
- `W01` may return findings and required correction evidence to `C01`, but should not take over implementation design beyond what the packet/AC requires.
- `C01` may prepare Production-verification context for `W01` Pass B, but must not claim Production Verified.
- `W01` may prepare closure evidence for `00`, but must not claim Sprint Complete.
- `00` may prepare evidence for `01`, but must not select Product priority on `01`'s behalf.

## Role-specific emphasis

| Role | Prompt should emphasize |
|---|---|
| `00` | current lifecycle/state, evidence, blockers, next owner |
| `01` | Product/Architecture/Gate decision, evidence, scope classification |
| `02` | implementation-ready packet, applicable Definition of Ready, AC/tests/traceability |
| `C01` | active Specified packet, scoped implementation, inspect/fix/verify, exact handoff evidence |
| `W01` Pass A | exact candidate, independent verification, verdict, exact approved revision |
| `C01` release | exact QA-approved revision, current main, protected release path |
| `W01` Pass B | released Production identity, changed-path smoke, runtime evidence, SHA equality |

## Producer → receiver handoff prompt matrix

| Author → Receiver | Handoff prompt should provide | Receiver-owned decision/outcome that must remain open |
|---|---|---|
| `01 → 02` | Selected scope, rationale, dependencies/gate context, explicit deferrals | whether the packet satisfies Definition of Ready and can become `Specified` |
| `02 → C01` | authoritative packet, AC/tests/traceability, explicit Out of Scope and boundaries | implementation mechanics within the packet and `Implementation Complete` evidence |
| `C01 → W01` Pass A | exact branch/PR/head revision, implementation summary, self-check results, known notes | independent QA verdict and exact approved revision |
| `W01` Pass A → `C01` | verdict, Blocker/Non-blocker/Known Note findings, reproduction/evidence, affected AC | correction implementation and, after a new candidate, implementation-complete evidence |
| `C01` release → `W01` Pass B | exact QA-approved revision, resulting main SHA, deployment identity/state and release facts | independent `Production Verified` verdict |
| `W01 → 00` | QA and Production-verification evidence, remaining notes/blockers | `Sprint Complete` decision |
| `00 → 01` | Sprint closure/current evidence, unresolved risks and gate-relevant observations | Gate Review and explicit Next Selection |

Do not make a handoff prompt read like a desired verdict. Evidence may be complete and
specific; the receiver's authority should remain genuinely exercisable.

## Compact prompt pattern

```text
Author: <00 / 01 / 02 / C01 / W01>
Receiver role: <00 / 01 / 02 / C01 / W01>
Receiver-owned outcome: <the receiving role's completion point>
Current scope: <packet or task>
Evidence handed over: <revision / findings / lifecycle facts / other relevant evidence>
Important boundaries: <only non-obvious exclusions or constraints>
Authority: use latest main, AGENTS.md, docs/README.md, the active packet, and the
smallest relevant canonical set.
Execution: continue through the authorized receiver-owned outcome; resolve routine
choices from evidence; stop only the dependent action for a genuine blocker or a
decision owned elsewhere.
Evidence: report actual results, remaining uncertainty, and next owner.
```

For a self-authored prompt where author and receiver are the same lane, the same
structure applies; do not use the author field to broaden authority.

Prefer this compact structure over long prompts that duplicate repository authority.
Do not paste historical chat summaries as current state, copy every canonical rule,
or add repeated approval/checklist steps merely for reassurance.

## Maintenance

Update this file when repeated development failures show that prompt composition is
the durable root cause. Preserve all existing Product, Architecture, lifecycle,
AI/Mutation, data/security, QA/release, and active-packet authority.
