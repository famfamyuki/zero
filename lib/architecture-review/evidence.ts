import type { GraphData, AgentNodeData, TaskNodeData, ToolNodeData } from '@/types/editor';
import type { ReadinessResult, ReadinessTarget } from '@/types/readiness';
import type { ExecutionPreviewReadModel } from '@/types/execution-preview';
import type { ResourceAnalysisReadModel, ResourceAnalysisTarget } from '@/types/resource-analysis';
import { ARCHITECTURE_REVIEW_EVIDENCE_VERSION, ARCHITECTURE_REVIEW_WORKFLOW_SEMANTICS_VERSION, type ArchitectureEvidenceItemV0, type ArchitectureEvidenceSource, type ArchitectureEvidenceTargetEntryV0, type ArchitectureReviewEvidenceBundleV0 } from '@/types/architecture-review';
import { canonicalize, sha256 } from './canonicalize';

export interface ArchitectureEvidenceInput { graph: GraphData; readiness: ReadinessResult; execution: ExecutionPreviewReadModel; resources: ResourceAnalysisReadModel }
const sourceOrder: Record<ArchitectureEvidenceSource, number> = { readiness: 0, execution_preview: 1, resource_analysis: 2, workflow_semantics: 3 };
const nodeKey = (id: string) => `node:${id}`; const edgeKey = (id: string) => `edge:${id}`;
const targetKey = (target: ReadinessTarget): string => target.scope === 'graph' ? 'workflow' : target.scope === 'node' && target.nodeId ? nodeKey(target.nodeId) : target.scope === 'edge' && target.edgeId ? edgeKey(target.edgeId) : target.scope === 'field' ? `field:${target.nodeId ?? 'crew'}:${target.field ?? 'unknown'}` : target.scope;
const resourceTargetKey = (target: ResourceAnalysisTarget): string => target.type === 'crew' ? 'crew' : nodeKey(target.id);

export function createArchitectureSemanticWorkflow(graph: GraphData) {
  const nodes = [...graph.nodes].map((node) => {
    const common = { id: node.id, type: node.type };
    if (node.type === 'agent') { const d = node.data as AgentNodeData; return { ...common, label: d.label, role: d.role, goal: d.goal, backstory: d.backstory, model: d.model, verbose: d.verbose, allowDelegation: d.allowDelegation, maxIter: d.maxIter ?? null, maxRpm: d.maxRpm ?? null, maxExecutionTime: d.maxExecutionTime ?? null, respectContextWindow: d.respectContextWindow ?? null, cache: d.cache ?? null }; }
    if (node.type === 'task') { const d = node.data as TaskNodeData; return { ...common, label: d.label, description: d.description, expectedOutput: d.expectedOutput, assignedAgentId: d.assignedAgentId ?? null, asyncExecution: d.asyncExecution, outputFormat: d.outputFormat ?? 'text', outputSchema: d.outputSchema ?? null, markdown: d.markdown ?? false, humanInput: d.humanInput ?? false }; }
    const d = node.data as ToolNodeData; return { ...common, label: d.label, toolType: d.toolType, description: d.description, parameterNames: Object.keys(d.parameters ?? {}).sort() };
  }).sort((a, b) => a.id.localeCompare(b.id));
  const edges = [...graph.edges].map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle ?? null, targetHandle: edge.targetHandle ?? null })).sort((a,b) => a.id.localeCompare(b.id));
  return { version: ARCHITECTURE_REVIEW_WORKFLOW_SEMANTICS_VERSION, nodes, edges, crew: { name: graph.crewConfig.name, process: graph.crewConfig.process, memory: graph.crewConfig.memory, managerLlm: graph.crewConfig.managerLlm ?? null } };
}

export function createArchitectureWorkflowFingerprint(graph: GraphData): string {
  return `arwf_v0_${sha256(canonicalize(createArchitectureSemanticWorkflow(graph)))}`;
}

export function createArchitectureTargetRegistry(graph: GraphData): ArchitectureEvidenceTargetEntryV0[] {
  const targets: ArchitectureEvidenceTargetEntryV0[] = [{ targetKey: 'workflow', kind: 'workflow', label: 'Workflow' }, { targetKey: 'crew', kind: 'crew', label: graph.crewConfig.name || 'Crew' }];
  for (const node of [...graph.nodes].sort((a,b) => a.id.localeCompare(b.id))) targets.push({ targetKey: nodeKey(node.id), kind: 'node', nodeType: node.type as 'agent'|'task'|'tool', nodeId: node.id, label: String(node.data.label || node.id) });
  for (const edge of [...graph.edges].sort((a,b) => a.id.localeCompare(b.id))) targets.push({ targetKey: edgeKey(edge.id), kind: 'edge', edgeId: edge.id, label: `${edge.source} → ${edge.target}` });
  const fields = graph.nodes.flatMap((node) => Object.keys(node.data).map((field) => ({ targetKey: `field:${node.id}:${field}`, kind: 'field' as const, nodeType: node.type as 'agent'|'task'|'tool', nodeId: node.id, field, label: `${String(node.data.label || node.id)} · ${field}` })));
  const crewFields=Object.keys(graph.crewConfig).map((field)=>({targetKey:`field:crew:${field}`,kind:'field' as const,field,label:`Crew · ${field}`}));
  return [...targets, ...fields, ...crewFields].sort((a,b) => a.targetKey.localeCompare(b.targetKey));
}

export function createArchitectureReviewEvidence(input: ArchitectureEvidenceInput): ArchitectureReviewEvidenceBundleV0 {
  const { graph, readiness, execution, resources } = input; const targets = createArchitectureTargetRegistry(graph); const items: ArchitectureEvidenceItemV0[] = [];
  const add = (source: ArchitectureEvidenceSource, sourceVersion: string, kind: ArchitectureEvidenceItemV0['kind'], targetKeys: string[], slot: string, fact: Record<string, unknown>, summary: string, knowledgeStatus: 'Known'|'Unknown' = 'Known', deterministicFindingRef?: string) => {
    const identity = canonicalize([ARCHITECTURE_REVIEW_EVIDENCE_VERSION, source, kind, [...targetKeys].sort(), slot]);
    items.push({ evidenceId: `evi_v0_${sha256(identity).slice(0,20)}`, source, sourceVersion, kind, targetKeys: [...new Set(targetKeys)], fact, summary, knowledgeStatus, ...(deterministicFindingRef ? { deterministicFindingRef } : {}) });
  };
  add('readiness', readiness.rulesetVersion, 'workflow_summary', ['workflow'], 'readiness-summary', { status: readiness.status, evaluable: readiness.evaluable, counts: readiness.counts, blockedByValidationCodes: readiness.blockedByValidationCodes }, `Readiness: ${readiness.status}`);
  readiness.findings.forEach((finding) => add('readiness', readiness.rulesetVersion, 'readiness_finding', [targetKey(finding.target)], finding.ruleId, { ruleId: finding.ruleId, category: finding.category, impact: finding.impact, evidence: finding.evidence ?? {}, source: finding.source }, `${finding.ruleId}: ${finding.category} (${finding.impact})`, 'Known', finding.ruleId));
  add('execution_preview', execution.version, 'workflow_process', ['crew'], 'process', { process: execution.process, managerConfigured: Boolean(execution.manager) }, `Configured process: ${execution.process}`);
  add('execution_preview', execution.version, 'workflow_summary', ['workflow'], 'summary', { ...execution.summary }, `${execution.summary.agentCount} agents, ${execution.summary.taskCount} tasks, ${execution.summary.toolCount} tools`);
  execution.agents.forEach((agent) => add('execution_preview', execution.version, 'agent_configuration', [nodeKey(agent.agentId)], `agent:${agent.agentId}`, { model: agent.model, role: agent.role, toolCount: agent.tools.length }, `${agent.label} uses ${agent.model}`));
  execution.steps.forEach((step) => { const task = nodeKey(step.taskId); add('execution_preview', execution.version, 'task_execution', [task], `task:${step.taskId}`, { planOrder: step.planOrder, asyncExecution: step.asyncExecution, humanInput: step.humanInput, markdown: step.markdown }, `${step.label} is execution step ${step.planOrder}`); const assigned = step.assignment.kind === 'fixed' ? step.assignment.agent.agentId : step.assignment.configuredAgent?.agentId; add('execution_preview', execution.version, 'task_assignment', [task, ...(assigned ? [nodeKey(assigned)] : ['crew'])], `assignment:${step.taskId}`, { kind: step.assignment.kind }, `${step.label} assignment: ${step.assignment.kind}`); step.context.forEach((parent) => add('execution_preview', execution.version, 'task_context', [task, nodeKey(parent.taskId)], `context:${parent.taskId}:${step.taskId}`, {}, `${step.label} receives context from ${parent.label}`)); step.directTools.forEach((tool) => add('execution_preview', execution.version, 'tool_binding', [task, nodeKey(tool.toolId)], `task-tool:${step.taskId}:${tool.toolId}`, {}, `${tool.label} is bound directly to ${step.label}`)); if (step.outputFormat === 'json' || step.expectedOutput) add('execution_preview', execution.version, 'output_contract', [task], `output:${step.taskId}`, { outputFormat: step.outputFormat, expectedOutput: step.expectedOutput }, `${step.label} output contract is ${step.outputFormat}`); });
  add('resource_analysis', resources.version, 'resource_metric', ['workflow'], 'summary', { ...resources.summary }, `Maximum dependency depth ${resources.summary.dependencyDepth}; maximum context fan-in ${resources.summary.maxContextFanIn}`);
  resources.hotspots.forEach((hotspot, index) => add('resource_analysis', resources.version, 'resource_hotspot', [resourceTargetKey(hotspot.target)], `${hotspot.kind}:${index}`, { kind: hotspot.kind, value: hotspot.value }, `${hotspot.kind}: ${hotspot.value}`));
  resources.agentGuards.forEach((profile) => add('resource_analysis', resources.version, 'resource_guard', [nodeKey(profile.agent.agentId)], `guards:${profile.agent.agentId}`, { maxIter: profile.maxIter, maxRpm: profile.maxRpm, maxExecutionTime: profile.maxExecutionTime }, `${profile.agent.label} execution guards`));
  resources.unknowns.forEach((unknown) => add('resource_analysis', resources.version, 'resource_unknown', ['workflow'], unknown.code, { code: unknown.code }, `${unknown.code} is unknown before runtime`, 'Unknown'));
  const semantic = createArchitectureSemanticWorkflow(graph);
  add('workflow_semantics', ARCHITECTURE_REVIEW_WORKFLOW_SEMANTICS_VERSION, 'configured_semantic_text', ['crew'], 'crew', { crew: semantic.crew }, `Crew configuration: ${semantic.crew.name}`);
  semantic.nodes.forEach((node) => { const fact = { ...node }; delete (fact as Record<string, unknown>).id; delete (fact as Record<string, unknown>).type; delete (fact as Record<string, unknown>).assignedAgentId; add('workflow_semantics', ARCHITECTURE_REVIEW_WORKFLOW_SEMANTICS_VERSION, 'configured_semantic_text', [nodeKey(node.id)], `${node.type}:${node.id}`, fact, `${node.type} configuration: ${String((node as Record<string, unknown>).label ?? node.id)}`); });
  items.sort((a,b) => sourceOrder[a.source]-sourceOrder[b.source] || a.kind.localeCompare(b.kind) || (a.targetKeys[0]??'').localeCompare(b.targetKeys[0]??'') || a.evidenceId.localeCompare(b.evidenceId));
  const sourceVersions = { readiness: readiness.rulesetVersion, executionPreview: execution.version, resourceAnalysis: resources.version, workflowSemantics: ARCHITECTURE_REVIEW_WORKFLOW_SEMANTICS_VERSION } as const;
  const workflowFingerprint = createArchitectureWorkflowFingerprint(graph);
  const evidenceFingerprint = `arev_v0_${sha256(canonicalize({ version: ARCHITECTURE_REVIEW_EVIDENCE_VERSION, sourceVersions, targets, items }))}`;
  return { version: ARCHITECTURE_REVIEW_EVIDENCE_VERSION, workflowFingerprint, evidenceFingerprint, sourceVersions, targets, items };
}
