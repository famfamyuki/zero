# AgentGraph Studio

**Preflight Engineering for CrewAI Workflows**

Design, review, and export CrewAI workflows before you run them.

AgentGraph Studio is a pre-execution engineering tool for developers building CrewAI workflows. Design a workflow visually or import JSON, review readiness, execution structure, and resource implications in one Preflight Review, then export deterministic Python for handoff to your own runtime.

[Open AgentGraph Studio](https://zero-six-khaki.vercel.app/) · [Browse templates](https://zero-six-khaki.vercel.app/templates)

## Why Preflight Engineering

A workflow graph shows structure, but structure alone does not surface every static readiness finding, the execution structure implied by the workflow, or where resource and complexity concerns may concentrate. AgentGraph Studio adds a static pre-execution review between workflow design and code handoff.

## Core workflow

1. Start from the visual builder, a template, or JSON import.
2. Configure agents, tasks, tools, and dependencies.
3. Open **Preflight Review**.
4. Review:
   - **Readiness** — static findings about workflow and configuration readiness.
   - **Execution Preview** — the execution structure implied by the current workflow.
   - **Resource Analysis** — static resource and complexity implications and hotspots.
5. Adjust the workflow and re-evaluate.
6. Export the workflow as JSON or deterministic CrewAI Python.

## Key capabilities

- Visual workflow design
- CrewAI workflow templates
- JSON import and export
- Unified Preflight Review
- Readiness, Execution Preview, and Resource Analysis
- Deterministic CrewAI / Python code export

## Scope

AgentGraph Studio performs **static pre-execution engineering review**. It does not execute agents, simulate a live run, monitor production workflows, or predict runtime latency, token consumption, or cost.

## Development

Start with the [development documentation index](docs/README.md) for authority, task-specific reading paths, and the specification map. Repository agent instructions are in [AGENTS.md](AGENTS.md); current work and blockers are in the [Program Board](docs/roadmap/PROGRAM_BOARD.md).

Use Node.js 22 (matching CI):

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Before handing off a change, run:

```sh
npm run docs:check
npm test
npm run typecheck
npm run build
```

Packet-specific checks and independent QA/release requirements remain governed by [Development Rules](docs/DEVELOPMENT_RULES.md). Provider-backed evaluation requires its packet's budget and configuration; the commands above do not establish Production verification.

## Environment configuration

Use [`.env.example`](.env.example) as the key inventory only; it intentionally contains no credentials or approved commercial values. Keep API keys, service-role credentials, and webhook secrets in the hosting provider's Secret storage, and scope Preview credentials to the intended Git branch.

Paid Architecture Review is fail-closed. Keep `ARCHITECTURE_REVIEW_PAID_ENABLED=false` until every configuration and external approval is complete. Check preparation readiness with `npm run commercial:check`; use `npm run commercial:check:enabled` only for the final launch-candidate verification. Neither command prints configured values.

The external WAF, provider-budget, kill-switch, and controlled financial QA procedure is documented in [Architecture Review Paid Launch Runbook](docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md).

## Try it

- [Open AgentGraph Studio](https://zero-six-khaki.vercel.app/)
- [Browse CrewAI templates](https://zero-six-khaki.vercel.app/templates)
