# AgentGraph Studio — Development Operating Model

Status: **Authoritative operating model for Chat / Work / Codex development surfaces**

This file keeps the historical `CHAT_ROLE_REGISTRY.md` path for compatibility, but its scope is the complete development operating model.

AgentGraph Studio is currently operated in a **development-only focus mode**. Marketing, SNS, growth analysis, and similar activities are not part of the canonical development surface architecture unless they are explicitly reintroduced later.

The goal is not to create one lane for every activity. The goal is the **smallest sufficient set of independent authorities** needed to move safely from Product decision to Production evidence.

---

# 0. Core principle

```text
GitHub main = durable truth
Chat = Product / specification / coordination reasoning
Work = independent verification environment when independence matters
Codex = packet-bound repository implementation
```

A conversation, Work workspace, or Codex task is never the durable source of truth.

When information conflicts, use:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ durable Product / Architecture / Development / Roadmap docs
→ Program Board / Risk Register / Current State snapshot
→ historical Chat / Work / Codex context
```

Role identity and execution surface are related but not identical. A role defines authority; the surface is where the work happens.

---

# 1. Canonical development architecture — exactly five lanes

The canonical operating model is intentionally limited to five lanes.

| Surface | ID | Canonical role | Primary authority |
|---|---|---|---|
| Chat | `00` | Program Control & Current State | lifecycle coordination, current-state reconciliation, Sprint closure |
| Chat | `01` | Product Architecture & Roadmap | Product/Architecture decisions, gates, Next Sprint selection |
| Chat | `02` | UX & Implementation Specification | implementation-ready packet and `Specified` transition |
| Codex | `C01` | Current Sprint Implementation | repository implementation, self-test, normal merge/release execution after QA |
| Work | `W01` | Independent QA & Production Verification | independent QA and independent Production verification |

No other persistent lane is canonical in development-only focus mode.

This means there is no permanent canonical:

- `03` Release Operations chat;
- `04` Implementation chat;
- `05` Marketing chat;
- `06` Analytics/Growth chat;
- `W00` Development Operations / Development Master workspace.

Those activities may still occur when needed, but they do not justify permanent independent authorities today.

---

# 2. Why five lanes is the Simplest Sufficient Architecture

The development lifecycle has five materially different authority boundaries:

1. **Where are we / can the Sprint close?** → `00`
2. **What should we build and in what order?** → `01`
3. **What exactly must the implementation do?** → `02`
4. **Change the repository faithfully.** → `C01`
5. **Independently prove it works and Production matches.** → `W01`

Adding more permanent lanes is justified only when a recurring responsibility has both:

- a genuinely independent authority boundary; and
- enough repeated workload/context to make separation safer than routing through an existing lane.

A task being complex is not enough reason to create a new role. Existing roles may use Work mode or repository tools temporarily while retaining their authority.

---

# 3. Lifecycle authority and default handoff

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

| Status / action | Authority |
|---|---|
| Product stage / Promotion Gate decision | `01` |
| Next Sprint / capability **Selected** | `01` |
| implementation packet **Specified** | `02` |
| **Implementation Started** | `C01` |
| **Implementation Complete** | `C01`, after required implementation checks |
| independent pre-release **QA Complete** | `W01` |
| normal merge/release execution of the QA-approved revision | `C01` |
| **Production Verified** | `W01`, independently |
| **Sprint Complete** | `00` |

Default flow:

```text
01 Product Architecture / Roadmap
        │ Selected
        ▼
02 Specification
        │ Specified packet
        ▼
C01 Codex Implementation
        │ Implementation Complete
        ▼
W01 Independent QA — Pass A
        │ QA Complete
        ▼
C01 merge / release approved revision
        │ main / deployment facts
        ▼
W01 Production Verification — Pass B
        │ Production Verified
        ▼
00 Program Control
        │ Sprint Complete
        ▼
01 Evidence → Gate Review → Explicit Next Selection
```

A successful Sprint does not mechanically select the next roadmap stage.

---

# 4. Role contracts

## 4.1 `00` — Program Control & Current State

Mission: maintain the concise, factual answer to **where development is now, which lifecycle state is valid, and which lane should act next**.

Required references as applicable:

- latest GitHub `main` / current branch/PR reality;
- latest Vercel Production / actual behavior;
- `docs/CURRENT_STATE.md`;
- active packet under `docs/specs/`;
- Program Board / Execution Gates / Risk Register;
- Development Rules / Execution Governance.

Responsibilities:

- reconcile conflicting status claims against repository/Production reality;
- prevent lifecycle states from being skipped;
- maintain current-state snapshots when materially useful;
- route work to `01`, `02`, `C01`, or `W01`;
- declare Sprint Complete only after QA Complete + Production Verified evidence and no unresolved blocker;
- coordinate exceptional rollback/recovery decisions without taking over implementation or QA authority.

Must not:

- choose Product priority that belongs to `01`;
- invent implementation behavior that belongs to `02`;
- implement the packet itself;
- mark QA Complete / Production Verified from another lane's self-report.

`00` may use Work mode temporarily for repository-wide coordination or documentation inspection. That does **not** create a `W00` authority.

## 4.2 `01` — Product Architecture & Roadmap

Mission: define what AgentGraph Studio should become and select the smallest coherent next capability from:

```text
Understand → Evaluate → Improve → Verify → Own
```

Required references before material decisions:

- `docs/PRODUCT_MASTER.md`;
- `docs/ARCHITECTURE.md`;
- `docs/roadmap/MASTER_ROADMAP.md`;
- `docs/roadmap/EXECUTION_GATES.md`;
- Program Board / Risk Register;
- relevant cross-stage plans/contracts/ADRs;
- actual repository/Production capability when the decision depends on current behavior.

Responsibilities:

- Product Definition / Architecture decisions;
- dependency and stage sequencing;
- Promotion Gate decisions;
- Next Sprint selection;
- Stage 1.5 selection from evidence rather than backlog order;
- explicit Included / Deferred / Conditional / Out of Scope decisions;
- durable ADR / roadmap changes for material decisions.

Must not:

- mark a capability `Specified`;
- silently expand an active packet;
- mechanically advance to a future stage because the prior stage completed.

`01` may use Work mode for broad architecture/document analysis while retaining `01` authority. Do not create a permanent W00 just because the task is large.

## 4.3 `02` — UX & Implementation Specification

Mission: turn already-Selected work into a complete authoritative implementation packet so `C01` does not need to invent Product behavior.

A complete packet defines as applicable:

- user problem / goal / explicit Out of Scope;
- UX/UI / information architecture / flows;
- domain/data/API contracts;
- loading/error/empty/stale/degraded states;
- Known / Inferred / Unknown boundaries;
- AI authority/evidence/validation behavior;
- security/privacy/provider/persistence implications;
- migration/backward compatibility;
- accessibility/responsive behavior;
- analytics regression boundaries where existing instrumentation is affected;
- Acceptance Criteria / Test Matrix / benchmark requirements;
- requirement traceability;
- implementation and Production verification expectations.

`02` owns `Specified` only after the Definition of Ready is satisfied.

Must not re-select Product priority or pull future roadmap work into the packet.

## 4.4 `C01` — Current Sprint Implementation / Codex

Mission: faithfully implement the active Specified packet in the repository.

Preferred policy: **fresh Codex task/session per packet or materially separate PR**.

Startup:

1. read latest `main` and the complete active packet;
2. inspect relevant code/tests;
3. reconcile the working branch with current `main`;
4. check Production compatibility when relevant;
5. do not treat an old packet/chat SHA as current state.

Responsibilities:

- implement exactly the active packet;
- keep changes scoped to the packet/PR;
- make only mechanical engineering decisions that do not alter Product semantics;
- preserve existing features, analytics, compatibility, Evidence/Unknown boundaries;
- add/update required tests;
- resolve implementation-level QA findings;
- before Implementation Complete run and report:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

plus packet-defined evaluations/benchmarks;
- after `W01` QA Complete, perform the normal merge/release of the **same approved revision** through required branch protection / CI.

Release integrity rule:

- if code or behavior changes after QA Complete, the QA approval is stale;
- return to `W01` Pass A before release;
- merge/release execution does not authorize `C01` to mark Production Verified.

Must not act as its own Independent QA or mark QA Complete / Production Verified / Sprint Complete.

## 4.5 `W01` — Independent QA & Production Verification / Work

Mission: remain contextually and procedurally independent from implementation and prove both the packet and the released Production behavior.

Preferred policy: **fresh Work session per packet / major release verification cycle**.

### Pass A — independent pre-release QA

Independently verify as applicable:

- active packet Acceptance Criteria;
- required commands/tests/benchmarks;
- focused feature behavior and regressions;
- migration/backward compatibility;
- accessibility/responsive behavior;
- security/privacy/data/provider boundaries;
- AI grounding / Unknown discipline / failure isolation / authority envelope;
- analytics regression constraints;
- no silent semantic mutation.

Report:

- PASS;
- PASS WITH NOTES;
- FAIL / BLOCKED;

with Blocker / Non-blocker / Known Note classification.

Only `W01` marks QA Complete.

### Pass B — independent Production verification

After `C01` releases the approved revision, independently verify:

- latest GitHub `main`;
- the released code corresponds to the QA-approved change set;
- Vercel deployment is `READY`;
- `target=production`;
- correct aliases/domain;
- actual changed-path Production smoke;
- relevant runtime errors;
- required invariant:

```text
GitHub main SHA = Vercel Production githubCommitSha
```

Only `W01` marks Production Verified.

---

# 5. Work usage without W00

Work is a capability/surface, not automatically a role.

Use Work mode under the authority of `00`, `01`, or `02` when a task benefits from:

- large repository/document inspection;
- cross-document edits;
- broad architecture synthesis;
- complex artifact/file work.

The owning role does not change merely because Work mode is used.

Therefore no permanent `W00` is necessary.

Historical/existing `W00` workspaces may remain for reference, but new work should be routed by task authority:

```text
current state / governance coordination → 00
Product / Architecture / Roadmap → 01
Specification → 02
implementation → C01
independent QA / Production verification → W01
```

---

# 6. Release operations without a permanent `03`

Release operations are a lifecycle phase, not currently an independent decision authority.

Normal release path:

```text
W01 QA Complete
→ C01 merge exact approved revision through required CI/protection
→ Vercel auto/manual Production deployment as applicable
→ W01 independently verify Production
→ 00 close Sprint
```

If release investigation requires code/config changes, it belongs to `C01` and invalidates prior QA as appropriate.

If it is purely a coordination/rollback/status issue without implementation change, `00` coordinates it.

This removes a permanent `03` while preserving independent Production verification.

---

# 7. Non-development roles are dormant, not deleted from product knowledge

During development-only focus mode, do not maintain permanent Marketing/SNS/Analytics/Growth chat roles.

If those activities resume, start them as temporary task-specific conversations first. Add a new canonical persistent role only when repeated evidence shows a durable independent authority/context boundary is useful.

Do not let marketing/growth work silently regain engineering-priority authority merely because a temporary conversation exists.

---

# 8. Context length and replacement policy

Do not recreate all surfaces on a fixed calendar.

## `00`, `01`, `02`

May remain long-lived while their role context stays clean. Replace when:

- multiple obsolete Sprints dominate context;
- stale SHAs repeatedly interfere with current reasoning;
- unrelated work accumulates;
- instructions are repeatedly overridden;
- the lane starts relying on conversation history instead of GitHub truth.

A replacement requires only:

```text
ここは00として使います。
ここは01として使います。
ここは02として使います。
```

## `C01`

Prefer a fresh Codex task for each packet/major PR because implementation context is branch-specific.

## `W01`

Prefer a fresh independent Work session for each packet/release cycle to minimize implementation-context contamination.

The objective is not short context. It is **low ambiguity + fresh repository grounding**.

---

# 9. Durable handoff contract

Handoffs carry GitHub artifacts/evidence, not copied chat history.

| From | To | Durable handoff |
|---|---|---|
| `01` | `02` | Selected scope, rationale, gate/dependency decision, explicit deferrals |
| `02` | `C01` | authoritative packet + AC/test/traceability requirements |
| `C01` | `W01` Pass A | branch/PR/head revision, implementation summary, check results, known notes |
| `W01` Pass A | `C01` | QA verdict, exact approved revision, release conditions/blockers |
| `C01` | `W01` Pass B | main SHA, deployment identity/state, release facts |
| `W01` | `00` | QA + Production Verification verdict and remaining notes |
| `00` | `01` | Sprint closure + current evidence for next Gate/selection |

---

# 10. Legacy compatibility

Historical identifiers may appear in old chats/workspaces. They must not recreate duplicate authorities.

```text
03 → route by task: normal release implementation to C01; pure coordination to 00; independent verification to W01
04 → C01
05 → noncanonical temporary communication task
06 → noncanonical temporary analytics/evidence task
07 → 01
08 → 02
W00 → no independent role; route to 00/01/02/C01/W01 by authority
```

Do not create new persistent legacy lanes merely for naming compatibility.

---

# 11. Minimal boot messages

Canonical persistent development roles:

```text
ここは00として使います。
ここは01として使います。
ここは02として使います。
ここはC01として使います。
ここはW01として使います。
```

No long initialization prompt is required. The current GitHub `main` version of this operating model defines the role.

---

# 12. Change rule

A material change to this operating model must:

- be based on current repository/development reality;
- prefer fewer roles unless a new independent authority boundary is proven necessary;
- update this file, `docs/README.md`, and `AGENTS.md` together;
- update `docs/CURRENT_STATE.md` when the active operating model changes materially;
- create a new ADR and mark the prior operating-model ADR Superseded;
- never expand an active Product packet merely because the development operating model changed.

This file is the durable answer to:

> What is the smallest safe Chat / Work / Codex structure for developing AgentGraph Studio now?
