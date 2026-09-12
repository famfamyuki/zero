# Astra launch hardening — C01 implementation evidence

Packet: [AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1](../specs/AGS-ASTRA-CHALLENGE-LAUNCH-HARDENING-V0-P1.md).
Owner: C01. Status: **Implementation Complete** (2026-09-12).
Next owner: **W01 — Independent QA / Pass A**. Independent QA is not performed by this record.

## Candidate and baseline

- Branch: `codex/astra-launch-hardening-20260912` in an isolated worktree.
- Base: live GitHub main `a3eea6cb7e709cc32e26026656a18cd0bf01b399`, re-fetched/rechecked at 2026-09-12 23:06 JST.
- The exact committed candidate is identified by the PR head and accompanying W01 handoff; this file does not embed its own containing commit hash.
- Existing unrelated working changes were preserved. No reset, stash, clean, overwrite, or manual worktree pruning was used.
- Live main protection required strict `test-typecheck-build`, PR workflow, and enforced administrator protection when inspected.

## Implemented changes

- `app/page.tsx`: select the existing representative preset by ID; preserve hydration; carry field/scope to Inspector; synchronously refresh Readiness before exact return matching.
- `components/editor/WorkflowOverview.tsx`: specified EN/JA orientation guide under Example presentation origin, no guide on empty artifacts, and secondary challenge attribution.
- `components/editor/Inspector.tsx`: scoped editable-control focus, mounted listener, advanced disclosure opening, heading fallback with visible focus, and Design-bounded mobile backdrop.
- `lib/i18n/translations.ts`: visible/accessible Output schema labels.
- `app/layout.tsx`, `public/launch-preview.svg`, `public/launch-preview.png`: canonical/OG/Twitter metadata and static 1200×630 artwork. PNG was rendered from the repository SVG and visually inspected.
- `tests/astra_launch_hardening.test.ts`, `tests/e2e/astra-launch.spec.ts`: deterministic schema improvement and changed-path/browser coverage.

## Acceptance evidence

All results below are **C01 implementation self-evidence**, not a W01 verdict.

| AC | Implemented result / verification |
|---|---|
| 01 | Saved artifact rehydration preserved unchanged; browser assertion compares stored artifact. |
| 02 | Clean context starts Competitor Catalog Review Crew as Example; both browser projects. |
| 03 | Exact medium `RDY_JSON_OUTPUT_SCHEMA_IMPLICIT` at `task-5.outputSchema`; deterministic test and browser. |
| 04 | Exact EN/JA guide; saved/empty contexts hide it; existing presentation-origin transitions remain unchanged. |
| 05 | Single existing primary Run Preflight button; external-blocked, paid-off browser loop. |
| 06 | Canonical finding reached by real Tab/Enter/arrow navigation and pointer. |
| 07 | Correct task/Inspector/return context and visible Output schema focus; both projects. |
| 08 | Fieldless/unsupported/scoped-name fallback and missing-target refresh-in-place; browser tests. Advanced editable field opens its existing disclosure. |
| 09 | Fixed schema removes exact finding; validation remains valid; deterministic and browser checks. |
| 10 | Immediate pointer return and keyboard return reach stable heading after resolution; explicit re-evaluation keeps exact finding absent; no fuzzy matching added. |
| 11 | Updated JSON downloads and deterministic roundtrip passes; existing browser import/export roundtrip remains green. |
| 12 | CrewAI Python export opens deterministic generated code in both projects. |
| 13 | Full 348-test regression suite and original free-core browser tests pass, including static CrewAI import and template discovery. |
| 14 | Existing static/non-runtime disclaimers preserved; diff and bounded metadata copy reviewed. |
| 15 | Full representative loop passes with external browser requests blocked and service credentials stripped / paid-off server. |
| 16 | No AI proposals, Apply, provider/model, runtime, or persistence expansion; scoped diff. |
| 17 | Exact non-interactive attribution on Overview; no unsupported Astra runtime wording. |
| 18 | Local production build HTTP has canonical/OG/Twitter/image dimensions/alt; actual Production fetch after release remains W01 Pass B. |
| 19 | Public static PNG and build-time metadata; no new API, auth, provider, or user-artifact dependency. |
| 20 | Complete keyboard-only loop through edit/return/re-evaluate/JSON and CrewAI export, including modal focus restoration. |
| 21 | 320×740 mobile Japanese checks show no page overflow and reachable return actions; screenshots inspected. |
| 22 | Semantic heading/ordered list, text finding anatomy, visible control/heading focus, and polite resolution announcement. |
| 23 | Existing analytics/privacy/activation suites pass; no analytics calls or event contracts changed; automatic preset selection does not invoke manual template selection. |
| 24 | GraphDocumentV1, API routes, storage semantics, and provider/data/persistence contracts unchanged. |

## Verification

Windows; Node **22.23.2** from `.node-version`; unchanged package lock; `npm ci` completed.

| Check | Actual result |
|---|---|
| `npm run docs:check` | PASS, including current-authority reference check |
| `npm test` | PASS — 348 tests, 12 suites |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — root route statically generated |
| `npm run verify` | PASS — deterministic checks, secret signatures, unchanged-source fingerprint |
| `npm run test:e2e` | PASS — 16 tests; desktop-en 1280×900 and mobile-ja 320×740 |
| `git diff --check` | PASS |

The local `.harness/verification.json` is self-evidence, not a signed attestation or portable Git identity. Logs/screenshots are local ignored artifacts. Fault cases use test-only mounted React navigation callbacks inside click events; no application test endpoint or persisted identity was added.

## Findings resolved and remaining uncertainty

- Mobile Inspector backdrop originally intercepted the return action. It now covers the Design workspace; pointer and keyboard regressions pass.
- Immediate return could precede the 250ms edit evaluation and focus a disappearing item. Return now evaluates current Readiness before exact matching; immediate-return regression passes.
- Field navigation distinguishes Crew from Node fields and installs its listener at mount before paint. Unsupported fields retain heading fallback.
- Known: the scoped local checks pass. No packet implementation blocker remains.
- Known note: dependency installation reported 4 existing audit findings (3 high, 1 critical). The lockfile/dependencies are unchanged; this packet does not claim a dependency-security remediation.
- Inferred: the verified static build should expose the same metadata after its exact candidate is released; deployment alone is not Production behavior evidence.
- Unknown: W01's independent verdict and candidate Production behavior. No QA Complete, release approval, Production Verified, or Sprint Complete is claimed.

At the pre-handoff baseline observation, Production deployment `dpl_2w3Av3RAmGX61FAi2RnmP4vthkWm` was READY, target production, alias `zero-six-khaki.vercel.app`, and main SHA `a3eea6cb7e709cc32e26026656a18cd0bf01b399`; `/` returned HTTP 200. This is baseline identity, not verification of this candidate.

Scope expansion: **none**. Paid Architecture Review remains disabled/fail-closed under its separate lifecycle. AI Authority and Mutation Authority are unchanged. PAUC AC-30, M0, Stage/Gate decisions, and provider evaluation remain outside this implementation.
