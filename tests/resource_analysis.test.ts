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

describe('RA-B Resource Analysis read model', () => {
  test('projects sequential counts, fixed assignments, async configuration, and execution order', () => {
    const nodes = [task('task-b', true), agent('agent-b', 'claude-sonnet-4-6'), task('task-a'), agent('agent-a', 'gpt-5.6-terra')];
    const edges = [edge('a', 'agent-a', 'task-a'), edge('b', 'agent-b', 'task-b'), edge('order', 'task-a', 'task-b')];
    const { result } = create(nodes, edges);
    assert.deepEqual(result.summary, { agentCount: 2, taskCount: 2, toolCount: 0, executionStepCount: 2, uniqueModelCount: 2, dependencyDepth: 2, maxContextFanIn: 1, asyncTaskCount: 1, fixedAssignmentCount: 2, managerDelegatedTaskCount: 0, agentToolBindingCount: 0, taskToolBindingCount: 0 });
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

  test('computes dependency depth, direct fan-in, and task direct tools from SemanticPlan', () => {
    const nodes = [agent('agent-a', 'gpt-5.6-terra'), task('task-d'), task('task-c'), task('task-b'), task('task-a'), tool('tool-b'), tool('tool-a')];
    const edges = [
      edge('aa', 'agent-a', 'task-a'), edge('ab', 'agent-a', 'task-b'), edge('ac', 'agent-a', 'task-c'), edge('ad', 'agent-a', 'task-d'),
      edge('a-b', 'task-a', 'task-b'), edge('a-c', 'task-a', 'task-c'), edge('b-d', 'task-b', 'task-d'), edge('c-d', 'task-c', 'task-d'),
      edge('tool-b', 'tool-b', 'task-d'), edge('tool-a', 'tool-a', 'task-d'),
    ];
    const { result } = create(nodes, edges);
    assert.deepEqual(result.tasks.map((item) => [item.task.taskId, item.dependencyDepth, item.contextFanIn]), [['task-a', 1, 0], ['task-b', 2, 1], ['task-c', 2, 1], ['task-d', 3, 2]]);
    assert.deepEqual(result.tasks[3].directTools.map((item) => item.toolId), ['tool-a', 'tool-b']);
    assert.equal(result.summary.dependencyDepth, 3);
    assert.equal(result.summary.maxContextFanIn, 2);
    assert.deepEqual(result.hotspots.slice(0, 2), [
      { kind: 'dependency_depth', value: 3, target: { type: 'task', id: 'task-d' } },
      { kind: 'context_fan_in', value: 2, target: { type: 'task', id: 'task-d' } },
    ]);
  });

  test('omits task hotspots for independent tasks and includes every depth and fan-in tie in plan order', () => {
    const independent = create([agent('agent-a', 'gpt-5.6-terra'), task('task-a')], [edge('owner', 'agent-a', 'task-a')]).result;
    assert.equal(independent.summary.dependencyDepth, 1);
    assert.equal(independent.summary.maxContextFanIn, 0);
    assert.deepEqual(independent.hotspots, []);

    const nodes = [agent('agent-a', 'gpt-5.6-terra'), task('task-a'), task('task-b'), task('task-c'), task('task-d'), task('task-e'), task('task-f')];
    const edges = [
      ...['a', 'b', 'c', 'd', 'e', 'f'].map((id) => edge(`owner-${id}`, 'agent-a', `task-${id}`)),
      edge('a-c', 'task-a', 'task-c'), edge('b-c', 'task-b', 'task-c'), edge('a-d', 'task-a', 'task-d'), edge('b-d', 'task-b', 'task-d'),
      edge('c-e', 'task-c', 'task-e'), edge('d-e', 'task-d', 'task-e'), edge('c-f', 'task-c', 'task-f'), edge('d-f', 'task-d', 'task-f'),
    ];
    const { result } = create(nodes, edges);
    assert.deepEqual(result.hotspots.filter((item) => item.kind === 'dependency_depth').map((item) => item.target), [{ type: 'task', id: 'task-e' }, { type: 'task', id: 'task-f' }]);
    assert.deepEqual(result.hotspots.filter((item) => item.kind === 'context_fan_in').map((item) => item.target), [{ type: 'task', id: 'task-c' }, { type: 'task', id: 'task-d' }, { type: 'task', id: 'task-e' }, { type: 'task', id: 'task-f' }]);
  });

  test('orders tool bindings by concentration and emits all tied tool hotspots by stable ID', () => {
    const nodes = [agent('agent-a', 'gpt-5.6-terra'), agent('agent-b', 'gpt-5.6-terra'), task('task-a'), task('task-b'), tool('tool-c'), tool('tool-b'), tool('tool-a')];
    const edges = [
      edge('owner-a', 'agent-a', 'task-a'), edge('owner-b', 'agent-b', 'task-b'),
      edge('aa', 'tool-a', 'agent-a'), edge('ab', 'tool-a', 'agent-b'), edge('at', 'tool-a', 'task-a'),
      edge('ba', 'tool-b', 'agent-a'), edge('bb', 'tool-b', 'agent-b'), edge('bt', 'tool-b', 'task-b'),
      edge('ct', 'tool-c', 'task-a'),
    ];
    const { result } = create(nodes, edges);
    assert.deepEqual(result.toolBindings.map((item) => [item.tool.toolId, item.totalBindingCount]), [['tool-a', 3], ['tool-b', 3], ['tool-c', 1]]);
    assert.deepEqual(result.hotspots, [
      { kind: 'tool_binding_concentration', value: 3, target: { type: 'tool', id: 'tool-a' } },
      { kind: 'tool_binding_concentration', value: 3, target: { type: 'tool', id: 'tool-b' } },
    ]);
  });

  test('emits runtime unknowns in fixed order and exposes only hierarchical manager fact', () => {
    const nodes = [agent('agent-a', 'gpt-5.6-terra'), task('task-a')];
    const edges = [edge('owner', 'agent-a', 'task-a')];
    const sequentialResult = create(nodes, edges).result;
    assert.deepEqual(sequentialResult.unknowns.map((item) => item.code), ['runtime_cost', 'runtime_latency', 'token_consumption', 'tool_invocation_count', 'tool_execution_duration', 'actual_iteration_count']);
    assert.equal(sequentialResult.manager, undefined);

    const hierarchical = create(nodes, edges, { ...sequential, process: 'hierarchical', managerLlm: 'claude-sonnet-4-6' }).result;
    assert.deepEqual(hierarchical.unknowns.map((item) => item.code), ['runtime_cost', 'runtime_latency', 'token_consumption', 'tool_invocation_count', 'tool_execution_duration', 'actual_iteration_count', 'manager_runtime_assignment']);
    assert.deepEqual(hierarchical.manager, { model: 'anthropic/claude-sonnet-4-6' });
  });

  test('keeps hotspot categories fixed and contains no score, severity, recommendation, or runtime estimates', () => {
    const nodes = [agent('agent-a', 'gpt-5.6-terra'), task('task-a'), task('task-b'), task('task-c'), tool('tool-a')];
    const edges = [edge('oa', 'agent-a', 'task-a'), edge('ob', 'agent-a', 'task-b'), edge('oc', 'agent-a', 'task-c'), edge('a-c', 'task-a', 'task-c'), edge('b-c', 'task-b', 'task-c'), edge('ta', 'tool-a', 'agent-a'), edge('tt', 'tool-a', 'task-c')];
    const { result } = create(nodes, edges);
    assert.deepEqual(result.hotspots.map((item) => item.kind), ['dependency_depth', 'context_fan_in', 'tool_binding_concentration']);
    assert.doesNotMatch(JSON.stringify(result), /severity|recommendation|complexityScore|costEstimate|latencyEstimate|tokenEstimate/);
  });

  test('throws instead of silently accepting unresolved dependency or unknown direct Tool references', () => {
    const nodes = [agent('agent-a', 'gpt-5.6-terra'), task('task-a')];
    const edges = [edge('owner', 'agent-a', 'task-a')];
    const { plan } = create(nodes, edges);
    assert.throws(() => createResourceAnalysisReadModel({ ...plan, taskContextIds: { 'task-a': ['missing'] } }), /Resource Analysis invariant violation/);
    assert.throws(() => createResourceAnalysisReadModel({ ...plan, taskToolIds: { 'task-a': ['missing'] } }), /Resource Analysis invariant violation/);
  });
});
