# AgentGraph Studio — Engineering Execution Governance

Status: **Authoritative cross-cutting execution governance**  
Scope: Definition of Ready, version/deprecation lifecycle, traceability, operational-quality calibration, documentation consistency, repository enforcement, and execution-risk handling.

This document complements `docs/DEVELOPMENT_RULES.md`. A stricter active packet wins for its scope.

## 0. Source-of-truth rule

Before using this document for an implementation/release decision, re-check current repository reality and the active packet.

This document defines durable execution discipline; it does not expand current Sprint scope.

---

# 1. Definition of Ready

A capability must not advance from **Selected** to **Specified / Implementation Started** merely because it is desirable.

Before a packet is implementation-ready, confirm all applicable items below.

## Product / dependency readiness

- the user problem and North Star value are explicit
- upstream Stage/Gate requirements are satisfied or the packet is explicitly foundation work
- the smallest sufficient scope is identified
- dependency order is understood
- later-stage features are explicitly Out of Scope

## Domain / architecture readiness

- authoritative domain owner is known
- required identity/version semantics are defined
- no speculative persisted major version is introduced
- migration/backward compatibility direction is defined
- existing deterministic/AI ownership boundaries remain clear

## Data / security readiness

- persistence/provider/data-flow changes are explicit
- Security/Data governance triggers have been reviewed
- secrets/sensitive data boundaries are defined
- abuse/size/timeout/degraded-state behavior is defined for relevant public/provider-backed endpoints

## UX / quality readiness

- primary states, errors, loading, stale/degraded behavior are defined
- accessibility/responsive implications are defined
- analytics regression boundaries are defined
- Acceptance Criteria are testable
- representative fixtures and regression tests are identified

## Release readiness

- `npm test`, `npm run typecheck`, and `npm run build` are expected to remain runnable
- Production verification is practically possible
- rollback/degraded-state direction is understood for material risk
- repository/release dependencies are not silently assumed

A packet that cannot answer an applicable readiness item is not implementation-ready. Product Architecture / Specification should resolve the missing contract or deliberately narrow scope.

---

# 2. Contract version lifecycle

Versioned durable contracts must have an explicit lifecycle instead of accumulating indefinitely.

Use these semantic states where applicable:

- `ACTIVE` — produced and accepted by current implementations
- `ACCEPTED_LEGACY` — no longer produced by default but still accepted/read safely
- `DEPRECATED` — still supported temporarily; migration path and deprecation reason are documented
- `READ_ONLY_LEGACY` — can be opened/inspected/exported but not safely edited/rewritten without migration
- `MIGRATION_REQUIRED` — must be explicitly converted before current operations
- `UNSUPPORTED` — rejected with a clear error; never silently reinterpreted

A version transition must document:

```text
Contract:
Old version/state:
New version/state:
Producer behavior:
Reader behavior:
Migration/normalization path:
Round-trip expectations:
Deprecation trigger/date or evidence condition:
Removal condition:
Rollback implications:
Fixtures/tests:
```

Rules:

- do not remove a legacy reader merely because a new writer exists
- do not silently reinterpret old semantics under a new version number
- persisted major-version changes require explicit migration justification/ADR where already required by architecture rules
- evaluator/prompt/rubric versions follow Data & AI Governance rather than artifact-schema rules alone
- API versions must define client error behavior for unsupported versions

---

# 3. Requirement traceability

Traceability must remain lightweight but explicit enough to prevent drift between Product intent, Architecture, Gate decisions, packet Acceptance Criteria, and tests.

Each non-trivial packet should include a compact table:

| Requirement / capability | Upstream authority | Packet AC | Test / verification |
|---|---|---|---|
| `<id or short name>` | Product / Architecture / Gate / Scenario / Risk | AC-N | test/fixture/smoke |

Additional rules:

- authority-expanding AI capability must reference the specific approved authority envelope/gate decision
- semantic mutation capability must reference allowed mutation scope and Gate C evidence
- security/data-sensitive behavior must reference the applicable governance review
- Scenario/Acceptance behavior must reference the scenario requirement and clearly distinguish static vs runtime verification
- migration behavior must have legacy fixtures
- a requirement intentionally deferred should be marked Out of Scope rather than left untraceable

Do not introduce heavyweight enterprise requirements tooling until repository scale requires it.

---

# 4. Operational quality maturity

Do not invent permanent SLOs before observing a stable baseline. Do not leave operational quality permanently qualitative either.

Use this maturity sequence:

```text
UNMEASURED
→ BASELINED
→ PROVISIONAL_TARGET
→ CALIBRATED_TARGET
→ ENFORCED / ALERTED where justified
```

## BASELINED

Collect privacy-safe operational evidence such as:

- request latency distribution
- timeout/failure categories
- structured-output invalid rate
- provider rate-limit behavior
- bounded usage/cost trend where available
- payload/input-size distribution where relevant

## PROVISIONAL_TARGET

A selected packet/gate may set temporary thresholds when enough evidence exists to make them useful. Provisional targets must name:

- metric
- dataset/time window/sample scope
- target
- rationale
- known limitations
- review trigger

## CALIBRATED_TARGET

Promote a provisional target only after representative production/benchmark evidence supports it.

Material provider/model/architecture changes may require re-baselining.

A calibrated target may become a release gate or alert when the signal is stable and actionable.

---

# 5. Repository enforcement contract

Required engineering verification remains:

```text
npm ci
→ npm run docs:check
→ npm test
→ npm run typecheck
→ npm run build
```

`docs:check` is a documentation-integrity check, not a substitute for tests/typecheck/build.

Normal `main` merge policy should enforce the CI status check through GitHub Rulesets/Branch Protection where supported.

Required repository setting direction:

- protect `main`
- require pull request or equivalent reviewed merge path for normal changes
- require `test-typecheck-build` CI status before merge
- prevent normal force-push / history rewrite to `main`
- keep administrator/emergency recovery possible only through explicit exceptional procedure

If live repository settings do not enforce this, classify it as `REPOSITORY_BLOCKER` in `roadmap/PROGRAM_BOARD.md` / `roadmap/RISK_REGISTER.md`. Documentation stating that protection is desired is not proof that it is enabled.

Because repository settings are external state, every release-operations review must verify actual live enforcement rather than infer it from this file.

---

# 6. Documentation consistency contract

The development documentation is now large enough that broken references or missing authoritative files can create execution errors.

`npm run docs:check` must verify at least:

- required authoritative documents exist
- key indexed relative Markdown links in `docs/README.md` resolve
- the active packet directory exists and contains at least one packet while a current packet is declared
- core lifecycle/status vocabulary remains available in Development Rules
- critical CI workflow file exists

The checker should remain deterministic, local, fast, dependency-light, and privacy-safe.

Do not make docs CI attempt to infer subjective roadmap correctness from prose.

If a durable doc is renamed/moved, update references in the same change.

---

# 7. Risk handling

Program-level risks live in `docs/roadmap/RISK_REGISTER.md`.

A risk should be promoted to an explicit blocker when its trigger condition becomes true and current work cannot safely proceed without resolution.

Packet-level risks remain inside the active packet when they are specific to that implementation.

Do not duplicate the entire program risk register in every packet.

---

# 8. Change governance for these rules

Material changes to any of the following require durable review and usually an ADR:

- Definition of Ready semantics
- contract/version compatibility policy
- AI authority or mutation authority boundaries
- required CI/release verification
- repository merge protection policy
- Scenario/Acceptance semantic ownership
- data/security ownership boundaries

Changes must not silently weaken existing release/safety requirements.
