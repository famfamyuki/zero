# AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1 — GPT-6 Astra Challenge Launch Hardening

Status: **Specified**  
Selection owner: `01 — Product Architecture & Roadmap`  
Specification owner: `02 — UX & Implementation Specification`  
Next owner: `W01 — Independent QA / Pass A`
Selected: **2026-09-12**  
Specified: **2026-09-12**  
Timebox: **Product Hunt GPT-6 Astra Challenge launch on 2026-09-18**  
Decision class: **Bounded free-core launch hardening; no roadmap or authority promotion**  
Specification evidence baseline: GitHub `main` `d10a5f5aa135fe1aee7bab12dc820c34168fc46c`; Vercel Production deployment `dpl_AaxbN2ESePg8XFbYDV6Re6P6iV44`, `READY`, `target=production`, same `githubCommitSha`.

The baseline identity is evidence, not a permanent current-state claim. `C01` and `W01` must re-check live repository/deployment state at their own handoffs.

---

# 0. Authority and evidence method

Apply this packet under:

- `docs/PRODUCT_MASTER.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CHAT_ROLE_REGISTRY.md`
- `docs/roadmap/PROGRAM_BOARD.md`
- completed `AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1` as regression/continuity evidence only

Production `/` was directly retrieved and returned HTTP 200. Its rendered first view/metadata matched the live deployment identity above. The specification environment could retrieve Production but scripted public-site navigation was blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore:

- first-view Production evidence below is directly observed;
- interactive contracts are grounded in the exact same deployed source revision and existing tests;
- `02` does not claim to have clicked every Production transition;
- `W01` must execute the changed-path browser smoke before Production Verified.

This is a Known Note, not an unresolved Product decision.

---

# 1. Exact launch user goal

For a first-time visitor with no prior saved browser workflow:

```text
Understand representative workflow
→ deterministic Preflight
→ concrete Readiness finding + evidence
→ Locate editable target
→ manual user-controlled improvement
→ re-evaluate
→ portable export
```

This is the current North Star expressed through existing behavior:

`Understand → Evaluate → Improve manually → Verify again → Own / export`

The path must not require paid Architecture Review, provider availability, auth, billing, entitlement, quota, runtime execution/observation, AI-generated improvement, or semantic mutation.

---

# 2. Production evidence and launch-critical friction

## 2.1 Directly observed first view

Production already provides:

- title `AgentGraph Studio | Workflow Architecture Preflight & Portable Export`;
- `Overview | Design | Preflight`;
- global `Export` / `More`;
- `Understand the workflow before you run it.`;
- current default `X Content Planning Crew` (2 Agents / 2 Tasks / 2 Tools / sequential);
- `Run Preflight` + `Open Design`;
- `Deterministic · Static · available`;
- explicit no-execution/no-runtime-observation disclaimer;
- CrewAI Python, AgentGraph JSON, Example / Template, Manual Design entry paths.

Protect these established Product-identity decisions.

## 2.2 Same-revision implemented interaction evidence

The deployed revision already has:

- Unified Preflight Overview / Architecture / Readiness / Execution / Resources;
- explicit `Re-evaluate`;
- Readiness `What / Where / Why / Next`, deterministic basis/details, `Locate`;
- Locate → Design + Inspector;
- `ReviewReturnBar` + `Back to finding`;
- AgentGraph JSON + deterministic CrewAI Python export;
- keyboard Preflight behavior;
- existing Playwright desktop/mobile free-core coverage.

Reuse these; do not rebuild them.

## 2.3 Friction in scope

**F1 — Representative demo:** current default `X Content Planning Crew` does not intentionally surface one clear, editable deterministic finding, so the full value loop is easy to miss.

**F2 — Journey discovery:** the loop exists but Overview does not tell a first visitor which finding to use or how Locate → edit → re-evaluate → export connects.

**F3 — Locate precision:** Readiness Locate uses `target.nodeId` but currently ignores `target.field`; a field-level finding opens Inspector at its heading rather than the editable field.

**F4 — Social preview:** root metadata has title/description but lacks a complete repository-owned canonical/Open Graph/Twitter large-preview contract.

Not in scope: redesigning the three-surface IA, finding anatomy, return bar, Re-evaluate, export, entry hierarchy, or deterministic/runtime disclaimers.

---

# 3. Representative demo contract

Use existing preset:

```text
template id: competitor-price-monitor
crew name: Competitor Catalog Review Crew
```

It already contains the launch walkthrough finding:

```text
Rule: RDY_JSON_OUTPUT_SCHEMA_IMPLICIT
Impact: medium
Target: task-5.outputSchema
Task: Capture Normalized Catalog Snapshot
Title: JSON output schema is implicit
```

The task requests JSON but has no explicit schema. Keep that current medium-impact finding; do not pre-fix it or fabricate a blocking/runtime/AI error.

For deterministic tests and the walkthrough, use this schema because it preserves the task's existing expected-output meaning at the current flat schema-contract level:

```json
{"snapshot_metadata":"object","products":"array[object]"}
```

## Initial artifact behavior

- no valid saved workflow → load `Competitor Catalog Review Crew` as the initial Example workflow;
- valid `agentgraph_active_flow` → preserve/rehydrate it; never replace it with the demo;
- user-created empty graph → preserve it; do not silently repopulate it;
- corrupt/unsupported saved state → preserve existing atomic/fail-safe recovery behavior;
- do not reorder/remove/rewrite the template library merely to choose the initial example.

---

# 4. Exact first-value flow

Clean browser context:

1. `/` loads `Competitor Catalog Review Crew` as Example workflow.
2. Overview keeps existing Product orientation and shows the bounded launch guide in §5.1.
3. User selects existing `Run Preflight`.
4. User opens `Readiness`.
5. `JSON output schema is implicit` is visible for `Capture Normalized Catalog Snapshot`.
6. User selects `Locate`.
7. Design opens; task is selected; Inspector opens; `Output schema` receives focus.
8. Existing `ReviewReturnBar` remains available.
9. User manually enters `{"snapshot_metadata":"object","products":"array[object]"}`.
10. Deterministic analysis refreshes; no runtime claim is made.
11. User selects `Back to finding` or returns to Preflight.
12. If the exact finding is gone, focus a stable Readiness location and announce that the prior item is no longer present; never fuzzy-select another finding.
13. User may explicitly `Re-evaluate`; the same implicit-schema finding remains absent.
14. User exports AgentGraph JSON and can reach deterministic CrewAI Python export.

The entire flow remains provider/billing-independent.

---

# 5. UX / presentation contract

## 5.1 Representative-example launch guide

Only when the current artifact is the launch representative example under existing presentation-origin semantics, show a compact guide near the Overview example card.

English:

- heading: `Try the full review loop`
- body: `Run deterministic Preflight, open the JSON schema finding, Locate it in Design, improve it manually, re-evaluate, then export the workflow you own.`
- steps:
  1. `Run Preflight`
  2. `Open Readiness`
  3. `Locate the JSON schema finding`
  4. `Edit in Design and re-evaluate`
  5. `Export`

Japanese:

- heading: `レビューの一連の流れを試す`
- body: `決定論的Preflightを実行し、JSON schemaの指摘を開き、Designで場所を表示して手動修正し、再評価して、所有できる形式でエクスポートします。`
- steps:
  1. `Preflightを実行`
  2. `Readinessを開く`
  3. `JSON schemaの指摘をLocate`
  4. `Designで編集して再評価`
  5. `Export`

Rules:

- orientation only; no wizard/tour/checklist persistence/completion state;
- do not duplicate `Run Preflight`;
- hide demo-specific guidance for arbitrary imported/saved/manual workflows;
- never say executed, simulated, runtime-verified, or AI-improved.

## 5.2 Field-aware Readiness Locate

For a current finding with `target.nodeId` + editable `target.field`:

- retain current node selection, Design transition, Inspector open, return context, and announcement;
- after Inspector mounts, focus the matching editable control;
- `task-5.outputSchema` must focus the `Output schema` textarea;
- control needs a stable accessible name tied to its visible label;
- unsupported field → existing Inspector-heading fallback;
- stale/missing target → existing refresh-in-place behavior;
- no fuzzy target recovery and no new persistent identity.

Implementation mechanism is C01-owned; behavior is authoritative.

## 5.3 Challenge attribution

A small secondary, non-interactive Overview attribution **must** appear:

`GPT-6 Astra Challenge · September 18, 2026`

It may also appear in the social preview.

Forbidden unless separately proven by runtime evidence:

- `Powered by GPT-6 Astra`
- `Astra-powered`
- `runs on Astra`
- equivalent model/runtime claims

This is launch attribution only; it does not change Product/provider/evaluator authority.

## 5.4 Social metadata / preview

Production `/` must provide:

- canonical current Production URL;
- Open Graph `website`;
- site name `AgentGraph Studio`;
- Product title consistent with the existing title;
- existing truthful description or semantically equivalent bounded copy;
- Twitter/X large-image preview metadata;
- repository-owned 1200×630 image, static or framework-native;
- meaningful image alt;
- no auth/provider/user-workflow/runtime dependency.

Required preview content:

```text
AgentGraph Studio
Understand → Evaluate → Improve → Verify → Own
Deterministic Preflight · Portable Export
```

Challenge attribution from §5.3 may be included. No imported content, secrets, provider output, paid claim, future-stage claim, or unsupported Astra runtime claim.

---

# 6. Included scope

Exactly:

1. clean-session representative example = `Competitor Catalog Review Crew`;
2. Overview launch guide;
3. field-aware Readiness Locate with safe fallback;
4. bounded challenge attribution;
5. canonical/OG/Twitter metadata + repository-owned launch image;
6. focused deterministic/Playwright regression coverage;
7. accessibility/responsive behavior for changed surfaces;
8. exact Production smoke in §16.

---

# 7. Out of Scope / Deferred

No:

- contest-driven Production Astra/model dependency;
- Architecture Review model/provider/prompt/rubric/evaluator change;
- paid Architecture Review enablement;
- Stripe/entitlement/quota/PAUC AC-30 bypass;
- Stage/Gate promotion or M0 conclusion;
- Stage 1.5/Stage 2 capability;
- Project/Workspace persistence;
- persisted Intent/Constraints;
- revision/history/evaluation history;
- Guided Improvement / AI proposals;
- Semantic Patch / automatic Apply / silent mutation;
- runtime execution/observation/managed agents/sandbox verification;
- account/cloud/collaboration/RBAC/Team expansion;
- framework expansion;
- arbitrary imported-code execution;
- source write-back;
- provider/data disclosure expansion;
- new API;
- broad redesign;
- persistent onboarding/tour/checklist;
- analytics-event semantic change.

Preserve:

`Configured expectation ≠ Static evidence ≠ Observed runtime behavior`  
`Visual Group ≠ Semantic Module ≠ Runtime Orchestration`

AI Authority: **UNCHANGED**.  
Mutation Authority: **UNCHANGED / none added**.

---

# 8. State contract

| State | Required behavior |
|---|---|
| Clean/no valid saved workflow | Representative example + launch guide. |
| Valid saved workflow | Rehydrate unchanged; no demo overwrite; no false demo guide. |
| User empty graph | Preserve empty state and existing entry actions. |
| Corrupt/unsupported saved workflow | Existing atomic/fail-safe recovery; no partial graph mutation. |
| Preflight refreshing | Existing status/refresh behavior; no premature result claim. |
| Finding available | Existing finding anatomy + Locate. |
| Locate stale/missing | Refresh in place; announce; no wrong target. |
| Editable field supported | Design + Inspector + exact field focus. |
| Field unsupported | Inspector-heading fallback. |
| Finding resolved | Stable Readiness focus + resolution/not-present announcement; no fuzzy rematch. |
| Paid/provider unavailable | Deterministic Overview/Design/Readiness/Execution/Resources/export remains usable. |
| Social image build failure | Build failure for packet; do not add runtime provider fallback. |

No new persistent/loading/stale semantics.

---

# 9. Domain / API / persistence / security

- `GraphDocumentV1`: unchanged.
- Readiness rules/evidence/result meaning: unchanged.
- API: no new endpoint.
- browser storage key/meaning: unchanged.
- walkthrough state: not persisted.
- cloud/account persistence: none.
- migration: none.
- provider call: none.
- credential/secret/imported source/Evidence/provider-response data flow: none.
- imported code remains unexecuted.
- paid Architecture Review remains fail-closed/separate.

---

# 10. Accessibility / responsive

Changed UI must provide:

- semantic heading/list structure;
- full keyboard path;
- visible focus and no focus trap;
- focus moves only from user navigation actions;
- `Output schema` accessible name tied to visible label;
- polite refresh/resolution announcement;
- non-color-only order/status;
- existing target-size conventions;
- no horizontal page overflow at existing `mobile-ja` 320×740;
- readable guide at 1280×900 and 320×740;
- EN/JA parity.

---

# 11. Analytics

**No additive analytics event.**

Preserve current event names/meaning/activation behavior. Do not emit workflow/task/schema text, imported source, full Evidence, prompts, secrets, credentials, or provider responses.

Auto-loading the representative example must not emit `template_selected` as though the user manually chose it.

---

# 12. Acceptance Criteria

**AC-01 Saved work:** valid existing browser workflow is not replaced.

**AC-02 Clean example:** no valid saved workflow loads `Competitor Catalog Review Crew` as Example workflow.

**AC-03 Canonical finding:** clean example yields `RDY_JSON_OUTPUT_SCHEMA_IMPLICIT` at `task-5.outputSchema`.

**AC-04 Guide:** §5.1 guide appears EN/JA only for the representative example.

**AC-05 Preflight:** existing `Run Preflight` remains primary and provider-independent.

**AC-06 Readiness discovery:** canonical finding reachable by keyboard and pointer.

**AC-07 Field-aware Locate:** Locate selects `Capture Normalized Catalog Snapshot`, opens Inspector/return context, and focuses `Output schema`.

**AC-08 Fallback:** unsupported field uses stable Inspector fallback; stale target refreshes in place.

**AC-09 Manual fix:** after entering `{"snapshot_metadata":"object","products":"array[object]"}`, deterministic re-evaluation no longer reports that target's implicit-schema finding.

**AC-10 Resolution continuity:** returning after fix reaches stable Readiness context and never fuzzy-selects another finding.

**AC-11 JSON ownership:** AgentGraph JSON downloads valid artifact and round-trips.

**AC-12 CrewAI ownership:** deterministic CrewAI Python export remains reachable.

**AC-13 Protected regression:** Builder, Templates, JSON import/export, CrewAI Static Import, Readiness, Execution Preview, Resource Analysis, Unified Preflight, activation, analytics, language, accessibility, responsive behavior remain operational.

**AC-14 Evidence truth:** no runtime execution/observation/simulation/verification claim is introduced.

**AC-15 Provider isolation:** representative loop completes with paid Architecture Review/provider unavailable.

**AC-16 Authority:** no AI proposal, Semantic Patch, Apply, hidden mutation, provider/model, persistence, or runtime-verification expansion.

**AC-17 Challenge attribution:** Overview shows §5.3 wording; Product/social surfaces do not imply Astra runtime use.

**AC-18 Social metadata:** Production HTTP fetch exposes canonical/OG/Twitter metadata pointing to repository-owned 1200×630 image with meaningful alt.

**AC-19 Social independence:** metadata/image need no auth, entitlement, provider, user workflow data, or request-time AI generation.

**AC-20 Keyboard:** `Overview → Preflight → Readiness → Locate → schema edit → return/re-evaluate → Export` works keyboard-only with visible focus.

**AC-21 Mobile:** at 320×740 no page-level horizontal overflow/action loss.

**AC-22 Non-color:** guide/finding/focus/resolution remains understandable without color.

**AC-23 Analytics:** existing event contracts preserved; no semantic payload addition; auto-default is not manual template selection.

**AC-24 Contract:** GraphDocumentV1, APIs, storage meaning, provider/data/persistence scope unchanged.

---

# 13. Test Matrix

| Area | Required verification |
|---|---|
| Representative preset | Prove `competitor-price-monitor` produces `RDY_JSON_OUTPUT_SCHEMA_IMPLICIT` at `task-5.outputSchema`. |
| Deterministic fix | Apply fixed schema and prove finding disappears while scaffold validation remains valid. |
| Saved workflow | Browser storage rehydrates and is not overwritten. |
| Guide | EN/JA copy intent, representative-only visibility, no duplicate Preflight CTA. |
| Locate | `outputSchema` focus, unsupported-field fallback, stale-target refresh. |
| Return/re-evaluate | Review context survives edit; resolved-item fallback is stable/announced. |
| Export | Existing JSON roundtrip + CrewAI export remain green. |
| Metadata | canonical/OG/Twitter/image dimensions/alt; no unsupported Astra runtime wording. |
| Analytics | Existing contracts green; no semantic payload/new false selection event. |
| Accessibility | Preflight, Locate field, return/re-evaluate, Export keyboard focus. |
| Responsive | existing Playwright `desktop-en` 1280×900 + `mobile-ja` 320×740 changed path. |
| Failure isolation | existing external-request-blocking browser policy still permits deterministic free core. |
| Required checks | `npm run docs:check`, `npm test`, `npm run typecheck`, `npm run build`, `npm run test:e2e`, `npm run verify` as applicable. |

C01 chooses test-file organization; assertions are authoritative.

---

# 14. Traceability

| Requirement | Authority/evidence | AC | Verification |
|---|---|---|---|
| Existing value, not feature breadth | Product Master + selection | 02–05 | representative E2E |
| Evidence Before Intelligence | Product/Architecture/Dev Rules | 03,09,14 | readiness tests/UI |
| Manual improvement | Product Master + completed journey | 07–10 | Locate/edit/re-evaluate |
| Own/export | Product Master + completed journey | 11–13 | roundtrip/code export |
| Provider-independent core | Architecture/Dev Rules/Board | 05,15,19 | blocked-external-request browser test |
| No AI/Mutation expansion | Gate state + packet | 16 | diff/QA |
| Existing work protected | completed journey | 01,24 | storage test |
| Launch clarity | F1/F2 | 02–04 | Overview/E2E |
| Finding→edit precision | F3 | 07–10 | focus/navigation |
| Social launch presentation | F4 + selection | 17–19 | metadata HTTP/build |
| A11y/responsive | Dev Rules | 20–22 | Playwright |
| Analytics/privacy | Dev Rules | 23 | analytics tests/review |

---

# 15. C01 / W01 boundaries

## C01

C01 owns engineering decomposition, not Product semantics. It must re-check live `main`, implement only §§3–6, preserve regressions, and add tests.

Return to `02`/`01` rather than expanding scope if implementation would require new persisted identity/state, provider/model call, Readiness-rule meaning, Product capability, broad onboarding infrastructure, paid enablement, AI/mutation authority, or runtime verification.

No such Product blocker is known.

## W01 Pass A

Independently verify AC-01–24, required checks/Playwright, finding before/fixed-after, keyboard/mobile, metadata truth, no unsupported Astra claim, paid/provider isolation, regression surfaces, analytics privacy, and no mutation/persistence expansion.

Record exact approved revision and `PASS`, `PASS WITH NOTES`, or `FAIL / BLOCKED`.

---

# 16. Exact Production verification smoke

After release of the exact QA-approved revision, W01:

1. verifies live GitHub `main`;
2. verifies Vercel `READY`, `target=production`, correct domain, and `main SHA = githubCommitSha`;
3. HTTP-fetches `/` and verifies title/description/canonical/OG/Twitter/image;
4. clean browser context: representative example + launch guide;
5. `Run Preflight` → Readiness;
6. confirms `JSON output schema is implicit` on `Capture Normalized Catalog Snapshot`;
7. Locate → Design/Inspector → visible focus on `Output schema`;
8. enter `{"snapshot_metadata":"object","products":"array[object]"}`;
9. return/re-evaluate; exact finding absent;
10. export valid AgentGraph JSON;
11. open deterministic CrewAI Python export;
12. mobile focused smoke near repository mobile viewport;
13. saved-workflow context is not overwritten;
14. paid Architecture Review remains fail-closed unless independently changed through its own lifecycle;
15. inspect relevant browser/runtime errors.

Do not infer runtime workflow behavior from static Preflight.

---

# 17. Non-repository launch assets

Product Hunt listing, screenshots, and video are external deliverables.

Rule:

`Production-verified behavior → screenshots/video/copy`

Never reverse this into implementation pressure.

They may state launch participation in the GPT-6 Astra Challenge, but must not claim Astra runtime dependency, runtime execution/verification, automatic improvement, paid availability, or future-stage behavior unless separately true and verified.

Preferred owner after Production Verified: `00` / authorized launch operator.

---

# 18. Definition of Ready

| DoR | Resolution |
|---|---|
| exact goal/path | §§1,3,4 |
| Production friction/evidence | §2; browser-navigation limitation explicit |
| Included / Out of Scope | §§6,7 |
| UX/states | §§4,5,8 |
| domain/data/API/persistence | §9 |
| security/privacy/provider | §9 |
| AI/Mutation Authority | unchanged |
| migration/backward compatibility | no migration; saved work protected |
| accessibility/responsive | §10 |
| analytics | §11 |
| AC | §12 |
| tests/browser coverage | §13 |
| traceability | §14 |
| independent QA | §15 |
| Production smoke | §16 |
| external assets/video | §17 |

**Definition of Ready: SATISFIED.**

No unresolved Product decision blocks implementation.

---

# 19. Lifecycle / handoff

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started
→ C01 Implementation Complete   ← current (2026-09-12)
→ W01 QA Complete
→ C01 merge/release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
```

`Specified` is specification maturity only. It does not mean implemented, QA-approved, released, Production Verified, paid-ready, M0/Gate reached, or authority-expanded.

The open paid Architecture Review lifecycle remains separate and unchanged.

C01 completed required self-verification. See [implementation evidence](../harness/ASTRA_LAUNCH_IMPLEMENTATION.md). Independent QA and Production verification of the exact candidate remain pending.
