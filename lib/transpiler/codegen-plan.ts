import { Edge } from '@xyflow/react';
import { TOOL_PARAMETER_DEFINITIONS } from '@/lib/tool-config';
import { AgentNodeData, CrewConfig, CustomNode, TaskNodeData, ToolNodeData, ValidationResult } from '@/types/editor';
import { toPythonClassName, toPythonIdentifier } from './validation';
import { createSemanticPlan, normalizeModel, SemanticPlan, SemanticTaskAssignment, stableCompare } from './semantic-plan';

export { normalizeModel, stableCompare } from './semantic-plan';

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
  'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass',
  'raise', 'return', 'try', 'while', 'with', 'yield',
]);

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
  semanticPlan: SemanticPlan;
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
  taskAssignments: Record<string, SemanticTaskAssignment>;
  agentModels: Record<string, string>;
  models: { model: string; varName: string }[];
  managerModel: string;
  managerLlmVar: string;
  prebuiltToolTypes: string[];
  customTools: ValidationResult['customTools'];
}

export function createCodegenPlan(nodes: CustomNode[], edges: Edge[], crewConfig: CrewConfig, validation: ValidationResult): CodegenPlan {
  const semanticPlan = createSemanticPlan(nodes, edges, crewConfig, validation);
  const { tools, agents, tasksById, executionTasks } = semanticPlan;
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

  const agentToolMap: Record<string, string[]> = {};
  const taskToolMap: Record<string, string[]> = {};
  agents.forEach((node) => { agentToolMap[node.id] = semanticPlan.agentToolIds[node.id].map((id) => toolVarNames[id]); });
  tasksById.forEach((node) => { taskToolMap[node.id] = semanticPlan.taskToolIds[node.id].map((id) => toolVarNames[id]); });
  const taskContextMap = semanticPlan.taskContextIds;

  const agentModels = semanticPlan.agentModels;
  const managerModel = semanticPlan.managerModel || '';
  const modelNames = Array.from(new Set([...Object.values(agentModels), ...(managerModel ? [managerModel] : [])])).sort(stableCompare);
  const usedLlmNames = new Set<string>();
  const models = modelNames.map((model) => ({
    model,
    varName: modelNames.length === 1 ? 'llm' : allocate(`llm_${model.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`, usedLlmNames),
  }));
  const modelVar = new Map(models.map((item) => [item.model, item.varName]));

  const customById = new Map(validation.customTools.map((tool) => [tool.id, tool]));
  return {
    semanticPlan, tools, agents, tasksById, executionTasks, toolVarNames, agentVarNames, taskVarNames,
    structuredTaskSchemas, agentToolMap, taskToolMap, taskContextMap, taskAssignments: semanticPlan.taskAssignments, agentModels, models,
    managerModel, managerLlmVar: modelVar.get(managerModel) || 'llm',
    prebuiltToolTypes: Array.from(new Set(tools.map((node) => (node.data as ToolNodeData).toolType).filter((type) => type !== 'CustomTool' && TOOL_PARAMETER_DEFINITIONS[type]))).sort(stableCompare),
    customTools: tools.flatMap((node) => customById.get(node.id) ? [customById.get(node.id)!] : []),
  };
}
