# AgentGraph Studio — Program Risk Register

Status: **Authoritative cross-stage program risk register**  
Scope: Durable Product/Architecture/Evaluation/Security/Repository/Commercial risks that can affect sequencing, gates, launch safety, or migration cost.  
Packet-specific implementation risks remain in the active packet.

## 0. Use rule

This register is not a substitute for live repository/Production checks.

Update a risk when its probability, impact, trigger, mitigation, or owner lane materially changes. Do not add every small bug here.

Risk states:

- `WATCH`
- `ACTIVE`
- `BLOCKING`
- `MITIGATED`
- `ACCEPTED`
- `CLOSED`

Risk severity reflects potential program impact, not certainty.

---

# 1. Current durable risks

| ID | Risk | Severity | Current state | Trigger / evidence | Required response |
|---|---|---|---|---|---|
| R-001 | Evaluator semantic quality is insufficient for stronger recommendation authority | Critical | WATCH | Good-workflow false positives, weak issue recall/prioritization, instability, expert disagreement outside accepted rubric | Gate A/B hardening; do not expand authority envelope |
| R-002 | Model/provider/prompt drift changes evaluator behavior without equivalent quality | High | WATCH | Material evaluator change or benchmark regression | Follow Data & AI Governance; benchmark comparison, versioning, rollback |
| R-003 | Large-workflow evaluation silently degrades or truncates | Critical | WATCH | Size/topology tier causes context limits, semantic quality loss, timeouts, incomplete synthesis | No silent truncation; scoped/hierarchical evaluation and explicit limitations |
| R-004 | Missing declared Intent/Constraints/Scenarios causes confident but context-poor recommendations | High | WATCH | Ambiguity dominates benchmark disagreements or proposal usefulness | Select minimal Stage 1.5 context foundation; preserve Unknown |
| R-005 | Safe Transformation reaches side-effect-sensitive changes before capability/human-control semantics exist | Critical | ACTIVE | Planned patch scope includes tool binding, external mutation, credential/sensitive-data, approval/policy changes without structured capability evidence | Restrict early Stage 3 to approved architecture-only mutation scope or introduce prerequisite capability/control foundation |
| R-006 | Persisted schema/revision work creates an unnecessary Graph/Workflow V2 migration | High | WATCH | New feature attempts broad persisted rewrite without additive-contract exhaustion | Apply Semantic Model Evolution triggers; require migration packet/ADR for major version |
| R-007 | Static import executes or overclaims dynamic external project semantics | Critical | WATCH | Import implementation evaluates arbitrary code or converts unsupported dynamics into Known semantics | Safe static parse; diagnostics/provenance; Unknown/lossiness; security review |
| R-008 | Provider-backed public API is abused or creates runaway cost | High | BLOCKING | Architecture Review uses an operator-funded provider credential and currently lacks paid entitlement plus a server-enforced user quota | Keep provider-backed review unreleased; implement `ADR-0006` through a dedicated paid-access packet; retain WAF, provider budget/alerts, usage monitoring, and kill switch as defense in depth |
| R-009 | Private workflow/Evidence/scenario/runtime content leaks to analytics/logs/providers beyond specified scope | Critical | WATCH | Raw content appears in analytics/logs or provider payload expands silently | Data minimization, allowlists, sanitized logs, provider disclosure/review |
| R-010 | Repository merge policy does not enforce required CI | High | MITIGATED | Live verification on 2026-08-26 showed `main` Branch Protection enabled with required `test-typecheck-build` status. Risk reactivates if protection/required checks are removed or bypassed. | Continue live verification through the canonical lifecycle: current-state/release coordination in 00, normal QA-approved merge/release in C01, independent Production verification in W01; re-open as ACTIVE/BLOCKING if enforcement regresses |
| R-011 | Authoritative documentation grows inconsistent or broken | Medium | ACTIVE | Broken links, renamed files without index updates, missing required docs, conflicting execution references | `npm run docs:check`, indexed docs, same-change reference updates, operating-model ADRs for authority changes |
| R-012 | Versioned contracts accumulate without a retirement/migration lifecycle | High | ACTIVE | Multiple Evidence/API/evaluator/workflow versions with undefined reader/deprecation behavior | Apply Engineering Execution Governance version lifecycle |
| R-013 | Operational quality remains qualitative indefinitely | Medium | WATCH | Provider-backed features have production traffic but no baseline/provisional/calibrated targets | Use operational-quality maturity model; establish privacy-safe baselines and calibrated targets |
| R-014 | Workspace/history/cloud work creates accidental platform lock-in | High | WATCH | Repeat-use features require proprietary cloud persistence or weaken export/local ownership | Preserve local/project artifact path; separate local/browser/cloud/team trust levels |
| R-015 | Framework expansion precedes capability/lossiness contracts | High | WATCH | Second target added through framework-name conditionals or silent semantic degradation | Gate E; Target Capability → Lossiness → canonical boundaries → minimal IR |
| R-016 | Scenario expectations are mistaken for runtime guarantees | High | WATCH | UI/evaluator says a declared/static scenario “passes” without actual behavioral/runtime evidence | Scenario/Acceptance verification states; explicit static vs observed distinction |
| R-017 | Production and GitHub main drift | Critical | WATCH | Production `githubCommitSha` differs from latest `main` during release verification | Do not mark Production Verified; resolve deployment/alias/state mismatch |
| R-018 | Initial paid Architecture Review does not provide sufficient recurring professional value | High | WATCH | Paid users complete an initial review but repeat review/subscription continuation is weak, cancellation/refund/support feedback indicates one-shot value, or users do not meaningfully inspect review evidence/targets | Use M0; do not declare the subscription model validated; identify the measured constraint and select at most the smallest justified repeat-value foundation |
| R-019 | Paid plan unit economics degrade because provider/failure/high-usage costs exceed the planned envelope | High | WATCH | Successful or failed review cost distributions, high-workflow-size usage, payment/infrastructure cost, or model/provider drift makes representative or high-usage contribution unacceptable | Rebaseline cost; adjust request guard/model/quota/price; do not use average cost alone; keep provider budget/kill switch active |
| R-020 | Billing, entitlement, and quota lifecycle diverge and cause incorrect paid access or credit accounting | Critical | WATCH | Stripe state, entitlement read model, quota period/reset, cancellation/past-due behavior, reservation recovery, or idempotency disagree under retries/concurrency/degraded sync | Paid-access packet must define authoritative state transitions, reconciliation, idempotency, failure recovery, and Independent QA; fail closed where entitlement is uncertain without corrupting deterministic free features |
| R-021 | Public paid launch is technically functional but commercially/operationally incomplete | High | WATCH | Missing commercial-use hosting eligibility, unclear cancellation/refund/payment-failure behavior, missing billing support path, unresolved tax/terms/privacy/provider disclosure, or Production still presents contradictory “100% Free” messaging | Treat as `COMMERCIAL_BLOCKER` for public paid launch; satisfy the minimum Commercial Operations launch gate in `MONETIZATION_ARCHITECTURE.md` without expanding into speculative enterprise scope |

---

# 2. Risk-to-gate mapping

| Risk group | Primary gate / contract |
|---|---|
| Evaluator safety/quality/drift | Gate A, Gate B, Evaluation Trust & Scale, Data & AI Governance |
| Large-workflow scale | Gate A, Gate D |
| Context / Scenario quality | Stage 1.5 selection, Scenario & Acceptance Contract |
| Semantic mutation authority | Gate B, Gate C, AI Authority Envelope |
| Capability/security-sensitive mutation | Gate C scope boundary, Security & Reliability, later Workflow Security/Policy |
| Migration/versioning | Semantic Model Evolution, Engineering Execution Governance |
| Import | Import/Workspace Contract, Security/Data review triggers |
| Provider/API operations | Security & Reliability, Data & AI Governance, ADR-0006 |
| Paid value / pricing / unit economics / paid expansion | Commercial Validation Gate M0, Monetization Architecture, ADR-0007 |
| Billing lifecycle / commercial operations | Paid Access & Usage Control packet, ADR-0006, ADR-0007, Monetization Architecture |
| Repository/release | Development Rules, Engineering Execution Governance |
| Framework expansion | Gate E |
| Collaboration/cloud lock-in | Gate F, Data & AI Governance |

---

# 3. Escalation rule

Promote a risk to `BLOCKING` when:

- its trigger condition is observed, and
- the selected packet/gate cannot satisfy its Acceptance Criteria safely without resolving or narrowing the scope.

A blocking risk must appear in `roadmap/PROGRAM_BOARD.md` or the active packet handoff with:

```text
Blocker / Risk ID:
Observed evidence:
Affected packet/gate:
Smallest safe response:
Owner lane:
Re-check condition:
```

For commercial work, a risk may block **public paid launch or paid expansion** without blocking unrelated deterministic product operation or independently justified evaluator-quality work.

Do not “accept” a critical risk merely to keep stage sequencing or a launch date moving.

---

# 4. Closure rule

A risk is `CLOSED` only when the durable risk no longer applies. A successful packet/control normally moves a recurring risk to `MITIGATED`, not permanently `CLOSED`.

Examples:

- one safe evaluator model release does not close evaluator drift risk;
- enabling branch protection mitigates repository merge enforcement risk, but future settings changes must still be live-verified;
- one safe import adapter does not close arbitrary external import/security risk for all future formats;
- one commercially successful month does not permanently close recurring-value or unit-economics risk;
- one correct Stripe webhook test does not close subscription/entitlement reconciliation risk.
