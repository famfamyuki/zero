# AgentGraph Studio — Current State Snapshot

Snapshot date: **2026-08-29**
This file is a coordination snapshot, **not** a live deployment registry.

## 0. Live-state rule

Before any implementation, QA, release, roadmap-promotion, commercial-launch, or current-state decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior

Do **not** use a SHA written in this file as proof of current state. Live checks win.

This file intentionally emphasizes the current milestone/status/next gate rather than embedding frequently stale deployment SHAs.

---

# 1. Current Product baseline

Current Production foundation includes:

- Visual Workflow Builder
- workflow templates
- JSON import/export portability
- deterministic CrewAI Python export
- CrewAI Static Import v0 for the supported direct-constructor subset, with mapping diagnostics/provenance and fail-closed Apply
- Unified Preflight
  - Readiness
  - Execution Preview
  - Resource Analysis
- First-Value Preflight activation/measurement foundation

Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

Long-term direction is defined in:

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/roadmap/MASTER_ROADMAP.md`

Cross-stage execution/governance is defined in:

- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- `docs/roadmap/MONETIZATION_ARCHITECTURE.md`
- `docs/SECURITY_RELIABILITY_BASELINE.md`
- `docs/DATA_AND_AI_GOVERNANCE.md`

---

# 2. Current selected work

## Stage 1 — Evidence-Grounded AI Architecture Review v0

Current authoritative Stage 1 packet:

- `docs/specs/AGS-EGAI-AR-V0-P1.md`

Packet document status: **Specified**.

Observed repository implementation work exists on:

- `feat/evidence-grounded-architecture-review-v0`

Therefore the overall Stage 1 Sprint is at least **Implementation Started** until a newer live repository/QA state proves a later lifecycle status.

Do not infer Implementation Complete / QA Complete / Production Verified / Sprint Complete from branch existence alone.

## Stage 1 Production release prerequisite — Paid Access & Usage Control

Authoritative coupled prerequisite packet:

- `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md`

Packet document status: **Specified**.

The provider-backed Architecture Review release remains blocked until this paid-access prerequisite is implemented, independently QA-complete, released, and Production Verified together with the applicable Stage 1 release requirements.

Accepted direction:

- AgentGraph Studio owns the provider credential and provider cost.
- Initial Production access is paid-plan only.
- Unlimited provider-backed review is not approved; a hard user quota is required.
- BYOK is not part of the initial offering.
- Free deterministic Preflight, portability, and deterministic export remain available and AI-independent.
- public price/currency, included quota, cost-guard numeric thresholds, and commercial launch inputs are explicit pre-enable configuration/evidence decisions; C01 must not invent them.

The durable cost/access decision is recorded in `docs/decisions/ADR-0006-paid-access-for-provider-backed-architecture-review.md`.

The durable commercial-validation decision is recorded in `docs/decisions/ADR-0007-commercial-validation-before-paid-expansion.md` and refined by `docs/roadmap/MONETIZATION_ARCHITECTURE.md`.

Current implementation/QA work for this prerequisite is **FAIL-BLOCKED / QA incomplete**. Independent QA verified the additive Supabase migration, RLS/permissions, template-purchase regression, paid consume/release behavior, quota exhaustion, Stripe payment-failure recovery, and expired-token fail-closed behavior, but the required 30-run Stage 1 live evaluation did not meet the packet threshold because structured evaluator results were not sufficiently reliable.

C01 has identified Evidence-to-target grounding as the dominant structured-result failure and has local prompt/schema hardening under development. A follow-up live evaluation showed material improvement but did not reach the required zero-hard-violation threshold; a later confirmation run could not complete after the OpenAI API project credit balance was exhausted. These unmerged changes are **blocked WIP**, not an approved candidate, Implementation Complete, or QA Complete revision.

Current hold decision:

- do not merge or release the provider-backed Architecture Review;
- do not lower the live-evaluation, grounding, or Independent QA gates because evaluation funding is unavailable;
- preserve the packet branch/WIP for later resumption;
- allow 01 to select a separate API-independent packet while this Sprint is held, provided selection follows Product value, dependency, gate, and risk evidence rather than cost avoidance alone;
- implement any newly selected packet on a separate branch/C01 task so the held evaluator work is not mixed with unrelated scope.

Resume condition:

```text
OpenAI evaluation budget available
→ C01 completes the packet 30-run evaluation with zero hard violations and >= 90% semantic rubric
→ new candidate revision
→ W01 full Pass A on that exact revision
→ normal merge/release/Production verification lifecycle
```

Important state distinction:

```text
Paid Access implemented / Production Verified
≠ Initial subscription model commercially validated
```

The initial paid offering remains a commercial-validation phase until Commercial Validation Gate M0 has sufficient real evidence for a scoped decision.

## Completed API-independent Stage 1.5 foundation — CrewAI Static Import v0

Product Architecture decision:

- **Selected:** `CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics`
- durable decision: `docs/decisions/ADR-0009-select-crewai-static-import-v0.md`
- decision class: `FOUNDATION_FIRST`

Authoritative implementation packet:

- `docs/specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md`

Packet document status: **Specified** as the implementation contract.

Lifecycle / post-completion state:

```text
CrewAI Static Import v0 = Sprint Complete / Production Verified
QA Complete = W01 PASS on source revision 634cf507ae55e60122bc59c3e20b4c5abce60bad
Production Verified = W01 Pass B on released main bbc200504877f1b3f48b13945a5ed925214ec572
initial post-completion 01 review = DEFER / no new capability selected
later 01 Product / UX Competitive Research review = HARDEN_FIRST
Additional Stage 1.5 capability = NONE
Stage 2 = NOT SELECTED
AI Authority = UNCHANGED
Mutation Authority = UNCHANGED
```

00 independently reconciled the W01 handoff against live state on 2026-08-29:

- QA-approved source revision and released `main` have the same tree;
- Vercel Production deployment `dpl_7LU4Pub2Estok47cmPP4tosuoJxG` is `READY` and `target=production`;
- Production `githubCommitSha` equals the then-current GitHub `main` SHA;
- the canonical Production domain serves the CrewAI import entry point;
- W01 reports the packet-defined Production smoke PASS with no blocker;
- no relevant Production runtime errors were observed during closure verification.

Available Production telemetry does not provide dedicated CrewAI import success/failure/apply/repeat-use evidence sufficient to infer demand or repeat-use friction; this remains **Unknown / insufficient evidence**, not evidence of no demand.

These identifiers are closure evidence only; the live-state rule above still applies to future decisions.

Product objective:

> A user with a supported existing CrewAI project can reach AgentGraph Studio's current deterministic design/Preflight value without manually rebuilding the workflow first.

Required architecture direction:

```text
Supported existing CrewAI source
→ safe static parse
→ source facts
→ semantic mapping
→ mapping diagnostics / provenance
→ existing GraphData / GraphDocumentV1-compatible projection
→ existing deterministic validation / Unified Preflight / export
```

Specified v0 source boundary:

- one local UTF-8 `.py` workflow-definition source unit;
- CrewAI direct-constructor static subset only;
- browser-local syntax parsing/static mapping;
- supported semantics must map into current `GraphData` / `GraphDocumentV1`;
- mapping diagnostics use explicit `MAPPED`, `MAPPED_WITH_INFERENCE`, `LOSSY`, `UNKNOWN`, `UNSUPPORTED` states;
- only presentation-only inference may remain non-blocking;
- any reachable material `LOSSY`, `UNKNOWN`, or `UNSUPPORTED` mapping blocks Apply;
- mapping report/provenance is session-scoped and is not added to Graph V1 persistence.

Selection/specification boundaries remain:

- no arbitrary imported Python execution;
- no silent lossy conversion;
- no speculative Graph/Workflow V2;
- no Project/Local Workspace persistence in this packet;
- no source write-back/synchronization;
- no generic/multi-framework import;
- no CrewAI Flow, decorator/YAML project, archive/repository, or multi-file import in v0;
- no Architecture Review/evaluator dependency;
- no AI authority expansion;
- no mutation authority expansion.

The completed implementation remains bounded by the specified source contract, static parse boundary, semantic mapping, mapping diagnostics, Known/Inferred/Unknown semantics, lossiness/provenance, import security, UX, migration/compatibility, Acceptance Criteria, tests/fixtures, accessibility/responsive behavior, analytics regression boundary, rollback, and Production verification requirements.

Completion of this packet does not broaden source support, create Graph V2, or expand AI/mutation authority.

## Current API-independent UX hardening — Existing-Capability Product Identity & Review Journey UX Restructuring

Product Architecture / specification state:

```text
Selected work = Existing-Capability Product Identity & Review Journey UX Restructuring
Decision class = HARDEN_FIRST
Specification = Specified
Authoritative packet = docs/specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md
Current lifecycle = 01 Selected → 02 Specified
Next canonical lane = C01 — Current Sprint Implementation
C01 Implementation Started = NO
```

This is bounded existing-capability Product identity / information-architecture / review-journey hardening. It does **not** select a new Product capability, an additional Stage 1.5 capability, or Stage 2.

The packet preserves current domain, persistence, AI/provider, mutation, import-source, and security boundaries. In particular, it does not authorize Project/Workspace/History persistence, GraphDocumentV1/Graph V2 changes, Architecture Review activation, AI-generated improvement proposals, Semantic Patch/Apply, source write-back, Runtime Evidence, generic/multi-framework import, or broader CrewAI import support.

Current coordination state for this packet:

```text
01 selection = complete
02 specification = complete
00 Current State reconciliation = this snapshot
ready for explicit C01 handoff = YES
Implementation Started = NO until C01 explicitly starts from latest main and this packet
```

---

# 3. Current Stage 1 product intent

The milestone adds an evidence-grounded architecture interpretation layer without replacing deterministic Preflight.

Required ordering:

```text
Canonical Workflow
→ deterministic analysis
→ Evidence Contract
→ AI reasoning
→ Architecture Evaluation
```

Current v0 intentionally keeps deterministic Preflight authoritative and AI-independent.

Current v0 also intentionally defers later work including:

- semantic mutation / Apply
- Semantic Patch
- persisted top-level Workflow Intent
- runtime tracing/evidence
- framework-neutral compilation
- collaboration
- marketplace
- broader Stage 1.5 Import/Workspace/History foundation unless separately selected

CrewAI Static Import v0 is separately Production Verified and Sprint Complete under its own deterministic/API-independent Product/Architecture rationale. Its completion does not expand or alter the Stage 1 packet.

Commercial planning does not change these Stage 1 scope boundaries.

---

# 4. Required next gates for Stage 1

Before **Implementation Complete**:

- implementation scope matches `AGS-EGAI-AR-V0-P1` and the coupled paid-access packet where provider-backed release is included
- `npm run docs:check` passes
- `npm test` passes
- `npm run typecheck` passes
- `npm run build` passes
- packet-defined AI/evidence tests and evaluation requirements pass

Before **QA Complete**:

- Independent QA against Acceptance Criteria
- grounding/Unknown/invalidation/failure cases checked
- existing Preflight/import/export/transpiler/analytics regressions checked
- accessibility and stale-result behavior checked as specified
- security/privacy boundaries checked
- paid entitlement/quota/idempotency/billing lifecycle/cost-control requirements independently checked for the provider-backed release

Before **Production Verified** for the provider-backed paid offering, the coupled paid-access prerequisite must satisfy its own packet and commercial release requirements, including commercial-use-eligible hosting verification.

Normal Production verification still requires:

- QA-approved revision released to `main`
- Vercel `READY`
- `target=production`
- Production smoke
- relevant runtime errors checked
- GitHub `main` SHA equals Vercel Production `githubCommitSha`

Gate A is **not reached** while Stage 1 itself has not reached Production Verified. Gate B therefore is also **not reached**, and Stage 2 remains **not selected**.

---

# 5. Roadmap / next selection discipline

Do not mechanically select Stage 2 after Stage 1.

Use:

- `docs/roadmap/EXECUTION_GATES.md`
- `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- `docs/roadmap/MONETIZATION_ARCHITECTURE.md` where paid evidence is relevant

Expected Stage 1 evidence flow remains:

```text
Stage 1 Production evidence
├→ Gate A — Evaluation Trust & Scale
└→ M0 — Commercial Validation when sufficient paid evidence exists
→ select quality / scale / context / repeat-value foundation as justified
→ further Stage 1.5 Adoption & Context Foundation packet(s) only where justified
→ Gate B — Evaluator Authority Expansion
→ Stage 2 Guided Improvement only when evidence supports it
```

Gate A and M0 answer different questions. M0 must not block independently justified evaluator safety/quality hardening while commercial sample size is insufficient.

Current Stage 1.5 / current-selection state:

```text
CrewAI Static Import v0 = Sprint Complete / Production Verified
initial post-completion 01 review = DEFER / no new capability selected
later Product / UX Competitive Research review = HARDEN_FIRST
Selected current work = Existing-Capability Product Identity & Review Journey UX Restructuring
Specification = Specified
Additional Stage 1.5 capability = NONE
Stage 2 = NOT SELECTED
AI Authority = UNCHANGED
Mutation Authority = UNCHANGED

Project / Local Workspace = candidate
Persisted Intent & Constraints = candidate
Review / Locate = candidate
Revision / Evaluation History = candidate
Scenario / Acceptance persistence = conditional foundation
```

The current HARDEN_FIRST packet is existing-capability UX/IA hardening, not a Stage 1.5 capability selection. Do not turn the remaining candidate set into an automatic backlog. Re-evaluate a candidate only when new Product/Production evidence satisfies the corresponding selection trigger.

The held Stage 1 provider-backed release, completed static-import packet, and current UX-hardening packet are separate lifecycle tracks. The current UX-hardening packet does not mark Stage 1 complete, reach Gate A/B, select Stage 2, or promote AI/mutation authority.

---

# 6. Status model

Use:

```text
Selected
→ Specified
→ Implementation Started
→ Implementation Complete
→ QA Complete
→ Production Verified
→ Sprint Complete
```

Roadmap gate/stage promotion and M0 commercial validation are separate Product Architecture decisions from Sprint lifecycle status.

Current explicit lifecycle / coordination states:

- Stage 1 Architecture Review / paid release track: **FAIL-BLOCKED / QA incomplete**
- CrewAI Static Import v0: **Sprint Complete / Production Verified**
- Existing-Capability Product Identity & Review Journey UX Restructuring: **Specified — `01 Selected → 02 Specified`**
- decision class for current UX hardening: **HARDEN_FIRST**
- authoritative packet: `docs/specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md`
- next canonical lane for current UX hardening: **C01 — Current Sprint Implementation**
- C01 implementation state for current UX hardening: **not started**
- Additional Stage 1.5 capability: **none**
- Gate A: **not reached** because Stage 1 is not Production Verified
- Gate B: **not reached**
- Stage 2: **not selected**
- AI Authority: **unchanged**
- Mutation Authority: **unchanged**

Current next action:

```text
Existing-Capability Product Identity & Review Journey UX Restructuring
→ 00 Current State reconciled
→ ready for explicit C01 handoff
→ C01 starts only after re-checking latest main and reading the complete Specified packet

Held Stage 1 Architecture Review remains separate:
OpenAI evaluation budget available
→ resume that existing held track under its unchanged resume condition
```

No new Product priority or authority expansion is implied by this coordination state.

---

# 7. Current development operating model

The project is currently in **development-only focus mode**. Marketing/SNS/Growth/Analytics work is not maintained as permanent development lanes.

Canonical persistent lanes are exactly:

```text
Chat:
00  Program Control & Current State
01  Product Architecture & Roadmap
02  UX & Implementation Specification

Codex:
C01 Current Sprint Implementation

Work:
W01 Independent QA & Production Verification
```

Default lifecycle handoff:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started / Implementation Complete
→ W01 independent QA / QA Complete
→ C01 merge/release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
→ 01 next Gate / selection
```

There is no permanent canonical W00/03/04/05/06 lane in development-only focus mode.

- Work mode may be used by 00/01/02 for complex repository/document work without creating a W00 authority.
- Pure release/current-state coordination belongs to 00.
- normal QA-approved merge/release belongs to C01.
- independent Production verification belongs to W01.
- Product/commercial gate decisions including M0 remain 01 Product Architecture decisions; temporary analytics/research work does not create a permanent analytics lane.
- if code/behavior changes after QA Complete, the QA approval is stale and must be repeated before release.

Authoritative role details are in `docs/CHAT_ROLE_REGISTRY.md` and `docs/decisions/ADR-0005-minimal-development-only-operating-model.md`.

---

# 8. Coordination / reading rule

All development surfaces should read repository documents instead of relying on a prior conversation's remembered state.

Recommended baseline reading order:

1. `AGENTS.md`
2. `docs/PRODUCT_MASTER.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DEVELOPMENT_RULES.md`
5. `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`
6. `docs/roadmap/MASTER_ROADMAP.md`
7. `docs/roadmap/EXECUTION_GATES.md`
8. relevant cross-stage security/data/evaluation/import/commercial contracts
9. this snapshot
10. active packet under `docs/specs/`

For current Sprint implementation details, the active packet remains authoritative even when long-term or commercial documents describe later architecture.