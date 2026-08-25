# AgentGraph Studio — Import, Workspace & Revision Contract

Status: **Authoritative architecture direction for Adoption & Context Foundation**  
Scope: Existing-project import, mapping diagnostics, Project/Workspace identity, persistence boundaries, revision compatibility, and local-first ownership.

This document does not select or implement these capabilities by itself. It defines the contract future Stage 1.5 packets must use.

## 0. Product objective

The adoption wedge is:

> Bring an existing or newly designed workflow and reach useful architecture review quickly without recreating the system manually.

Import and Workspace must strengthen `Understand → Evaluate → Improve → Verify → Own`, not create a second incompatible product model.

---

# 1. Import principles

- static analysis first
- never execute arbitrary imported project code merely to understand it
- preserve provenance
- distinguish Known / Inferred / Unknown
- expose mapping/lossiness
- never silently rewrite the original external project
- map into canonical AgentGraph semantic boundaries
- framework-specific parsing must not define the core domain model

---

# 2. Supported-source contract

Every import adapter version must explicitly define:

- supported framework/source type
- supported framework versions or version-detection policy
- accepted file/project shapes
- syntax/configuration that can be deterministically mapped
- unsupported/dynamic constructs
- maximum/operational limits where relevant
- security restrictions

Do not market generic "CrewAI project import" if only a narrow source subset is actually supported; disclose the supported contract.

---

# 3. Static parse / dynamic behavior boundary

Preferred flow:

```text
External project
→ safe static parse
→ source facts
→ semantic mapping
→ mapping diagnostics
→ AgentGraph canonical semantics
```

Dynamic Python/runtime behavior may be impossible to reconstruct statically.

Examples that may require `Unknown`, partial mapping, or explicit unsupported status:

- runtime-generated task/agent definitions
- arbitrary control flow
- environment-dependent configuration
- dynamic imports/reflection
- custom framework extension semantics
- external state not represented in source

Never execute user code just to convert Unknown into Known without a separately specified sandboxed execution feature.

---

# 4. Mapping result

Import should eventually produce a versioned mapping result capable of representing:

- source adapter/version
- source framework/version where known
- imported files/units provenance
- mapped semantic targets
- mapping status per important construct
- warnings
- Unknowns
- inferred mappings
- lossy mappings
- unsupported constructs

Useful mapping states may include:

```text
MAPPED
MAPPED_WITH_INFERENCE
LOSSY
UNKNOWN
UNSUPPORTED
```

Exact packet contracts may refine names, but silent loss is prohibited.

---

# 5. Provenance

Imported semantics should retain enough provenance to answer where a mapped concept came from without forcing the UI to expose raw internal parser details.

Potential provenance:

- source file/path
- source symbol/config key
- adapter version
- source framework/version
- mapping rule/version

Sensitive absolute local paths should not be sent to analytics or AI providers by default.

---

# 6. Import security

Project import is a security boundary.

Required direction:

- parse as untrusted data
- do not execute imported code by default
- constrain file types/size/count according to the packet
- reject unsafe archive traversal/path escaping if archives are supported
- do not follow arbitrary network references during static import unless explicitly specified
- avoid logging source bodies
- imported comments/strings are untrusted workflow data for later AI evaluation

A future execution-assisted importer requires a separate security design and sandbox boundary.

---

# 7. Import round-trip and source ownership

AgentGraph import does not imply source synchronization.

By default:

```text
External source
→ imported AgentGraph semantic artifact
```

must not mean:

```text
AgentGraph edits
→ silently rewrite external source tree
```

If write-back/synchronization is ever introduced, it needs its own semantic diff, compatibility, stale detection, preview, and explicit user apply contract.

---

# 8. Project / Workspace identity

A mature product should support multiple workflows without requiring cloud lock-in.

Conceptual model:

```text
Workspace / Project
├ project identity
├ workflow references
├ project-local metadata
├ optional policies/settings
└ optional history/index metadata
```

Project identity and workflow identity are separate.

A workflow should be able to retain logical identity across semantic revisions where appropriate.

---

# 9. Persistence levels

Do not conflate:

1. ephemeral client state
2. browser-local convenience state
3. local/project-file durable state
4. optional user account/cloud sync
5. team/shared organizational state

Each level has different durability, privacy, migration, and access-control contracts.

A packet introducing a new level must say which level it adds.

---

# 10. Local-first direction

Preferred long-term property:

- meaningful project/workflow ownership can exist without proprietary cloud persistence
- export remains available
- cloud sync/collaboration can be additive
- generated runtime/source remains user-owned

Local-first does not require every future feature to work fully offline; it means cloud lock-in is not the only durable ownership model.

---

# 11. Save vs Export

Final UX should distinguish:

- `Save` — persist the project/workflow in its configured persistence model
- `Export JSON` — create a portable workflow artifact
- `Build/Export Project` — create target runtime/build artifacts

Do not continue using `Save` to mean JSON export once project persistence exists.

---

# 12. Revision-compatible foundation

Workspace/history work should prepare for safe transformation without prematurely implementing Stage 3.

Direction:

- stable workflow identity
- semantic fingerprint/revision identity
- parent/lineage where persisted history exists
- change source metadata where appropriate
- evaluation/proposal association by revision

A revision identity must not change for layout-only edits if it is defined as semantic revision identity.

---

# 13. Evaluation history

A durable evaluation artifact should be associated with:

- workflow identity
- semantic revision/fingerprint
- Evidence version/fingerprint
- evaluator/prompt/model metadata as governed
- generated timestamp
- scope (global/scoped)

History must make stale results distinguishable from current results.

Persisting evaluation history requires `docs/DATA_AND_AI_GOVERNANCE.md` requirements.

---

# 14. Intent & Constraints relationship

Persisted Intent/Constraints are part of context foundation when explicitly selected.

Declared intent must remain distinguishable from inferred intent.

Importers may infer candidate purpose for explanation, but must not silently persist inferred purpose as user-declared truth.

---

# 15. Test requirements

Future import/workspace packets should test as applicable:

- supported import fixtures
- unsupported/dynamic fixture handling
- no arbitrary code execution
- provenance
- lossiness/Unknown diagnostics
- deterministic repeat import where source unchanged
- framework-version fixtures
- malicious/untrusted project inputs
- legacy Graph JSON compatibility
- project/workflow identity
- semantic vs layout revision behavior
- persistence/export round-trip
- analytics privacy
- deletion/export behavior for cloud persistence

---

# 16. Stage 1.5 selection rule

Do not implement all Import/Workspace features as one bundle.

Select the smallest coherent packet based on current evidence, with likely candidates such as:

- CrewAI static import v0
- Project/Local Workspace identity v0
- Intent & Constraints v0
- Evaluation history foundation
- Review navigation / Locate foundation

Each selected packet must define its own Scope/Out of Scope and must not silently pull Stage 2/3 mutation authority forward.
