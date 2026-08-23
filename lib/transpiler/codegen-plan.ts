import { Edge } from '@xyflow/react';
import { DEFAULT_LLM_MODEL } from '@/lib/models';
import { TOOL_PARAMETER_DEFINITIONS } from '@/lib/tool-config';
import { AgentNodeData, CrewConfig, CustomNode, TaskNodeData, ToolNodeData, ValidationResult } from '@/types/editor';
import { toPythonClassName, toPythonIdentifier } from './validation';

export const stableCompare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
  'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass',
  'raise', 'return', 'try', 'while', 'with', 'yield',
]);

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

function safeName(value: string): string {
  return PYTHON_KEYWORDS.has(value) ? `${value}_` : value;
}

function allocate(base: string, used: Set<string>): string {
  const safeBase = safeName(base);
  let candidate = safeBase;
  let suffix = 2;
  while (used.has(candidate) || PYTHON_KEYWORDS.has(candidate)) candidate = `${safeBase}_${suffix++}`;
  used.add(candidate);
  return candidate;
}

export interface CodegenPlan {
  tools: CustomNode[];
  agents: CustomNode[];
  tasksById: CustomNode[];
  executionTasks: CustomNode[];
  toolVarNames: Record<string, string>;
  agentVarNames: Record<string, string>;
  taskVarNames: Record<string, string>;
  structuredTaskSchemas: Record<string, string>;
  agentToolMap: Record<string, string[]>;
  taskToolMap: Record<string, string[]>;
  taskContextMap: Record<string, string[]>;
  agentModels: Record<string, string>;
  models: { model: string; varName: string }[];
  managerModel: string;
  managerLlmVar: string;
  prebuiltToolTypes: string[];
  customTools: ValidationResult['customTools'];
}

export function createCodegenPlan(nodes: CustomNode[], edges: Edge[], crewConfig: CrewConfig, validation: ValidationResult): CodegenPlan {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const tools = nodes.filter((node) => node.type === 'tool').sort((a, b) => stableCompare(a.id, b.id));
  const agents = nodes.filter((node) => node.type === 'agent').sort((a, b) => stableCompare(a.id, b.id));
  const tasksById = nodes.filter((node) => node.type === 'task').sort((a, b) => stableCompare(a.id, b.id));
  const executionTasks = validation.sortedTaskIds.map((id) => byId.get(id)!).filter(Boolean);
  const used = new Set<string>();
  const toolVarNames: Record<string, string> = {};
  const agentVarNames: Record<string, string> = {};
  const taskVarNames: Record<string, string> = {};
  tools.forEach((node, index) => {
    const data = node.data as ToolNodeData;
    const stem = toPythonIdentifier(data.label || '', 'tool');
    toolVarNames[node.id] = allocate(`${stem}_${index + 1}`, used);
  });
  agents.forEach((node) => {
    const data = node.data as AgentNodeData;
    agentVarNames[node.id] = allocate(`${toPythonIdentifier(data.role || '', 'agent')}_agent`, used);
  });
  tasksById.forEach((node) => {
    const data = node.data as TaskNodeData;
    taskVarNames[node.id] = allocate(`${toPythonIdentifier(data.label || '', 'task')}_task`, used);
  });

  const structuredTaskSchemas: Record<string, string> = {};
  const usedSchemaNames = new Set<string>();
  tasksById.forEach((node, index) => {
    if ((node.data as TaskNodeData).outputFormat !== 'json') return;
    const base = `${toPythonClassName((node.data as TaskNodeData).label || '', `Task${index + 1}`).replace(/Tool$/, '')}Output${index + 1}`;
    let name = base;
    let suffix = 2;
    while (usedSchemaNames.has(name)) name = `${base}${suffix++}`;
    usedSchemaNames.add(name);
    structuredTaskSchemas[node.id] = name;
  });

  const toolIdsFor = (targetId: string): string[] => Array.from(new Set(edges.flatMap((edge) => {
    const source = byId.get(edge.source);
    return edge.target === targetId && source?.type === 'tool' ? [source.id] : [];
  }))).sort(stableCompare);
  const agentToolMap: Record<string, string[]> = {};
  const taskToolMap: Record<string, string[]> = {};
  agents.forEach((node) => { agentToolMap[node.id] = toolIdsFor(node.id).map((id) => toolVarNames[id]); });
  tasksById.forEach((node) => { taskToolMap[node.id] = toolIdsFor(node.id).map((id) => toolVarNames[id]); });
  const rank = new Map(validation.sortedTaskIds.map((id, index) => [id, index]));
  const taskContextMap: Record<string, string[]> = {};
  tasksById.forEach((node) => {
    taskContextMap[node.id] = [...(validation.taskContextMap[node.id] || [])].sort((a, b) => (rank.get(a)! - rank.get(b)!) || stableCompare(a, b));
  });

  const agentModels: Record<string, string> = {};
  agents.forEach((node) => { agentModels[node.id] = normalizeModel((node.data as AgentNodeData).model); });
  const managerModel = crewConfig.process === 'hierarchical' ? normalizeModel(crewConfig.managerLlm) : '';
  const modelNames = Array.from(new Set([...Object.values(agentModels), ...(managerModel ? [managerModel] : [])])).sort(stableCompare);
  const usedLlmNames = new Set<string>();
  const models = modelNames.map((model) => ({
    model,
    varName: modelNames.length === 1 ? 'llm' : allocate(`llm_${model.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`, usedLlmNames),
  }));
  const modelVar = new Map(models.map((item) => [item.model, item.varName]));

  const customById = new Map(validation.customTools.map((tool) => [tool.id, tool]));
  return {
    tools, agents, tasksById, executionTasks, toolVarNames, agentVarNames, taskVarNames,
    structuredTaskSchemas, agentToolMap, taskToolMap, taskContextMap, agentModels, models,
    managerModel, managerLlmVar: modelVar.get(managerModel) || 'llm',
    prebuiltToolTypes: Array.from(new Set(tools.map((node) => (node.data as ToolNodeData).toolType).filter((type) => type !== 'CustomTool' && TOOL_PARAMETER_DEFINITIONS[type]))).sort(stableCompare),
    customTools: tools.flatMap((node) => customById.get(node.id) ? [customById.get(node.id)!] : []),
  };
}
