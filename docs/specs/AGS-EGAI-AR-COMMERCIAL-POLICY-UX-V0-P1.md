# AGS-EGAI-AR-COMMERCIAL-POLICY-UX-V0-P1 — Architecture Review Commercial Policy UX v0

Status: **Specified**  
Owner: `02 — UX & Implementation Specification`  
Selected scope: smallest Product-facing policy / UX closure for the already-selected Commercial Enablement path  
Coupled packet: `docs/specs/AGS-EGAI-AR-PAUC-V0-P1.md`  
Operational contract: `docs/runbooks/ARCHITECTURE_REVIEW_PAID_LAUNCH.md` on the commercial-enablement branch until merged through the canonical lifecycle  
Specification date: **2026-09-06**

This packet is a narrow amendment for the initial paid Architecture Review. It defines the user-visible policy summary, public policy-link contract, and support/privacy presentation needed to make the existing commercial launch candidate implementation-ready without asking C01 to invent Product, merchant, legal, tax, support, billing, quota, provider, or AI-authority decisions.

It does **not** authorize merge, Stripe Live activation, paid Production enablement, Production Verification, Sprint Complete, Gate A, Commercial Validation Gate M0, Stage 1.5, or Stage 2.

---

# 0. Source-of-truth and decision boundary

Before implementation, QA, or release, re-check current repository and Production reality. At specification time:

- GitHub `main` = `916151238ffa1ecbbc44347f362cd3313776d804`;
- PR #35 branch = `codex/commercial-enablement-prep-20260905`;
- PR #35 pre-spec head = `5e207c16ba48dcde32f688d4a1c38612fb9f8acb`;
- public Production paid Architecture Review is disabled/fail-closed;
- PR Preview exposes the provisional `USD 12.00 / month`, `10 reviews / monthly billing period` offer;
- PR Preview policy URLs are placeholders and therefore are not acceptable Production launch inputs;
- PR #35 already contains Production fail-closed validation for placeholder policy URLs.

The durable authority split remains:

```text
01
= Product/commercial configuration and policy semantics

02 / this packet
= exact application UX copy, placement, link semantics, and implementation-ready verification contract

C01
= mechanical repository implementation only

External merchant/legal/privacy/tax/support authority
= approved hosted policy content, merchant/tax facts, actual support operation, and written launch approvals

W01
= independent QA and Production verification
```

External approval may approve the exact Product copy below or require legally equivalent wording. Any requested change that changes Product semantics — price, quota, cancellation timing, refund boundary, tax presentation, provider data scope, entitlement, or rights boundary — returns to the appropriate 01/02 authority instead of being silently changed by C01.

---

# 1. Fixed upstream Product contract

This packet does not reopen the following already-approved provisional launch configuration:

```text
Offering
= Architecture Review

Provider-backed access
= authenticated active paid entitlement only

Base price
= USD 12.00 / month

Included quota
= 10 valid Architecture Reviews / confirmed monthly Stripe billing period

Overage
= none

Rollover
= none

Trial
= none

Free provider-backed reviews
= none

Tax
= Stripe Tax-ready Checkout; tax calculated separately when applicable

Cancellation
= month-to-month; cancel at period end

Default prorated refund
= none

Exception refund path
= support-mediated review for duplicate charge, billing error, or material service failure

Statutory rights
= preserved

Controlled live financial QA
= QA subscription canceled and fully refunded after verification; operational QA procedure only, not a public customer promise
```

The existing PAUC entitlement, quota, Stripe lifecycle, provider cost envelope, data model, provider payload, and AI authority remain unchanged.

---

# 2. Included / Out of Scope

## Included

1. Terms UX topics and checkout-adjacent Product summary.
2. Privacy UX disclosure for the already-specified provider/Auth/billing/metadata flow.
3. Canonical Support entrypoint and contact-path UX.
4. Refund/cancellation/tax presentation in the application.
5. Public Terms / Privacy / Support URL contract.
6. Exact EN/JA application copy where the UI must be deterministic.
7. Policy-link behavior across paid-access states.
8. Accessibility and responsive requirements for this policy UX.
9. Acceptance Criteria, tests, Production verification expectations, and traceability.
10. Explicit external Production prerequisites.

## Out of Scope

- merchant legal identity selection or invention;
- tax registration, tax nexus, tax jurisdiction, or launch-geography selection;
- legal advice or an assertion that any text is legally sufficient/compliant;
- drafting a full jurisdiction-specific Terms of Service or Privacy Policy as a substitute for qualified review;
- paid Production activation;
- Stripe Live switch;
- merging PR #35;
- changing USD 12/month or quota 10;
- changing entitlement, quota, billing lifecycle, provider-cost envelope, WAF, or AI authority;
- Stage 1.5 / Stage 2 capability work;
- account/profile expansion;
- self-service account-deletion UI;
- automated refund workflow;
- custom tax engine;
- custom billing/payment UI;
- multiple plans, annual billing, trial, overage, rollover, top-up, or promotion-code UX;
- persistence of workflow/Evidence/Architecture Review result content;
- new analytics containing workflow content or policy-page browsing content beyond already-approved bounded events.

---

# 3. User-visible policy architecture

The smallest sufficient Product-facing structure is:

```text
Architecture Review surface
├─ provider-processing disclosure
├─ paid offer summary when the offer is enabled
│  ├─ price + included quota
│  ├─ monthly renewal / cancellation summary
│  ├─ rollover / overage / trial boundary
│  ├─ failed-review allowance rule
│  ├─ refund summary
│  └─ tax summary
├─ Subscribe CTA when eligible to start Checkout
├─ Terms | Privacy | Support links
└─ state-specific billing/support actions

External public pages
├─ Terms URL
├─ Privacy URL
└─ Support URL
```

Do not add a new global account area, custom billing settings page, policy modal system, or legal-consent database for v0.

No application checkbox such as “I agree” is invented by this packet. Any legally required explicit acceptance mechanism or Stripe Checkout consent setting is an **EXTERNAL PRODUCTION PREREQUISITE** and may be configured only from externally approved instructions. C01 must not infer it.

---

# 4. Exact application copy contract

Dynamic tokens are server-derived from the validated offer; they are not independent hard-coded Product values.

For the provisional launch configuration:

```text
{price}
= display the validated USD amount with an unambiguous currency code, e.g. `USD 12.00`

{includedReviews}
= `10`
```

Use the exact templates below. Punctuation may change only for locale typography; semantic wording must not drift.

## CPUX-COPY-01 — Provider-processing disclosure

**EN**

> Running Architecture Review sends the minimum necessary workflow-derived representation to the configured AI provider. Secrets and tool parameter values are excluded. The review does not change your workflow.

**JA**

> Architecture Reviewを実行すると、必要最小限のワークフロー由来情報が設定されたAIプロバイダーへ送信されます。シークレットとツールパラメータの値は除外されます。レビューはワークフローを変更しません。

Placement: always above the paid-access card in the Architecture Review surface, before any review-run action. This disclosure is not hidden behind authentication.

## CPUX-COPY-02 — Offer price / quota

**EN**

> {price}/month · {includedReviews} Architecture Reviews per billing period

**JA**

> 月額{price} · 1請求期間あたりArchitecture Review {includedReviews}回

## CPUX-COPY-03 — Paid value summary

**EN**

> An evidence-grounded architecture review of your current workflow.

**JA**

> 現在のワークフローを対象とした、Evidenceに基づくアーキテクチャレビューです。

## CPUX-COPY-04 — Renewal / cancellation

**EN**

> Monthly subscription. Renews each month until canceled. Cancel from billing management; cancellation takes effect at the end of the current billing period, and access remains available until then.

**JA**

> 月額サブスクリプションです。解約するまで毎月更新されます。請求管理から解約でき、解約は現在の請求期間の終了時に有効になります。それまでは利用できます。

## CPUX-COPY-05 — Quota boundaries

**EN**

> Unused reviews do not roll over. There is no overage purchase, free trial, or free provider-backed review.

**JA**

> 未使用のレビュー回数は繰り越されません。上限を超えた追加購入、無料トライアル、無料のプロバイダー利用レビューはありません。

## CPUX-COPY-06 — Failed-review allowance

**EN**

> A provider, timeout, or result-validation failure that does not produce a valid Architecture Review does not use an included review.

**JA**

> 有効なArchitecture Reviewが生成されなかったプロバイダーエラー、タイムアウト、または結果検証エラーでは、含まれるレビュー回数は使用されません。

This is a Product summary of the existing PAUC accounting contract. It does not change reservation/reconciliation behavior.

## CPUX-COPY-07 — Refund / statutory-rights summary

**EN**

> Canceling does not automatically provide a prorated refund for unused time. For duplicate charges, billing errors, or material service failures, contact Support for review. This does not limit statutory rights that apply to you.

**JA**

> 解約しても、未使用期間について日割り返金が自動的に行われることはありません。重複請求、請求上の誤り、または重大なサービス障害については、サポートにご連絡ください。適用される法令上の権利を制限するものではありません。

## CPUX-COPY-08 — Tax summary

**EN**

> Taxes are calculated separately at Checkout when applicable.

**JA**

> 税金は、該当する場合、Checkoutで別途計算されます。

This text does not assert tax registration, nexus, applicable geography, tax rate, tax type, or merchant tax status.

## CPUX-COPY-09 — Subscribe CTA

**EN**

> Subscribe and unlock Architecture Review

**JA**

> 購読してArchitecture Reviewを利用

## CPUX-COPY-10 — Policy link labels

| Destination | EN | JA |
|---|---|---|
| Terms | `Terms` | `利用規約` |
| Privacy | `Privacy` | `プライバシー` |
| Support | `Support` | `サポート` |

## CPUX-COPY-11 — Support prompt

**EN**

> Need help with billing, a duplicate charge, a failed review, a refund request, or account deletion? Contact Support.

**JA**

> 請求、重複請求、失敗したレビュー、返金依頼、またはアカウント削除についてサポートが必要な場合は、サポートにご連絡ください。

No response-time or resolution-time promise is added.

---

# 5. Terms UX contract

## CPUX-R01 — Required user-visible topics

The public Terms destination for the initial paid Architecture Review must contain externally approved content that accurately covers at least:

1. the applicable merchant/seller identity and contact information — supplied externally, never invented by C01;
2. the paid service name `Architecture Review`;
3. the provisional base price/currency and recurring monthly nature;
4. the included quota and monthly billing-period basis;
5. no rollover, overage, trial, or free provider-backed review;
6. subscription start/renewal and cancel-at-period-end behavior;
7. access through the end of a valid canceling billing period;
8. provider/timeout/invalid-result allowance semantics consistent with PAUC;
9. no default prorated refund and the support-mediated duplicate/error/material-failure review path;
10. preservation of applicable statutory rights;
11. applicable-tax-at-Checkout presentation without asserting an unapproved jurisdiction;
12. the advisory/evidence-grounded nature of Architecture Review and absence of unsupported runtime guarantees;
13. the Support path for billing/refund/service issues;
14. a link or reference to the approved Privacy material;
15. any additional merchant/legal terms required by qualified external review for the actual launch scope.

02 does not define governing law, dispute venue, liability caps, consumer classification, merchant legal name, or jurisdiction-specific mandatory terms.

## CPUX-R02 — Checkout-adjacent presentation

When `offer.enabled=true`, users must be able to see the commercial summary **before** starting Stripe Checkout.

In `signed_out` and `no_entitlement` states, present in this order within the paid-access card:

```text
Architecture Review
→ CPUX-COPY-02 price/quota
→ CPUX-COPY-03 value summary
→ CPUX-COPY-04 renewal/cancellation
→ CPUX-COPY-05 quota boundaries
→ CPUX-COPY-06 failed-review allowance
→ CPUX-COPY-07 refund/statutory-rights summary
→ CPUX-COPY-08 tax summary
→ sign-in action OR CPUX-COPY-09 Subscribe CTA, depending on state
→ Terms | Privacy | Support links
```

The summary is informational Product copy. Do not add a custom legal acceptance checkbox or claim that clicking the app CTA itself satisfies a particular jurisdiction's legal-consent requirement.

---

# 6. Privacy UX contract

## CPUX-R03 — In-app provider disclosure

`CPUX-COPY-01` is mandatory and remains visible before explicit provider invocation.

The Privacy link must be available without authentication whenever the paid offer is enabled.

## CPUX-R04 — Minimum public Privacy disclosure

The public Privacy destination must contain externally approved content that accurately describes the already-specified data flow at least at the following Product level.

### A. Provider-backed Architecture Review

The disclosure must state that explicit Architecture Review invocation sends the minimum necessary workflow-derived representation to the configured AI provider for the purpose of generating the review.

The representation may contain the already-approved Architecture Review Evidence and minimum architecture-relevant workflow semantics needed for interpretation, such as workflow/crew structure, relevant agent role/goal/backstory, task description/expected output/output contract, and tool label/type/description when required by the Stage 1 contract.

It must also disclose the hard exclusions relevant to users:

- secrets/credentials are not intentionally included;
- tool parameter **values** are excluded;
- unrelated UI/presentation state is excluded;
- provider-facing internal identifiers are aliased where sufficient;
- the feature does not silently mutate the workflow.

The approved Privacy content must identify or accurately categorize the actual AI provider as appropriate for the launch scope. Provider storage, retention, training, residency, or subprocessors must be described only from verified current provider terms/contracts; C01 must not invent or overclaim them.

### B. Stripe billing processing

The disclosure must explain that Stripe-hosted Checkout/Customer Portal processes subscription/payment/billing operations and may process payment-method, invoice/receipt, subscription, cancellation, and refund-related data under the approved merchant configuration.

AgentGraph may retain bounded Stripe identifiers/status needed for entitlement, quota reconciliation, support, accounting, and dispute handling. Do not claim that the application stores raw card details when they are entered into Stripe-hosted payment surfaces.

### C. Supabase authentication

The disclosure must explain that Supabase is used for email magic-link authentication/session identity and the server-authoritative user identity needed for paid entitlement/quota access.

Application analytics/logging must continue to exclude email addresses and authentication tokens under the PAUC/Data & AI Governance contract.

### D. Bounded operational metadata

The disclosure must explain that bounded operational metadata may be retained for security, billing/entitlement reconciliation, abuse/cost control, support, reliability, and commercial evaluation. Examples include bounded request/state/error categories, timestamps, webhook event identifiers/types, entitlement/quota state, reviewer/model/version identifiers, and bounded token/cost metadata.

It must not describe raw workflow text, Evidence bodies, prompts, provider responses, Architecture Review prose, source code, email, authentication tokens, or secrets as ordinary operational logging/analytics data.

### E. Retention / deletion boundary

Public Privacy material must remain consistent with the coupled PAUC packet:

- current entitlement/customer mappings may remain while the account/subscription relationship exists;
- closed usage-attempt metadata has the PAUC v0 operational target of at most 180 days unless a documented legal/accounting requirement requires longer retention;
- this paid-access packet does not persist workflow/Evidence/result content as billing history;
- account deletion is support-assisted in v0, not self-service;
- active billing must be canceled/resolved before the app entitlement/quota/customer mappings and Supabase user are deleted;
- external processors such as Stripe may retain records according to externally approved legal/accounting obligations and their applicable policy; do not promise immediate physical deletion from all third-party systems without evidence.

---

# 7. Support UX contract

## CPUX-R05 — Canonical support entrypoint

The Product contract approves one canonical public support entrypoint:

```text
ARCHITECTURE_REVIEW_SUPPORT_URL
```

It must resolve to a real, public, authentication-free HTTPS Support page. This avoids introducing an account/support-center product.

The page must expose at least one operational human-reachable contact mechanism, such as an approved support email address or web form.

**The actual support address/form destination, operator ownership, and staffing are an EXTERNAL PRODUCTION PREREQUISITE.** C01 must not invent an email address, legal identity, response commitment, or operator.

No further Product decision is required merely to choose email versus form if the externally approved Support URL satisfies this contract.

## CPUX-R06 — Supported contact reasons

The Support page and application support prompt must provide a clear route for:

- billing/payment issue;
- suspected duplicate charge;
- failed Architecture Review/service failure;
- refund request under the approved refund boundary;
- account deletion/privacy request.

The Support material should ask only for information necessary to investigate the request and should explicitly discourage sending API keys, tokens, secrets, or unnecessary workflow content.

## CPUX-R07 — No unapproved SLA

Allowed expectation language is bounded to statements such as:

> Support will review your request.

Do not promise `24 hours`, `one business day`, guaranteed refund timing, guaranteed resolution timing, or another SLA unless separately approved and specified.

---

# 8. Refund / tax presentation contract

## CPUX-R08 — Cancellation and refunds

The application and approved Terms must preserve all of these distinctions:

```text
Cancel subscription
= stops renewal at the end of the current billing period

Access after cancel-at-period-end
= remains eligible through the confirmed current period end while Stripe entitlement remains active

Default prorated refund
= no automatic prorated refund merely because the user canceled

Duplicate charge / billing error / material service failure
= user may contact Support for case review

Statutory rights
= preserved; Product copy must not imply waiver
```

No automated refund button/workflow is added.

The controlled W01 live-QA subscription is canceled and **fully refunded after verification** as an operational verification procedure. It must not appear in public Product copy as a general refund promise or precedent.

## CPUX-R09 — Tax

The application shows `CPUX-COPY-08`. Stripe Checkout is the surface that shows the actual calculated tax/total when applicable.

Product copy must not state or imply:

- a launch country/region not externally approved;
- that AgentGraph is registered for a specific tax without evidence;
- a specific VAT/consumption/sales-tax rate not supplied by the approved checkout configuration;
- that `USD 12.00` is tax-inclusive when the configured flow calculates applicable tax separately.

Merchant/tax setup and approval remain external launch facts.

---

# 9. Policy link placement and UX states

## CPUX-R10 — Policy navigation

When `offer.enabled=true` and valid `policyUrls` are present, render one reusable policy navigation group with the exact link labels from CPUX-COPY-10.

Required states:

| Paid UX state | Commercial summary | Policy links | Support path |
|---|---|---|---|
| `signed_out` | yes | Terms / Privacy / Support | Support link |
| `no_entitlement` | yes, immediately adjacent to Checkout CTA | Terms / Privacy / Support | Support link |
| `checkout_syncing` | no need to repeat full summary | Terms / Privacy / Support | Support link |
| `active` | quota/period state remains primary | Terms / Privacy / Support | Support link |
| `active_canceling` | current period-end state remains primary | Terms / Privacy / Support | Support link |
| `quota_exhausted` | quota state remains primary | Terms / Privacy / Support | Support link |
| `billing_blocked` | billing recovery state remains primary | Terms / Privacy / Support | Support link |
| `sync_degraded` | fail-closed state remains primary | Terms / Privacy / Support | Support link |

When the paid offer is disabled/fail-closed, do not show a subscribe CTA. The existing free-core availability message remains authoritative. Global policy-site design is out of scope; this packet only requires the paid-surface links while a paid offer is exposed.

If `offer.enabled=true` but any required policy URL is absent, the client must not render a Checkout CTA as though the offer were launch-ready. The server is expected to prevent this state through fail-closed configuration; the client treatment is defense in depth.

## CPUX-R11 — Failed-review support path

For a provider/timeout/result-validation failure, preserve the existing `no included review was used` message and make Support reachable without navigating away from the Architecture Review product context. A reusable policy navigation immediately below the paid-access state satisfies this requirement; an additional inline `Contact Support` link is allowed if it does not duplicate/confuse the primary action.

---

# 10. Public URL contract

## CPUX-R12 — Required URL keys

Production enablement requires real values for exactly:

```text
ARCHITECTURE_REVIEW_TERMS_URL
ARCHITECTURE_REVIEW_PRIVACY_URL
ARCHITECTURE_REVIEW_SUPPORT_URL
```

Each value must be:

- an absolute `https://` URL;
- stable enough for public customer use;
- reachable from a clean unauthenticated browser session;
- free of embedded username/password credentials or secret query parameters;
- not a localhost/private-development destination;
- not a placeholder/example/reserved host;
- owned or contractually approved for AgentGraph's launch use;
- backed by approved current content for its declared destination.

At minimum the Production readiness validator must continue to reject `example.com`, `example.net`, `example.org`, their subdomains, `.example`, and `.invalid` placeholder forms already covered by PR #35. Obvious localhost/loopback/private-development values must also fail Production readiness if encountered.

Do not make the application synchronously fetch policy pages on every offer request. URL reachability/content approval is a release/verification fact, not a runtime dependency for the deterministic free core.

## CPUX-R13 — Authentication-free reachability

W01 pre-enable verification must follow redirects from each configured public URL in a clean unauthenticated session and confirm:

- final destination remains HTTPS;
- no application login is required to read the policy/support destination;
- the page is usable without possession of a paid entitlement;
- Terms, Privacy, and Support content matches the configured purpose;
- the destination is not a placeholder, parked page, 404, or generic vendor homepage that lacks the required AgentGraph policy/support content.

## CPUX-R14 — Ownership / approval evidence

Before paid Production enablement, the restricted release record must contain, for each public URL:

- exact URL;
- content owner role/function;
- approval/evidence reference;
- approved content version/effective date or equivalent immutable reference;
- verification timestamp;
- result of unauthenticated HTTPS reachability check.

The approval record must also establish that the actual merchant/legal/privacy/support/tax facts needed by the published content were supplied by the responsible external authority.

Do not commit private legal, tax, or support secrets to the repository merely to satisfy this evidence requirement.

If externally hosted content materially changes after approval, re-check approval/reachability before Production enablement. If application code/copy changes after W01 Pass A, prior QA must be re-evaluated under the canonical lifecycle.

---

# 11. Accessibility / responsive requirements

## CPUX-R15 — Accessibility

- Use semantic links, not clickable text implemented as buttons/spans.
- Group policy links in a `<nav>` with localized accessible name: EN `Paid service policies`; JA `有料サービスポリシー`.
- Link purpose must be understandable from text; do not use icon-only policy links.
- Preserve visible keyboard focus.
- Interactive targets must meet the existing minimum 44px/`min-h-11` interaction contract where applicable.
- Commercial terms/refund/tax information must not be conveyed by color alone.
- If policy links intentionally open a new tab, expose an accessible indication such as an `aria-label` suffix `opens in a new tab` / `新しいタブで開きます`; `rel="noreferrer"`/safe equivalent remains required.
- Existing loading/billing state announcements remain available to assistive technology and policy links must not become part of an `aria-live` region that repeatedly re-announces static legal copy.

## CPUX-R16 — Responsive

- Commercial summary and policy links must wrap without horizontal scrolling at 320 CSS px viewport width.
- EN/JA text must not overlap the Subscribe, sign-in, Manage billing, or Refresh billing actions.
- Policy links may wrap to multiple rows; preserving readable labels is more important than forcing one-line layout.
- No fixed-height container may clip refund/tax/privacy copy under text zoom.
- Validate at minimum 200% browser text zoom and the existing mobile/tablet/desktop responsive breakpoints used by the Architecture Review surface.

---

# 12. Migration / compatibility / analytics

This packet introduces no persisted Product-schema migration and no API version bump by itself.

Compatibility requirements:

- existing free deterministic Builder, Templates, JSON Import/Export, CrewAI Static Import, Readiness, Execution Preview, Resource Analysis, Unified Preflight, and deterministic CrewAI Python Export remain unchanged;
- the existing paid offer API/config keys and PAUC state machine remain authoritative;
- existing billing portal behavior remains Stripe-hosted;
- existing Architecture Review provider Evidence/payload/result contracts remain unchanged;
- existing analytics remain metadata-minimal; policy copy/URLs must not cause raw workflow/Evidence/provider content to enter analytics;
- do not add policy URL query parameters containing user email, Supabase identity, Stripe identifiers, workflow identity, or secrets.

---

# 13. Acceptance Criteria

## CPUX-AC-01 — Scope / authority preservation

Implementation changes only Product-facing commercial policy presentation and URL readiness behavior defined here. Price, quota, entitlement, billing lifecycle, provider cost envelope, AI authority, and deterministic free-core behavior do not change.

## CPUX-AC-02 — Pre-auth transparency

When the paid offer is enabled, a signed-out user can see the validated price/quota, renewal/cancellation, quota, failed-review, refund/statutory-rights, tax summary, and Terms/Privacy/Support links without first authenticating.

## CPUX-AC-03 — Checkout-adjacent copy

A signed-in user with `no_entitlement` sees CPUX-COPY-02 through CPUX-COPY-08 before the Subscribe CTA and sees Terms/Privacy/Support links in the same paid-access card.

## CPUX-AC-04 — Provider disclosure

CPUX-COPY-01 appears before review invocation in EN/JA and remains consistent with Stage 1 data minimization. No change widens the provider payload.

## CPUX-AC-05 — Cancellation / quota / failed-review truthfulness

Application copy accurately states cancel-at-period-end, access-through-period-end while entitlement remains active, no rollover/overage/trial/free provider-backed review, and non-consumption for provider/timeout/result-validation failures that do not yield a valid review.

## CPUX-AC-06 — Refund / tax distinction

Application copy shows no automatic prorated refund on cancellation, support-mediated duplicate/error/material-failure review, statutory-rights preservation, and separately calculated applicable tax without making an unapproved jurisdiction/registration claim. The controlled QA full refund is absent from public customer copy.

## CPUX-AC-07 — Support reachability

The paid surface provides an authentication-free Support link in all offer-enabled paid-access states, and the public Support destination covers billing, duplicate charge, failed review, refund request, and account deletion without an unapproved SLA.

## CPUX-AC-08 — Privacy disclosure contract

The public Privacy destination, once externally approved, covers provider-backed minimum necessary workflow-derived processing, secret/tool-parameter-value exclusion, Stripe billing processing, Supabase authentication, bounded operational metadata, retention/deletion boundaries, and any provider-specific handling claims only from verified external facts.

## CPUX-AC-09 — Production URL fail closed

Production readiness fails when a Terms/Privacy/Support URL is missing, non-HTTPS, placeholder/example/reserved, or an obvious local/private-development destination. A configuration that fails this check cannot satisfy paid Production readiness.

## CPUX-AC-10 — Public URL verification

Before enablement, W01 verifies all three final URLs are real HTTPS destinations, authentication-free, readable, purpose-correct, and backed by the required ownership/approval evidence.

## CPUX-AC-11 — Accessibility / responsive

Policy UX satisfies CPUX-R15 and CPUX-R16 in EN/JA, keyboard-only navigation, mobile layout, and 200% text zoom.

## CPUX-AC-12 — Regression isolation

Paid policy/config/provider failures do not affect the deterministic free core. No new account/profile, refund engine, tax engine, custom billing UI, Stage 1.5/Stage 2, AI-authority, or mutation-authority behavior appears.

## CPUX-AC-13 — External launch gate remains explicit

The implementation may be `Implementation Complete` with externally approved URL values still absent from public Production, provided the feature remains fail-closed. Paid Production enablement is prohibited until every EXTERNAL PRODUCTION PREREQUISITE in section 16 and the coupled paid-launch runbook is evidenced.

---

# 14. Test / verification matrix

| ID | Verification | Owner | Expected evidence |
|---|---|---|---|
| CPUX-T01 | Component test: EN `signed_out` offer renders exact commercial summary + policy links | C01 | deterministic UI assertion |
| CPUX-T02 | Component test: JA `signed_out` offer renders exact commercial summary + policy links | C01 | deterministic UI assertion |
| CPUX-T03 | Component test: EN/JA `no_entitlement` places summary before Subscribe CTA and policy links adjacent | C01 | DOM-order/text assertion |
| CPUX-T04 | State matrix: `active`, `active_canceling`, `quota_exhausted`, `billing_blocked`, `sync_degraded`, `checkout_syncing` retain Terms/Privacy/Support access | C01 | component/state tests |
| CPUX-T05 | Failed provider/timeout/validation result preserves no-consumption user message and Support path | C01 | existing + focused regression tests |
| CPUX-T06 | Production config validation rejects missing/non-HTTPS/placeholder and obvious local/private-development policy URLs | C01 | `commercial_readiness` unit tests |
| CPUX-T07 | Offer API cannot expose an enabled launch-ready offer without all three valid policy URLs | C01 | API/config test |
| CPUX-T08 | Keyboard/focus/nav semantics and accessible new-tab indication | C01 self-test + W01 | accessibility check |
| CPUX-T09 | 320px layout + 200% text zoom in EN/JA without clipping/horizontal policy overflow | C01 self-test + W01 | responsive evidence |
| CPUX-T10 | Clean unauthenticated GET/navigation to final Terms/Privacy/Support URLs; HTTPS and content-purpose check | W01 / external readiness | timestamped bounded evidence |
| CPUX-T11 | External approval record exists for Terms/Privacy/Support/refund/tax/support ownership and does not conflict with app copy | responsible external authority + W01 checks presence | restricted approval reference |
| CPUX-T12 | Free-core regression: Builder, Templates, JSON Import/Export, CrewAI Static Import, Readiness, Execution Preview, Resource Analysis, Unified Preflight, deterministic CrewAI Python Export | C01 + W01 | existing regression suite/smoke |
| CPUX-T13 | Required repo checks | C01 | `npm run docs:check`, `npm test`, `npm run typecheck`, `npm run build` pass |
| CPUX-T14 | Commercial readiness remains fail-closed until final external inputs are supplied; do not enable Production | C01 + W01 | `commercial:check` / Preview evidence as applicable |

This packet adds no evaluator benchmark requirement because it does not change provider model/prompt/rubric/Evidence/result semantics.

---

# 15. Requirement traceability

| Requirement | Upstream authority | Packet AC | Test / verification |
|---|---|---|---|
| Paid value is an evidence-grounded review, not generic AI access | `MONETIZATION_ARCHITECTURE.md` §§1,4 | AC-02, AC-03 | T01-T03 |
| USD 12 monthly / quota 10 / no overage-rollover-trial-free review | 01-approved Commercial Enablement configuration; coupled PAUC/runbook | AC-02, AC-03, AC-05 | T01-T04 |
| Cancel-at-period-end / billing portal lifecycle | PAUC R08-R09; 01-approved policy | AC-05, AC-06 | T03-T04 |
| Provider failure does not consume a valid-review allowance | coupled PAUC reservation/consume/release contract | AC-05 | T05 |
| Provider data minimization / disclosure | `DATA_AND_AI_GOVERNANCE.md` §6; Stage 1 Evidence contract; PAUC R29 | AC-04, AC-08 | T01-T04, T11 |
| No content leakage in logs/analytics | Data & AI Governance; Security baseline; R-009; PAUC R28 | AC-08, AC-12 | existing logging/analytics tests + review |
| Commercial launch requires Terms/Privacy/Support/refund/tax path | `MONETIZATION_ARCHITECTURE.md` §11; R-021 | AC-06-AC-10, AC-13 | T06-T11, T14 |
| Public policy URLs fail closed and placeholders are prohibited | PR #35 current commercial readiness implementation | AC-09, AC-10 | T06-T07, T10 |
| External approval is not C01 Product authority | Engineering Execution Governance DoR/release dependency rule; Role Registry | AC-13 | T11, T14 |
| Free deterministic core remains isolated | PAUC R01; Monetization free-value contract; R-008 | AC-12 | T12 |

---

# 16. EXTERNAL PRODUCTION PREREQUISITES

These are **not unresolved C01 Product decisions**. They are external facts/approvals that must exist before paid Production enablement.

## EPP-01 — Merchant / Terms approval

A responsible human/qualified external reviewer must supply and approve the actual merchant/seller identity and the final hosted Terms content for the intended launch scope. The content must preserve this packet's Product semantics.

## EPP-02 — Privacy/provider approval

A responsible privacy/legal/data reviewer must approve the hosted Privacy content, including the actual AI-provider disclosure and any provider storage/training/retention statements based on verified current provider terms/contracts, plus Stripe/Supabase processing disclosures.

## EPP-03 — Tax / launch-scope approval

The responsible merchant/tax authority must decide and document the actual launch geography, tax registrations/configuration, and Stripe Tax setup. C01 must not infer these facts.

## EPP-04 — Refund / charge-handling approval

The responsible commercial/legal operator must approve the no-default-prorated-refund + support-mediated duplicate/error/material-failure policy and the operational process for refunds/charge handling. Statutory rights remain preserved.

## EPP-05 — Support operation

A responsible operator must supply the actual public Support URL, contact mechanism (email/form or equivalent), ownership, and operational access. No SLA is assumed.

## EPP-06 — Public URL publication / ownership evidence

Final Terms, Privacy, and Support URLs must be published, stable, HTTPS, authentication-free, non-placeholder, and have the approval/reachability evidence required by CPUX-R12-R14.

## EPP-07 — Controlled financial QA handling

The responsible financial operator must authorize the controlled Production QA charge handling and be able to cancel and fully refund the QA subscription after verification, as required by the paid-launch runbook. This is not public refund policy.

Other non-policy launch prerequisites — commercial-use hosting, Production Supabase Auth, Stripe Live objects/portal configuration, provider budget controls, WAF, and the canonical W01 Pass B — remain owned by the coupled PAUC packet/runbook and are intentionally not duplicated here.

---

# 17. Durable C01 handoff

C01 must perform only the mechanical repository changes needed to implement this packet on top of the current PR #35 branch.

1. In the existing Architecture Review paid-access surface, factor/reuse a small policy-navigation component rather than duplicating link markup across states.
2. Preserve `ARCHITECTURE_REVIEW_TERMS_URL`, `ARCHITECTURE_REVIEW_PRIVACY_URL`, and `ARCHITECTURE_REVIEW_SUPPORT_URL`; do not invent final URL values.
3. Preserve the existing offer API/config authority. Render `{price}` and `{includedReviews}` from the validated server offer; format price with an unambiguous currency code.
4. Add CPUX-COPY-02 through CPUX-COPY-08 to the offer-enabled `signed_out` and `no_entitlement` UX in the ordering specified by CPUX-R02.
5. Keep/update CPUX-COPY-01 before review invocation without widening the Stage 1 provider payload.
6. Make `Terms | Privacy | Support` available in every offer-enabled state in CPUX-R10 and preserve the existing billing-management actions.
7. Ensure failed-review UX has an obvious Support path without changing quota/accounting semantics.
8. Keep Checkout Stripe-hosted. Do not add payment fields, refund UI, tax calculation UI, account/profile UI, or a legal-consent checkbox unless a separately approved external requirement explicitly supplies one.
9. Extend Production readiness tests only as needed for the public-URL contract; retain PR #35 placeholder rejection. Do not make runtime paid/free behavior depend on fetching external policy pages.
10. Add focused EN/JA component/config tests for CPUX-T01-T09 and preserve all existing PAUC/regression tests.
11. Run and report:

```text
npm run docs:check
npm test
npm run typecheck
npm run build
```

plus the existing commercial readiness/test-mode commands required by the coupled PAUC/runbook for the launch-candidate revision.

12. Keep public Production paid Architecture Review disabled. Do not switch Stripe Live, merge PR #35, or treat Preview success as Production Verified.

If C01 discovers that this mechanical implementation requires changing a Product semantic above, stop and return the contradiction to 02/01 rather than inventing a new policy.

---

# 18. Specification decision

```text
Decision
= SPECIFIED_FOR_C01

Why
= 01 has already fixed every Product semantic needed for the minimum application policy UX.
  The remaining unknown merchant/legal/privacy/tax/support facts can be represented as explicit
  external Production prerequisites without requiring C01 to invent them.

Production paid enablement
= STILL BLOCKED until EPP-01..EPP-07 and the coupled runbook prerequisites are evidenced.

AI Authority
= UNCHANGED

Mutation Authority
= UNCHANGED

Stage 1.5 / Stage 2
= NOT ADDED / NOT SELECTED by this packet
```
