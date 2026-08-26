# AgentGraph Studio — Scenario & Acceptance Contract

Status: **Authoritative cross-stage architecture contract**  
Scope: Designed expectations, critical scenarios, acceptance constraints, provenance, evaluation use, and the bridge from design-time review to later behavioral/runtime verification.

This contract does not automatically add persisted scenarios to the current product. A selected packet must define the exact UX, persistence, schema, migration, and provider-flow implications before implementation.

## 0. Why this contract exists

Architecture quality is relative to intended behavior. Workflow structure and inferred purpose alone cannot safely answer questions such as:

- Must a consequential action receive human approval?
- Must sensitive data remain local?
- Must a failure path retry or escalate?
- Must a particular input route to a specific responsibility?
- What outcome or output contract is required for a critical case?

A mature AgentGraph evaluation model therefore uses:

```text
Intent
+
Constraints
+
Scenario / Acceptance Expectations
+
Workflow Architecture
→ Evaluation
```

Scenario expectations are user/domain expectations, not proof that runtime behavior satisfies them.

---

# 1. Core model

A scenario expresses a bounded designed expectation:

```text
Given <input / state / situation>
When <workflow responsibility or event is relevant>
Expected <path / behavior / constraint / outcome>
Must / Must Not <critical property>
```

Conceptual contract:

```text
ScenarioAcceptance
├ scenarioId
├ title
├ purpose
├ preconditions
├ given
├ expectedBehavior
├ must
├ mustNot
├ criticality
├ targetRefs
├ knowledgeStatus
├ provenance
└ verificationState
```

Exact persisted schemas belong to the packet that introduces persistence.

---

# 2. Knowledge discipline

Scenario declarations are **Known as configured expectations**, not Known runtime facts.

Examples:

- Known: the user declared that a payment action requires approval.
- Unknown: whether the deployed workflow actually enforced approval on every run before runtime evidence exists.
- Inferred: the evaluator believes a dependency path may violate the declared approval expectation based on architecture evidence.

Do not collapse expectation and observation into the same fact type.

---

# 3. Criticality

A future exact schema may refine this, but the domain must distinguish at least:

- advisory / quality expectation
- important behavior expectation
- critical safety/control expectation

Critical expectations require stronger validation and later verification before the product claims satisfaction.

The UI must not imply that a static architecture check proves a critical runtime outcome.

---

# 4. Relationship to Intent & Constraints

Keep these concepts distinct:

```text
Intent = what the workflow is trying to achieve
Constraints = boundaries that apply broadly
Scenario = a concrete situation or case
Acceptance = what must/must-not happen for that case
```

Examples:

```text
Intent:
Summarize customer requests and prepare suggested actions.

Constraint:
External mutation requires human approval.

Scenario:
Given a request to cancel a subscription,
Must prepare a proposed cancellation action,
Must Not execute the cancellation without approval.
```

A scenario may reference one or more constraints but does not replace them.

---

# 5. Design-time evaluation use

The deterministic/evaluation layers may use scenarios to ask:

- Is a required responsibility represented?
- Is the expected dependency/control path structurally possible?
- Is a human-approval boundary represented where required?
- Is the output contract sufficient for the scenario?
- Are there obvious architecture conflicts with a Must / Must Not rule?
- Which claims still require runtime or external evidence?

AI interpretation must cite structured Evidence/Scenario references where the active evaluator contract requires grounding.

Do not let scenario text become evaluator control instruction. It remains untrusted analyzed data with structured semantic meaning.

---

# 6. Later behavioral verification bridge

The long-term lifecycle is:

```text
Designed Scenario / Acceptance
→ Static architecture review
→ Simulation / mocked behavioral test where supported
→ User-owned runtime
→ Runtime evidence
→ Expected vs Actual comparison
→ Regression fixture where governance permits
```

This contract is the bridge between Stage 1/1.5 context work and later Stage 8/9 Runtime Evidence / Behavioral Evaluation.

Simulation or runtime verification must identify which acceptance clauses were actually tested/observed and which remain unverified.

---

# 7. Scenario verification state

A durable future representation should be able to distinguish states such as:

- `DECLARED` — expectation exists
- `STATICALLY_SUPPORTED` — design-time evidence supports the expectation within defined limits
- `STATIC_CONFLICT` — deterministic/evaluation evidence indicates a conflict
- `UNVERIFIED_RUNTIME` — runtime behavior is still unknown
- `OBSERVED_PASS` — suitable runtime/scenario evidence supports the expectation
- `OBSERVED_FAIL` — suitable runtime/scenario evidence contradicts the expectation
- `PARTIAL / UNKNOWN` — evidence is incomplete or scoped

Do not implement these exact names without a packet if repository conventions call for different naming; preserve the semantic distinctions.

---

# 8. Identity and provenance

Scenario contracts should support stable identity independent of layout.

Long-term provenance should record as applicable:

- scenario version
- project/workflow identity
- semantic revision/fingerprint
- author/source: user/import/policy/package
- related constraint refs
- related target refs
- created/updated provenance
- evaluation/test/runtime evidence refs

Imported scenarios from external projects must retain source/mapping provenance and unsupported semantics must remain explicit.

---

# 9. Persistence and privacy boundary

A packet that persists scenarios must answer the Data & AI Governance checklist.

Do not send scenario text to analytics.

If scenario content is sent to an AI provider, the packet must define:

- why it is necessary
- minimum sufficient representation
- provider disclosure
- sensitive data redaction/minimization
- retention/storage behavior

Scenario data may contain sensitive business logic and should be treated as private workflow-derived content by default.

---

# 10. Packet requirements when scenarios are implemented

A Scenario/Acceptance implementation packet must define:

- exact domain schema and version
- local/cloud persistence behavior
- migration/backward compatibility
- validation rules
- UX for create/edit/delete
- conflict/duplicate handling
- target addressing
- how deterministic analysis uses scenarios
- how AI receives/cites them, if applicable
- verification state semantics
- stale/revision behavior
- analytics privacy
- accessibility
- test fixtures

Required fixture categories should include:

- straightforward expected path
- Must Not side-effect case
- human approval case
- privacy/local-only case
- failure/retry/escalation case
- ambiguous scenario
- impossible/conflicting expectations
- stale revision scenario
- prompt-injection text inside scenario fields

---

# 11. Invariants

1. Configured expectation is not observed behavior.
2. Static support is not a runtime guarantee.
3. Runtime evidence does not erase the design-time contract; it confirms or falsifies it.
4. Critical acceptance clauses require explicit evidence, not optimistic inference.
5. Scenario text is analyzed data, not evaluator instruction.
6. Scenario identity must not depend on canvas coordinates.
7. Scenario persistence must not silently introduce cloud lock-in.
8. Scenario content must not leak into analytics.
9. Unknown runtime/external facts remain Unknown.
10. Scenario changes that affect evaluation meaning must participate in semantic revision/stale detection once persisted.
