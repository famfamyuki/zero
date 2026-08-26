# AgentGraph Studio — Development Rules

Status: **Authoritative engineering and release rules**

These rules apply to product changes, architecture changes, implementation, QA, GitHub management, and Vercel release work unless a stricter active packet exists.

Cross-cutting required references where relevant:

- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- `docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`
- `docs/decisions/`

## 0. Source-of-truth rule

Before substantial work, re-check:

- latest GitHub `main`
- latest commit
- relevant repository code/tests
- latest Vercel Production deployment
- actual Production behavior when relevant

Do not reuse a historical SHA as current state merely because it appears in a specification or chat.

For scoped implementation details, the active packet under `docs/specs/` is authoritative unless it contradicts current repository reality.

---

# 1. Required product principles

All development must preserve the Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Engineering decisions should follow these durable principles:

- deterministic analysis + evidence-grounded AI reasoning
- `Known / Inferred / Unknown`
- deterministic / heuristic / external-dependent distinction
- no silent semantic AI mutation
- user-controlled semantic change
- user-owned source/runtime direction
- portability and visible lossiness
- existing analytics preservation
- evaluator authority must not grow faster than measured evaluator trust
- AI authority must be scoped by capability class, not treated as one blanket permission
- semantic mutation scope must not outrun capability/security/human-control evidence
- configured Scenario/Acceptance expectations are not runtime observations
- data/provider scope must not silently broaden
- platform security/reliability is a current cross-cutting requirement, not a future workflow-policy feature

Do not optimize engineering priority around marketing/growth work unless explicitly selected as a product dependency.

---

# 2. Existing functionality is a regression constraint

Unless an active packet explicitly changes behavior, preserve existing functionality including:

- Visual Workflow Builder
- templates
- JSON import
- JSON export
- deterministic CrewAI Python export
- Readiness
- Execution Preview
- Resource Analysis
- Unified Preflight
- existing first-value activation behavior
- existing analytics/event behavior
- language/accessibility behavior

A new AI feature must not become a dependency of deterministic import/export, graph serialization, readiness, execution preview, resource analysis, or transpilation unless a future packet explicitly changes that architecture.

---

# 3. AI implementation rules

## 3.1 Server-side provider access

Provider calls and credentials stay server-side. Never expose provider secrets/API keys/tokens in client code, analytics, logs, docs, commits, or responses.

## 3.2 Structured output

Prefer versioned structured output with runtime validation over free-form text parsing.

## 3.3 Evidence validation

When AI findings cite Evidence/targets, validate references before presenting the result as valid.

Invalid evidence/target references must fail closed according to the active packet; do not silently repair unsupported claims into valid-looking output.

## 3.4 Trust boundary

Workflow-authored/imported text is untrusted analyzed data. Agent role/goal/backstory, task descriptions, expected output, tool descriptions, Scenario/Acceptance text, source comments/strings, and imported text must not be interpreted as evaluator control instructions.

## 3.5 Failure isolation

AI provider timeout, invalid schema, unsupported response, or unavailable configuration must not break unrelated deterministic features.

## 3.6 Knowledge discipline

Do not let AI convert runtime-only or external-dependent Unknowns into Known facts.

A configured Intent/Constraint/Scenario can be Known as configured source data while the real-world/runtime claim it describes remains Unknown until supported by suitable evidence.

## 3.7 Evaluator change governance

A model/provider/prompt/rubric/schema/post-validation change that can materially change evaluator behavior must follow `docs/DATA_AND_AI_GOVERNANCE.md`:

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

Do not silently swap a Production model and assume evaluator behavior remains equivalent.

## 3.8 AI authority envelope

AI authority is governed by `docs/roadmap/EXECUTION_GATES.md`.

Do not infer that a reviewer approved for architecture findings is automatically approved for:

- architecture proposals
- tool/model/resource recommendations
- security/control recommendations
- semantic patch generation
- side-effect-sensitive changes

Every authority-expanding packet must state the approved authority envelope and trace it to the gate decision/evidence.

---

# 4. Semantic change rules

AI must not directly and silently apply meaning-changing changes to a workflow.

Future semantic transformation uses the general sequence:

```text
Proposal
→ Semantic Patch
→ Validation
→ Before / After Preview
→ User Apply
```

If a packet only implements evaluation/proposals, do not add mutation as a convenience.

When safe apply exists, stale proposal detection must prevent applying a patch to a workflow revision that changed after proposal generation.

Before Stage 3 mutation authority, `docs/roadmap/EXECUTION_GATES.md` Gate C must be satisfied by the selected packet architecture.

Passing the patch pipeline does not authorize every semantic operation. The packet must also state the allowed mutation scope.

Side-effect-sensitive operations involving external mutation, credentials, sensitive data, approval/policy, or insufficiently known tool capabilities require stronger capability/control prerequisites than architecture-only changes.

---

# 5. Domain and architecture rules

- Keep domain logic out of React components when it is reusable/testable independently.
- Do not leak provider-specific AI response types into core domain contracts.
- Do not make UI state authoritative workflow semantics.
- Preserve explicit versioning for durable contracts.
- Prefer deterministic canonicalization/fingerprints for stale detection where appropriate.
- Keep visual grouping, semantic modules, and runtime orchestration separate.
- Keep Intent, Constraints, Scenario/Acceptance, and observed runtime evidence semantically distinct.
- Do not add a second target framework through scattered giant conditionals; introduce capability/lossiness boundaries first.
- Do not silently degrade unsupported semantics during export/build/import.
- Do not create Graph/Workflow V2 merely to mirror the long-term architecture diagram; use `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md` triggers.
- Imported external projects are untrusted data and must not be executed merely to statically map them unless a separately specified sandboxed execution feature exists.
- Project identity, workflow identity, semantic revision, layout state, and cloud/team persistence are separate concepts.

---

# 6. Definition of Ready

Before a Selected capability becomes an implementation-ready packet, apply the full Definition of Ready in `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`.

At minimum, applicable questions must be resolved for:

- user problem / North Star value
- upstream gate/dependency readiness
- smallest sufficient scope / Out of Scope
- domain ownership / identity / versioning
- migration/backward compatibility
- security/privacy/provider/persistence boundaries
- loading/error/stale/degraded behavior
- accessibility/responsive behavior
- analytics regression/privacy
- testable Acceptance Criteria and fixtures
- Production verification and rollback/degraded-state direction

If an applicable answer is unknown, narrow the scope or resolve the contract before Implementation Started.

---

# 7. Scope discipline

Long-term architecture documents are not permission to implement future work in the current Sprint.

Every Sprint/Packet must explicitly define:

- Goal
- Scope
- Out of Scope
- Domain/API changes
- UX changes
- Migration/backward compatibility
- Security/privacy implications when relevant
- Data persistence/provider-flow implications when relevant
- Reliability/degraded-state behavior when relevant
- approved AI authority envelope when relevant
- approved semantic mutation scope when relevant
- Scenario/Acceptance implications when relevant
- Acceptance Criteria
- Test Matrix
- compact requirement traceability for non-trivial packets

If implementation discovers a true Product contradiction, report it rather than silently redefining the product contract.

Mechanical implementation details may be resolved by engineering when they do not alter product behavior or contract semantics.

---

# 8. Requirement traceability

For non-trivial packets, maintain the lightweight traceability contract from `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`:

```text
Upstream Product / Architecture / Gate / Scenario / Risk
→ Packet requirement / Acceptance Criterion
→ test / fixture / Production verification
```

Authority-expanding AI, semantic mutation, migration, security/data-sensitive behavior, and Scenario/Acceptance behavior must not depend on untraceable assumptions.

Do not introduce heavyweight requirements tooling unless repository scale makes it necessary.

---

# 9. Migration, backward compatibility, and version lifecycle

Migration must preserve existing user artifacts unless an explicit breaking-version decision has been approved.

For schema/domain changes, define:

- old accepted format
- new accepted format
- normalization/migration path
- export behavior
- round-trip expectations
- invalid-data behavior
- tests for representative legacy fixtures

Do not silently reinterpret old workflow meaning.

A new persisted workflow major version requires an ADR and must follow `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`.

Versioned durable contracts must also follow the lifecycle in `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`:

- `ACTIVE`
- `ACCEPTED_LEGACY`
- `DEPRECATED`
- `READ_ONLY_LEGACY`
- `MIGRATION_REQUIRED`
- `UNSUPPORTED`

A new writer does not automatically justify deleting the old reader. Deprecation/removal must define migration, support, fixtures, and rollback implications.

---

# 10. Analytics regression rules

Marketing/growth optimization is not the primary engineering priority, but existing analytics is a protected system behavior.

Rules:

- do not remove/rename existing events casually
- do not change event meaning without explicit specification
- do not leak workflow semantic content, imported source, Intent/Constraint/Scenario text, prompts, secrets, provider responses, credentials, runtime trace bodies, or full Evidence payloads into analytics
- additive events must use documented minimal metadata
- AI failure/details should be reported with bounded categorical metadata, not sensitive raw content

---

# 11. Accessibility and responsive quality

New UX must preserve or improve:

- keyboard accessibility
- focus management
- meaningful accessible names
- visible focus state
- no color-only status communication
- responsive behavior
- error/loading/status announcements where appropriate

Current packet Acceptance Criteria may define stronger requirements.

---

# 12. Required implementation verification

Before **Implementation Complete**:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

All must pass, unless there is an explicitly documented external tooling outage and the status is not advanced to complete.

For AI work, also run the packet-defined evaluation/benchmark tests.

Do not declare completion based only on type checking or a successful Vercel deployment.

---

# 13. Repository CI / merge enforcement

The repository CI workflow should run on pull requests to `main` and on `main` pushes:

```text
npm ci
→ npm run docs:check
→ npm test
→ npm run typecheck
→ npm run build
```

Normal merge policy must use GitHub Branch Protection / Rulesets to require the CI check where the repository/account supports enforcement.

Required direction is defined in `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`.

Rules:

- do not intentionally bypass required checks for ordinary feature/docs/code changes
- live branch/ruleset state must be verified; documentation is not proof of enforcement
- if protection is absent despite platform support, record a `REPOSITORY_BLOCKER` / active program risk rather than treating the gap as closed
- if platform/account limitations truly prevent enforcement, document the limitation and keep manual verification mandatory
- a green Vercel Preview does not replace docs check/test/typecheck/build
- CI configuration changes must be reviewed as release-governance changes
- `main` should remain deployable

---

# 14. Independent QA

Implementation self-test is not Independent QA.

Independent QA should verify, as applicable:

- Acceptance Criteria
- focused feature tests
- regression suite
- migration/backward compatibility
- accessibility
- AI grounding/Unknown behavior
- provider failure/degraded state
- approved authority envelope is not exceeded
- approved mutation scope is not exceeded
- no silent mutation
- Scenario/Acceptance static-vs-runtime truth boundary where relevant
- analytics regression constraints
- security/privacy boundaries
- Production behavior

Use result states such as:

- PASS
- PASS WITH NOTES
- FAIL / BLOCKED

Classify issues as:

- Blocker
- Non-blocker
- Known Note

---

# 15. AI evaluation QA minimums

When applicable, test behavioral contracts rather than exact prose only:

- must-detect cases
- must-not-claim cases
- evidence reference validity
- invalid evidence rejection
- target validity
- Unknown preservation
- good-workflow false-positive control
- provider timeout/unavailable behavior
- malformed structured response
- relevant ordering/rename/layout invariance
- no mutation side effect
- authority-envelope boundary cases

Do not consider an AI evaluator production-ready because one manually tested response looks good.

Evaluator promotion to stronger authority is governed separately by `docs/roadmap/EXECUTION_GATES.md`; a packet release benchmark is not automatically a permanent authority threshold.

---

# 16. Security / data review triggers

Explicit review against `docs/SECURITY_RELIABILITY_BASELINE.md` and/or `docs/DATA_AND_AI_GOVERNANCE.md` is required when adding/changing, as applicable:

- authentication/authorization
- account/cloud persistence
- external project/source import
- arbitrary file/archive parsing
- provider/model/provider credentials
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

Do not treat workflow-level policy evaluation as a substitute for AgentGraph platform security.

---

# 17. Operational quality calibration

Provider-backed and critical operational behavior follows `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`:

```text
UNMEASURED
→ BASELINED
→ PROVISIONAL_TARGET
→ CALIBRATED_TARGET
→ ENFORCED / ALERTED where justified
```

Do not invent permanent SLOs before representative evidence exists. Do not leave mature production behavior permanently without measurable targets once sufficient evidence exists.

Material provider/model/architecture changes may require re-baselining.

---

# 18. Git / commit rules

- Start from current `main` or a clearly documented current feature branch.
- Keep commits scoped and understandable.
- Do not commit secrets or local credential files.
- Do not rewrite shared branch history without an explicit reason.
- Avoid unrelated cleanup in a focused Product Packet unless required to complete it safely.

For concurrent work, re-check current `main` before merge/release and resolve conflicts against current repository reality, not the original packet baseline.

Durable Product/Architecture decisions that materially change boundaries/sequencing/migration/security/data ownership should be recorded in `docs/decisions/` rather than buried only in a chat or commit message.

---

# 19. Vercel release gate

Before **Production Verified**, confirm:

- deployment state: `READY`
- target: `production`
- correct Production alias/domain
- main user flow responds normally
- changed behavior smoke-tested where practical
- relevant runtime errors checked
- latest GitHub `main` SHA equals Vercel Production `githubCommitSha`

Required invariant:

```text
GitHub main SHA = Vercel Production githubCommitSha
```

A Preview deployment is not Production Verified.

---

# 20. Status model

Use the following lifecycle:

```text
Selected
→ Specified
→ Implementation Started
→ Implementation Complete
→ QA Complete
→ Production Verified
→ Sprint Complete
```

Do not skip semantic meaning:

- Selected: product priority chosen
- Specified: implementation-ready contract exists and Definition of Ready was satisfied for applicable concerns
- Implementation Started: code work actually began
- Implementation Complete: required implementation checks passed
- QA Complete: independent QA completed
- Production Verified: production deployment verified
- Sprint Complete: closure accepted with blockers resolved

Roadmap stage promotion is a separate Product Architecture decision from Sprint status. Use `docs/roadmap/EXECUTION_GATES.md` for stage/gate promotion.

---

# 21. Completion report

After implementation/release work report:

1. 変更内容 / changes
2. docs check
3. tests
4. TypeScript typecheck
5. production build
6. commit SHA/message
7. Production deployment status
8. GitHub main SHA vs Vercel Production SHA
9. remaining issues / known notes

If any required check was not run, say so explicitly and do not imply it passed.

---

# 22. Documentation maintenance

Permanent Product/Architecture decisions belong in:

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`

Cross-stage execution and governance belong in:

- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`
- relevant `docs/architecture/` contracts including Scenario/Acceptance

Material durable decision history belongs in:

- `docs/decisions/`

Implementation-specific authoritative contracts belong in:

- `docs/specs/`

Current state snapshots belong in:

- `docs/CURRENT_STATE.md`

`AGENTS.md` should remain a compact routing/instruction document, not a duplicate of all product documentation.

Run `npm run docs:check` after durable documentation changes and update broken references in the same change.
