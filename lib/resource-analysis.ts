import type { AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import { stableCompare, type SemanticPlan } from '@/lib/transpiler/semantic-plan';
import {
  RESOURCE_ANALYSIS_READ_MODEL_VERSION,
  type ResourceAnalysisAgentRef,
  type ResourceAnalysisAssignment,
  type ResourceAnalysisHotspot,
  type ResourceAnalysisModelUsage,
  type ResourceAnalysisReadModel,
  type ResourceAnalysisTaskRef,
  type ResourceAnalysisToolRef,
  type ResourceAnalysisUnknown,
} from '@/types/resource-analysis';

const RUNTIME_UNKNOWNS: readonly ResourceAnalysisUnknown[] = [
  { code: 'runtime_cost' },
  { code: 'runtime_latency' },
  { code: 'token_consumption' },
  { code: 'tool_invocation_count' },
  { code: 'tool_execution_duration' },
  { code: 'actual_iteration_count' },
];

export function createResourceAnalysisReadModel(plan: SemanticPlan): ResourceAnalysisReadModel {
  const agents = [...plan.agents].sort((a, b) => stableCompare(a.id, b.id));
  const tools = [...plan.tools].sort((a, b) => stableCompare(a.id, b.id));
  const executionTasks = [...plan.executionTasks];
  const agentsById = new Map(agents.map((node) => [node.id, node]));
  const toolsById = new Map(tools.map((node) => [node.id, node]));
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
    const node = toolsById.get(toolId);
    if (!node) throw new Error(`Resource Analysis invariant violation: Tool reference "${toolId}" is missing.`);
    const data = node.data as ToolNodeData;
    return { toolId, label: String(data.label || toolId), toolType: String(data.toolType || '') };
  };

  const taskDepths = new Map<string, number>();
  const taskProfiles = executionTasks.map((node, index) => {
    const assignment = plan.taskAssignments[node.id];
    if (!assignment) throw new Error(`Resource Analysis invariant violation: Task assignment for "${node.id}" is missing.`);
    const contextIds = plan.taskContextIds[node.id];
    if (!contextIds) throw new Error(`Resource Analysis invariant violation: Context relation list for "${node.id}" is missing.`);
    const parentDepths = contextIds.map((parentId) => {
      const parentOrder = taskOrder.get(parentId);
      const parentDepth = taskDepths.get(parentId);
      if (parentOrder === undefined || parentOrder >= index || parentDepth === undefined) {
        throw new Error(`Resource Analysis invariant violation: Context parent "${parentId}" for "${node.id}" is not resolved before its child.`);
      }
      return parentDepth;
    });
    const dependencyDepth = parentDepths.length === 0 ? 1 : 1 + Math.max(...parentDepths);
    taskDepths.set(node.id, dependencyDepth);
    const directToolIds = plan.taskToolIds[node.id];
    if (!directToolIds) throw new Error(`Resource Analysis invariant violation: Task Tool relation list for "${node.id}" is missing.`);
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
      dependencyDepth,
      contextFanIn: contextIds.length,
      directTools: [...directToolIds].sort(stableCompare).map(toolRef),
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

  agents.forEach((agent) => {
    const toolIds = plan.agentToolIds[agent.id];
    if (!toolIds) throw new Error(`Resource Analysis invariant violation: Agent Tool relation list for "${agent.id}" is missing.`);
    toolIds.forEach(toolRef);
  });

  const toolBindings = tools.map((tool) => {
    const agentBindings = agents
      .filter((agent) => plan.agentToolIds[agent.id].includes(tool.id))
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
  }).sort((a, b) => (b.totalBindingCount - a.totalBindingCount) || stableCompare(a.tool.toolId, b.tool.toolId));

  const dependencyDepth = taskProfiles.reduce((maximum, task) => Math.max(maximum, task.dependencyDepth), 0);
  const maxContextFanIn = taskProfiles.reduce((maximum, task) => Math.max(maximum, task.contextFanIn), 0);
  const hotspots: ResourceAnalysisHotspot[] = [];
  if (dependencyDepth > 1) {
    taskProfiles.filter((task) => task.dependencyDepth === dependencyDepth).forEach((task) => {
      hotspots.push({ kind: 'dependency_depth', value: dependencyDepth, target: { type: 'task', id: task.task.taskId } });
    });
  }
  if (maxContextFanIn > 1) {
    taskProfiles.filter((task) => task.contextFanIn === maxContextFanIn).forEach((task) => {
      hotspots.push({ kind: 'context_fan_in', value: maxContextFanIn, target: { type: 'task', id: task.task.taskId } });
    });
  }
  const maxToolBindingCount = toolBindings.reduce((maximum, tool) => Math.max(maximum, tool.totalBindingCount), 0);
  if (maxToolBindingCount > 1) {
    toolBindings
      .filter((tool) => tool.totalBindingCount === maxToolBindingCount)
      .sort((a, b) => stableCompare(a.tool.toolId, b.tool.toolId))
      .forEach((tool) => {
        hotspots.push({ kind: 'tool_binding_concentration', value: maxToolBindingCount, target: { type: 'tool', id: tool.tool.toolId } });
      });
  }

  const unknowns: ResourceAnalysisUnknown[] = [
    ...RUNTIME_UNKNOWNS,
    ...(plan.process === 'hierarchical' ? [{ code: 'manager_runtime_assignment' as const }] : []),
  ];

  return {
    version: RESOURCE_ANALYSIS_READ_MODEL_VERSION,
    process: plan.process,
    summary: {
      agentCount: plan.agents.length,
      taskCount: plan.tasksById.length,
      toolCount: plan.tools.length,
      executionStepCount: plan.executionTasks.length,
      uniqueModelCount: models.length,
      dependencyDepth,
      maxContextFanIn,
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
    hotspots,
    unknowns,
    ...(plan.process === 'hierarchical' && plan.managerModel ? { manager: { model: plan.managerModel } } : {}),
  };
}
