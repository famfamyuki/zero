# ADR-0002 — Canonical Chat Operating Model

Status: **Superseded**

Date: 2026-08-26

Superseded by: [`ADR-0004 — Separate Chat, Work, and Codex Responsibilities`](./ADR-0004-chat-work-codex-surface-separation.md)

> Historical decision record. The role-registry principle remains valid, but the original `04 / C01 / W00` surface ownership model was replaced by ADR-0004 to remove duplicate implementation authority and separate Chat, Work, and Codex responsibilities.

## Context

AgentGraph Studio development is intentionally split across multiple ChatGPT chats / Work lanes so Product Architecture, Specification, Implementation, QA, Release, Marketing, and Analytics do not collapse into one ambiguous conversation.

Historically, chat roles were partly defined inside conversation prompts. That creates several risks when a chat is replaced or continued in a new conversation:

- the user must manually re-paste long role prompts;
- old SHAs/current-state snapshots can accidentally be treated as current;
- legacy role numbers can create competing sources of Product/Roadmap or Specification authority;
- lifecycle ownership such as Selected / Specified / QA Complete can drift between chats;
- a new chat may preserve the number but lose the role's required GitHub references and decision boundaries.

GitHub `main` is already the durable source of truth for Product, Architecture, Roadmap and Development Rules, so conversation roles should also be recoverable from GitHub instead of existing only in chat history.

## Decision

Adopt `docs/CHAT_ROLE_REGISTRY.md` as the authoritative conversation-role registry.

A short user declaration such as:

```text
ここは01として使います。
```

is sufficient to activate that role.

The assistant must resolve the identifier from the current `main` registry, load the required GitHub documents, re-check live GitHub/Vercel/Production state when required by the role, and continue without asking the user to paste the previous role prompt or historical current-state snapshot.

The original canonical active chat roles were:

```text
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification
03  GitHub, Vercel & Release Operations
04  Engineering & Implementation
05  Marketing & Developer Communication
06  Analytics & Growth Evidence
```

The original execution/verification lanes were:

```text
C01 Current Sprint Implementation
W01 Independent QA & Release Verification
W00 Development Master Synthesis
```

Legacy compatibility was:

```text
07 → 01
08 → 02
```

Original lifecycle ownership was:

```text
Selected                → 01
Specified               → 02
Implementation Started  → 04 / C01
Implementation Complete → 04 / C01 after required checks
QA Complete             → W01
Production Verified     → W01 using independent Production evidence
Sprint Complete         → 00
```

`03` owned repository/deployment facts and release operations but did not replace independent QA authority.

`05` and `06` remained communication/evidence roles and did not automatically control engineering priority.

## Rationale

This decision moved role identity out of fragile chat-local prompts and into version-controlled GitHub documentation.

The user could create a replacement chat with one line, while the assistant reconstructed the role from GitHub rather than stale memory.

Legacy aliases also prevented duplicate roadmap/specification authority.

## Consequences

Positive consequences at the time:

- new/replacement chats needed only a short role declaration;
- long initialization prompts no longer needed to be copied;
- role meaning became version-controlled;
- current-state verification remained separate from role identity;
- cross-chat handoffs became predictable.

Limitation discovered later:

- `04` and `C01` still duplicated implementation authority;
- W00's name could still imply a competing Development Master;
- the model did not explicitly distinguish Chat vs Work vs Codex as execution surfaces.

ADR-0004 resolves those limitations while preserving the GitHub-backed role-registry principle.

## Alternatives considered

### Keep full prompts inside every new chat

Rejected because it is repetitive, error-prone, and encourages stale duplicated instructions.

### Store role definitions only in ChatGPT memory/history

Rejected because role contracts must be durable and reviewable alongside the development system.

### Keep both old and new role numbers as independent authorities

Rejected because duplicate Product/Roadmap and Specification roles can diverge.

### Collapse all work into one chat

Rejected because Product decision, specification, implementation, independent QA and release verification have intentionally different authority boundaries.

## Migration / compatibility impact

This ADR is retained as historical evidence. Current operating behavior is defined by ADR-0004 and the latest `docs/CHAT_ROLE_REGISTRY.md`.

No application runtime behavior or packet scope was changed by either decision.

## Related docs / packets

- `docs/CHAT_ROLE_REGISTRY.md`
- `docs/README.md`
- `AGENTS.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CURRENT_STATE.md`
- `docs/roadmap/MASTER_ROADMAP.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/decisions/ADR-0004-chat-work-codex-surface-separation.md`
