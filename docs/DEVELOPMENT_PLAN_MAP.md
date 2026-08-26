# AgentGraph Studio — Development Plan Map

Status: **Non-authoritative navigation / efficiency aid**  
Scope: A lossless map of the existing authoritative development-plan documents, their responsibilities, and the smallest reading set for common development decisions.

This document does **not** change Product, Architecture, Roadmap, Gate, Governance, Current State, or active Sprint content. It does not replace any authoritative document. It exists only to reduce repeated full-document reading and accidental cross-document authority drift.

## 0. Preserve the existing source-of-truth hierarchy

Use the hierarchy already defined by the authoritative documents:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ Product Master
→ Architecture
→ Development Rules / Engineering Execution Governance / cross-cutting baselines
→ Master Roadmap
→ Execution Gates
→ relevant cross-stage plans/contracts
→ Program Board / Risk Register
→ Current State snapshot
→ historical Chat / Work / Codex / old SHAs
```

This map adds no new authority layer.

---

# 1. Evaluation summary — where the current plan is inefficient

The current plan is strong in scope discipline, evidence gating, AI-authority boundaries, migration safety, and Production verification. The main inefficiency is **documentation traversal and repeated restatement**, not missing planning content.

The same durable concepts are intentionally restated across Product, Architecture, Development Rules, Execution Governance, Roadmap, Gates, Program Board, Current State, and cross-stage plans. This makes each document locally understandable, but it also creates three operational costs:

1. contributors can read far more documents than the decision actually requires;
2. a durable change may require checking many recap sections for consistency even when only one document owns the decision;
3. similar wording can be mistaken for multiple competing sources of authority.

The correct optimization is therefore **routing and ownership clarity**, not deleting Product/Architecture/Roadmap content or collapsing the documents into one large master file.

---

# 2. Canonical responsibility map

| Question / responsibility | Existing authoritative source | Use it for |
|---|---|---|
| What is AgentGraph Studio ultimately becoming? | `PRODUCT_MASTER.md` | Product definition, North Star, durable principles, final-state UX/product boundaries |
| What architectural boundaries must future implementations preserve? | `ARCHITECTURE.md` | Domain boundaries, semantic model direction, Evidence/AI layers, safe transformation/build/runtime architecture |
| What rules must implementation/QA/release obey? | `DEVELOPMENT_RULES.md` | Regression constraints, AI rules, scope discipline, implementation checks, Independent QA, Git/Vercel release rules |
| When is a packet implementation-ready and how are contracts/versioning/traceability governed? | `ENGINEERING_EXECUTION_GOVERNANCE.md` | Definition of Ready, contract lifecycle, traceability, operational maturity, repository/docs enforcement |
| Which Chat/Codex/Work surface owns which part of the lifecycle? | `CHAT_ROLE_REGISTRY.md` | Canonical operating model and role boundaries |
| What is the long-term stage/dependency sequence? | `roadmap/MASTER_ROADMAP.md` | Stage ordering, long-term capability placement, cross-stage dependency chains |
| May the product advance to the next authority/stage? | `roadmap/EXECUTION_GATES.md` | Gate A–F, AI Authority Envelope, mutation scope, promotion decisions |
| What is the near-term execution picture? | `roadmap/PROGRAM_BOARD.md` | Current milestone, candidates, blockers, next actions, Stage 1.5 selection triggers |
| What durable risks can change sequencing or block release? | `roadmap/RISK_REGISTER.md` | Cross-stage risk state, escalation, mitigation, blocker mapping |
| How is evaluator trust/quality/scale measured? | `roadmap/EVALUATION_TRUST_AND_SCALE.md` | Benchmark layers, gold-set direction, scale tiers, scoped evaluation/navigation dependencies |
| What is the broad product/platform/business strategy? | `roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md` | Market position, adoption wedge, moat, recurring-value direction, long-term commercial tiers |
| What is the concrete paid-value/cost/pricing/commercial-validation architecture? | `roadmap/MONETIZATION_ARCHITECTURE.md` | Free/paid boundary, unit economics, pricing evidence, M0, paid-launch operations |
| What platform security/reliability baseline applies now? | `SECURITY_RELIABILITY_BASELINE.md` | Product/platform security and reliability controls |
| What data/provider/evaluator governance applies? | `DATA_AND_AI_GOVERNANCE.md` | Data classification, persistence/provider scope, evaluator/model change governance |
| When may persisted semantic models evolve? | `architecture/SEMANTIC_MODEL_EVOLUTION.md` | Additive evolution, major-version triggers, migration runway |
| How do import, project/workspace, revision-compatible foundations evolve? | `architecture/IMPORT_WORKSPACE_CONTRACT.md` | Safe static import, mapping/provenance, local/project identity boundaries |
| How are configured expectations kept separate from static/runtime evidence? | `architecture/SCENARIO_ACCEPTANCE_CONTRACT.md` | Scenario/Acceptance semantics and verification-state boundaries |
| Why was a durable decision made? | `decisions/` | Historical durable decisions and rationale; not live current-state proof |
| What is the latest coordination snapshot? | `CURRENT_STATE.md` | Current milestone/status/next gate snapshot; live checks still win |
| What exactly may the current Sprint implement? | `specs/` | Selected/current implementation packet Scope, Out of Scope, AC, tests, migration and release verification |

---

# 3. Repeated concepts — read the owner first

The following concepts appear in several documents. Their repetition is useful as local context, but it should not force a contributor to treat every restatement as a separate planning decision.

| Repeated concept | Primary decision owner | Common recap locations |
|---|---|---|
| Product North Star / durable product principles | `PRODUCT_MASTER.md` | Architecture, Development Rules, Roadmap, Program Board, Current State |
| Long-term architecture boundaries | `ARCHITECTURE.md` | Product Master, Roadmap, cross-stage plans |
| Sprint lifecycle and required implementation/release checks | `DEVELOPMENT_RULES.md` + `ENGINEERING_EXECUTION_GOVERNANCE.md` | Current State, docs index, role docs |
| Stage sequencing | `roadmap/MASTER_ROADMAP.md` | Program Board, Current State, commercial/evaluation plans |
| Promotion / AI-authority / mutation authority | `roadmap/EXECUTION_GATES.md` | Master Roadmap, Development Rules, Evaluation plan, Program Board |
| Stage 1.5 candidate selection | `roadmap/EXECUTION_GATES.md` + `roadmap/PROGRAM_BOARD.md` | Master Roadmap, Current State, commercial strategy |
| Evaluator trust / scale | `roadmap/EVALUATION_TRUST_AND_SCALE.md` | Execution Gates, Master Roadmap, Program Board, Risk Register |
| Commercial validation M0 | `roadmap/MONETIZATION_ARCHITECTURE.md` | Program Board, Current State, Risk Register, ADR-0007 |
| Current implementation status | live GitHub/Vercel/Production + active packet | `CURRENT_STATE.md`, Program Board |

If wording differs, follow the already-defined source-of-truth hierarchy and the document whose declared scope owns the question. This map does not create a new conflict-resolution rule; it only makes the existing ownership easier to see.

---

# 4. Smallest sufficient reading packets

Do not read all durable documents for every task. Start with live reality and the active packet, then add only the documents whose responsibility is actually involved.

## 4.1 Product / roadmap selection

Use when selecting the next Sprint or reviewing a gate:

```text
latest GitHub main / Production reality
→ active specs packet / current evidence
→ PRODUCT_MASTER.md
→ MASTER_ROADMAP.md
→ EXECUTION_GATES.md
→ PROGRAM_BOARD.md
→ RISK_REGISTER.md
→ only the relevant cross-stage plan/contract
```

Examples of relevant cross-stage additions:

- evaluator quality/scale → `EVALUATION_TRUST_AND_SCALE.md`
- paid value/economics → `MONETIZATION_ARCHITECTURE.md`
- persistence/import/revision → applicable `architecture/` contracts
- security/data-sensitive scope → Security/Data governance

## 4.2 Sprint specification

```text
latest GitHub main / relevant code/tests
→ selected capability/gate record
→ active/new specs packet
→ DEVELOPMENT_RULES.md
→ ENGINEERING_EXECUTION_GOVERNANCE.md
→ only applicable Architecture/Security/Data/Scenario/Migration contracts
```

The packet remains the implementation authority for its scope.

## 4.3 Implementation

```text
AGENTS.md
→ latest main / current branch reality
→ active specs packet
→ DEVELOPMENT_RULES.md
→ only referenced contracts required by the packet
```

Do not reload the full long-term roadmap merely to implement a packet that is already Specified.

## 4.4 Independent QA / release

```text
active specs packet AC/Test Matrix
→ DEVELOPMENT_RULES.md
→ applicable Security/Data/AI governance
→ exact QA-approved revision
→ live GitHub/Vercel/Production evidence
```

Use `CURRENT_STATE.md` only as coordination context, not deployment proof.

## 4.5 Commercial decision

```text
latest Product/Production evidence
→ MONETIZATION_ARCHITECTURE.md
→ ADR-0006 / ADR-0007 as applicable
→ PROGRAM_BOARD.md / RISK_REGISTER.md
→ Gate A evidence only where evaluator quality affects paid value
```

Do not read Team/Enterprise/Marketplace future strategy as current paid-launch scope unless explicitly Selected.

---

# 5. Current end-to-end development flow

The current documents describe one consistent lifecycle:

```text
Product Definition
→ Architecture
→ Dependency / Evidence
→ Gate
→ Smallest Sufficient Sprint
→ Specification / Definition of Ready
→ Implementation
→ Implementation checks
→ Independent QA
→ merge/release exact QA-approved revision
→ Production Evidence
→ Sprint Complete
→ Evidence → Gate Review → Explicit Next Selection
```

Canonical surface handoff remains:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Complete
→ W01 QA Complete
→ C01 merge/release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
→ 01 next Gate / selection
```

This section is a navigation summary only; lifecycle semantics remain defined by the existing authoritative documents.

---

# 6. Documentation maintenance efficiency rule

When changing the development plan:

1. change the document that owns the decision;
2. update an ADR when the decision is durable and ADR-governed;
3. update Program Board / Risk Register / Current State only when the change materially affects their declared scope;
4. update active specs only when current Sprint scope or requirements actually change;
5. run `npm run docs:check` and the normal required engineering checks when the repository change is implementation/release work.

Do not create a new authoritative planning document merely to restate an existing responsibility. Extend the existing owner or create a narrowly scoped contract only when the existing document explicitly cannot own the concern.

---

# 7. What this reorganization intentionally does not do

To preserve all existing content and meaning, this navigation cleanup does **not**:

- delete or merge any authoritative document;
- remove repeated principles or local summaries from existing documents;
- rewrite Roadmap stages;
- change Stage 1 or Stage 1.5 scope;
- change Gate A/B/C/D/E/F or M0 semantics;
- change AI Authority Envelope or mutation scope;
- change Product/Architecture principles;
- change current Sprint status;
- change active `docs/specs/` content;
- change Security/Data governance;
- change the canonical Chat/Codex/Work operating model;
- claim that a snapshot is live Production truth.

The only optimization is making the existing plan easier to traverse without losing information.
