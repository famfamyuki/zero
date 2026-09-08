---
name: ags-verify-handoff
description: Verify an AgentGraph Studio implementation and prepare revision-scoped C01 to W01 evidence, including missing packet-specific or browser checks.
---

Read docs/harness/README.md and the packet's AC matrix. Use the pinned Node,
`npm ci` when setup is needed, then `npm run verify`. Do not run these
artifact-producing steps on a read-only task or concurrently in one checkout.
For applicable UI changes, run `npm run test:e2e` and the packet-specific
manual scenarios. Provider evaluations require their existing budget and data
authorization; normal checks do not authorize them.

Inspect actual results, not just the existence of .harness/verification.json.
Match its source fingerprint/revision to the candidate and invalidate evidence
after changes. Use docs/templates/VERIFICATION_RECORD.md to connect ACs to checks,
record what was not run, and name the next owner. Local self-checks and subagent
reviews are not W01 QA. Do not merge or deploy from this Skill.
