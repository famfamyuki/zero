# AgentGraph Studio — Program Risk Register

Status: **Authoritative cross-stage program risk register**  
Scope: durable Product/Architecture/Evaluation/Security/Repository/Commercial risks affecting sequencing, gates, launch safety, or migration cost. Packet-specific implementation risks remain in the active packet.

## 0. Use rule

This register does not replace live repository/Production checks. Update a risk when probability, impact, trigger, mitigation, or owner materially changes; do not add every small bug.

Re-check this register after material lifecycle, blocker, gate, release, or Production-verification changes. States are `WATCH`, `ACTIVE`, `BLOCKING`, `MITIGATED`, `ACCEPTED`, `CLOSED`. Severity reflects potential impact, not certainty.

---

# 1. Current durable risks

| ID | Risk | Severity | State | Trigger / evidence | Required response |
|---|---|---|---|---|---|
| R-001 | Evaluator semantic quality is insufficient for stronger recommendation authority | Critical | WATCH | Good-workflow false positives, weak recall/prioritization, instability, expert disagreement outside accepted rubric | Gate A/B hardening; do not expand authority envelope |
| R-002 | Model/provider/prompt drift changes evaluator behavior without equivalent quality | High | WATCH | Material evaluator change or benchmark regression | Follow Data & AI Governance; benchmark comparison, versioning, rollback |
| R-003 | Large-workflow evaluation silently degrades or truncates | Critical | WATCH | Size/topology causes context limits, semantic loss, timeouts, incomplete synthesis | No silent truncation; scoped/hierarchical evaluation and explicit limitations |
| R-004 | Missing Intent/Constraints/Scenarios causes context-poor recommendations | High | WATCH | Ambiguity dominates benchmark disagreement or proposal usefulness | Select minimum Stage 1.5 context foundation; preserve Unknown |
| R-005 | Safe Transformation reaches stronger consequential change before capability/human-control semantics exist | Critical | ACTIVE | Planned patch scope exceeds proven architecture-only boundary | Restrict early Stage 3 scope or introduce prerequisite capability/control foundation |
| R-006 | Persisted schema/revision work creates unnecessary Graph/Workflow V2 migration | High | WATCH | Broad persisted rewrite before additive options are exhausted | Apply Semantic Model Evolution triggers; require migration packet/ADR for major version |
| R-007 | Static import executes or overclaims dynamic external-project semantics | Critical | WATCH | Import executes arbitrary code or converts unsupported dynamics into Known facts | Safe static parse; diagnostics/provenance; Unknown/lossiness; security review |
| R-008 | Provider-backed public API is abused or creates runaway cost | High | BLOCKING | Paid controls are implemented but public paid review remains fail-closed and the complete Production path/WAF/operator controls are unverified | Keep paid review disabled until approved configuration and independent W01 verification |
| R-009 | Private workflow/Evidence/scenario/runtime content leaks beyond specified scope | Critical | WATCH | Raw content appears in analytics/logs or provider scope silently expands | Data minimization, allowlists, sanitized logs, provider disclosure/review |
| R-010 | Repository merge policy does not enforce required CI | High | MITIGATED | Live verification showed protected `main` with required `test-typecheck-build`; risk reactivates if enforcement regresses | Continue live verification; reopen if protection/checks are removed or bypassed |
| R-011 | Authoritative documentation grows inconsistent or broken | Medium | MITIGATED | Stage 1 lifecycle drift and the 2026-09-12 legacy Development Governance reference drift showed stale authority references can survive otherwise valid edits | Keep planning reconciliation, `docs:check`, indexed docs, same-change reference updates, and checks that current authorities do not route through compatibility pointers |
| R-012 | Versioned contracts accumulate without retirement/migration lifecycle | High | ACTIVE | Multiple Evidence/API/evaluator/workflow versions with undefined reader/deprecation behavior | Apply `docs/DEVELOPMENT_RULES.md` version lifecycle |
| R-013 | Operational quality remains qualitative indefinitely | Medium | WATCH | Provider-backed traffic exists without baseline/provisional/calibrated targets | Use Development Rules maturity model; establish privacy-safe baselines and targets |
| R-014 | Workspace/history/cloud work creates accidental platform lock-in | High | WATCH | Repeat-use features require proprietary cloud persistence or weaken export/local ownership | Preserve local/project artifact path; separate local/browser/cloud/team trust levels |
| R-015 | Framework expansion precedes capability/lossiness contracts | High | WATCH | Second target is added through target-name conditionals or silent degradation | Gate E; Target Capability → Lossiness → canonical boundaries → minimal IR |
| R-016 | Scenario expectations are mistaken for runtime guarantees | High | WATCH | Declared/static scenario is presented as observed behavioral pass | Preserve static-vs-observed verification states |
| R-017 | Production and GitHub main drift | Critical | WATCH | Production `githubCommitSha` differs from latest `main` during release verification | Do not mark Production Verified; resolve deployment/alias/state mismatch |
| R-018 | Initial paid Architecture Review lacks sufficient recurring professional value | High | WATCH | Weak repeat use/continuation or negative cancellation/refund/support evidence | Use M0 only after Paid Access Production Verified and sufficient real paid evidence |
| R-019 | Paid-plan unit economics exceed planned envelope | High | WATCH | Representative/high-usage cost, failure cost, infra/payment cost, or model drift degrades contribution | Rebaseline; adjust guard/model/quota/price under correct authority; keep budget/kill switch controls |
| R-020 | Billing, entitlement, and quota lifecycle diverge | Critical | WATCH | Stripe state, entitlement read model, quota period/reset, recovery, or idempotency disagree; current Production paid path remains unverified | Fail closed on uncertainty; execute packet-defined controlled Production verification; do not bypass authority to manufacture evidence |
| R-021 | Public paid launch is technically functional but commercially/operationally incomplete | High | BLOCKING | Production is safely disabled and launch prerequisites remain unavailable/unverified | Keep launch blocked until commercial operations prerequisites and fresh W01 verification are satisfied |
| R-022 | Required provider-backed evaluation cannot complete within development API budget | High | MITIGATED | Stage 1 completed required evaluation; risk can reactivate on future evaluator changes or exhausted budget | Preserve bounded diagnostics/full-run budgeting; do not lower gates if reactivated |

---

# 2. Risk-to-gate mapping

| Risk group | Primary gate / contract |
|---|---|
| Evaluator safety/quality/drift | Gate A, Gate B, Evaluation Trust & Scale, Data & AI Governance |
| Large-workflow scale | Gate A, Gate D |
| Context / Scenario quality | Stage 1.5 selection, Scenario Acceptance Contract |
| Semantic mutation authority | Gate B, Gate C, AI Authority Envelope |
| Capability-sensitive mutation | Gate C scope boundary, Security & Reliability, later workflow Security/Policy |
| Migration/versioning | Semantic Model Evolution, Development Rules |
| Import | Import/Workspace Contract, Security/Data review triggers |
| Provider/API operations | Security & Reliability, Data & AI Governance, ADR-0006 |
| Provider evaluation budget / evidence continuity | active packet evaluation gate, Development Rules |
| Paid value / pricing / unit economics | Commercial Validation Gate M0, Monetization Architecture, ADR-0007 |
| Billing lifecycle / commercial operations | Paid Access & Usage Control packet, ADR-0006, ADR-0007, Monetization Architecture |
| Repository/release | Development Rules |
| Planning/current-state consistency | Program Board reconciliation checkpoint, Current State live-state rule |
| Framework expansion | Gate E |
| Collaboration/cloud lock-in | Gate F, Data & AI Governance |

---

# 3. Escalation and closure

Promote a risk to `BLOCKING` when its trigger is observed and the selected packet/gate cannot safely satisfy Acceptance Criteria without resolving or narrowing scope. A blocking risk must be routed through Program Board or the active packet with observed evidence, affected packet/gate, smallest safe response, owner lane, and re-check condition.

For commercial work, a risk may block public paid launch or paid expansion without blocking unrelated deterministic Product operation or independently justified evaluator-quality work. Do not accept a Critical risk merely to preserve a launch date or stage sequence.

A risk is `CLOSED` only when the durable risk no longer applies. A successful control usually moves a recurring risk to `MITIGATED`, not permanently closed. One safe evaluator release, one branch-protection check, one documentation reconciliation, one import adapter, one commercially successful month, or one correct billing lifecycle test does not eliminate the corresponding recurring risk.
