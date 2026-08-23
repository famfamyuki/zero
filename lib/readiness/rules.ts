import type { TaskNodeData, ToolNodeData, ValidationCode, ValidationIssue } from '@/types/editor';
import type { ReadinessCategory, ReadinessEvidence, ReadinessEvidenceValue, ReadinessFindingDraft, ReadinessImpact, ReadinessRuleId, ReadinessTarget } from '@/types/readiness';
import type { ReadinessRuleContext } from './context';
import { stableCompare } from './context';

export interface ReadinessRule {
  readonly id: ReadinessRuleId;
  readonly category: ReadinessCategory;
  readonly impact: ReadinessImpact;
  readonly titleKey: string;
  readonly explanationKey: string;
  readonly suggestionKey?: string;
  isApplicable(context: ReadinessRuleContext): boolean;
  evaluate(context: ReadinessRuleContext): readonly ReadinessFindingDraft[];
}

const targetFromIssue = (issue: ValidationIssue): ReadinessTarget => issue.nodeId
  ? { scope: issue.field ? 'field' : 'node', nodeId: issue.nodeId, ...(issue.field ? { field: issue.field } : {}) }
  : issue.edgeId ? { scope: 'edge', edgeId: issue.edgeId }
    : issue.field ? { scope: 'field', field: issue.field } : { scope: 'graph' };

const isEvidenceValue = (value: unknown): value is ReadinessEvidenceValue => value === null || ['string', 'number', 'boolean'].includes(typeof value)
  || (Array.isArray(value) && value.every((item) => typeof item === 'string' || typeof item === 'number'));
const evidenceFromIssue = (issue: ValidationIssue): ReadinessEvidence | undefined => {
  if (!issue.details) return undefined;
  const entries = Object.entries(issue.details).filter((entry): entry is [string, ReadinessEvidenceValue] => isEvidenceValue(entry[1]));
  return entries.length === Object.keys(issue.details).length ? Object.fromEntries(entries) : undefined;
};
const validationDrafts = (context: ReadinessRuleContext, validationCode: ValidationCode): ReadinessFindingDraft[] =>
  [...(context.validationIssuesByCode.get(validationCode) || [])].map((issue) => {
    const evidence = evidenceFromIssue(issue);
    return { target: targetFromIssue(issue), ...(evidence ? { evidence } : {}), source: { kind: 'validation', validationCode } };
  });

const nativeSource = { kind: 'readiness_rule' } as const;
const define = (rule: ReadinessRule): ReadinessRule => rule;

export const READINESS_RULES: readonly ReadinessRule[] = [
  define({ id: 'RDY_CREW_NAME_EMPTY', category: 'maintainability', impact: 'low', titleKey: 'readiness.crewNameEmpty.title', explanationKey: 'readiness.crewNameEmpty.explanation', suggestionKey: 'readiness.crewNameEmpty.suggestion', isApplicable: ({ graph }) => graph.crewConfig.name.trim() === '', evaluate: () => [{ target: { scope: 'field', field: 'name' }, source: nativeSource }] }),
  define({ id: 'RDY_NODE_LABEL_EMPTY', category: 'maintainability', impact: 'low', titleKey: 'readiness.nodeLabelEmpty.title', explanationKey: 'readiness.nodeLabelEmpty.explanation', suggestionKey: 'readiness.nodeLabelEmpty.suggestion', isApplicable: () => true, evaluate: ({ agents, tasks, tools }) => [...agents, ...tasks, ...tools].filter((node) => typeof node.data.label !== 'string' || !node.data.label.trim()).map((node) => ({ target: { scope: 'field', nodeId: node.id, field: 'label' }, source: nativeSource })) }),
  define({ id: 'RDY_AGENT_UNUSED', category: 'workflow_structure', impact: 'medium', titleKey: 'readiness.agentUnused.title', explanationKey: 'readiness.agentUnused.explanation', suggestionKey: 'readiness.agentUnused.suggestion', isApplicable: ({ graph }) => graph.crewConfig.process === 'sequential', evaluate: (context) => validationDrafts(context, 'UNUSED_AGENT') }),
  define({ id: 'RDY_TOOL_UNUSED', category: 'tooling', impact: 'medium', titleKey: 'readiness.toolUnused.title', explanationKey: 'readiness.toolUnused.explanation', suggestionKey: 'readiness.toolUnused.suggestion', isApplicable: () => true, evaluate: (context) => validationDrafts(context, 'UNUSED_TOOL') }),
  define({ id: 'RDY_DUPLICATE_SEMANTIC_EDGE', category: 'workflow_structure', impact: 'low', titleKey: 'readiness.duplicateSemanticEdge.title', explanationKey: 'readiness.duplicateSemanticEdge.explanation', suggestionKey: 'readiness.duplicateSemanticEdge.suggestion', isApplicable: () => true, evaluate: (context) => validationDrafts(context, 'DUPLICATE_SEMANTIC_EDGE') }),
  define({ id: 'RDY_LEGACY_TASK_AGENT_EDGE', category: 'maintainability', impact: 'low', titleKey: 'readiness.legacyTaskAgentEdge.title', explanationKey: 'readiness.legacyTaskAgentEdge.explanation', suggestionKey: 'readiness.legacyTaskAgentEdge.suggestion', isApplicable: () => true, evaluate: ({ edges, nodesById }) => edges.filter((edge) => nodesById.get(edge.source)?.type === 'task' && nodesById.get(edge.target)?.type === 'agent').map((edge) => ({ target: { scope: 'edge', edgeId: edge.id }, evidence: { taskId: edge.source, agentId: edge.target }, source: nativeSource })) }),
  define({ id: 'RDY_REDUNDANT_AGENT_ASSIGNMENT', category: 'maintainability', impact: 'low', titleKey: 'readiness.redundantAgentAssignment.title', explanationKey: 'readiness.redundantAgentAssignment.explanation', suggestionKey: 'readiness.redundantAgentAssignment.suggestion', isApplicable: ({ graph }) => graph.crewConfig.process === 'sequential', evaluate: ({ assignmentChannelsByTask }) => {
    const drafts: ReadinessFindingDraft[] = [];
    assignmentChannelsByTask.forEach((byAgent, taskId) => byAgent.forEach((channels, agentId) => {
      if (channels.size >= 2) drafts.push({ target: { scope: 'node', nodeId: taskId }, evidence: { agentId, channels: [...channels].sort(stableCompare) }, source: nativeSource });
    }));
    return drafts;
  } }),
  define({ id: 'RDY_HIERARCHICAL_MANAGER_IMPLICIT', category: 'execution_configuration', impact: 'medium', titleKey: 'readiness.hierarchicalManagerImplicit.title', explanationKey: 'readiness.hierarchicalManagerImplicit.explanation', suggestionKey: 'readiness.hierarchicalManagerImplicit.suggestion', isApplicable: ({ graph }) => graph.crewConfig.process === 'hierarchical' && (typeof graph.crewConfig.managerLlm !== 'string' || !graph.crewConfig.managerLlm.trim()), evaluate: () => [{ target: { scope: 'field', field: 'managerLlm' }, source: nativeSource }] }),
  define({ id: 'RDY_HIERARCHICAL_ASSIGNMENT_IGNORED', category: 'execution_configuration', impact: 'high', titleKey: 'readiness.hierarchicalAssignmentIgnored.title', explanationKey: 'readiness.hierarchicalAssignmentIgnored.explanation', suggestionKey: 'readiness.hierarchicalAssignmentIgnored.suggestion', isApplicable: ({ graph }) => graph.crewConfig.process === 'hierarchical', evaluate: ({ assignmentChannelsByTask }) => {
    const drafts: ReadinessFindingDraft[] = [];
    assignmentChannelsByTask.forEach((byAgent, taskId) => { if (byAgent.size > 0) drafts.push({ target: { scope: 'node', nodeId: taskId }, evidence: { agentIds: [...byAgent.keys()].sort(stableCompare) }, source: nativeSource }); });
    return drafts;
  } }),
  define({ id: 'RDY_CUSTOM_MODEL_UNVERIFIED', category: 'execution_configuration', impact: 'info', titleKey: 'readiness.customModelUnverified.title', explanationKey: 'readiness.customModelUnverified.explanation', suggestionKey: 'readiness.customModelUnverified.suggestion', isApplicable: () => true, evaluate: (context) => validationDrafts(context, 'MODEL_ID_UNVERIFIED') }),
  define({ id: 'RDY_CUSTOM_TOOL_STUB', category: 'tooling', impact: 'high', titleKey: 'readiness.customToolStub.title', explanationKey: 'readiness.customToolStub.explanation', suggestionKey: 'readiness.customToolStub.suggestion', isApplicable: () => true, evaluate: ({ tools }) => tools.filter((tool) => (tool.data as ToolNodeData).toolType === 'CustomTool').map((tool) => ({ target: { scope: 'node', nodeId: tool.id }, source: nativeSource })) }),
  define({ id: 'RDY_JSON_OUTPUT_SCHEMA_IMPLICIT', category: 'output_contract', impact: 'medium', titleKey: 'readiness.jsonOutputSchemaImplicit.title', explanationKey: 'readiness.jsonOutputSchemaImplicit.explanation', suggestionKey: 'readiness.jsonOutputSchemaImplicit.suggestion', isApplicable: () => true, evaluate: ({ tasks }) => tasks.filter((task) => { const data = task.data as TaskNodeData; return data.outputFormat === 'json' && (typeof data.outputSchema !== 'string' || !data.outputSchema.trim()); }).map((task) => ({ target: { scope: 'field', nodeId: task.id, field: 'outputSchema' }, source: nativeSource })) }),
  define({ id: 'RDY_STRUCTURED_OUTPUT_MISMATCH', category: 'output_contract', impact: 'medium', titleKey: 'readiness.structuredOutputMismatch.title', explanationKey: 'readiness.structuredOutputMismatch.explanation', suggestionKey: 'readiness.structuredOutputMismatch.suggestion', isApplicable: () => true, evaluate: (context) => validationDrafts(context, 'STRUCTURED_OUTPUT_NOT_ENABLED') }),
  define({ id: 'RDY_OUTPUT_FILE_COLLISION', category: 'output_contract', impact: 'medium', titleKey: 'readiness.outputFileCollision.title', explanationKey: 'readiness.outputFileCollision.explanation', suggestionKey: 'readiness.outputFileCollision.suggestion', isApplicable: () => true, evaluate: ({ outputFileTasks }) => {
    const drafts: ReadinessFindingDraft[] = [];
    outputFileTasks.forEach((tasks, outputFile) => { if (tasks.length >= 2) drafts.push({ target: { scope: 'field', nodeId: tasks[0].id, field: 'outputFile' }, evidence: { taskIds: tasks.map((task) => task.id), outputFile }, source: nativeSource }); });
    return drafts;
  } }),
  define({ id: 'RDY_SAFETY_CLAIM_UNENFORCED', category: 'execution_configuration', impact: 'high', titleKey: 'readiness.safetyClaimUnenforced.title', explanationKey: 'readiness.safetyClaimUnenforced.explanation', suggestionKey: 'readiness.safetyClaimUnenforced.suggestion', isApplicable: () => true, evaluate: (context) => validationDrafts(context, 'UNENFORCED_SAFETY_CLAIM') }),
] as const;
