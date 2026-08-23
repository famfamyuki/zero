import { CustomNode, AgentNodeData, TaskNodeData, ToolNodeData, CrewConfig, ValidationError, ValidationWarning, ValidationResult, ExportMode } from '@/types/editor';
import { Edge } from '@xyflow/react';
import { parseOutputSchema } from './output-schema';
import { getToolParameterDefinitions, isSupportedToolType } from '@/lib/tool-config';

const stableCompare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;

export function toPythonIdentifier(str: string, fallback: string): string {
  const clean = (str || '').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  const valid = clean.replace(/^[^a-zA-Z_]+/, '');
  return valid || fallback;
}

export function toPythonClassName(str: string, fallback: string): string {
  const words = (str || '').replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/);
  const pascal = words
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  const valid = pascal.replace(/^[^a-zA-Z]+/, '');
  return valid ? `${valid}Tool` : `${fallback}Tool`;
}

export function extractInputVariables(nodes: CustomNode[], crewConfig?: CrewConfig): string[] {
  const variables = new Set<string>();
  const regex = /\{([a-zA-Z0-9_]+)\}/g;

  const checkText = (text?: string) => {
    if (!text) return;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const varName = match[1];
      if (varName && !['index', 'idx'].includes(varName.toLowerCase())) {
        variables.add(varName);
      }
    }
  };

  (nodes || []).forEach((node) => {
    if (node.type === 'task') {
      const data = node.data as TaskNodeData;
      checkText(data.description);
      checkText(data.expectedOutput);
      checkText(data.label);
    } else if (node.type === 'agent') {
      const data = node.data as AgentNodeData;
      checkText(data.role);
      checkText(data.goal);
      checkText(data.backstory);
    } else if (node.type === 'tool') {
      const data = node.data as ToolNodeData;
      Object.values(data.parameters || {}).forEach((value) => checkText(value));
    }
  });

  if (crewConfig?.name) {
    checkText(crewConfig.name);
  }

  return Array.from(variables).sort();
}

export function validateGraph(
  nodes: CustomNode[] = [],
  edges: Edge[] = [],
  crewConfig: CrewConfig = { name: 'My Crew', process: 'sequential', verbose: true, memory: false },
  mode: ExportMode = 'scaffold'
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const nodeMap = new Map<string, CustomNode>();
  const duplicateNodeIds = new Set<string>();
  (nodes || []).forEach((node) => {
    if (!node?.id) return;
    if (nodeMap.has(node.id)) {
      duplicateNodeIds.add(node.id);
    } else {
      nodeMap.set(node.id, node);
    }
  });

  if (duplicateNodeIds.size > 0) {
    duplicateNodeIds.forEach((id) => {
      errors.push({
        code: 'DUPLICATE_NODE_ID',
        message: `Duplicate Node ID found: "${id}". Node IDs must be globally unique.`,
        nodeId: id,
      });
    });
  }

  const edgeMap = new Set<string>();
  const duplicateEdgeIds = new Set<string>();
  (edges || []).forEach((edge) => {
    if (!edge?.id) return;
    if (edgeMap.has(edge.id)) {
      duplicateEdgeIds.add(edge.id);
    } else {
      edgeMap.add(edge.id);
    }
  });

  if (duplicateEdgeIds.size > 0) {
    duplicateEdgeIds.forEach((id) => {
      errors.push({
        code: 'DUPLICATE_EDGE_ID',
        message: `Duplicate Edge ID found: "${id}". Edge IDs must be unique.`,
        edgeId: id,
      });
    });
  }

  const agentNodes = (nodes || []).filter((n) => n?.type === 'agent');
  const taskNodes = (nodes || []).filter((n) => n?.type === 'task');
  const toolNodes = (nodes || []).filter((n) => n?.type === 'tool');

  toolNodes.forEach((toolNode) => {
    const data = (toolNode.data || {}) as Partial<ToolNodeData>;
    if (!data.toolType) {
      errors.push({
        code: 'MISSING_TOOL_TYPE',
        message: `Tool "${data.label || toolNode.id}" (${toolNode.id}) has no tool type selected.`,
        nodeId: toolNode.id,
        suggestion: 'Choose a Tool Type in the inspector before exporting.',
      });
    } else if (!isSupportedToolType(String(data.toolType))) {
      errors.push({
        code: 'UNSUPPORTED_TOOL_TYPE',
        message: `Tool "${data.label || toolNode.id}" (${toolNode.id}) uses unsupported tool type "${data.toolType}".`,
        nodeId: toolNode.id,
        suggestion: 'Choose a supported Tool Type before exporting.',
      });
    }
    const allowedParameters = new Set(getToolParameterDefinitions(data.toolType).map((parameter) => parameter.key));
    Object.keys(data.parameters || {}).forEach((key) => {
      if (!allowedParameters.has(key)) {
        errors.push({
          code: 'UNSUPPORTED_TOOL_PARAMETER',
          message: `Tool "${data.label || toolNode.id}" contains unsupported parameter "${key}".`,
          nodeId: toolNode.id,
          suggestion: 'Remove the unsupported parameter or reselect the Tool Type to reset its configuration.',
        });
      }
    });
  });

  if (agentNodes.length === 0) {
    errors.push({
      code: 'NO_AGENTS',
      message: 'The workflow must contain at least one Agent.',
      suggestion: 'Add an Agent and connect it to a Task before exporting.',
    });
  }

  if (taskNodes.length === 0) {
    errors.push({
      code: 'NO_TASKS',
      message: 'The workflow must contain at least one Task.',
      suggestion: 'Add a Task and assign exactly one Agent before exporting.',
    });
  }

  // Check Dangling Edges
  (edges || []).forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) {
      errors.push({
        code: 'DANGLING_EDGE',
        message: `Edge "${edge.id}" connects non-existent node (source: "${edge.source}", target: "${edge.target}").`,
        edgeId: edge.id,
        details: `Source exists: ${!!sourceNode}, Target exists: ${!!targetNode}`,
      });
      return;
    }

    const supported =
      (sourceNode.type === 'agent' && targetNode.type === 'task') ||
      (sourceNode.type === 'task' && targetNode.type === 'agent') ||
      (sourceNode.type === 'tool' && targetNode.type === 'agent') ||
      (sourceNode.type === 'tool' && targetNode.type === 'task') ||
      (sourceNode.type === 'task' && targetNode.type === 'task');

    if (!supported) {
      errors.push({
        code: 'UNSUPPORTED_EDGE',
        message: `Edge "${edge.id}" uses unsupported direction ${sourceNode.type} → ${targetNode.type}.`,
        edgeId: edge.id,
        suggestion: 'Use Agent → Task for ownership, Tool → Agent/Task for tools, or Task → Task for dependencies.',
      });
    }
  });

  // Agent Assignment Mapping & Detection of Multiple Agents per Task
  const taskAssignedAgents: Record<string, Set<string>> = {};
  const agentConnectedTools = new Set<string>();
  const agentAssignedTasks = new Set<string>();
  taskNodes.forEach((t) => {
    taskAssignedAgents[t.id] = new Set<string>();
    const tData = (t.data || {}) as TaskNodeData;
    if (tData.assignedAgentId) {
      const assignedNode = nodeMap.get(tData.assignedAgentId);
      if (!assignedNode || assignedNode.type !== 'agent') {
        errors.push({
          code: 'INVALID_ASSIGNED_AGENT_REFERENCE',
          message: `Task "${tData.label || t.id}" (${t.id}) references invalid assigned Agent "${tData.assignedAgentId}".`,
          nodeId: t.id,
          suggestion: 'Select an existing Agent or clear the assigned Agent reference.',
        });
      } else {
        taskAssignedAgents[t.id].add(tData.assignedAgentId);
        agentAssignedTasks.add(tData.assignedAgentId);
      }
    }
  });

  (edges || []).forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode) return;

    // Agent -> Task or Task -> Agent
    if (sourceNode.type === 'agent' && targetNode.type === 'task') {
      taskAssignedAgents[targetNode.id].add(sourceNode.id);
      agentAssignedTasks.add(sourceNode.id);
    } else if (sourceNode.type === 'task' && targetNode.type === 'agent') {
      taskAssignedAgents[sourceNode.id].add(targetNode.id);
      agentAssignedTasks.add(targetNode.id);
    }
    // Tool -> Agent
    else if (sourceNode.type === 'tool' && targetNode.type === 'agent') {
      agentConnectedTools.add(targetNode.id);
    }
  });

  const taskAgentMap: Record<string, string> = {};

  taskNodes.forEach((tNode) => {
    const assigned = Array.from(taskAssignedAgents[tNode.id] || []).sort(stableCompare);
    const tData = (tNode.data || {}) as TaskNodeData;
    const taskLabel = tData.label || tNode.id;

    if (tData.outputFormat === 'json' && tData.outputSchema?.trim()) {
      try {
        parseOutputSchema(tData.outputSchema);
      } catch (error) {
        errors.push({
          code: 'INVALID_OUTPUT_SCHEMA',
          message: `Task "${taskLabel}" has an invalid JSON output schema: ${error instanceof Error ? error.message : 'Unknown schema error'}`,
          nodeId: tNode.id,
          suggestion: 'Use a JSON object such as {"summary":"string","score":"number"}.',
        });
      }
    }

    if (assigned.length > 1) {
      const agentNames = assigned
        .map((aId) => {
          const a = nodeMap.get(aId);
          const aData = (a?.data || {}) as AgentNodeData;
          return `"${aData.role || aData.label || aId}" (${aId})`;
        })
        .join(', ');

      errors.push({
        code: 'MULTIPLE_AGENTS_PER_TASK',
        message: `Task "${taskLabel}" (${tNode.id}) has ${assigned.length} assigned agents: ${agentNames}. In standard CrewAI, each Task must have exactly one primary assigned agent.`,
        nodeId: tNode.id,
        details: `Connected agents: ${agentNames}`,
        suggestion: `Keep one primary agent for "${taskLabel}", or split it into ${assigned.length} agent-owned tasks. Connect their outputs to a later synthesis task with Task → Task edges.`,
      });
    } else if (assigned.length === 1) {
      taskAgentMap[tNode.id] = assigned[0];
    } else {
      // 0 assigned agents
      if (crewConfig?.process === 'sequential') {
        errors.push({
          code: 'UNASSIGNED_TASK',
          message: `Task "${taskLabel}" (${tNode.id}) has no assigned agent. Please connect an Agent to this Task.`,
          nodeId: tNode.id,
          suggestion: `Connect exactly one Agent to "${taskLabel}" with an Agent → Task edge.`,
        });
      } else {
        warnings.push({
          code: 'UNASSIGNED_TASK_HIERARCHICAL',
          message: `Task "${taskLabel}" (${tNode.id}) has no explicit agent assigned. Manager LLM will delegate this task dynamically.`,
          nodeId: tNode.id,
        });
      }
    }
  });

  // Check unused agents & agents without tools
  agentNodes.forEach((aNode) => {
    const aData = (aNode.data || {}) as AgentNodeData;
    const agentLabel = aData.role || aData.label || aNode.id;

    if (!agentAssignedTasks.has(aNode.id)) {
      // If sequential, unused agent is a strong warning
      warnings.push({
        code: 'UNUSED_AGENT',
        message: `Agent "${agentLabel}" (${aNode.id}) is not assigned to any task in the workflow.`,
        nodeId: aNode.id,
      });
    }

    if (!agentConnectedTools.has(aNode.id)) {
      warnings.push({
        code: 'AGENT_WITHOUT_TOOLS',
        message: `Agent "${agentLabel}" (${aNode.id}) has no tools attached. The agent will rely solely on LLM knowledge.`,
        nodeId: aNode.id,
      });
    }
  });

  // Task Dependencies & Cycle Detection (Kahn's Algorithm)
  const taskPredecessors: Record<string, Set<string>> = {};
  const taskSuccessors: Record<string, Set<string>> = {};
  const inDegree: Record<string, number> = {};

  taskNodes.forEach((t) => {
    taskPredecessors[t.id] = new Set<string>();
    taskSuccessors[t.id] = new Set<string>();
    inDegree[t.id] = 0;
  });

  (edges || []).forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    if (!sourceNode || !targetNode) return;

    if (sourceNode.type === 'task' && targetNode.type === 'task') {
      // source -> target means target depends on source (source is predecessor of target)
      if (sourceNode.id === targetNode.id) {
        errors.push({
          code: 'TASK_SELF_CYCLE',
          message: `Task "${(sourceNode.data as TaskNodeData)?.label || sourceNode.id}" has a dependency on itself.`,
          nodeId: sourceNode.id,
          edgeId: edge.id,
        });
      } else {
        if (!taskPredecessors[targetNode.id].has(sourceNode.id)) {
          taskPredecessors[targetNode.id].add(sourceNode.id);
          taskSuccessors[sourceNode.id].add(targetNode.id);
          inDegree[targetNode.id] = (inDegree[targetNode.id] || 0) + 1;
        }
      }
    }
  });

  // Topological Sort (Kahn's algorithm)
  // Queue tasks with inDegree === 0, sorted by original Y position or order
  const getTaskY = (id: string) => {
    const value = nodeMap.get(id)?.position?.y;
    return Number.isFinite(value) ? Number(value) : 0;
  };
  const compareTasks = (a: string, b: string) => (getTaskY(a) - getTaskY(b)) || stableCompare(a, b);
  const queue: string[] = taskNodes
    .filter((t) => inDegree[t.id] === 0)
    .map((t) => t.id)
    .sort(compareTasks);

  const sortedTaskIds: string[] = [];

  while (queue.length > 0) {
    const currId = queue.shift()!;
    sortedTaskIds.push(currId);

    const successors = Array.from(taskSuccessors[currId] || []).sort(compareTasks);

    successors.forEach((nextId) => {
      inDegree[nextId]--;
      if (inDegree[nextId] === 0) {
        queue.push(nextId);
        queue.sort(compareTasks);
      }
    });
  }

  if (sortedTaskIds.length < taskNodes.length) {
    const cyclicTaskIds = taskNodes.filter((t) => !sortedTaskIds.includes(t.id)).map((t) => t.id);
    const cyclicTaskNames = cyclicTaskIds.map((id) => {
      const t = nodeMap.get(id);
      return `"${(t?.data as TaskNodeData)?.label || id}" (${id})`;
    });

    errors.push({
      code: 'TASK_CYCLE_DETECTED',
      message: `Cyclic dependency detected among tasks: ${cyclicTaskNames.join(', ')}. Tasks cannot have circular dependencies in CrewAI.`,
      details: `Involved task IDs: ${cyclicTaskIds.join(', ')}`,
      suggestion: 'Remove at least one Task → Task edge so every task dependency flows in one direction.',
    });
  }

  const taskContextMap: Record<string, string[]> = {};
  taskNodes.forEach((t) => {
    taskContextMap[t.id] = Array.from(taskPredecessors[t.id] || []).sort(stableCompare);
  });

  // Custom Tools Check
  const customTools: {
    id: string;
    varName: string;
    className: string;
    label: string;
    description: string;
  }[] = [];

  const usedCustomClassNames = new Set<string>();
  [...toolNodes].sort((a, b) => stableCompare(a.id, b.id)).forEach((tNode, idx) => {
    const data = (tNode.data || {}) as ToolNodeData;
    if (data.toolType === 'CustomTool') {
      const baseName = toPythonIdentifier(data.label || '', 'tool');
      const classBase = toPythonClassName(data.label, `CustomTool${idx + 1}`);
      let className = classBase;
      let classSuffix = 2;
      while (usedCustomClassNames.has(className)) className = `${classBase}${classSuffix++}`;
      usedCustomClassNames.add(className);
      const varName = `${baseName}_${idx + 1}`;
      customTools.push({
        id: tNode.id,
        varName,
        className,
        label: data.label || 'Custom Tool',
        description: data.description || 'Custom tool functionality',
      });
    }
  });

  if (mode === 'production' && customTools.length > 0) {
    const toolNames = customTools.map((t) => `"${t.label}" (${t.id})`).join(', ');
    errors.push({
      code: 'UNIMPLEMENTED_CUSTOM_TOOLS_IN_PRODUCTION',
      message: `Production export blocked: Graph contains ${customTools.length} unimplemented Custom Tool(s): ${toolNames}. Switch to "Scaffold Export" or implement tools before production release.`,
      suggestion: 'Use Scaffold Mode to export safe BaseTool stubs, then implement each tool before switching to Production Mode.',
    });
  }

  // Structured Output & Safety Warnings Check
  taskNodes.forEach((tNode) => {
    const data = (tNode.data || {}) as TaskNodeData;
    const taskLabel = data.label || tNode.id;
    const expOut = (data.expectedOutput || '').toLowerCase();
    const desc = (data.description || '').toLowerCase();

    const structuredKeywords = ['json', 'schema', 'pydantic', 'machine-readable', 'format: json'];
    const hasStructuredReq = structuredKeywords.some((kw) => expOut.includes(kw));

    if (hasStructuredReq && data.outputFormat !== 'json') {
      warnings.push({
        code: 'STRUCTURED_OUTPUT_NOT_ENABLED',
        message: `Task "${taskLabel}" asks for JSON/schema output but its output format is not set to JSON.`,
        nodeId: tNode.id,
      });
    }

    const safetyKeywords = ['sandbox', 'read-only', 'network disabled', 'isolated', 'sandbox environment'];
    const matchedSafety = safetyKeywords.filter((kw) => desc.includes(kw) || expOut.includes(kw));
    if (matchedSafety.length > 0) {
      warnings.push({
        code: 'UNENFORCED_SAFETY_CLAIM',
        message: `Task "${taskLabel}" mentions safety constraints (${matchedSafety.map((s) => `"${s}"`).join(', ')}), but no runtime isolation/sandboxing is enforced in the generated code. Ensure execution security in your deployment environment.`,
        nodeId: tNode.id,
      });
    }
  });

  // Extract template input variables ({repository_path}, {output_directory}, etc.)
  const inputVariables = extractInputVariables(nodes, crewConfig);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    inputVariables,
    customTools,
    sortedTaskIds: sortedTaskIds.length === taskNodes.length ? sortedTaskIds : taskNodes.map((t) => t.id),
    taskAgentMap,
    taskContextMap,
  };
}
