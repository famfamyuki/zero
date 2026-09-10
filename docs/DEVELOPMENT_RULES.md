# AgentGraph Studio — Development Rules

Status: **Authoritative engineering execution, QA, repository, and release governance**

This is the single current Development Governance authority. It consolidates the
former `ENGINEERING_EXECUTION_GOVERNANCE.md` without reducing its semantics. That
older path is retained only as a compatibility pointer for historical ADR/spec
links. A stricter active packet wins for its scoped implementation contract, but
cannot silently override durable Product, Architecture, Gate, Security/Data, or
release authority.

Read cross-cutting authorities when their concern is involved:

- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`
- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- `docs/roadmap/RISK_REGISTER.md`
- `docs/architecture/SEMANTIC_MODEL_EVOLUTION.md`
- `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`
- `docs/architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`
- `docs/decisions/`

---

# 0. Source of truth and scope

Before material Product, Architecture, Specification, Implementation, QA, or
Release decisions, re-check as applicable:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ durable Product / Architecture / Development / Roadmap authorities
→ relevant specialized contracts
→ Program Board / Risk Register
→ Current State snapshot
→ ADR / historical chats / old SHAs
```

Do not reuse a historical SHA, deployment, packet baseline, or chat statement as
current state merely because it is documented. Live repository/Production reality
wins. The active packet controls scoped implementation details unless it conflicts
with current repository reality or a higher durable authority.

Long-term Product/Architecture/Roadmap documents define direction and constraints;
they do not automatically expand the active Sprint. Stage order is dependency
direction, not an implementation queue. After a completed stage use:

```text
Evidence → Gate Review → Explicit Next Selection
```

Stage 1.5 remains a selection band, not a fixed backlog. Commercial Validation
Gate M0 remains separate from roadmap promotion and AI Authority.

---

# 1. Product, architecture, and regression invariants

All development preserves the Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Durable engineering principles:

- Simplest Sufficient Architecture;
- Evidence Before Intelligence;
- deterministic analysis owns deterministic facts;
- AI reasoning is evidence-grounded and advisory;
- preserve `Known / Inferred / Unknown`;
- preserve deterministic / heuristic / external-dependent distinctions;
- no unsupported runtime/external claims as facts;
- no arbitrary overall architecture score without calibrated benchmark evidence;
- no silent semantic mutation;
- user-controlled semantic change;
- AI authority is capability-scoped and must not grow faster than measured trust;
- mutation scope is separately gated and must not outrun capability/security/human-control evidence;
- configured Intent/Constraint/Scenario expectation is not observed runtime truth;
- `Visual Group ≠ Semantic Module ≠ Runtime Orchestration`;
- user-owned source/runtime is the default direction;
- CrewAI-first, not core-domain lock-in;
- no silent lossy conversion;
- data/provider scope must not silently broaden;
- platform security/reliability is a current cross-cutting requirement;
- existing analytics is protected system behavior.

Unless an active packet explicitly changes behavior, preserve at least:

- Visual Workflow Builder;
- templates;
- JSON import/export;
- deterministic CrewAI Python export;
- Readiness;
- Execution Preview;
- Resource Analysis;
- Unified Preflight;
- first-value activation behavior;
- analytics/event behavior;
- accessibility/language/responsive behavior.

A new AI feature must not become a dependency of deterministic import/export,
serialization, readiness, preview, resource analysis, or transpilation unless an
explicit future packet changes that architecture.

---

# 2. AI, semantic change, and trust boundaries

## 2.1 Provider and structured-output rules

Provider calls and credentials stay server-side. Never expose provider secrets,
API keys, tokens, credentials, or sensitive provider responses in client code,
analytics, logs, docs, commits, or user-visible diagnostic output.

Prefer versioned structured output with runtime validation over free-form parsing.
When findings cite Evidence/targets, validate references before presenting them as
valid. Invalid references must fail closed according to the active packet; do not
silently repair unsupported claims into valid-looking output.

## 2.2 Untrusted analyzed data

Workflow-authored/imported text is analyzed data, not evaluator control
instruction. Agent role/goal/backstory, task descriptions, expected output, tool
descriptions, Scenario/Acceptance text, source comments/strings, and imported text
must not override evaluator/system authority.

Imported external projects must not be executed merely to inspect or convert them
unless a separately specified sandboxed execution feature exists.

## 2.3 Failure isolation and knowledge discipline

Provider timeout, invalid schema, unsupported response, unavailable configuration,
or evaluator failure must not break unrelated deterministic features.

Do not convert runtime-only or external-dependent Unknowns into Known facts. A
configured Intent/Constraint/Scenario can be Known as source data while the
real-world/runtime claim it describes remains Unknown until suitable evidence
exists.

## 2.4 Evaluator/model changes

A model/provider/prompt/rubric/schema/post-validation change that can materially
change evaluator behavior must follow `docs/DATA_AND_AI_GOVERNANCE.md`:

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

Do not silently swap a Production model and assume equivalent evaluator behavior.

## 2.5 AI and mutation authority

AI Authority and semantic mutation authority are governed by
`docs/roadmap/EXECUTION_GATES.md`. Do not infer that authority for architecture
findings automatically authorizes proposals, resource/tool recommendations,
security/control recommendations, semantic patch generation, or side-effect-
sensitive operations.

Every authority-expanding packet must state the approved authority envelope and
trace it to the applicable gate decision/evidence.

AI must not directly and silently apply meaning-changing workflow changes. Future
semantic transformation uses:

```text
Proposal
→ Semantic Patch
→ Validation
→ Before / After Preview
→ User Apply
```

If a packet only implements evaluation/proposals, do not add mutation as a
convenience. Passing the patch pipeline does not authorize every semantic
operation; the packet must define allowed mutation scope. Stale proposal detection
must prevent applying a patch to a changed workflow revision. Before Stage 3
mutation authority, Gate C must be satisfied by the selected packet architecture.

Side-effect-sensitive operations involving external mutation, credentials,
sensitive data, approval/policy, or insufficiently known tool capabilities require
stronger capability, human-control, and security evidence than architecture-only
changes.

---

# 3. Domain and architecture implementation rules

- Keep reusable/testable domain logic out of React components.
- Do not leak provider-specific AI response types into core domain contracts.
- Do not make UI state authoritative workflow semantics.
- Preserve explicit versioning for durable contracts.
- Prefer deterministic canonicalization/fingerprints for stale detection where appropriate.
- Keep visual grouping, semantic modules, and runtime orchestration separate.
- Keep Intent, Constraints, Scenario/Acceptance, static evidence, and observed runtime evidence semantically distinct.
- Do not add a second target framework through scattered giant conditionals; define capability/lossiness boundaries first.
- Do not silently degrade unsupported semantics during export/build/import.
- Do not create Graph/Workflow V2 merely to mirror a future architecture diagram; follow `SEMANTIC_MODEL_EVOLUTION.md` triggers.
- Project identity, workflow identity, semantic revision, layout state, and cloud/team persistence are separate concepts.

---

# 4. Definition of Ready and packet contract

A capability must not advance from **Selected** to **Specified / Implementation
Started** merely because it is desirable. Before implementation, resolve every
applicable concern below or deliberately narrow scope.

## Product / dependency readiness

- user problem and North Star value are explicit;
- upstream Stage/Gate requirements are satisfied or the packet is explicitly foundation work;
- smallest sufficient scope is identified;
- dependency order is understood;
- later-stage features are explicitly Out of Scope.

## Domain / architecture readiness

- authoritative domain owner is known;
- identity/version semantics are defined;
- no speculative persisted major version is introduced;
- migration/backward compatibility direction is defined;
- deterministic/AI ownership boundaries remain clear.

## Data / security readiness

- persistence/provider/data-flow changes are explicit;
- applicable Security/Data governance triggers are reviewed;
- secret/sensitive-data boundaries are defined;
- abuse/size/timeout/degraded behavior is defined for relevant public/provider-backed endpoints.

## UX / quality readiness

- primary/loading/error/stale/degraded states are defined;
- accessibility/responsive implications are defined;
- analytics regression/privacy boundaries are defined;
- Acceptance Criteria are testable;
- representative fixtures/regression tests are identified.

## Release readiness

- required verification is expected to remain runnable;
- Production verification is practically possible;
- rollback/degraded-state direction is understood for material risk;
- repository/external dependencies are not silently assumed.

Every non-trivial Sprint/Packet must explicitly define, as applicable:

- Goal;
- Scope;
- Out of Scope;
- Domain/API changes;
- UX changes;
- Migration/backward compatibility;
- Security/privacy implications;
- Data persistence/provider-flow implications;
- Reliability/degraded-state behavior;
- approved AI authority envelope;
- approved semantic mutation scope;
- Scenario/Acceptance implications;
- Acceptance Criteria;
- Test Matrix;
- compact requirement traceability.

If implementation discovers a true Product contradiction, report it rather than
silently redefining the contract. Engineering may resolve mechanical details that
do not alter Product behavior or contract semantics.

---

# 5. Requirement traceability

Traceability must stay lightweight but explicit enough to prevent drift:

```text
Upstream Product / Architecture / Gate / Scenario / Risk
→ Packet requirement / Acceptance Criterion
→ test / fixture / Production verification
```

A non-trivial packet should use a compact matrix such as:

| Requirement / capability | Upstream authority | Packet AC | Test / verification |
|---|---|---|---|
| `<id or short name>` | Product / Architecture / Gate / Scenario / Risk | AC-N | test/fixture/smoke |

Additional rules:

- authority-expanding AI work references its approved authority envelope/gate;
- semantic mutation references allowed mutation scope and Gate C evidence;
- security/data-sensitive behavior references applicable governance review;
- Scenario/Acceptance distinguishes static from runtime verification;
- migration behavior has legacy fixtures;
- intentional deferral is marked Out of Scope rather than left untraceable.

Do not introduce heavyweight enterprise requirements tooling until repository
scale requires it.

---

# 6. Migration, compatibility, and durable contract lifecycle

Migration must preserve existing user artifacts unless an explicit breaking-version
decision is approved. For schema/domain changes define:

- old accepted format;
- new accepted format;
- normalization/migration path;
- producer and reader behavior;
- export behavior;
- round-trip expectations;
- invalid/unsupported-data behavior;
- representative legacy fixtures/tests;
- rollback implications.

Do not silently reinterpret old workflow meaning. A new persisted workflow major
version requires an ADR and must follow `SEMANTIC_MODEL_EVOLUTION.md`.

Use these contract lifecycle states where applicable:

- `ACTIVE` — produced and accepted by current implementations;
- `ACCEPTED_LEGACY` — not produced by default but still read safely;
- `DEPRECATED` — temporarily supported with migration/deprecation reason;
- `READ_ONLY_LEGACY` — safely inspect/export but not edit/rewrite without migration;
- `MIGRATION_REQUIRED` — explicit conversion required before current operations;
- `UNSUPPORTED` — rejected clearly, never silently reinterpreted.

A version transition records:

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

A new writer does not automatically justify deleting the old reader. Deprecation
or removal must define migration, support, fixtures, and rollback. Evaluator,
prompt, and rubric versions additionally follow Data & AI Governance. API versions
must define unsupported-client behavior.

---

# 7. Analytics, accessibility, and UX regression

Do not remove/rename existing analytics events casually or change event meaning
without explicit specification. Never send workflow semantic content, imported
source, Intent/Constraint/Scenario text, prompts, secrets, provider responses,
credentials, runtime trace bodies, or full Evidence payloads to analytics. Additive
events use minimal documented metadata; AI failures use bounded categorical data.

New UX preserves or improves:

- keyboard accessibility;
- focus management and visible focus;
- meaningful accessible names;
- non-color-only status communication;
- responsive behavior;
- appropriate error/loading/status announcements.

A current packet may define stronger requirements.

---

# 8. Operational quality maturity

Do not invent permanent SLOs before representative evidence exists, and do not
leave mature critical/provider-backed behavior permanently qualitative.

Use:

```text
UNMEASURED
→ BASELINED
→ PROVISIONAL_TARGET
→ CALIBRATED_TARGET
→ ENFORCED / ALERTED where justified
```

BASELINED evidence may include privacy-safe request latency distribution,
timeout/failure categories, structured-output invalid rate, provider rate-limit
behavior, bounded usage/cost trend, and payload/input-size distribution.

A PROVISIONAL_TARGET names metric, dataset/time window/sample scope, target,
rationale, known limitations, and review trigger. Promote to CALIBRATED_TARGET only
when representative Production/benchmark evidence supports it. Material provider,
model, or architecture changes may require re-baselining. A calibrated target may
become a release gate or alert when stable and actionable.

---

# 9. Security and data review triggers

Explicit review against `SECURITY_RELIABILITY_BASELINE.md` and/or
`DATA_AND_AI_GOVERNANCE.md` is required when changing, as applicable:

- authentication/authorization;
- account/cloud persistence;
- external project/source import;
- arbitrary file/archive parsing;
- provider/model credentials;
- mutation APIs;
- side-effect-sensitive Semantic Patch operations;
- capability/permission/human-approval semantics;
- Scenario/Acceptance persistence/provider transmission;
- collaboration/RBAC;
- payment/billing authority;
- runtime trace ingestion;
- sensitive-data handling;
- third-party data transmission;
- persistent evaluation/revision history.

Workflow-level policy evaluation is not a substitute for AgentGraph platform
security.

---

# 10. Required implementation verification and CI

Before **Implementation Complete** run and report:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

All must pass unless an explicitly documented external tooling outage exists and
the status is not advanced to complete. AI work also runs packet-defined
evaluations/benchmarks. Do not declare completion from typecheck or deployment
alone.

Repository CI on pull requests to `main` and `main` pushes must retain the required
verification path (with dependency installation and any additional current harness
checks). `docs:check` verifies documentation integrity; it is not a substitute for
tests/typecheck/build.

Normal merge/repository direction:

- protect `main`;
- require a PR or equivalent reviewed merge path for normal changes;
- require `test-typecheck-build` where platform support permits;
- prevent normal force-push/history rewrite;
- retain explicit administrator/emergency recovery only through exceptional procedure;
- verify live Branch Protection/Rulesets rather than infer them from docs;
- treat missing enforceable protection as `REPOSITORY_BLOCKER` / active program risk;
- a green Vercel Preview never replaces required CI;
- CI/protection changes are release-governance changes;
- `main` should remain deployable.

---

# 11. Independent QA

For normal Product/application/runtime/behavior changes, implementation self-test is
not Independent QA. W01 independently verifies the exact candidate as applicable:

- Acceptance Criteria;
- focused feature tests and regression suite;
- migration/backward compatibility;
- accessibility;
- AI grounding / Unknown behavior;
- provider failure/degraded state;
- approved AI authority envelope;
- approved mutation scope;
- no silent mutation;
- Scenario/Acceptance static-vs-runtime boundary;
- analytics regression constraints;
- security/privacy boundaries;
- Production behavior where applicable.

Use results `PASS`, `PASS WITH NOTES`, or `FAIL / BLOCKED`; classify findings as
Blocker, Non-blocker, or Known Note.

When applicable, AI QA tests behavioral contracts rather than exact prose only:
must-detect, must-not-claim, evidence/target validity, invalid-reference rejection,
Unknown preservation, good-workflow false-positive control, provider
unavailable/timeout behavior, malformed structured output, relevant ordering/
rename/layout invariance, no mutation side effect, and authority-envelope boundary
cases. One manually good response is not production evidence. Evaluator promotion
to stronger authority is a separate Execution Gates decision.

If code or behavior changes after QA Complete, fresh independent QA is required
before release. C01 releases only the same QA-approved change set under the Role
Registry lifecycle.

---

# 12. Git, release, and Production verification

Git rules:

- start from current `main` or a clearly documented current feature branch;
- keep commits scoped and understandable;
- never commit secrets or local credential files;
- do not rewrite shared history without explicit reason;
- avoid unrelated cleanup inside a focused Product packet;
- before merge/release, re-check current main and resolve conflicts against current repository reality;
- record material durable Product/Architecture boundary, sequence, migration, security, or data-ownership decisions in ADRs rather than only chat/commit text.

Before **Production Verified**, W01 independently confirms:

- latest GitHub `main`;
- released code corresponds to the QA-approved change set;
- Vercel deployment state is `READY`;
- target is `production`;
- correct Production alias/domain;
- main user flow and changed behavior smoke where practical;
- relevant runtime errors;
- `GitHub main SHA = Vercel Production githubCommitSha`.

A Preview or deployment READY alone is not Production Verified.

---

# 13. Lifecycle and authority

Use the lifecycle:

```text
Selected
→ Specified
→ Implementation Started
→ Implementation Complete
→ QA Complete
→ Production Verified
→ Sprint Complete
```

Meanings:

- Selected — Product priority explicitly chosen;
- Specified — implementation-ready contract exists and applicable DoR is satisfied;
- Implementation Started — implementation work actually began;
- Implementation Complete — required implementation checks passed;
- QA Complete — required independent QA completed for normal behavior-changing work;
- Production Verified — released Production behavior/revision verified;
- Sprint Complete — closure accepted with blockers resolved.

Role ownership and handoff are canonical in `CHAT_ROLE_REGISTRY.md`. Roadmap stage
promotion is separate from Sprint status and follows `EXECUTION_GATES.md`.

---

# 14. Risk handling and recurring execution feedback

Program-level risks live in `roadmap/RISK_REGISTER.md`. Promote a risk to an
explicit blocker when its trigger becomes true and current work cannot safely
continue. Packet-specific risks stay in the active packet. Do not duplicate the
entire Risk Register in every packet.

For repeated corrections or material execution failures, record the cause,
smallest durable prevention, owner, and closure evidence in the relevant PR or
packet. Route reproducible failures to tests/fixtures, repeated mechanics to a
shared Skill/script, and authority changes to the owning governance document/ADR.
Do not append every conversation detail to `AGENTS.md`. Close prevention only when
a regression check or realistic workflow confirms it.

Material changes to Definition of Ready, version/compatibility policy, AI or
mutation authority, required CI/release verification, repository protection,
Scenario/Acceptance semantic ownership, or data/security ownership require durable
review and usually an ADR. Do not silently weaken release or safety requirements.

---

# 15. Documentation architecture and maintenance

Canonical ownership:

- Product → `PRODUCT_MASTER.md`;
- Architecture → `ARCHITECTURE.md`;
- Development Governance → this file;
- roles/lifecycle ownership → `CHAT_ROLE_REGISTRY.md`;
- stage/dependency sequence → `roadmap/MASTER_ROADMAP.md`;
- promotion / AI Authority / Mutation Authority → `roadmap/EXECUTION_GATES.md`;
- current execution / packet index → `roadmap/PROGRAM_BOARD.md`;
- durable risks → `roadmap/RISK_REGISTER.md`;
- current scoped snapshot/release evidence → `CURRENT_STATE.md`;
- specialized Security/Data/Architecture/Commercial topics → their dedicated contracts;
- durable decision history → `decisions/`;
- implementation contracts → `specs/`;
- reproducible execution mechanics → `harness/README.md`.

`AGENTS.md` and `docs/README.md` are routers, not duplicate authorities.
Documentation optimization may delete duplicate prose, merge/split/move files,
change canonical ownership, and retain compatibility pointers when it preserves:

- Product intent;
- Architecture boundaries;
- Stage/dependency relations;
- Gate semantics;
- AI / Mutation authority;
- Security / Data boundaries;
- migration / compatibility;
- Acceptance Criteria;
- regression constraints;
- QA / Production verification requirements;
- Included / Deferred / Conditional / Out of Scope meaning.

Goal:

```text
Same Product Meaning
+ Fewer Duplicate Authorities
+ Lower Reading Cost
+ Lower Synchronization Cost
```

## 15.1 Pure documentation maintenance fast path

A user-authorized documentation-maintenance change may skip W01 Independent QA
when it only reorganizes or clarifies documentation without changing executable or
semantic Product/runtime authority. Eligible work includes duplicate-prose removal,
router/index improvements, equivalent wording, link repair, archive/history
organization, canonical-owner consolidation, and compatibility pointers.

The fast path may include deterministic `docs:check` maintenance only when it does
not weaken required repository/application verification. It does **not** silently
authorize changes to application/runtime behavior, Product/Architecture/Roadmap or
Gate meaning, AI/Mutation authority, Security/Data boundaries, migration semantics,
Acceptance Criteria, regression constraints, normal QA/release requirements,
Hooks, shared Skills, sandbox/permission configuration, or CI/protection policy.
If any of those meanings change, use normal governance and independent QA as
applicable.

Fast-path work still requires:

- explicit user authorization for the requested repository change;
- current-main awareness and existing-change protection;
- `npm run docs:check` plus the normal required repository CI/checks that remain applicable;
- a PR/merge path consistent with live repository protection;
- a concise record of what meaning was preserved and what canonical ownership changed.

An explicit user instruction may authorize a bounded exception beyond this default;
record the exception and do not generalize it to unrelated Product/application
work.

## 15.2 Documentation integrity

`npm run docs:check` must remain deterministic, local, fast, dependency-light, and
privacy-safe. It verifies at least required canonical paths, indexed relative
links, Program Board packet references, availability of packet files, lifecycle
vocabulary, required verification commands, and critical CI configuration. It must
not attempt to infer subjective roadmap correctness from prose.

If a durable document is renamed/moved/consolidated, update current routing in the
same change or retain an explicit compatibility pointer. Historical ADR wording may
remain historical when the path still resolves and its status is clear.

---

# 16. Completion report

After implementation/release work report, as applicable:

1. changes / scope;
2. docs check;
3. tests;
4. TypeScript typecheck;
5. production build;
6. packet-defined evaluations/benchmarks;
7. commit SHA/message;
8. QA status and exact candidate where required;
9. Production deployment status;
10. GitHub main SHA vs Vercel Production SHA;
11. remaining issues / Known Notes.

If a required check was not run, say so explicitly and do not imply it passed.
