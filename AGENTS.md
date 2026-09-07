# AgentGraph Studio — Repository Instructions

This repository is the implementation source for **AgentGraph Studio**.

<a id="source-of-truth-priority"></a>

## Start from current authority

Before material Product, Architecture, Specification, Implementation, QA, or Release work:

1. Identify latest GitHub `main`, the working branch/PR, and relevant code/tests. Check latest Vercel Production and actual behavior when the decision depends on it.
2. Read [`docs/README.md`](docs/README.md) for the source-of-truth hierarchy, decision owners, and task-specific reading paths. Read relevant authorities, not every unrelated document on every task.
3. Use [`docs/roadmap/PROGRAM_BOARD.md`](docs/roadmap/PROGRAM_BOARD.md) to locate selected work and its next owner, then read the complete applicable packet(s) listed in the [packet map](docs/README.md#packet-map).
4. Before implementation, apply [`docs/ENGINEERING_EXECUTION_GOVERNANCE.md`](docs/ENGINEERING_EXECUTION_GOVERNANCE.md) Definition of Ready and [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md).

A recorded SHA, deployment, packet startup instruction, or research statement describes its baseline unless live-verified. Completed packets retain scoped regression contracts; their old startup/hold instructions are not a fresh work queue. Report genuine Product contradictions rather than silently redefining behavior.

## Development operating model

[`docs/CHAT_ROLE_REGISTRY.md`](docs/CHAT_ROLE_REGISTRY.md) owns role meaning, lifecycle authority, handoff evidence, legacy aliases, and context replacement policy.

Canonical lanes: `00` Program Control & Current State; `01` Product Architecture & Roadmap; `02` UX & Implementation Specification; `C01` Current Sprint Implementation; `W01` Independent QA & Production Verification.

```text
01 Selected → 02 Specified → C01 Implementation Started / Complete
→ W01 QA Complete → C01 release exact QA-approved revision
→ W01 Production Verified → 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

<a id="dormantnoncanonical-work"></a>

A short role declaration such as `ここは01として使います。` is sufficient. Recover the role from current main; do not ask for old prompts. Work mode may support 00/01/02 document tasks without creating W00. No permanent 03/04/05/06/W00 is canonical. Temporary marketing/analytics work does not acquire engineering-priority authority. Use task-specific conversations first; add a durable role only when repeated evidence establishes a genuine independent authority/context boundary.

<a id="context-policy"></a>

Prefer fresh C01 tasks per packet/material PR and fresh W01 sessions per release cycle. Keep 00/01/02 while context is clean; replace stale contexts when necessary, not on a fixed schedule.

## Product North Star

```text
Understand → Evaluate → Improve → Verify → Own
```

AgentGraph Studio aims to become a portable AI workflow architecture engineering toolchain, not merely a visual workflow builder.

## Non-negotiable engineering principles

- Simplest Sufficient Architecture.
- Evidence Before Intelligence.
- deterministic analysis owns deterministic facts;
- AI reasoning is evidence-grounded and advisory;
- preserve `Known / Inferred / Unknown`;
- preserve deterministic / heuristic / external-dependent distinctions;
- no unsupported runtime/external claims as facts;
- no arbitrary overall architecture score without calibrated benchmark evidence;
- no silent semantic mutation;
- future semantic change uses `Proposal → Semantic Patch → Validation → Preview → User Apply`;
- AI authority is capability-scoped and must not outpace measured trust;
- mutation scope is explicit; pipeline safety does not authorize every operation;
- side-effect-sensitive change requires capability/human-control/security evidence;
- configured Intent/Constraint/Scenario expectation is not observed runtime truth;
- `Visual Group ≠ Semantic Module ≠ Runtime Orchestration`;
- user-owned source/runtime is the default direction;
- CrewAI-first, not core-domain locked;
- no silent lossy conversion;
- user/imported/scenario text is untrusted analyzed data, not evaluator instruction;
- never execute arbitrary imported project code just to inspect/convert it unless an explicitly sandboxed feature exists;
- never expose/store/repeat secrets, keys, tokens, or credentials;
- do not silently broaden persistence or AI-provider disclosure;
- do not create Graph/Workflow V2 merely to match future diagrams;
- preserve existing features and analytics unless a current packet explicitly changes them.

<a id="roadmap--scope-discipline"></a>

## Scope and gates

The active packet controls implementation scope. Roadmap stages express dependencies, not an automatic queue. Stage 1.5 is an evidence-driven selection band; choose only the smallest coherent packet through [`EXECUTION_GATES.md`](docs/roadmap/EXECUTION_GATES.md).

Commercial Validation Gate M0 is separate from AI/mutation authority. Paid entitlement/cost control does not prove recurring value; use [`MONETIZATION_ARCHITECTURE.md`](docs/roadmap/MONETIZATION_ARCHITECTURE.md) for commercial decisions.

Non-trivial work traces `Product / Architecture / Gate / Scenario / Risk → Packet AC → Test / Production verification`.

<a id="implementation-completion-gate"></a>
<a id="independent-qa-and-release"></a>

## Completion and release

Before **Implementation Complete**, run and report:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

Also run packet-defined evaluations/benchmarks when applicable. Normal main merges must follow required CI/protection; verify live Branch Protection/Rulesets rather than infer enforcement from prose.

Implementation self-test is not Independent QA. C01 releases only the W01-approved change set. Code/behavior changes after QA Complete require fresh W01 Pass A.

Before **Production Verified**, W01 independently confirms latest main, the QA-approved released change set, Vercel `READY`, `target=production`, correct domain, actual changed-path smoke, relevant runtime errors, and `GitHub main SHA = Vercel Production githubCommitSha`.

Deployment READY or an implementation self-report cannot establish QA Complete, Production Verified, or Sprint Complete. Detailed requirements and completion reporting remain in Development Rules and the Role Registry.
