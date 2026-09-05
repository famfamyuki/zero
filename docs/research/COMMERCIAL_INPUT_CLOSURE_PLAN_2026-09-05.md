# Commercial Input Closure Plan — 2026-09-05

Status: Research / Commercial Input Closure / Non-authoritative

Authority:
This document does not approve Public Price, Public Currency, Included quota, Production enablement, M0, Gate A, Stage 1.5, Stage 2, AI Authority, or Mutation Authority. It records the remaining evidence required for the next 01 Product decision.

## Current 01 state

- Commercial Enablement = ENABLE_PREP
- Public paid switch = NOT APPROVED
- Public Price = NOT YET
- Public Currency = USD CANDIDATE ONLY
- Included monthly quota = NOT YET
- Numeric Production request-cost envelope = NOT YET
- Numeric aggregate provider budget = NOT YET
- ARCHITECTURE_REVIEW_PAID_ENABLED = false
- Draft PR #35 remains branch-only and must not be merged until commercial prerequisites and the launch decision are ready.

## Evidence already accepted

`docs/research/COMMERCIAL_CALIBRATION_EVIDENCE_2026-09-05.md` is accepted as PARTIAL cost evidence.

Successful-review provider-cost baseline:

- N = 30
- P50 = USD 0.0461076
- Observed benchmark P95 = USD 0.0598480
- Max = USD 0.0730960
- Total historical estimated provider cost = USD 1.412506

The observed P95 is not a Production P95. Failure-cost distributions and real Production workflow/cache distributions remain Unknown.

## Current external commercial-cost evidence

Evidence checked on 2026-09-05:

- Stripe Japan standard card processing: 3.6% per successful card payment.
- Stripe Billing: 0.7% of Billing transaction volume.
- Stripe Tax Basic for Billing/Checkout tax calculation in registered regions: 0.5% per applicable transaction.
- Supabase Pro: from USD 25/month; this is primarily shared/fixed infrastructure, not automatically a per-user variable cost.
- Current Vercel team remains Hobby. Public commercial launch still requires a commercial-use-eligible plan. Hosting cost should be modeled as shared/fixed infrastructure unless measured usage justifies a marginal allocation.

Source pages:

- https://stripe.com/jp/pricing
- https://stripe.com/jp/billing/pricing
- https://stripe.com/jp/tax
- https://supabase.com/pricing
- https://vercel.com/pricing

These vendor values must be re-checked at launch and after material pricing/vendor changes.

## Currency working hypothesis

Internal commercial calibration remains USD because provider-cost evidence and the current calibration tool are USD-denominated.

Public checkout currency = USD CANDIDATE ONLY.

Do not approve public currency until initial launch geography, tax treatment, and WTP evidence are reviewed together.

## WTP research scope

Target respondents:

- developers who currently build or maintain CrewAI / AI-agent workflows professionally; or
- serious individual builders with real workflow architecture decisions;
- preferably respondents with purchase authority or meaningful software-budget influence.

The research must evaluate the current product only:

> Evidence-grounded, reproducible architecture evaluation for CrewAI / AI-agent workflows.

Do not include or imply unbuilt Project/Workspace, History, Review Delta, Team, Enterprise, automatic optimization, Semantic Patch, or Apply capabilities.

## Draft PostHog survey

A hosted PostHog survey draft was created but NOT launched.

Survey ID:
`01a07167-eae0-0000-47ba-27e3ee0ddc97`

Name:
`Architecture Review — Provisional WTP Calibration`

Status:
Draft / inactive / no start date.

Research price ladder:

- USD 49/month
- if rejected: USD 29/month
- if rejected: USD 19/month

These are research probes, not Product decisions or advertised prices.

The survey also asks expected monthly Architecture Review usage:

- 1
- 2–3
- 4–6
- 7–10
- 11+
- would not use monthly

## Why these research probes are acceptable

They provide a broad self-serve professional-software test range without declaring competitor pricing to be AgentGraph willingness-to-pay evidence.

Public comparison references may inform the research range only. They do not establish AgentGraph price:

- LangSmith Plus currently lists USD 39/seat/month plus usage.
- Flowise Starter currently lists USD 35/month and Pro USD 65/month.
- n8n Starter currently lists EUR 20/month billed annually and Pro EUR 50/month billed annually.

The products are not equivalent to AgentGraph Architecture Review; these references are only sanity checks on the survey range.

## Minimum WTP evidence for provisional launch configuration

The next 01 Price/Quota review should not occur until there are at least:

- 12 qualified responses total;
- 8 respondents with purchase authority or meaningful software-budget influence, where that can be established without collecting unnecessary personal data;
- current-scope monthly-use answers;
- explicit accept/reject responses across the research price ladder.

Provisional decision signal:

- at least 4 purchase-authorized/budget-influencing respondents explicitly accept one candidate price for the current scope; and
- monthly-use answers do not materially contradict the proposed quota; and
- the dominant signal is not “useful once, but not worth a monthly subscription”.

This is not M0 and is not durable market validation. Actual paid behavior is still required later.

## Privacy constraints

Prefer bounded research metadata only:

- role/use-case category
- current workflow-building status
- expected monthly review frequency
- price accept/reject
- purchase-authority/budget-influence category if explicitly collected
- recurring-vs-one-shot reason category where added later

Do not collect raw workflow content, Evidence bodies, provider prompts, Architecture Review result prose, credentials, or private source code for WTP research.

## Remaining cost/economic inputs

Before candidate unit-economics comparison, close or explicitly parameterize:

1. effective payment fee for the selected payment/currency mix;
2. whether Stripe Tax applies for the initial registered launch geography and who bears tax cost;
3. incremental hosting cost versus shared fixed hosting cost;
4. incremental Supabase/database/storage/egress cost;
5. refund/chargeback allowance;
6. support allowance attributable to paid Architecture Review;
7. failure-attempt provider-cost allowance;
8. conservative numeric request-cost ceiling;
9. proposed monthly quota;
10. proposed public monthly price.

Unknown values must remain null in the repository unit-economics tool. Do not silently replace them with zero.

## Failure-cost evidence

No new live provider failure calls are authorized.

Next evidence step:

- inspect existing provider/evaluation usage records and runtime failure records for naturally occurring attributable provider failures/timeouts/invalid outputs;
- if no attributable billing evidence exists, keep failure cost Unknown;
- only then propose a bounded controlled measurement plan to 01, including exact calls and maximum spend, if the value is decision-critical.

## Request-cost envelope next evidence

The current model/cost-profile structure and conservative full input-rate guard are acceptable as a safety design.

Before approving numeric values for:

- ARCHITECTURE_REVIEW_MAX_PROVIDER_INPUT_BYTES
- ARCHITECTURE_REVIEW_MAX_OUTPUT_TOKENS
- ARCHITECTURE_REVIEW_MAX_WORST_CASE_COST_MICRO_USD

01 still needs a supported full-review size candidate and evidence that the selected max-output setting does not materially degrade Stage 1 result quality.

No additional provider call is authorized by this document.

## Next 01 decision packet

When WTP and remaining commercial inputs are available, 01 should compare 2–3 candidate configurations with the existing parameterized unit-economics tool.

Each comparison must state every input and Unknown explicitly and must include at minimum:

- low, medium, and full quota utilization;
- successful-review P50;
- observed benchmark P95 (clearly labeled non-Production);
- conservative request-cost scenario;
- payment costs;
- applicable tax cost;
- failure allowance;
- material variable infrastructure/support costs.

Then 01 may select a provisional launch configuration or keep the launch blocked.

## Current state remains

- ENABLE_PREP
- Public paid switch = NOT APPROVED
- main merge = NOT AUTHORIZED
- Draft PR #35 merge = NOT AUTHORIZED
- ARCHITECTURE_REVIEW_PAID_ENABLED = false
- M0 = NOT REACHED
- Gate A = NOT REACHED
- Stage 1.5 = NONE SELECTED
- Stage 2 = NOT SELECTED
- AI Authority = UNCHANGED
- Mutation Authority = UNCHANGED
