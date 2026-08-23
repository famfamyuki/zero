import type { AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import type { SemanticPlan } from '@/lib/transpiler/semantic-plan';
import {
  EXECUTION_PREVIEW_READ_MODEL_VERSION,
  type ExecutionPreviewAgentRef,
  type ExecutionPreviewReadModel,
  type ExecutionPreviewTaskRef,
  type ExecutionPreviewToolRef,
} from '@/types/execution-preview';

export class ExecutionPreviewInvariantError extends Error {
  constructor(message: string) {
    super(`Execution Preview invariant violation: ${message}`);
    this.name = 'ExecutionPreviewInvariantError';
  }
}

export function createExecutionPreviewReadModel(plan: SemanticPlan): ExecutionPreviewReadModel {
  const agentsById = new Map(plan.agents.map((node) => [node.id, node]));
  const tasksById = new Map(plan.tasksById.map((node) => [node.id, node]));
  const toolsById = new Map(plan.tools.map((node) => [node.id, node]));

  const agentRef = (agentId: string): ExecutionPreviewAgentRef => {
    const node = agentsById.get(agentId);
    if (!node) throw new ExecutionPreviewInvariantError(`Agent reference "${agentId}" is missing.`);
    const data = node.data as AgentNodeData;
    return { agentId, label: String(data.label || agentId), role: String(data.role || agentId) };
  };

  const taskRef = (taskId: string): ExecutionPreviewTaskRef => {
    const node = tasksById.get(taskId);
    if (!node) throw new ExecutionPreviewInvariantError(`Context Task reference "${taskId}" is missing.`);
    return { taskId, label: String((node.data as TaskNodeData).label || taskId) };
  };

  const toolRef = (toolId: string): ExecutionPreviewToolRef => {
    const node = toolsById.get(toolId);
    if (!node) throw new ExecutionPreviewInvariantError(`Tool reference "${toolId}" is missing.`);
    const data = node.data as ToolNodeData;
    return { toolId, label: String(data.label || toolId), toolType: String(data.toolType || '') };
  };

  if (plan.process === 'sequential' && plan.managerModel !== undefined) {
    throw new ExecutionPreviewInvariantError('Sequential SemanticPlan unexpectedly contains a manager model.');
  }
  if (plan.process === 'hierarchical' && !plan.managerModel) {
    throw new ExecutionPreviewInvariantError('Hierarchical SemanticPlan is missing its manager model.');
  }

  const tools = plan.tools.map((node) => toolRef(node.id));
  const agents = plan.agents.map((node) => {
    const data = node.data as AgentNodeData;
    const model = plan.agentModels[node.id];
    if (!model) throw new ExecutionPreviewInvariantError(`Agent model for "${node.id}" is missing.`);
    const toolIds = plan.agentToolIds[node.id];
    if (!toolIds) throw new ExecutionPreviewInvariantError(`Agent Tool relation list for "${node.id}" is missing.`);
    return {
      ...agentRef(node.id),
      model,
      tools: toolIds.map(toolRef),
    };
  });

  const steps = plan.executionTasks.map((node, index) => {
    const taskId = node.id;
    if (!tasksById.has(taskId)) {
      throw new ExecutionPreviewInvariantError(`Execution Task "${taskId}" is missing from tasksById.`);
    }
    const assignment = plan.taskAssignments[taskId];
    if (!assignment) throw new ExecutionPreviewInvariantError(`Task assignment for "${taskId}" is missing.`);

    const projectedAssignment = assignment.kind === 'fixed'
      ? (() => {
          if (plan.process !== 'sequential') throw new ExecutionPreviewInvariantError(`Hierarchical Task "${taskId}" has a fixed assignment.`);
          return { kind: 'fixed' as const, agent: agentRef(assignment.agentId) };
        })()
      : (() => {
          if (plan.process !== 'hierarchical') throw new ExecutionPreviewInvariantError(`Sequential Task "${taskId}" has a manager-delegated assignment.`);
          return {
            kind: 'manager_delegated' as const,
            ...(assignment.configuredAgentId ? { configuredAgent: agentRef(assignment.configuredAgentId) } : {}),
          };
        })();

    const contextIds = plan.taskContextIds[taskId];
    if (!contextIds) throw new ExecutionPreviewInvariantError(`Context relation list for "${taskId}" is missing.`);
    const directToolIds = plan.taskToolIds[taskId];
    if (!directToolIds) throw new ExecutionPreviewInvariantError(`Task Tool relation list for "${taskId}" is missing.`);
    const data = node.data as TaskNodeData;

    return {
      taskId,
      label: String(data.label || taskId),
      planOrder: index + 1,
      assignment: projectedAssignment,
      context: contextIds.map(taskRef),
      directTools: directToolIds.map(toolRef),
      description: String(data.description || ''),
      expectedOutput: String(data.expectedOutput || ''),
      asyncExecution: data.asyncExecution === true,
      outputFormat: data.outputFormat === 'json' ? 'json' as const : 'text' as const,
      humanInput: data.humanInput === true,
      markdown: data.markdown === true,
      ...(typeof data.outputFile === 'string' ? { outputFile: data.outputFile } : {}),
    };
  });

  return {
    version: EXECUTION_PREVIEW_READ_MODEL_VERSION,
    process: plan.process,
    summary: { taskCount: steps.length, agentCount: agents.length, toolCount: tools.length },
    steps,
    agents,
    tools,
    ...(plan.process === 'hierarchical' ? { manager: { model: plan.managerModel! } } : {}),
  };
}
