# AgentGraph Studio — Product Security & Reliability Baseline

Status: **Authoritative cross-cutting engineering baseline**  
Scope: AgentGraph Studio platform/product security, production reliability, operational controls, and release safety.

This document is distinct from workflow-level Security & Policy Engineering in the product roadmap.

```text
Product / Platform Security
≠
Workflow Security / Policy Evaluation
```

The former applies now to AgentGraph Studio itself. The latter evaluates capabilities/policies of user workflows and may mature in later stages.

## 0. Source-of-truth rule

Latest repository reality, Production behavior, and the active packet remain authoritative for scoped implementation. A packet may impose stricter requirements than this baseline.

---

# 1. Security principles

- least privilege
- explicit trust boundaries
- secrets stay server-side
- untrusted workflow/imported text remains data, not control instruction
- data minimization before provider calls
- no sensitive raw content in analytics
- fail closed for invalid security-critical contracts
- deterministic enforcement where deterministic enforcement is possible
- AI is not the enforcement boundary
- safe rollback must remain possible

---

# 2. Secrets and credentials

Mandatory:

- never commit API keys, tokens, credentials, `.env` secrets, private certificates, or provider secrets
- provider secrets must not use client-exposed environment prefixes
- secrets must not appear in browser bundles, analytics, user-visible errors, docs, screenshots, CI logs, or normal runtime logs
- error sanitization must remove provider/raw credential material
- rotate any secret suspected of exposure; do not merely delete it from a later commit

Where supported, repository secret scanning and dependency/security alerts should be enabled.

---

# 3. Dependency and supply-chain baseline

For material production dependencies:

- use lockfiles
- review dependency additions for maintenance/security implications
- avoid unnecessary dependencies for small utilities
- do not execute untrusted repository/imported code merely to inspect it
- track security advisories relevant to production dependencies
- upgrade high-impact vulnerable dependencies through focused packets or maintenance work without unrelated product churn

CI must use reproducible dependency installation (`npm ci` for the current Node project).

---

# 4. HTTP / browser security baseline

As applicable to the deployed surface:

- HTTPS only in Production
- same-origin behavior by default
- do not add permissive CORS without a specified API use case
- use safe response caching rules for sensitive/dynamic endpoints
- AI/evaluation responses containing user workflow-derived content should default to `Cache-Control: no-store` unless a future contract proves another policy safe
- render AI/user text as text, not trusted HTML
- avoid `dangerouslySetInnerHTML` for model/user content
- evaluate CSP/security headers when introducing new third-party script/provider surfaces

---

# 5. Public API abuse protection

Any endpoint with meaningful compute/provider cost or mutation authority must define before Production:

- authentication requirement if applicable
- request schema
- maximum request/body size
- concurrency behavior
- timeout behavior
- rate-limit / WAF / abuse policy
- sanitized error contract
- retry semantics
- logging/privacy rules

Provider-backed endpoints must not rely solely on client-side disabling for abuse control.

---

# 6. Logging and observability privacy

Default rule: logs should contain operational metadata, not user workflow payloads.

Do not log by default:

- full workflow source
- Evidence bodies
- provider prompts
- provider responses
- secrets/credentials
- tool parameter values that may contain secrets
- imported source code bodies

Prefer bounded metadata such as:

- route
- status/error category
- duration
- contract/version
- deployment/version identifier
- request correlation ID where safe

Log access should remain limited to operational need.

---

# 7. Reliability contract

Every provider-backed or critical server feature should specify measurable operational behavior before Production, including where relevant:

- timeout
- retry policy
- concurrency limit
- degraded state
- fallback behavior
- user retry behavior
- p50/p95 latency observation
- failure/error-rate observation
- external dependency failure isolation

Do not invent permanent SLO numbers without measured baselines. A packet may define provisional SLOs; once operational data is sufficient, mature them into explicit versioned targets.

Core deterministic functionality must remain available when an optional AI provider is degraded unless a future packet explicitly changes that architecture.

---

# 8. AI/provider operational governance

For each production evaluator/provider adapter track where practical:

- provider/model identifier
- evaluator/prompt/rubric version
- request latency
- timeout/error categories
- rate-limit behavior
- structured-output invalid rate
- bounded cost-per-review / usage trend where available

Do not send workflow content to analytics to obtain these metrics.

Provider fallback is **not automatically safer**. If introduced, each fallback must satisfy the same structured validation, privacy, benchmark, and knowledge-status contracts.

---

# 9. Cost and runaway protection

Provider-backed functionality should include controls proportional to possible cost:

- explicit user invocation where appropriate
- no accidental edit-triggered loops unless explicitly designed
- no unbounded automatic retries
- request size limits
- rate limiting
- concurrency control
- budget/usage monitoring where platform support exists

Unexpected cost spikes are an operational incident, not merely a billing concern.

---

# 10. Release and rollback

Before Production Verified, follow `docs/DEVELOPMENT_RULES.md` and the active packet.

For material releases:

- current main is known
- tests/typecheck/build pass
- Production deployment is `READY`
- changed behavior smoke-tested
- relevant runtime errors checked
- GitHub main SHA equals Vercel Production `githubCommitSha`

If a release introduces a material regression/security issue, prefer rapid rollback or a minimal corrective release over broad unrelated cleanup.

A rollback must not be described as restoring safety if incompatible data migrations or external side effects make the rollback unsafe; such changes require explicit migration/rollback design before release.

---

# 11. Incident response minimum

For a material Production incident:

1. identify affected deployment/SHA
2. classify user impact and possible data/security exposure
3. stop/limit the harmful path if necessary
4. rollback or deploy the smallest safe correction
5. verify Production state and runtime behavior
6. document root cause and prevention action
7. convert meaningful regressions into tests/fixtures where practical

Security incidents involving potential secret exposure require rotation/revocation in addition to code correction.

---

# 12. CI / repository enforcement

The repository should enforce on pull requests and `main` pushes:

```text
npm ci
→ npm test
→ npm run typecheck
→ npm run build
```

The repository should use branch protection/rulesets so required CI checks cannot be accidentally bypassed for normal changes.

If platform/account limitations prevent enforcement, the limitation must be documented and the manual release gate remains mandatory. The absence of branch protection does not waive test/typecheck/build requirements.

---

# 13. Security review triggers

Explicit security review is required when adding/changing:

- authentication/authorization
- account/cloud persistence
- external source-code/project import
- arbitrary file parsing
- provider credentials/providers
- remote tool execution
- workflow mutation APIs
- collaboration/RBAC
- billing/payment authority
- sensitive-data handling
- runtime trace ingestion
- organization policy enforcement

Security review should focus on new trust boundaries, not merely run a generic checklist.
