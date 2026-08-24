import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PREFLIGHT_ACTIVATION_STORAGE_KEY,
  PREFLIGHT_ACTIVATION_VERSION,
  hasMeaningfulPreflightFirstValue,
  parsePreflightActivationPersistence,
  serializePreflightActivationPersistence,
  type PreflightActivationPersistentStatus,
} from '../lib/preflight-activation';
import type { UnifiedPreflightReadModel } from '../types/unified-preflight';

const result = {
  status: 'ready' as const,
  evaluable: true,
  counts: { high: 0, medium: 0, low: 0, info: 0, total: 0 },
  rulesetVersion: '0.1.0' as const,
};

function review(
  state: UnifiedPreflightReadModel['state'],
  meaningfulStage: 'readiness' | 'execution' | 'resources' | null = null,
): UnifiedPreflightReadModel {
  return {
    version: '0.1.0',
    state,
    stages: {
      readiness: meaningfulStage === 'readiness'
        ? { state: 'available', result }
        : { state: 'unavailable', result: null },
      execution: meaningfulStage === 'execution'
        ? { state: 'available', result: { process: 'sequential', summary: { taskCount: 1, agentCount: 1, toolCount: 0 }, version: '0.1.0' } }
        : { state: 'unavailable', result: null },
      resources: meaningfulStage === 'resources'
        ? { state: 'available', result: { process: 'sequential', summary: { agentCount: 1, taskCount: 1, toolCount: 0, executionStepCount: 1, uniqueModelCount: 1, dependencyDepth: 0, maxContextFanIn: 0, asyncTaskCount: 0, fixedAssignmentCount: 1, managerDelegatedTaskCount: 0, agentToolBindingCount: 0, taskToolBindingCount: 0 }, hotspotCount: 0, version: '0.1.0' } }
        : { state: 'unavailable', result: null },
    },
  };
}

test('activation contract exposes stable version and storage key', () => {
  assert.equal(PREFLIGHT_ACTIVATION_VERSION, '0.1.0');
  assert.equal(PREFLIGHT_ACTIVATION_STORAGE_KEY, 'agentgraph_preflight_activation_v0');
});

test('activation persistence round-trips only the approved payload', () => {
  for (const status of ['prompted', 'dismissed', 'completed'] as const) {
    const serialized = serializePreflightActivationPersistence(status);
    assert.equal(serialized, JSON.stringify({ version: 1, status }));
    assert.equal(parsePreflightActivationPersistence(serialized), status);
    assert.deepEqual(Object.keys(JSON.parse(serialized)), ['version', 'status']);
  }
});

test('activation persistence parser treats invalid values as unseen', () => {
  const invalid = [
    null,
    '',
    '{',
    'null',
    '[]',
    JSON.stringify({ version: 2, status: 'prompted' }),
    JSON.stringify({ version: 1, status: 'unknown' }),
    JSON.stringify({ version: 1 }),
  ];
  for (const serialized of invalid) {
    assert.equal(parsePreflightActivationPersistence(serialized), null);
  }
});

test('First Value predicate follows the review-state and stage-result matrix', () => {
  const cases: ReadonlyArray<[
    UnifiedPreflightReadModel['state'],
    'readiness' | 'execution' | 'resources' | null,
    boolean,
  ]> = [
    ['refreshing', 'readiness', false],
    ['empty', 'readiness', false],
    ['available', 'readiness', true],
    ['invalid', 'execution', true],
    ['partial', 'resources', true],
    ['invalid', null, false],
    ['partial', null, false],
  ];

  for (const [state, meaningfulStage, expected] of cases) {
    assert.equal(hasMeaningfulPreflightFirstValue(review(state, meaningfulStage)), expected);
  }
});

test('activation persistence status remains a bounded compile-time contract', () => {
  const statuses: PreflightActivationPersistentStatus[] = ['prompted', 'dismissed', 'completed'];
  assert.deepEqual(statuses, ['prompted', 'dismissed', 'completed']);
});
