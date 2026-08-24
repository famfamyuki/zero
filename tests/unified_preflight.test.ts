import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { ExecutionPreviewState } from '../hooks/useExecutionPreview';
import type { ResourceAnalysisState } from '../lib/resource-analysis-evaluation';
import { createUnifiedPreflightReadModel } from '../lib/unified-preflight';
import type { ReadinessResult, ReadinessStatus } from '../types/readiness';
import { UNIFIED_PREFLIGHT_REVIEW_VERSION, type UnifiedPreflightProjectionInput } from '../types/unified-preflight';

const counts = { high: 1, medium: 2, low: 3, info: 4, total: 10 } as const;

function readiness(status: ReadinessStatus = 'ready', evaluable = status !== 'not_evaluable'): ReadinessResult {
  return {
    rulesetVersion: '0.1.0',
    evaluable,
    status,
    counts,
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
    summary: { taskCount: 2, agentCount: 1, toolCount: 1 },
    steps: [{
      taskId: 'private-task-id',
      label: 'Private task label',
      planOrder: 1,
      assignment: { kind: 'fixed', agent: { agentId: 'private-agent-id', label: 'Private agent', role: 'Private role' } },
      context: [],
      directTools: [],
      description: 'Private prompt content',
      expectedOutput: 'Private expected output',
      asyncExecution: false,
      outputFormat: 'text',
      humanInput: false,
      markdown: false,
    }],
    agents: [],
    tools: [],
  },
  blockingCodes: [],
  error: null,
};

const resourceSummary = {
  agentCount: 1,
  taskCount: 2,
  toolCount: 1,
  executionStepCount: 2,
  uniqueModelCount: 1,
  dependencyDepth: 2,
  maxContextFanIn: 1,
  asyncTaskCount: 0,
  fixedAssignmentCount: 2,
  managerDelegatedTaskCount: 0,
  agentToolBindingCount: 1,
  taskToolBindingCount: 1,
} as const;

const resourcesAvailable: ResourceAnalysisState = {
  status: 'available',
  result: {
    version: '0.1.0',
    process: 'sequential',
    summary: resourceSummary,
    models: [{
      model: 'private/model-id',
      agents: [{ agentId: 'private-agent-id', label: 'Private agent', role: 'Private role' }],
      agentCount: 1,
      usedByManager: false,
      referenceCount: 1,
    }],
    tasks: [],
    agentGuards: [],
    toolBindings: [],
    hotspots: [
      { kind: 'dependency_depth', value: 2, target: { type: 'task', id: 'private-task-id' } },
      { kind: 'tool_binding_concentration', value: 2, target: { type: 'tool', id: 'private-tool-id' } },
    ],
    unknowns: [],
  },
  blockingCodes: [],
  error: null,
};

function input(overrides: Partial<UnifiedPreflightProjectionInput> = {}): UnifiedPreflightProjectionInput {
  return {
    readiness: { result: readiness(), error: null, isRefreshing: false },
    execution: { state: executionAvailable, isRefreshing: false },
    resources: { state: resourcesAvailable, isRefreshing: false },
    ...overrides,
  };
}

const executionState = (status: 'empty' | 'invalid'): ExecutionPreviewState => ({
  ...(status === 'invalid'
    ? { status: 'invalid' as const, result: null, blockingCodes: ['NO_TASKS'], error: null }
    : { status: 'empty' as const, result: null, blockingCodes: [] as const, error: null }),
});

const resourceState = (status: 'empty' | 'invalid' | 'unavailable'): ResourceAnalysisState => {
  if (status === 'unavailable') {
    return { status, result: null, blockingCodes: [], error: new Error('private resource failure') };
  }
  if (status === 'invalid') {
    return { status, result: null, blockingCodes: ['NO_TASKS'], error: null };
  }
  return { status, result: null, blockingCodes: [], error: null };
};

describe('UPR-A1 Unified Preflight projection contract', () => {
  test('uses read model version 0.1.0', () => {
    assert.equal(UNIFIED_PREFLIGHT_REVIEW_VERSION, '0.1.0');
    assert.equal(createUnifiedPreflightReadModel(input()).version, '0.1.0');
  });

  for (const status of ['ready', 'needs_attention', 'needs_improvement'] as const) {
    test(`keeps all evaluable stages available when Readiness is ${status}`, () => {
      const result = createUnifiedPreflightReadModel(input({
        readiness: { result: readiness(status), error: null, isRefreshing: false },
      }));
      assert.equal(result.state, 'available');
      assert.equal(result.stages.readiness.state, 'available');
    });
  }

  test('refreshing has highest precedence for each source stage', () => {
    const sources: Array<Partial<UnifiedPreflightProjectionInput>> = [
      { readiness: { result: readiness(), error: null, isRefreshing: true } },
      { execution: { state: executionState('invalid'), isRefreshing: true } },
      { resources: { state: resourceState('invalid'), isRefreshing: true } },
      { resources: { state: null, isRefreshing: false } },
    ];
    for (const source of sources) assert.equal(createUnifiedPreflightReadModel(input(source)).state, 'refreshing');
  });

  test('maps matching Execution and Resource empty states to empty before Readiness not_evaluable', () => {
    const result = createUnifiedPreflightReadModel(input({
      readiness: { result: readiness('not_evaluable', false), error: null, isRefreshing: false },
      execution: { state: executionState('empty'), isRefreshing: false },
      resources: { state: resourceState('empty'), isRefreshing: false },
    }));
    assert.equal(result.state, 'empty');
    assert.equal(result.stages.readiness.state, 'not_evaluable');
  });

  test('maps each non-empty invalid source to invalid', () => {
    const cases: UnifiedPreflightProjectionInput[] = [
      input({ readiness: { result: readiness('not_evaluable', false), error: null, isRefreshing: false } }),
      input({ execution: { state: executionState('invalid'), isRefreshing: false } }),
      input({ resources: { state: resourceState('invalid'), isRefreshing: false } }),
    ];
    for (const current of cases) assert.equal(createUnifiedPreflightReadModel(current).state, 'invalid');
  });

  test('normalizes unavailable sources to partial without leaking errors', () => {
    const executionError = new Error('private execution failure');
    const cases: UnifiedPreflightProjectionInput[] = [
      input({ readiness: { result: null, error: new Error('private readiness failure'), isRefreshing: false } }),
      input({ execution: { state: { status: 'error', result: null, blockingCodes: [], error: executionError }, isRefreshing: false } }),
      input({ resources: { state: resourceState('unavailable'), isRefreshing: false } }),
    ];
    for (const current of cases) {
      const result = createUnifiedPreflightReadModel(current);
      assert.equal(result.state, 'partial');
      assert.doesNotMatch(JSON.stringify(result), /private|failure/);
    }
  });

  test('treats a missing non-refreshing Readiness result as unavailable', () => {
    const result = createUnifiedPreflightReadModel(input({
      readiness: { result: null, error: null, isRefreshing: false },
    }));
    assert.equal(result.state, 'partial');
    assert.deepEqual(result.stages.readiness, { state: 'unavailable', result: null });
  });

  test('maps inconsistent empty and available projection pairs to partial', () => {
    const executionEmpty = createUnifiedPreflightReadModel(input({
      execution: { state: executionState('empty'), isRefreshing: false },
    }));
    const resourcesEmpty = createUnifiedPreflightReadModel(input({
      resources: { state: resourceState('empty'), isRefreshing: false },
    }));
    assert.equal(executionEmpty.state, 'partial');
    assert.equal(resourcesEmpty.state, 'partial');
  });

  test('projects only the approved Readiness summary fields', () => {
    const result = createUnifiedPreflightReadModel(input()).stages.readiness;
    assert.equal(result.state, 'available');
    if (result.state !== 'available') return;
    assert.deepEqual(result.result, { status: 'ready', evaluable: true, counts, rulesetVersion: '0.1.0' });
  });

  test('projects the approved Execution summary exactly', () => {
    const result = createUnifiedPreflightReadModel(input()).stages.execution;
    assert.equal(result.state, 'available');
    if (result.state !== 'available') return;
    assert.deepEqual(result.result, {
      process: 'sequential',
      summary: executionAvailable.status === 'available' ? executionAvailable.result.summary : null,
      version: '0.1.0',
    });
  });

  test('projects the approved Resource summary and hotspot count exactly', () => {
    const result = createUnifiedPreflightReadModel(input()).stages.resources;
    assert.equal(result.state, 'available');
    if (result.state !== 'available') return;
    assert.deepEqual(result.result, {
      process: 'sequential',
      summary: resourceSummary,
      hotspotCount: 2,
      version: '0.1.0',
    });
  });

  test('does not copy IDs, labels, models, prompts, findings, targets, or errors', () => {
    const serialized = JSON.stringify(createUnifiedPreflightReadModel(input()));
    for (const forbidden of [
      'private-task-id', 'private-agent-id', 'private-tool-id', 'Private task label',
      'Private role', 'Private prompt content', 'Private expected output', 'private/model-id',
      'findings', 'blockedByValidationCodes', 'steps', 'models', 'hotspots',
    ]) assert.equal(serialized.includes(forbidden), false, forbidden);
  });

  test('is deterministic and has no locale input', () => {
    const source = input();
    assert.deepEqual(createUnifiedPreflightReadModel(source), createUnifiedPreflightReadModel(source));
    assert.equal('lang' in source, false);
    assert.equal('locale' in source, false);
  });

  test('is a projection only and does not import or call semantic evaluators', () => {
    const source = readFileSync('lib/unified-preflight.ts', 'utf8');
    for (const forbidden of [
      'validateGraph',
      'createSemanticPlan',
      'evaluateReadiness',
      'createExecutionPreviewReadModel',
      'createResourceAnalysisReadModel',
      'evaluateResourceAnalysis',
      'localeCompare',
      'Date.now',
      'Math.random',
    ]) assert.equal(source.includes(forbidden), false, forbidden);
  });
});
