import type { ValidationCode } from './editor';

export const READINESS_RULESET_VERSION = '0.1.0' as const;

export type ReadinessStatus = 'not_evaluable' | 'ready' | 'needs_attention' | 'needs_improvement';
export type ReadinessImpact = 'high' | 'medium' | 'low' | 'info';
export type ReadinessCategory = 'workflow_structure' | 'execution_configuration' | 'tooling' | 'output_contract' | 'maintainability';
export type ReadinessTargetScope = 'graph' | 'crew' | 'node' | 'edge' | 'field';

export interface ReadinessTarget {
  scope: ReadinessTargetScope;
  nodeId?: string;
  edgeId?: string;
  field?: string;
}

export type ReadinessEvidenceValue = string | number | boolean | null | readonly string[] | readonly number[];
export type ReadinessEvidence = Readonly<Record<string, ReadinessEvidenceValue>>;
export type ReadinessFindingSource = { kind: 'readiness_rule' } | { kind: 'validation'; validationCode: ValidationCode };

export type ReadinessRuleId =
  | 'RDY_CREW_NAME_EMPTY' | 'RDY_NODE_LABEL_EMPTY' | 'RDY_AGENT_UNUSED' | 'RDY_TOOL_UNUSED'
  | 'RDY_DUPLICATE_SEMANTIC_EDGE' | 'RDY_LEGACY_TASK_AGENT_EDGE' | 'RDY_REDUNDANT_AGENT_ASSIGNMENT'
  | 'RDY_HIERARCHICAL_MANAGER_IMPLICIT' | 'RDY_HIERARCHICAL_ASSIGNMENT_IGNORED'
  | 'RDY_CUSTOM_MODEL_UNVERIFIED' | 'RDY_CUSTOM_TOOL_STUB' | 'RDY_JSON_OUTPUT_SCHEMA_IMPLICIT'
  | 'RDY_STRUCTURED_OUTPUT_MISMATCH' | 'RDY_OUTPUT_FILE_COLLISION' | 'RDY_SAFETY_CLAIM_UNENFORCED';

export interface ReadinessFinding {
  ruleId: ReadinessRuleId;
  category: ReadinessCategory;
  impact: ReadinessImpact;
  target: ReadinessTarget;
  titleKey: string;
  explanationKey: string;
  suggestionKey?: string;
  params?: Readonly<Record<string, string | number | boolean>>;
  evidence?: ReadinessEvidence;
  source: ReadinessFindingSource;
}

export type ReadinessFindingDraft = Pick<ReadinessFinding, 'target' | 'source'> & Partial<Pick<ReadinessFinding, 'params' | 'evidence'>>;

export interface ReadinessCounts { high: number; medium: number; low: number; info: number; total: number; }
export interface ReadinessCategoryResult { category: ReadinessCategory; status: ReadinessStatus; counts: ReadinessCounts; }
export interface ReadinessResult {
  rulesetVersion: typeof READINESS_RULESET_VERSION;
  evaluable: boolean;
  status: ReadinessStatus;
  counts: ReadinessCounts;
  categories: readonly ReadinessCategoryResult[];
  findings: readonly ReadinessFinding[];
  blockedByValidationCodes: readonly ValidationCode[];
}
