# AgentGraph Studio Development Documentation

This directory is the durable development knowledge base for Chat, Work, Codex, and human contributors.

The documentation is organized by **decision ownership**, not by a requirement to read every file for every task.

## 1. Global source-of-truth hierarchy

Use this hierarchy when sources disagree:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ Product Master
→ Architecture
→ Development Governance / cross-cutting security-data contracts
→ Master Roadmap
→ Execution Gates
→ relevant specialized plan/contract
→ Program Board / Risk Register
→ Current State snapshot
→ historical ADR context / Chat / Work / Codex / old SHAs
```

A long-term document never expands the active Sprint by implication.

---

# 2. Core authority documents

| Responsibility | Authority |
|---|---|
| Final Product definition, strategy, North Star, adoption wedge, moat, value ladder, durable Product principles | [`PRODUCT_MASTER.md`](./PRODUCT_MASTER.md) |
| Durable architecture and evolution boundaries | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Engineering, Definition of Ready, implementation, QA, CI, release, versioning, traceability | [`DEVELOPMENT_RULES.md`](./DEVELOPMENT_RULES.md) |
| Chat / Codex / Work role ownership | [`CHAT_ROLE_REGISTRY.md`](./CHAT_ROLE_REGISTRY.md) |
| Long-term Stage sequence and dependency order | [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md) |
| Stage promotion, AI Authority Envelope, mutation scope, Gate A–F | [`roadmap/EXECUTION_GATES.md`](./roadmap/EXECUTION_GATES.md) |
| Current near-term execution coordination | [`roadmap/PROGRAM_BOARD.md`](./roadmap/PROGRAM_BOARD.md) |
| Durable cross-stage risks/blockers | [`roadmap/RISK_REGISTER.md`](./roadmap/RISK_REGISTER.md) |
| Current coordination snapshot | [`CURRENT_STATE.md`](./CURRENT_STATE.md) |
| Exact current Sprint implementation contract | [`specs/`](./specs/) |
| Durable decision history/rationale | [`decisions/`](./decisions/) |

Compatibility pointers retained for old links, not as separate authority sources:

- [`ENGINEERING_EXECUTION_GOVERNANCE.md`](./ENGINEERING_EXECUTION_GOVERNANCE.md) → consolidated into `DEVELOPMENT_RULES.md`
- [`roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md`](./roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md) → durable Product strategy consolidated into `PRODUCT_MASTER.md`; detailed commercial architecture remains in `MONETIZATION_ARCHITECTURE.md`

---

# 3. Specialized documents — read only when the question requires them

## Evaluation / AI trust / scale

- [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) — benchmark quality, gold-set direction, stability, large-workflow evaluation scale, Search/Locate/Scoped Evaluation
- [`DATA_AND_AI_GOVERNANCE.md`](./DATA_AND_AI_GOVERNANCE.md) — provider/data boundaries, evaluator/model/prompt change governance

## Commercial / monetization

- [`roadmap/MONETIZATION_ARCHITECTURE.md`](./roadmap/MONETIZATION_ARCHITECTURE.md) — free/paid value contract, pricing/quota evidence, unit economics, paid-launch readiness, Commercial Validation Gate M0

## Security / reliability

- [`SECURITY_RELIABILITY_BASELINE.md`](./SECURITY_RELIABILITY_BASELINE.md) — AgentGraph platform security/reliability baseline

## Semantic model / import / persistence / expectations

- [`architecture/SEMANTIC_MODEL_EVOLUTION.md`](./architecture/SEMANTIC_MODEL_EVOLUTION.md) — persisted semantic-model evolution and major-version triggers
- [`architecture/IMPORT_WORKSPACE_CONTRACT.md`](./architecture/IMPORT_WORKSPACE_CONTRACT.md) — static import, mapping/provenance, Workspace/Project/revision-compatible foundations
- [`architecture/SCENARIO_ACCEPTANCE_CONTRACT.md`](./architecture/SCENARIO_ACCEPTANCE_CONTRACT.md) — designed expectations and static/runtime verification boundary

Preserve:

```text
Configured expectation
≠ Static evidence of support
≠ Observed runtime behavior
```

---

# 4. Smallest sufficient reading paths

Do not load the entire documentation set by default.

## Product / roadmap selection or Gate review

```text
latest GitHub main / Production reality
→ active packet + current evidence
→ PRODUCT_MASTER.md
→ MASTER_ROADMAP.md
→ EXECUTION_GATES.md
→ PROGRAM_BOARD.md / RISK_REGISTER.md
→ only the specialized plan/contract implicated by the decision
```

Examples:

- evaluator quality/scale → `EVALUATION_TRUST_AND_SCALE.md`
- paid value/economics → `MONETIZATION_ARCHITECTURE.md`
- persistence/import/revision → applicable `architecture/` contract
- security/data-sensitive scope → Security/Data governance

## Sprint specification

```text
latest repository reality
→ Selected capability / Gate record
→ PRODUCT_MASTER / ARCHITECTURE only where the packet changes those contracts
→ DEVELOPMENT_RULES.md
→ applicable specialized contracts
→ new/active specs packet
```

The packet must satisfy Definition of Ready before implementation.

## Implementation

```text
AGENTS.md
→ latest main/current branch reality
→ active specs packet
→ DEVELOPMENT_RULES.md
→ only packet-referenced contracts
```

Do not re-read the entire long-term roadmap merely to implement an already-Specified packet.

## Independent QA / release

```text
active packet AC/Test Matrix
→ DEVELOPMENT_RULES.md
→ applicable Security/Data/AI contracts
→ exact QA-approved revision
→ live GitHub/Vercel/Production evidence
```

## Commercial decision / M0

```text
latest Product/Production evidence
→ MONETIZATION_ARCHITECTURE.md
→ ADR-0006 / ADR-0007 as applicable
→ PROGRAM_BOARD.md / RISK_REGISTER.md
→ Gate A evidence only where evaluator quality affects paid value
```

Long-term Team/Enterprise/Marketplace value boundaries live in `PRODUCT_MASTER.md`; they are not current implementation scope unless explicitly Selected.

---

# 5. Canonical development lifecycle

The authoritative lifecycle is defined in `DEVELOPMENT_RULES.md`; role ownership is defined in `CHAT_ROLE_REGISTRY.md`.

Current handoff:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started / Implementation Complete
→ W01 Independent QA / QA Complete
→ C01 merge + release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
→ 01 Evidence → Gate Review → Explicit Next Selection
```

Important boundaries:

- implementation self-test ≠ Independent QA
- release execution ≠ Production Verified
- code/behavior change after QA Complete invalidates that QA approval
- Sprint Complete ≠ automatic roadmap promotion
- M0 commercial validation ≠ AI authority expansion

The current project remains in **development-only focus mode**. Canonical persistent lanes are `00`, `01`, `02`, `C01`, and `W01`; details and replacement policy live only in `CHAT_ROLE_REGISTRY.md`.

---

# 6. Roadmap execution discipline

Use:

```text
Evidence
→ Gate Review
→ Explicit Next Selection
```

Stage 1.5 is a selection band, not a mandatory backlog. Select only the smallest coherent packet justified by current evidence.

AI authority is capability-scoped. Mutation authority is separately gated. Commercial Validation Gate M0 is evidence-driven and does not automatically select paid expansion or stronger AI authority.

---

# 7. Repository verification

Normal repository verification is:

```text
npm ci
→ npm run docs:check
→ npm test
→ npm run typecheck
→ npm run build
```

Branch Protection / Rulesets should require the `test-typecheck-build` check for normal merges where supported. Live repository settings must be verified rather than inferred from documentation.

Before Production Verified, preserve:

```text
GitHub main SHA = Vercel Production githubCommitSha
```

---

# 8. Documentation maintenance rule

When a decision changes:

1. update the document that semantically owns the decision;
2. add/update an ADR only when durable rationale/history is required;
3. update Program Board, Risk Register, or Current State only when their declared current coordination/risk scope changes;
4. update an active packet only when current Sprint scope/requirements change;
5. update references in the same change;
6. do not create another authoritative document merely to restate an existing owner.

`AGENTS.md` should remain a compact contributor/routing entrypoint, not a duplicate Product Master.
