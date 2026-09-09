---
name: ags-packet-start
description: Establish the current AgentGraph Studio packet, role, Git base, and existing-change ownership before material implementation or resuming a packet.
---

Run `npm run harness:preflight` from the repository. It does not contact GitHub.
Use AGENTS.md and docs/roadmap/PROGRAM_BOARD.md's packet index to find the active
contract and amendments. Verify live main only when network access is authorized.
A cached SHA, packet's Specified header, or old handoff is not today's lifecycle.

Establish role, authorized scope, base revision, existing changes, applicable
Definition of Ready, and acceptance checks. Preserve existing changes; a separate
packet belongs in an isolated worktree. Read docs/harness/README.md for setup.
Proceed through authorized implementation and verification without repeated
permission requests. If a required decision is missing, identify the precise
owner/input and continue independent in-scope work. Never infer permission for a
paid action, force-push, or Product scope expansion from a tooling check.
