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

## Local development and verification

Use the exact Node version in [`.node-version`](.node-version) (currently 22.23.2).
CI reads that same file. Activate it with your Node version manager, then run:

```text
npm ci
npm run harness:preflight
npm run verify
```

`verify` runs secret signatures, docs integrity, all unit tests, TypeScript, and
the production build. It writes local self-check evidence to
`.harness/verification.json`; this is not independent QA. `npm run dev` starts
the local app. The deterministic free core and normal checks do not require
production credentials. Never copy production secrets into a verification shell.

For browser smoke, run `npx playwright install chromium` once, then
`npm run test:e2e` after a successful build. Tests start their own loopback-only
server and block non-local browser requests. See the
[harness runbook](docs/harness/README.md) for external-evaluation boundaries,
safe permissions, Hook trust, and C01/W01 handoff.

### Environment configuration

Use [`.env.example`](.env.example) as the key inventory only; it intentionally contains no credentials or approved commercial values. Keep API keys, service-role credentials, and webhook secrets in the hosting provider's Secret storage, and scope Preview credentials to the intended Git branch.

Paid Architecture Review is fail-closed. Keep `ARCHITECTURE_REVIEW_PAID_ENABLED=false` until every configuration and external approval is complete. Check preparation readiness with `npm run commercial:check`; use `npm run commercial:check:enabled` only for the final launch-candidate verification. Neither command prints configured values.

The external WAF, provider-budget, kill-switch, and controlled financial QA procedure is documented in [Architecture Review Paid Launch Runbook](docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md).

## Try it

- [Open AgentGraph Studio](https://zero-six-khaki.vercel.app/)
- [Browse CrewAI templates](https://zero-six-khaki.vercel.app/templates)
