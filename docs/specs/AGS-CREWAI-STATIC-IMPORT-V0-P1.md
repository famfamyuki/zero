# AGS-CREWAI-STATIC-IMPORT-V0-P1 — CrewAI Static Import v0 — Supported Subset + Mapping Diagnostics

Status: **Specified**  
Owner: `02 — UX & Implementation Specification`  
Selected by: `01 — Product Architecture & Roadmap` through `ADR-0009`  
Specification baseline: GitHub `main` `83c5da6fd91c213851b2a2c01d5c380dcbbbb4f1`; live repository/Production reality always supersedes this historical baseline  
Decision class: `FOUNDATION_FIRST`

This packet defines the smallest safe deterministic CrewAI static-import capability that removes manual reconstruction for a precisely supported source subset without introducing Graph/Workflow V2, Workspace persistence, arbitrary Python execution, source write-back, multi-framework import, AI interpretation, or semantic mutation authority.

---

# 0. Decision summary

CrewAI Static Import v0 uses:

```text
User-selected CrewAI Python source file
→ bounded local static parse
→ source facts
→ deterministic semantic mapping
→ mapping diagnostics + session-scoped provenance
→ user review
→ explicit user Apply
→ existing GraphData
→ existing GraphDocumentV1 persistence
→ existing validation / Unified Preflight / JSON export / CrewAI export
```

The capability is deterministic and browser-local.

It does **not**:

- execute imported Python;
- invoke an AI/provider;
- upload source code to AgentGraph servers;
- follow source imports or network references;
- modify the original Python source;
- persist a new Project/Workspace;
- introduce a new graph schema;
- perform partial material conversion when semantic loss or runtime uncertainty exists.

The v0 apply rule is intentionally conservative:

```text
Material semantic mapping:
MAPPED
or
MAPPED_WITH_INFERENCE limited to presentation-only metadata
→ Apply may be enabled

Material semantic mapping:
LOSSY
UNKNOWN
UNSUPPORTED
→ Apply is blocked
→ diagnostics explain why
```

This means v0 diagnoses unsupported source rather than silently producing a workflow whose runtime meaning has changed.

---

# 1. Goal and user problem

A user who already has a simple CrewAI workflow must currently rebuild it manually in AgentGraph Studio before reaching:

- Visual Builder inspection;
- Readiness;
- Execution Preview;
- Resource Analysis;
- Unified Preflight;
- JSON portability;
- deterministic CrewAI export.

The v0 goal is:

> Import one explicitly supported CrewAI Python workflow-definition source unit into the current AgentGraph semantic model, show exactly what was and was not understood, and let the user explicitly replace the current canvas only when the material semantics can be represented without hidden loss.

Success is reduced first-value reconstruction work, not broad Python reverse engineering.

---

# 2. Fixed upstream boundaries

The following are fixed by `ADR-0009`, `IMPORT_WORKSPACE_CONTRACT`, current Product/Architecture governance, R-006/R-007, and the current Program Board.

## Included

- CrewAI only.
- Static Python source analysis only.
- Explicitly bounded direct-constructor subset.
- Mapping to current `GraphData`.
- `GraphDocumentV1` compatibility.
- Mapping diagnostics.
- Known / Inferred / Unknown classification.
- Lossiness/unsupported classification.
- Source provenance sufficient for the current import session.
- Safe user review before canvas replacement.
- Existing deterministic validation and Preflight integration.
- Existing JSON and CrewAI export compatibility for mapped semantics.
- Import security limits.
- Accessibility, responsive and analytics regression protection.

## Explicit Out of Scope

- Graph/Workflow V2.
- Project / Workspace identity or persistence.
- Cloud save/sync/collaboration.
- Source write-back or synchronization.
- Arbitrary Python execution.
- Execution-assisted import.
- Python sandbox execution.
- AI-assisted parsing.
- AI reconstruction of unsupported semantics.
- Multi-framework or generic Python import.
- CrewAI Flow import.
- CrewAI `@CrewBase` / decorator/YAML project import.
- Cross-file symbol resolution.
- Archive/ZIP import.
- Repository/GitHub URL import.
- Dynamic imports/reflection.
- Runtime tracing.
- Persisted provenance/history.
- Persisted Intent & Constraints.
- Scenario persistence.
- Revision/Evaluation History.
- Architecture Review changes.
- Guided Improvement.
- Proposal / Semantic Patch / Apply.
- Any AI-authority expansion.
- Any mutation-authority expansion.

Stage 1 Architecture Review remains held / QA incomplete independently of this packet.

---

# 3. Current implementation baseline

The implementation must preserve these current contracts.

## Graph

Current canonical runtime graph:

```text
GraphData
├ nodes: agent | task | tool
├ edges
└ crewConfig
```

Persisted writer:

```text
GraphDocumentV1
schemaVersion = 1
```

No import metadata is added to `GraphDocumentV1` by this packet.

## Existing relation model

Canonical imported edge direction is:

```text
Tool → Agent
Tool → Task
Agent → Task
Task → Task
```

`Task → Agent` remains accepted by existing validation for backward compatibility but the importer must not generate it.

## Existing deterministic systems

Imported `GraphData` must continue through the existing:

```text
validateGraph
→ Unified Preflight
   ├ Readiness
   ├ Execution Preview
   └ Resource Analysis
→ JSON serialization
→ CrewAI Python export
```

Import parsing structures must not leak into these domains.

---

# 4. Supported-source contract

## CSI-R01 — Source framework

Adapter:

```text
id: crewai-python-direct-v0
adapterVersion: 0.1.0
mappingRuleVersion: 0.1.0
framework: CrewAI
```

This is a **source-shape contract**, not a certification of arbitrary CrewAI versions.

UI wording must use wording equivalent to:

> Import CrewAI Python — Supported subset

It must not say simply:

> Import any CrewAI project

or imply generic Python support.

## CSI-R02 — Accepted input shape

v0 accepts exactly:

- one local file;
- `.py` extension;
- UTF-8;
- non-empty;
- maximum `524,288` bytes / `512 KiB`.

No folder, multiple-file project or archive is accepted in v0.

The accepted "project shape" is therefore one logical workflow-definition Python source unit.

This scope is intentionally narrow.

## CSI-R03 — CrewAI version detection

Because v0 accepts only one `.py` source file and does not inspect dependency manifests:

```text
sourceFramework = CrewAI
frameworkVersion = Unknown
```

for normal v0 imports.

Framework version Unknown is non-blocking because support is determined by the explicit syntax/construct contract, not by claiming compatibility with an undeclared runtime version.

The UI must state that the CrewAI runtime version was not detected.

v0 must not infer an installed/runtime CrewAI version from imports alone.

---

# 5. Static parse boundary

## CSI-R04 — Parser must parse, never execute

The importer must use a real Python syntax parser / syntax-tree implementation capable of source locations.

Prohibited implementations include:

- Python execution;
- `eval`;
- `exec`;
- subprocess/system Python invocation from the import path;
- source instrumentation followed by execution;
- executing imports;
- regex-only semantic extraction;
- network-assisted parsing;
- AI-assisted parsing.

A parser dependency may be added if needed, provided it:

- operates locally in the browser/application bundle;
- does not invoke native/system Python;
- does not require a runtime network fetch;
- has no source-upload side effect;
- is reviewed as an untrusted-input parsing dependency.

Parser-library choice is a mechanical engineering decision only if all packet semantics remain unchanged.

## CSI-R05 — Parsed static expression subset

The semantic mapper may evaluate only these syntax categories as static facts:

- plain UTF-8 string literals, including multiline literals;
- boolean literals;
- integer literals;
- `None`;
- list/tuple literals containing statically resolvable symbol references;
- simple symbol references;
- supported imported class aliases;
- `Process.sequential`;
- `Process.hierarchical`;
- recognized constructor calls with keyword arguments;
- recognized AgentGraph-generated metadata comment described below.

No general Python expression evaluation is permitted.

Examples that are **not statically evaluated**:

```python
os.getenv("MODEL")
get_role()
build_tools()
f"{runtime_value}"
[a for a in factory()]
config["value"]
obj.dynamic_attribute
lambda: ...
**kwargs
```

A material field depending on one of these becomes `UNKNOWN` and blocks Apply.

## CSI-R06 — Module-level definition boundary

Supported semantic definitions are module-level simple assignments such as:

```python
llm = LLM(...)
search_tool = SerperDevTool(...)
researcher = Agent(...)
research_task = Task(...)
crew = Crew(...)
```

Simple `as` aliases from explicit CrewAI / `crewai_tools` imports may be statically resolved.

Unsupported as material workflow definitions:

- constructors hidden inside arbitrary functions;
- constructors created through loops/comprehensions;
- constructor factories;
- class/decorator-driven Crew definition;
- runtime mutation after construction;
- monkey patching;
- star-import-based identity;
- reflection;
- dynamic module loading.

The importer must identify exactly one statically supported `Crew(...)` root.

No Crew root:

```text
CREW_ROOT_NOT_FOUND
→ BLOCKED
```

More than one supported Crew root:

```text
MULTIPLE_CREW_ROOTS
→ BLOCKED
```

v0 does not ask C01 to invent multi-Crew selection UX.

---

# 6. Reachability and source scope

## CSI-R07 — Import only the selected Crew semantic closure

Starting from the one `Crew(...)` root, map only:

- Agents referenced by `crew.agents`;
- Tasks referenced by `crew.tasks`;
- Tools referenced by those Agents/Tasks;
- LLM definitions referenced by those Agents or manager configuration;
- Task context references reachable from those Tasks.

Unreferenced source declarations are not imported into the graph.

Arbitrary application/bootstrap statements that do not change the reachable static workflow definition are never executed and may be reported as:

```text
BOOTSTRAP_CODE_EXCLUDED
status = UNSUPPORTED
blocking = false
```

This status means:

> AgentGraph imported the supported workflow-definition subset, not the containing Python application.

If excluded code mutates or determines a reachable Agent/Task/Tool/Crew semantic value, it is no longer harmless bootstrap code; the affected mapping becomes `UNKNOWN` or `LOSSY` and blocks Apply.

---

# 7. Supported semantic mapping

## 7.1 Crew

Supported `Crew(...)` fields:

| CrewAI source | Graph target | Requirement |
|---|---|---|
| `agents=[...]` | imported Agent membership | static list/tuple of supported Agent refs |
| `tasks=[...]` | imported Task membership/order | static list/tuple of supported Task refs |
| `process=Process.sequential` | `crewConfig.process = "sequential"` | exact |
| `process=Process.hierarchical` | `crewConfig.process = "hierarchical"` | exact |
| `manager_llm=<LLM ref>` | `crewConfig.managerLlm` | optional; supported LLM contract |
| `verbose=True/False` | `crewConfig.verbose` | explicit static bool required |
| `memory=True/False` | `crewConfig.memory` | explicit static bool required |

Any other Crew keyword that materially affects workflow/runtime semantics is `LOSSY` or `UNSUPPORTED` and blocks Apply.

### Crew name

CrewAI `Crew(...)` does not supply the current AgentGraph UI `crewConfig.name`.

Resolution order:

1. if the exact AgentGraph-generated header metadata exists:

```python
# CrewAI Autonomous Agent Flow: <name>
```

use `<name>`;

2. otherwise derive a human-readable name from the source filename stem.

This is:

```text
MAPPED_WITH_INFERENCE
Knowledge = INFERRED
Materiality = presentation-only
blocking = false
```

The UI must not portray this name as source-declared CrewAI runtime truth.

---

# 7.2 LLM

v0 maps an LLM only when its material configuration can be represented by the current graph/export contract.

Supported form:

```python
llm = LLM(
    model="<literal-model-id>",
    temperature=0.1
)
```

For the current exporter-compatible Ollama form, the existing canonical localhost `base_url` may also be accepted when it exactly matches current deterministic export behavior.

Mapping:

```text
LLM.model
→ AgentNodeData.model
or CrewConfig.managerLlm
```

`temperature=0.1` is accepted as an exporter-compatible constant but is not persisted as a new graph field.

Any materially different unrepresentable LLM option, including a different explicit temperature, becomes:

```text
MODEL_CONFIG_UNREPRESENTABLE
status = LOSSY
blocking = true
```

Dynamic/env-derived model configuration becomes:

```text
SOURCE_VALUE_DYNAMIC
status = UNKNOWN
blocking = true
```

An Agent without a statically supported model/LLM configuration is not silently assigned `DEFAULT_LLM_MODEL`.

---

# 7.3 Agent

Supported fields:

| CrewAI `Agent` | Graph field |
|---|---|
| `role` | `role` |
| `goal` | `goal` |
| `backstory` | `backstory` |
| `llm` | `model` through supported LLM resolution |
| `verbose` | `verbose` |
| `allow_delegation` | `allowDelegation` |
| `max_iter` | `maxIter` |
| `max_rpm` | `maxRpm`; `None` → absent |
| `max_execution_time` | `maxExecutionTime`; `None` → absent |
| `respect_context_window` | `respectContextWindow` |
| `cache` | `cache` |
| `tools` | `Tool → Agent` edges |

For `READY` import, the behavior-affecting scalar fields emitted by current AgentGraph deterministic export must be statically known rather than reconstructed from an unknown CrewAI-version default.

Agent label is derived deterministically from the source symbol and is:

```text
MAPPED_WITH_INFERENCE
presentation-only
non-blocking
```

Any other material Agent keyword that the current graph cannot represent blocks Apply.

---

# 7.4 Task

Supported fields:

| CrewAI `Task` | Graph mapping |
|---|---|
| `description` | `description` |
| `expected_output` | `expectedOutput` |
| `agent` | canonical `Agent → Task` edge |
| `tools` | `Tool → Task` edges |
| `context` | `Task → Task` edges |
| `async_execution` | `asyncExecution` |
| `markdown=True` | `markdown = true`; absence maps false |
| `output_file="<literal>"` | `outputFile` |
| `human_input=True` | `humanInput = true`; absence maps false |

Task label is derived from the source symbol:

```text
MAPPED_WITH_INFERENCE
presentation-only
non-blocking
```

For v0:

```text
output_pydantic
output_json
custom output classes
dynamic output schemas
```

are unsupported because a faithful reverse mapping into the current `outputSchema` contract would require a separate bounded schema parser.

They produce:

```text
STRUCTURED_OUTPUT_UNSUPPORTED
status = LOSSY or UNSUPPORTED
blocking = true
```

No structured-output semantics may be silently converted to plain text.

---

# 7.5 Tools

Supported prebuilt source tool classes are exactly the current AgentGraph tool contract:

```text
SerperDevTool
ScrapeWebsiteTool
DirectoryReadTool
FileReadTool
TXTSearchTool
PDFSearchTool
CSVSearchTool
YoutubeVideoSearchTool
GithubSearchTool
MDXSearchTool
```

Allowed parameters are exactly the current `TOOL_PARAMETER_DEFINITIONS`:

```text
SerperDevTool
  no mapped parameters

ScrapeWebsiteTool
  website_url

DirectoryReadTool
  directory

FileReadTool
  file_path

TXTSearchTool
  txt

PDFSearchTool
  pdf

CSVSearchTool
  csv

YoutubeVideoSearchTool
  youtube_video_url

GithubSearchTool
  github_repo

MDXSearchTool
  mdx
```

Mapped parameter values must be static strings.

Unknown constructor kwargs are not copied into a generic parameters bag.

They are:

```text
TOOL_PARAMETER_UNSUPPORTED
status = LOSSY
blocking = true
```

Current Graph `CustomTool` remains valid for manually designed workflows, but **source CustomTool import is not supported in v0** because a custom Python implementation body cannot be faithfully represented by the current graph.

A reachable custom tool produces:

```text
CUSTOM_TOOL_UNSUPPORTED
status = UNSUPPORTED
blocking = true
```

Tool `label` and display `description` may be deterministically derived from the source symbol/tool type and are presentation-only inference.

---

# 8. Relation mapping and ordering

## CSI-R08 — Canonical relation projection

Importer-generated relations use:

```text
agent.tools=[tool]
→ Tool → Agent

task.tools=[tool]
→ Tool → Task

task.agent=agent
→ Agent → Task

task.context=[prior_task]
→ prior Task → current Task
```

No duplicate semantic relation is generated.

Duplicate references in one semantic source collection that would be normalized away by the graph are treated as material loss and block Apply rather than silently deduplicating them.

## CSI-R09 — Task order preservation

For sequential workflows, `Crew(tasks=[...])` order is material.

Importer layout must therefore preserve source `crew.tasks` order in deterministic Task Y ordering.

The mapping must additionally verify that the source Crew task order is compatible with explicit Task `context` dependencies.

If preserving the source order and preserving dependency semantics conflict:

```text
TASK_ORDER_CONTEXT_CONFLICT
status = LOSSY
blocking = true
```

The importer must not silently reorder a source workflow and call it equivalent.

For independent tasks, source Crew list order is the canonical order.

## CSI-R10 — Deterministic identity/layout

For unchanged source:

```text
same parser/mapping version
→ same node IDs
→ same edge IDs
→ same positions
→ same diagnostics ordering
```

IDs are deterministically derived from source symbols plus stable collision suffixes.

Layout requirements:

- deterministic;
- non-overlapping under representative fixtures;
- type-layered enough to make the imported graph understandable;
- Task vertical order preserves `Crew.tasks`;
- no random/time-based IDs;
- no `Date.now()`-based imported IDs.

Exact pixel constants remain an implementation-level mechanical choice.

---

# 9. Known / Inferred / Unknown

Every important diagnostic/mapping entry carries a knowledge classification.

## KNOWN

Use only when a value is directly present and statically resolvable from accepted syntax.

Examples:

```text
role="Researcher"
process=Process.sequential
memory=False
tools=[search_tool]
```

`KNOWN` means:

> configured in the source

It does **not** mean:

> observed at runtime

or:

> confirmed to work in the user's deployment.

## INFERRED

Allowed in v0 only for non-material presentation/projection choices such as:

- Graph display label from source symbol;
- Crew display name from filename when no AgentGraph metadata comment exists;
- canvas position/layout.

Inference must be deterministic and explicitly shown.

No runtime behavior, security behavior, model choice, tool configuration, process, assignment, dependency, or task content may be invented under `INFERRED`.

## UNKNOWN

Use when static analysis cannot determine a material source value.

Examples:

```python
role=get_role()
model=os.getenv("MODEL")
tools=build_tools()
process=get_process()
```

Material `UNKNOWN`:

```text
blocking = true
```

The importer must not ask AI to guess it.

---

# 10. Mapping status and lossiness

Required mapping statuses:

```text
MAPPED
MAPPED_WITH_INFERENCE
LOSSY
UNKNOWN
UNSUPPORTED
```

Definitions:

### MAPPED

Source meaning in the supported contract has a direct current Graph representation.

### MAPPED_WITH_INFERENCE

A supported semantic construct required a deterministic **non-material presentation** derivation.

No material runtime semantic may use this status in v0.

### LOSSY

The source construct is statically understood, but the current Graph/export model cannot retain its complete material semantics.

Example:

```text
LLM temperature=0.7
```

because the current graph does not represent that value.

Material `LOSSY` blocks Apply.

### UNKNOWN

The material source value cannot be known from accepted static syntax.

Material `UNKNOWN` blocks Apply.

### UNSUPPORTED

The construct is understood enough to identify but intentionally outside this adapter contract.

A reachable workflow-semantic `UNSUPPORTED` blocks Apply.

Non-semantic/bootstrap code may be `UNSUPPORTED, blocking=false` when it cannot influence mapped workflow semantics.

---

# 11. Mapping result contract

The import domain returns a versioned sidecar result separate from `GraphData`.

Conceptual TypeScript contract:

```ts
type CrewAIImportMappingStatus =
  | 'MAPPED'
  | 'MAPPED_WITH_INFERENCE'
  | 'LOSSY'
  | 'UNKNOWN'
  | 'UNSUPPORTED';

type CrewAIImportKnowledge =
  | 'KNOWN'
  | 'INFERRED'
  | 'UNKNOWN';

type CrewAIImportResultState =
  | 'READY'
  | 'BLOCKED';

interface CrewAIImportSourceLocation {
  file: string;
  line?: number;
  column?: number;
  symbol?: string;
  construct?: string;
}

interface CrewAIImportTarget {
  scope: 'crew' | 'node' | 'edge';
  nodeId?: string;
  edgeId?: string;
  field?: string;
}

interface CrewAIImportDiagnostic {
  code: CrewAIImportDiagnosticCode;
  status: CrewAIImportMappingStatus;
  knowledge: CrewAIImportKnowledge;
  severity: 'info' | 'warning' | 'error';
  blocking: boolean;
  source?: CrewAIImportSourceLocation;
  target?: CrewAIImportTarget;
  details?: Record<string, string | number | boolean>;
}

interface CrewAIImportReport {
  adapterId: 'crewai-python-direct-v0';
  adapterVersion: '0.1.0';
  mappingRuleVersion: '0.1.0';
  framework: 'CrewAI';
  frameworkVersion: null;
  frameworkVersionKnowledge: 'UNKNOWN';
  sourceFile: string;
  state: CrewAIImportResultState;
  summary: {
    mapped: number;
    mappedWithInference: number;
    lossy: number;
    unknown: number;
    unsupported: number;
  };
  diagnostics: CrewAIImportDiagnostic[];
}

interface CrewAIImportResult {
  state: CrewAIImportResultState;
  graph: GraphData | null;
  report: CrewAIImportReport;
}
```

Exact internal file names/types may vary, but the semantic contract may not.

`GraphData` remains parser/framework-neutral.

---

# 12. Minimum diagnostic codes

Stable codes required by v0:

```text
SOURCE_FILE_TYPE_UNSUPPORTED
SOURCE_FILE_TOO_LARGE
SOURCE_ENCODING_INVALID
SOURCE_EMPTY
SOURCE_SYNTAX_INVALID

CREW_ROOT_NOT_FOUND
MULTIPLE_CREW_ROOTS
SOURCE_CONSTRUCT_UNSUPPORTED
SOURCE_REFERENCE_UNRESOLVED
SOURCE_VALUE_DYNAMIC
SOURCE_SEMANTIC_LOSSY

MODEL_CONFIG_UNREPRESENTABLE
TOOL_TYPE_UNSUPPORTED
TOOL_PARAMETER_UNSUPPORTED
CUSTOM_TOOL_UNSUPPORTED
STRUCTURED_OUTPUT_UNSUPPORTED

TASK_ORDER_CONTEXT_CONFLICT
DUPLICATE_SOURCE_REFERENCE

MAPPED_PRESENTATION_INFERENCE
FRAMEWORK_VERSION_UNKNOWN
BOOTSTRAP_CODE_EXCLUDED

MAPPED_NODE_LIMIT_EXCEEDED
MAPPED_EDGE_LIMIT_EXCEEDED
DIAGNOSTICS_TRUNCATED

GRAPH_VALIDATION_FAILED
```

Parser-library exceptions must be normalized into these bounded application errors.

Raw parser stack traces or source bodies must not become user-facing or analytics payloads.

---

# 13. Operational limits

v0 limits:

```text
source files        = exactly 1
source type         = .py
source encoding     = UTF-8
max source bytes    = 512 KiB
max mapped nodes    = 200
max mapped edges    = 500
max diagnostics     = 200
```

If diagnostic generation would exceed 200:

```text
DIAGNOSTICS_TRUNCATED
blocking = true
```

because the user cannot make an informed Apply decision from an intentionally incomplete material diagnostic set.

These are v0 safety/product bounds, not permanent product SLOs.

No archive/path traversal logic is introduced because archives/directories are not supported.

---

# 14. Provenance contract

Each mapped important source construct must retain, in the session-scoped mapping report:

- sanitized source filename;
- line/column where available;
- source symbol;
- normalized source construct;
- adapter version;
- mapping-rule version;
- mapped target reference.

No absolute path is required or retained.

## Session-only boundary

v0 provenance is:

```text
import review session
+ current browser session after Apply
```

It is **not persisted into `GraphDocumentV1`**.

After reload, AgentGraph retains only the resulting canonical V1 workflow, not the source mapping report.

The UI must explicitly disclose:

> Import diagnostics/provenance are not saved with the workflow in this v0.

This is intentional because durable Project/Workspace/revision/provenance persistence is Out of Scope.

A future persistent provenance capability requires a separately Selected persistence/revision contract.

---

# 15. Import security and data boundary

## CSI-R11 — Browser-local source processing

Raw source remains in the browser import flow.

The v0 importer must not send it to:

- AgentGraph API routes;
- OpenAI or other AI providers;
- PostHog;
- Vercel Analytics;
- Supabase;
- Stripe;
- arbitrary network URLs.

No new server endpoint is required.

## CSI-R12 — Untrusted input

Treat all source code/comments/strings as attacker-controlled data.

Requirements:

- no source execution;
- no dynamic import following;
- no network reference resolution;
- no HTML interpretation;
- no `dangerouslySetInnerHTML` with source values;
- normalized diagnostics rather than raw parser exception output;
- do not log source bodies;
- do not log literal secret values;
- unknown kwarg diagnostics may name the key but not echo its value;
- source object/reference is released from application state when no longer required.

Mapped workflow text such as Agent role/task description remains user workflow data and is handled by existing Graph/Data rules after explicit Apply.

## CSI-R13 — Malicious source behavior

A file containing statements such as:

```python
os.system(...)
subprocess.run(...)
open(...).write(...)
requests.get(...)
while True:
    ...
raise RuntimeError(...)
crew.kickoff(...)
```

must never perform those actions merely because it is selected for import.

Bootstrap/application code may be parsed as syntax but not executed.

---

# 16. Validation boundary

Before `READY` is returned:

```text
static parse
→ semantic mapping
→ GraphData candidate
→ existing validateGraph(..., "scaffold")
```

must complete.

If existing graph validation returns an error:

```text
GRAPH_VALIDATION_FAILED
state = BLOCKED
graph = null for Apply purposes
```

The report may retain a non-applicable internal preview candidate if helpful, but UI Apply remains disabled.

The importer must not create a parallel CrewAI-specific validator that disagrees with current canonical Graph validation.

---

# 17. UX flow

## CSI-R14 — Entry points

Preserve current JSON Import.

Add a clearly separate:

```text
Import CrewAI
```

entry.

Desktop/tablet:

- available with existing import/export actions;
- label/title makes CrewAI and supported-subset nature clear.

Mobile:

- available from the existing horizontally scrollable action toolbar;
- current `Import JSON` remains separately available.

v0 CrewAI import does **not** use workspace drag/drop.

Current JSON drag/drop continues to mean JSON only.

This prevents ambiguous file-type routing and reduces regression surface.

## CSI-R15 — Import review before mutation

Selecting a `.py` file must not immediately replace the graph.

Flow:

```text
Select file
→ Analyze locally
→ Import Review
→ User reviews mapping result
→ if READY: explicit Apply
→ if existing graph non-empty: explicit replacement confirmation
→ Graph state mutation
```

Until final Apply:

- nodes unchanged;
- edges unchanged;
- Crew config unchanged;
- history unchanged;
- localStorage unchanged;
- success analytics not emitted.

Cancel performs no mutation.

## CSI-R16 — Review UI

The review must show:

1. title: `CrewAI Static Import`;
2. explicit trust statement: `Static analysis only — your Python code is not executed`;
3. supported-subset wording;
4. sanitized filename;
5. adapter version;
6. CrewAI version = Unknown when not detected;
7. proposed Agent/Task/Tool counts when available;
8. mapping summary:
   - Mapped
   - Inferred
   - Lossy
   - Unknown
   - Unsupported
9. Blocking Issues section;
10. Warnings / Information section;
11. expandable provenance/location for diagnostics;
12. statement that report/provenance is session-only in v0;
13. Cancel;
14. Apply/Replace action.

Status must never be communicated by color alone.

## CSI-R17 — Apply states

### READY

All material semantics are mapped without loss/unknown/unsupported status.

Apply enabled.

### BLOCKED

Any material `LOSSY`, `UNKNOWN`, `UNSUPPORTED`, limit failure, parse failure, or graph-validation error exists.

Apply disabled.

The user may:

- close the review;
- fix/edit their source externally;
- re-select another source.

v0 does not contain an in-app source editor or "Import anyway" bypass.

This prohibition is intentional.

## CSI-R18 — After successful Apply

Use the existing graph/editor state pathway:

- replace nodes;
- replace edges;
- replace crewConfig;
- clear selected node;
- reset current history baseline to the imported graph;
- persist using existing `serializeGraph`;
- continue using existing `agentgraph_active_flow` browser-local behavior;
- retain the import report in session state for `View import report`;
- trigger only the new successful-import analytics event;
- allow existing Preflight/code export to operate normally.

No new Workspace identity is created.

## CSI-R19 — Error/loading/degraded/stale

### Loading

During parsing/mapping:

```text
Analyzing CrewAI source…
```

with a non-blocking progress/status state.

No artificial progress percentage is required.

### Syntax/limit/error

Stay in the review flow and explain the normalized failure.

Current graph is untouched.

### Internal parser failure

Show a bounded generic import failure plus diagnostic code.

Do not expose raw parser stack/source.

### Stale

There is no server-side async result to become stale.

Selecting another source invalidates and replaces the previous pending result.

Apply replacement confirmation must be based on the latest current graph state, not a stale graph snapshot captured when parsing began.

### Browser local-save failure after Apply

The imported graph remains the current in-memory graph.

Existing browser-storage failure behavior must not corrupt or revert the current graph.

No new persistence promise is introduced.

---

# 18. Accessibility

Required:

- import entry usable by keyboard;
- actual file input has an accessible label;
- Review uses an accessible dialog/sheet pattern;
- accessible dialog title and description;
- initial focus moves predictably into the Review;
- Escape/Cancel closes;
- focus returns to the entry control on close;
- focus remains contained while a modal Review is open;
- primary and close actions have visible `focus-visible` treatment;
- mapping states include text labels and/or icons, not color only;
- parsing/result status is announced via appropriate polite live region;
- blocking failure summary is announced without repeatedly reading the entire diagnostic list;
- expandable diagnostics use real buttons with `aria-expanded`;
- source locations wrap instead of forcing horizontal page overflow;
- mobile touch targets for primary/close actions are at least approximately 44 CSS px;
- English and Japanese strings are supplied for every new user-facing import status/action.

A source diagnostic row itself does not need to become an unnecessary tab stop unless it contains an interactive disclosure/action.

---

# 19. Responsive behavior

At desktop/tablet widths:

- Review may be centered;
- max height uses viewport-relative scrolling;
- diagnostics scroll inside the Review rather than underneath the page.

At small/mobile widths:

- Review becomes full-width/full-height or equivalent safe sheet presentation;
- primary actions remain reachable without horizontal scrolling;
- the diagnostic body has internal vertical scrolling;
- long symbols/file names wrap or truncate with accessible full text;
- no viewport-wide horizontal overflow;
- current canvas mobile toolbar remains usable;
- both JSON import and CrewAI import remain discoverable.

Minimum verification viewport:

```text
320 CSS px wide
```

plus representative tablet and desktop widths.

---

# 20. Analytics contract

Existing analytics events and allowlists remain unchanged unless explicitly added here.

Add exactly one new success event:

```text
crewai_imported
```

Allowed properties:

```text
adapter_version
mapping_quality
```

where:

```text
adapter_version = "0.1.0"

mapping_quality =
  "mapped"
  | "mapped_with_presentation_inference"
```

Fire only after the user has successfully Applied the imported graph.

Do **not** send:

- source filename;
- source path;
- source code;
- source excerpts;
- Agent role/goal/backstory;
- Task descriptions/output;
- model IDs;
- tool parameters;
- symbols;
- node IDs;
- edge IDs;
- diagnostic messages;
- parser exception text;
- secrets;
- arbitrary diagnostic detail.

`json_imported` behavior remains unchanged and CrewAI import must not emit it.

Existing Preflight/export events continue to fire through their existing actions with no source-specific workflow data added.

`ANALYTICS_EVENTS`, typed analytics properties, allowlist sanitization and analytics tests must be updated together.

---

# 21. Migration / compatibility

## CSI-R20 — Graph schema

No schema migration.

```text
GraphDocumentV1 remains writer = ACTIVE
schemaVersion remains 1
```

No `GraphDocumentV2`.

No source/provenance object is injected into root Graph JSON.

No parser AST is persisted in Graph node data.

## CSI-R21 — Existing artifacts

Existing:

- current V1 JSON;
- accepted legacy unversioned Graph JSON;
- current localStorage workflow;
- templates;
- existing CrewAI exports

remain accepted/functional.

Legacy JSON import semantics remain untouched.

## CSI-R22 — Successful imported workflow persistence

Once Apply succeeds, the workflow is an ordinary current `GraphData`.

Existing `serializeGraph` writes it as V1.

Reload therefore no longer needs the CrewAI parser.

This is an important rollback property.

## CSI-R23 — Rollback

If the CrewAI importer is reverted after release:

- previously imported workflows remain valid Graph V1;
- localStorage rehydrates normally;
- exported JSON remains valid;
- current deterministic systems remain usable;
- no database migration rollback is needed;
- no Workspace/source migration is needed.

Only the ability to create a new workflow through CrewAI static import disappears.

---

# 22. Implementation boundaries

Preferred separation:

```text
types/crewai-import.ts
lib/crewai-import/
  source-boundary
  parser
  facts
  mapper
  diagnostics
components/editor/
  CrewAIImportReview
editor orchestration
```

Exact paths are mechanical, but these architecture rules are mandatory:

- parser AST is adapter-local;
- semantic mapping outputs current Graph concepts;
- React components do not own parser semantics;
- parser does not import editor UI;
- graph validator remains canonical;
- no CrewAI parser structure becomes part of GraphData;
- no server/API dependency;
- no Stage 1 Architecture Review dependency.

---

# 23. Fixtures

Minimum committed fixture set:

```text
tests/fixtures/crewai-import/
  supported-minimal.py
  supported-tools-context.py
  supported-hierarchical.py
  supported-agent-guards.py

  blocked-dynamic-value.py
  blocked-dynamic-tools.py
  blocked-custom-tool.py
  blocked-structured-output.py
  blocked-multiple-crews.py
  blocked-decorator-crewbase.py
  blocked-task-order-conflict.py
  syntax-error.py
  malicious-never-execute.py
```

Additional size/encoding fixtures may be generated programmatically instead of storing oversized/binary files.

## Fixture intent

### supported-minimal

- one LLM;
- one Agent;
- one Task;
- sequential Crew;
- explicit supported Agent guard fields;
- no tools/context.

### supported-tools-context

- supported prebuilt tools;
- Tool→Agent;
- Tool→Task;
- multiple Tasks;
- Task context;
- deterministic task ordering.

### supported-hierarchical

- hierarchical process;
- manager LLM;
- valid hierarchical task assignment behavior.

### supported-agent-guards

Covers:

- verbose;
- allow delegation;
- max iter;
- max rpm;
- max execution time;
- respect context window;
- cache;
- markdown;
- output file;
- human input where applicable.

### blocked-dynamic-value

Contains runtime/env/factory-driven material field.

Expected:

```text
UNKNOWN
BLOCKED
```

### blocked-custom-tool

Reachable custom Python tool.

Expected:

```text
CUSTOM_TOOL_UNSUPPORTED
BLOCKED
```

### blocked-structured-output

Contains `output_pydantic` or equivalent v0-unrepresentable structured output.

Expected:

```text
LOSSY/UNSUPPORTED
BLOCKED
```

### blocked-decorator-crewbase

CrewAI decorator/YAML-style project construct.

Expected:

```text
SOURCE_CONSTRUCT_UNSUPPORTED
BLOCKED
```

### malicious-never-execute

Contains obvious local/network/command side-effect statements.

Test must prove selection/parsing creates no side effect.

---

# 24. Test matrix

## Parser/source-boundary tests

Verify:

- only `.py` accepted;
- 512 KiB boundary;
- invalid UTF-8 rejected;
- empty input rejected;
- syntax errors normalized;
- no source execution;
- no network following;
- source locations deterministic;
- aliases within supported contract resolve;
- dynamic expressions remain Unknown.

## Mapper tests

Verify every supported field mapping for:

- Crew;
- LLM;
- Agent;
- Task;
- tools;
- all four canonical imported relation types.

Verify:

- node IDs stable;
- edge IDs stable;
- diagnostic order stable;
- task ordering stable;
- repeated import of identical source produces deep-equal canonical Graph + report apart from no volatile timestamps.

## Lossiness/Unknown tests

Verify that each material:

```text
LOSSY
UNKNOWN
UNSUPPORTED
```

case:

- produces a blocking diagnostic;
- disables Apply at the domain/state level;
- never silently substitutes a default;
- never emits a successful-import event.

## Validation integration

Every READY candidate must:

```text
validateGraph(..., "scaffold").isValid === true
```

Representative imported graphs must also successfully enter existing deterministic Preflight.

## JSON compatibility tests

For READY import:

```text
CrewAI source
→ GraphData
→ serializeGraph
→ deserializeGraph
```

must produce a valid canonical V1 workflow.

Existing `graph_json_roundtrip` and legacy fixtures must remain unchanged and pass.

## CrewAI export compatibility

For supported imported semantics:

```text
CrewAI supported source
→ import
→ GraphData
→ current CrewAI export
```

must preserve the canonical supported semantic signature:

- Crew process/memory/verbose/manager model;
- Agent role/goal/backstory/model/guard settings;
- Task description/output/assignment/options;
- supported tools/parameters;
- Agent/Task/tool/context relations;
- sequential task order.

Byte-identical Python or identical variable names are **not** required because inferred UI labels/identifiers are non-semantic.

Tests must compare the supported semantic projection, not source formatting.

## Security tests

`malicious-never-execute.py` must contain representative:

- file write;
- process execution;
- network call;
- runtime exception;
- kickoff invocation.

None may execute.

No raw source body may appear in analytics payload tests.

## Analytics tests

Verify:

- `crewai_imported` is accepted;
- only its two allowlisted properties survive;
- filename/path/source/symbol/diagnostic properties are removed;
- existing analytics events remain unchanged;
- JSON import still emits only `json_imported`.

## Regression suite

At minimum preserve:

- Visual Builder;
- Templates;
- JSON Import/Export;
- CrewAI Python Export;
- Readiness;
- Execution Preview;
- Resource Analysis;
- Unified Preflight;
- existing accessibility behavior;
- existing responsive behavior;
- analytics allowlist/filtering.

---

# 25. Acceptance Criteria

## AC-01 — Supported source disclosure

UI explicitly identifies the feature as CrewAI Python static import for a supported subset and does not claim generic project/Python import.

## AC-02 — Input boundary

Only one non-empty UTF-8 `.py` file at or below 512 KiB is accepted.

## AC-03 — No execution

Importing any source never executes Python, imports, shell commands, file operations, network calls, kickoff, or arbitrary runtime code.

## AC-04 — Static root

Exactly one supported static `Crew(...)` root is required.

## AC-05 — Deterministic supported mapping

Supported Crew/LLM/Agent/Task/Tool constructs map deterministically to the current Graph domain.

## AC-06 — Relation mapping

Importer produces only canonical Tool→Agent, Tool→Task, Agent→Task and Task→Task relations.

## AC-07 — Task order

Sequential Crew task order is preserved and dependency/order conflicts block Apply.

## AC-08 — Mapping statuses

All important source constructs are represented through the defined mapping-status semantics.

## AC-09 — Known/Inferred/Unknown

Material source facts are never promoted from Unknown to Known/Inferred merely to complete a graph.

## AC-10 — No silent loss

A reachable material LOSSY/UNKNOWN/UNSUPPORTED construct blocks Apply. There is no "Import anyway" bypass in v0.

## AC-11 — Presentation inference only

MAPPED_WITH_INFERENCE on a READY import is limited to non-material presentation data such as labels/name/layout.

## AC-12 — Provenance

Review diagnostics can identify source filename plus source location/symbol where available and mapping versions.

## AC-13 — Provenance persistence honesty

UI makes clear that mapping report/provenance is session-scoped and not stored in Graph V1.

## AC-14 — Security/privacy

Source is processed locally and is not uploaded, logged as a source body, or sent through analytics/providers.

## AC-15 — Graph validation

A candidate cannot become READY unless existing canonical graph validation passes.

## AC-16 — Atomic user mutation

Before explicit Apply, graph/history/storage are unchanged.

Blocked, failed, canceled and replacement-canceled imports leave the current workflow unchanged.

## AC-17 — Explicit replacement

If a current workflow exists, replacement requires explicit user confirmation.

## AC-18 — Graph V1

Successful Apply persists through the existing Graph V1 writer with `schemaVersion: 1`.

## AC-19 — No migration

No Graph/Workflow V2, database migration, Workspace record or new durable provenance schema is introduced.

## AC-20 — Existing deterministic value

A successfully imported supported fixture can use current deterministic validation, Unified Preflight, JSON export and CrewAI export.

## AC-21 — JSON regression

Current JSON file picker/drag-drop/import/export and legacy reader behavior remain unchanged.

## AC-22 — Analytics privacy

Only the bounded `crewai_imported` success event/properties are added; source information cannot pass the allowlist.

## AC-23 — Accessibility

CrewAI import and review satisfy the keyboard/focus/live-region/status requirements in this packet.

## AC-24 — Responsive

The complete import flow works without horizontal page overflow at 320 CSS px and remains usable at tablet/desktop widths.

## AC-25 — Authority boundary

No AI call, AI interpretation, Proposal/Patch/Apply semantic mutation, Architecture Review authority change, source write-back, or execution-assisted conversion is introduced.

## AC-26 — Stage hold

Stage 1 Architecture Review remains held / QA incomplete and Gate A remains unpassed.

## AC-27 — Required checks

Implementation Complete requires:

```text
npm ci
npm run docs:check
npm test
npm run typecheck
npm run build
```

all passing, plus this packet's focused import/security/regression tests.

---

# 26. Requirement traceability

| Requirement | Upstream authority | Acceptance / verification |
|---|---|---|
| bounded CrewAI static import | ADR-0009 | AC-01–05 |
| no arbitrary Python execution | ADR-0009 / IMPORT_WORKSPACE_CONTRACT / R-007 | AC-03, security fixture |
| current graph only / no V2 | ADR-0009 / R-006 | AC-18–19 |
| explicit Known/Inferred/Unknown | IMPORT_WORKSPACE_CONTRACT | AC-08–11 |
| no silent loss | ADR-0009 / IMPORT_WORKSPACE_CONTRACT | AC-10 |
| provenance | IMPORT_WORKSPACE_CONTRACT | AC-12–13 |
| source security/privacy | IMPORT_WORKSPACE_CONTRACT / Security/Data governance | AC-14 |
| deterministic integration | ADR-0009 / current Graph contract | AC-15, AC-20 |
| JSON compatibility | ADR-0009 regression boundary | AC-18, AC-21 |
| accessibility/responsive | Development Governance | AC-23–24 |
| analytics privacy/regression | Data governance / current analytics allowlist | AC-22 |
| no AI/mutation expansion | ADR-0009 / Execution Gates | AC-25–26 |
| implementation/release checks | Engineering Execution Governance | AC-27 |

---

# 27. Independent QA expectations

W01 Pass A must independently verify:

- all packet ACs;
- supported fixture mapping;
- blocked fixture behavior;
- malicious source no-execution;
- Graph V1 compatibility;
- current JSON import/export;
- representative Templates;
- CrewAI export;
- Readiness;
- Execution Preview;
- Resource Analysis;
- Unified Preflight;
- analytics privacy;
- EN/JA UI;
- keyboard/focus behavior;
- 320px mobile plus representative tablet/desktop;
- no source/provider/network transmission from the importer.

QA must review the exact C01 revision proposed for release.

Any behavior/code change after QA Complete invalidates approval and returns to W01 Pass A.

---

# 28. Production verification

After the QA-approved revision is merged/released, W01 Pass B must verify:

```text
latest GitHub main
= QA-approved released revision
= Vercel Production githubCommitSha
```

and:

- Vercel deployment `READY`;
- `target=production`;
- correct Production domain `zero-six-khaki.vercel.app`;
- Production root responds successfully;
- CrewAI Import entry visible on desktop;
- CrewAI Import entry reachable on mobile;
- valid supported fixture → READY Review;
- source is explicitly described as static/not executed;
- Apply creates expected graph;
- imported graph opens current Preflight;
- JSON export contains `schemaVersion: 1`;
- exported JSON re-imports;
- CrewAI code export succeeds for supported fixture;
- blocked dynamic fixture cannot Apply;
- malicious fixture produces no side effect;
- cancel/failed import leaves existing canvas intact;
- existing JSON import remains operational;
- representative template remains operational;
- no relevant new Production runtime errors.

Production verification must not infer correct behavior merely because the deployment is `READY`.

Actual changed-path smoke is required.

---

# 29. Rollback / failure isolation

This capability has no database migration, no new server dependency and no Graph major-version change.

Therefore the normal rollback is application-code rollback.

Workflows already created through a successful CrewAI import remain ordinary Graph V1 workflows and continue to load after rollback.

Parser/import failure must remain isolated from:

- Visual Builder;
- Templates;
- JSON import/export;
- CrewAI export;
- Unified Preflight;
- provider-backed Stage 1 work.

A failure in CrewAI import must not disable deterministic free-core behavior.

---

# 30. Explicitly deferred follow-up candidates

Evidence from v0 may later justify a separate 01 selection for one or more of:

- multi-file static symbol resolution;
- CrewAI decorator / `@CrewBase` import;
- YAML `agents.yaml` / `tasks.yaml` mapping;
- structured-output reverse mapping;
- custom-tool source representation;
- persistent import provenance;
- Project/Local Workspace;
- source synchronization/write-back;
- additional frameworks.

None is automatically next.

Required sequence remains:

```text
v0 evidence
→ Gate / Product review
→ explicit 01 selection
```

not:

```text
v0 complete
→ automatically implement broader import
```

---

# 31. 02 Definition of Ready conclusion

Product / dependency readiness: **Resolved**  
Domain / architecture readiness: **Resolved**  
Data / security readiness: **Resolved**  
UX / quality readiness: **Resolved**  
Migration / compatibility readiness: **Resolved**  
Accessibility / responsive readiness: **Resolved**  
Analytics regression readiness: **Resolved**  
Acceptance / test / fixture readiness: **Resolved**  
Release / rollback / Production verification readiness: **Resolved**

Authority boundaries:

```text
Stage 1 Architecture Review = held / QA incomplete
Gate A = not passed
AI Authority = unchanged
Mutation Authority = unchanged
GraphDocument writer = V1
Workspace persistence = not introduced
Source write-back = not introduced
Arbitrary execution = not introduced
Multi-framework import = not introduced
```

Lifecycle after this packet is authoritative on `main`:

```text
CrewAI Static Import v0
Selected → Specified
next authority = C01
```
