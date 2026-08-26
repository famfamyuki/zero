# ADR-0004 — Separate Chat, Work, and Codex Responsibilities

Status: **Accepted**

Date: 2026-08-26

Supersedes: `ADR-0002-canonical-chat-operating-model.md`

## Context

ADR-0002 successfully moved conversation-role meaning out of fragile chat prompts and into GitHub. However, the first canonical model still mixed **decision roles** with **execution surfaces**.

The main problems were:

- `04 Engineering & Implementation` and `C01 Current Sprint Implementation` both had implementation authority;
- `W00 Development Master Synthesis` could be mistaken for another durable master source even though GitHub docs are authoritative;
- `W01` mixed independent QA and release verification without explicitly separating release execution owned by `03`;
- the model did not state when to prefer a fresh Codex/QA session versus a long-lived Chat/Work context;
- users could reasonably ask whether Chat, Work, and Codex were separate hierarchies or merely different places to execute the same development system.

This duplication increases the chance of status drift, stale branch context, implementation self-review, and contradictory handoffs.

## Decision

Adopt a **surface-separated operating model**:

```text
Chat = reasoning / decision / coordination
Work = persistent operational workspace / independent verification
Codex = packet-bound repository implementation
GitHub main = durable source of truth
```

### Canonical persistent Chat roles

```text
00 Program Control & Current State
01 Product Architecture & Roadmap
02 UX & Implementation Specification
03 GitHub, Vercel & Release Operations
05 Marketing & Developer Communication
06 Analytics & Growth Evidence
```

There is no separate canonical persistent `04` implementation authority.

### Canonical Work roles

```text
W00 Development Operations Workspace
W01 Independent QA & Production Verification
```

`W00` is an operational workspace, not a Development Master source of truth.

### Canonical Codex role

```text
C01 Current Sprint Implementation
```

`C01` is the single normal implementation authority for a current Specified packet.

### Lifecycle ownership

```text
Selected                → 01
Specified               → 02
Implementation Started  → C01
Implementation Complete → C01
QA Complete             → W01
Release execution/facts → 03
Production Verified     → W01
Sprint Complete         → 00
```

The preferred release flow is therefore:

```text
C01 Implementation Complete
→ W01 independent pre-release QA
→ 03 merge/release
→ W01 independent Production verification
→ 00 Sprint Complete
```

### Legacy compatibility

```text
04 → C01
07 → 01
08 → 02
```

Existing historical chat names may remain, but duplicate authority does not.

### Session-lifetime policy

- `00/01/02/03/05/06` may be long-lived while role context remains clean;
- `C01` should normally use a fresh Codex session/task per packet or materially separate PR;
- `W01` should normally use a fresh independent QA session/workspace per packet/release cycle;
- `W00` may remain long-lived but must reload current GitHub state for every substantive task;
- no lane is recreated on a fixed calendar merely because it is old.

## Rationale

This is the Simplest Sufficient Architecture for the development operating model.

It removes the only major duplicated implementation authority while preserving useful specialization:

- Product decisions remain separate from specification;
- specification remains separate from coding;
- coding remains separate from independent QA;
- release execution remains separate from the Production Verified verdict;
- current-state closure remains separate from Product selection;
- communication and analytics stay outside the center of engineering priority.

The model also matches the practical strengths of each surface:

- Chat is good for durable role-based reasoning and handoffs;
- Work is useful for persistent, multi-document operational tasks and independent verification;
- Codex is the repository-changing implementation lane;
- GitHub is versioned, shared, inspectable, and therefore the correct durable memory.

## Consequences

Positive:

- no parallel `04`/`C01` implementation authority;
- fewer permanent chats are required;
- implementation and QA contexts are easier to keep independent;
- W00 can no longer be mistaken for a competing master plan;
- role replacement requires only a short activation message;
- long-context risk is handled by surface-specific replacement guidance rather than frequent global resets;
- handoffs depend on GitHub artifacts/evidence instead of copied conversation history.

Costs / constraints:

- users accustomed to `04` must treat it as a compatibility alias for `C01`;
- W00's old “Development Master” meaning changes to an operational workspace;
- assistants must distinguish release execution (`03`) from the Production Verified verdict (`W01`);
- current documentation that hard-codes the former role map must be updated together.

## Alternatives considered

### Keep both `04` and `C01`

Rejected. They had nearly identical implementation responsibility and created avoidable ambiguity about which lane owns Implementation Complete.

### Put all implementation in a persistent `04` chat and remove Codex `C01`

Rejected. Repository-changing work benefits from a packet/branch-specific implementation context, and Codex is the natural execution surface.

### Remove W00 entirely

Not selected. A persistent operational workspace remains useful for cross-document governance, repository-wide synthesis, and durable documentation maintenance, provided it has no independent decision authority.

### Merge `03` and `W01`

Rejected. Release execution and independent verification are intentionally different responsibilities. The actor that deploys should not be the sole authority declaring the deployment independently verified.

### Collapse everything into one Work or one chat

Rejected because Product selection, specification, implementation, independent QA, and release verification have different authority boundaries.

## Migration / compatibility impact

No application runtime behavior or active Sprint Product scope changes.

Migration is operating-model only:

- `04` becomes a legacy alias to `C01`;
- `W00` becomes Development Operations Workspace;
- `W01` uses explicit pre-release QA and post-release Production verification passes;
- `03` explicitly owns merge/release execution and factual deployment state;
- new/replacement sessions use the canonical surface architecture in `docs/CHAT_ROLE_REGISTRY.md`.

Historical chats and Work sessions remain historical evidence only; they do not need to be deleted.

## Related docs / packets

- `docs/CHAT_ROLE_REGISTRY.md`
- `docs/README.md`
- `AGENTS.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- `docs/CURRENT_STATE.md`
- `docs/decisions/ADR-0002-canonical-chat-operating-model.md`
- active packets under `docs/specs/`
