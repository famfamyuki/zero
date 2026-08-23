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
  readonly dependencyDepth: number;
  readonly contextFanIn: number;
  readonly directTools: readonly ResourceAnalysisToolRef[];
}

export interface ResourceAnalysisSummary {
  readonly agentCount: number;
  readonly taskCount: number;
  readonly toolCount: number;
  readonly executionStepCount: number;
  readonly uniqueModelCount: number;
  readonly dependencyDepth: number;
  readonly maxContextFanIn: number;
  readonly asyncTaskCount: number;
  readonly fixedAssignmentCount: number;
  readonly managerDelegatedTaskCount: number;
  readonly agentToolBindingCount: number;
  readonly taskToolBindingCount: number;
}

export type ResourceAnalysisTarget =
  | { readonly type: 'task'; readonly id: string }
  | { readonly type: 'agent'; readonly id: string }
  | { readonly type: 'tool'; readonly id: string }
  | { readonly type: 'crew' };

export interface ResourceAnalysisHotspot {
  readonly kind: 'dependency_depth' | 'context_fan_in' | 'tool_binding_concentration';
  readonly value: number;
  readonly target: ResourceAnalysisTarget;
}

export interface ResourceAnalysisUnknown {
  readonly code:
    | 'runtime_cost'
    | 'runtime_latency'
    | 'token_consumption'
    | 'tool_invocation_count'
    | 'tool_execution_duration'
    | 'actual_iteration_count'
    | 'manager_runtime_assignment';
}

export interface ResourceAnalysisReadModel {
  readonly version: typeof RESOURCE_ANALYSIS_READ_MODEL_VERSION;
  readonly process: 'sequential' | 'hierarchical';
  readonly summary: ResourceAnalysisSummary;
  readonly models: readonly ResourceAnalysisModelUsage[];
  readonly tasks: readonly ResourceAnalysisTaskProfile[];
  readonly agentGuards: readonly ResourceAnalysisAgentGuardProfile[];
  readonly toolBindings: readonly ResourceAnalysisToolBindingProfile[];
  readonly hotspots: readonly ResourceAnalysisHotspot[];
  readonly unknowns: readonly ResourceAnalysisUnknown[];
  readonly manager?: { readonly model: string };
}
