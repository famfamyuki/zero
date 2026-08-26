# ADR-0002 — Canonical Chat Operating Model

Status: **Accepted**

Date: 2026-08-26

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

Canonical active chat roles are:

```text
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification
03  GitHub, Vercel & Release Operations
04  Engineering & Implementation
05  Marketing & Developer Communication
06  Analytics & Growth Evidence
```

Execution/verification lanes are:

```text
C01 Current Sprint Implementation
W01 Independent QA & Release Verification
W00 Development Master Synthesis
```

Legacy compatibility is preserved without preserving competing authority:

```text
07 → 01
08 → 02
```

Lifecycle ownership is explicitly routed:

```text
Selected                → 01
Specified               → 02
Implementation Started  → 04 / C01
Implementation Complete → 04 / C01 after required checks
QA Complete             → W01
Production Verified     → W01 using independent Production evidence
Sprint Complete         → 00
```

`03` owns repository/deployment facts and release operations but does not replace independent QA authority.

`05` and `06` remain useful communication/evidence roles but do not automatically control engineering priority.

## Rationale

This keeps the chat architecture lightweight for the user while making the meaning of each identifier durable, inspectable, and version-controlled.

The user can create a replacement chat with one line, while the assistant reconstructs the current role from GitHub rather than from stale memory.

Legacy aliases preserve old habits without allowing two roadmap authorities (`01` and `07`) or two specification authorities (`02` and `08`) to diverge.

Explicit lifecycle ownership also prevents implementation self-report from becoming independent QA, or coordination chats from silently re-selecting Product priorities.

## Consequences

Positive consequences:

- new/replacement chats need only a short role declaration;
- long initialization prompts no longer need to be copied between chats;
- role meaning changes are version-controlled;
- current-state verification remains separate from role identity;
- cross-chat handoffs become predictable;
- legacy identifiers remain usable without duplicating authority.

Costs/constraints:

- assistants operating in AgentGraph Studio must read the current registry when a role identifier is declared;
- material role architecture changes require GitHub documentation maintenance;
- a role declaration does not waive live-state checks required by that role;
- W00 remains supplementary because durable Product/Architecture/Roadmap truth lives in GitHub docs.

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

No application runtime behavior changes.

Existing chats may continue operating under their current role. New or replacement chats should use the canonical registry.

Legacy `07` and `08` activations automatically inherit canonical `01` and `02` contracts respectively unless the user explicitly requests archival/historical analysis.

No current implementation packet scope changes.

## Related docs / packets

- `docs/CHAT_ROLE_REGISTRY.md`
- `docs/README.md`
- `AGENTS.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CURRENT_STATE.md`
- `docs/roadmap/MASTER_ROADMAP.md`
- `docs/roadmap/EXECUTION_GATES.md`
