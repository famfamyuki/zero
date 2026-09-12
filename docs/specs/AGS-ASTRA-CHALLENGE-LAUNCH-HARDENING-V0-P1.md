# AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1 — GPT-6 Astra Challenge Launch Hardening

Status: **Selected**  
Selection owner: `01 — Product Architecture & Roadmap`  
Next owner: `02 — UX & Implementation Specification`  
Selected: **2026-09-12**  
Timebox: **Product Hunt GPT-6 Astra Challenge launch on 2026-09-18**  
Decision class: **Bounded launch hardening; no roadmap promotion or authority expansion**

This packet records the user-authorized, time-boxed selection to harden the current AgentGraph Studio free-core experience for the September 18 GPT-6 Astra Challenge launch. It is a launch-readiness packet, not a new roadmap stage, not a replacement for the still-open paid Architecture Review lifecycle, and not permission to pull future roadmap capabilities forward.

---

# 0. Selection summary

The selected direction is:

```text
Current Production free-core capability
→ representative first-value path
→ remove launch-critical UX friction
→ preserve deterministic evidence boundaries
→ independently verify changed behavior
→ present the real Product clearly on launch day
```

The launch should demonstrate the current Product North Star through implemented behavior where available:

```text
Understand
→ Evaluate
→ Improve manually
→ Verify again
→ Own / export
```

The goal is not to maximize feature count before September 18. The goal is to make the existing Product value understandable, credible, and easy to experience without weakening Product, Architecture, Security/Data, AI/Mutation authority, or QA/release governance.

---

# 1. Goal and user problem

A first-time visitor arriving from Product Hunt should be able to understand what AgentGraph Studio is for, enter a representative workflow, inspect its structure and deterministic Preflight evidence, make or understand a manual improvement path, re-verify, and reach portable export without unnecessary confusion.

The launch problem is therefore primarily one of **first-value clarity, coherent demonstration, and release confidence**, not missing roadmap breadth.

`02` must turn this selection into an implementation-ready specification with concrete flows, states, Acceptance Criteria, tests, and Production verification requirements before `C01` begins behavior-changing implementation.

---

# 2. Included scope for specification

`02` should specify the smallest coherent set of changes needed for launch readiness, considering at minimum:

- one representative demo / first-value workflow path using current supported capabilities;
- Overview → Design → Preflight → finding/evidence → manual improvement → re-evaluation → export continuity;
- removal of launch-critical navigation, comprehension, empty-state, CTA, labeling, or first-run friction discovered by walking the actual Production path;
- truthful challenge/build attribution and launch metadata only where it does not imply unsupported runtime use of Astra;
- Product Hunt / social preview metadata and first-view presentation where repository-owned;
- responsive, keyboard, focus, accessible-name, status, and non-color-only communication regression protection;
- existing analytics / first-value event preservation and only minimal additive instrumentation if a concrete launch question requires it;
- representative browser and Production smoke coverage for changed paths;
- launch-day failure isolation so deterministic free-core value does not depend on paid Architecture Review, billing, entitlement, quota, or AI-provider availability.

The current `Competitor Catalog Review Crew` example may be considered as a representative demo candidate. It is **not** fixed by this selection; `02` may retain it or choose an existing alternative if that improves first-value clarity without expanding Product semantics.

---

# 3. Explicit Out of Scope

This time-boxed launch packet does **not** authorize:

- adding GPT-6 Astra or any other model as a new Production runtime dependency merely for the contest;
- changing the Production Architecture Review provider/model without the normal evaluator-governance path;
- enabling the paid Architecture Review public offer, Stripe launch, entitlement/quota bypass, or PAUC AC-30 shortcuts;
- Stage 1.5 Project/Workspace, persisted Intent/Constraints, revision/history, or other adoption/context capabilities not separately selected;
- Stage 2 Guided Improvement or any stronger AI proposal authority;
- Semantic Patch generation, automatic Apply, or silent semantic mutation;
- runtime execution, runtime observation, managed agents, or sandbox-assisted verification;
- new persistence, account/cloud state, collaboration, RBAC, or Team/Enterprise capability;
- framework expansion beyond current supported Product boundaries;
- arbitrary execution of imported Python or other user-authored code;
- broad visual redesign unrelated to launch-critical first value;
- commercial roadmap promotion or Commercial Validation Gate M0 conclusions.

No marketing deadline weakens existing release, security, data, evaluator, or mutation gates.

---

# 4. Fixed Product and architecture boundaries

The packet must preserve:

- `Simplest Sufficient Architecture`;
- `Evidence Before Intelligence`;
- deterministic analysis ownership of deterministic facts;
- `Known / Inferred / Unknown`;
- deterministic / heuristic / external-dependent distinctions;
- configured expectation ≠ static evidence ≠ observed runtime behavior;
- no unsupported runtime/external claim as fact;
- no silent semantic mutation;
- user-controlled semantic change;
- CrewAI-first without core-domain lock-in;
- no silent lossy conversion;
- imported/user-authored text remains untrusted analyzed data;
- secrets, credentials, tokens, provider responses, imported source, and full Evidence payloads are not exposed through analytics or launch diagnostics;
- deterministic free-core behavior remains available when paid/provider systems are disabled or unavailable;
- existing Visual Workflow Builder, templates, JSON import/export, CrewAI static import, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python export remain protected unless the specified packet explicitly narrows a change with regression evidence.

AI Authority and Mutation Authority remain **unchanged**.

---

# 5. Relationship to the open commercial lifecycle

The existing Stage 1 Architecture Review / Paid Access public-launch lifecycle remains open and blocked on its documented Production prerequisites and first-launch procedure gap.

This launch-hardening packet is allowed only as a bounded parallel packet because it can improve first-value clarity and free-core launch readiness without satisfying, bypassing, reclassifying, or weakening the paid-launch requirements.

```text
Commercial paid-launch lifecycle
= remains OPEN / BLOCKED / fail-closed

Astra Challenge launch hardening
= SELECTED / specification pending
= free-core and presentation scope only
```

The two paths may proceed in parallel only while their authority, release evidence, and blockers remain explicit and independent.

---

# 6. Definition of Ready for `02`

Before moving this packet to **Specified**, `02` must resolve or explicitly declare not applicable:

- exact launch user goal and representative path;
- current Production friction/evidence observed on that path;
- Included / Out of Scope behavior;
- exact UX changes and all loading/empty/error/degraded states touched;
- domain/API/data impact;
- persistence impact;
- security/privacy/provider boundary;
- AI Authority and Mutation scope confirmation;
- migration/compatibility impact;
- accessibility/responsive requirements;
- analytics regression/additive event requirements;
- Acceptance Criteria and requirement traceability;
- test plan and browser coverage;
- Independent QA scope;
- exact Production verification smoke path;
- launch-asset / video dependencies that are non-repository deliverables.

If the review discovers a missing Product decision rather than a UX/specification detail, return to `01` instead of inventing behavior in `02` or `C01`.

---

# 7. Required lifecycle and release path

Behavior-changing work follows the normal lifecycle:

```text
01 Selected
→ 02 Specified
→ C01 Implementation Started
→ C01 Implementation Complete
→ W01 QA Complete
→ C01 merge / release exact QA-approved revision
→ W01 Production Verified
→ 00 Sprint Complete for this bounded packet
```

A passing implementation self-test is not Independent QA. Deployment READY is not Production Verified. If code or behavior changes after QA Complete, fresh QA is required.

Normal behavior-changing implementation must preserve the repository-required verification path, including:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

plus `npm run verify` / packet-defined checks when applicable.

---

# 8. Launch-readiness outcome

The desired September 18 outcome is evidence that:

- the public Product still reflects current implemented capability rather than future-state claims;
- a first-time visitor can follow one coherent first-value path through the current free core;
- deterministic evidence remains clearly distinguished from runtime truth;
- manual improvement and re-verification are understandable where demonstrated;
- portable export / ownership is reachable and works on the representative path;
- changed paths have independent QA and Production verification evidence;
- Product Hunt launch assets and video describe the same real behavior as Production;
- the paid Architecture Review path remains fail-closed unless its separate launch contract is independently satisfied;
- no Stage, Gate, AI Authority, or Mutation Authority is promoted merely because the contest launch succeeded.

After the launch, evidence from this packet may inform later Product/UX decisions, but it does not automatically select Stage 1.5, Stage 2, paid expansion, or any authority increase.
