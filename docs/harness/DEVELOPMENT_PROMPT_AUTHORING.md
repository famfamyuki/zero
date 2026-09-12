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

## Compact prompt pattern

```text
Role: <00 / 01 / 02 / C01 / W01>
Outcome: <role-owned completion point>
Current scope: <packet or task>
Important boundaries: <only non-obvious exclusions or constraints>
Authority: use latest main, AGENTS.md, docs/README.md, the active packet, and the
smallest relevant canonical set.
Execution: continue through the authorized role-owned outcome; resolve routine
choices from evidence; stop only the dependent action for a genuine blocker or a
decision owned elsewhere.
Evidence: report actual results, remaining uncertainty, and next owner.
```

Prefer this compact structure over long prompts that duplicate repository authority.
Do not paste historical chat summaries as current state, copy every canonical rule,
or add repeated approval/checklist steps merely for reassurance.

## Maintenance

Update this file when repeated development failures show that prompt composition is
the durable root cause. Preserve all existing Product, Architecture, lifecycle,
AI/Mutation, data/security, QA/release, and active-packet authority.
