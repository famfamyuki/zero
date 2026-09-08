# AgentGraph Studio harness

This runbook implements existing engineering rules. Product scope still comes
from [Program Board](../roadmap/PROGRAM_BOARD.md#packet-index); authority comes
from [Role Registry](../CHAT_ROLE_REGISTRY.md). Maintenance acceptance criteria
are in [Execution scope](EXECUTION_SCOPE.md).

## Start and resume

Run `npm run harness:preflight`. It reads local Git/Node state without fetching,
checking out, stashing, or executing imported code. Cached main is not live main.
When authorized, use `git fetch origin` and `git ls-remote origin refs/heads/main`
to establish the live base and observation time. Check pre-existing changes before
editing; use a separate worktree for unrelated work. Do not prune others' worktrees
to resolve a warning. A dirty report alone is not a reason to discard work.

## Reproducible local checks

Activate the exact version in `.node-version`, then `npm ci` and `npm run verify`.
CI and local verification use the same Node pin. Node tools use `process.execPath`
so Windows does not depend on POSIX shell chaining. Next build needs no Google
font download in the current app. Dependency/browser installation requires network
access; install during authorized setup rather than silently granting it to every
future command. Normal verification and the smoke server strip service/credential
environment variables, force paid-off, and refuse a checkout containing dotenv
files other than `.env.example`; use a clean worktree instead of deleting your
development credentials. Browser smoke must follow a build made by `verify` in
that clean checkout: already-built public configuration cannot be scrubbed later.

The verification record under `.harness/` is overwritten to `running` before
checks and only passes if all steps pass and source bytes remain unchanged.
Ignored files (including environment files), dependencies, and external systems
are outside its fingerprint. The fingerprint is local comparison evidence, not a
Git tree, portable cross-OS identity, signed attestation, or QA approval. For
release, use the committed candidate and W01's exact-revision evidence. Do not run
concurrent builds/typechecks/verification in the same checkout. Packet-specific
provider evaluations and live financial QA are separate, budgeted, authorized
operations and never part of `verify`.

`secrets:check` scans tracked and non-ignored new files with bounded credential
signatures and reports paths/categories only. It fails on unsupported/oversize
files. It is not a guarantee of secret absence: ignored files, Git history,
arbitrary passwords and unrecognized credentials are not covered. Keep GitHub
secret protection enabled where available; investigate and rotate confirmed
exposures instead of merely adding ignore patterns.

## Browser smoke

After `npm run verify`, install Chromium with `npx playwright install chromium`
(CI: `npx playwright install --with-deps chromium`) and run `npm run test:e2e`.
The suite owns a loopback server on port 3107, never reuses a production URL or
user browser profile, and blocks external browser requests. Paid review remains
disabled. Test artifacts are local/ignored; do not attach authenticated storage
or real customer/provider content. A deterministic smoke is not live Stripe,
Supabase, policy-page, WAF, or provider-budget verification. Use the paid-launch
runbook and W01 for those approved scenarios.

## Codex settings and Hooks

`.codex/config.toml` requests workspace-write, on-request approvals, shell network
off, and default filtering of KEY/SECRET/TOKEN environment variables. This avoids
unrestricted host access as the project default. Explicit session flags or managed
policy can override defaults; inspect effective permissions at session start.
Changing this file does not retroactively sandbox an already-running Full Access
task. Account-connected tools have separate service permissions. Do not broaden
them because a command was denied; approve the narrowly required action.

The SessionStart Hook resolves from the Git root and only returns bounded local
state. It does not inspect transcripts, invoke services, alter files, or grant
permission. Codex requires review/trust of new or changed non-managed Hook hashes;
use `/hooks` in the CLI to review the concrete definition. Do not bypass trust or
edit Codex trust databases. Until trusted, run preflight explicitly. Hook payload
tests do not establish that a Desktop session actually loaded/trusted the Hook.

Sources checked 2026-09-09: [configuration](https://learn.chatgpt.com/docs/config-file/config-basic),
[Hooks](https://learn.chatgpt.com/docs/hooks), and
[Skills](https://learn.chatgpt.com/docs/skills).
Local CLI 0.153.4 labels hooks/multi_agent/plugins Stable; Desktop package is
26.901.6511.0. No Experimental/Beta feature or Deprecated/Removed flag is required.
Native Computer Use being unavailable in a session does not prevent CLI browser
smoke. Do not infer Desktop engine identity from a separately installed CLI.

## Handoff, parallel work, and feedback

Use [Verification record](../templates/VERIFICATION_RECORD.md). Continue the
authorized packet through self-checks and W01 handoff. Missing Product decisions
or external authorization block only their dependent actions, not unrelated
authorized work. Do not ask repeatedly for permission already granted.

When the user or applicable instructions authorize subagents, split bounded
read-only research/review by artifact. Assign exclusive file ownership for any
edits; use isolated worktrees/ports for tests. Never treat an implementation
subagent as W01 independent QA. Check every delegated result before integrating.

For repeated corrections, put the root cause and one demonstrable prevention in
the relevant PR/packet: test for a regression, Skill/script for repeated mechanics,
or governance/ADR for authority changes. Record who verifies closure; do not grow
AGENTS.md with an unfiltered conversation history.
