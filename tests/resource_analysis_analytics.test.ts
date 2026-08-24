import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createResourceAnalysisHotspotAnalyticsProperties,
  createResourceAnalysisOpenedAnalyticsProperties,
} from '../lib/resource-analysis-analytics';
import { RESOURCE_ANALYSIS_READ_MODEL_VERSION, type ResourceAnalysisReadModel } from '../types/resource-analysis';

const result = (process: 'sequential' | 'hierarchical'): ResourceAnalysisReadModel => ({
  version: RESOURCE_ANALYSIS_READ_MODEL_VERSION,
  process,
  summary: { agentCount: 0, taskCount: 0, toolCount: 0, executionStepCount: 0, uniqueModelCount: 0, dependencyDepth: 0, maxContextFanIn: 0, asyncTaskCount: 0, fixedAssignmentCount: 0, managerDelegatedTaskCount: 0, agentToolBindingCount: 0, taskToolBindingCount: 0 },
  models: [], tasks: [], agentGuards: [], toolBindings: [], hotspots: [], unknowns: [],
});

test('opened projection maps all evaluation states without content', () => {
  assert.deepEqual(createResourceAnalysisOpenedAnalyticsProperties({ status: 'available', result: result('sequential'), blockingCodes: [], error: null }), { state: 'available', process: 'sequential', analysis_version: '0.1.0' });
  assert.deepEqual(createResourceAnalysisOpenedAnalyticsProperties({ status: 'available', result: result('hierarchical'), blockingCodes: [], error: null }), { state: 'available', process: 'hierarchical', analysis_version: '0.1.0' });
  assert.deepEqual(createResourceAnalysisOpenedAnalyticsProperties({ status: 'empty', result: null, blockingCodes: [], error: null }), { state: 'empty', process: 'none', analysis_version: '0.1.0' });
  assert.deepEqual(createResourceAnalysisOpenedAnalyticsProperties({ status: 'invalid', result: null, blockingCodes: ['PRIVATE_CODE'], error: null }), { state: 'invalid', process: 'none', analysis_version: '0.1.0' });
  assert.deepEqual(createResourceAnalysisOpenedAnalyticsProperties({ status: 'unavailable', result: null, blockingCodes: [], error: new Error('private') }), { state: 'unavailable', process: 'none', analysis_version: '0.1.0' });
});

test('hotspot projection accepts only exact v0 kind and target pairs', () => {
  assert.deepEqual(createResourceAnalysisHotspotAnalyticsProperties('dependency_depth', { type: 'task', id: 'private' }), { hotspot_kind: 'dependency_depth', target_type: 'task' });
  assert.deepEqual(createResourceAnalysisHotspotAnalyticsProperties('context_fan_in', { type: 'task', id: 'private' }), { hotspot_kind: 'context_fan_in', target_type: 'task' });
  assert.deepEqual(createResourceAnalysisHotspotAnalyticsProperties('tool_binding_concentration', { type: 'tool', id: 'private' }), { hotspot_kind: 'tool_binding_concentration', target_type: 'tool' });
  assert.equal(createResourceAnalysisHotspotAnalyticsProperties('dependency_depth', { type: 'tool', id: 'private' }), null);
  assert.equal(createResourceAnalysisHotspotAnalyticsProperties('context_fan_in', { type: 'agent', id: 'private' }), null);
  assert.equal(createResourceAnalysisHotspotAnalyticsProperties('tool_binding_concentration', { type: 'crew' }), null);
});
