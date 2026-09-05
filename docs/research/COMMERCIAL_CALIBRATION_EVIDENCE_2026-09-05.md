# Commercial Calibration Evidence — 2026-09-05

Status:  
Research / Commercial Calibration Evidence / Non-authoritative

Authority:  
Does not select Price, Currency, Quota, launch, Stage, AI Authority, or Mutation Authority.

## Current state checked

- Latest GitHub `main`: `916151238ffa1ecbbc44347f362cd3313776d804`.
- Commercial branch and Draft PR #35 head at retrieval: `be63d603726ef7b328d4c2ddc7b987a96ff2d7c2`; PR remains open and Draft.
- Branch is eight commits ahead of and zero commits behind `main` at retrieval.
- Production deployment: `READY`, target `production`, commit `916151238ffa1ecbbc44347f362cd3313776d804`, canonical alias `https://zero-six-khaki.vercel.app`.
- Commercial Preview: `READY`, target `preview`, commit `be63d603726ef7b328d4c2ddc7b987a96ff2d7c2`.
- Production and Preview offer responses both report `enabled=false`, `price=null`, and `includedReviews=null`.
- No deployment, Production configuration change, paid enablement, merge, or provider invocation was performed for this research.

## Evidence source and reproducibility

The matching complete formal evaluation report was recovered from the local archived C01 execution record. Its aggregate exactly matches the previously recorded formal evidence: 30 reviews, 100,509 input tokens, 82,325 cached input tokens, 65,342 output tokens, 24,226 reasoning tokens, 210/210 semantic checks, zero hard violations, and estimated provider cost USD 1.412506.

The privacy-safe recovered usage rows are stored in `docs/research/architecture-review-formal-eval-2026-09-05.json`. They contain only synthetic fixture identifiers, run numbers, model/usage/cost metadata, and evaluation status. They contain no provider request/response content, workflow private data, API key, credential, prompt, Evidence body, or result prose.

Reproduce the analysis without provider access:

```bash
npm run commercial:calibrate -- --report docs/research/architecture-review-formal-eval-2026-09-05.json
```

Percentiles use nearest-rank: sort ascending and select `rank = ceil(percentile * N)`. Standard deviation is the population standard deviation of the observed 30-call benchmark sample. `P95` below means **Observed benchmark P95**, not a true Production P95.

## Successful review cost distribution

| Metric | USD |
|---|---:|
| N | 30 |
| Min | 0.0348172 |
| Mean | 0.0470835 |
| P50 | 0.0461076 |
| P75 | 0.0516984 |
| P90 | 0.0563136 |
| Observed benchmark P95 | 0.0598480 |
| Max | 0.0730960 |
| Population standard deviation | 0.0082784 |
| Total | 1.4125060 |

## Token distributions

| Metric | Min | Mean | P50 | P90 | Observed benchmark P95 | Max | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Input | 2,487 | 3,350.3 | 2,792 | 4,769 | 4,942 | 4,942 | 100,509 |
| Cached input | 0 | 2,744.2 | 2,522 | 4,766 | 4,939 | 4,939 | 82,325 |
| Non-cached input | 3 | 606.1 | 3 | 2,516 | 3,409 | 4,407 | 18,184 |
| Output | 1,389 | 2,178.1 | 2,178 | 2,644 | 2,727 | 2,973 | 65,342 |
| Reasoning | 397 | 807.5 | 806 | 1,034 | 1,252 | 1,315 | 24,226 |

The cached-input distribution is specific to this benchmark execution and its call ordering/cache behavior. It is not assumed to represent Production cache hit rates.

## Structural and Evidence size distribution

All size fields below are recomputed deterministically from the approved A–J synthetic fixtures and the current evidence/provider-envelope implementation. Provider input bytes exclude the reviewer instruction wrapper; provider envelope bytes match the route's preflight measurement shape.

| Fixture | Nodes / edges | Agents / tasks / tools | Evidence items / targets | Evidence bytes | Provider input bytes | Provider envelope bytes | Input tokens | Mean output tokens | Mean cost USD |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | 2 / 1 | 1 / 1 / 0 | 18 / 17 | 8,421 | 6,473 | 9,162 | 2,525 | 1,967.3 | 0.0403675 |
| B | 8 / 7 | 4 / 4 / 0 | 43 / 53 | 21,944 | 16,212 | 20,509 | 4,942 | 2,217.3 | 0.0463343 |
| C | 5 / 2 | 1 / 1 / 3 | 23 / 30 | 12,005 | 8,959 | 12,084 | 3,155 | 2,046.0 | 0.0421928 |
| D | 7 / 11 | 1 / 6 / 0 | 44 / 52 | 20,300 | 15,384 | 19,559 | 4,769 | 2,539.3 | 0.0527051 |
| E | 6 / 9 | 1 / 5 / 0 | 40 / 45 | 18,577 | 14,072 | 17,993 | 4,407 | 2,455.0 | 0.0561584 |
| F | 4 / 1 | 2 / 2 / 0 | 28 / 27 | 12,872 | 10,084 | 13,353 | 3,409 | 2,634.3 | 0.0581483 |
| G | 2 / 1 | 1 / 1 / 0 | 18 / 17 | 7,993 | 6,275 | 8,964 | 2,501 | 1,603.0 | 0.0360688 |
| H | 2 / 1 | 1 / 1 / 0 | 18 / 17 | 8,256 | 6,468 | 9,157 | 2,516 | 2,089.7 | 0.0458261 |
| I | 2 / 1 | 1 / 1 / 0 | 18 / 17 | 7,875 | 6,202 | 8,891 | 2,487 | 2,036.3 | 0.0447131 |
| J | 2 / 1 | 1 / 1 / 0 | 18 / 17 | 9,689 | 7,816 | 10,505 | 2,792 | 2,192.3 | 0.0483211 |

## Size-to-cost observations

- **Observed:** provider envelope bytes and input tokens are nearly linear across these ten fixtures (Pearson `r = 0.9999`, fixture-mean N=10), as expected from a fixed serialization/prompt path.
- **Weak indication:** larger provider envelopes were associated with larger mean output token counts (`r = 0.6544`) and mean cost (`r = 0.5727`) in this small benchmark.
- **Observed:** output variability materially affects cost. Fixture F has neither the largest envelope nor the largest input count, yet contains the benchmark maximum-cost call because its output reached 2,973 tokens.
- **Insufficient sample:** each fixture has only three runs. These correlations are descriptive, not causal or predictive Production claims.
- **Unknown:** Production workflow-size distribution, Production cache behavior, tail behavior beyond these synthetic fixtures, and cost drift after a material model/provider/prompt/rubric/representation change.

## Failure cost evidence

- Pre-provider rejection: deterministic provider cost is zero for request rejection paths that return before `markPaidReviewProviderStarted` / `reviewer.review`, including oversized HTTP input, disabled/missing configuration, authentication/idempotency/request/evidence rejection, entitlement/quota rejection, accounting reservation failure, and the request cost limit. This statement is code-path evidence, not a measured billing record.
- Provider failure: observed cost distribution `UNKNOWN`.
- Timeout: observed cost distribution `UNKNOWN`.
- Invalid structured output: observed cost distribution `UNKNOWN`.
- Post-provider validation failure: observed cost distribution `UNKNOWN`.

The formal 30-run report contains no failed call. No failure was intentionally induced and no paid provider call was made to manufacture failure evidence.

## Worst-case cost model

The route computes a conservative preflight value in micro-USD:

```text
WorstCaseCostMicroUsd(
  providerEnvelopeBytes,
  maxOutputTokens,
  inputMicroUsdPerMillionTokens,
  outputMicroUsdPerMillionTokens
) =
  ceil(providerEnvelopeBytes * inputRate / 1,000,000)
  + ceil(maxOutputTokens * outputRate / 1,000,000)
```

The implementation deliberately uses one UTF-8 byte per possible input token. This is a conservative byte-to-token upper bound. It rejects when provider envelope bytes exceed `maxProviderInputBytes` or when the formula exceeds `maxWorstCaseCostMicroUsd`. Configuration validation also requires the provider model and cost-profile model to match.

Known inputs are the parameter names, integer validation, formula, conservative byte assumption, and fail-closed/model-match behavior. Approved Production values for max provider input, max output tokens, input/output rates, max request cost, and aggregate provider budget remain `Unknown` and are not introduced here.

## Unit economics tool

`commercial:calibrate` accepts an optional `--unit-economics <json>` file with these explicit values (each may be `null` to preserve Unknown):

```json
{
  "monthlyPrice": null,
  "includedQuota": null,
  "successfulReviewCostP50": null,
  "successfulReviewCostP95": null,
  "conservativeWorstCaseCost": null,
  "failureAllowance": null,
  "paymentFeeFixed": null,
  "paymentFeePercent": null,
  "taxCost": null,
  "incrementalHostingCost": null,
  "otherVariableCost": null
}
```

When every input is known, output includes net revenue after payment fees; provider cost and contribution at 25%, 50%, and 100% quota utilization under P50, observed P95, and conservative worst-case cost; and break-even review counts. The utilization fractions are analysis scenarios, not Product quota defaults. If any commercial variable is `null`, the tool lists unknown inputs and does not manufacture contribution or break-even results. No price, currency, quota, tax, fee, or hosting default is supplied.

## Known / inferred / unknown

Known:

- the recovered 30 successful-call usage/cost sample and its deterministic distributions;
- fixture structures and serialized sizes under the current approved fixture/evidence implementation;
- the current pre-provider request-cost formula and fail-closed guard ordering;
- Production and Preview paid offers remained disabled at live check time.

Inferred:

- the observed size correlations are weak benchmark indications only;
- output-token variance is material enough that mean cost alone is inadequate for quota review.

Unknown:

- failed-provider, timeout, invalid-output, and post-provider-validation cost distributions;
- representative Production workflow mix, cache behavior, and true Production tail cost;
- approved numeric Production cost envelope and aggregate provider budget;
- payment, tax, hosting, database, support, refund, and other material unit costs;
- Public Price, Currency, and Included quota;
- willingness to pay and recurring paid value.

## Evidence gaps and sufficiency

Cost evidence is **PARTIAL for 01 Price/Quota review**. The successful-review distribution, observed benchmark P95/max, token distributions, structural sizes, and parameterized calculation path are now reproducible. Final Price/quota approval still lacks failed-attempt cost observations, Production workload/cache distribution, approved worst-case and aggregate budget values, non-provider variable costs, and separate willingness-to-pay evidence.

Additional live evaluation proposal: **NONE in this task**. Existing successful-call evidence was recovered. Deliberately causing provider failures would create spend without an approved controlled measurement design. A later 01-owned evidence plan may specify bounded failure/tail measurement if it becomes decision-critical.

## Authority boundaries

Willingness-to-pay Evidence = **NOT COLLECTED IN THIS TASK**.

Product Decisions Invented = **NONE**.

This evidence does not declare M0 reached, Gate A reached, Stage 1.5 selected, Stage 2 selected, Production Verified, or Sprint Complete. It does not change AI Authority or Mutation Authority.
