import { Edge } from '@xyflow/react';
import { DEFAULT_LLM_MODEL } from '@/lib/models';
import { AgentNodeData, CrewConfig, CustomNode, ValidationResult } from '@/types/editor';

export const stableCompare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;

export function normalizeModel(rawModel?: string): string {
  const model = String(rawModel || DEFAULT_LLM_MODEL).trim();
  if (!model) return `openai/${DEFAULT_LLM_MODEL}`;
  if (['openai/', 'anthropic/', 'gemini/', 'groq/', 'deepseek/', 'ollama/'].some((prefix) => model.startsWith(prefix))) return model;
  const lower = model.toLowerCase();
  if (lower.startsWith('gpt-') || lower.startsWith('o1') || lower.startsWith('o3') || lower.startsWith('o4') || lower.startsWith('text-davinci') || lower.startsWith('dall-e')) return `openai/${model}`;
  if (lower.includes('claude')) return `anthropic/${model}`;
  if (lower.includes('gemini')) return `gemini/${model}`;
  if (lower.includes('deepseek')) return `deepseek/${model}`;
  if (lower.includes('llama')) return `groq/${model}`;
  return model;
}

export type SemanticTaskAssignment =
  | { kind: 'fixed'; agentId: string }
  | { kind: 'manager_delegated'; configuredAgentId?: string };

export type SemanticExecutionGuardSource = 'configured' | 'codegen_default';

export interface SemanticExecutionGuard {
  readonly value: number | null;
  readonly source: SemanticExecutionGuardSource;
}

export interface SemanticAgentExecutionGuards {
  readonly maxIter: SemanticExecutionGuard;
  readonly maxRpm: SemanticExecutionGuard;
  readonly maxExecutionTime: SemanticExecutionGuard;
}

export function normalizeExecutionGuard(rawValue: number | undefined, codegenDefault: number | null): SemanticExecutionGuard {
  return Number.isFinite(rawValue)
    ? { value: Math.max(1, Number(rawValue)), source: 'configured' }
    : { value: codegenDefault, source: 'codegen_default' };
}

export interface SemanticPlan {
  process: CrewConfig['process'];
  tools: CustomNode[];
  agents: CustomNode[];
  tasksById: CustomNode[];
  executionTasks: CustomNode[];
  taskAssignments: Record<string, SemanticTaskAssignment>;
  agentToolIds: Record<string, string[]>;
  taskToolIds: Record<string, string[]>;
  taskContextIds: Record<string, string[]>;
  agentModels: Record<string, string>;
  agentExecutionGuards: Record<string, SemanticAgentExecutionGuards>;
  managerModel?: string;
}

export function createSemanticPlan(
  nodes: CustomNode[],
  edges: Edge[],
  crewConfig: CrewConfig,
  validation: ValidationResult,
): SemanticPlan {
  if (!validation.isValid || validation.errors.length > 0) {
    throw new Error('Cannot create SemanticPlan from an invalid ValidationResult.');
  }

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const tools = nodes.filter((node) => node.type === 'tool').sort((a, b) => stableCompare(a.id, b.id));
  const agents = nodes.filter((node) => node.type === 'agent').sort((a, b) => stableCompare(a.id, b.id));
  const tasksById = nodes.filter((node) => node.type === 'task').sort((a, b) => stableCompare(a.id, b.id));
  const executionTasks = validation.sortedTaskIds.map((id) => byId.get(id)!).filter(Boolean);

  const toolIdsFor = (targetId: string): string[] => Array.from(new Set(edges.flatMap((edge) => {
    const source = byId.get(edge.source);
    return edge.target === targetId && source?.type === 'tool' ? [source.id] : [];
  }))).sort(stableCompare);

  const agentToolIds: Record<string, string[]> = {};
  const taskToolIds: Record<string, string[]> = {};
  agents.forEach((node) => { agentToolIds[node.id] = toolIdsFor(node.id); });
  tasksById.forEach((node) => { taskToolIds[node.id] = toolIdsFor(node.id); });

  const rank = new Map(validation.sortedTaskIds.map((id, index) => [id, index]));
  const taskContextIds: Record<string, string[]> = {};
  tasksById.forEach((node) => {
    taskContextIds[node.id] = Array.from(new Set(validation.taskContextMap[node.id] || []))
      .sort((a, b) => (rank.get(a)! - rank.get(b)!) || stableCompare(a, b));
  });

  const taskAssignments: Record<string, SemanticTaskAssignment> = {};
  tasksById.forEach((node) => {
    const configuredAgentId = validation.taskAgentMap[node.id];
    taskAssignments[node.id] = crewConfig.process === 'hierarchical'
      ? { kind: 'manager_delegated', ...(configuredAgentId ? { configuredAgentId } : {}) }
      : { kind: 'fixed', agentId: configuredAgentId };
  });

  const agentModels: Record<string, string> = {};
  agents.forEach((node) => { agentModels[node.id] = normalizeModel((node.data as AgentNodeData).model); });
  const agentExecutionGuards: Record<string, SemanticAgentExecutionGuards> = {};
  agents.forEach((node) => {
    const data = node.data as AgentNodeData;
    agentExecutionGuards[node.id] = {
      maxIter: normalizeExecutionGuard(data.maxIter, 25),
      maxRpm: normalizeExecutionGuard(data.maxRpm, null),
      maxExecutionTime: normalizeExecutionGuard(data.maxExecutionTime, null),
    };
  });

  return {
    process: crewConfig.process,
    tools,
    agents,
    tasksById,
    executionTasks,
    taskAssignments,
    agentToolIds,
    taskToolIds,
    taskContextIds,
    agentModels,
    agentExecutionGuards,
    ...(crewConfig.process === 'hierarchical' ? { managerModel: normalizeModel(crewConfig.managerLlm) } : {}),
  };
}
