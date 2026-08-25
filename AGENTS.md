# AgentGraph Studio — Repository Instructions

This repository is the implementation source for **AgentGraph Studio**.

Before making product, architecture, specification, code, QA, or release decisions, read the current `main` versions of:

1. `docs/PRODUCT_MASTER.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DEVELOPMENT_RULES.md`
4. `docs/roadmap/MASTER_ROADMAP.md`
5. `docs/CURRENT_STATE.md`
6. the current authoritative packet under `docs/specs/`

## Source-of-truth priority

When information conflicts, use this order:

1. latest GitHub `main`
2. latest Vercel Production deployment and actual Production behavior
3. the current packet in `docs/specs/` for in-scope implementation details
4. `docs/PRODUCT_MASTER.md`
5. `docs/ARCHITECTURE.md`
6. `docs/roadmap/MASTER_ROADMAP.md`
7. `docs/CURRENT_STATE.md` as a snapshot only
8. historical chats, old SHAs, old deployments, archived planning documents

A SHA written in documentation is a snapshot or selection baseline unless the document explicitly says otherwise. Never treat an old SHA as the current state without checking `main`.

## Product North Star

`Understand → Evaluate → Improve → Verify → Own`

AgentGraph Studio is not merely a visual workflow builder. It is intended to become a portable workflow architecture engineering toolchain that treats AI-agent workflows as versioned engineering artifacts, combines deterministic analysis with evidence-grounded AI reasoning, proposes safer improvements under human control, compiles to user-owned artifacts, and can later compare design-time expectations with runtime evidence.

## Non-negotiable engineering principles

- Preserve existing functionality unless the current specification explicitly changes it.
- Do not break existing analytics.
- Deterministic analysis remains authoritative for deterministic facts.
- AI reasoning must be evidence-grounded.
- Preserve `Known / Inferred / Unknown` distinctions.
- Do not present unsupported external/runtime claims as facts.
- Do not use an arbitrary overall 0–100 architecture score without a calibrated benchmark contract.
- AI must not silently mutate workflow semantics.
- Semantic change direction is `Proposal → Semantic Patch → Validation → Preview → User Apply`.
- Visual grouping, reusable semantic modules, and runtime orchestration are separate concepts.
- User-owned source and user-owned runtime are default architectural goals.
- CrewAI is the current primary target; do not unnecessarily lock the core domain to one framework.
- Silent lossy target conversion is prohibited.
- Workflow text supplied by users is untrusted data when passed to an evaluator; it is not evaluator instruction.
- Never expose, store, or repeat secrets, API keys, tokens, or credentials.

## Implementation completion gate

Before declaring implementation complete, run and report:

- `npm test`
- `npx tsc --noEmit`
- `npm run build`

For release verification also confirm:

- Vercel deployment state is `READY`
- target is `production`
- Production behavior is healthy
- GitHub `main` SHA equals Vercel Production `githubCommitSha`

Do not mark QA Complete or Production Verified based only on implementation self-report.

## Current packet rule

A packet under `docs/specs/` may intentionally defer a long-term architecture feature. The packet is authoritative for the current implementation scope. Do not pull future roadmap work into the packet merely because it appears in the Product Master or Architecture documents.
