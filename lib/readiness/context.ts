import type { Edge } from '@xyflow/react';
import type { AgentNodeData, CustomNode, GraphData, TaskNodeData, ValidationCode, ValidationIssue, ValidationResult } from '@/types/editor';

export const stableCompare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
export type AssignmentChannel = 'assignedAgentId' | 'agentToTask' | 'taskToAgent';

export interface ReadinessRuleContext {
  readonly graph: GraphData;
  readonly validation: ValidationResult;
  readonly agents: readonly CustomNode[];
  readonly tasks: readonly CustomNode[];
  readonly tools: readonly CustomNode[];
  readonly edges: readonly Edge[];
  readonly nodesById: ReadonlyMap<string, CustomNode>;
  readonly edgesBySource: ReadonlyMap<string, readonly Edge[]>;
  readonly edgesByTarget: ReadonlyMap<string, readonly Edge[]>;
  readonly validationIssuesByCode: ReadonlyMap<ValidationCode, readonly ValidationIssue[]>;
  readonly assignmentChannelsByTask: ReadonlyMap<string, ReadonlyMap<string, ReadonlySet<AssignmentChannel>>>;
  readonly outputFileTasks: ReadonlyMap<string, readonly CustomNode[]>;
}

function groupedEdges(edges: readonly Edge[], field: 'source' | 'target'): Map<string, readonly Edge[]> {
  const result = new Map<string, Edge[]>();
  edges.forEach((edge) => { const items = result.get(edge[field]) || []; items.push(edge); result.set(edge[field], items); });
  return result;
}

export function createReadinessContext(graph: GraphData, validation: ValidationResult): ReadinessRuleContext {
  const nodes = [...graph.nodes].sort((a, b) => stableCompare(a.id, b.id));
  const edges = [...graph.edges].sort((a, b) => stableCompare(a.id, b.id));
  const agents = nodes.filter((node) => node.type === 'agent');
  const tasks = nodes.filter((node) => node.type === 'task');
  const tools = nodes.filter((node) => node.type === 'tool');
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const validationIssuesByCode = new Map<ValidationCode, ValidationIssue[]>();
  validation.issues.forEach((issue) => { const items = validationIssuesByCode.get(issue.code) || []; items.push(issue); validationIssuesByCode.set(issue.code, items); });

  const assignments = new Map<string, Map<string, Set<AssignmentChannel>>>();
  tasks.forEach((task) => assignments.set(task.id, new Map()));
  const addAssignment = (taskId: string, agentId: string, channel: AssignmentChannel) => {
    const byAgent = assignments.get(taskId); if (!byAgent) return;
    const channels = byAgent.get(agentId) || new Set<AssignmentChannel>(); channels.add(channel); byAgent.set(agentId, channels);
  };
  tasks.forEach((task) => {
    const assignedAgentId = (task.data as TaskNodeData).assignedAgentId;
    if (assignedAgentId && nodesById.get(assignedAgentId)?.type === 'agent') addAssignment(task.id, assignedAgentId, 'assignedAgentId');
  });
  edges.forEach((edge) => {
    const source = nodesById.get(edge.source); const target = nodesById.get(edge.target);
    if (source?.type === 'agent' && target?.type === 'task') addAssignment(target.id, source.id, 'agentToTask');
    if (source?.type === 'task' && target?.type === 'agent') addAssignment(source.id, target.id, 'taskToAgent');
  });

  const outputFileTasks = new Map<string, CustomNode[]>();
  tasks.forEach((task) => {
    const outputFile = (task.data as TaskNodeData).outputFile;
    if (typeof outputFile !== 'string' || !outputFile.trim()) return;
    const key = outputFile.trim(); const items = outputFileTasks.get(key) || []; items.push(task); outputFileTasks.set(key, items);
  });
  outputFileTasks.forEach((items) => items.sort((a, b) => stableCompare(a.id, b.id)));

  return { graph, validation, agents, tasks, tools, edges, nodesById, edgesBySource: groupedEdges(edges, 'source'), edgesByTarget: groupedEdges(edges, 'target'), validationIssuesByCode, assignmentChannelsByTask: assignments, outputFileTasks };
}
