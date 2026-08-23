import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Edge } from '@xyflow/react';
import type { CrewConfig, CustomNode } from '../types/editor';
import type { SemanticPlan } from '../lib/transpiler/semantic-plan';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { validateGraph } from '../lib/transpiler/validation';
import { createExecutionPreviewReadModel, ExecutionPreviewInvariantError } from '../lib/execution-preview';

const sequential: CrewConfig = { name: 'Preview', process: 'sequential', verbose: true, memory: false };
const agent = (id: string, model = 'gpt-5.6-terra'): CustomNode => ({ id, type: 'agent', position: { x: 11, y: 22 }, selected: true, data: { label: `${id} label`, role: `${id} role`, goal: 'Work', backstory: 'Expert', model, verbose: true, allowDelegation: false } });
const task = (id: string, extra: Record<string, unknown> = {}): CustomNode => ({ id, type: 'task', position: { x: 33, y: 44 }, selected: true, data: { label: `${id} label`, description: `${id} description`, expectedOutput: `${id} output`, asyncExecution: false, ...extra } });
const tool = (id: string, toolType: 'FileReadTool' | 'DirectoryReadTool' = 'FileReadTool'): CustomNode => ({ id, type: 'tool', position: { x: 55, y: 66 }, selected: true, data: { label: `${id} label`, toolType, description: 'Read' } });
const edge = (id: string, source: string, target: string): Edge => ({ id, source, target });

function semanticPlan(nodes: CustomNode[], edges: Edge[], config = sequential) {
  return createSemanticPlan(nodes, edges, config, validateGraph(nodes, edges, config));
}

function graph() {
  const nodes = [task('task-c', { outputFormat: 'json', humanInput: true, markdown: true, outputFile: 'result.md' }), tool('tool-b', 'DirectoryReadTool'), agent('agent-b', 'ollama/llama3.3'), task('task-a'), tool('tool-a'), agent('agent-a', 'vendor/custom-v1'), task('task-b', { asyncExecution: true })];
  const edges = [edge('1', 'agent-a', 'task-a'), edge('2', 'agent-b', 'task-b'), edge('3', 'agent-a', 'task-c'), edge('4', 'task-a', 'task-c'), edge('5', 'task-b', 'task-c'), edge('6', 'tool-b', 'agent-a'), edge('7', 'tool-a', 'agent-a'), edge('8', 'tool-b', 'task-c'), edge('9', 'tool-a', 'task-c')];
  return { nodes, edges };
}

function replace(plan: SemanticPlan, changes: Partial<SemanticPlan>): SemanticPlan {
  return { ...plan, ...changes };
}

describe('EPV-B Execution Preview Read Model', () => {
  test('projects the complete sequential plan without reordering semantic relations', () => {
    const { nodes, edges } = graph();
    const plan = semanticPlan(nodes, edges);
    const preview = createExecutionPreviewReadModel(plan);
    assert.equal(preview.version, '0.1.0');
    assert.equal(preview.process, 'sequential');
    assert.deepEqual(preview.summary, { taskCount: 3, agentCount: 2, toolCount: 2 });
    assert.deepEqual(preview.steps.map((step) => step.taskId), plan.executionTasks.map((node) => node.id));
    assert.deepEqual(preview.steps.map((step) => step.planOrder), [1, 2, 3]);
    assert.deepEqual(preview.steps[2].context.map((item) => item.taskId), plan.taskContextIds['task-c']);
    assert.deepEqual(preview.steps[2].directTools.map((item) => item.toolId), plan.taskToolIds['task-c']);
    assert.deepEqual(preview.agents[0].tools.map((item) => item.toolId), plan.agentToolIds['agent-a']);
    assert.deepEqual(preview.steps[0].assignment, { kind: 'fixed', agent: { agentId: 'agent-a', label: 'agent-a label', role: 'agent-a role' } });
    assert.equal(preview.agents[0].model, plan.agentModels['agent-a']);
    assert.equal(preview.manager, undefined);
  });

  test('projects display metadata, stable IDs, types, and default text output as plain DTOs', () => {
    const { nodes, edges } = graph();
    const preview = createExecutionPreviewReadModel(semanticPlan(nodes, edges));
    const jsonStep = preview.steps.find((step) => step.taskId === 'task-c')!;
    assert.deepEqual({ label: jsonStep.label, description: jsonStep.description, expectedOutput: jsonStep.expectedOutput, asyncExecution: jsonStep.asyncExecution, outputFormat: jsonStep.outputFormat, humanInput: jsonStep.humanInput, markdown: jsonStep.markdown, outputFile: jsonStep.outputFile }, { label: 'task-c label', description: 'task-c description', expectedOutput: 'task-c output', asyncExecution: false, outputFormat: 'json', humanInput: true, markdown: true, outputFile: 'result.md' });
    assert.equal(preview.steps.find((step) => step.taskId === 'task-a')!.outputFormat, 'text');
    assert.deepEqual(preview.tools[0], { toolId: 'tool-a', label: 'tool-a label', toolType: 'FileReadTool' });
    const serialized = JSON.stringify(preview);
    for (const forbidden of ['position', 'selected', 'sourceHandle', 'targetHandle', 'agentVarNames', 'taskVarNames', 'python']) assert.equal(serialized.includes(forbidden), false);
  });

  test('projects hierarchical manager delegation with configured Agent as informational only', () => {
    const config: CrewConfig = { ...sequential, process: 'hierarchical', managerLlm: 'anthropic/claude-sonnet-4-6' };
    const nodes = [agent('agent-a'), task('configured'), task('unassigned')];
    const edges = [edge('1', 'agent-a', 'configured')];
    const plan = semanticPlan(nodes, edges, config);
    const preview = createExecutionPreviewReadModel(plan);
    assert.deepEqual(preview.manager, { model: plan.managerModel });
    assert.deepEqual(preview.steps.find((step) => step.taskId === 'configured')!.assignment, { kind: 'manager_delegated', configuredAgent: { agentId: 'agent-a', label: 'agent-a label', role: 'agent-a role' } });
    assert.deepEqual(preview.steps.find((step) => step.taskId === 'unassigned')!.assignment, { kind: 'manager_delegated' });
    assert.equal(JSON.stringify(preview.steps).includes('fixed'), false);
  });

  test('is deterministic, does not mutate SemanticPlan, and inherits graph permutation independence', () => {
    const { nodes, edges } = graph();
    const plan = semanticPlan(nodes, edges);
    const snapshot = structuredClone(plan);
    const first = createExecutionPreviewReadModel(plan);
    assert.deepEqual(createExecutionPreviewReadModel(plan), first);
    assert.deepEqual(plan, snapshot);
    const reversedNodes = [...nodes].reverse();
    const reversedEdges = [...edges].reverse();
    assert.deepEqual(createExecutionPreviewReadModel(semanticPlan(reversedNodes, reversedEdges)), first);
  });

  test('throws ExecutionPreviewInvariantError for missing assignments, references, models, and manager invariants', () => {
    const { nodes, edges } = graph();
    const plan = semanticPlan(nodes, edges);
    const without = <T>(record: Record<string, T>, key: string) => Object.fromEntries(Object.entries(record).filter(([id]) => id !== key));
    const cases: SemanticPlan[] = [
      replace(plan, { taskAssignments: without(plan.taskAssignments, 'task-a') }),
      replace(plan, { taskAssignments: { ...plan.taskAssignments, 'task-a': { kind: 'fixed', agentId: 'missing' } } }),
      replace(plan, { taskToolIds: { ...plan.taskToolIds, 'task-a': ['missing'] } }),
      replace(plan, { taskContextIds: { ...plan.taskContextIds, 'task-c': ['missing'] } }),
      replace(plan, { agentModels: without(plan.agentModels, 'agent-a') }),
      replace(plan, { managerModel: 'unexpected' }),
    ];
    for (const candidate of cases) assert.throws(() => createExecutionPreviewReadModel(candidate), ExecutionPreviewInvariantError);

    const hierarchicalConfig: CrewConfig = { ...sequential, process: 'hierarchical' };
    const hierarchical = semanticPlan([agent('agent-a'), task('task-a')], [], hierarchicalConfig);
    assert.throws(() => createExecutionPreviewReadModel(replace(hierarchical, { managerModel: undefined })), ExecutionPreviewInvariantError);
    assert.throws(() => createExecutionPreviewReadModel(replace(hierarchical, { taskAssignments: { 'task-a': { kind: 'manager_delegated', configuredAgentId: 'missing' } } })), ExecutionPreviewInvariantError);
  });
});
