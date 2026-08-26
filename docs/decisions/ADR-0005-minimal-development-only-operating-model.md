# ADR-0005 — Minimal Development-Only Operating Model

Status: **Accepted**

Date: 2026-08-26

Supersedes: `ADR-0004-chat-work-codex-surface-separation.md`

## Context

ADR-0004 correctly separated Chat, Work, Codex, and GitHub responsibilities, but it still retained more permanent lanes than the current development program requires:

- a permanent `03` GitHub/Vercel/Release chat;
- a permanent `W00` Development Operations Workspace;
- permanent `05` Marketing and `06` Analytics/Growth roles even while the project is intentionally focused only on development.

That model was safer than the earlier duplicated `04`/`C01` implementation structure, but it still treated several **activities** as though they required independent permanent **authorities**.

The operating model should follow Simplest Sufficient Architecture just like the product architecture itself.

The current development lifecycle needs independent boundaries for:

1. program/current-state closure;
2. Product/Architecture selection;
3. implementation specification;
4. repository implementation;
5. independent QA/Production verification.

Release execution does not currently require a sixth authority. Cross-document Work does not require a separate W00 authority. Marketing/SNS/Growth analysis are currently dormant and should not occupy permanent development lanes.

## Decision

Adopt exactly five canonical development lanes:

```text
Chat:
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification

Codex:
C01 Current Sprint Implementation

Work:
W01 Independent QA & Production Verification
```

The durable source of truth remains GitHub `main`.

### Surface model

```text
GitHub main = durable truth
Chat        = Product / specification / coordination reasoning
Codex       = packet-bound repository implementation
Work        = independent verification when independence matters
```

Work may still be used temporarily by `00`, `01`, or `02` for complex repository/document tasks without creating a new role.

### Lifecycle ownership

```text
Selected                → 01
Specified               → 02
Implementation Started  → C01
Implementation Complete → C01
QA Complete             → W01
normal merge/release    → C01 after W01 QA of the same revision
Production Verified     → W01
Sprint Complete         → 00
```

Default flow:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Complete
→ W01 independent QA / QA Complete
→ C01 merge/release exact approved revision
→ W01 independent Production verification
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

If implementation or behavior changes after QA Complete, the QA approval becomes stale and the work returns to W01 before release.

### Removed permanent roles

The following are no longer canonical permanent lanes:

- `03` GitHub/Vercel/Release Operations;
- `04` Engineering/Implementation chat;
- `05` Marketing/Developer Communication;
- `06` Analytics/Growth Evidence;
- `W00` Development Operations / Development Master.

This does not ban the underlying activities.

Routing is:

- normal release work → `C01`;
- release/current-state coordination or exceptional rollback → `00`;
- independent release verification → `W01`;
- broad Product/Architecture Work-mode analysis → `01` authority;
- broad specification Work-mode analysis → `02` authority;
- broad coordination/document maintenance → `00` authority;
- marketing/analytics tasks, if temporarily needed, use noncanonical task-specific conversations until recurring evidence justifies a durable role.

### Context lifetime

- `00`, `01`, `02` may be long-lived while their role context remains clean;
- `C01` should normally be fresh per packet or materially separate PR;
- `W01` should normally be fresh per packet/release cycle to preserve independence;
- no lane is recreated on a fixed calendar merely because it is old.

## Rationale

This is the smallest structure that preserves the critical separation of:

```text
Product decision
≠ specification
≠ implementation
≠ independent verification
≠ lifecycle closure
```

Five lanes are enough because:

- release execution is procedural once a revision has passed independent QA;
- Production verification remains independent in W01;
- Work is a surface/capability and does not need a permanent W00 role;
- marketing/analytics are outside the current development focus;
- GitHub already provides durable cross-lane memory, so a separate Development Master workspace is redundant.

The result reduces context duplication, role confusion, long-chat drift, and the maintenance burden of keeping many role prompts synchronized.

## Consequences

Positive:

- only five canonical lanes need to be maintained;
- current development usage and GitHub documentation match;
- no W00 can drift into a competing master source;
- no dedicated release chat is required for ordinary releases;
- independent QA remains separate from implementation and release execution;
- dormant marketing/analytics roles no longer clutter engineering routing;
- temporary Work use remains available without multiplying authority.

Constraints:

- C01 must release only the exact revision approved by W01 or return for re-QA;
- W01 must independently verify Production after release;
- 00 must handle exceptional release coordination/rollback without pretending that coordination equals QA;
- if future scale genuinely creates a new independent recurring authority boundary, a new ADR may add a role.

## Alternatives considered

### Keep the six currently used lanes including W00

Rejected as the durable optimum. W00 is useful as a Work surface but does not own an independent development decision. Its tasks can be executed under 00/01/02 authority.

### Keep ADR-0004's nine canonical lanes

Rejected because release, marketing, analytics, and general development operations do not all require permanent authorities during the current development-only phase.

### Collapse 00 and 01

Rejected. Current-state/lifecycle closure and Product/Architecture selection are different authority boundaries. Keeping them separate helps prevent “we finished this Sprint” from becoming “therefore this is automatically next.”

### Collapse 01 and 02

Rejected. Product selection and implementation specification have different context and failure modes. Separate specification prevents scope decisions from leaking into implementation.

### Collapse C01 and W01

Rejected. Implementation self-test is not Independent QA.

### Use only one long-lived Work workspace

Rejected because Product, specification, implementation, and independent QA would contaminate each other's context and authority.

## Migration / compatibility impact

No application behavior, Product Architecture, roadmap sequencing, or active Stage 1 packet scope changes.

Existing chats/workspaces do not need to be deleted.

For new/replacement surfaces use only the five canonical role keys. Historical identifiers route by task rather than recreating permanent duplicate roles.

## Related docs / packets

- `docs/CHAT_ROLE_REGISTRY.md`
- `docs/README.md`
- `AGENTS.md`
- `docs/CURRENT_STATE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- `docs/decisions/ADR-0004-chat-work-codex-surface-separation.md`
- active packets under `docs/specs/`
