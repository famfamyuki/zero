# AgentGraph Studio — Development Governance

Status: **Authoritative engineering, execution, QA, and release governance**

Scope: Product/architecture implementation rules, Definition of Ready, packet discipline, AI and semantic-change boundaries, migration/version lifecycle, traceability, security/data review triggers, operational-quality maturity, CI/repository enforcement, Independent QA, release verification, risk handling, and documentation maintenance.

This document is the single authoritative development-governance source. It incorporates the former unique requirements of `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`. A stricter active packet under `docs/specs/` wins for its scoped implementation details, but no packet may silently weaken durable Product/Architecture/Security/Data authority boundaries without the required upstream decision.

For the global source-of-truth hierarchy and task-based reading paths, use `docs/README.md`.

---

# 1. Product and regression invariants

All development must preserve the Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Engineering decisions must preserve these durable principles:

- deterministic analysis + evidence-grounded AI reasoning
- `Known / Inferred / Unknown`
- deterministic / heuristic / external-dependent distinction
- no silent semantic AI mutation
- user-controlled semantic change
- user-owned source/runtime direction
- portability and visible lossiness
- evaluator authority must not grow faster than measured evaluator trust
- AI authority is capability-scoped, not one blanket permission
- semantic mutation scope must not outrun capability/security/human-control evidence
- configured Scenario/Acceptance expectations are not runtime observations
- data/provider scope must not silently broaden
- platform security/reliability is a current cross-cutting requirement, not a future workflow-policy feature
- existing analytics behavior is a protected regression surface

Do not optimize engineering priority around marketing/growth work unless it is explicitly selected as a Product dependency.

Unless an active packet explicitly changes behavior, preserve existing functionality including:

- Visual Workflow Builder
- templates
- JSON import/export
- deterministic CrewAI Python export
- Readiness
- Execution Preview
- Resource Analysis
- Unified Preflight
- existing first-value activation behavior
- existing analytics/event behavior
- language/accessibility behavior

A new AI feature must not become a dependency of deterministic import/export, graph serialization, Readiness, Execution Preview, Resource Analysis, or transpilation unless a future packet explicitly changes that architecture.

---

# 2. Definition of Ready and packet scope

A capability must not advance from **Selected** to **Specified / Implementation Started** merely because it is desirable.

Before a packet is implementation-ready, confirm all applicable items.

## 2.1 Product / dependency readiness

- user problem and North Star value are explicit
- upstream Stage/Gate requirements are satisfied, or the packet is explicitly foundation work
- smallest sufficient scope is identified
- dependency order is understood
- later-stage features are explicitly Out of Scope

## 2.2 Domain / architecture readiness

- authoritative domain owner is known
- required identity/version semantics are defined
- no speculative persisted major version is introduced
- migration/backward compatibility direction is defined
- deterministic/AI ownership boundaries remain clear

## 2.3 Data / security readiness

- persistence/provider/data-flow changes are explicit
- Security/Data governance triggers are reviewed
- secrets/sensitive-data boundaries are defined
- abuse/size/timeout/degraded-state behavior is defined for relevant public/provider-backed endpoints

## 2.4 UX / quality readiness

- primary, loading, error, stale, and degraded states are defined
- accessibility/responsive implications are defined
- analytics regression/privacy boundaries are defined
- Acceptance Criteria are testable
- representative fixtures and regression tests are identified

## 2.5 Release readiness

- `npm test`, `npm run typecheck`, and `npm run build` are expected to remain runnable
- Production verification is practically possible
- rollback/degraded-state direction is understood for material risk
- repository/release dependencies are not silently assumed

If an applicable answer is unknown, resolve the contract or deliberately narrow scope before Implementation Started.

Every non-trivial Sprint/packet must explicitly define, as applicable:

- Goal
- Scope
- Out of Scope
- Domain/API changes
- UX changes
- Migration/backward compatibility
- Security/privacy implications
- persistence/provider-flow implications
- reliability/degraded-state behavior
- approved AI authority envelope
- approved semantic mutation scope
- Scenario/Acceptance implications
- Acceptance Criteria
- Test Matrix
- compact requirement traceability
- Production verification / rollback direction

Long-term Product/Architecture/Roadmap documents are not permission to pull future work into the active packet.

If implementation discovers a genuine Product contradiction, escalate it rather than silently redefining the contract. Mechanical implementation details may be resolved by engineering when they do not alter Product behavior or contract semantics.

---

# 3. AI implementation and authority rules

## 3.1 Server-side provider access

Provider calls and credentials stay server-side. Never expose provider secrets/API keys/tokens in client code, analytics, logs, documentation, commits, or user responses.

## 3.2 Structured output and evidence validation

Prefer versioned structured output with runtime validation over free-form text parsing.

When AI findings cite Evidence/targets, validate references before presenting the result as valid. Invalid references must fail closed according to the active packet; do not silently repair unsupported claims into valid-looking output.

## 3.3 Trust boundary

Workflow-authored/imported text is untrusted analyzed data. Agent role/goal/backstory, task descriptions, expected output, tool descriptions, Scenario/Acceptance text, source comments/strings, and imported text must not be interpreted as evaluator control instructions.

## 3.4 Failure isolation

Provider timeout, invalid schema, unsupported response, rate-limit, or unavailable configuration must not break unrelated deterministic product behavior.

## 3.5 Knowledge discipline

AI must not convert runtime-only or external-dependent Unknowns into Known facts.

A configured Intent/Constraint/Scenario may be Known as configured source data while the real-world/runtime claim it describes remains Unknown until supported by appropriate evidence.

## 3.6 Evaluator change governance

A model/provider/prompt/rubric/schema/post-validation change that can materially change evaluator behavior follows `docs/DATA_AND_AI_GOVERNANCE.md`:

```text
change
→ contract tests
→ benchmark comparison
→ hard-violation check
→ quality/stability review
→ latency/failure/cost review
→ deploy
→ monitor / rollback
```

Do not silently swap a Production evaluator and assume behavioral equivalence.

## 3.7 AI authority envelope

AI authority is governed by `docs/roadmap/EXECUTION_GATES.md`.

Approval for architecture findings does not automatically approve:

- architecture proposals
- tool/model/resource recommendations
- security/control recommendations
- semantic patch generation
- side-effect-sensitive changes

Every authority-expanding packet must state the approved authority envelope and trace it to the relevant gate/evidence.

---

# 4. Semantic change and domain architecture rules

AI must not directly or silently apply meaning-changing workflow changes.

General semantic-change flow:

```text
Proposal
→ Semantic Patch
→ Validation
→ Before / After Preview
→ User Apply
```

If a packet implements evaluation/proposals only, do not add mutation as a convenience.

When safe apply exists:

- stale proposal detection must prevent apply against a changed base revision
- Gate C must be satisfied before Stage 3 mutation authority
- passing the generic patch pipeline does not authorize every semantic operation
- the packet must state the allowed mutation scope
- side-effect-sensitive changes involving external mutation, credentials, sensitive data, approval/policy, or insufficiently known tool capabilities require stronger capability/control prerequisites than architecture-only changes

Domain rules:

- keep reusable/testable domain logic out of React components
- do not leak provider-specific AI response types into core domain contracts
- UI state is not authoritative workflow semantics
- preserve explicit versioning for durable contracts
- prefer deterministic canonicalization/fingerprints for stale detection where appropriate
- keep Visual Group, Semantic Module, and Runtime Orchestration separate
- keep Intent, Constraints, Scenario/Acceptance, and observed Runtime Evidence semantically distinct
- do not add a second target framework through scattered framework-name conditionals; establish capability/lossiness boundaries first
- do not silently degrade unsupported semantics during export/build/import
- do not create Graph/Workflow V2 merely to mirror a long-term architecture diagram; follow `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- imported external projects are untrusted data and must not be executed merely to statically map them unless a separately specified sandboxed execution capability exists
- Project identity, workflow identity, semantic revision, layout state, and cloud/team persistence are separate concepts

---

# 5. Migration, compatibility, and contract lifecycle

Migration must preserve existing user artifacts unless an explicit breaking-version decision is approved.

For schema/domain changes define:

- old accepted format
- new accepted format
- normalization/migration path
- producer/writer behavior
- reader behavior
- export behavior
- round-trip expectations
- invalid/unsupported-data behavior
- representative legacy fixtures/tests
- rollback implications

Do not silently reinterpret old workflow meaning.

A new persisted workflow major version requires an ADR and must follow `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`.

Versioned durable contracts use these lifecycle states where applicable:

- `ACTIVE` — produced and accepted by current implementations
- `ACCEPTED_LEGACY` — no longer produced by default but still accepted/read safely
- `DEPRECATED` — temporarily supported with documented migration and reason
- `READ_ONLY_LEGACY` — can be opened/inspected/exported but not safely edited/rewritten without migration
- `MIGRATION_REQUIRED` — explicit conversion is required before current operations
- `UNSUPPORTED` — rejected clearly; never silently reinterpreted

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

- a new writer does not justify deleting the old reader
- do not silently reinterpret old semantics under a new version number
- persisted major-version changes require explicit migration justification/ADR where architecture rules require it
- evaluator/prompt/rubric versions follow Data & AI Governance, not artifact-schema lifecycle alone
- API versions must define client behavior for unsupported versions

---

# 6. Requirement traceability

Traceability must stay lightweight but explicit enough to prevent drift between Product intent, Architecture, Gate decisions, packet Acceptance Criteria, and verification.

Each non-trivial packet should include:

| Requirement / capability | Upstream authority | Packet AC | Test / verification |
|---|---|---|---|
| `<id or short name>` | Product / Architecture / Gate / Scenario / Risk | AC-N | test/fixture/smoke |

Required traceability includes:

- authority-expanding AI → specific approved authority envelope/gate decision
- semantic mutation → allowed mutation scope + Gate C evidence
- security/data-sensitive behavior → applicable governance review
- Scenario/Acceptance → explicit requirement and static-vs-runtime verification state
- migration → legacy fixtures
- intentionally deferred requirement → explicit Out of Scope

Do not introduce heavyweight enterprise requirements tooling until repository scale justifies it.

---

# 7. Security, data, analytics, and accessibility

Explicit review against `docs/SECURITY_RELIABILITY_BASELINE.md` and/or `docs/DATA_AND_AI_GOVERNANCE.md` is required when adding/changing, as applicable:

- authentication/authorization
- account/cloud persistence
- external project/source import
- arbitrary file/archive parsing
- provider/model credentials or provider flow
- mutation APIs
- side-effect-sensitive Semantic Patch operations
- capability/permission/human-approval semantics
- Scenario/Acceptance persistence/provider transmission
- collaboration/RBAC
- payment/billing authority
- runtime trace ingestion
- sensitive-data handling
- third-party data transmission
- persistent evaluation/revision history

Workflow-level policy evaluation is not a substitute for AgentGraph platform security.

Analytics rules:

- do not casually remove/rename existing events
- do not change event meaning without specification
- do not send workflow semantic content, imported source, Intent/Constraint/Scenario text, prompts, secrets, provider responses, credentials, runtime trace bodies, or full Evidence payloads to analytics
- additive events use documented minimal metadata
- AI failures use bounded categorical metadata rather than sensitive raw content

Accessibility/responsive quality must preserve or improve:

- keyboard accessibility
- focus management
- meaningful accessible names
- visible focus state
- no color-only status communication
- responsive behavior
- error/loading/status announcements where appropriate

A packet may define stronger requirements.

---

# 8. Operational quality maturity

Do not invent permanent SLOs before observing a stable baseline, and do not leave mature operational quality permanently qualitative.

Use:

```text
UNMEASURED
→ BASELINED
→ PROVISIONAL_TARGET
→ CALIBRATED_TARGET
→ ENFORCED / ALERTED where justified
```

## BASELINED

Collect privacy-safe evidence such as:

- request latency distribution
- timeout/failure categories
- structured-output invalid rate
- provider rate-limit behavior
- bounded usage/cost trend where available
- payload/input-size distribution where relevant

## PROVISIONAL_TARGET

A provisional target must name:

- metric
- dataset/time window/sample scope
- target
- rationale
- known limitations
- review trigger

## CALIBRATED_TARGET

Promote a target only after representative Production/benchmark evidence supports it. Material provider/model/architecture changes may require re-baselining. A calibrated target may become a release gate or alert when stable and actionable.

---

# 9. Implementation verification and repository enforcement

Before **Implementation Complete**:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

All must pass unless an external tooling outage is explicitly documented and lifecycle status is not advanced to complete. AI work must also run packet-defined evaluation/benchmark checks.

Do not declare completion based only on typecheck or a successful deployment.

Normal repository CI on pull requests to `main` and `main` pushes should run:

```text
npm ci
→ npm run docs:check
→ npm test
→ npm run typecheck
→ npm run build
```

`docs:check` is a deterministic documentation-integrity check, not a substitute for tests/typecheck/build.

Normal merge policy should, where supported:

- protect `main`
- require a pull request or equivalent reviewed merge path
- require the `test-typecheck-build` status
- prevent normal force-push/history rewrite
- reserve administrator/emergency recovery for an explicit exceptional procedure

Rules:

- do not intentionally bypass checks for ordinary changes
- live Branch Protection/Ruleset state must be verified; documentation is not proof
- if required protection is absent despite platform support, record a `REPOSITORY_BLOCKER` / active program risk
- if platform/account limits prevent enforcement, document the limitation and keep manual verification mandatory
- a green Vercel Preview does not replace required repository checks
- CI configuration changes are release-governance changes
- `main` should remain deployable

---

# 10. Independent QA

Implementation self-test is not Independent QA.

Independent QA should verify, as applicable:

- Acceptance Criteria
- focused feature tests
- regression suite
- migration/backward compatibility
- accessibility/responsive behavior
- AI grounding/Unknown behavior
- provider failure/degraded state
- approved authority envelope is not exceeded
- approved mutation scope is not exceeded
- no silent mutation
- Scenario/Acceptance static-vs-runtime truth boundary
- analytics regression constraints
- security/privacy boundaries
- Production behavior when appropriate to the verification phase

Use result states:

- PASS
- PASS WITH NOTES
- FAIL / BLOCKED

Classify issues as:

- Blocker
- Non-blocker
- Known Note

For AI evaluation, test behavioral contracts rather than exact prose only, including:

- must-detect cases
- must-not-claim cases
- evidence reference validity
- invalid evidence rejection
- target validity
- Unknown preservation
- good-workflow false-positive control
- provider timeout/unavailable behavior
- malformed structured output
- relevant ordering/rename/layout invariance
- no mutation side effect
- authority-envelope boundary cases

One good manual response is not evidence that an evaluator is Production-ready. Promotion to stronger authority remains governed by `docs/roadmap/EXECUTION_GATES.md`; a packet release benchmark is not automatically a permanent authority threshold.

---

# 11. Git, release, and Production verification

Git rules:

- start from current `main` or a clearly documented current feature branch
- keep commits scoped and understandable
- never commit secrets/local credential files
- do not rewrite shared branch history without an explicit reason
- avoid unrelated cleanup in a focused Product Packet unless required for safe completion
- before merge/release, re-check current `main` and resolve conflicts against current repository reality, not the original packet baseline
- durable Product/Architecture decisions that materially change boundaries, sequencing, migration, security, or data ownership belong in `docs/decisions/`

Before **Production Verified**, confirm:

- QA-approved revision is the revision being released
- deployment state is `READY`
- target is `production`
- correct Production alias/domain is active
- main user flow responds normally
- changed behavior is smoke-tested where practical
- relevant runtime errors are checked
- latest GitHub `main` SHA equals Vercel Production `githubCommitSha`

Required invariant:

```text
GitHub main SHA = Vercel Production githubCommitSha
```

A Preview deployment is not Production Verified. If code/behavior changes after QA Complete, QA approval is stale and Independent QA must be repeated before release.

---

# 12. Status model and completion reporting

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

Meaning:

- **Selected** — Product priority chosen
- **Specified** — implementation-ready contract exists and applicable Definition of Ready is satisfied
- **Implementation Started** — code work actually began
- **Implementation Complete** — required implementation checks passed
- **QA Complete** — Independent QA completed
- **Production Verified** — Production deployment/behavior verified
- **Sprint Complete** — closure accepted with blockers resolved

Roadmap stage/gate promotion and Commercial Validation M0 are separate Product Architecture decisions from Sprint lifecycle status.

After implementation/release work report:

1. changes
2. docs check
3. tests
4. TypeScript typecheck
5. production build
6. commit SHA/message
7. Production deployment status
8. GitHub main SHA vs Vercel Production SHA
9. remaining issues / known notes

If a required check was not run, state that explicitly and do not imply it passed.

---

# 13. Risk and documentation governance

Program-level risks live in `docs/roadmap/RISK_REGISTER.md`. Packet-specific risks stay in the active packet.

Promote a risk to a blocker when its trigger is observed and selected work cannot safely satisfy Acceptance Criteria without resolution or scope reduction. Do not duplicate the whole Risk Register into packets.

Documentation ownership:

- Product definition/principles → `docs/PRODUCT_MASTER.md`
- durable architecture → `docs/ARCHITECTURE.md` and focused `docs/architecture/` contracts
- engineering/execution/QA/release governance → this document
- stage sequence → `docs/roadmap/MASTER_ROADMAP.md`
- stage/authority promotion → `docs/roadmap/EXECUTION_GATES.md`
- near-term coordination → `docs/roadmap/PROGRAM_BOARD.md`
- durable risks → `docs/roadmap/RISK_REGISTER.md`
- security/data governance → their dedicated baseline documents
- durable decision rationale → `docs/decisions/`
- current implementation contract → `docs/specs/`
- coordination snapshot → `docs/CURRENT_STATE.md`
- contributor routing → `AGENTS.md` / `docs/CHAT_ROLE_REGISTRY.md`

Do not create a new authoritative planning document merely to restate an existing owner's responsibility. Create a focused contract only when the concern has a genuinely distinct semantic owner.

`npm run docs:check` must remain deterministic, local, fast, dependency-light, and privacy-safe. It should verify at least:

- required authoritative documents exist
- indexed relative links in `docs/README.md` resolve
- the active packet directory is valid while current work declares a packet
- lifecycle vocabulary and required verification commands remain present in this document
- critical CI workflow files exist

Do not make docs CI infer subjective roadmap correctness from prose. Rename/move references in the same change.

Material changes to the following require durable review and usually an ADR:

- Definition of Ready semantics
- contract/version compatibility policy
- AI authority or mutation authority boundaries
- required CI/release verification
- repository merge-protection policy
- Scenario/Acceptance semantic ownership
- data/security ownership boundaries

Changes must not silently weaken existing release or safety requirements.
