import { z } from 'zod';

const target = z.object({ targetKey: z.string().min(1), kind: z.enum(['workflow','crew','node','edge','field']), nodeType: z.enum(['agent','task','tool']).optional(), nodeId: z.string().optional(), edgeId: z.string().optional(), field: z.string().optional(), label: z.string() }).strict();
const evidenceItem = z.object({ evidenceId: z.string().min(1), source: z.enum(['readiness','execution_preview','resource_analysis','workflow_semantics']), sourceVersion: z.string().min(1), kind: z.enum(['readiness_finding','workflow_process','workflow_summary','task_execution','task_assignment','task_context','agent_configuration','tool_binding','resource_metric','resource_hotspot','resource_guard','resource_unknown','configured_semantic_text','output_contract']), targetKeys: z.array(z.string().min(1)).min(1), fact: z.record(z.string(), z.unknown()), summary: z.string(), knowledgeStatus: z.enum(['Known','Unknown']), deterministicFindingRef: z.string().optional() }).strict();
export const architectureEvidenceSchema = z.object({ version: z.literal('0.1.0'), workflowFingerprint: z.string().regex(/^arwf_v0_[a-f0-9]{64}$/), evidenceFingerprint: z.string().regex(/^arev_v0_[a-f0-9]{64}$/), sourceVersions: z.object({ readiness: z.string(), executionPreview: z.string(), resourceAnalysis: z.string(), workflowSemantics: z.literal('0.1.0') }).strict(), targets: z.array(target), items: z.array(evidenceItem) }).strict();
const refs = z.array(z.string().min(1));
export const architectureReviewerDraftSchema = z.object({
  version: z.literal('0.1.0'),
  intent: z.object({ summary: z.string(), knowledgeStatus: z.enum(['Inferred','Unknown']), evidenceRefs: refs.min(1), assumptions: z.array(z.string()) }).strict(),
  strengths: z.array(z.object({ statement: z.string(), whyItHelps: z.string(), knowledgeStatus: z.literal('Inferred'), evidenceRefs: refs.min(1), targetRefs: refs.min(1) }).strict()).max(3),
  findings: z.array(z.object({ class: z.enum(['Heuristic','External-dependent']), priority: z.enum(['High','Medium','Low']), knowledgeStatus: z.enum(['Inferred','Unknown']), problem: z.string(), why: z.string(), recommendation: z.string(), expectedEffect: z.string(), evidenceRefs: refs.min(1), targetRefs: refs.min(1), assumptions: z.array(z.string()), tradeOffs: z.array(z.string()), confidence: z.number().min(0).max(1).nullable() }).strict()).max(5),
  recommendedDirection: z.string(),
  uncertainties: z.array(z.object({ knowledgeStatus: z.literal('Unknown'), statement: z.string(), evidenceRefs: refs.min(1), targetRefs: refs.min(1) }).strict()).max(5),
}).strict();
export const architectureReviewRequestSchema = z.object({ version: z.literal('0.1.0'), locale: z.enum(['en','ja']), evidence: architectureEvidenceSchema }).strict();
