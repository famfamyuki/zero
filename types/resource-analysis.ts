export const RESOURCE_ANALYSIS_READ_MODEL_VERSION = '0.1.0' as const;

export interface ResourceAnalysisAgentRef {
  readonly agentId: string;
  readonly label: string;
  readonly role: string;
}

export interface ResourceAnalysisTaskRef {
  readonly taskId: string;
  readonly label: string;
  readonly planOrder: number;
}

export interface ResourceAnalysisToolRef {
  readonly toolId: string;
  readonly label: string;
  readonly toolType: string;
}

export interface ResourceAnalysisModelUsage {
  readonly model: string;
  readonly agents: readonly ResourceAnalysisAgentRef[];
  readonly agentCount: number;
  readonly usedByManager: boolean;
  readonly referenceCount: number;
}

export type ResourceAnalysisAssignment =
  | { readonly kind: 'fixed'; readonly agent: ResourceAnalysisAgentRef }
  | { readonly kind: 'manager_delegated'; readonly configuredAgent?: ResourceAnalysisAgentRef };

export interface ResourceAnalysisGuardValue {
  readonly value: number | null;
  readonly source: 'configured' | 'codegen_default';
}

export interface ResourceAnalysisAgentGuardProfile {
  readonly agent: ResourceAnalysisAgentRef;
  readonly maxIter: ResourceAnalysisGuardValue;
  readonly maxRpm: ResourceAnalysisGuardValue;
  readonly maxExecutionTime: ResourceAnalysisGuardValue;
}

export interface ResourceAnalysisToolBindingProfile {
  readonly tool: ResourceAnalysisToolRef;
  readonly agentBindings: readonly ResourceAnalysisAgentRef[];
  readonly taskBindings: readonly ResourceAnalysisTaskRef[];
  readonly agentBindingCount: number;
  readonly taskBindingCount: number;
  readonly totalBindingCount: number;
}

export interface ResourceAnalysisTaskProfile {
  readonly task: ResourceAnalysisTaskRef;
  readonly assignment: ResourceAnalysisAssignment;
  readonly asyncConfigured: boolean;
}

export interface ResourceAnalysisSummary {
  readonly agentCount: number;
  readonly taskCount: number;
  readonly toolCount: number;
  readonly executionStepCount: number;
  readonly uniqueModelCount: number;
  readonly asyncTaskCount: number;
  readonly fixedAssignmentCount: number;
  readonly managerDelegatedTaskCount: number;
  readonly agentToolBindingCount: number;
  readonly taskToolBindingCount: number;
}

export interface ResourceAnalysisReadModel {
  readonly version: typeof RESOURCE_ANALYSIS_READ_MODEL_VERSION;
  readonly process: 'sequential' | 'hierarchical';
  readonly summary: ResourceAnalysisSummary;
  readonly models: readonly ResourceAnalysisModelUsage[];
  readonly tasks: readonly ResourceAnalysisTaskProfile[];
  readonly agentGuards: readonly ResourceAnalysisAgentGuardProfile[];
  readonly toolBindings: readonly ResourceAnalysisToolBindingProfile[];
}
