# AgentGraph Studio Development Documentation

This directory is the durable development knowledge base for AgentGraph Studio.
Use progressive disclosure: start from the task, open the smallest relevant
canonical set, then add specialized contracts only when their concern is involved.
Do not treat every file in `docs/` as required startup context.

## Canonical authority map

| Concern | Canonical authority |
|---|---|
| Product definition / North Star / durable Product principles | [`PRODUCT_MASTER.md`](./PRODUCT_MASTER.md) |
| Architecture boundaries / long-term evolution | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Engineering / Definition of Ready / implementation / QA / release / repository enforcement | [`DEVELOPMENT_RULES.md`](./DEVELOPMENT_RULES.md) |
| Chat / Codex / Work roles and lifecycle ownership | [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md) |
| Stage sequence and dependency logic | [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md) |
| Promotion / Stage 1.5 / AI Authority / Mutation Authority | [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md) |
| Current execution order / packet index / blocker ownership | [`roadmap/PROGRAM_BOARD.md`](./roadmap/PROGRAM_BOARD.md) |
| Durable cross-stage risks | [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md) |
| Concise current-state / scoped release evidence snapshot | [`CURRENT_STATE.md`](./CURRENT_STATE.md) |
| Reproducible execution harness | [`harness/README.md`](./harness/README.md) |

`ENGINEERING_EXECUTION_GOVERNANCE.md` is retained only as a compatibility pointer
for older ADR/spec links. Its durable rules are consolidated into
[`DEVELOPMENT_RULES.md`](./DEVELOPMENT_RULES.md).

## Read by task

A normal task should usually begin from roughly 3–6 directly relevant documents.
The active packet is always scoped by the Program Board; long-term documents do
not grant permission to implement future work.

| Work | Initial read set | Add only when needed |
|---|---|---|
| Product / next capability / Roadmap | Product Master + Master Roadmap + Execution Gates + Program Board | Risk Register; Evaluation Trust & Scale; Monetization Architecture |
| Architecture | Architecture + Program Board + active packet | Semantic Model Evolution; Import Workspace; Scenario Acceptance; Data/Security |
| 02 Specification | Product/Architecture authority + Development Rules + Program Board + active packet | relevant specialized contract |
| C01 Implementation | Harness + Program Board + active packet + Development Rules | specialized contract triggered by the packet |
| W01 QA / Release | Role Registry + Harness + active packet + Development Rules | Security/Data, commercial runbook, or other relevant release contract |
| Commercial / pricing / paid access | Monetization Architecture + Program Board + active commercial packet | Product strategy, paid-launch runbook, Risk Register |
| Security / persistence / provider / evaluator | Security baseline and/or Data & AI Governance + active packet | relevant Architecture / Gate contract |

## Specialized contracts

Load these conditionally, not by default:

- evaluator trust, benchmarks, Search/Locate/Scoped Evaluation → [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md)
- product platform / adoption / commercial sequencing → [`roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`](./roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md)
- paid value, price/quota, unit economics, Commercial Validation Gate M0 → [`roadmap/MONETIZATION_ARCHITECTURE.md`](./roadmap/MONETIZATION_ARCHITECTURE.md)
- platform security / reliability → [`SECURITY_RELIABILITY_BASELINE.md`](./SECURITY_RELIABILITY_BASELINE.md)
- data classification, persistence/provider boundaries, model/evaluator governance → [`DATA_AND_AI_GOVERNANCE.md`](./DATA_AND_AI_GOVERNANCE.md)
- semantic-model migration/version runway → [`architecture/SEMANTIC_MODEL_EVOLUTION.md`](./architecture/SEMANTIC_MODEL_EVOLUTION.md)
- import, mapping, Workspace/Project, revision/local-first → [`architecture/IMPORT_WORKSPACE_CONTRACT.md`](./architecture/IMPORT_WORKSPACE_CONTRACT.md)
- designed expectations and static-to-runtime verification bridge → [`architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`](./architecture/SCENARIO_ACCEPTANCE_CONTRACT.md)
- controlled paid-launch financial QA → [`runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md`](./runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md)

## Current packet and history

Use the [Program Board packet index](./roadmap/PROGRAM_BOARD.md#packet-index) to
identify the current/open packet and amendments before opening [`specs/`](./specs/).
A packet header such as `Status: Specified` describes specification maturity; it
does not override current lifecycle/release evidence in the Program Board and live
repository/Production state.

Completed packets remain regression/history references, not automatic new scope.
Durable decisions live under [`decisions/`](./decisions/). Research/evidence files
and old SHAs are retained for provenance but are not default context.

## Source-of-truth hierarchy

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ Product Master
→ Architecture
→ Development Rules / applicable Security & Data baselines
→ Master Roadmap
→ Execution Gates
→ relevant specialized plans/contracts
→ Program Board / Risk Register
→ Current State snapshot
→ ADR / historical Chat / Work / Codex / old SHAs
```

A documented SHA is a snapshot unless it was explicitly live-verified for the
current decision. Durable Product/Architecture/Roadmap content never expands an
active Sprint by itself.

## Non-lossy documentation rule

Documentation optimization may delete duplicate prose, move information, combine
or split documents, change canonical ownership, and retain compatibility pointers.
It must preserve the underlying Product meaning, Architecture boundaries,
Stage/dependency relations, Gate semantics, AI/Mutation authority, Security/Data
boundaries, migration/compatibility, Acceptance Criteria, regression constraints,
QA/Production verification requirements, and Included/Deferred/Conditional/Out of
Scope meaning.

The goal is:

```text
Same Product Meaning
+ Fewer Duplicate Authorities
+ Lower Reading Cost
+ Lower Synchronization Cost
```

## Core execution reminders

The complete operating model is in the Role Registry. The complete engineering
contract is in Development Rules. The complete execution mechanics are in the
Harness. Do not duplicate those documents here.

Roadmap progression remains:

```text
Evidence
→ Gate Review
→ Explicit Next Selection
```

Stage 1.5 is a selection band, not a mandatory backlog. Commercial Validation Gate
M0 is separate from AI Authority. `Configured expectation ≠ Static evidence ≠
Observed runtime behavior`, and `Visual Group ≠ Semantic Module ≠ Runtime
Orchestration` remain durable semantic boundaries.

Normal implementation verification remains:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

plus packet-defined evaluations/benchmarks where applicable. Implementation
self-test is not Independent QA; deployment READY is not Production Verified.
Pure documentation maintenance has the bounded exception defined in Development
Rules and the Harness.
