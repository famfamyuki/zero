import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Edge } from '@xyflow/react';
import type { AgentNodeData, CrewConfig, CustomNode } from '../types/editor';
import { createResourceAnalysisReadModel } from '../lib/resource-analysis';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { validateGraph } from '../lib/transpiler/validation';

const sequential: CrewConfig = { name: 'Resources', process: 'sequential', verbose: true, memory: false };
const agent = (id: string, model: string, guards: Partial<Pick<AgentNodeData, 'maxIter' | 'maxRpm' | 'maxExecutionTime'>> = {}): CustomNode => ({ id, type: 'agent', position: { x: 0, y: 0 }, data: { label: `Label ${id}`, role: `Role ${id}`, goal: 'Work', backstory: 'Expert', model, verbose: true, allowDelegation: false, ...guards } });
const task = (id: string, asyncExecution = false): CustomNode => ({ id, type: 'task', position: { x: 0, y: 0 }, data: { label: `Label ${id}`, description: 'Work', expectedOutput: 'Result', asyncExecution } });
const tool = (id: string): CustomNode => ({ id, type: 'tool', position: { x: 0, y: 0 }, data: { label: `Label ${id}`, toolType: 'FileReadTool', description: 'Read' } });
const edge = (id: string, source: string, target: string): Edge => ({ id, source, target });

function create(nodes: CustomNode[], edges: Edge[], config = sequential) {
  const validation = validateGraph(nodes, edges, config);
  assert.equal(validation.isValid, true, validation.errors.map((issue) => issue.code).join(','));
  const plan = createSemanticPlan(nodes, edges, config, validation);
  return { plan, result: createResourceAnalysisReadModel(plan) };
}

describe('RA-B1 core Resource Analysis read model', () => {
  test('projects sequential counts, fixed assignments, async configuration, and execution order', () => {
    const nodes = [task('task-b', true), agent('agent-b', 'claude-sonnet-4-6'), task('task-a'), agent('agent-a', 'gpt-5.6-terra')];
    const edges = [edge('a', 'agent-a', 'task-a'), edge('b', 'agent-b', 'task-b'), edge('order', 'task-a', 'task-b')];
    const { result } = create(nodes, edges);
    assert.deepEqual(result.summary, { agentCount: 2, taskCount: 2, toolCount: 0, executionStepCount: 2, uniqueModelCount: 2, asyncTaskCount: 1, fixedAssignmentCount: 2, managerDelegatedTaskCount: 0, agentToolBindingCount: 0, taskToolBindingCount: 0 });
    assert.deepEqual(result.tasks.map(({ task }) => [task.taskId, task.planOrder]), [['task-a', 0], ['task-b', 1]]);
    assert.deepEqual(result.tasks.map(({ assignment }) => assignment.kind), ['fixed', 'fixed']);
    assert.equal(result.tasks[1].asyncConfigured, true);
  });

  test('groups normalized agent and manager models with stable references and preserves custom IDs', () => {
    const config: CrewConfig = { ...sequential, process: 'hierarchical', managerLlm: 'gpt-5.6-terra' };
    const nodes = [agent('agent-c', 'vendor/custom-v1'), agent('agent-b', 'gpt-5.6-terra'), task('task-a'), agent('agent-a', 'gpt-5.6-terra')];
    const { result } = create(nodes, [], config);
    assert.deepEqual(result.models.map((item) => item.model), ['openai/gpt-5.6-terra', 'vendor/custom-v1']);
    assert.deepEqual(result.models[0], { model: 'openai/gpt-5.6-terra', agents: [{ agentId: 'agent-a', label: 'Label agent-a', role: 'Role agent-a' }, { agentId: 'agent-b', label: 'Label agent-b', role: 'Role agent-b' }], agentCount: 2, usedByManager: true, referenceCount: 3 });
    assert.equal(result.models[1].referenceCount, 1);
    assert.equal(result.summary.uniqueModelCount, 2);
  });

  test('keeps hierarchical configured agents manager-delegated rather than fabricating fixed assignment', () => {
    const config: CrewConfig = { ...sequential, process: 'hierarchical' };
    const nodes = [agent('agent-a', 'gpt-5.6-terra'), task('task-a')];
    const { result } = create(nodes, [edge('configured', 'agent-a', 'task-a')], config);
    assert.deepEqual(result.tasks[0].assignment, { kind: 'manager_delegated', configuredAgent: { agentId: 'agent-a', label: 'Label agent-a', role: 'Role agent-a' } });
    assert.equal(result.summary.fixedAssignmentCount, 0);
    assert.equal(result.summary.managerDelegatedTaskCount, 1);
  });

  test('projects deduped agent and task tool bindings separately in canonical order', () => {
    const nodes = [task('task-b'), tool('tool-b'), agent('agent-b', 'gpt-5.6-terra'), task('task-a'), tool('tool-a'), agent('agent-a', 'gpt-5.6-terra')];
    const edges = [
      edge('aa', 'agent-a', 'task-a'), edge('bb', 'agent-b', 'task-b'), edge('order', 'task-a', 'task-b'),
      edge('ta1', 'tool-a', 'agent-a'), edge('ta2', 'tool-a', 'agent-a'), edge('tb', 'tool-a', 'agent-b'),
      edge('tt1', 'tool-a', 'task-a'), edge('tt2', 'tool-a', 'task-a'), edge('other', 'tool-b', 'task-b'),
    ];
    const { result } = create(nodes, edges);
    assert.deepEqual(result.toolBindings.map(({ tool }) => tool.toolId), ['tool-a', 'tool-b']);
    assert.deepEqual(result.toolBindings[0].agentBindings.map((item) => item.agentId), ['agent-a', 'agent-b']);
    assert.deepEqual(result.toolBindings[0].taskBindings.map((item) => [item.taskId, item.planOrder]), [['task-a', 0]]);
    assert.deepEqual({ agent: result.toolBindings[0].agentBindingCount, task: result.toolBindings[0].taskBindingCount, total: result.toolBindings[0].totalBindingCount }, { agent: 2, task: 1, total: 3 });
    assert.equal(result.summary.agentToolBindingCount, 2);
    assert.equal(result.summary.taskToolBindingCount, 2);
  });

  test('projects shared default and configured execution guards without reinterpretation', () => {
    const config: CrewConfig = { ...sequential, process: 'hierarchical' };
    const nodes = [agent('agent-b', 'gpt-5.6-terra', { maxIter: 2.5, maxRpm: 20, maxExecutionTime: 60 }), agent('agent-a', 'gpt-5.6-terra'), task('task-a')];
    const { result } = create(nodes, [], config);
    assert.deepEqual(result.agentGuards.map(({ agent }) => agent.agentId), ['agent-a', 'agent-b']);
    assert.deepEqual(result.agentGuards[0], { agent: { agentId: 'agent-a', label: 'Label agent-a', role: 'Role agent-a' }, maxIter: { value: 25, source: 'codegen_default' }, maxRpm: { value: null, source: 'codegen_default' }, maxExecutionTime: { value: null, source: 'codegen_default' } });
    assert.deepEqual(result.agentGuards[1].maxIter, { value: 2.5, source: 'configured' });
    assert.deepEqual(result.agentGuards[1].maxRpm, { value: 20, source: 'configured' });
    assert.deepEqual(result.agentGuards[1].maxExecutionTime, { value: 60, source: 'configured' });
  });

  test('is repeatable, graph insertion-order independent, and does not mutate SemanticPlan', () => {
    const nodes = [task('task-b'), tool('tool-a'), agent('agent-b', 'vendor/custom-v1'), task('task-a'), agent('agent-a', 'gpt-5.6-terra')];
    const edges = [edge('a', 'agent-a', 'task-a'), edge('b', 'agent-b', 'task-b'), edge('order', 'task-a', 'task-b'), edge('tool', 'tool-a', 'agent-b')];
    const first = create(nodes, edges);
    const snapshot = structuredClone(first.plan);
    assert.deepEqual(createResourceAnalysisReadModel(first.plan), first.result);
    const reversed = create([...nodes].reverse(), [...edges].reverse());
    assert.deepEqual(reversed.result, first.result);
    assert.deepEqual(first.plan, snapshot);
  });
});
