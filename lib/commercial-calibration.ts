export interface Distribution {
  n: number;
  min: number;
  mean: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  max: number;
  standardDeviation: number;
  total: number;
}

export function nearestRank(values: readonly number[], percentile: number): number {
  if (values.length === 0) throw new Error('At least one value is required.');
  if (!(percentile > 0 && percentile <= 1)) throw new Error('Percentile must be in (0, 1].');
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(percentile * sorted.length) - 1];
}

export function distribution(values: readonly number[]): Distribution {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new Error('A non-empty finite numeric sample is required.');
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  const mean = total / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return {
    n: values.length,
    min: Math.min(...values),
    mean,
    p50: nearestRank(values, 0.5),
    p75: nearestRank(values, 0.75),
    p90: nearestRank(values, 0.9),
    p95: nearestRank(values, 0.95),
    max: Math.max(...values),
    standardDeviation: Math.sqrt(variance),
    total,
  };
}

export function pearsonCorrelation(left: readonly number[], right: readonly number[]): number | null {
  if (left.length !== right.length || left.length < 2 || [...left, ...right].some((value) => !Number.isFinite(value))) {
    throw new Error('Equal finite samples with at least two observations are required.');
  }
  const leftMean = left.reduce((sum, value) => sum + value, 0) / left.length;
  const rightMean = right.reduce((sum, value) => sum + value, 0) / right.length;
  const numerator = left.reduce((sum, value, index) => sum + (value - leftMean) * (right[index] - rightMean), 0);
  const leftSpread = Math.sqrt(left.reduce((sum, value) => sum + (value - leftMean) ** 2, 0));
  const rightSpread = Math.sqrt(right.reduce((sum, value) => sum + (value - rightMean) ** 2, 0));
  return leftSpread === 0 || rightSpread === 0 ? null : numerator / (leftSpread * rightSpread);
}

export interface UnitEconomicsInputs {
  monthlyPrice: number | null;
  includedQuota: number | null;
  successfulReviewCostP50: number | null;
  successfulReviewCostP95: number | null;
  conservativeWorstCaseCost: number | null;
  failureAllowance: number | null;
  paymentFeeFixed: number | null;
  paymentFeePercent: number | null;
  taxCost: number | null;
  incrementalHostingCost: number | null;
  otherVariableCost: number | null;
}

const requiredKeys = Object.keys({
  monthlyPrice: 0, includedQuota: 0, successfulReviewCostP50: 0,
  successfulReviewCostP95: 0, conservativeWorstCaseCost: 0, failureAllowance: 0,
  paymentFeeFixed: 0, paymentFeePercent: 0, taxCost: 0,
  incrementalHostingCost: 0, otherVariableCost: 0,
}) as Array<keyof UnitEconomicsInputs>;

export function calculateUnitEconomics(inputs: UnitEconomicsInputs) {
  for (const key of requiredKeys) {
    const value = inputs[key];
    if (value !== null && (!Number.isFinite(value) || value < 0)) throw new Error(`${key} must be null or a non-negative finite number.`);
  }
  if (inputs.paymentFeePercent !== null && inputs.paymentFeePercent > 1) throw new Error('paymentFeePercent must be between 0 and 1.');
  if (inputs.includedQuota !== null && !Number.isInteger(inputs.includedQuota)) throw new Error('includedQuota must be an integer.');

  const unknownInputs = requiredKeys.filter((key) => inputs[key] === null);
  if (unknownInputs.length > 0) return { unknownInputs, netRevenue: null, utilization: null, breakEvenReviewCount: null };

  const known = inputs as { [K in keyof UnitEconomicsInputs]: number };
  const netRevenue = known.monthlyPrice - known.paymentFeeFixed - known.monthlyPrice * known.paymentFeePercent;
  const fixedVariableCosts = known.failureAllowance + known.taxCost + known.incrementalHostingCost + known.otherVariableCost;
  const costs = {
    p50: known.successfulReviewCostP50,
    observedP95: known.successfulReviewCostP95,
    conservativeWorstCase: known.conservativeWorstCaseCost,
  };
  const utilization = Object.fromEntries(Object.entries({ low: 0.25, medium: 0.5, full: 1 }).map(([name, fraction]) => {
    const reviews = known.includedQuota * fraction;
    return [name, {
      fraction,
      reviews,
      providerCost: Object.fromEntries(Object.entries(costs).map(([costName, cost]) => [costName, reviews * cost])),
      contribution: Object.fromEntries(Object.entries(costs).map(([costName, cost]) => [costName, netRevenue - fixedVariableCosts - reviews * cost])),
    }];
  }));
  const availableForSuccessfulReviews = netRevenue - fixedVariableCosts;
  const breakEvenReviewCount = Object.fromEntries(Object.entries(costs).map(([name, cost]) => [name, cost === 0 ? null : availableForSuccessfulReviews / cost]));
  return { unknownInputs, netRevenue, utilization, breakEvenReviewCount };
}
