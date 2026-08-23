import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import type { Edge } from '@xyflow/react';
import type { AgentNodeData, CrewConfig, CustomNode, GraphData } from '../types/editor';
import { evaluateResourceAnalysis, projectResourceAnalysis } from '../lib/resource-analysis-evaluation';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { validateGraph } from '../lib/transpiler/validation';

const sequential: CrewConfig = { name: 'Analysis', process: 'sequential', verbose: true, memory: false };
const graph = (nodes: CustomNode[], edges: Edge[] = [], crewConfig = sequential): GraphData => ({ nodes, edges, crewConfig });
const agent = (id: string, model = 'gpt-5.6-terra', extra: Partial<AgentNodeData> = {}): CustomNode => ({ id, type: 'agent', position: { x: 0, y: 0 }, data: { label: id, role: 'Researcher', goal: 'Research', backstory: 'Expert', model, verbose: true, allowDelegation: false, ...extra } });
const task = (id: string, description = 'Work'): CustomNode => ({ id, type: 'task', position: { x: 0, y: 0 }, data: { label: id, description, expectedOutput: 'Result', asyncExecution: false } });
const tool = (id: string, connected = true): CustomNode => ({ id, type: 'tool', position: { x: 0, y: 0 }, data: { label: id, toolType: connected ? 'FileReadTool' : 'CustomTool', description: connected ? 'Read' : '' } });
const edge = (id: string, source: string, target: string): Edge => ({ id, source, target });
const validSequential = () => graph([agent('agent-a'), task('task-a')], [edge('owner', 'agent-a', 'task-a')]);

describe('RA-C1 Resource Analysis evaluation state', () => {
  test('classifies only a graph with no nodes and no edges as empty', () => {
    assert.deepEqual(evaluateResourceAnalysis(graph([])), { status: 'empty', result: null, blockingCodes: [], error: null });
    assert.equal(evaluateResourceAnalysis(graph([task('task-only')])).status, 'invalid');
    assert.equal(evaluateResourceAnalysis(graph([], [edge('orphan', 'missing-a', 'missing-b')])).status, 'invalid');
  });

  test('returns deduplicated error codes in stable ascending order', () => {
    const result = evaluateResourceAnalysis(graph([task('task-b', ''), task('task-a', '')]));
    assert.equal(result.status, 'invalid');
    assert.deepEqual(result.blockingCodes, [...new Set(result.blockingCodes)].sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
    assert.ok(result.blockingCodes.includes('TASK_DESCRIPTION_MISSING'));
    assert.ok(result.blockingCodes.includes('NO_AGENTS'));
    assert.equal(result.error, null);
  });

  test('warning and info findings do not block an otherwise valid analysis', () => {
    const withInfo = evaluateResourceAnalysis(graph([agent('agent-a', 'vendor/custom-v1'), task('task-a')], [edge('owner', 'agent-a', 'task-a')]));
    assert.equal(withInfo.status, 'available');
    const withWarning = evaluateResourceAnalysis(graph([agent('agent-a'), task('task-a'), tool('unused', false)], [edge('owner', 'agent-a', 'task-a')]));
    assert.equal(withWarning.status, 'available');
  });

  test('projects valid sequential and hierarchical graphs without changing the read model contract', () => {
    const sequentialResult = evaluateResourceAnalysis(validSequential());
    assert.equal(sequentialResult.status, 'available');
    if (sequentialResult.status === 'available') {
      assert.equal(sequentialResult.result.version, '0.1.0');
      assert.equal(sequentialResult.result.process, 'sequential');
      assert.equal(sequentialResult.result.summary.executionStepCount, 1);
    }

    const hierarchicalResult = evaluateResourceAnalysis(graph(
      [agent('agent-a'), task('task-a')],
      [edge('configured', 'agent-a', 'task-a')],
      { ...sequential, process: 'hierarchical', managerLlm: 'vendor/manager' },
    ));
    assert.equal(hierarchicalResult.status, 'available');
    if (hierarchicalResult.status === 'available') {
      assert.deepEqual(hierarchicalResult.result.manager, { model: 'vendor/manager' });
      assert.ok(hierarchicalResult.result.unknowns.some(({ code }) => code === 'manager_runtime_assignment'));
    }
  });

  test('preserves Error failures and normalizes non-Error projection failures', () => {
    const source = validSequential();
    const validation = validateGraph(source.nodes, source.edges, source.crewConfig, 'scaffold');
    const plan = createSemanticPlan(source.nodes, source.edges, source.crewConfig, validation);
    const expected = new Error('projection failed');
    const errorResult = projectResourceAnalysis(plan, () => { throw expected; });
    assert.equal(errorResult.status, 'unavailable');
    assert.equal(errorResult.error, expected);
    const nonErrorResult = projectResourceAnalysis(plan, () => { throw 'projection failed'; });
    assert.equal(nonErrorResult.status, 'unavailable');
    assert.equal(nonErrorResult.error?.message, 'Resource Analysis unavailable');
  });

  test('hook source enforces null refresh state, latest-graph debounce, cancellation, evaluateNow, and unmount cleanup', () => {
    const source = readFileSync('hooks/useResourceAnalysis.ts', 'utf8');
    assert.match(source, /useState<ResourceAnalysisState \| null>/);
    assert.match(source, /setState\(null\);\s*setIsRefreshing\(true\)/);
    assert.match(source, /latestGraph\.current = graph/);
    assert.match(source, /currentGraph = latestGraph\.current/);
    assert.match(source, /evaluateResourceAnalysis\(currentGraph\)/);
    assert.match(source, /state: graphChanged \? null : state/);
    assert.match(source, /isRefreshing: graphChanged \? true : isRefreshing/);
    assert.match(source, /RESOURCE_ANALYSIS_DEBOUNCE_MS = 250/);
    assert.ok((source.match(/clearTimeout\(timer\.current\)/g) || []).length >= 3);
    assert.match(source, /timer\.current = setTimeout\(evaluateNow, RESOURCE_ANALYSIS_DEBOUNCE_MS\)/);
    assert.match(source, /setIsRefreshing\(false\)/);
    assert.match(source, /alive\.current = false/);
    assert.doesNotMatch(source, /status: 'empty'/);
    assert.doesNotMatch(source, /useExecutionPreview|localStorage|sessionStorage|Readiness/);
  });
});
