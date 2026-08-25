# AgentGraph Studio — Decision Records

Use this directory for durable Product/Architecture decisions that materially change contracts, sequencing, boundaries, or migration strategy.

Decision records are not current-state snapshots and do not replace live repository/Production checks.

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
