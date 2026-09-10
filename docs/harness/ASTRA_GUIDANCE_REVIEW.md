# GPT-6 Astra harness guidance review

Authority: user request on 2026-09-09 to review official Astra best practices and
apply compatible harness improvements while preserving important rules and
permissions. Owner: C01, bounded engineering maintenance under AGENTS.md.
Base: GitHub main `4b0fa63cd68a5a177545fa5d46ea0b4362296a87`, fetched and
reconfirmed with `git ls-remote` at 2026-09-10T09:46:40+09:00.
The 2026-09-10 follow-up authorizes verification, a scoped commit/push, and a
Draft PR for these two files only; merge and deployment are not authorized.

## Scope and readiness

Only the harness runbook and this execution note change. The existing AGENTS.md
already directs material work to that runbook. No new Product packet is selected;
the Program Board's paid-launch blockers and packet contracts remain intact.
No application, evaluator, data flow, model setting, dependency, configuration,
Hook, shared Skill, CI, or permission changes are needed. Existing working-copy
edits are preserved by using an isolated worktree from live main.

The session exposes broader effective permissions than the project's defaults;
that observation is not evidence that the project configuration enforces isolation
in this session. Neither configuration nor trust state is modified by this work.

## Review decisions and acceptance

Source: [OpenAI model guidance — GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices),
opened again 2026-09-10. The earlier review recorded an unretrieved short URL;
its destination and contents remain unverified. This review uses the independently
located official page directly.

| AC | Existing contract / decision | Acceptance evidence |
|---|---|---|
| A-01 | AGENTS and packet-start already require authorized follow-through; add clarity for Skill-caused pauses and ongoing corrections | Runbook explains the exact source of a stop without granting gate exceptions |
| A-02 | Required checks and C01/W01 separation remain authoritative | Runbook limits redundant extra verification, explicitly preserves required checks and independent QA |
| A-03 | Existing delegation is conditional on authorization | No unconditional delegation instruction added; no subagents used in this review |
| A-04 | Simplest Sufficient Architecture and bounded scope | Concise reporting guidance in existing runbook; no additional runtime mechanism or model migration |
| A-05 | Security baseline and existing-change protection | Diff contains only the two documentation files; config, Hooks, Skills, application, and root working-copy edits untouched |

Verification: run the existing `npm run verify` with pinned Node 22.23.2 and
inspect its actual result in `.harness/verification.json`. This covers
`secrets:check`, `docs:check`, tests, typecheck, and build. Review the diff against
A-01 through A-05. No new prose-matching tests are needed. Browser smoke and paid
provider evaluations are not applicable to this documentation-only scope. The
existing required CI job still includes deterministic browser smoke; that job must
pass without changing or bypassing its checks.

The local verification record is self-evidence, not independent QA. The next
owner is W01 for exact-candidate pre-release QA, followed by C01 through the
existing protected release path only if release is separately authorized.
Record the final candidate commit/tree, AC review, actual command results,
fingerprint, and remaining notes in the Draft PR using the
[verification record template](../templates/VERIFICATION_RECORD.md). Keep generated
logs and `.harness/verification.json` local; only these two documentation files
belong in the commit. Neither QA Complete nor Production Verified is claimed.

Live GitHub protection on 2026-09-10 requires `test-typecheck-build` with strict
base freshness, enforces administrators and conversation resolution, and disallows
force pushes/deletions. The PR path is required but the configured approving-review
count is zero; W01 approval therefore remains a separate mandatory governance
gate. No branch rules were returned by the rules endpoint. Recheck at release.

The fetch emitted a permission warning for an unrelated worktree metadata entry;
the requested ref and live main matched. No worktree pruning or permission changes
were used. This warning is a local maintenance note, not proof of isolation.
Rollback: reverse only this scoped documentation diff.
