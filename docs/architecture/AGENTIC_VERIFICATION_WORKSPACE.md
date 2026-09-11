# AgentGraph Studio — Agentic Verification Workspace Direction

Status: **Long-term Vision / Conditional — not Selected**  
Scope: Future managed-agent and sandbox-assisted verification direction, including an initial OpenAI Agents API implementation candidate.  
This document does **not** expand the current Sprint, replace the current Architecture Review provider path, grant AI/Mutation authority, or change current commercial configuration.

## 0. Authority and current-state rule

This is a specialized future-direction document. It must be read under the existing authority chain:

1. latest GitHub `main` / repository reality
2. latest Production behavior
3. active packet under `docs/specs/`
4. `docs/PRODUCT_MASTER.md`
5. `docs/ARCHITECTURE.md`
6. `docs/DEVELOPMENT_RULES.md` and applicable Security/Data governance
7. `docs/roadmap/MASTER_ROADMAP.md`
8. `docs/roadmap/EXECUTION_GATES.md`
9. this document for the narrow managed-agent verification concern

Nothing here is implementation authorization. Future work still requires:

```text
Evidence
→ Gate Review
→ Explicit Next Selection
→ Specification
→ Implementation
→ Independent QA
→ Production Verification
```

### Current Product boundary

As of the repository state reviewed on 2026-09-11:

- paid Architecture Review uses the OpenAI **Responses API** through `lib/architecture-review/providers/openai.ts`;
- deterministic Readiness, Execution Preview, Resource Analysis, import/export, and CrewAI Python export remain independent of AI-provider availability;
- the current paid Architecture Review cost/quota/provider controls remain governed by the active Stage 1 paid-access contracts;
- no Agents API product feature is Selected or implemented by this document.

The current Architecture Review must **not** be migrated to Agents API merely because Agents API exists. A migration would require separate evidence that it improves the existing capability without violating cost, latency, privacy, reliability, or evaluator-quality requirements.

---

# 1. Product concept

Working product name:

**Agentic Verification Workspace**

The purpose is to add a future, explicit, higher-depth workspace where AgentGraph Studio can investigate and verify a workflow or generated project through a bounded multi-step agent session and an isolated execution environment.

This is not intended to be "Architecture Review, but with a more expensive API." Its value must come from capabilities that a single bounded review call cannot provide well, such as:

- multi-step investigation over a larger evidence set;
- controlled file/artifact inspection;
- generated-project build or test diagnostics;
- bounded sandbox execution initiated by the user;
- iterative diagnosis after a failed verification step;
- optional specialist/subagent decomposition where it measurably improves quality;
- production of structured verification evidence and artifacts that can be inspected by the user.

The product loop it should strengthen is primarily:

```text
Evaluate
→ Verify
→ Improve
→ Verify again
→ Own
```

It remains subordinate to the Product North Star:

```text
Understand → Evaluate → Improve → Verify → Own
```

---

# 2. Why this is a separate capability

The existing Architecture Review is a bounded, evidence-grounded evaluator. That is a good fit for a structured single-review provider call and should remain simple.

A managed agent session becomes useful only when the task genuinely requires an iterative loop such as:

```text
Understand bounded input
→ plan verification
→ inspect allowed files/evidence
→ run allowed checks in isolation
→ inspect actual outputs
→ refine diagnosis
→ normalize observations
→ produce a structured report
```

Keeping the capabilities separate protects:

- predictable Architecture Review cost/latency;
- deterministic free-core availability;
- evaluator benchmarking and change management;
- provider-failure isolation;
- the user's ability to use AgentGraph without a proprietary hosted execution dependency.

---

# 3. Candidate user modes

These are future Product candidates, not committed scope.

## 3.1 Deep Architecture Investigation

A longer-running, read-only investigation over the workflow source, deterministic Evidence, target capability data, and previously produced review findings.

Possible value:

- reconcile multiple findings;
- investigate cross-cutting architecture risks;
- inspect larger scoped evidence sets iteratively rather than silently truncate them;
- ask specialist agents to independently inspect bounded concerns and synthesize a result.

Boundary: this remains advisory. It does not mutate the workflow.

## 3.2 Sandbox Verification

An explicit user-triggered verification run against a generated or user-supplied **verification artifact** inside an isolated sandbox.

Possible checks:

- generated project installs/builds under a declared environment;
- expected files/artifacts exist;
- selected tests or validation commands run successfully;
- a reproducible failure can be diagnosed from actual command output;
- generated code and build manifest remain consistent.

Boundary: sandbox execution is not automatically equivalent to the user's real runtime or Production behavior.

## 3.3 Failure Investigation

Given an explicit failure artifact, log, test result, or sandbox reproduction, the workspace may iteratively investigate likely causes and return evidence-linked diagnostic hypotheses.

Boundary: observed failure evidence must remain distinct from generalized static rules.

## 3.4 Improvement Handoff

A verified issue may produce an `ImprovementProposal` candidate.

It must **not** directly update canonical workflow semantics. Any semantic change continues through the existing controlled flow:

```text
Finding
→ Improvement Proposal
→ Semantic Patch
→ Validation
→ Before / After Preview
→ User Apply
```

No managed-agent feature may bypass this sequence.

---

# 4. Evidence model

The future workspace must preserve a stronger distinction than a generic "AI verified" label.

Required conceptual separation:

```text
Configured expectation
≠ Static deterministic evidence
≠ Agentic sandbox observation
≠ Observed user/Production runtime behavior
```

Suggested provenance classes:

- `STATIC_EVIDENCE` — derived from workflow source/configuration without executing the user's project;
- `SANDBOX_OBSERVATION` — observed inside a declared verification sandbox under recorded conditions;
- `IMPORTED_RUNTIME_EVIDENCE` — runtime evidence supplied/imported from the user's actual environment;
- `AI_INFERENCE` — interpretation/hypothesis derived from one or more evidence sources.

A sandbox result may be strong evidence for "this command behaved this way in this sandbox," but it must not be promoted into "Production behaves this way" without corresponding runtime evidence.

Every material sandbox observation should be attributable to a verification run identity with enough metadata to understand at least:

- workflow/project revision or artifact fingerprint;
- environment/provider type;
- relevant package/runtime versions where known;
- command/check identity;
- exit/result state;
- timestamps where meaningful;
- produced artifacts or bounded output references;
- network/tool permission profile;
- provider/model/agent configuration version where AI interpretation is involved.

---

# 5. Provider architecture

OpenAI Agents API is an **initial implementation candidate**, not a core-domain dependency.

Target boundary:

```text
AgenticVerificationOrchestrator
↓
AgenticVerificationProvider
├ OpenAI Agents API adapter
└ future alternative/self-hosted adapter if justified
↓
Verification Environment
├ OpenAI-hosted sandbox
├ approved external/self-hosted sandbox
└ no-execution/read-only mode
```

Core `VerificationJob`, `VerificationEvidence`, `VerificationResult`, and Product-facing status types must not depend on OpenAI-specific session/event shapes.

Provider-specific features such as subagents, session events, MCP integrations, or hosted sandbox artifacts are adapter capabilities. They must not redefine AgentGraph workflow semantics.

Important invariant:

```text
Agents API subagent
≠ AgentGraph workflow Agent
```

Provider orchestration used to perform an evaluation is an implementation detail of the evaluator/verification system. It must not silently add agents, tasks, dependencies, or runtime orchestration to the user's workflow.

---

# 6. Current OpenAI Agents API fit

Provider observations recorded on **2026-09-11** are time-sensitive implementation evidence, not permanent Product contracts.

OpenAI currently documents Agents API as a managed Codex harness in which OpenAI manages sessions, orchestration, context compaction, and recovery while the application selects tools and execution environment. The API can use sandboxes for code execution, file editing, MCP connectivity, artifacts, and multi-agent work. Pricing is based on selected model usage, tool usage, and hosted-container usage rather than a separate Product-level AgentGraph pricing contract.

Official references at time of this decision:

- `https://developers.openai.com/api/docs/guides/agents-api/overview`
- `https://developers.openai.com/api/docs/guides/agents-api/quickstart`

OpenAI also currently states that Agents API session state is retained, data residency is currently United States only, and Zero Data Retention is not currently supported. These properties are **external-dependent and time-sensitive** and must be re-verified before any implementation or Production use.

Do not freeze today's model names, pricing, retention, residency, sandbox behavior, API beta headers, tool availability, or limits into AgentGraph domain contracts.

---

# 7. Security and execution boundary

The existence of a sandbox does not authorize arbitrary execution.

The existing rule remains:

> imported/user-authored code is untrusted analyzed data and must not be executed merely to inspect or convert it.

A future Sandbox Verification capability may execute code only when all of the following are explicitly specified and satisfied:

- the user intentionally starts an execution/verification action;
- the UI clearly distinguishes static analysis from execution;
- the execution artifact and revision are identified;
- the sandbox trust boundary is documented;
- network access is off by default unless the selected check requires and discloses it;
- secret/credential access is absent by default and separately authorized wherever allowed;
- filesystem scope is bounded to the verification environment;
- external mutation is blocked unless a separately governed capability explicitly permits it;
- package installation policy is defined;
- timeout/resource/cost limits are enforced server-side;
- output/log/artifact handling follows Data & AI Governance;
- cancellation and cleanup behavior are defined.

A Production packet must threat-model prompt injection from workflow text, imported source, logs, command output, package metadata, MCP/tool output, and generated artifacts. All such content is untrusted data unless it is part of a trusted control channel.

---

# 8. Data, persistence, and session governance

Agents API introduces a materially different data path from the current stateless-style Architecture Review call because managed sessions and sandbox artifacts may have provider-side lifecycle/retention semantics.

Therefore any future packet must define before implementation:

- exactly what workflow/project/evidence data is sent;
- whether raw source or a minimized verification bundle is required;
- session creation/continuation/deletion behavior;
- artifact upload/download/persistence behavior;
- retention and deletion expectations;
- provider residency and training/data-control implications;
- whether users can choose hosted vs self-hosted/no-execution modes;
- analytics redaction;
- secret handling;
- deletion/export behavior for AgentGraph-owned metadata.

The feature must not silently turn local/user-owned project data into durable cloud persistence.

---

# 9. Cost and commercial boundary

This feature is expected to have a less predictable cost envelope than the current bounded Architecture Review because a task may involve multiple model turns, tools, subagents, and sandbox time.

Before Product launch, require a versioned cost model covering at least:

- max model input/output budget per verification run;
- max agent turns;
- max concurrent subagents;
- max sandbox duration/resources;
- max paid tool calls;
- per-run hard ceiling;
- per-user/account quota;
- global provider budget warning/critical/hard ceiling;
- cancellation behavior when a budget limit is reached;
- usage observability without leaking workflow content.

Commercial packaging is **Conditional / Business Validation Required**.

Possible models to evaluate later include:

- metered verification credits;
- a higher paid tier with bounded included runs;
- explicit pay-per-deep-run;
- enterprise/self-hosted provider options.

Do not change the current Architecture Review USD 12/month / included-review launch contract from this future direction. Do not bundle an unbounded managed-agent loop into the current quota without separate unit-economics evidence.

---

# 10. AI Authority and mutation authority

Agents API capability does not itself increase AgentGraph AI Authority.

A future verification workspace must separately define which authority envelope it needs under `docs/roadmap/EXECUTION_GATES.md`.

Examples:

- read-only investigation may remain near existing review authority if its claims are evidence-grounded and benchmarked;
- structured architecture proposals require the applicable Gate B / `AE2+` authority decision;
- semantic patch creation/apply remains gated by Gate C and approved mutation scope;
- security/control recommendations or side-effect-sensitive changes require the corresponding stronger evidence and authority.

Executing code in a sandbox is an **execution capability**, not permission to mutate the canonical workflow or external systems.

---

# 11. Relationship to roadmap stages

This document does not insert a mandatory new numbered Stage.

The capability may eventually be selected as the smallest coherent packet when evidence shows it is the right dependency for one of these directions:

- evaluation trust/scale work that benefits from bounded iterative investigation;
- Portable Build verification after generated-project contracts are mature enough;
- Runtime/Behavioral Evaluation where controlled sandbox observations add value;
- premium deep verification if users demonstrate willingness to pay for materially stronger verification.

Likely dependency direction for the full sandbox-capable form:

```text
Evidence-grounded evaluation maturity
+
explicit verification artifact/revision identity
+
security/data/provider contract
+
controlled execution/cost envelope
→ Agentic Verification Workspace
```

A narrower read-only Deep Architecture Investigation mode could theoretically be selected earlier, but only through normal Evidence → Gate Review → Explicit Next Selection. Its existence in this document is not Stage 1.5 backlog.

---

# 12. Minimum future specification requirements

Before implementation, an active packet must define at least:

- Goal / user problem;
- Included / Deferred / Out of Scope;
- Product status and target users;
- exact relationship to existing Architecture Review;
- `VerificationJob` input contract;
- Evidence/provenance/output contract;
- provider adapter contract;
- environment/sandbox contract;
- execution permission model;
- network/filesystem/package/secret policy;
- session/artifact persistence and deletion;
- timeouts, retries, cancellation, recovery;
- model/tool/subagent/sandbox cost ceilings;
- structured result validation;
- prompt-injection and untrusted-output handling;
- AI Authority and Mutation Authority scope;
- UX states for planning/running/waiting/cancelled/failed/partial/completed;
- accessibility/responsive behavior;
- analytics privacy boundaries;
- compatibility/migration behavior;
- benchmark/evaluation plan;
- acceptance criteria;
- independent QA and Production-verification procedure.

---

# 13. Explicit non-goals

This direction does **not** mean:

- replace the current Responses API Architecture Review;
- make Agents API a dependency of the deterministic free core;
- make OpenAI-hosted execution the only way to use AgentGraph Studio;
- execute imported projects automatically;
- treat sandbox success as proof of Production behavior;
- give AI permission to silently edit canonical workflow semantics;
- let provider subagents become workflow agents;
- persist workflow/project content merely because provider sessions can persist;
- expose user secrets to an agent sandbox by default;
- remove CrewAI-first or user-owned runtime principles;
- create a mandatory roadmap stage just because the provider capability exists.

---

# 14. Decision summary

**Known**

- Current Architecture Review already has a bounded Responses API provider path and must remain intact unless a separate migration is justified.
- OpenAI Agents API currently provides managed multi-step agent sessions and optional sandbox execution capabilities that can support a qualitatively different verification workflow.
- Managed sessions/sandboxes introduce new cost, execution, persistence, privacy, and security concerns.

**Inferred**

- The strongest AgentGraph Studio fit is a separate future Agentic Verification Workspace, not a transparent replacement of the existing evaluator.
- The most differentiated value is likely to come from evidence-producing sandbox verification and iterative diagnosis rather than merely longer prose reviews.

**Unknown / requires future evidence**

- whether users value this enough to justify provider/runtime cost;
- which exact mode should be selected first;
- whether OpenAI Agents API remains the best provider by implementation time;
- the correct pricing/quota model;
- whether hosted sandbox, self-hosted sandbox, or both should ship;
- what benchmark threshold is sufficient for any expanded recommendation authority.

Until those Unknowns are resolved, this remains **Long-term Vision / Conditional** and does not alter Current Product, Current Sprint, AI Authority, Mutation Authority, or the existing paid Architecture Review contract.
