# AgentGraph Studio Development Documentation

This directory is the shared development knowledge base for ChatGPT chats, Work, Codex, and human contributors.

## Read first

1. [`PRODUCT_MASTER.md`](./PRODUCT_MASTER.md) — final product definition, North Star, durable product principles
2. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — long-term architecture boundaries and evolution
3. [`DEVELOPMENT_RULES.md`](./DEVELOPMENT_RULES.md) — implementation, QA, Git, analytics regression, and release gates
4. [`roadmap/MASTER_ROADMAP.md`](./roadmap/MASTER_ROADMAP.md) — stage sequencing and dependency logic
5. [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md) — cross-stage evaluation trust, benchmark quality, large-workflow scale, Search/Locate/Scoped Evaluation direction
6. [`CURRENT_STATE.md`](./CURRENT_STATE.md) — coordination snapshot; always re-check live GitHub/Vercel before treating its SHA as current
7. [`specs/`](./specs/) — authoritative implementation packets for selected/current Sprints

## Source-of-truth hierarchy

For current implementation work:

```text
latest GitHub main / repository reality
→ latest Vercel Production / actual Production behavior
→ active docs/specs packet
→ Product Master
→ Architecture Master
→ Master Roadmap
→ relevant cross-stage plans
→ Current State snapshot
→ historical plans/chats
```

The Product/Architecture/Roadmap documents and cross-stage plans describe durable direction. They do not automatically expand the scope of an active packet.

## Evaluation trust / scale

When a decision concerns evaluator quality, claims of evaluator accuracy, design-time vs runtime evaluation, large-workflow evaluation limits, Search/Locate/Focus, or scoped evaluation, also read:

- [`roadmap/EVALUATION_TRUST_AND_SCALE.md`](./roadmap/EVALUATION_TRUST_AND_SCALE.md)

That document is a cross-stage plan and does not alter the active Stage 1 packet unless a later Product Architecture decision explicitly selects additional work.

## Current Stage 1 packet

At the time this index was created, the authoritative Stage 1 specification is:

- [`specs/AGS-EGAI-AR-V0-P1.md`](./specs/AGS-EGAI-AR-V0-P1.md) — Evidence-Grounded AI Architecture Review v0

Always check the directory and latest `main` for newer packets before work.

## Codex

Root [`../AGENTS.md`](../AGENTS.md) is the compact Codex/contributor entrypoint. Keep it short and route durable details into this documentation instead of duplicating the entire Product Master there.
