# AgentGraph Studio — Development Rules

Status: **Authoritative engineering and release rules**

These rules apply to product changes, architecture changes, implementation, QA, GitHub management, and Vercel release work unless a stricter active packet exists.

Cross-cutting required references where relevant:

- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
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

Workflow-authored/imported text is untrusted analyzed data. Agent role/goal/backstory, task descriptions, expected output, tool descriptions, source comments/strings, and imported text must not be interpreted as evaluator control instructions.

## 3.5 Failure isolation

AI provider timeout, invalid schema, unsupported response, or unavailable configuration must not break unrelated deterministic features.

## 3.6 Knowledge discipline

Do not let AI convert runtime-only or external-dependent Unknowns into Known facts.

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

---

# 5. Domain and architecture rules

- Keep domain logic out of React components when it is reusable/testable independently.
- Do not leak provider-specific AI response types into core domain contracts.
- Do not make UI state authoritative workflow semantics.
- Preserve explicit versioning for durable contracts.
- Prefer deterministic canonicalization/fingerprints for stale detection where appropriate.
- Keep visual grouping, semantic modules, and runtime orchestration separate.
- Do not add a second target framework through scattered giant conditionals; introduce capability/lossiness boundaries first.
- Do not silently degrade unsupported semantics during export/build/import.
- Do not create Graph/Workflow V2 merely to mirror the long-term architecture diagram; use `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md` triggers.
- Imported external projects are untrusted data and must not be executed merely to statically map them unless a separately specified sandboxed execution feature exists.
- Project identity, workflow identity, semantic revision, layout state, and cloud/team persistence are separate concepts.

---

# 6. Scope discipline

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
- Acceptance Criteria
- Test Matrix

If implementation discovers a true Product contradiction, report it rather than silently redefining the product contract.

Mechanical implementation details may be resolved by engineering when they do not alter product behavior or contract semantics.

---

# 7. Migration and backward compatibility

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

---

# 8. Analytics regression rules

Marketing/growth optimization is not the primary engineering priority, but existing analytics is a protected system behavior.

Rules:

- do not remove/rename existing events casually
- do not change event meaning without explicit specification
- do not leak workflow semantic content, imported source, prompts, secrets, provider responses, credentials, runtime trace bodies, or full Evidence payloads into analytics
- additive events must use documented minimal metadata
- AI failure/details should be reported with bounded categorical metadata, not sensitive raw content

---

# 9. Accessibility and responsive quality

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

# 10. Required implementation verification

Before **Implementation Complete**:

```text
npm test
npm run typecheck
npm run build
```

All must pass, unless there is an explicitly documented external tooling outage and the status is not advanced to complete.

For AI work, also run the packet-defined evaluation/benchmark tests.

Do not declare completion based only on type checking or a successful Vercel deployment.

---

# 11. Repository CI / merge enforcement

The repository CI workflow should run on pull requests to `main` and on `main` pushes:

```text
npm ci
→ npm test
→ npm run typecheck
→ npm run build
```

Normal merge policy should use GitHub branch protection/rulesets to require the CI check where the repository/account supports enforcement.

Rules:

- do not intentionally bypass required checks for ordinary feature/docs/code changes
- if branch protection is unavailable, manual verification remains mandatory
- a green Vercel Preview does not replace test/typecheck/build
- CI configuration changes must be reviewed as release-governance changes
- `main` should remain deployable

---

# 12. Independent QA

Implementation self-test is not Independent QA.

Independent QA should verify, as applicable:

- Acceptance Criteria
- focused feature tests
- regression suite
- migration/backward compatibility
- accessibility
- AI grounding/Unknown behavior
- provider failure/degraded state
- no silent mutation
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

# 13. AI evaluation QA minimums

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

Do not consider an AI evaluator production-ready because one manually tested response looks good.

Evaluator promotion to stronger authority is governed separately by `docs/roadmap/EXECUTION_GATES.md`; a packet release benchmark is not automatically a permanent authority threshold.

---

# 14. Security / data review triggers

Explicit review against `docs/SECURITY_RELIABILITY_BASELINE.md` and/or `docs/DATA_AND_AI_GOVERNANCE.md` is required when adding/changing, as applicable:

- authentication/authorization
- account/cloud persistence
- external project/source import
- arbitrary file/archive parsing
- provider/model/provider credentials
- mutation APIs
- collaboration/RBAC
- payment/billing authority
- runtime trace ingestion
- sensitive-data handling
- third-party data transmission
- persistent evaluation/revision history

Do not treat workflow-level policy evaluation as a substitute for AgentGraph platform security.

---

# 15. Git / commit rules

- Start from current `main` or a clearly documented current feature branch.
- Keep commits scoped and understandable.
- Do not commit secrets or local credential files.
- Do not rewrite shared branch history without an explicit reason.
- Avoid unrelated cleanup in a focused Product Packet unless required to complete it safely.

For concurrent work, re-check current `main` before merge/release and resolve conflicts against current repository reality, not the original packet baseline.

Durable Product/Architecture decisions that materially change boundaries/sequencing/migration/security/data ownership should be recorded in `docs/decisions/` rather than buried only in a chat or commit message.

---

# 16. Vercel release gate

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

# 17. Status model

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
- Specified: implementation-ready contract exists
- Implementation Started: code work actually began
- Implementation Complete: required implementation checks passed
- QA Complete: independent QA completed
- Production Verified: production deployment verified
- Sprint Complete: closure accepted with blockers resolved

Roadmap stage promotion is a separate Product Architecture decision from Sprint status. Use `docs/roadmap/EXECUTION_GATES.md` for stage/gate promotion.

---

# 18. Completion report

After implementation/release work report:

1. 変更内容 / changes
2. tests
3. TypeScript typecheck
4. production build
5. commit SHA/message
6. Production deployment status
7. GitHub main SHA vs Vercel Production SHA
8. remaining issues / known notes

If any required check was not run, say so explicitly and do not imply it passed.

---

# 19. Documentation maintenance

Permanent Product/Architecture decisions belong in:

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`

Cross-stage execution and governance belong in:

- `docs/roadmap/EXECUTION_GATES.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`
- relevant `docs/architecture/` contracts

Material durable decision history belongs in:

- `docs/decisions/`

Implementation-specific authoritative contracts belong in:

- `docs/specs/`

Current state snapshots belong in:

- `docs/CURRENT_STATE.md`

`AGENTS.md` should remain a compact routing/instruction document, not a duplicate of all product documentation.
