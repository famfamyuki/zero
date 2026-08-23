import type { AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import { stableCompare, type SemanticPlan } from '@/lib/transpiler/semantic-plan';
import {
  RESOURCE_ANALYSIS_READ_MODEL_VERSION,
  type ResourceAnalysisAgentRef,
  type ResourceAnalysisAssignment,
  type ResourceAnalysisModelUsage,
  type ResourceAnalysisReadModel,
  type ResourceAnalysisTaskRef,
  type ResourceAnalysisToolRef,
} from '@/types/resource-analysis';

export function createResourceAnalysisReadModel(plan: SemanticPlan): ResourceAnalysisReadModel {
  const agents = [...plan.agents].sort((a, b) => stableCompare(a.id, b.id));
  const tools = [...plan.tools].sort((a, b) => stableCompare(a.id, b.id));
  const executionTasks = [...plan.executionTasks];
  const agentsById = new Map(agents.map((node) => [node.id, node]));
  const taskOrder = new Map(executionTasks.map((node, index) => [node.id, index]));

  const agentRef = (agentId: string): ResourceAnalysisAgentRef => {
    const node = agentsById.get(agentId);
    if (!node) throw new Error(`Resource Analysis invariant violation: Agent reference "${agentId}" is missing.`);
    const data = node.data as AgentNodeData;
    return { agentId, label: String(data.label || agentId), role: String(data.role || agentId) };
  };

  const taskRef = (taskId: string): ResourceAnalysisTaskRef => {
    const planOrder = taskOrder.get(taskId);
    const node = executionTasks[planOrder ?? -1];
    if (planOrder === undefined || !node) throw new Error(`Resource Analysis invariant violation: Task reference "${taskId}" is missing.`);
    return { taskId, label: String((node.data as TaskNodeData).label || taskId), planOrder };
  };

  const toolRef = (toolId: string): ResourceAnalysisToolRef => {
    const node = tools.find((candidate) => candidate.id === toolId);
    if (!node) throw new Error(`Resource Analysis invariant violation: Tool reference "${toolId}" is missing.`);
    const data = node.data as ToolNodeData;
    return { toolId, label: String(data.label || toolId), toolType: String(data.toolType || '') };
  };

  const taskProfiles = executionTasks.map((node) => {
    const assignment = plan.taskAssignments[node.id];
    if (!assignment) throw new Error(`Resource Analysis invariant violation: Task assignment for "${node.id}" is missing.`);
    const projectedAssignment: ResourceAnalysisAssignment = assignment.kind === 'fixed'
      ? { kind: 'fixed', agent: agentRef(assignment.agentId) }
      : {
          kind: 'manager_delegated',
          ...(assignment.configuredAgentId ? { configuredAgent: agentRef(assignment.configuredAgentId) } : {}),
        };
    return {
      task: taskRef(node.id),
      assignment: projectedAssignment,
      asyncConfigured: (node.data as TaskNodeData).asyncExecution === true,
    };
  });

  const modelIds = new Set(Object.values(plan.agentModels));
  if (plan.managerModel) modelIds.add(plan.managerModel);
  const models: ResourceAnalysisModelUsage[] = Array.from(modelIds).sort(stableCompare).map((model) => {
    const modelAgents = agents
      .filter((node) => plan.agentModels[node.id] === model)
      .map((node) => agentRef(node.id));
    const usedByManager = plan.managerModel === model;
    return {
      model,
      agents: modelAgents,
      agentCount: modelAgents.length,
      usedByManager,
      referenceCount: modelAgents.length + (usedByManager ? 1 : 0),
    };
  });

  const agentGuards = agents.map((node) => {
    const guards = plan.agentExecutionGuards[node.id];
    if (!guards) throw new Error(`Resource Analysis invariant violation: Execution guards for "${node.id}" are missing.`);
    return { agent: agentRef(node.id), ...guards };
  });

  const toolBindings = tools.map((tool) => {
    const agentBindings = agents
      .filter((agent) => plan.agentToolIds[agent.id]?.includes(tool.id))
      .map((agent) => agentRef(agent.id));
    const taskBindings = executionTasks
      .filter((task) => plan.taskToolIds[task.id]?.includes(tool.id))
      .map((task) => taskRef(task.id));
    return {
      tool: toolRef(tool.id),
      agentBindings,
      taskBindings,
      agentBindingCount: agentBindings.length,
      taskBindingCount: taskBindings.length,
      totalBindingCount: agentBindings.length + taskBindings.length,
    };
  });

  return {
    version: RESOURCE_ANALYSIS_READ_MODEL_VERSION,
    process: plan.process,
    summary: {
      agentCount: plan.agents.length,
      taskCount: plan.tasksById.length,
      toolCount: plan.tools.length,
      executionStepCount: plan.executionTasks.length,
      uniqueModelCount: models.length,
      asyncTaskCount: taskProfiles.filter((task) => task.asyncConfigured).length,
      fixedAssignmentCount: taskProfiles.filter((task) => task.assignment.kind === 'fixed').length,
      managerDelegatedTaskCount: taskProfiles.filter((task) => task.assignment.kind === 'manager_delegated').length,
      agentToolBindingCount: Object.values(plan.agentToolIds).reduce((count, ids) => count + ids.length, 0),
      taskToolBindingCount: Object.values(plan.taskToolIds).reduce((count, ids) => count + ids.length, 0),
    },
    models,
    tasks: taskProfiles,
    agentGuards,
    toolBindings,
  };
}
