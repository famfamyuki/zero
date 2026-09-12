# AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1 — GPT-6 Astra Challenge Launch Hardening

Status: **Specified**  
Selection owner: `01 — Product Architecture & Roadmap`  
Specification owner: `02 — UX & Implementation Specification`  
Next owner: `C01 — Current Sprint Implementation`  
Selected: **2026-09-12**  
Specified: **2026-09-12**  
Timebox: **Product Hunt GPT-6 Astra Challenge launch on 2026-09-18**  
Decision class: **Bounded launch hardening; no roadmap promotion or authority expansion**  
Specification baseline: GitHub `main` observed at `d10a5f5aa135fe1aee7bab12dc820c34168fc46c`; Vercel Production deployment `dpl_AaxbN2ESePg8XFbYDV6Re6P6iV44` was `READY`, `target=production`, and reported the same `githubCommitSha`.

The baseline SHA/deployment above is evidence for this specification, not a permanent current-state claim. `C01` and `W01` must re-check live `main` / candidate / Production identity at their own handoff points.

---

# 0. Authority and evidence method

This packet is the implementation authority for the bounded launch-hardening scope selected by `01`. It must be read under:

- `docs/PRODUCT_MASTER.md`;
- `docs/ARCHITECTURE.md`;
- `docs/DEVELOPMENT_RULES.md`;
- `docs/CHAT_ROLE_REGISTRY.md`;
- `docs/roadmap/PROGRAM_BOARD.md`;
- the completed `docs/specs/AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1.md` as a regression/continuity reference only.

No historical chat, old SHA, contest deadline, or launch asset expands this packet.

Production was inspected from the public Production URL. The rendered root document returned HTTP 200 and matched the live `main` deployment identity above. The execution environment used for specification could retrieve Production through the Vercel connection but blocked scripted public-site browser navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore:

- actual Production first-view HTML/metadata are **directly observed**;
- interactive behavior below is grounded in the **same exact revision** deployed to Production plus its existing tests/components;
- no claim is made that `02` directly clicked every interactive step in Production;
- `W01` must independently execute the specified changed-path browser smoke before Production Verified.

This limitation is a Known Note, not a missing Product decision.

---

# 1. Exact launch user goal

For a first-time visitor with no prior saved browser workflow, the shortest credible launch path is:

```text
Understand the representative workflow
→ run deterministic Preflight
→ inspect one concrete Readiness finding and its deterministic basis
→ Locate the editable target in Design
→ make a manual user-controlled improvement
→ re-evaluate
→ export the resulting artifact/source
```

The path demonstrates the implemented Product North Star without adding a new Product capability:

```text
Understand
→ Evaluate
→ Improve manually
→ Verify again
→ Own / export
```

Success means the visitor can understand and complete that loop without needing paid Architecture Review, provider availability, billing, entitlement, quota, runtime execution, runtime observation, AI-generated improvement, or semantic mutation.

---

# 2. Observed Production evidence and launch-critical friction

## 2.1 Directly observed Production first view

At the specification baseline, the public root page presents:

- Product title: `AgentGraph Studio | Workflow Architecture Preflight & Portable Export`;
- the three peer surfaces `Overview | Design | Preflight`;
- global `Export` and `More` actions;
- heading `Understand the workflow before you run it.`;
- copy that already explains deterministic readiness, manual improvement, re-verification, and export;
- current default example `X Content Planning Crew` with 2 Agents, 2 Tasks, 2 Tools, sequential process;
- primary `Run Preflight` and secondary `Open Design`;
- `Deterministic · Static · available`;
- explicit disclaimer that Preflight does not execute/simulate the workflow and does not observe runtime behavior;
- entry cards for CrewAI Python, AgentGraph JSON, Example / Template, and Manual Design.

These are already aligned with the completed Product Identity / Review Journey packet and are protected.

## 2.2 Same-revision implemented interaction evidence

The deployed revision already contains:

- Unified Preflight with Overview / Architecture / Readiness / Execution / Resources;
- a `Re-evaluate` control and refresh/status announcements;
- Readiness cards with `What / Where / Why / Next`, deterministic basis/details, and `Locate`;
- `Locate` routing from a Readiness finding to Design + Inspector;
- session-only `ReviewReturnBar` with `Back to finding`;
- global AgentGraph JSON and deterministic CrewAI Python export;
- keyboard tab behavior and heading focus in Unified Preflight;
- existing desktop/mobile Playwright free-core coverage.

These must be reused, not rebuilt.

## 2.3 Launch-critical friction

Only the following gaps are in scope:

### F1 — The current default example does not reliably demonstrate a useful improvement loop

`X Content Planning Crew` is a valid current example, but its current graph does not intentionally surface a clear, actionable deterministic Readiness finding. A first-time visitor can see Preflight but may not understand the value of finding → Locate → manual edit → verify.

### F2 — The full loop is implemented but not discoverable as one coherent launch path

The Overview explains the Product at a high level, but a first-time visitor is not told which deterministic finding to open or how the existing `Locate`, Design edit, return context, re-evaluation, and export fit together.

### F3 — Readiness Locate opens the correct node/Inspector but does not use `finding.target.field`

For a field-level finding, current navigation selects the node and opens the Inspector, then focuses the Inspector heading. For the representative `outputSchema` finding, the user must still find the exact editable field. The launch path should land directly on that field when it is currently representable in the Inspector.

### F4 — Repository-owned social preview metadata is incomplete

Current page metadata has title/description, but no complete Open Graph/Twitter large-preview contract or repository-owned launch social image is present. Product Hunt/social sharing should render the same truthful Product positioning as Production.

## 2.4 Explicitly not friction / no redesign required

Do not redesign or duplicate:

- top-level Overview / Design / Preflight IA;
- current Product positioning heading/body;
- Unified Preflight information architecture;
- Readiness finding anatomy;
- return-to-finding session context;
- explicit Re-evaluate;
- Export ownership actions;
- imports/templates/manual design entry hierarchy;
- current deterministic/static/runtime disclaimers.

---

# 3. Representative first-value workflow

## 3.1 Selected representative demo

The launch representative workflow is the existing preset:

```text
template id: competitor-price-monitor
crew name: Competitor Catalog Review Crew
```

Reason: it already contains an existing deterministic, user-editable improvement opportunity without introducing fake runtime evidence or new Product semantics.

The `Capture Normalized Catalog Snapshot` task requests JSON output but does not provide an explicit `outputSchema`. Existing Readiness therefore produces:

```text
Rule: RDY_JSON_OUTPUT_SCHEMA_IMPLICIT
Impact: medium
Target: task-5.outputSchema
Title: JSON output schema is implicit
Next: Add a valid JSON schema in the Task output settings.
```

This is the canonical launch walkthrough finding.

## 3.2 Initial-example behavior

For a browser session with **no valid rehydratable workflow**, the loaded initial example must be `Competitor Catalog Review Crew`.

For a browser session with an existing valid `agentgraph_active_flow`:

- preserve and rehydrate the user's current browser workflow;
- do not replace it with the representative demo;
- label provenance according to the existing current-browser-workflow rules;
- do not claim that the saved workflow came from the representative demo.

For an intentionally empty graph, do not silently repopulate it merely to force the demo.

For corrupt/unsupported saved state, preserve the existing fail-safe/atomic import-storage behavior; a fallback example may load only through the already-approved fallback path.

Changing the launch representative example must not reorder, remove, or semantically rewrite the template library unless mechanically necessary to select the initial example.

## 3.3 The finding is intentional demonstration evidence, not an error fabrication

Do not pre-fill `task-5.outputSchema` in the representative preset as part of this packet. The current medium-impact finding is the intended deterministic improvement opportunity.

The task remains valid for the current scaffold path. The launch hardening must not manufacture a blocking validation error, fake runtime failure, or AI finding.

A valid example schema used by tests/documentation may be:

```json
{"sku":"string","price":"number","currency":"string","availability":"string"}
```

Equivalent valid schemas are acceptable for manual use; C01/W01 tests should use one fixed schema for deterministic assertions.

---

# 4. Exact first-value user flow

For a clean browser context with no saved workflow:

1. Open `/`.
2. Overview identifies the loaded artifact as an **Example workflow** named `Competitor Catalog Review Crew`.
3. The existing Product orientation remains visible.
4. A compact launch guide presents the implemented loop:
   `Preflight → Readiness finding → Locate → manual Design edit → Re-evaluate → Export`.
5. User selects the existing primary `Run Preflight`.
6. Unified Preflight opens with the existing deterministic/static boundary intact.
7. User opens `Readiness`.
8. The `JSON output schema is implicit` finding is visible for `Capture Normalized Catalog Snapshot`.
9. User selects `Locate`.
10. Design opens, the target task is selected, Inspector opens, and the `Output schema` textarea receives focus when available.
11. The session-only return context remains visible.
12. User manually enters the fixed valid schema from §3.3.
13. Existing deterministic analysis refreshes after the edit. The UI must never claim runtime verification.
14. User chooses `Back to finding` or returns to Preflight. If that exact finding no longer exists, return to the Readiness stage heading and announce that the previous finding is no longer present.
15. User may select the existing explicit `Re-evaluate` control; after evaluation the implicit-schema finding must remain absent.
16. User opens `Export`.
17. AgentGraph JSON remains downloadable.
18. Deterministic CrewAI Python export remains reachable through the existing validation/code-generation path.

The flow must remain usable without Architecture Review, authentication, Stripe, entitlement, quota, provider calls, or external runtime execution.

---

# 5. Exact UX / presentation changes

## 5.1 Overview launch guide

When and only when the currently loaded artifact is the launch representative example, Overview shows a compact guidance block near the example card.

English:

**Heading:** `Try the full review loop`  
**Body:** `Run deterministic Preflight, open the JSON schema finding, Locate it in Design, improve it manually, re-evaluate, then export the workflow you own.`

Ordered steps:

```text
1. Run Preflight
2. Open Readiness
3. Locate the JSON schema finding
4. Edit in Design and re-evaluate
5. Export
```

Japanese:

**Heading:** `レビューの一連の流れを試す`  
**Body:** `決定論的Preflightを実行し、JSON schemaの指摘を開き、Designで場所を表示して手動修正し、再評価して、所有できる形式でエクスポートします。`

Ordered steps:

```text
1. Preflightを実行
2. Readinessを開く
3. JSON schemaの指摘をLocate
4. Designで編集して再評価
5. Export
```

Rules:

- this guide is orientation, not a wizard and not persisted state;
- do not add a separate walkthrough modal, tour framework, checklist persistence, completion badge, or account state;
- do not duplicate the existing `Run Preflight` CTA; the existing primary CTA remains the action;
- hide demo-specific guidance for arbitrary imported/saved/manual workflows rather than promising a finding that may not exist;
- do not say the workflow was executed, simulated, runtime-verified, or improved by AI.

## 5.2 Field-aware Locate

For Readiness findings with a current `target.nodeId` and a currently editable `target.field`:

- preserve existing node selection, Design transition, Inspector open, review-return context, and announcement;
- after the target Inspector is mounted, move keyboard focus to the corresponding editable control;
- for `task-5.outputSchema`, focus the `Output schema` textarea;
- the focused control must have a stable accessible name from its visible label;
- if a field cannot be mapped to a current editable control, fall back to the existing Inspector-heading focus and keep navigation successful;
- if the target node is stale/missing, preserve existing refresh-in-place behavior and do not navigate to an unrelated field;
- no fuzzy identity recovery and no new persistent target identity.

C01 may choose the smallest presentation-level implementation mechanism. This packet specifies behavior, not a required component/event architecture.

## 5.3 Challenge attribution

A small secondary, non-interactive launch attribution may appear in Overview and in the social preview:

```text
GPT-6 Astra Challenge · September 18, 2026
```

Japanese may use the same proper-noun label/date.

It must not use or imply:

- `Powered by GPT-6 Astra`;
- `Astra-powered`;
- `runs on Astra`;
- runtime/model claims not proven by current Production evidence.

The challenge label is launch attribution only. It does not change evaluator/provider configuration and must not outrank Product identity or deterministic evidence messaging.

## 5.4 Social preview metadata

Repository-owned metadata for `/` must provide:

- canonical Production URL for the current public Product domain already in use;
- Open Graph type `website`;
- site name `AgentGraph Studio`;
- Product title consistent with `AgentGraph Studio | Workflow Architecture Preflight & Portable Export`;
- the existing truthful meta description or a semantically equivalent bounded version;
- Twitter/X large-image preview metadata;
- a repository-owned 1200×630 launch image (static or framework-native generated);
- meaningful image alt text;
- no dependency on a paid provider, authentication, user workflow data, or runtime execution.

The launch image must communicate only current Product truth. Required content:

```text
AgentGraph Studio
Understand → Evaluate → Improve → Verify → Own
Deterministic Preflight · Portable Export
```

It may additionally contain the challenge attribution from §5.3.

It must not display workflow secrets, imported content, provider output, future-stage features, paid-offer claims, or unsupported Astra runtime claims.

---

# 6. Included scope

This Specified packet includes exactly:

1. selecting `Competitor Catalog Review Crew` as the clean-session representative example;
2. a compact representative-demo first-value guide on Overview;
3. field-aware Readiness Locate sufficient to land on `outputSchema` for the canonical demo finding, with safe fallback;
4. truthful challenge attribution as bounded secondary presentation;
5. Open Graph/Twitter/canonical metadata and repository-owned launch preview image;
6. focused regression/Playwright coverage for the complete representative first-value loop;
7. accessibility/responsive hardening required by the changed surfaces;
8. Production smoke requirements for the changed path.

No other visual redesign or Product capability is included.

---

# 7. Explicit Out of Scope / Deferred

This packet does **not** authorize:

- adding GPT-6 Astra or any other model as a Production runtime dependency for the contest;
- changing Architecture Review provider/model/prompt/rubric/evaluator behavior;
- enabling paid Architecture Review, Stripe, subscription, entitlement, quota, or PAUC AC-30;
- any paid-launch bypass or Commercial Validation Gate M0 conclusion;
- Stage/Gate promotion or Stage 1.5/Stage 2 selection;
- Project / Workspace persistence;
- persisted Intent / Constraints;
- workflow/revision/history/evaluation history;
- Guided Improvement;
- AI-generated improvement proposals;
- Semantic Patch generation;
- automatic Apply or silent semantic mutation;
- runtime execution, runtime observation, managed agents, or sandbox verification;
- account/cloud persistence expansion;
- collaboration / RBAC / Team capability;
- second-framework or generic-framework expansion;
- arbitrary imported code execution;
- source write-back;
- provider/data disclosure expansion;
- new API surface;
- broad visual redesign;
- a new onboarding/tour subsystem;
- persisted launch checklist/progress;
- changing the meaning of existing analytics events.

`Configured expectation ≠ Static evidence ≠ Observed runtime behavior` and  
`Visual Group ≠ Semantic Module ≠ Runtime Orchestration` remain fixed.

AI Authority: **UNCHANGED**.  
Mutation Authority: **UNCHANGED / no semantic mutation capability added**.

---

# 8. State contracts

| State | Required behavior |
|---|---|
| Clean first session / no valid saved workflow | Load `Competitor Catalog Review Crew` as Example workflow and show the launch guide. |
| Existing valid browser workflow | Rehydrate unchanged; never replace with the demo; hide demo-specific guide unless the current artifact is exactly the launch example under existing presentation-origin semantics. |
| Empty workflow chosen by user | Preserve empty state; entry actions remain primary; do not invent a demo finding. |
| Corrupt/unsupported saved workflow | Preserve existing atomic/fail-safe recovery behavior; do not partially mutate graph state. |
| Preflight loading/refreshing | Preserve existing refreshing state/status; guidance does not claim final results until evaluation completes. |
| Representative finding available | Show existing deterministic finding anatomy and Locate action. |
| Locate target stale/missing | Refresh current Readiness in place and announce the stale target; do not focus an unrelated field. |
| Locate target field supported | Design + Inspector open and the matching editable field receives focus. |
| Locate target field unsupported | Existing Inspector-heading fallback; no failure of navigation. |
| Finding resolved after edit | Return to Readiness stage; if exact item disappeared, announce resolution/not-present and focus a stable stage location rather than fuzzy-match another item. |
| Paid Architecture Review disabled/unavailable | Free Overview/Design/Readiness/Execution/Resources/export path remains usable and unchanged. |
| External/provider failure | No effect on deterministic representative path except existing independently-scoped provider UI; no new provider call is introduced. |
| Social preview image unavailable during build | Treat as implementation/build failure for this packet rather than adding a runtime provider fallback; title/description must never depend on an external service. |

No new stale/persistence semantics are introduced.

---

# 9. Domain / API / data / persistence / security contract

## Domain

- `GraphDocumentV1` unchanged.
- Readiness rule IDs, rule meaning, evidence model, and result semantics unchanged.
- Existing `EditorSurface`, presentation-origin, and session-only review-return semantics may be reused but are not persisted workflow meaning.
- No new Product identity/revision object.

## API

- No new public/private application API is required.
- No API request is allowed merely to render the launch guide, social metadata, or representative demo.

## Data / persistence

- Existing browser workflow storage key/meaning remains unchanged.
- No new localStorage/sessionStorage/database record is required for walkthrough state.
- No cloud persistence or account state.
- No migration.

## Security / privacy

- No new credential, secret, imported source, Evidence payload, workflow text, provider response, or personal data flow.
- Social metadata is static Product presentation only.
- Imported/user-authored text remains untrusted analyzed data.
- Arbitrary imported code remains non-executed.

## Provider boundary

- No new provider call.
- Deterministic free core remains provider-independent.
- Architecture Review paid/provider boundary remains fail-closed and is outside this packet.

---

# 10. Accessibility and responsive contract

All changed UI must preserve or improve:

- semantic heading order;
- keyboard-only completion of the representative path;
- visible focus;
- focus movement only when caused by the user's navigation action;
- an accessible name for the `Output schema` control and all existing actions;
- status/refresh/resolution announcements through existing polite status mechanisms where appropriate;
- non-color-only communication for step/order/state;
- minimum existing interactive target sizing conventions;
- no horizontal page overflow at the existing `mobile-ja` 320×740 viewport;
- readable/wrapping launch guide at desktop 1280×900 and mobile 320×740;
- no demo guidance that obscures Product nav, Export, or Preflight content;
- Japanese/English parity for new user-visible copy.

The launch guide should use semantic list/step structure, not color or connector graphics alone.

Field-aware Locate must make the focused field visibly identifiable and must not trap focus.

---

# 11. Analytics contract

No new analytics event is required for this packet.

Reason: existing instrumentation already covers the launch-critical funnel sufficiently for this bounded release, including Preflight open/first value, stage selection, Readiness open/finding selection, re-evaluation, template selection where applicable, and export/code-download actions.

Requirements:

- preserve current event names, property meaning, and activation semantics;
- do not emit workflow semantic content, imported source, task text, schema contents, full Evidence, prompts, secrets, credentials, or provider responses;
- changing the default example must not fabricate `template_selected` as if the user manually selected it;
- no `launch_*`, challenge-tracking, or demo-progress event is added without a separately identified measurement question.

---

# 12. Acceptance Criteria

## First-value / representative demo

**AC-01 — Preserve existing user work**  
Given a valid existing browser workflow, loading `/` does not replace it with the launch demo.

**AC-02 — Clean-session representative example**  
Given no valid saved browser workflow, `/` loads `Competitor Catalog Review Crew` and identifies it as an Example workflow.

**AC-03 — Canonical deterministic finding**  
On the clean representative example, Readiness contains `RDY_JSON_OUTPUT_SCHEMA_IMPLICIT` for `task-5` / `outputSchema`, with no new fabricated blocking error required.

**AC-04 — Demo guidance**  
The exact representative-example guide from §5.1 is visible in English/Japanese for the launch example and is not falsely shown for arbitrary imported/saved/manual workflows.

**AC-05 — Existing Preflight entry retained**  
`Run Preflight` remains the primary CTA and opens Unified Preflight without provider/billing dependency.

## Finding → manual improvement → verify

**AC-06 — Readiness discovery**  
The user can reach Readiness and the canonical finding using keyboard or pointer input.

**AC-07 — Field-aware Locate**  
Selecting Locate on the canonical finding opens Design, selects `Capture Normalized Catalog Snapshot`, opens Inspector, preserves review-return context, and focuses the `Output schema` textarea.

**AC-08 — Safe focus fallback**  
A field-level finding without a mapped editable control still completes existing Locate behavior and focuses a stable Inspector location; stale/missing targets refresh in place rather than navigating incorrectly.

**AC-09 — Manual fix changes deterministic evidence**  
After entering the fixed valid schema `{"sku":"string","price":"number","currency":"string","availability":"string"}`, deterministic re-evaluation no longer reports `RDY_JSON_OUTPUT_SCHEMA_IMPLICIT` for that target.

**AC-10 — Return / resolution continuity**  
After the edit, `Back to finding`/Preflight return reaches Readiness. If the item no longer exists, the UI focuses a stable Readiness location and announces that the previous item is no longer present; it never fuzzy-selects another finding.

## Ownership / regression

**AC-11 — JSON ownership**  
AgentGraph JSON export remains available after the manual fix, downloads a valid artifact, and round-trips through the existing contract.

**AC-12 — CrewAI ownership**  
Deterministic CrewAI Python export remains reachable after the manual fix through the existing validation/code-generation path.

**AC-13 — Protected free-core regression**  
Templates, JSON import/export, CrewAI Static Import, Visual Workflow Builder, Readiness, Execution Preview, Resource Analysis, Unified Preflight, first-value activation, language, accessibility, responsive behavior, and existing analytics remain operational.

## Evidence / authority / degraded behavior

**AC-14 — Evidence language remains truthful**  
The changed path continues to identify Preflight as deterministic/static and does not claim runtime execution, runtime observation, simulation, or runtime verification.

**AC-15 — Paid/provider isolation**  
With paid Architecture Review disabled/unavailable, the representative path through Readiness, manual Design improvement, re-evaluation, and export still completes without an Architecture Review/provider call.

**AC-16 — No authority expansion**  
No AI-generated improvement, Semantic Patch, automatic Apply, hidden semantic mutation, new provider/model behavior, persistence, or runtime-verification capability is introduced.

## Launch presentation

**AC-17 — Challenge attribution**  
Any Product-visible or social-preview challenge label uses the bounded attribution from §5.3 and does not say or imply that current runtime/Preflight is powered by Astra.

**AC-18 — Social metadata**  
A direct HTTP fetch of Production `/` after release exposes current title/description plus canonical/Open Graph/Twitter metadata referencing a repository-owned 1200×630 image with meaningful alt text and current Product claims only.

**AC-19 — Social asset independence**  
The social image/metadata renders without auth, paid entitlement, provider credentials, user workflow data, or external AI generation at request time.

## Accessibility / responsive / analytics

**AC-20 — Keyboard path**  
Keyboard-only interaction can complete `Overview → Preflight → Readiness → Locate → Output schema edit → return/re-evaluate → Export`, with visible focus and no focus trap.

**AC-21 — Mobile path**  
At 320×740, the new guide and changed flow produce no page-level horizontal overflow and primary actions remain reachable.

**AC-22 — Non-color status**  
Guide step order, finding state, focus, and resolution are understandable without color alone.

**AC-23 — Analytics preservation**  
Existing event contracts still fire at their current semantic points; no workflow/schema content is added to analytics and the auto-loaded default example does not emit a false manual-template-selection event.

## Contract / migration

**AC-24 — No domain/API/persistence migration**  
`GraphDocumentV1`, API surface, browser storage meaning, provider/data scope, and persistence architecture are unchanged.

---

# 13. Test Matrix

| Area | Required verification |
|---|---|
| Representative preset | Deterministic test proves `competitor-price-monitor` / `Competitor Catalog Review Crew` produces `RDY_JSON_OUTPUT_SCHEMA_IMPLICIT` at `task-5.outputSchema` before the fix. |
| Deterministic improvement | Apply the fixed test schema and prove that finding disappears while scaffold validation remains valid. |
| Saved workflow protection | Test existing valid browser storage is rehydrated and not overwritten by the launch demo. |
| Overview guide | UI/source/component test covers EN/JA exact intent, representative-only visibility, and no duplicate Preflight CTA. |
| Field-aware Locate | Integration test covers supported `outputSchema` field focus, fallback for unsupported field, and stale/missing target behavior. |
| Return/re-evaluate | Integration/E2E proves return context survives the edit and resolved-item behavior is stable/announced. |
| Export | Existing JSON roundtrip + CrewAI export tests remain green after the fix. |
| Metadata | Test title/description/canonical/OG/Twitter/image dimensions/alt and absence of unsupported Astra runtime wording. |
| Analytics | Existing analytics-contract tests remain green; no semantic content is added and default auto-load does not emit manual selection. |
| Accessibility | Keyboard focus assertions for Preflight heading/tabs, Locate destination field, return/re-evaluate, and Export. |
| Responsive | Existing Playwright `desktop-en` 1280×900 and `mobile-ja` 320×740 both execute the changed representative path or an equivalent focused launch-hardening E2E. |
| Failure isolation | Browser test blocks non-local/external requests and still completes deterministic free-core path, matching existing free-core harness policy. |
| Regression | `npm test`, `npm run typecheck`, `npm run build`, `npm run docs:check`, plus `npm run test:e2e` and `npm run verify` as applicable. |

C01 may add focused tests to existing files or a bounded new launch-hardening test file. Test organization is an engineering choice; the behavioral assertions above are authoritative.

---

# 14. Requirement traceability

| Requirement | Upstream authority / evidence | AC | Verification |
|---|---|---|---|
| Current implemented value, not feature breadth | Product Master + selected packet | AC-02–05 | representative-path E2E |
| Evidence Before Intelligence | Product/Architecture/Development Rules | AC-03, AC-09, AC-14 | Readiness deterministic tests + UI |
| Manual user-controlled improvement | Product Master + existing review journey | AC-07–10 | Locate/edit/re-evaluate E2E |
| Own / portable export | Product Master + completed review journey | AC-11–13 | JSON roundtrip + code export |
| No provider dependency in free core | Architecture + Development Rules + Program Board | AC-05, AC-15, AC-19 | external-request-blocked browser test |
| No AI/Mutation authority expansion | Execution Gate state + selected packet | AC-16 | diff review + QA |
| Existing user workflow protection | completed review journey + regression contract | AC-01, AC-24 | storage rehydration test |
| Launch first-view clarity | Production evidence F1/F2 | AC-02–04 | Overview UI + E2E |
| Finding-to-edit friction removal | Production revision evidence F3 | AC-07–10 | focus/navigation tests |
| Product Hunt/social presentation | selected packet + Production evidence F4 | AC-17–19 | metadata HTTP/build tests |
| Accessibility/responsive | Development Rules | AC-20–22 | Playwright desktop/mobile + keyboard |
| Analytics regression/privacy | Development Rules | AC-23 | analytics tests / source review |

---

# 15. C01 implementation boundaries

`C01` owns engineering decomposition. It does **not** need a new Product decision for this packet.

C01 must:

- re-check live `main` before implementation;
- keep changes bounded to the behaviors in §§3–5;
- reuse current Product surfaces/read models/navigation rather than introducing new domain architecture;
- preserve all protected regressions;
- add/update required tests;
- report any repository reality that makes an AC impossible without Product expansion.

C01 must return to `02` / `01` rather than silently expanding scope if implementation appears to require:

- a new persisted identity/state;
- a new provider/model call;
- changing Readiness rule meaning;
- a new Product workflow capability;
- broad onboarding infrastructure;
- paid-path enablement;
- AI proposal/mutation authority;
- runtime execution/verification.

No such Product blocker is known at specification time.

---

# 16. Independent QA scope (`W01` Pass A)

W01 must independently verify the exact candidate revision against at least:

1. AC-01–24;
2. required deterministic checks and Playwright changed-path coverage;
3. the representative finding before/fixed-after behavior;
4. keyboard and 320×740 responsive path;
5. social metadata and preview asset truthfulness;
6. no unsupported Astra/runtime claim;
7. no paid Architecture Review enablement or provider dependency;
8. no regression in imports/templates/exports/Preflight;
9. analytics privacy/semantic preservation;
10. no silent semantic mutation or persistence expansion.

Verdict remains `PASS`, `PASS WITH NOTES`, or `FAIL / BLOCKED`, with exact approved revision recorded.

---

# 17. Exact Production verification smoke (`W01` Pass B)

After C01 releases the exact QA-approved revision, W01 must:

1. verify latest GitHub `main`;
2. verify Vercel deployment is `READY`, `target=production`, correct Production domain, and:
   `GitHub main SHA = Vercel Production githubCommitSha`;
3. fetch `/` and verify title/description/canonical/OG/Twitter/image metadata;
4. use a clean browser context with no `agentgraph_active_flow`;
5. confirm `Competitor Catalog Review Crew` is the Example workflow and the launch guide is visible;
6. run Preflight and open Readiness;
7. confirm `JSON output schema is implicit` targets `Capture Normalized Catalog Snapshot`;
8. select Locate and confirm Design/Inspector opens with visible focus on `Output schema`;
9. enter the fixed valid schema;
10. return/re-evaluate and confirm that exact implicit-schema finding is absent;
11. export AgentGraph JSON and verify a valid artifact download;
12. open deterministic CrewAI Python export and verify it remains available under current validation;
13. repeat a focused mobile smoke at approximately the repository mobile harness viewport and confirm no horizontal overflow/action loss;
14. verify a saved-workflow context is not overwritten by the demo;
15. verify paid Architecture Review remains fail-closed unless its separate contract independently changed through its own lifecycle;
16. check relevant runtime/browser errors on the changed path.

Production verification must not infer runtime workflow behavior from static Preflight.

---

# 18. Non-repository launch assets / video dependency

Product Hunt listing copy, launch screenshots, and launch video are non-repository deliverables.

They are **not** permission for C01 to invent Product behavior. Their content must be captured/written from the Production-Verified behavior above.

Required launch-asset rule:

```text
Production-verified Product behavior
→ screenshots/video/copy
```

not:

```text
planned marketing claim
→ Product implementation or unsupported claim
```

External launch assets may say that AgentGraph Studio is launching for the GPT-6 Astra Challenge. They must not claim Astra runtime dependency, workflow execution, runtime verification, automatic improvement, paid availability, or future-stage capability unless separately true and verified at capture time.

Preferred owner after Production Verified: `00` / authorized launch operator. These assets are not C01 implementation AC beyond providing truthful repository-owned metadata/social image.

---

# 19. Definition of Ready resolution

| DoR item | Resolution |
|---|---|
| Exact launch user goal | Resolved in §1 |
| Representative first-value path | Resolved in §§3–4 |
| Production friction/evidence | Resolved in §2 with direct first-view Production evidence + same-revision interaction evidence; scripted public navigation limitation recorded |
| Included / Out of Scope | Resolved in §§6–7 |
| Exact UX/UI behavior | Resolved in §§4–5 |
| Primary/loading/error/empty/stale/degraded | Resolved in §8 |
| Domain/data/API impact | No domain/API expansion; §9 |
| Persistence impact | None; existing browser storage semantics preserved; §9 |
| Security/privacy/provider impact | No new flow/provider; §9 |
| AI Authority | Unchanged |
| Mutation Authority | Unchanged / none added |
| Migration/backward compatibility | No schema migration; saved browser workflow protected |
| Accessibility | Resolved in §10 |
| Responsive | Resolved in §10 |
| Analytics | No additive events; preservation contract in §11 |
| Acceptance Criteria | AC-01–24 |
| Test Matrix | §13 |
| Browser coverage | Existing desktop-en/mobile-ja Playwright harness + W01 Production smoke |
| Requirement traceability | §14 |
| Independent QA scope | §16 |
| Production verification smoke | §17 |
| External launch asset/video dependency | §18 |

**Definition of Ready: SATISFIED.**

No unresolved Product decision blocks implementation.

---

# 20. Lifecycle / handoff

This packet is now:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started   ← next
→ C01 Implementation Complete
→ W01 QA Complete
→ C01 merge/release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete
```

`Specified` is specification maturity, not implementation, QA, release, Production verification, launch success, Stage/Gate promotion, paid readiness, Commercial Validation Gate M0, or authority expansion.

The still-open paid Architecture Review lifecycle remains separate and unchanged.
