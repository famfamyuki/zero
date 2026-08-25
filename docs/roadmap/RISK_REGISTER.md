# AgentGraph Studio — Program Risk Register

Status: **Authoritative cross-stage program risk register**  
Scope: Durable Product/Architecture/Evaluation/Security/Repository risks that can affect sequencing, gates, or migration cost.  
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
| R-008 | Provider-backed public API is abused or creates runaway cost | High | WATCH | Missing rate limits/body limits/concurrency/timeout, unexpected usage spike | Security baseline controls, explicit invocation, bounded retries, usage monitoring |
| R-009 | Private workflow/Evidence/scenario/runtime content leaks to analytics/logs/providers beyond specified scope | Critical | WATCH | Raw content appears in analytics/logs or provider payload expands silently | Data minimization, allowlists, sanitized logs, provider disclosure/review |
| R-010 | Repository merge policy does not enforce required CI | High | ACTIVE | `main` live settings show no branch/ruleset protection or required status enforcement | Enable Ruleset/Branch Protection; classify as repository governance gap until live-verified |
| R-011 | Authoritative documentation grows inconsistent or broken | Medium | ACTIVE | Broken links, renamed files without index updates, missing required docs, conflicting execution references | `npm run docs:check`, indexed docs, same-change reference updates |
| R-012 | Versioned contracts accumulate without a retirement/migration lifecycle | High | ACTIVE | Multiple Evidence/API/evaluator/workflow versions with undefined reader/deprecation behavior | Apply Engineering Execution Governance version lifecycle |
| R-013 | Operational quality remains qualitative indefinitely | Medium | WATCH | Provider-backed features have production traffic but no baseline/provisional/calibrated targets | Use operational-quality maturity model; establish privacy-safe baselines and calibrated targets |
| R-014 | Workspace/history/cloud work creates accidental platform lock-in | High | WATCH | Repeat-use features require proprietary cloud persistence or weaken export/local ownership | Preserve local/project artifact path; separate local/browser/cloud/team trust levels |
| R-015 | Framework expansion precedes capability/lossiness contracts | High | WATCH | Second target added through framework-name conditionals or silent semantic degradation | Gate E; Target Capability → Lossiness → canonical boundaries → minimal IR |
| R-016 | Scenario expectations are mistaken for runtime guarantees | High | WATCH | UI/evaluator says a declared/static scenario “passes” without actual behavioral/runtime evidence | Scenario/Acceptance verification states; explicit static vs observed distinction |
| R-017 | Production and GitHub main drift | Critical | WATCH | Production `githubCommitSha` differs from latest `main` during release verification | Do not mark Production Verified; resolve deployment/alias/state mismatch |

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
| Provider/API operations | Security & Reliability, Data & AI Governance |
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
Risk ID:
Observed evidence:
Affected packet/gate:
Smallest safe response:
Owner lane:
Re-check condition:
```

Do not “accept” a critical risk merely to keep stage sequencing moving.

---

# 4. Closure rule

A risk is `CLOSED` only when the durable risk no longer applies. A single successful packet normally moves a risk to `MITIGATED`, not permanently closed, when the underlying class can recur.

Examples:

- one safe evaluator model release does not close evaluator drift risk
- enabling branch protection may mitigate repository merge enforcement risk, but future settings changes must still be live-verified
- one safe import adapter does not close arbitrary external import/security risk for all future formats
