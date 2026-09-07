# AgentGraph Studio — Decision Records

Use this directory for durable Product/Architecture/operating-model decisions that materially change contracts, sequencing, boundaries, migration strategy, or development decision authority.

Decision records are not current-state snapshots and do not replace live repository/Production checks.

## Decision index

Status is recorded by each ADR; consult the Role Registry and current contracts before applying historical operating models.

| Decision | Recorded status |
|---|---|
| [ADR-0001 — Roadmap Execution Governance](ADR-0001-roadmap-execution-governance.md) | **Accepted** |
| [ADR-0002 — Canonical Chat Operating Model](ADR-0002-canonical-chat-operating-model.md) | **Superseded** |
| [ADR-0003 — Development Plan Execution Hardening](ADR-0003-development-plan-execution-hardening.md) | **Accepted** |
| [ADR-0004 — Separate Chat, Work, and Codex Responsibilities](ADR-0004-chat-work-codex-surface-separation.md) | **Superseded** |
| [ADR-0005 — Minimal Development-Only Operating Model](ADR-0005-minimal-development-only-operating-model.md) | **Accepted** |
| [ADR-0006 — Paid access for provider-backed Architecture Review](ADR-0006-paid-access-for-provider-backed-architecture-review.md) | **Accepted** |
| [ADR-0007 — Commercial validation before paid expansion](ADR-0007-commercial-validation-before-paid-expansion.md) | **Accepted** |
| [ADR-0009 — Select CrewAI Static Import v0 as the API-independent foundation packet](ADR-0009-select-crewai-static-import-v0.md) | **Accepted** |

ADR-0008 is not present on `main`; numbering gaps do not imply an accepted decision. The proposal in open PR #15 is not an active contract.

## When an ADR is required

Create an ADR when a decision materially changes one or more of:

- Product/Architecture invariants
- roadmap stage sequencing
- evaluator authority
- persisted workflow/data schema
- migration/backward-compatibility strategy
- framework-target strategy
- security/privacy trust boundary
- persistence/cloud ownership model
- semantic mutation/apply model
- major dependency/tooling architecture
- canonical chat/Work role ownership, lifecycle authority, or cross-role handoff model

Small packet-local implementation details do not require an ADR when they do not alter durable behavior.

## Status vocabulary

Use one of:

- `Proposed`
- `Accepted`
- `Superseded`
- `Rejected`

## Minimum template

```text
# ADR-NNNN — Title

Status:
Date:

## Context

## Decision

## Rationale

## Consequences

## Alternatives considered

## Migration / compatibility impact

## Related docs / packets
```

## Change rule

Do not rewrite accepted historical decisions as though the original decision never happened. If direction materially changes, create a new ADR and mark the old one `Superseded` with a link to the replacement.
