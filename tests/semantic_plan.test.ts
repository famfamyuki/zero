import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { Edge } from '@xyflow/react';
import { AgentNodeData, CrewConfig, CustomNode } from '../types/editor';
import { createSemanticPlan, normalizeModel } from '../lib/transpiler/semantic-plan';
import { validateGraph } from '../lib/transpiler/validation';

const sequential: CrewConfig = { name: 'Plan', process: 'sequential', verbose: true, memory: false };
const agent = (id: string, model = 'gpt-5.6-terra', guards: Partial<Pick<AgentNodeData, 'maxIter' | 'maxRpm' | 'maxExecutionTime'>> = {}): CustomNode => ({ id, type: 'agent', position: { x: 0, y: 0 }, data: { label: id, role: id, goal: 'Work', backstory: 'Expert', model, verbose: true, allowDelegation: false, ...guards } });
const task = (id: string, assignedAgentId?: string): CustomNode => ({ id, type: 'task', position: { x: 0, y: 0 }, data: { label: id, description: 'Work', expectedOutput: 'Result', assignedAgentId, asyncExecution: false } });
const tool = (id: string): CustomNode => ({ id, type: 'tool', position: { x: 0, y: 0 }, data: { label: id, toolType: 'FileReadTool', description: 'Read' } });
const edge = (id: string, source: string, target: string): Edge => ({ id, source, target });

function create(nodes: CustomNode[], edges: Edge[], config = sequential) {
  return createSemanticPlan(nodes, edges, config, validateGraph(nodes, edges, config));
}

function validGraph() {
  const nodes = [task('task-c'), tool('tool-b'), agent('agent-b', 'ollama/llama3.3'), task('task-a'), tool('tool-a'), agent('agent-a', 'vendor/custom-v1'), task('task-b')];
  const edges = [
    edge('1', 'agent-a', 'task-a'), edge('2', 'agent-b', 'task-b'), edge('3', 'agent-a', 'task-c'),
    edge('4', 'task-a', 'task-c'), edge('5', 'task-b', 'task-c'), edge('6', 'tool-b', 'agent-a'),
    edge('7', 'tool-a', 'agent-a'), edge('8', 'tool-b', 'task-c'), edge('9', 'tool-a', 'task-c'),
    edge('10', 'tool-a', 'task-c'), edge('11', 'task-a', 'task-c'),
  ];
  return { nodes, edges };
}

describe('EPV-A SemanticPlan boundary', () => {
  test('uses validation execution order, fixed assignments, rank-ordered context, and deduped stable tool IDs', () => {
    const { nodes, edges } = validGraph();
    const validation = validateGraph(nodes, edges, sequential);
    const plan = createSemanticPlan(nodes, edges, sequential, validation);
    assert.deepEqual(plan.executionTasks.map((node) => node.id), validation.sortedTaskIds);
    assert.deepEqual(plan.taskAssignments['task-a'], { kind: 'fixed', agentId: 'agent-a' });
    assert.deepEqual(plan.taskContextIds['task-c'], ['task-a', 'task-b']);
    assert.deepEqual(plan.agentToolIds['agent-a'], ['tool-a', 'tool-b']);
    assert.deepEqual(plan.taskToolIds['task-c'], ['tool-a', 'tool-b']);
  });

  test('represents hierarchical configured and unassigned tasks as manager delegated', () => {
    const config: CrewConfig = { ...sequential, process: 'hierarchical', managerLlm: 'claude-sonnet-4-6' };
    const nodes = [agent('agent-a'), task('configured', 'agent-a'), task('unassigned')];
    const plan = create(nodes, [], config);
    assert.deepEqual(plan.taskAssignments.configured, { kind: 'manager_delegated', configuredAgentId: 'agent-a' });
    assert.deepEqual(plan.taskAssignments.unassigned, { kind: 'manager_delegated' });
    assert.equal(plan.managerModel, 'anthropic/claude-sonnet-4-6');
  });

  test('normalizes agent/default manager models with existing parity and omits sequential manager semantics', () => {
    const nodes = [agent('agent-a', 'deepseek-chat'), task('task-a')];
    const plan = create(nodes, [edge('1', 'agent-a', 'task-a')]);
    assert.equal(plan.agentModels['agent-a'], normalizeModel('deepseek-chat'));
    assert.equal(plan.managerModel, undefined);
    const hierarchical = create(nodes, [edge('1', 'agent-a', 'task-a')], { ...sequential, process: 'hierarchical' });
    assert.equal(hierarchical.managerModel, normalizeModel(undefined));
  });

  test('provides effective execution guard defaults and configured sources for every agent', () => {
    const nodes = [
      agent('defaults'),
      agent('configured', 'gpt-5.6-terra', { maxIter: 10, maxRpm: 20, maxExecutionTime: 60 }),
      task('task-a'),
    ];
    const plan = create(nodes, [], { ...sequential, process: 'hierarchical' });
    assert.deepEqual(plan.agentExecutionGuards.defaults, {
      maxIter: { value: 25, source: 'codegen_default' },
      maxRpm: { value: null, source: 'codegen_default' },
      maxExecutionTime: { value: null, source: 'codegen_default' },
    });
    assert.deepEqual(plan.agentExecutionGuards.configured, {
      maxIter: { value: 10, source: 'configured' },
      maxRpm: { value: 20, source: 'configured' },
      maxExecutionTime: { value: 60, source: 'configured' },
    });
  });

  test('preserves renderer normalization for zero, negative, decimal, and non-finite guard values', () => {
    const nodes = [
      agent('bounded', 'gpt-5.6-terra', { maxIter: 0, maxRpm: -4, maxExecutionTime: 0.5 }),
      agent('non-finite', 'gpt-5.6-terra', { maxIter: Number.NaN, maxRpm: Number.POSITIVE_INFINITY, maxExecutionTime: Number.NEGATIVE_INFINITY }),
      task('task-a'),
    ];
    const plan = create(nodes, [], { ...sequential, process: 'hierarchical' });
    assert.deepEqual(plan.agentExecutionGuards.bounded, {
      maxIter: { value: 1, source: 'configured' },
      maxRpm: { value: 1, source: 'configured' },
      maxExecutionTime: { value: 1, source: 'configured' },
    });
    assert.deepEqual(plan.agentExecutionGuards['non-finite'], {
      maxIter: { value: 25, source: 'codegen_default' },
      maxRpm: { value: null, source: 'codegen_default' },
      maxExecutionTime: { value: null, source: 'codegen_default' },
    });

    const decimal = create([agent('decimal', 'gpt-5.6-terra', { maxIter: 2.5, maxRpm: 3.25, maxExecutionTime: 4.75 }), task('task-b')], [], { ...sequential, process: 'hierarchical' });
    assert.deepEqual(decimal.agentExecutionGuards.decimal, {
      maxIter: { value: 2.5, source: 'configured' },
      maxRpm: { value: 3.25, source: 'configured' },
      maxExecutionTime: { value: 4.75, source: 'configured' },
    });
  });

  test('is insertion-order independent, repeated-call deterministic, and does not mutate inputs', () => {
    const { nodes, edges } = validGraph();
    const nodesSnapshot = structuredClone(nodes);
    const edgesSnapshot = structuredClone(edges);
    const configSnapshot = structuredClone(sequential);
    const validation = validateGraph(nodes, edges, sequential);
    const validationSnapshot = structuredClone(validation);
    const first = createSemanticPlan(nodes, edges, sequential, validation);
    const repeated = createSemanticPlan(nodes, edges, sequential, validation);
    const reversedNodes = [...nodes].reverse();
    const reversedEdges = [...edges].reverse();
    const permuted = createSemanticPlan(reversedNodes, reversedEdges, sequential, validateGraph(reversedNodes, reversedEdges, sequential));
    assert.deepEqual(repeated, first);
    assert.deepEqual(permuted, first);
    assert.deepEqual(nodes, nodesSnapshot);
    assert.deepEqual(edges, edgesSnapshot);
    assert.deepEqual(sequential, configSnapshot);
    assert.deepEqual(validation, validationSnapshot);
  });

  test('refuses invalid and cyclic ValidationResults instead of producing a partial plan', () => {
    const unassigned = [task('task-a')];
    assert.throws(() => createSemanticPlan(unassigned, [], sequential, validateGraph(unassigned, [], sequential)), /invalid ValidationResult/);
    const nodes = [agent('agent-a'), task('task-a'), task('task-b')];
    const edges = [edge('1', 'agent-a', 'task-a'), edge('2', 'agent-a', 'task-b'), edge('3', 'task-a', 'task-b'), edge('4', 'task-b', 'task-a')];
    assert.throws(() => createSemanticPlan(nodes, edges, sequential, validateGraph(nodes, edges, sequential)), /invalid ValidationResult/);
  });
});
