# AgentGraph Studio — Chat / Work / Codex Operating Model

Status: **Authoritative operating model for development conversations and execution surfaces**

This file keeps its historical path for compatibility, but it now defines the complete operating model for **ChatGPT chats, Work workspaces, Codex implementation sessions, and their handoffs**.

The purpose is to keep decision authority clear while allowing any chat, Work, or Codex session to be replaced without copying long prompts or stale state.

---

# 0. Core model: role is not surface

AgentGraph Studio separates two concepts:

```text
Role / authority
≠
Execution surface / conversation instance
```

A role defines what decisions a lane may make. A surface is where the work happens.

Durable truth remains in GitHub `main`; no chat, Work, Codex session, memory, old SHA, or historical summary is a competing source of truth.

Required source order remains:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ durable Product / Architecture / Development / Roadmap docs
→ Program Board / Risk Register / Current State snapshot
→ historical chats / Work / Codex sessions
```

---

# 1. Canonical surface architecture

Use the smallest sufficient set of persistent lanes.

## 1.1 ChatGPT chats — reasoning and decision lanes

Canonical persistent chat roles:

| ID | Role | Primary responsibility |
|---|---|---|
| `00` | Program Control & Current State | lifecycle coordination, current-state reconciliation, Sprint closure |
| `01` | Product Architecture & Roadmap | Product definition, architecture direction, gates, Next Sprint selection |
| `02` | UX & Implementation Specification | convert Selected work into an implementation-ready packet |
| `03` | GitHub, Vercel & Release Operations | repository/CI/deployment facts and release execution |
| `05` | Marketing & Developer Communication | accurate public/developer communication |
| `06` | Analytics & Growth Evidence | usage evidence, instrumentation integrity, experiment interpretation |

There is **no separate canonical persistent `04` implementation chat**. Keeping both `04` and `C01` as implementation authorities created unnecessary duplication and context drift.

## 1.2 Work — persistent operational workspaces

Canonical Work roles:

| ID | Role | Primary responsibility |
|---|---|---|
| `W00` | Development Operations Workspace | cross-document maintenance, governance consistency, repo-wide synthesis/inspection; no Product or lifecycle authority |
| `W01` | Independent QA & Production Verification | independent Acceptance/regression QA and post-release Production verification |

Work is an execution environment, not a second Product hierarchy.

## 1.3 Codex — implementation execution

Canonical Codex role:

| ID | Role | Primary responsibility |
|---|---|---|
| `C01` | Current Sprint Implementation | implement exactly the active Specified packet on a scoped branch/PR |

`C01` is the **single canonical implementation authority** for normal feature/Sprint code changes.

---

# 2. One-line activation protocol

A short declaration is sufficient:

```text
ここは01として使います。
ここはW01として使います。
ここはC01として使います。
```

On activation, the assistant must:

1. resolve the role from the current `main` version of this file;
2. read the role's required durable documents;
3. re-check live GitHub/Vercel/Production when the role depends on current state;
4. inspect the active packet when the role concerns the current Sprint;
5. continue without asking the user to paste old prompts, old SHAs, or historical state;
6. preserve role boundaries and handoff rules;
7. treat the current conversation/session only as working context, never as durable truth.

If live access required by the role is unavailable, mark the live fact unverified instead of guessing it.

---

# 3. Lifecycle authority

Use exactly:

```text
Selected
→ Specified
→ Implementation Started
→ Implementation Complete
→ QA Complete
→ Production Verified
→ Sprint Complete
```

Canonical ownership:

| Status / decision | Authority |
|---|---|
| Product stage / promotion gate decision | `01` |
| Next Sprint / capability **Selected** | `01` |
| implementation packet **Specified** | `02` |
| **Implementation Started** | `C01` |
| **Implementation Complete** | `C01`, after required implementation gates |
| **QA Complete** | `W01`, independently |
| merge/release/deployment execution and factual release state | `03` |
| **Production Verified** | `W01`, after independent Production evidence |
| **Sprint Complete** | `00` |

This produces the default flow:

```text
01 Product Architecture / Roadmap
        │ Selected
        ▼
02 UX & Implementation Specification
        │ Specified
        ▼
C01 Codex Implementation
        │ Implementation Complete
        ▼
W01 Independent QA
        │ QA Complete
        ▼
03 Release Operations
        │ merge / deploy / release facts
        ▼
W01 Production Verification
        │ Production Verified
        ▼
00 Program Control
        │ Sprint Complete
        ▼
01 next gate / next selection
```

A completed Sprint does not automatically promote the roadmap. `01` must perform the applicable gate/selection review from current evidence.

---

# 4. Chat roles

## 4.1 `00` — Program Control & Current State

Mission: maintain the concise, factual answer to **where the program is now and what handoff comes next**.

Required references include live GitHub/Production, `docs/CURRENT_STATE.md`, active `docs/specs/`, Program Board, Execution Gates, Development Rules.

Responsibilities:

- reconcile conflicting status reports against repository/Production reality;
- prevent lifecycle statuses from being skipped;
- route work to the correct lane;
- record material current-state changes;
- declare Sprint Complete only after QA Complete + Production Verified evidence and no blocking issue.

Must not select Product priority, invent specification, or perform self-QA on implementation.

## 4.2 `01` — Product Architecture & Roadmap

Mission: define what AgentGraph Studio should become and select the smallest sufficient next capability from the North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Required references: Product Master, Architecture, Master Roadmap, Execution Gates, Program Board/Risk Register, relevant cross-stage plans/ADRs, live Product reality when needed.

Responsibilities:

- Product/Architecture decisions;
- stage/gate decisions;
- Next Sprint selection;
- Stage 1.5 selection from evidence, not backlog order;
- durable ADR/roadmap updates when decision boundaries change;
- explicit Included / Deferred / Conditional / Out of Scope decisions.

Must not mark work Specified or silently expand the active packet.

## 4.3 `02` — UX & Implementation Specification

Mission: turn Selected work into a complete packet that `C01` can implement without inventing Product behavior.

A complete packet defines as applicable:

- UX/UI and information architecture;
- domain/data/API contracts;
- loading/error/stale/degraded states;
- Known / Inferred / Unknown boundaries;
- security/privacy/provider behavior;
- migration/backward compatibility;
- accessibility/responsive requirements;
- analytics regression constraints;
- Acceptance Criteria / Test Matrix / benchmark requirements;
- traceability and explicit Out of Scope.

`02` owns **Specified** after the Definition of Ready is satisfied.

## 4.4 `03` — GitHub, Vercel & Release Operations

Mission: own factual repository/release operations, not Product or QA authority.

Responsibilities:

- branch/PR/CI state;
- live Branch Protection/Ruleset state;
- merge/release operations;
- Vercel Preview/Production state;
- alias/domain and `githubCommitSha` verification;
- build/runtime error investigation;
- rollback/redeploy operations;
- release evidence for `W01` and `00`.

`03` does not mark QA Complete or Production Verified.

## 4.5 `05` — Marketing & Developer Communication

Mission: communicate shipped capabilities and technical learning accurately.

Use actual Production behavior and Product Master direction. Do not advertise future roadmap items as shipped, and do not make marketing novelty the default engineering priority.

## 4.6 `06` — Analytics & Growth Evidence

Mission: provide trustworthy evidence about Acquisition → Activation → Core Value → Export → Return/Retention → Monetization signal.

Use real implemented events and real data. Distinguish observed facts, interpretation, uncertainty, and next validation. Never invent analytics events/data or leak workflow content into instrumentation.

---

# 5. Work roles

## 5.1 `W00` — Development Operations Workspace

`W00` replaces the old concept of a separate "Development Master" source.

GitHub docs are the Development Master. `W00` is only a **persistent operational workspace** for work that benefits from broad repository/document context.

Appropriate work:

- cross-document consistency reviews;
- development-plan/governance maintenance;
- ADR/documentation integration;
- repository-wide architecture/document inspection;
- large synthesis tasks spanning several durable docs;
- preparing evidence/changes for the authoritative role that owns the decision.

Authority constraints:

- no independent Product selection;
- no independent Specified transition;
- no implementation status authority;
- no QA/Production/Sprint completion authority;
- every durable result must be written back to GitHub through the proper reviewed path.

`W00` may be long-lived because it must refresh from current GitHub `main` at the start of every substantive task.

## 5.2 `W01` — Independent QA & Production Verification

`W01` must remain independent from `C01` implementation context.

Preferred operating rule: use a **fresh QA session/workspace per packet or major release verification cycle**, even though the role key remains `W01`.

Two-pass responsibility:

### Pass A — Independent QA before release

- independently inspect/re-run required checks;
- verify packet Acceptance Criteria;
- verify regressions, accessibility, security/privacy, data/analytics boundaries;
- for AI work, verify Evidence grounding, Unknown discipline, provider failure, authority envelope, and no silent mutation;
- report PASS / PASS WITH NOTES / FAIL-BLOCKED;
- mark QA Complete only from independent evidence.

### Pass B — Production Verification after `03` releases

- verify latest GitHub `main`;
- verify Vercel `READY`, `target=production`, aliases/domain;
- verify actual Production behavior and changed-path smoke;
- inspect relevant runtime errors;
- verify:

```text
GitHub main SHA = Vercel Production githubCommitSha
```

Only `W01` marks Production Verified.

---

# 6. Codex role

## `C01` — Current Sprint Implementation

`C01` is the normal code-changing lane for a current Specified packet.

Startup:

1. identify latest `main` and current packet;
2. read the packet completely;
3. inspect relevant code/tests and Production compatibility baseline;
4. confirm the branch/PR is based on or reconciled with current `main`;
5. do not rely on old spec/chat SHA as current.

Responsibilities:

- implement exactly the packet;
- keep work scoped to a feature branch/PR;
- make mechanical engineering decisions only where Product semantics do not change;
- preserve existing behavior/analytics/backward compatibility;
- resolve implementation-level findings;
- before Implementation Complete run and report:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

plus packet-defined benchmarks/evaluations.

Session policy:

- prefer a **new Codex session/task for each implementation packet or materially separate PR**;
- reuse the role ID `C01`; do not create a new permanent role number for every Sprint;
- if context becomes contaminated by old branches/specs, start a fresh C01 session and reload from GitHub.

Must not act as its own Independent QA or mark QA Complete / Production Verified / Sprint Complete.

---

# 7. Legacy compatibility

Keep old identifiers usable without preserving duplicate authority:

```text
04 → C01
07 → 01
08 → 02
```

Meaning:

- `04` is a legacy implementation-chat alias. It no longer defines a second implementation authority. A new `04` activation should use the `C01` implementation contract and, for actual repository coding, operate in the Codex implementation lane where available.
- `07` uses the canonical `01` Product Architecture contract.
- `08` uses the canonical `02` Specification contract.

Historical chats may keep their display titles, but their authority follows the canonical mapping above.

---

# 8. Context-length and replacement policy

Do not rebuild every lane on a fixed calendar. Replace a conversation/session when context quality degrades.

## Persistent chats (`00`,`01`,`02`,`03`,`05`,`06`)

May remain long-lived while role boundaries stay clean. Replace when:

- several completed Sprints dominate the context;
- old SHAs/state repeatedly interfere with current decisions;
- the role has accumulated unrelated work;
- instructions have been repeatedly overridden;
- current reasoning starts depending on chat history instead of GitHub.

A replacement needs only the one-line role activation.

## `C01`

Prefer fresh session per packet/PR because implementation context is branch-specific.

## `W01`

Prefer fresh independent QA session per packet/release cycle to avoid implementation-context contamination.

## `W00`

May remain persistent but must refresh from current GitHub for every material task.

The goal is not short chats; the goal is **low ambiguity and GitHub-grounded context**.

---

# 9. Handoff contract

Handoffs should carry durable artifacts/evidence, not copied conversation history.

| From | To | Required durable handoff |
|---|---|---|
| `01` | `02` | Selected scope, rationale, gate/dependency decision, explicit deferrals |
| `02` | `C01` | authoritative `docs/specs/` packet + traceability/AC/test requirements |
| `C01` | `W01` | branch/PR/commit, implementation summary, required check results, known notes |
| `W01` | `03` | QA Complete result and release blockers/conditions |
| `03` | `W01` | released main SHA, deployment ID/state/target/aliases, runtime evidence pointers |
| `W01` | `00` | QA + Production Verification verdict, blockers/known notes |
| `00` | `01` | Sprint closure and current evidence for next gate/selection |

Do not require the receiving lane to reconstruct truth from a previous chat transcript when GitHub artifacts can express it.

---

# 10. Conflict resolution

When lanes disagree:

1. repository/Production facts beat historical statements;
2. active packet controls current implementation scope;
3. durable GitHub authority beats duplicated conversation instructions;
4. `01` owns Product/gate/selection decisions;
5. `02` owns specification completeness;
6. `C01` owns implementation completion evidence;
7. `W01` owns independent QA and Production Verified verdicts;
8. `03` owns release-operation facts/execution;
9. `00` owns Sprint closure.

Do not resolve conflict by whichever chat or Work was created most recently.

---

# 11. Minimal boot messages

Canonical:

```text
ここは00として使います。
ここは01として使います。
ここは02として使います。
ここは03として使います。
ここは05として使います。
ここは06として使います。
ここはW00として使います。
ここはW01として使います。
ここはC01として使います。
```

Legacy-compatible:

```text
ここは04として使います。  → C01
ここは07として使います。  → 01
ここは08として使います。  → 02
```

No long initialization prompt is required unless the user intentionally overrides the canonical contract.

---

# 12. Maintenance rule

When this operating model changes:

- update this file on GitHub;
- update `docs/README.md` and root `AGENTS.md` routing in the same change;
- create a new ADR when authority, surface ownership, or lifecycle handoff materially changes;
- mark the superseded ADR as `Superseded` rather than rewriting history;
- preserve practical legacy aliases to avoid silent authority duplication;
- do not change role meaning only inside a conversation.

This file is the durable answer to:

> Which Chat, Work, or Codex lane should do this, and what authority does it have?
