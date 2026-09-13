# Architecture Review — isolated Preview tester experiment

This user-authorized development experiment is separate from
[`AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1`](../specs/AGS-AR-EVALUATION-TRUST-FOUNDATION-V0-P1.md).
It does not change that packet's scope/status, the current Sprint lifecycle,
paid launch lifecycle, Gate A/B, AI Authority, or Mutation Authority. It is not
commercial activation, Paid Access Production Verified, or independent QA.

Base: live GitHub `main` observed on 2026-09-13 at 14:15 UTC,
`6fa247da52553d2885d6aed6c701eb11d1addc69`. This is an experiment baseline,
not a permanent assertion about current main. Work stays on the isolated
`experiment/nonprod-architecture-review-test` branch; do not merge or promote it
to Production as part of this experiment.

## Access and safety contract

- Only Vercel Preview with a present non-main Git branch and the explicit server
  tester flag set to `true` can enable tester access. Production, local/development,
  missing branch metadata, and main all deny tester access even with that flag.
- Existing Supabase bearer authentication verifies each request. Only an exact
  stable user UUID in the server allowlist grants tester access. The unauthenticated
  discovery response exposes only feature availability, never membership or IDs.
- `GET /api/architecture-review/preview-access` returns only `enabled` and `allowed`
  booleans with `no-store`. The POST independently rechecks access; client state
  cannot grant it. Missing/invalid provider configuration fails closed.
- Tester state is separate from paid subscription state. No subscription, paid
  entitlement, paid reservation/consumption, or billing accounting is used by a
  tester invocation. Existing paid offer, checkout, access and accounting APIs
  retain their contracts. Production always follows the existing paid path.
- The existing explicit Run action, deterministic Evidence, minimized provider
  envelope, secret/tool-parameter exclusion, schema and Evidence/target validation,
  untrusted-data instructions, Known/Inferred/Unknown rules, output validation,
  no-tools/no-mutation policy, provider `store:false`, and zero automatic retries
  are unchanged.
- The shared approved provider cost profiles retain the exact 32,768-byte provider
  envelope, 4,096 output tokens, and 250,000 micro-USD worst-case request ceiling.
  The existing 512 KiB body limit and 45-second abort are unchanged. No input is
  silently truncated. Use the existing approved model-matched configuration in
  [`config.ts`](../../lib/paid-architecture-review/config.ts); no new model is selected.
- No workflow, Evidence, prompt, result, or billing record persistence is added.
  Analytics uses only existing bounded metadata with explicit `preview_tester_v0`
  access mode; identities, allowlist values and semantic content are excluded.
- The tester path deliberately has no paid quota or durable replay ledger. The UI
  allows one in-flight action and does not retry automatically, but repeated actions
  or direct requests can incur repeated provider costs. Per-request bounds are not
  a cumulative account budget or a cross-instance rate/concurrency guarantee.

## Preview environment names

Configure only the experiment branch's **Preview** environment. Values and secrets
are deliberately omitted from this handoff. No external configuration is changed
by implementing or testing the experiment.

Tester activation and server allowlist:

- `ARCHITECTURE_REVIEW_PREVIEW_TEST_ENABLED`
- `ARCHITECTURE_REVIEW_PREVIEW_TEST_USER_IDS`

Existing server provider/safety configuration:

- `OPENAI_API_KEY`
- `ARCHITECTURE_REVIEW_MODEL`
- `ARCHITECTURE_REVIEW_COST_PROFILE_MODEL`
- `ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES`
- `ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS`
- `ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD`
- `ARCHITECTURE_REVIEW_INPUT_MICRO_USD_PER_MILLION_TOKENS`
- `ARCHITECTURE_REVIEW_OUTPUT_MICRO_USD_PER_MILLION_TOKENS`

Existing Supabase authentication configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The existing server auth client falls back to `NEXT_PUBLIC_SUPABASE_URL`;
`SUPABASE_URL` is optional and, if present, must identify the same auth project.
Only the public Supabase URL/anon key belong in the browser. Provider credentials,
service-role key, and tester allowlist stay server-side.

Vercel supplies `VERCEL_ENV` and `VERCEL_GIT_COMMIT_REF`; both must be available to
the deployment. Missing metadata denies tester mode. Stripe variables, paid-launch
approvals, paid quota configuration and paid activation are not tester prerequisites.
Keep paid activation disabled.

## Try the existing review

1. Deploy this branch to Vercel Preview. Set the names above in Preview scope,
   using the existing approved provider/safety profile and your Supabase user UUID
   allowlist, then redeploy so both server and public auth configuration are applied.
2. Ensure the existing Supabase auth redirect allowlist accepts this Preview's
   sign-in callback. Any required Supabase setting change is an owner action;
   this experiment does not change it. Open the Preview URL, not the Production URL.
3. Load a small template/workflow, open Preflight, and select Architecture Review.
   Use the existing email sign-in link for the allowlisted account. Confirm that
   the link returns to the same Preview and that **Preview test mode** appears.
4. Click **Run Architecture Review** explicitly. This is the first real provider
   invocation; no provider call is made by automated verification. Checkout is not
   required. Inspect the existing findings/Unknowns/Locate UI; the workflow is unchanged.
5. Disable the tester flag and redeploy the Preview when finished. Do not promote
   this deployment to Production.

If sign-in returns to another origin, fix the Preview redirect configuration as
the owner. If tester access is denied, check the authenticated UUID and Preview
branch metadata without publishing either credentials or allowlist values.

## Deterministic verification

`tests/architecture_review_preview.test.ts` covers Production/flag/branch/auth/
allowlist denials, tester execution without billing, provider safety configuration,
request/Evidence/cost rejection, structured result rejection, timeout, Production
paid regression, offer isolation, rendered UI, analytics privacy and free-core
independence. Supabase and OpenAI are mocked and unexpected network I/O is rejected.
Existing Architecture Review, paid review and commercial UI tests remain in place.

Run the repository's pinned Node, `npm ci`, `npm run verify`, the full
`npm run docs:check`, and `npm run test:e2e`. Verification is implementation
self-evidence, not independent QA or any lifecycle promotion. Live provider
evaluation is not required or authorized by this experiment's automated checks.
