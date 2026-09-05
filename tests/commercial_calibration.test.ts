import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateUnitEconomics, distribution, nearestRank, pearsonCorrelation } from '../lib/commercial-calibration';

test('nearest-rank uses ceil(percentile * N)', () => {
  const values = Array.from({ length: 30 }, (_, index) => index + 1);
  assert.equal(nearestRank(values, 0.5), 15);
  assert.equal(nearestRank(values, 0.95), 29);
});

test('distribution reports population standard deviation and total', () => {
  const result = distribution([1, 2, 3, 4]);
  assert.equal(result.mean, 2.5);
  assert.equal(result.p75, 3);
  assert.equal(result.total, 10);
  assert.ok(Math.abs(result.standardDeviation - Math.sqrt(1.25)) < 1e-12);
});

test('Pearson correlation reports observed linear association', () => {
  assert.ok(Math.abs((pearsonCorrelation([1, 2, 3], [2, 4, 6]) ?? 0) - 1) < 1e-12);
  assert.equal(pearsonCorrelation([1, 1, 1], [2, 3, 4]), null);
});

test('unit economics preserves unknown commercial inputs', () => {
  const result = calculateUnitEconomics({
    monthlyPrice: null, includedQuota: null, successfulReviewCostP50: 0.04,
    successfulReviewCostP95: 0.06, conservativeWorstCaseCost: null,
    failureAllowance: null, paymentFeeFixed: null, paymentFeePercent: null,
    taxCost: null, incrementalHostingCost: null, otherVariableCost: null,
  });
  assert.ok(result.unknownInputs.includes('monthlyPrice'));
  assert.equal(result.netRevenue, null);
  assert.equal(result.utilization, null);
});

test('unit economics calculates candidate scenarios without defaults', () => {
  const result = calculateUnitEconomics({
    monthlyPrice: 10, includedQuota: 4, successfulReviewCostP50: 1,
    successfulReviewCostP95: 2, conservativeWorstCaseCost: 3,
    failureAllowance: 0.5, paymentFeeFixed: 0.3, paymentFeePercent: 0.03,
    taxCost: 1, incrementalHostingCost: 0.4, otherVariableCost: 0.5,
  });
  assert.ok(Math.abs((result.netRevenue ?? 0) - 9.4) < 1e-12);
  assert.ok(Math.abs((result.utilization?.full.contribution.p50 ?? 0) - 3) < 1e-12);
  assert.ok(Math.abs((result.breakEvenReviewCount?.observedP95 ?? 0) - 3.5) < 1e-12);
});
