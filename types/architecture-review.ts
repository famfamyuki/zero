export const ARCHITECTURE_REVIEW_EVIDENCE_VERSION = '0.1.0' as const;
export const ARCHITECTURE_REVIEW_WORKFLOW_SEMANTICS_VERSION = '0.1.0' as const;
export const ARCHITECTURE_REVIEW_RESULT_VERSION = '0.1.0' as const;
export const ARCHITECTURE_REVIEWER_VERSION = '0.1.0' as const;
export const ARCHITECTURE_REVIEW_PROMPT_VERSION = '0.1.1' as const;
export const ARCHITECTURE_REVIEW_API_VERSION = '0.1.0' as const;

export type KnowledgeStatus = 'Known' | 'Inferred' | 'Unknown';
export type ArchitectureEvidenceSource = 'readiness' | 'execution_preview' | 'resource_analysis' | 'workflow_semantics';
export type ArchitectureEvidenceKind = 'readiness_finding' | 'workflow_process' | 'workflow_summary' | 'task_execution' | 'task_assignment' | 'task_context' | 'agent_configuration' | 'tool_binding' | 'resource_metric' | 'resource_hotspot' | 'resource_guard' | 'resource_unknown' | 'configured_semantic_text' | 'output_contract';
export type ArchitectureEvidenceTargetKind = 'workflow' | 'crew' | 'node' | 'edge' | 'field';

export interface ArchitectureEvidenceTargetEntryV0 {
  readonly targetKey: string;
  readonly kind: ArchitectureEvidenceTargetKind;
  readonly nodeType?: 'agent' | 'task' | 'tool';
  readonly nodeId?: string;
  readonly edgeId?: string;
  readonly field?: string;
  readonly label: string;
}

export interface ArchitectureEvidenceItemV0 {
  readonly evidenceId: string;
  readonly source: ArchitectureEvidenceSource;
  readonly sourceVersion: string;
  readonly kind: ArchitectureEvidenceKind;
  readonly targetKeys: readonly string[];
  readonly fact: Readonly<Record<string, unknown>>;
  readonly summary: string;
  readonly knowledgeStatus: 'Known' | 'Unknown';
  readonly deterministicFindingRef?: string;
}

export interface ArchitectureReviewEvidenceBundleV0 {
  readonly version: typeof ARCHITECTURE_REVIEW_EVIDENCE_VERSION;
  readonly workflowFingerprint: string;
  readonly evidenceFingerprint: string;
  readonly sourceVersions: { readonly readiness: string; readonly executionPreview: string; readonly resourceAnalysis: string; readonly workflowSemantics: typeof ARCHITECTURE_REVIEW_WORKFLOW_SEMANTICS_VERSION };
  readonly targets: readonly ArchitectureEvidenceTargetEntryV0[];
  readonly items: readonly ArchitectureEvidenceItemV0[];
}

export type ArchitectureFindingClass = 'Deterministic' | 'Heuristic' | 'External-dependent';
export type ArchitectureReviewErrorCode = 'invalid_request' | 'unsupported_contract_version' | 'invalid_evidence' | 'input_too_large' | 'review_unavailable' | 'rate_limited' | 'provider_timeout' | 'provider_error' | 'invalid_reviewer_output'
  | 'authentication_required' | 'paid_entitlement_required' | 'billing_inactive' | 'entitlement_unavailable'
  | 'quota_exhausted' | 'review_in_progress' | 'review_already_completed' | 'review_attempt_closed'
  | 'idempotency_key_required' | 'invalid_idempotency_key' | 'request_cost_limit_exceeded'
  | 'accounting_unavailable' | 'review_disabled';
export type ArchitectureReviewLocale = 'en' | 'ja';

export interface ArchitectureReviewerDraftV0 {
  version: '0.1.0';
  intent: { summary: string; knowledgeStatus: 'Inferred' | 'Unknown'; evidenceRefs: string[]; assumptions: string[] };
  strengths: Array<{ statement: string; whyItHelps: string; knowledgeStatus: 'Inferred'; evidenceRefs: string[]; targetRefs: string[] }>;
  findings: Array<{ class: 'Heuristic' | 'External-dependent'; priority: 'High' | 'Medium' | 'Low'; knowledgeStatus: 'Inferred' | 'Unknown'; problem: string; why: string; recommendation: string; expectedEffect: string; evidenceRefs: string[]; targetRefs: string[]; assumptions: string[]; tradeOffs: string[]; confidence: number | null }>;
  recommendedDirection: string;
  uncertainties: Array<{ knowledgeStatus: 'Unknown'; statement: string; evidenceRefs: string[]; targetRefs: string[] }>;
}

export interface ArchitectureReviewResultV0 {
  readonly version: typeof ARCHITECTURE_REVIEW_RESULT_VERSION;
  readonly workflowFingerprint: string;
  readonly evidenceFingerprint: string;
  readonly intent: ArchitectureReviewerDraftV0['intent'];
  readonly strengths: ReadonlyArray<ArchitectureReviewerDraftV0['strengths'][number] & { id: string }>;
  readonly findings: ReadonlyArray<ArchitectureReviewerDraftV0['findings'][number] & { id: string }>;
  readonly recommendedDirection: string;
  readonly uncertainties: ReadonlyArray<ArchitectureReviewerDraftV0['uncertainties'][number] & { id: string }>;
  readonly limitations: readonly ['intent_not_explicit', 'no_runtime_evidence', 'no_external_verification', 'heuristic_review'];
  readonly reviewer: { reviewerVersion: typeof ARCHITECTURE_REVIEWER_VERSION; promptVersion: typeof ARCHITECTURE_REVIEW_PROMPT_VERSION; providerId: string; modelId: string; locale: ArchitectureReviewLocale; generatedAt: string };
}

export interface ArchitectureReviewerInputV0 { evidence: ArchitectureReviewEvidenceBundleV0; locale: ArchitectureReviewLocale }
export interface ArchitectureReviewer { review(input: ArchitectureReviewerInputV0, options?: { signal?: AbortSignal }): Promise<ArchitectureReviewerDraftV0> }

export type ArchitectureReviewClientState =
  | { status: 'not_ready'; reason: 'empty' | 'invalid' | 'partial'; result: null; stale: false; errorCode: null }
  | { status: 'idle'; result: null; stale: false; errorCode: null }
  | { status: 'loading'; result: ArchitectureReviewResultV0 | null; stale: boolean; errorCode: null }
  | { status: 'available'; result: ArchitectureReviewResultV0; stale: boolean; errorCode: null }
  | { status: 'error'; result: ArchitectureReviewResultV0 | null; stale: boolean; errorCode: ArchitectureReviewErrorCode };
