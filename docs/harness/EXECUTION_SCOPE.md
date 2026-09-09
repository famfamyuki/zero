# Reproducible harness maintenance

Authority: user requested harness diagnosis and authorized its implementation on
2026-09-09. Base: live GitHub main `b690903747e8f13e95c71fc28da32f55e800c7f5`.
This is bounded engineering maintenance, not Product selection or paid enablement.

Definition of Ready: the scope changes developer tooling/docs only; deterministic
product behavior, source schema, provider payloads, analytics, and C01/W01 release
authority remain unchanged. No external credentials are needed for normal checks.
Rollback is reverting this maintenance change; personal Skill corrections have
separate local backups and are not part of the repository release.

| Upstream requirement | Acceptance criterion | Evidence |
|---|---|---|
| AGENTS source-of-truth and existing-change protection | H-01: preflight distinguishes cached main, dirty source, detached/old branches; makes no mutations | harness tests + command on real checkout |
| Required implementation checks | H-02: verify runs required checks, fails on errors/runtime mismatch/source drift, and writes revision-bound self-evidence | harness tests + complete verify run |
| Security baseline | H-03: local secret signatures fail without printing matching values; CI includes the check | scanner positive/negative fixtures + CI configuration |
| Regression preservation | H-04: local browser smoke exercises deterministic review and portable import/export with no paid/provider access | Playwright smoke |
| Role registry | H-05: shared Skills and evidence template preserve W01 independence and exact-revision release | doc/Skill review |
| Minimal permissions | H-06: trusted-project config requests workspace-write, on-request, no general shell network; Hooks never approve tools | TOML parse / CLI diagnostics + hook payload checks; runtime Hook trust separately required |

Out of scope: changing product behavior, production configuration, merchant/legal
decisions, paid evaluations, W01 approval, automatic release, or account-wide
Plugin removal. Any newly discovered Product issue is reported separately.
