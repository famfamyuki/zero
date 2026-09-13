# AgentGraph Studio — Program Board

Status: **Authoritative near-term execution coordination**  
Scope: Current lifecycle state, active blocker, current execution sequence, and next lane/action.  
This board intentionally does **not** duplicate long-term roadmap content, completed packet detail, detailed release history, or durable risk definitions.

## 0. Live-state rule

Before using this board for a decision, re-check:

1. latest GitHub `main`
2. latest Vercel Production deployment
3. actual Production behavior where relevant
4. the authoritative packet under `docs/specs/` for selected/current work

Live repository/Production reality wins over copied SHAs or historical chat state.

Document ownership:

- Product definition → `docs/PRODUCT_MASTER.md`
- Architecture → `docs/ARCHITECTURE.md`
- long-term stage sequence → `docs/roadmap/MASTER_ROADMAP.md`
- promotion / AI authority / mutation authority → `docs/roadmap/EXECUTION_GATES.md`
- evaluation trust / scale direction → `docs/roadmap/EVALUATION_TRUST_AND_SCALE.md`
- commercial value/pricing evidence/launch contract → `docs/roadmap/MONETIZATION_ARCHITECTURE.md`
- packet scope / AC / implementation contract → `docs/specs/`
- durable risks → `docs/roadmap/RISK_REGISTER.md`
- concise current snapshot → `docs/CURRENT_STATE.md`
- this board → near-term execution order, blocker ownership, and next handoff

---

# 1. Current program state

The bounded Astra packet is complete:

```text
AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1
= SPRINT COMPLETE / PRODUCTION VERIFIED
= W01 PASS WITH NOTES
```

The Stage 1 Architecture Review / Paid Access commercial lifecycle remains open, but commercial activation is no longer the current Product-development priority.

Stakeholder priority accepted by `01` on 2026-09-13:

```text
Stage 1 Paid Access lifecycle
= OPEN

Commercial activation
= DEFERRED

Production paid Architecture Review
= DISABLED / FAIL-CLOSED

Activation safety contract
= PRESERVED / NOT RELAXED
```

This means Stripe Live, commercial hosting eligibility, QA containment, first-Live windows, and PAUC AC-30 are not executed now. It does **not** cancel them, mark them complete, or weaken their prerequisites.

Current authority state:

```text
PAUC AC-30
= NOT COMPLETE

Paid Access Production Verified
= NO

Commercial Sprint Complete
= NO

Commercial Validation Gate M0
= NOT REACHED

Gate A
= NOT REACHED

Gate B
= NOT REACHED

Stage 2
= NOT SELECTED

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED
```

## Explicit Next Selection — 2026-09-13

`01` reviewed current Product value, architecture dependencies, evaluator evidence, Gate requirements, and durable risks under the new commercial-priority direction.

Decision:

```text
AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1
= SELECTED

Capability
= Architecture Review Evaluation Trust Foundation v0
= Gold Dataset + Quality Metrics

Next owner
= 02 — UX & Implementation Specification
```

Decision authority:

`docs/decisions/ADR-0012-select-architecture-review-evaluation-trust-foundation.md`

This is a **pre-Gate-A Product foundation selection**, not Gate A passage, Stage promotion, Stage 2 selection, or AI/Mutation authority expansion.

The Product reason is evaluator trust. Existing formal evidence demonstrates a useful release-safety baseline—30 successful synthetic reviews, 210/210 current semantic rubric checks, and zero hard violations—but the current harness does not yet measure issue precision/recall, good-workflow false positives, flawed-workflow false negatives, top-issue agreement, or semantics-preserving stability against a versioned gold dataset. The current A–J fixtures are also small; the largest has eight nodes.

Therefore the smallest current dependency is to make semantic evaluation quality measurable before stronger improvement authority is considered.

---

# 2. Packet index

`Selected` and `Specified` describe lifecycle authority, not release completion. Live repository/Production evidence wins.

| Packet | Role in current plan | Recorded lifecycle / remaining work |
|---|---|---|
| `AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1` | **Current selected Product Sprint** — versioned gold dataset + semantic quality metrics | **Selected**; next owner `02`; not implementation-ready until `Specified` |
| `AGS-EGAI-AR-V0-P1` | Base Architecture Review contract | Stage 1 commercial/public-launch lifecycle remains open; current AI review authority unchanged |
| `AGS-EGAI-AR-PAUC-V0-P1` | Paid access/control contract | Preparation released; first-Live procedure Specified/released/release-verified; activation deferred; Phase 0/containment/Live proofs/AC-30 remain open |
| `AGS-EGAI-AR-COMMERCIAL-POLICY-UX-V0-P1` | Coupled policy UX amendment | Preparation implemented; eventual public launch still requires its existing approvals/evidence |
| `AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1` | Completed bounded free-core launch hardening | Sprint Complete / Production Verified; regression/history reference only |
| `AGS-CREWAI-STATIC-IMPORT-V0-P1` | Completed deterministic adoption foundation | Sprint Complete / Production Verified |
| `AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1` | Completed UX foundation | Sprint Complete / Production Verified |

---

# 3. Selected Sprint — Evaluation Trust Foundation

## 3.1 Product problem

Current Architecture Review release evidence proves important safety and structure properties, but it does not yet establish semantic evaluator quality at the level required for stronger Product authority.

Known current harness characteristics:

- 10 synthetic fixtures A–J;
- 3 runs each / 30 reviews in the formal full evaluation;
- current semantic rubric checks grounding, target validity, explanation presence, knowledge discipline, high-level direction, and fixture-focus terms;
- current hard-violation checks cover invalid Evidence/targets, invalid knowledge ownership, unsupported Known runtime/framework claims, prompt-injection obedience, and related contract failures;
- formal recovered run: 210/210 current semantic checks and zero hard violations;
- largest current fixture: eight nodes.

Missing Product evidence:

- issue precision / recall;
- good-workflow false-positive rate;
- flawed-workflow false-negative / issue-coverage behavior;
- top-1 / top-k priority agreement;
- strength recognition against annotated expectations;
- acceptable-alternative handling;
- repeated-run material-finding stability;
- semantics-preserving representation stability.

## 3.2 Included selection scope

`02` is authorized to specify the smallest coherent implementation around:

- versioned benchmark dataset/rubric;
- reviewable gold annotation model for expected strengths/issues/priority/Evidence/Unknowns/acceptable alternatives and recommendation direction;
- minimum good/flawed/ambiguous/multiple-valid/adversarial benchmark classes;
- deterministic scoring/reporting for precision/recall, false positives/negatives, priority agreement, strength recognition, uncertainty preservation, stability, and existing hard violations where annotations support the metric;
- semantics-preserving stability foundation;
- reproducible benchmark report metadata;
- provider-independent dataset/scorer/report tests;
- explicit bounded provider-backed evaluation only where separately allowed by existing provider/budget governance.

Existing A–J fixtures may be reused with preserved provenance, but must not be silently renamed as expert gold without the required annotation/review evidence.

## 3.3 Deferred / Out of Scope

Not selected now:

- 50 / 100 / 250 / 500+ node provider-backed scale benchmark execution;
- scoped/hierarchical evaluation implementation;
- broad large-workflow Search/Filter/Outline;
- dedicated Architecture Review Workspace redesign;
- Project / Local Workspace identity;
- persisted Intent & Constraints;
- revision / evaluation history;
- Scenario / Acceptance persistence;
- Stage 2 Guided Improvement;
- stronger recommendation authority;
- Semantic Patch / Apply;
- Mutation Authority expansion;
- managed runtime / hosted execution;
- cloud/team/collaboration;
- generic multi-framework expansion;
- commercial activation or Production paid configuration changes.

The packet may carry topology/size metadata for later evidence reuse, but must not claim large-workflow support or silently select a scale architecture.

## 3.4 Why the other candidates were not selected

**Adoption & Context Foundation:** Project/Workspace, Intent, and history add persistence/identity/governance scope. Current evidence does not yet show missing context/history is the dominant review-quality bottleneck.

**Review Workspace / Locate:** strategically valuable, but there is no current Production evidence that provider-backed finding navigation is the main limiting problem. Astra already improved deterministic Locate in the free-core journey.

**Combined quality + context/UX/scale packet:** rejected as larger than necessary. Quality measurement should first reveal which dependency is actually limiting trust.

**No new Product selection:** rejected under the new stakeholder priority because commercial activation can remain fail-closed while independently justified evaluator-quality work advances the core Product.

---

# 4. Commercial lifecycle — OPEN / FAIL-CLOSED / DEFERRED ACTIVATION

Commercial activation is preserved as an open lifecycle but removed from the current execution path.

Current facts remain:

- commercial-enablement preparation release is paid-off Production Verified;
- Production paid Architecture Review remains disabled / fail-closed;
- first-Live procedure is Specified / released / W01 release-verified;
- QA containment is not verified / not ready;
- PAUC AC-30 is not complete;
- real paid entitlement/quota/provider/financial behavior is not Production Verified;
- the connected Vercel team plan label was live-observed as `hobby`; commercial-use eligibility remains a separate evidence requirement;
- the existing public-launch risks `R-008`, `R-020`, and `R-021` remain unresolved for commercial activation.

The existing procedure remains authoritative:

```text
all Phase 0 non-circular prerequisites VERIFIED
→ QA-only edge containment staged and W01-verified while paid-off
→ first bounded Live window: normal app Checkout → signed Live webhook → legitimate entitlement/quota
→ switch false again
→ entitled kill-switch proof while fail-closed
→ second bounded Live window: cost-guard rejection before provider invocation
→ switch false again
→ existing W01 AC-30 sequence
→ later separately verified public-enable transition
```

None of these steps is authorized merely because the procedure exists or this Product Sprint was selected.

## 4.1 Deferred activation evidence state

The following remain unresolved and must be re-checked fresh when commercial activation is explicitly resumed:

- commercial-use hosting/account/contract eligibility;
- public policy / merchant / privacy / tax / refund / support approvals;
- Stripe Live Price / Portal / Tax configuration;
- provider Production project/key/budget/alerts/hard ceiling;
- financial QA approval;
- required Test Mode lifecycle evidence;
- Production Auth delivery/session/redirect evidence;
- current Firewall rule inventory/capacity/operator authority;
- stable exclusive QA egress source and independent containment proof;
- first-Live entitlement/webhook lifecycle;
- entitled-user kill switch;
- cost guard before provider invocation;
- PAUC AC-30 real subscription/entitlement/quota/cancellation/refund sequence.

Do not promote any of these to `VERIFIED` from stale documentation or previous plan labels.

## 4.2 Resumption rule

Commercial activation may resume only through a later explicit priority decision after Product development has advanced further.

At minimum:

```text
current Selected Product Sprint completes its normal lifecycle
→ 00 reconciles current evidence/priority
→ 01 explicitly decides whether commercial activation resumes or another Product dependency is selected
```

Completion of the Evaluation Trust Foundation does **not** automatically authorize Stripe Live, containment, first-Live, AC-30, or public paid enablement.

---

# 5. Active execution board

Current Product execution priority:

```text
AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1
= SELECTED
→ 02 Specification
```

Commercial exposure blocker remains real but is currently a **deferred commercial-activation blocker**, not a blocker to this independently justified Product-quality Sprint:

```text
COMMERCIAL_PRODUCTION_VERIFICATION_BLOCKER
= OPEN / DEFERRED ACTIVATION

Related durable risks
= R-008 / R-020 / R-021
```

Evaluator trust risk remains active as a Product evidence gap:

```text
R-001
= Critical / WATCH
= selected Sprint gathers the missing calibration foundation
= risk is not considered resolved merely because work is selected
```

| Work / decision | State | Next owner/action |
|---|---|---|
| Evaluation Trust Foundation | **SELECTED** | `02` completes implementation-ready specification and only then may mark `Specified` |
| Commercial activation / first-Live / AC-30 | **OPEN / FAIL-CLOSED / DEFERRED** | no Production config/Stripe/WAF/Live action now; re-open only by explicit later priority decision |
| Gate A | **NOT REACHED** | selected packet prepares evidence only; no promotion |
| Gate B | **NOT REACHED** | no stronger evaluator authority |
| Stage 2 | **NOT SELECTED** | no Guided Improvement |
| AI Authority | **UNCHANGED** | existing capability-scoped review authority only |
| Mutation Authority | **UNCHANGED** | no semantic apply authority |

---

# 6. Known / Inferred / Unknown for current selection

## Known

- Astra launch hardening is Sprint Complete / Production Verified;
- the paid path is currently disabled / fail-closed;
- the first-Live procedure is released and release-verified but not executed;
- the formal recovered evaluator run contains 30 successful reviews, 210/210 current semantic checks, and zero hard violations;
- the current A–J fixture set is synthetic and small, with a largest fixture of eight nodes;
- the current scorer does not compute gold-set issue precision/recall, good-workflow false positives, flawed-workflow false negatives, or top-issue agreement;
- durable Product/Roadmap authority requires measured evaluator trust before stronger authority expansion;
- `R-001` remains Critical / WATCH.

## Inferred

- a versioned gold-dataset/quality-metric foundation is the smallest current dependency for learning whether evaluator quality, context, navigation, or scale should be the next limiting concern;
- deferring commercial activation creates no new core architecture dependency because the free deterministic core and benchmark/scorer foundation can remain independent of paid/provider availability.

## Unknown

- actual issue precision/recall on a curated gold set;
- good-workflow false-positive rate;
- flawed-workflow false-negative behavior;
- top-issue priority agreement with human Product/Architecture judgement;
- material finding stability across repeated runs and semantics-preserving variants;
- large-workflow semantic degradation and the size at which monolithic evaluation becomes insufficient;
- whether persisted Intent/Constraints materially improves evaluator correctness;
- whether Review Workspace/Locate is a meaningful provider-backed usability bottleneck;
- the eventual appropriate commercial-activation date.

Unknown means insufficient evidence, not evidence of absence.

---

# 7. Coordination discipline

Current canonical near-term path:

```text
01 Explicit Next Selection
= AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1 Selected

→ 02 Specification
→ C01 Implementation
→ W01 Independent QA
→ C01 exact approved release
→ W01 Production Verification as applicable
→ 00 Sprint Complete
→ 01 Evidence / Gate Review / Explicit Next Selection
```

Parallel commercial rule:

```text
Paid Production
= stay disabled / fail-closed

Commercial activation work
= deferred

Existing activation requirements
= preserved
```

Conditional routing:

```text
new Product/Architecture/Gate decision → 01
selected packet specification → 02
specified implementation → C01
independent QA / Production verification → W01
lifecycle/current-state coordination → 00
```

Rules:

- Stage order is dependency direction, not an automatic queue.
- The selected benchmark foundation does not pass Gate A.
- M0 remains separate from evaluator authority and roadmap promotion.
- Gate B is required before stronger Guided Improvement authority.
- Stage 2 remains not selected.
- Commercial activation deferral does not erase or weaken AC-30.
- AI Authority and Mutation Authority remain unchanged until applicable gates explicitly change them.
- Do not grow this board into a historical archive; completed detail belongs in packets/PRs/ADRs/evidence documents.
