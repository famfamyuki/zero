# AgentGraph Studio harness

This runbook implements existing engineering rules. Product scope still comes
from [Program Board](../roadmap/PROGRAM_BOARD.md#packet-index); authority comes
from [Role Registry](../CHAT_ROLE_REGISTRY.md). Development Governance is
[Development Rules](../DEVELOPMENT_RULES.md). Maintenance acceptance criteria are
in [Execution scope](EXECUTION_SCOPE.md).

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
preflight or source fingerprint collection. Initialization errors record `failed`
and exit nonzero; unavailable environment/source fields are `null` (Unknown),
never copied from a prior run. It only passes if all steps pass and source bytes remain unchanged.
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

`.codex/config.toml` pins the repository default to GPT-6 Astra with `low`
reasoning effort and concise reasoning summaries. It also requests workspace-write,
on-request approvals, shell network off, default filtering of KEY/SECRET/TOKEN
environment variables, user approval review, solo execution, and no automatic
Skill MCP dependency installation. These are repository cost/safety defaults, not
a restriction on an explicitly authorized session override. Inspect effective
settings at session start; managed policy or explicit session flags can take
precedence.

`low` is the normal Astra reasoning default for this repository. Raise reasoning
for a bounded difficult task only when complexity or observed failure justifies the
extra cost, then return to `low`; do not make medium/high a standing project default
without measured evidence. This changes reasoning budget, not Product/Architecture,
AI Authority, Mutation Authority, or QA/release authority.

The user-review setting avoids routing approval work through automatic review
subagents. Solo execution is the default because Astra can complete normal
repository packets directly without paying parent/child context-transfer cost.
Enable delegation only for a bounded task with a concrete expected benefit; never
treat an implementation subagent as W01 independent QA. The project Skills do not
currently require automatic MCP dependency installation; a future Skill that does
must declare that dependency and justify enabling it for that task.

Changing `.codex/config.toml` does not retroactively sandbox an already-running
Full Access task. Account-connected tools have separate service permissions. Do
not broaden them because a command was denied; approve the narrowly required
action.

The SessionStart Hook resolves from the Git root and only returns bounded local
state. It does not inspect transcripts, invoke services, alter files, or grant
permission. Its injected context is intentionally compact: local HEAD/branch,
cached-main relation, dirty state, and derived warning flags. Mutable live GitHub
or Vercel identity still comes from live checks when the task requires it.

Do not add UserPromptSubmit/PostToolUse advisory hooks or per-tool receipt/checklist
hooks merely for reassurance. Avoid rereading unchanged files or rerunning a
successful check unless source/evidence changed, a previous result failed, or a
new unresolved concern makes the repeat relevant. Keep one durable verification
record at the implementation boundary rather than creating phase-by-phase receipt
artifacts. For long or tool-heavy work, prefer repository/packet state plus a
compact handoff over making an old conversation transcript the source of truth.

Codex requires review/trust of new or changed non-managed Hook hashes; use `/hooks`
in the CLI to review the concrete definition. Do not bypass trust or edit Codex
trust databases. Until trusted, run preflight explicitly. Hook payload tests do
not establish that a Desktop session actually loaded/trusted the Hook.

Sources checked 2026-09-09: [configuration](https://learn.chatgpt.com/docs/config-file/config-basic),
[Hooks](https://learn.chatgpt.com/docs/hooks), and
[Skills](https://learn.chatgpt.com/docs/skills).
The current Codex configuration/model schema was also reviewed on 2026-09-10 for
`model`, `model_reasoning_effort`, `model_reasoning_summary`,
`approvals_reviewer`, `[agents]`, `multi_agent_v2`, and
`skill_mcp_dependency_install` semantics. Local CLI 0.153.4 labels
hooks/multi_agent/plugins Stable; Desktop package is 26.901.6511.0.
No Experimental/Beta feature or Deprecated/Removed flag is required by this
harness. Native Computer Use being unavailable in a session does not prevent CLI
browser smoke. Do not infer Desktop engine identity from a separately installed CLI.

## Handoff, parallel work, and feedback

### Instruction clarity and proportionate verification

Apply Skills within the user's authorized scope. Explicit user instructions take
precedence over Skill guidelines; this does not grant an exception to existing
security, Product, independent-QA, or release gates unless the user explicitly
authorizes a bounded exception permitted by current Development Governance. If a
Skill causes a pause or scope change, link its exact `SKILL.md`, quote the relevant
instruction, and explain whether the constraint is explicit or an interpretation.
Resolve routine choices from available evidence; ask for missing input that changes
the outcome.

Keep follow-up corrections and side questions attached to the ongoing objective
unless the user changes it. Preserve completed work when resuming. Report the
result, evidence, remaining uncertainty, and next owner in concise prose; use
lists or tables when comparison or sequence benefits from them.

Calibrate additional tests to the changed behavior. Avoid tests that merely
restate implementation and repeating successful checks without a changed source,
failure, or unresolved concern. This does not reduce the required `verify` checks,
packet evaluations, or W01's independent verification of normal behavior-changing
candidates.

These clarifications adapt the official
[GPT-6 Astra prompting guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices),
checked 2026-09-10. The existing conditional delegation policy below still applies;
model guidance does not authorize subagents or change tool permissions. See the
[bounded maintenance record](ASTRA_GUIDANCE_REVIEW.md) for scope and acceptance.

### Pure documentation maintenance fast path

For user-authorized development-documentation maintenance, follow
[Development Rules §15.1](../DEVELOPMENT_RULES.md). W01 Independent QA is not
required when the change only reorganizes, deduplicates, indexes, archives, or
clarifies documentation while preserving Product/Architecture/Roadmap/Gate,
AI/Mutation authority, Security/Data, migration, Acceptance, regression, normal
QA/release, and application/runtime semantics.

Canonical-owner consolidation is allowed when the full meaning remains available
at the new authority and old current/historical links either move in the same
change or resolve through an explicit compatibility pointer. Deterministic
`docs:check` maintenance may accompany the documentation change when it does not
weaken required repository/application checks.

If documentation changes one of those semantics, executable application/runtime
behavior, Hooks, shared Skills, sandbox/permission configuration, or CI/protection
policy, leave the fast path and use normal governance/QA. A user may explicitly
authorize a bounded exception; record it and do not generalize it.

Fast-path documentation work still uses current-main awareness, existing-change
protection, applicable deterministic checks/CI, and the protected PR/merge path.
Do not label it `QA Complete`; instead record that independent QA was not required
under the documentation-maintenance fast path or explicit user exception.

Use [Verification record](../templates/VERIFICATION_RECORD.md) when a full
implementation/QA handoff is applicable. Continue the authorized packet through
self-checks and W01 handoff where required. Missing Product decisions or external
authorization block only their dependent actions, not unrelated authorized work.
Do not ask repeatedly for permission already granted.

When the user or applicable instructions authorize subagents, split bounded
read-only research/review by artifact. Assign exclusive file ownership for any
edits; use isolated worktrees/ports for tests. Never treat an implementation
subagent as W01 independent QA. Check every delegated result before integrating.

For repeated corrections, put the root cause and one demonstrable prevention in
the relevant PR/packet: test for a regression, Skill/script for repeated mechanics,
or governance/ADR for authority changes. Record who verifies closure; do not grow
AGENTS.md with an unfiltered conversation history.
