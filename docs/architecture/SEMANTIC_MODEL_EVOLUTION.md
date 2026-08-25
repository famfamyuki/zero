# AgentGraph Studio — Semantic Model Evolution Plan

Status: **Authoritative architecture migration direction**  
Scope: Evolution from the current `GraphDocumentV1` / graph structures toward a durable workflow semantic model without speculative rewrite or silent compatibility breakage.

This document is a migration runway, not permission to implement Graph V2 in the current packet.

## 0. Core principle

Current repository reality wins. `GraphDocumentV1` remains authoritative wherever the active packet says it remains unchanged.

The goal is to reduce future migration cost while avoiding a premature rewrite.

```text
Current Graph V1
→ Canonical Semantic Projection
→ Stable identities/fingerprints
→ Additive contracts where sufficient
→ Explicit version migration only when required
```

---

# 1. Target conceptual model

Long-term direction remains:

```text
WorkflowDocument
├ identity
├ metadata
├ intent
├ semanticGraph
├ organization
├ layout
├ targetProfile
├ policyRefs
└ revision
```

These fields describe architectural boundaries, not a required immediate persisted schema.

---

# 2. Separate semantic and presentation identity

Maintain the invariant:

```text
Semantic meaning ≠ layout/presentation state
```

Semantic changes may include:

- agent/task/tool meaning
- assignments
- dependency/context relationships
- output contracts
- execution-relevant configuration
- declared intent/constraints
- policy/approval requirements

Presentation-only changes may include:

- coordinates
- viewport
- non-semantic collapse state
- visual hints

A layout-only edit should not invalidate semantic evaluation/revision identity when no semantic meaning changed.

---

# 3. Canonical semantic projection first

Before introducing a new persisted document version, prefer a deterministic projection from current source into a canonical semantic representation when that is sufficient.

The projection should support, over time:

- deterministic fingerprints
- Evidence generation
- semantic diff
- target addressing
- import mapping
- compatibility checks
- headless analysis

It must not silently invent missing semantics.

---

# 4. Identity model direction

Future contracts should distinguish:

- `workflowIdentity` — stable logical workflow identity across revisions where appropriate
- `semanticRevision` or equivalent — exact semantic state identity
- `layoutRevision` or non-semantic state — optional, separate when needed
- target/entity stable identity — agents/tasks/tools/modules where a durable identity is necessary

Do not use visual coordinates or array ordering as durable semantic identity.

Before safe transformation, proposals/patches must bind to a semantic revision/fingerprint so stale application is rejected.

---

# 5. Additive-before-breaking rule

Prefer additive evolution when it does not create ambiguity.

Examples:

- derived canonical projection without changing exported V1
- versioned evaluation artifacts outside Graph JSON
- optional project metadata outside the workflow document
- new versioned import diagnostics

A breaking persisted schema version is justified only when additive representation would create unacceptable ambiguity, semantic loss, or long-term architectural debt.

---

# 6. Explicit trigger for Graph/Workflow V2

Do not create V2 simply because the target architecture is known.

Consider a new persisted version only when one or more mature requirements cannot be represented safely through current + additive contracts, such as:

- persisted declared Intent/Constraints that must round-trip authoritatively
- semantic revision/history requiring durable identity beyond current structure
- reusable semantic modules/ports
- policy references/capability declarations
- canonical framework-neutral semantics that V1 cannot represent without silent loss
- a Project/Workspace contract requiring a clean durable separation impossible in V1

A V2 decision requires an ADR and migration packet.

---

# 7. V2 migration requirements

Any future V2 packet must define:

- accepted V1 inputs
- accepted V2 inputs
- deterministic normalization/migration
- ambiguous/unsupported legacy cases
- export behavior
- round-trip expectations
- whether V1 export remains available
- unknown field handling
- version detection
- id/revision mapping
- semantic fingerprint behavior
- representative legacy fixtures
- rollback implications

Never silently reinterpret old workflow meaning.

---

# 8. Canonicalization requirements

Canonicalization used for fingerprinting/diff must specify:

- ordering rules
- ignored presentation fields
- normalization of semantically equivalent optional/default values
- identifier treatment
- version salt/source versions where needed

Canonicalization changes that alter fingerprints materially must be versioned so old evaluation/revision artifacts are not falsely treated as matching.

---

# 9. Semantic diff direction

Primary user model should be domain-level changes, not line-based JSON diff.

Examples:

- agent added/removed/changed
- task changed/split/merged
- dependency added/removed
- assignment changed
- tool binding changed
- output contract changed
- intent/constraint changed
- approval/policy changed

A raw JSON diff may remain an advanced/debug artifact, not the semantic source of truth.

---

# 10. Import relationship

External import should map into the same canonical semantic boundaries instead of creating framework-specific internal models.

Import output must preserve:

- source provenance
- mapping status
- Unknown/inferred/lossy semantics
- target identity mapping where possible

Dynamic or unresolvable external behavior must not be fabricated into V1/V2 certainty.

See `docs/architecture/IMPORT_WORKSPACE_CONTRACT.md`.

---

# 11. Framework-neutral relationship

Do not introduce a broad neutral IR before target capability/lossiness contracts mature.

Preferred sequence:

```text
Current source semantics
→ canonical semantic boundaries
→ target capability/lossiness
→ minimal neutral IR when justified
```

The semantic model should avoid unnecessary CrewAI lock-in, but CrewAI-first support remains a valid current product choice.

---

# 12. Test requirements for semantic evolution

When a semantic contract changes, tests should cover as applicable:

- V1 fixture compatibility
- semantic fingerprint stability
- layout-only invariance
- intentional semantic-change fingerprint change
- round-trip
- migration idempotence
- unknown/unsupported behavior
- import provenance retention
- codegen regression
- Evidence regression
- analytics privacy regression

---

# 13. Decision rule

When choosing between `extend V1`, `derive canonical data`, or `introduce V2`, choose the simplest option that:

1. preserves semantic correctness
2. avoids silent loss
3. supports required identity/provenance
4. minimizes future migration cost
5. preserves current user artifacts

Do not optimize for conceptual elegance at the cost of unnecessary current migration.
