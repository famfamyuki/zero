# AGS-PRODUCT-IDENTITY-REVIEW-JOURNEY-UX-V0-P1

Status: **Specified**  
Owner: **02 — UX & Implementation Specification**  
Selected by: **01 — Product Architecture & Roadmap**  
Decision class: **HARDEN_FIRST**  
Specification baseline: GitHub `main` at `2946f325e3e8c335b5c81cc5e656ea25c7152713`  
Authority activation: this packet becomes the active implementation authority only after this docs-only change is merged to `main`; live repository/Production reality still supersedes this baseline if it changes before C01 starts.

Selected packet direction:

> Existing-Capability Product Identity & Review Journey UX Restructuring

---

## 0. Authority, Current State, and non-authorities

This packet implements the boundary selected in `docs/roadmap/PROGRAM_BOARD.md` and must be read under:

- `docs/PRODUCT_MASTER.md`;
- `docs/ARCHITECTURE.md`;
- `docs/DEVELOPMENT_RULES.md`;
- `docs/ENGINEERING_EXECUTION_GOVERNANCE.md`;
- `docs/roadmap/MASTER_ROADMAP.md`;
- `docs/roadmap/EXECUTION_GATES.md`;
- relevant architecture/data/security contracts.

The competitive research at commit `df18ef5b1c953531c15834b66ef57bed1073a508` is supporting evidence only. It is not Product, Architecture, Roadmap, Current State, or packet authority and does not expand this scope.

At this baseline, `docs/CURRENT_STATE.md` still contains the older post-CrewAI `DEFER / no immediate 02 handoff` snapshot. The newer and authoritative `PROGRAM_BOARD.md` records `HARDEN_FIRST`, the packet direction above, and `Immediate 02 handoff = YES`. This packet therefore proceeds from Program Board authority. Reconciliation of `CURRENT_STATE.md` is **00 pending** and is not performed by 02.

Fixed authority state for this packet:

```text
Stage 1 Architecture Review = FAIL-BLOCKED / QA incomplete
Gate A                      = NOT REACHED
Additional Stage 1.5        = NONE
Gate B                      = NOT REACHED
Stage 2                     = NOT SELECTED
AI Authority                = UNCHANGED
Mutation Authority          = UNCHANGED
```

No screen or copy introduced by this packet may present the held Stage 1 Architecture Review as a Production capability or present deterministic Preflight as AI Review.

---

## 1. Problem and Product intent

AgentGraph Studio is a **Portable AI Workflow Architecture Engineering Toolchain**. The current Production experience, however, visually centers the large Canvas, CrewAI-specific wording, Node Palette, and builder actions. A first-time user can reasonably interpret the Product as a `CrewAI Visual Workflow Builder + Preflight`.

This packet does not remove or reduce the importance of the Canvas. It changes the Product hierarchy so the current capabilities tell the intended Product story:

```text
Workflow Artifact
→ Understand
→ Evaluate
→ manual Improve
→ Verify
→ Own
```

The Canvas is specified as the workflow artifact's **Design view**, not as the Product itself and not as the only Home/entry surface.

CrewAI remains the deepest supported source/target in the current Product:

```text
CrewAI-first
≠ CrewAI-only Product identity
≠ claim of generic multi-framework support
```

### 1.1 Success condition

Without adding a new Product capability, a user must be able to answer:

1. What can I bring into AgentGraph Studio now?
2. What workflow artifact am I looking at?
3. What is statically known, inferred, or unknown?
4. Where do I understand/edit the workflow?
5. Where do I run deterministic Preflight?
6. How do I move from a finding to the relevant editable target and back?
7. How do I verify the graph again after a manual change?
8. How do I take the artifact/runtime source back out of the Product?

---

## 2. Scope

### 2.1 Included

This packet includes only existing-capability UX/IA hardening:

1. Product positioning/value hierarchy on the existing editor route.
2. Entry hierarchy for:
   - supported CrewAI Python source;
   - AgentGraph JSON;
   - Example / Template;
   - Manual Design.
3. Current-capability expression of `Entry → Understand → Evaluate → Improve → Verify → Own`.
4. Canvas positioning as a first-class **Design** view.
5. Unified Preflight positioning as a first-class **Preflight** review view.
6. Workflow Overview/Understand composition using only current graph/import/preflight read models.
7. Current journey clarification:
   `Import → Mapping where applicable → Apply where applicable → Preflight → Locate → Edit → Re-evaluate → Export`.
8. Readiness finding anatomy and consistent deterministic Evidence/Unknown presentation.
9. Epistemic/evidence visual vocabulary without new persisted domain status.
10. Existing Locate/focus hardening using current node/edge/crew addressing plus session-only return context.
11. Mobile review-first action hierarchy and overflow removal.
12. Accessibility/focus/announcement behavior for the restructured surfaces.
13. Minimal analytics compatibility required by changed placement.
14. Regression protection for all current builder/import/export/preflight capabilities.

### 2.2 Explicit Deferred

The following are not implemented or implied by this packet:

- Project / Local Workspace;
- browser/cloud/project persistence expansion;
- persistent Project identity;
- persistent Workflow identity;
- semantic Revision identity;
- Revision History;
- Evaluation History;
- Review Delta;
- persisted Intent & Constraints;
- Scenario / Acceptance persistence;
- full Outline;
- full workflow Search;
- broad large-workflow navigation;
- Scoped Evidence;
- scoped Architecture Review;
- Runtime Evidence;
- CLI / CI;
- Build Manifest;
- portable project bundle;
- framework-neutral IR;
- second framework;
- collaboration;
- team workspace;
- generic/multi-framework import;
- broader CrewAI import support.

The IA may leave room for future surfaces but must not create inactive controls, fake tabs, empty routes, schemas, persistence, or claims for these deferred capabilities.

### 2.3 Conditional — return to 01 instead of deciding in C01

If implementation cannot satisfy this packet without any of the following, C01 must stop and return the question to 01 through 02:

- new Project / Workflow / Revision identity;
- new persistence model or durability level;
- new cloud/account data boundary;
- UI-only additions to semantic/domain schemas;
- new persistent issue-to-target navigation architecture;
- full Search / Outline;
- Scoped Evidence;
- `GraphDocumentV1` change;
- Graph / Workflow V2;
- new AI/provider call;
- provider-disclosure expansion;
- held Stage 1 Architecture Review functionality;
- AI improvement proposal;
- AI-generated workflow changes;
- Semantic Patch / Apply;
- source write-back;
- import source-boundary expansion.

Return format:

```text
Known:
Reason:
Blocked specification area:
Smallest Product question for 01:
```

No such blocker is known at specification time.

---

## 3. Verified implementation and Production baseline

At the specification baseline:

- `/` is a single editor page and already owns the current graph state.
- no Project/Workflow persistent identity exists;
- `GraphDocumentV1` is schema version 1;
- the current graph is browser-locally rehydrated from `agentgraph_active_flow` when available;
- otherwise the first preset is loaded as the initial example;
- Preflight activation persistence uses `agentgraph_preflight_activation_v0` and remains unchanged;
- CrewAI Static Import is local/static, does not execute Python, and exposes a session-only mapping report before Apply;
- CrewAI mapping states are `MAPPED`, `MAPPED_WITH_INFERENCE`, `LOSSY`, `UNKNOWN`, `UNSUPPORTED` with a separate `KNOWN / INFERRED / UNKNOWN` knowledge axis;
- Unified Preflight is deterministic composition of Readiness, Execution Preview, and Resource Analysis;
- Readiness auto-refreshes after graph edits with the current debounce behavior and exposes `isRefreshing`;
- Locate already resolves current crew/node/edge targets, selects/focuses the Canvas target, and opens relevant Inspector context where possible;
- current Locate closes Preflight and therefore loses visible finding context;
- Python export uses the existing validation/code-generation contract;
- JSON export remains the current portable Graph artifact path.

Observed Production at `https://zero-six-khaki.vercel.app/` on this baseline:

- title: `AgentGraph Studio | Preflight Engineering for CrewAI Workflows`;
- header/value copy emphasizes `CrewAI`, `Visual Design`, `Deterministic Python Export`;
- the desktop workspace is visually dominated by Node Palette + large Canvas;
- Preflight is entered through a small Canvas-level floating action rather than being a peer Product surface;
- mobile exposes a horizontally scrolling action toolbar containing Palette, Templates, JSON Import, CrewAI Import, Export Code, and Inspector;
- a fixed mobile support banner competes with workspace/review height;
- Preflight itself already has Overview/Readiness/Execution/Resources tabs and useful static/runtime disclaimers;
- the Production deployment is `READY`, target `production`, and its `githubCommitSha` equals the specification baseline main SHA;
- no runtime-error clusters were reported in the checked previous 24-hour window.

---

## 4. Simplest Sufficient Architecture

### 4.1 Route and domain rule

Keep the existing routes and current domain contracts.

- `/` remains the Product/editor route.
- `/templates` remains the existing template-library route.
- no new Project, Review, History, Build, or Workspace route is created.
- no URL is treated as persistent workflow/revision identity.
- no evaluator/read-model schema is changed merely to support layout.

### 4.2 UI-only surface state

The editor route may introduce a presentation-only state:

```ts
type EditorSurface = 'overview' | 'design' | 'preflight';
```

This state:

- is not serialized into `GraphDocumentV1`;
- is not persisted as workflow semantics;
- may reset to `overview` on a new page session;
- cannot participate in validation, Preflight, import mapping, or code generation.

A second presentation-only session state may retain the current entry origin when the origin is known from an action performed in the current browser session:

```text
example | template | crewai_python | agentgraph_json | manual | existing_browser_workflow
```

This is presentation provenance only. It must not claim historical source provenance after reload. If a graph was merely rehydrated from current local browser state, display **Current browser workflow** and explicitly do not infer whether it originally came from CrewAI, JSON, a template, or manual editing.

### 4.3 Session-only review return context

Locate may retain a non-persisted `ReviewReturnContext` sufficient to reopen the same Preflight stage and attempt to focus the same current presentation item.

Allowed inputs are current read-model identifiers already present in memory, such as:

- Readiness: `ruleId` + current target;
- Execution: current task/agent/tool/crew target plus the existing locate-source category;
- Resources: hotspot `kind` + current target.

It must not create stable Product identity, be serialized, survive reload, or become a revision/history mechanism.

If the item no longer exists after an edit/re-evaluation, return to the relevant Preflight stage heading and announce that the previous review item is no longer present. Do not attempt fuzzy identity recovery.

### 4.4 Reuse rule

C01 should prefer:

```text
current page state + current components + current read models
→ composition changes
→ small presentation primitives where useful
→ no new domain architecture
```

Reasonable small presentation components include `WorkflowOverview`, `ProductSurfaceNav`, `ReviewReturnBar`, and evidence/status badges. They must not absorb domain/evaluator logic.

---

## 5. Information Architecture

The current Product maps to the North Star as follows:

| Product step | Current-capability surface | Meaning in this packet |
| --- | --- | --- |
| Entry | Overview | Choose/understand an existing supported way to get a workflow into the current browser session. |
| Understand | Overview + Design | Read source/mapping context where known, graph counts/structure, deterministic execution structure, limitations, and the visual graph. |
| Evaluate | Preflight | Deterministic Unified Preflight: Readiness, Execution Preview, Resource Analysis. |
| Improve | Design + Inspector | User-controlled manual graph/config editing only. |
| Verify | Preflight + existing validation | Automatic/current deterministic refresh, explicit Re-evaluate, validation/export eligibility. No runtime verification. |
| Own | Export actions | AgentGraph JSON portability and deterministic CrewAI Python export. |

### 5.1 Top-level Product shell

The `/` route exposes three peer surfaces:

```text
Overview | Design | Preflight
```

`Export` remains an ownership action, not a fourth persistent workspace.

The Product shell therefore reads:

```text
AgentGraph Studio
Portable AI Workflow Architecture Engineering Toolchain

Overview | Design | Preflight                         Export | More
```

Do not add future `Changes`, `Evidence`, `Build`, `History`, or `Runtime` navigation in this packet.

### 5.2 Default surface

After browser-state hydration, the default Product surface is **Overview**.

This does not clear or recreate the existing graph. The current example or rehydrated graph remains loaded exactly as it does now.

- If no previous browser workflow exists, Overview identifies the already-loaded default preset as an **Example workflow**.
- If a current graph is rehydrated, Overview identifies it only as **Current browser workflow**.

Existing Preflight first-value activation semantics remain active. The one-shot activation prompt moves into the Overview composition rather than depending on a Canvas-first impression; its storage key/version and existing `source = activation_prompt` analytics semantics do not change.

---

## 6. Product positioning and copy hierarchy

### 6.1 Metadata

Replace builder-first metadata with current-capability Product meaning.

**Page title**

```text
AgentGraph Studio | Workflow Architecture Preflight & Portable Export
```

**Meta description**

```text
Understand, evaluate, and manually improve AI workflow architecture with deterministic Preflight. Import supported CrewAI Python or AgentGraph JSON, review static evidence, then export portable JSON or deterministic CrewAI Python.
```

This must not claim generic framework import or runtime verification.

### 6.2 Header identity

Primary brand: `AgentGraph Studio`

Product descriptor:

```text
Portable AI Workflow Architecture Engineering Toolchain
```

Support qualifier, shown in Overview orientation copy rather than as a false compatibility badge:

```text
CrewAI-first today · AgentGraph JSON portable artifact
```

Remove `100% Free Tool` from the primary Product-identity slot. Free/support messaging may remain secondary and must not outrank workflow understanding/review.

### 6.3 Overview orientation copy

English:

**Heading:** `Understand the workflow before you run it.`  
**Body:** `Bring a supported CrewAI source, AgentGraph JSON, an example, or a manual design. Review deterministic readiness, execution structure, and resource implications; improve the workflow manually; verify again; export what you own.`

Japanese:

**Heading:** `実行する前に、ワークフローを理解する。`  
**Body:** `対応するCrewAIソース、AgentGraph JSON、Example、またはManual Designから始めます。決定論的なReadiness・実行構造・リソース上の含意を確認し、手動で改善し、再評価して、所有できる形式でエクスポートします。`

### 6.4 CTA hierarchy

For a non-empty/evaluable graph:

1. Primary: **Run Preflight / Preflightを確認**
2. Secondary: **Open Design / Designを開く**
3. Tertiary: **Start or replace / 開始・置換**
4. Ownership: **Export**
5. Utility/support: **More**

For an empty graph, Entry actions become primary and Preflight displays the existing empty/not-evaluable state rather than pretending useful review exists.

---

## 7. Entry hierarchy

Overview contains a `Start from what you have / 手元のものから始める` section.

Order is fixed:

### 7.1 Supported CrewAI Python source

Label: `CrewAI Python`  
Helper: `Supported direct-constructor subset. Static analysis only; Python is not executed.`  
Action: existing CrewAI `.py` file picker.

Flow:

```text
Select source
→ CrewAI Static Import Mapping Review
→ READY/BLOCKED
→ explicit Apply when READY
→ Overview current-artifact summary
→ Preflight
```

The Mapping Review remains mandatory before graph mutation. `BLOCKED` remains fail-closed. Mapping/provenance remains session-only.

### 7.2 AgentGraph JSON

Label: `AgentGraph JSON`  
Helper: `Open a portable AgentGraph workflow artifact.`  
Action: existing JSON import.

Flow:

```text
Select JSON
→ existing deserialize/schema validation + existing replace confirmation
→ graph applied
→ Overview
→ Preflight
```

Do not invent a mapping report for AgentGraph JSON.

### 7.3 Example / Template

Label: `Example / Template`  
Helper: `Review the loaded example or choose an existing starter template.`

- the default preset remains loaded when there is no saved browser graph;
- `Browse templates` continues to use the current `/templates` route;
- template semantics/data do not change;
- loading behavior must retain existing template contracts.

### 7.4 Manual Design

Label: `Manual Design`  
Helper: `Use the Design view to add and connect Agent, Task, and Tool nodes manually.`

Action enters Design. Starting from a truly empty graph uses existing clear/replace behavior and confirmation semantics; this packet does not create a Project or a new document.

### 7.5 Replacement safety

This packet does not silently normalize import/template replacement semantics beyond current contracts. C01 must preserve the existing confirmations/fail-closed behavior of each current path unless a separate explicit spec changes them.

---

## 8. Overview / Understand surface

Overview is a presentation composition over existing state; it is not a new semantic summary domain.

### 8.1 Current artifact card

Show only deterministic/current-session information available now:

- current workflow name from `crewConfig.name`;
- current presentation origin when known in this session;
- otherwise `Current browser workflow`;
- Agent / Task / Tool counts from current graph/read model;
- process (`sequential` or `hierarchical`) when available;
- mapping summary and `View mapping report` only while a CrewAI import report exists in the current session;
- Unified Preflight overall state using the existing `refreshing / empty / invalid / partial / available` projection;
- current ruleset/read-model versions where the corresponding stage result exists;
- Python export validation status using the existing validation contract, never a new eligibility algorithm.

### 8.2 Source/mapping truthfulness

Examples:

- `CrewAI Python · Supported subset · Mapping Ready` is allowed immediately after a current-session CrewAI Apply.
- `AgentGraph JSON` is allowed after current-session JSON import.
- `Example` / template name is allowed when that current-session action is known.
- after reload, if only browser-local Graph state is available, use `Current browser workflow` and a helper such as `Original source is not retained in the current Graph artifact.`

Never reconstruct or persist source provenance that does not exist.

### 8.3 Structure summary

A compact Understand block may show:

```text
Agents N · Tasks N · Tools N · Process <value>
```

When Execution Preview is valid/available, it may additionally show the current deterministic execution-step count or a short `Static execution plan available` link into Preflight/Execution.

Do not create a full Outline, graph Search, semantic module system, or inferred-purpose summary.

### 8.4 Static limitation

Overview must state, in concise product copy:

```text
Preflight is static and deterministic. It does not execute or simulate the workflow, and runtime behavior is not observed here.
```

Japanese equivalent is required.

---

## 9. Design surface — Canvas as Design view

### 9.1 Meaning

`Design` is the current Canvas + manual authoring/inspection surface.

- Canvas remains the primary visual editing/comprehension tool inside Design.
- Node Palette remains available only as Design-support UI, not Product-level identity.
- Inspector remains the parameter/config editing surface.
- Crew Global Config remains accessible through Inspector.
- current React Flow behavior, node/edge semantics, zoom, fit, minimap, fullscreen, drag/drop, undo/redo, node editing/deletion, and connection behavior remain protected.

### 9.2 Desktop composition

At `lg` and wider (`>= 1024 CSS px`):

```text
Product header / surface nav
Current artifact context + optional ReviewReturnBar
-----------------------------------------------------
Palette |             Canvas              | Inspector*
```

`Inspector*` opens only when current behavior requires it. Palette may keep the existing desktop width/open behavior in this packet; landing on Overview is sufficient to remove Palette/Canvas from Product-level first impression, so a palette rewrite is not required.

At `md` (`768–1023 CSS px`), Palette and Inspector become explicit drawers/panels rather than consuming enough width to make the Canvas unusable. Primary surface navigation must remain visible and must not require horizontal scrolling.

### 9.3 Preflight relationship

Remove the implication that Preflight is only a floating Canvas utility. Primary access is the Product surface navigation and Overview CTA.

A compact current-analysis status/action may still exist inside Design, but it must say **Preflight** and link to the same deterministic review surface; it is secondary to the Product-level navigation.

---

## 10. Preflight surface — Evaluate and Verify

### 10.1 First-class surface

Unified Preflight becomes the `/` route's `preflight` surface rather than a side overlay whose primary visual context is the Canvas.

Reuse its current stage model:

```text
Overview | Readiness | Execution | Resources
```

Do not add an Architecture Review/AI tab.

### 10.2 Desktop

At `>= 768 CSS px`, Preflight occupies the main workspace as a review surface with a readable content width; the Canvas is not required behind it.

The current stage content, evaluation hooks, result states, ruleset/read-model versions, disclaimers, retry, validation routing, and Re-evaluate behavior remain the source of truth.

### 10.3 Verify semantics

Verification in this packet means only:

- existing deterministic validation;
- automatic/current deterministic analysis refresh already provided by existing hooks;
- explicit `Re-evaluate`;
- display of current analysis/read-model versions;
- current Python export eligibility through existing validation.

Do not use `Verified` to mean observed runtime success.

While current analysis is refreshing after an edit, show presentation wording `Updating after edit` / `編集後に更新中` derived from the existing `isRefreshing` state.

When refreshing completes, presentation wording may say `Current for this workflow state` / `現在のワークフロー状態に対する結果`. This is ephemeral UI wording, not a semantic revision identity or persisted verification record.

---

## 11. Finding and review-item presentation

Do not create a universal persisted Finding schema. Normalize presentation only where existing read models safely support it.

### 11.1 Readiness finding anatomy

Every Readiness card uses the following visible hierarchy:

```text
What
Impact
Where
Why
Evidence
Next (only when provided)
Details
```

`Unknown` is shown only where the current data explicitly supports it; Readiness does not currently have a per-finding Unknown field, so runtime limitation remains stage-level rather than being fabricated per card.

| Anatomy field | Existing source | Requirement |
| --- | --- | --- |
| What | translated `titleKey` | **Mandatory** |
| Why | translated `explanationKey` | **Mandatory** |
| Where | `target` + current target summary | **Mandatory**; graph target renders Whole workflow |
| Impact | `impact` | **Mandatory**; retain current non-blocking Readiness meaning |
| Evidence basis | `source` + `ruleId`; validation code when applicable | **Mandatory in Details** |
| Structured Evidence | `evidence` | **Optional**; render structured key/value when present; do not invent values |
| Next | translated `suggestionKey` | **Optional**; omit if absent |
| Unknown | no current field | **Unavailable per finding**; do not synthesize |
| Category | `category` | available for grouping/filter/context |

Do not use raw `JSON.stringify` as the primary human-readable Evidence presentation. Existing evidence keys/values may be rendered as a bounded definition list. The underlying data remains unchanged.

If `suggestionKey` is absent, do not invent a generic recommendation. The absence of a `Next` block is the correct no-data behavior.

### 11.2 Resource hotspots

Resource hotspots are deterministic static review items, but they do not have Readiness severity/recommendation fields.

| Anatomy concept | Existing source | Requirement |
| --- | --- | --- |
| What | `hotspot.kind` → fixed UI label | mandatory presentation |
| Why | fixed explanatory copy for that known metric/kind | allowed presentation derivation; no new domain field |
| Where | `target` | mandatory |
| Impact | unavailable | do **not** invent severity; label neutrally as Hotspot |
| Evidence | `value` plus already-available summary/binding values when relevant | mandatory value; optional supporting values |
| Next | unavailable | do not invent recommendation |
| Unknown | stage `unknowns` list | present at stage level, not attached to arbitrary hotspot |

### 11.3 Execution Preview

Execution Preview is not a finding list. Do not force finding anatomy onto it.

Retain deterministic structure facts such as:

- plan order/task;
- fixed vs manager-delegated assignment;
- context task refs;
- direct tools;
- configured async/output/human-input properties;
- agents/tools/manager;
- read-model version.

Use `Configured` / `Static plan` vocabulary where it clarifies that these are design-time facts. Preserve the current statement that nothing is executed or simulated.

### 11.4 Validation

Validation remains the existing blocking code-generation contract. Overview/Preflight may expose status/count/route-to-validation, but this packet does not replace `ValidationIssue` or create a new validation schema.

### 11.5 CrewAI mapping diagnostics

Mapping diagnostics remain an Understand/import concern, not Preflight findings.

Always keep separate:

- mapping `status` (`MAPPED`, `MAPPED_WITH_INFERENCE`, `LOSSY`, `UNKNOWN`, `UNSUPPORTED`);
- `knowledge` (`KNOWN`, `INFERRED`, `UNKNOWN`);
- `blocking`;
- source provenance where present;
- target where present.

No status is silently converted into another axis for visual simplicity.

---

## 12. Epistemic and Evidence visual vocabulary

These are distinct axes.

### 12.1 Knowledge axis

```text
Known
Inferred
Unknown
```

Meaning:

- **Known** — directly represented by current source/configuration or deterministically established within the current static contract.
- **Inferred** — the current mapping/evaluation explicitly marks an inference; inference is not displayed as declared truth.
- **Unknown** — current static/configured evidence cannot establish the fact.

### 12.2 Evaluation-method axis

```text
Deterministic
Heuristic
External-dependent
```

This is not a replacement for Known/Inferred/Unknown.

Current Unified Preflight content in this packet is deterministic. Do not add a `Heuristic` badge unless an existing current read model actually identifies a heuristic. External-dependent is useful for runtime facts that static analysis cannot establish.

### 12.3 Evidence-context wording

Display wording may use:

```text
Configured
Static
Observed
Not observed
```

These are presentation vocabulary, not new persisted domain states.

Invariants:

```text
Configured expectation ≠ Static evidence ≠ Observed runtime behavior
Static support         ≠ runtime guarantee
Not observed           ≠ failed
Unknown                ≠ inferred negative
```

Current Product has no Runtime Evidence capability. Therefore `Observed` must not appear as if runtime evidence exists. A concise `Runtime: Not observed` or equivalent limitation is permitted when useful.

### 12.4 Examples

- Crew process setting: `Configured` + `Known`.
- deterministic Execution Preview step order: `Static` + `Deterministic` + `Known within the current static model`.
- CrewAI `MAPPED_WITH_INFERENCE`: `Static mapping` + `Deterministic mapping procedure` + `Inferred knowledge`.
- runtime cost/latency/token use: `Unknown` + `External-dependent` + `Not observed`.

---

## 13. Locate → target → edit → return

### 13.1 Current contract preserved

Use the current target/addressing contracts only:

- crew;
- node id;
- edge id where currently supported;
- current field context where already represented.

Do not add path identity, semantic module identity, persistent target identity, or fuzzy search.

### 13.2 Required interaction

```text
Preflight review item
→ Locate
→ Design surface
→ existing target selection/focus
→ relevant Inspector context where current contract supports it
→ ReviewReturnBar remains visible
→ manual edit if desired
→ Back to finding
→ Preflight stage/item if still present
→ Re-evaluate/current result
```

### 13.3 Highlight

- Node target: use existing selected-node visual state and Canvas focus event.
- Edge target: use existing selected-edge state/focus.
- Crew/config target: open current Inspector/global configuration focus.
- Do not implement new path/ancestor/dependency emphasis in this packet.

### 13.4 ReviewReturnBar

The Design surface shows a non-persisted context bar after Locate, for example:

```text
From Preflight · Readiness · <finding title>      Back to finding
```

or the corresponding Execution/Resources label.

If current analysis is refreshing after an edit, append `Updating after edit` without claiming a persisted stale revision.

### 13.5 Return behavior

- `Back to finding` reopens the stored Preflight stage.
- If the current item can be matched using its session-only presentation key, focus it.
- If not, focus the stage heading and announce `The previous review item is no longer present after the workflow changed.`
- The return context is cleared when the user explicitly starts/replaces the workflow, closes it through a clear-context action, or the referenced target can no longer be resolved.

### 13.6 Screen-reader feedback

Locate must announce through an existing/new polite live region:

- located target label/type;
- whether Inspector opened;
- that `Back to finding` is available.

Failure/stale target must use the current refresh behavior and announce that the target changed and review was refreshed.

---

## 14. Desktop UX details

### 14.1 Header

At `>= 1024px`:

- Brand/Product descriptor on left.
- `Overview / Design / Preflight` as the primary workspace navigation.
- `Export` as the primary ownership action on the right.
- `More` contains lower-priority utilities/actions currently competing in the header, including supported import/start actions, templates, clear, settings where appropriate, language, and support.
- Do not make import/export/support buttons visually equivalent to the three Product surfaces.
- no header horizontal scrolling.

At `768–1023px`:

- retain the three surface choices in a compact form;
- group utility actions under `More`;
- avoid `overflow-x-auto` as the normal navigation model.

### 14.2 Export control

`Export` exposes the current ownership paths:

- `AgentGraph JSON`;
- `CrewAI Python`.

JSON behavior is unchanged. CrewAI Python uses the existing validation/code export modal and may route the user to blockers rather than inventing a second eligibility check.

### 14.3 Panels/dialogs

- CrewAI Mapping Review remains a modal dialog and retains focus trap/Escape/return-focus behavior.
- Code Export remains a modal dialog.
- Palette/Inspector are Design-support panels.
- Preflight is a Product surface, not a modal dialog.
- only one major modal/panel should own keyboard focus at a time.

---

## 15. Mobile review-first hardening

Mobile target: `< 768 CSS px`.

The goal is not desktop authoring parity. Priority is:

```text
Understand
→ Review
→ Locate
→ Inspect
→ take the next safe action
```

### 15.1 Primary mobile navigation

Replace the current horizontally scrolling multi-action toolbar with one fixed-width, non-scrolling three-choice surface navigation:

English:

```text
Overview | Design | Preflight
```

Japanese compact visible labels may be:

```text
概要 | 設計 | レビュー
```

with full accessible names identifying Preflight.

All three controls must fit at `320 CSS px` without horizontal page/action-bar overflow.

### 15.2 Mobile Overview

- Entry cards stack vertically.
- Current artifact summary appears before secondary utilities.
- Primary next action is Preflight when meaningful review exists.
- Export and replacement actions are explicit within Overview/More, not part of a six-button horizontal scroller.

### 15.3 Mobile Design

- Canvas gets the main viewport.
- Provide at most the small set of Design-context actions required to open Add/Palette and Inspector; they must not recreate the current six-action overflow row.
- Palette opens as the existing mobile drawer/sheet pattern.
- Inspector opens as the current mobile panel/sheet pattern.
- Preflight is entered through primary surface navigation.
- safe-area padding is required for bottom navigation.

### 15.4 Mobile Preflight

Preflight occupies the main content surface rather than an `80dvh` bottom sheet competing with Canvas/support UI.

- stage tabs may scroll internally if necessary, but the page/primary action row must not overflow;
- findings and Details remain one-column;
- Locate switches to Design and centers/focuses the target;
- ReviewReturnBar remains reachable without covering Inspector controls;
- Re-evaluate remains a minimum 44×44 CSS px touch target.

### 15.5 Support placement

Remove the fixed mobile support banner from the workspace viewport.

Support remains available through `More` and/or a non-sticky Overview footer. This preserves the support capability while removing competition with review/workspace height.

Analytics for the new mobile placement is defined in section 18.

---

## 16. State model and transitions

No new semantic state machine is introduced. The following table specifies presentation behavior over current state.

| State | Existing truth | Required surface behavior |
| --- | --- | --- |
| Default example | no rehydrated graph; current first preset already loaded | Overview default; identify as Example; primary next = Preflight; Design available |
| Current browser workflow | Graph rehydrated from existing localStorage | Overview default; do not infer original source |
| Blank | current graph has no meaningful nodes/tasks | Entry dominates; Preflight shows existing empty/not-evaluable behavior |
| CrewAI mapping review | `CrewAIImportResult` exists before Apply | modal; show READY/BLOCKED, mapping status, knowledge, provenance; no graph mutation before Apply |
| Unsupported/Unknown mapping | current diagnostic status/knowledge | explicit; Apply remains blocked whenever current result state is BLOCKED |
| CrewAI applied | READY result explicitly applied | current graph replaced per current contract; Overview may show session-only CrewAI/mapping context |
| AgentGraph JSON imported | existing deserialize accepted and graph applied | Overview may show session-only AgentGraph JSON origin |
| Template/example selected | current preset/template graph applied | retain template behavior; surface transition depends on initiating context, without new persistence |
| Design/manual edit | current graph mutation through existing editor | Design active; Preflight hooks refresh as now |
| Finding selected | current review item activated | visually selected within Preflight; Locate available according to current target contract |
| Target located | current node/edge/crew target resolved | Design active; existing selection/focus; Inspector when relevant; ReviewReturnBar shown |
| Edited / refreshing | existing Preflight hook `isRefreshing` after graph change | `Updating after edit`; do not claim persisted stale revision |
| Re-evaluated/current | existing evaluator refresh completes or explicit Re-evaluate | show current status/version from current read models |
| Python exportable | existing export validation permits current mode | existing Code Export flow |
| Python non-exportable | existing validation blocks current production export | route to existing validation/blocker UI; no duplicate eligibility algorithm |
| JSON export | current graph serializable under existing Graph V1 contract | existing JSON export |

Surface transition rules:

- new/reloaded session → Overview after hydration;
- Overview primary review CTA → Preflight;
- Overview Design CTA → Design;
- Locate → Design with return context;
- Back to finding → Preflight;
- import mapping modal Cancel → prior surface/focus;
- CrewAI Apply from Overview entry → Overview with mapping summary/next Preflight;
- manual palette/node actions occur only in Design;
- Export does not silently change the active Product surface except where existing blocker navigation requires Design/validation.

---

## 17. Accessibility contract

### 17.1 Surface navigation

Use semantic navigation with the active surface exposed (`aria-current="page"` or an equivalent correct tab pattern). Do not mix tab semantics with route semantics inconsistently.

Keyboard order:

1. skip/main landmark if present;
2. brand/global utilities;
3. Product surface navigation;
4. current surface heading/actions;
5. surface content;
6. contextual panels/dialogs when opened.

### 17.2 Focus movement

- activating a Product surface moves focus to that surface heading only when the action causes a major context change; ordinary pointer changes must not create focus traps;
- opening Preflight from Overview/activation prompt focuses the Preflight heading, preserving the current useful behavior;
- closing a modal returns focus to its invoking control;
- Locate moves focus using the current Canvas/Inspector focus events and announces the result;
- Back to finding restores the item if present, otherwise the stage heading;
- Escape closes only the currently active dismissible modal/drawer, not the whole Product surface.

### 17.3 Preflight tabs

Preserve current `tablist / tab / tabpanel`, roving `tabIndex`, Arrow/Home/End keyboard behavior, and visible focus.

### 17.4 Finding controls

- Details exposes `aria-expanded` and an associated content region.
- Locate has a target-specific accessible label when possible, e.g. `Locate <target label> in Design`.
- impact color is never the only indicator; text label remains.
- Known/Inferred/Unknown and other evidence vocabulary always uses text, not icon/color alone.

### 17.5 Touch and motion

- interactive touch targets: minimum `44 × 44 CSS px`;
- no horizontal page overflow at 320px;
- respect `prefers-reduced-motion`; target focusing/selection must not require animated pan/zoom to be understood;
- confetti/template behavior is existing behavior and is not expanded by this packet; any newly introduced transition must be non-essential and reduced-motion safe.

---

## 18. Analytics and privacy

### 18.1 Existing analytics preserved

Keep existing events and semantics, including:

- `template_selected`;
- `json_imported`;
- `crewai_imported`;
- `preflight_review_opened`;
- `preflight_activation_prompt_shown`;
- `preflight_first_value_reached`;
- `preflight_review_stage_selected`;
- `readiness_opened`;
- `readiness_finding_selected`;
- `execution_preview_opened` / `execution_preview_located`;
- `resource_analysis_opened` / `resource_analysis_hotspot_selected`;
- `preflight_review_re_evaluated`;
- `code_generated` / `code_downloaded`;
- support/affiliate events.

The existing activation-storage version and activation analytics do not change solely because the entry UI moves from Canvas-first to Overview-first.

### 18.2 New event decision

**No new analytics event is required for this v0.** Existing events are sufficient to observe entry, first Preflight value, finding/Locate use, re-evaluation, and export without adding instrumentation merely because the layout changed.

One existing categorical property must be extended because the mobile support placement changes:

```text
buymeacoffee_clicked.placement
existing: header | mobile_sticky
add:      mobile_more
```

Retain `mobile_sticky` in the allowlist/type for historical compatibility even when the new UI stops emitting it.

Product question: `Does moving support out of the fixed workspace preserve support engagement without consuming review space?`  
Reason: attribution would otherwise become false after placement changes.

### 18.3 Privacy boundary

No analytics event/property may include:

- workflow/source text;
- file names/paths;
- CrewAI source bodies;
- mapping diagnostic details;
- Evidence bodies;
- node/edge IDs;
- finding text;
- prompt/model output content;
- tool parameters/secrets.

Continue current allowlist sanitization.

---

## 19. Data, Security, AI, and Mutation impact

### 19.1 Data

No new Product data class is introduced.

- `GraphDocumentV1` unchanged.
- current local graph storage unchanged.
- current Preflight activation persistence unchanged.
- CrewAI diagnostics/provenance remain session-only.
- new surface/origin/return-context state is presentation-only in memory and not part of workflow export.
- no new cloud/account storage.

### 19.2 Security

- no new file type or import boundary;
- imported CrewAI Python remains untrusted data and is not executed;
- no new network/provider request;
- no new logging of workflow/source content;
- no new CORS/auth/account surface;
- no raw content in analytics.

### 19.3 AI Authority

Unchanged. This packet adds no AI invocation, review, recommendation, provider disclosure, or evaluator authority.

### 19.4 Mutation Authority

Unchanged. Improve remains explicit user-controlled manual editing through current editor controls. There is no proposal generation, Semantic Patch, automated apply, or source write-back.

---

## 20. Migration and backward compatibility

No persisted schema migration is permitted or required.

Required compatibility:

- existing localStorage Graph V1 payloads rehydrate unchanged;
- existing JSON imports/exports remain byte/semantic-contract compatible except for nondomain presentation that is not serialized;
- CrewAI Static Import accepted/rejected fixture behavior is unchanged;
- mapping diagnostics/fail-closed Apply unchanged;
- deterministic CrewAI Python generation unchanged;
- existing template graph data unchanged;
- existing Preflight rule/read-model versions unchanged unless a separate deterministic-analysis change is explicitly specified;
- current language selection and EN/JA support remain available;
- historical analytics property `mobile_sticky` remains accepted even if no longer emitted.

No migration banner or conversion step is added.

---

## 21. Regression constraints

Unless this packet explicitly changes presentation hierarchy, preserve:

- Visual Builder semantics and editing behavior;
- Templates and template route/data;
- JSON Import / Export;
- CrewAI Static Import v0;
- CrewAI mapping diagnostics/provenance and fail-closed Apply;
- deterministic CrewAI Python Export;
- Readiness engine semantics;
- Execution Preview semantics;
- Resource Analysis semantics;
- Unified Preflight orchestration;
- existing validation semantics;
- Preflight first-value activation behavior/storage semantics;
- accessibility behaviors not explicitly improved here;
- responsive behavior outside the specified hierarchy/overflow changes;
- analytics allowlist/privacy boundary;
- supported language behavior;
- existing security/data boundaries.

No Product-identity copy may claim:

- generic CrewAI project import beyond the supported subset;
- a second framework;
- runtime execution/simulation/verification;
- AI Architecture Review availability;
- persistent Projects/History;
- automatic improvement.

---

## 22. Acceptance Criteria

### AC-01 — Product identity

**Given** Production loads `/`  
**When** a user reads the first Product-level heading/descriptor  
**Then** AgentGraph Studio is presented as a workflow architecture engineering/preflight toolchain, not primarily as a visual builder, while CrewAI-first current support remains explicit and no generic framework claim appears.

### AC-02 — Existing graph preserved on new shell

**Given** the current default example or a valid rehydrated Graph V1 exists  
**When** the restructured page initializes  
**Then** the graph data is unchanged and Overview is the default presentation surface.

### AC-03 — Entry choices

**Given** Overview is active  
**Then** CrewAI Python, AgentGraph JSON, Example/Template, and Manual Design are discoverable with distinct reasons to choose them and no Project/Workspace option appears.

### AC-04 — CrewAI mapping remains fail-closed

**Given** a CrewAI import result is `BLOCKED`  
**When** Mapping Review is shown  
**Then** Apply remains unavailable and no graph mutation occurs.

### AC-05 — Mapping epistemics preserved

**Given** CrewAI diagnostics contain inference/unknown/lossy/unsupported states  
**Then** mapping status and knowledge status remain distinguishable and neither is silently collapsed into a success state.

### AC-06 — No invented provenance

**Given** a workflow is rehydrated only from existing local Graph storage  
**Then** Overview says `Current browser workflow` (or localized equivalent) and does not claim the original source/import method.

### AC-07 — Canvas is Design

**Given** Design is active  
**Then** the existing Canvas, Palette, Inspector, graph controls, manual edits, undo/redo, zoom/minimap/fullscreen, and current node/edge semantics remain functional.

### AC-08 — Preflight is first-class

**Given** a workflow exists  
**When** the user activates Preflight from Product navigation or the Overview CTA  
**Then** Unified Preflight is shown as the main review surface with Overview/Readiness/Execution/Resources and no AI Architecture Review surface.

### AC-09 — Readiness anatomy

**Given** a Readiness finding  
**Then** What, Why, Where, Impact, deterministic basis (`source`/`ruleId`), and optional structured Evidence/Next are presented according to section 11, with no fabricated Unknown or recommendation.

### AC-10 — Resource hotspot truthfulness

**Given** a Resource hotspot  
**Then** its kind, target, and value are shown without inventing Readiness severity or an unsupported recommendation, and runtime Unknowns remain stage-level.

### AC-11 — Execution is not mislabeled as a finding

**Given** Execution Preview  
**Then** configured/static plan facts are shown as structure facts and the UI still states that nothing is executed or simulated.

### AC-12 — Locate context survives surface change

**Given** a locatable current Preflight item  
**When** Locate succeeds  
**Then** Design becomes active, the existing target is selected/focused, relevant Inspector context opens where supported, a ReviewReturnBar identifies the originating review context, and a polite announcement describes the result.

### AC-13 — Back to finding

**Given** a Locate return context exists  
**When** the user activates Back to finding  
**Then** the corresponding Preflight stage reopens and focus returns to the current item when it still exists; otherwise focus moves to the stage heading with an explicit changed-item announcement.

### AC-14 — Edit/re-evaluate semantics

**Given** a user manually edits a located target  
**When** deterministic analyses refresh  
**Then** the UI uses current `isRefreshing` state to say Updating after edit and does not create or imply semantic Revision identity/history.

### AC-15 — Export semantics unchanged

**Given** the current graph  
**When** Export is opened  
**Then** AgentGraph JSON uses current serialization and CrewAI Python uses current validation/code-generation behavior; no new exporter or eligibility algorithm is introduced.

### AC-16 — Mobile no primary-action overflow

**Given** a `320px` or `390px` viewport  
**When** `/` is used on Overview, Design, or Preflight  
**Then** primary surface navigation fits without horizontal page/action-bar overflow and the former six-action horizontal toolbar is not required for core navigation.

### AC-17 — Mobile review area

**Given** mobile Preflight is active  
**Then** review occupies the main usable surface and no fixed support banner consumes review height.

### AC-18 — Touch/accessibility

**Given** mobile or keyboard-only operation  
**Then** primary controls have at least 44×44 CSS px targets, focus is visible, Preflight tabs remain keyboard operable, modal focus behavior remains correct, and Locate/return actions produce screen-reader feedback.

### AC-19 — Evidence vocabulary

**Given** any use of Known/Inferred/Unknown or Configured/Static/Observed wording  
**Then** the axes remain semantically distinct and no static result is presented as observed runtime behavior.

### AC-20 — Analytics privacy

**Given** restructured interactions and support placement  
**When** analytics are emitted  
**Then** existing allowlisted events continue to work, `mobile_more` is the only required categorical placement addition, and no raw workflow/source/Evidence/identifier content is transmitted.

### AC-21 — Language behavior

**Given** EN or JA is active  
**Then** all new Product-shell, Entry, evidence, Locate-return, empty/error/current-state, and mobile labels have equivalent supported-language copy and do not fall back to mixed-language Product-critical text.

### AC-22 — Authority boundary

**Given** the completed UI  
**Then** Stage 1 Architecture Review remains unavailable/held, Gate A/Gate B/Stage 2 remain unreached/unselected, and AI/Mutation Authority remain unchanged.

---

## 23. Test plan

### 23.1 Unit / component

Add or extend tests for:

- Product title/descriptor and absence of overclaims;
- Overview Entry ordering/copy;
- session-origin truthfulness and rehydrated unknown-origin wording;
- surface navigation state;
- Readiness anatomy mapping, including evidence-present/evidence-absent/suggestion-absent cases;
- Resource hotspot no-invented-severity behavior;
- evidence vocabulary labels;
- ReviewReturnContext match/not-found behavior;
- mobile support placement analytics property sanitation;
- EN/JA new copy keys.

### 23.2 Integration

Cover:

1. default example → Overview → Preflight;
2. Overview → Design → manual edit → Preflight current refresh;
3. CrewAI source → mapping READY → Apply → Overview → Preflight;
4. CrewAI BLOCKED → no Apply/no graph mutation;
5. AgentGraph JSON import → Overview → Design/Preflight;
6. template route/current template load regression;
7. Readiness Locate node → Inspector → edit → Back to finding → re-evaluate;
8. Readiness Locate edge → Canvas edge focus → Back to finding;
9. Execution Locate task/agent/tool/crew regression;
10. Resource hotspot Locate regression;
11. target removed/changed before return → stage fallback announcement;
12. Python export valid/blocked behavior unchanged;
13. JSON round-trip unchanged.

### 23.3 Existing suites that must remain green

At minimum retain/extend the current coverage represented by:

- `tests/product_positioning.test.ts`;
- `tests/preflight_activation.test.ts`;
- `tests/preflight_activation_ui.test.ts`;
- `tests/readiness_engine.test.ts`;
- `tests/readiness_ui.test.ts`;
- `tests/execution_preview.test.ts`;
- `tests/execution_preview_ui.test.ts`;
- Resource Analysis / Unified Preflight suites present on current main;
- `tests/crewai_import.test.ts`;
- `tests/crewai_import_ui.test.ts`;
- `tests/graph_json_roundtrip.test.ts`;
- deterministic/codegen/transpiler suites;
- `tests/analytics_privacy.test.ts`.

### 23.4 Accessibility verification

Independent QA must check at least:

- keyboard-only surface navigation;
- Preflight tab Arrow/Home/End behavior;
- focus entry/return for Preflight, CrewAI Mapping Review, Code Export, Palette/Inspector drawers;
- Locate target focus + live announcement + Back to finding;
- Details `aria-expanded` behavior;
- visible focus at all interactive controls;
- 200% zoom usability where applicable;
- reduced-motion setting;
- no color-only meaning.

### 23.5 Responsive verification

Minimum viewports:

- `320 × 568`;
- `390 × 844`;
- `768 × 1024`;
- `1024 × 768`;
- `1440 × 900`.

Check no primary horizontal overflow, review height, safe-area/bottom navigation behavior, Canvas usability, Palette/Inspector access, import dialogs, and code-export modal.

### 23.6 C01 implementation-complete commands

C01 must run the current governance commands at the implementation revision:

```text
npm ci
npm run docs:check
npm test
npm run typecheck
npm run build
```

No implementation self-test may be reported as independent QA.

---

## 24. Independent QA and Production verification contract

W01 must independently verify the exact C01 implementation revision before release.

Production Verified requires all of:

1. latest GitHub `main` identified;
2. QA-approved implementation revision identified;
3. Vercel deployment `READY`;
4. deployment target = `production`;
5. correct Production domain = `https://zero-six-khaki.vercel.app/`;
6. GitHub main SHA = Vercel Production `githubCommitSha`;
7. actual Production smoke at desktop and mobile viewports;
8. relevant runtime errors checked;
9. Product identity/Entry/Design/Preflight/Locate-return/Export smoke completed;
10. regression smoke for Templates, JSON, CrewAI Import, Python Export, Readiness, Execution Preview, Resource Analysis, Unified Preflight, accessibility, language, analytics privacy.

Production smoke must specifically verify:

```text
Overview default
→ current artifact understood
→ Preflight
→ finding Locate
→ Design target + Inspector
→ manual edit
→ Back to finding
→ current/re-evaluated Preflight
→ Export
```

and CrewAI:

```text
Import CrewAI
→ Mapping Review
→ fail-closed or Apply as fixture dictates
→ Preflight
```

Release execution is not Production Verified. Any behavior/code change after QA approval invalidates that QA approval and requires re-verification.

---

## 25. Traceability

| Selected requirement | Packet sections | Verification |
| --- | --- | --- |
| Product positioning/value hierarchy | 1, 5, 6 | AC-01, product-positioning tests, Production smoke |
| Supported Entry hierarchy | 7 | AC-03–06, integration |
| Canvas as Design view | 9 | AC-07, responsive/regression |
| current journey | 5, 7, 10, 13, 16 | AC-08, AC-12–15 |
| finding anatomy | 11 | AC-09–11 |
| epistemic/evidence vocabulary | 12 | AC-19 |
| Locate hardening | 13 | AC-12–14, accessibility |
| mobile review-first | 15 | AC-16–18 |
| accessibility | 17 | AC-18, accessibility QA |
| analytics privacy | 18 | AC-20, analytics privacy tests |
| data/security/authority boundaries | 19 | AC-22, review |
| backward compatibility/regressions | 20, 21 | existing regression suites |
| release/Production verification | 23, 24 | W01 evidence |

---

## 26. Definition of Ready conclusion

### Product / dependency

- Selected Product problem: defined by `PROGRAM_BOARD.md`.
- scope/out of scope/conditional triggers: defined.
- no future-stage capability is required.

### Domain / architecture

- no Graph V2;
- no GraphDocumentV1 change;
- no evaluator/read-model semantic change required;
- presentation-only surface/origin/return context explicitly bounded;
- current routes/components/contracts reused.

### Data / security

- no new persistence/cloud/account boundary;
- no new import/file type;
- no new provider/AI call;
- analytics remains metadata-minimal;
- current local/static CrewAI security boundary unchanged.

### UX / quality

- desktop/mobile IA, states, focus, finding anatomy, no-data behavior, responsive breakpoints, language behavior, and accessibility are specified.

### Release

- Acceptance Criteria, regression suites, C01 completion commands, independent QA, and Production verification are specified.

**Result: packet content is Specified and implementation-ready.**

Governance handoff rule:

```text
This packet merged to latest main
→ 02 Specified authority active
→ C01 may start the bounded implementation
```

Until the packet is merged into `main`, C01 must not treat the branch-only document as active repository authority. This packet itself does not start C01, run QA, merge/release implementation, or change Production.
