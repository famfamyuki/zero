# AgentGraph Studio — Development Rules

Status: **Authoritative engineering and release rules**

These rules apply to product changes, architecture changes, implementation, QA, GitHub management, and Vercel release work unless a stricter active packet exists.

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

Workflow-authored text is untrusted analyzed data. Agent role/goal/backstory, task descriptions, expected output, and tool descriptions must not be interpreted as evaluator control instructions.

## 3.5 Failure isolation

AI provider timeout, invalid schema, unsupported response, or unavailable configuration must not break unrelated deterministic features.

## 3.6 Knowledge discipline

Do not let AI convert runtime-only or external-dependent Unknowns into Known facts.

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

---

# 5. Domain and architecture rules

- Keep domain logic out of React components when it is reusable/testable independently.
- Do not leak provider-specific AI response types into core domain contracts.
- Do not make UI state authoritative workflow semantics.
- Preserve explicit versioning for durable contracts.
- Prefer deterministic canonicalization/fingerprints for stale detection where appropriate.
- Keep visual grouping, semantic modules, and runtime orchestration separate.
- Do not add a second target framework through scattered giant conditionals; introduce capability/lossiness boundaries first.
- Do not silently degrade unsupported semantics during export/build.

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

---

# 8. Analytics regression rules

Marketing/growth optimization is not the primary engineering priority, but existing analytics is a protected system behavior.

Rules:

- do not remove/rename existing events casually
- do not change event meaning without explicit specification
- do not leak workflow semantic content, prompts, secrets, provider responses, credentials, or full Evidence payloads into analytics
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
npx tsc --noEmit
npm run build
```

All must pass, unless there is an explicitly documented external tooling outage and the status is not advanced to complete.

For AI work, also run the packet-defined evaluation/benchmark tests.

Do not declare completion based only on type checking or a successful Vercel deployment.

---

# 11. Independent QA

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

# 12. AI evaluation QA minimums

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

---

# 13. Git / commit rules

- Start from current `main` or a clearly documented current feature branch.
- Keep commits scoped and understandable.
- Do not commit secrets or local credential files.
- Do not rewrite shared branch history without an explicit reason.
- Avoid unrelated cleanup in a focused Product Packet unless required to complete it safely.

For concurrent work, re-check current `main` before merge/release and resolve conflicts against current repository reality, not the original packet baseline.

---

# 14. Vercel release gate

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

# 15. Status model

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

---

# 16. Completion report

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

# 17. Documentation maintenance

Permanent Product/Architecture decisions belong in:

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`

Implementation-specific authoritative contracts belong in:

- `docs/specs/`

Current state snapshots belong in:

- `docs/CURRENT_STATE.md`

`AGENTS.md` should remain a compact routing/instruction document, not a duplicate of all product documentation.
