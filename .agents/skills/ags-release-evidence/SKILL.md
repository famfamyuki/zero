---
name: ags-release-evidence
description: Check AgentGraph Studio release evidence and exact-revision C01/W01 handoffs when release or Production verification is requested.
---

Read AGENTS.md, docs/CHAT_ROLE_REGISTRY.md, the active packet, and its runbook.
Establish which role is acting and the user-authorized operations. Prefer
read-only GitHub/Vercel queries to establish live main, required CI/protection,
the W01-approved candidate, and the actual deployment identity.

Release only through the required repository path and only the W01-approved
change set. Behavior changes require fresh independent QA. Record candidate tree
versus released tree where merge strategy changes the commit identity.
Deployment READY alone is not Production Verified: W01 independently checks
production target/alias, main-to-deployment SHA correspondence, changed behavior,
and relevant errors. Use docs/templates/VERIFICATION_RECORD.md.

Paid enablement/financial QA additionally requires the approved paid-launch
procedure, external prerequisite evidence, and existing financial authorization.
A passing local check, available connector, or this Skill is not that approval.
Do not upgrade C01 self-report into W01 evidence or mark Sprint Complete (00).
