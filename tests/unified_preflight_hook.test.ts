import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { ExecutionPreviewState } from '../hooks/useExecutionPreview';
import type { ResourceAnalysisState } from '../lib/resource-analysis-evaluation';
import { evaluateUnifiedPreflightNow } from '../lib/unified-preflight-orchestration';
import { createUnifiedPreflightReadModel } from '../lib/unified-preflight';
import type { ReadinessResult, ReadinessStatus } from '../types/readiness';
import type { UnifiedPreflightProjectionInput } from '../types/unified-preflight';

function readiness(status: ReadinessStatus = 'ready'): ReadinessResult {
  return {
    rulesetVersion: '0.1.0',
    evaluable: status !== 'not_evaluable',
    status,
    counts: { high: 0, medium: 1, low: 0, info: 0, total: 1 },
    categories: [],
    findings: [],
    blockedByValidationCodes: [],
  };
}

const executionAvailable: ExecutionPreviewState = {
  status: 'available',
  result: {
    version: '0.1.0',
    process: 'sequential',
    summary: { taskCount: 1, agentCount: 1, toolCount: 0 },
    steps: [],
    agents: [],
    tools: [],
  },
  blockingCodes: [],
  error: null,
};

const resourcesAvailable: ResourceAnalysisState = {
  status: 'available',
  result: {
    version: '0.1.0',
    process: 'sequential',
    summary: {
      agentCount: 1,
      taskCount: 1,
      toolCount: 0,
      executionStepCount: 1,
      uniqueModelCount: 1,
      dependencyDepth: 1,
      maxContextFanIn: 0,
      asyncTaskCount: 0,
      fixedAssignmentCount: 1,
      managerDelegatedTaskCount: 0,
      agentToolBindingCount: 0,
      taskToolBindingCount: 0,
    },
    models: [],
    tasks: [],
    agentGuards: [],
    toolBindings: [],
    hotspots: [],
    unknowns: [],
  },
  blockingCodes: [],
  error: null,
};

function projectionInput(
  overrides: Partial<UnifiedPreflightProjectionInput> = {},
): UnifiedPreflightProjectionInput {
  return {
    readiness: { result: readiness(), error: null, isRefreshing: false },
    execution: { state: executionAvailable, isRefreshing: false },
    resources: { state: resourcesAvailable, isRefreshing: false },
    ...overrides,
  };
}

describe('UPR-A2 Unified Preflight orchestration and freshness', () => {
  test('composes each existing source hook once with the exact same graph', () => {
    const source = readFileSync('hooks/useUnifiedPreflight.ts', 'utf8');
    assert.equal((source.match(/useReadinessEvaluation\(graph\)/g) ?? []).length, 1);
    assert.equal((source.match(/useExecutionPreview\(graph\)/g) ?? []).length, 1);
    assert.equal((source.match(/useResourceAnalysis\(graph\)/g) ?? []).length, 1);
    assert.doesNotMatch(source, /\.\.\.graph|nodes:\s*graph\.nodes|edges:\s*graph\.edges|crewConfig:\s*graph\.crewConfig/);
  });

  test('derives review through UPR-A1 without copied review state', () => {
    const source = readFileSync('hooks/useUnifiedPreflight.ts', 'utf8');
    assert.match(source, /useMemo\(\(\) => createUnifiedPreflightReadModel\(/);
    assert.doesNotMatch(source, /useState|setReview/);
    assert.match(source, /review,[\s\S]*readiness,[\s\S]*execution,[\s\S]*resources,/);
    assert.match(source, /isRefreshing: review\.state === 'refreshing'/);
  });

  test('projects normal source outputs as available', () => {
    assert.equal(createUnifiedPreflightReadModel(projectionInput()).state, 'available');
  });

  test('makes any refreshing source dominate retained or temporary source results', () => {
    const executionEmpty: ExecutionPreviewState = {
      status: 'empty', result: null, blockingCodes: [], error: null,
    };
    const cases = [
      projectionInput({ readiness: { result: readiness(), error: null, isRefreshing: true } }),
      projectionInput({ execution: { state: executionEmpty, isRefreshing: true } }),
      projectionInput({ resources: { state: resourcesAvailable, isRefreshing: true } }),
      projectionInput({ resources: { state: null, isRefreshing: false } }),
    ];
    for (const source of cases) assert.equal(createUnifiedPreflightReadModel(source).state, 'refreshing');
  });

  test('normalizes each source failure to partial without leaking error text', () => {
    const executionError: ExecutionPreviewState = {
      status: 'error', result: null, blockingCodes: [], error: new Error('private execution failure'),
    };
    const resourceError: ResourceAnalysisState = {
      status: 'unavailable', result: null, blockingCodes: [], error: new Error('private resource failure'),
    };
    const cases = [
      projectionInput({ readiness: { result: null, error: new Error('private readiness failure'), isRefreshing: false } }),
      projectionInput({ execution: { state: executionError, isRefreshing: false } }),
      projectionInput({ resources: { state: resourceError, isRefreshing: false } }),
    ];
    for (const source of cases) {
      const review = createUnifiedPreflightReadModel(source);
      assert.equal(review.state, 'partial');
      assert.doesNotMatch(JSON.stringify(review), /private|failure/);
    }
  });

  test('keeps needs_attention and needs_improvement available', () => {
    for (const status of ['needs_attention', 'needs_improvement'] as const) {
      const review = createUnifiedPreflightReadModel(projectionInput({
        readiness: { result: readiness(status), error: null, isRefreshing: false },
      }));
      assert.equal(review.state, 'available');
    }
  });

  test('evaluateAll calls Readiness, Execution, and Resources exactly once in fixed order', () => {
    const calls: string[] = [];
    const review = evaluateUnifiedPreflightNow({
      readiness: () => { calls.push('readiness'); return readiness(); },
      execution: () => { calls.push('execution'); return executionAvailable; },
      resources: () => { calls.push('resources'); return resourcesAvailable; },
    });
    assert.deepEqual(calls, ['readiness', 'execution', 'resources']);
    assert.equal(review.state, 'available');
    assert.equal(review.version, '0.1.0');
  });

  test('evaluateAll returns synchronously without waiting for React state', () => {
    const result = evaluateUnifiedPreflightNow({
      readiness: () => readiness(),
      execution: () => executionAvailable,
      resources: () => resourcesAvailable,
    });
    assert.equal(result instanceof Promise, false);
    assert.equal(result.state, 'available');
  });

  test('evaluateAll maps a null Readiness result to unavailable and partial', () => {
    const review = evaluateUnifiedPreflightNow({
      readiness: () => null,
      execution: () => executionAvailable,
      resources: () => resourcesAvailable,
    });
    assert.equal(review.state, 'partial');
    assert.deepEqual(review.stages.readiness, { state: 'unavailable', result: null });
  });

  test('hook evaluateAll delegates only to the three existing evaluateNow callbacks', () => {
    const source = readFileSync('hooks/useUnifiedPreflight.ts', 'utf8');
    assert.match(source, /evaluateUnifiedPreflightNow\(\{[\s\S]*readiness: readiness\.evaluateNow,[\s\S]*execution: execution\.evaluateNow,[\s\S]*resources: resources\.evaluateNow,/);
    assert.doesNotMatch(source, /async|await/);
  });

  test('owns no timer, raw graph inspection, semantic evaluator, validation, or error construction', () => {
    const source = [
      readFileSync('hooks/useUnifiedPreflight.ts', 'utf8'),
      readFileSync('lib/unified-preflight-orchestration.ts', 'utf8'),
    ].join('\n');
    for (const forbidden of [
      'setTimeout', 'setInterval', 'validateGraph', 'createSemanticPlan', 'evaluateReadiness',
      'createExecutionPreviewReadModel', 'createResourceAnalysisReadModel', 'evaluateResourceAnalysis',
      'graph.nodes', 'graph.edges', 'graph.crewConfig', 'new Error', 'Date.now', 'Math.random',
    ]) assert.equal(source.includes(forbidden), false, forbidden);
  });

  test('does not add Unified UI, Canvas, navigation, Locate, or analytics coupling', () => {
    const source = readFileSync('hooks/useUnifiedPreflight.ts', 'utf8');
    assert.doesNotMatch(source, /Canvas|Panel|Locate|navigation|analytics|trackEvent/);
  });
});
