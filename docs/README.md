# AgentGraph Studio Development Documentation

Status: **Navigation and authority index**

Scope: Find the governing document for a decision, the applicable packet, and supporting evidence. This index does not select work or redefine the linked contracts.

<a id="read-first"></a>

## Start here

1. Check latest GitHub `main` and the working branch/PR; inspect relevant code/tests. Check latest Vercel Production and actual behavior when relevant to the decision.
2. Read each document's Status / Scope / authority declaration. Use the task paths below to select the necessary authorities.
3. For selected work, locate the next action in [Program Board](./roadmap/PROGRAM_BOARD.md) and read the complete applicable packets in the [packet map](#packet-map).

A filename, `Status: Specified`, old SHA, or open PR does not prove that work is currently active or that Production matches it. [Current State](./CURRENT_STATE.md) is a dated snapshot, not a live deployment registry.

## Source-of-truth hierarchy

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

Durable direction does not automatically expand an active packet. Observed behavior establishes what exists; it does not silently approve a deviation from a contract. Report a genuine contradiction to its owner.

<a id="roadmap-execution--promotion"></a>
<a id="definition-of-ready--traceability--versioning"></a>
<a id="architecture-migration--scenario--security--data"></a>

## Decision owners

| Question | Authoritative document | Read for |
|---|---|---|
| What is the product and final user value? | [Product Master](./PRODUCT_MASTER.md) | North Star, principles, final capabilities, boundaries, completion standard |
| What owns semantics and how does architecture evolve? | [Architecture](./ARCHITECTURE.md) | domain boundaries, deterministic/AI ownership, source/build/runtime separation |
| How do we implement, protect regressions, QA, and release? | [Development Rules](./DEVELOPMENT_RULES.md) | engineering, Git, verification, lifecycle, reporting |
| Is a packet ready; how do contracts and evidence evolve? | [Engineering Execution Governance](./ENGINEERING_EXECUTION_GOVERNANCE.md) | Definition of Ready, version lifecycle, traceability, quality maturity, repository/docs enforcement |
| Who decides or performs the next action? | [Role Registry](./CHAT_ROLE_REGISTRY.md) | 00 / 01 / 02 / C01 / W01, handoffs, legacy aliases, session policy |
| What depends on what in the long term? | [Master Roadmap](./roadmap/MASTER_ROADMAP.md) | stages, dependency sequence, planned/conditional scope |
| Can a stage or AI/mutation authority advance? | [Execution Gates](./roadmap/EXECUTION_GATES.md) | Gate A–F, Stage 1.5 selection, AE0–AE6, mutation scope |
| What is selected, blocked, and next? | [Program Board](./roadmap/PROGRAM_BOARD.md) | near-term execution order, blockers, next owner |
| Which durable risks apply? | [Risk Register](./roadmap/RISK_REGISTER.md) | stable risk IDs, triggers, mitigation/escalation/closure |
| Where is the project at the last reconciliation? | [Current State](./CURRENT_STATE.md) | dated lifecycle summary and scoped release evidence |
| How is evaluator trust and scale measured? | [Evaluation Trust & Scale](./roadmap/EVALUATION_TRUST_AND_SCALE.md) | safety/quality, gold sets, stability, size tiers, scoped review/navigation |
| What is the strategic position and final product shell? | [Product Platform & Commercial Strategy](./roadmap/PRODUCT_PLATFORM_AND_COMMERCIAL_STRATEGY.md) | adoption wedge, recurring loop, final IA/mobile/chrome, moat, conditional value ladder |
| What governs paid value and launch? | [Monetization Architecture](./roadmap/MONETIZATION_ARCHITECTURE.md) | free/paid boundary, price/quota evidence, unit economics, M0, commercial operations |
| What protects the platform? | [Security & Reliability](./SECURITY_RELIABILITY_BASELINE.md) | secrets, untrusted inputs, abuse, observability, incidents, rollback |
| What may be stored or sent to providers? | [Data & AI Governance](./DATA_AND_AI_GOVERNANCE.md) | data classes, retention/export/deletion, analytics, provider disclosure, evaluator changes |
| When can the persisted model change? | [Semantic Model Evolution](./architecture/SEMANTIC_MODEL_EVOLUTION.md) | additive-first migration, fingerprints, legacy compatibility, V2 trigger |
| How do import, Workspace, and revision relate? | [Import / Workspace Contract](./architecture/IMPORT_WORKSPACE_CONTRACT.md) | static mapping/lossiness, provenance, identity, local/browser/cloud boundaries |
| How do expectations relate to observations? | [Scenario / Acceptance Contract](./architecture/SCENARIO_ACCEPTANCE_CONTRACT.md) | configured expectations, static support, later behavioral/runtime verification |
| Why was a durable decision made? | [Decision Records](./decisions/README.md) | ADR index, accepted/superseded decisions, decision template |
| How is the selected paid launch verified operationally? | [Paid Launch Runbook](./runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md) | external readiness, WAF/budget/kill switch, controlled financial QA / PAUC AC-30 |

Product Strategy owns strategic rationale and final UX detail; Monetization owns commercial contracts, Master Roadmap owns stage order, and Execution Gates owns promotion/authority. Development Rules and Engineering Execution Governance keep their existing complementary scopes; a routing summary is not a second rule definition.

<a id="development-operating-model"></a>
<a id="canonical-lanes"></a>
<a id="lifecycle--handoff"></a>
<a id="why-w00-is-not-permanent"></a>
<a id="context-length--replacement-policy"></a>
<a id="codex-entrypoint"></a>

## Task-specific reading paths

Use these after checking current repository reality. Add specialized contracts only when the change touches their scope.

| Task / lane | Minimum useful path |
|---|---|
| Reconcile or close a Sprint — 00 | Role Registry → Program Board → applicable packet and independent QA/Production evidence → Current State / affected risks |
| Product, architecture, next selection — 01 | Product Master → Architecture → Master Roadmap / Execution Gates → Program Board / relevant risks and evidence |
| Specify selected work — 02 | selected decision → applicable Product/Architecture boundaries → full Definition of Ready → coupled packet(s) → relevant security/data/migration contracts |
| Implement — C01 | Development Rules / Definition of Ready → complete active and coupled packets → relevant code/tests → applicable contracts |
| Independent QA — W01 Pass A | Role Registry / Development Rules → complete applicable packets and test matrix → exact candidate diff → independent evidence |
| Release / verify — C01 then W01 Pass B | QA-approved revision → live CI/protection → packet release conditions/runbook → exact main/Production identity and actual smoke/runtime evidence |
| Docs maintenance | this index → affected authorities and references → preservation/review requirements below |

Normal handoff is `01 → 02 → C01 → W01 Pass A → C01 release → W01 Pass B → 00 → 01`.
Implementation self-test ≠ Independent QA; release execution ≠ Production Verified; Sprint Complete ≠ automatic Stage promotion. Work-mode document tasks retain their owning 00/01/02 authority; they do not create W00. See the Role Registry for complete rules and short role activation messages.

<a id="current-packet"></a>

## Packet map

This table describes contract relationships. Current lifecycle/next action is owned by Program Board; `Specified` in a packet header records specification readiness, not whether implementation remains to be done.

| Packet | Scope and relationship | When to read |
|---|---|---|
| [Architecture Review](./specs/AGS-EGAI-AR-V0-P1.md) | Stage 1 evidence, evaluator, structured result, explicit invocation, stale behavior, 30-review release evaluation | Review/evidence/evaluator work; always couple public provider access with PAUC |
| [Paid Access & Usage Control](./specs/AGS-EGAI-AR-PAUC-V0-P1.md) | Adds Auth, Stripe, entitlement, quota, idempotency, cost guard and live AC-30 to Architecture Review | Current paid-launch work and billing/provider regressions |
| [Commercial Policy UX](./specs/AGS-EGAI-AR-COMMERCIAL-POLICY-UX-V0-P1.md) | Narrow PAUC amendment: exact EN/JA policy copy, offer/link states, external approval requirements | Paid presentation and launch, together with PAUC and the runbook |
| [CrewAI Static Import](./specs/AGS-CREWAI-STATIC-IMPORT-V0-P1.md) | Released deterministic supported subset, mapping diagnostics, explicit import replacement, session-only provenance | Import maintenance/regression; old Stage 1 hold is selection-time context |
| [Product Identity & Review Journey UX](./specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md) | Released Overview / Design / Preflight shell, Locate-return, mobile/accessibility presentation | Shell/navigation/regression; its no-AI scope applies to that UX change, not a prohibition on the separately selected Stage 1 packet |

The UX packet controls the released full-surface shell/Locate journey; the Architecture Review packet controls its additive AI tab/result behavior, and PAUC plus Commercial Policy UX control paid access/presentation. Preserve each unchanged domain contract. Do not revive old overlay layouts, held-stage statuses, or original branch startup instructions merely because they appear in an earlier packet. An unresolved cross-packet behavior conflict still requires an explicit specification decision.

## Evidence and historical material

These documents support decisions; they do not independently select work or prove live state.

| Material | Use and limit |
|---|---|
| [Commercial Calibration Evidence, 2026-09-05](./research/COMMERCIAL_CALIBRATION_EVIDENCE_2026-09-05.md) | Historical 30-call successful-cost sample; partial cost evidence, not Production P95 or WTP |
| [Formal evaluation usage JSON](./research/architecture-review-formal-eval-2026-09-05.json) | Privacy-safe synthetic fixture usage rows; reproducible with `npm run commercial:calibrate -- --report docs/research/architecture-review-formal-eval-2026-09-05.json` |
| [Commercial Input Closure Plan, 2026-09-05](./research/COMMERCIAL_INPUT_CLOSURE_PLAN_2026-09-05.md) | Superseded sequencing note; not the current next action |
| [Competitive Product Research, 2026-08-29](./research/COMPETITIVE_PRODUCT_RESEARCH_2026-08-29.md) | Dated research/proposals; not selection or current competitor/Production facts |
| [PostHog repair report, 2026-08-20](../POSTHOG_ANALYTICS_REPORT.md) | Historical incident evidence; current analytics code/tests and Data Governance control behavior |

The [ADR index](./decisions/README.md) covers all decision records. Root [README](../README.md) is the product/development entry and [AGENTS.md](../AGENTS.md) is the contributor instruction entry.

Open or historical PRs are proposals until integrated through the repository lifecycle. Check their current diffs/status before reuse; never copy an old whole-file replacement over newer main. At the 2026-09-07 audit baseline, the earlier docs consolidation proposal [PR #13](https://github.com/famfamyuki/zero/pull/13) and usability/drafting proposal [PR #15](https://github.com/famfamyuki/zero/pull/15) are not additional main authorities. ADR-0008 and the alternative R-022 in the latter must not be treated as accepted main records; resolve identifiers against current main before integration.

<a id="repository-enforcement"></a>

## Documentation maintenance and verification

Maintain meaning: Product intent, architecture/data/security boundaries, Stage dependencies, gate and AI/mutation authority, compatibility, ACs, regression constraints, QA/Production requirements, and Included / Deferred / Conditional / Out of Scope.

- Keep one owner per decision. Link to complete rules instead of repeating checklists in navigation or coordination docs.
- Retain packet IDs, AC identifiers, historical evidence, and existing document paths/anchors when removing prose duplication; update affected references in the same change.
- Mark historical assertions with their baseline. Do not rewrite an accepted ADR or a measured result as though later facts had already been known.
- Fix documentary gaps from existing main evidence. New Product policy, scope, authority, or verification semantics require the owning decision process.
- Update Program Board / Current State / affected risks only when lifecycle, blockers, gates, selection, or release meaning changes; do not copy every transient SHA/CI result into them.

Normal verification is `npm ci → npm run docs:check → npm test → npm run typecheck → npm run build`, plus packet-defined evaluation where applicable. Documentation-only work does not waive required checks or independent QA/release ownership.

`docs:check` currently checks required paths, local links in this index, packet-directory presence, lifecycle/command vocabulary, and CI-file presence. It does not validate every Markdown anchor, cross-packet meaning, actual branch protection, or Production behavior. Review those explicitly when affected; do not report this check as proof of semantic equivalence or Production Verification.
