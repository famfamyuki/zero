# ADR-0003 — Development Plan Execution Hardening

Status: **Accepted**  
Date: **2026-08-26**

## Context

The long-term Product Master, Architecture Master, Master Roadmap, Evaluation Trust/Scale plan, Data & AI Governance, Security/Reliability baseline, and current Stage 1 packet already define a strong product direction.

A review of the integrated plan identified remaining execution risks:

- CI existed but repository merge protection was not live-enforced on `main`
- evaluator trust gates did not yet express authority as capability-scoped permissions
- Gate C pipeline safety could be misread as permission for all semantic mutation, including side-effect-sensitive changes before structured capability/control evidence exists
- Stage 1.5 candidates lacked one compact evidence-trigger matrix
- Scenario/Acceptance expectations existed strategically but were not yet a first-class architecture contract
- Selected → Specified lacked one explicit Definition of Ready
- durable contract versions lacked a shared retirement/deprecation lifecycle
- Product/Architecture/Gate → Packet AC → test traceability was not explicit enough
- program-level risks were distributed across packets/plans rather than centrally tracked
- operational SLO guidance correctly avoided guessed permanent thresholds but lacked an explicit maturity path from baseline to calibrated target
- authoritative documentation had grown enough that broken references/missing files needed deterministic CI checking

## Decision

Adopt the following execution-hardening system without changing current Stage 1 implementation scope or existing application behavior.

### 1. AI authority is capability-scoped

`docs/roadmap/EXECUTION_GATES.md` defines an AI Authority Envelope (`AE0`–`AE6`).

Approval to review architecture does not automatically authorize architecture proposals, tool/model recommendations, security/control recommendations, architecture patches, or side-effect-sensitive patches.

Gate records must state the approved envelope/scope when authority expands.

### 2. Patch pipeline safety and mutation scope are separate

Gate C must approve both:

- the generic safe transformation pipeline; and
- the allowed semantic mutation scope.

Prefer architecture-only safe transformation first. Changes involving external mutation, credentials, sensitive data, approval/policy, or insufficiently known tool capabilities require stronger capability/human-control evidence before authorization.

A minimal capability/control foundation may be pulled forward before the full later Security & Policy stage when required as a dependency. This does not automatically pull the entire Stage 5 scope forward.

### 3. Scenario/Acceptance becomes a first-class architecture contract

`docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md` separates:

```text
configured expectation
≠ static evidence of support
≠ observed runtime behavior
```

It provides the bridge from Intent/Constraints and design-time evaluation to later behavioral/runtime verification.

### 4. Add an executable Program Board and Risk Register

`docs/roadmap/PROGRAM_BOARD.md` provides current milestone/candidate/blocker coordination and evidence-based Stage 1.5 selection triggers.

`docs/roadmap/RISK_REGISTER.md` tracks durable cross-stage risks and blocker escalation.

These do not replace the full roadmap or live state checks.

### 5. Add Engineering Execution Governance

`docs/ENGINEERING_EXECUTION_GOVERNANCE.md` defines:

- Definition of Ready
- durable version/deprecation lifecycle
- lightweight requirement traceability
- operational-quality maturity
- repository enforcement contract
- documentation consistency rules

### 6. Add deterministic documentation integrity CI

Add `npm run docs:check` and run it in repository CI before test/typecheck/build.

The checker verifies deterministic repository/document invariants only; it does not attempt subjective roadmap validation.

### 7. Repository protection is live state, not prose

Branch Protection / Rulesets should protect `main` and require the CI status where the repository/account supports it.

Documentation is not proof that enforcement is active. If the live repository remains unprotected, keep risk `R-010` active / blocker-classifiable until the external repository setting is enabled and verified.

## Consequences

Positive:

- evaluator authority can grow incrementally by evidence-supported capability class
- architecture patch safety no longer implies security/side-effect mutation authority
- Stage 1.5 selection becomes more evidence-driven and less roadmap-by-inertia
- Scenario/Acceptance expectations can later support behavioral verification without fabricating runtime certainty
- packet readiness, version retirement, traceability, risk tracking, and SLO maturity become explicit
- documentation drift gains a deterministic CI guard

Costs:

- more cross-stage governance must be maintained
- gate records need authority/mutation-scope fields when applicable
- future packets need a small traceability table and Definition of Ready review
- repository settings still require live administrative enforcement outside repository file contents

## Non-decisions

This ADR does **not**:

- expand the current `AGS-EGAI-AR-V0-P1` packet
- approve Stage 2
- approve Stage 3 mutation
- implement Scenario persistence
- implement Workflow/Graph V2
- pull the whole Security & Policy stage earlier
- select a Stage 1.5 packet
- change current application analytics behavior

## Follow-up

- enable and live-verify `main` Branch Protection / Ruleset requiring `test-typecheck-build` when administrative tooling permits
- keep `R-010` active until verified
- use Program Board + Risk Register during the next Gate A / Sprint-selection review
- require `npm run docs:check`, `npm test`, `npm run typecheck`, and `npm run build` for this governance change before merge
