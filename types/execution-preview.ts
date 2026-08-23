export const EXECUTION_PREVIEW_READ_MODEL_VERSION = '0.1.0' as const;

export interface ExecutionPreviewToolRef {
  readonly toolId: string;
  readonly label: string;
  readonly toolType: string;
}

export interface ExecutionPreviewTaskRef {
  readonly taskId: string;
  readonly label: string;
}

export interface ExecutionPreviewAgentRef {
  readonly agentId: string;
  readonly label: string;
  readonly role: string;
}

export interface ExecutionPreviewAgent {
  readonly agentId: string;
  readonly label: string;
  readonly role: string;
  readonly model: string;
  readonly tools: readonly ExecutionPreviewToolRef[];
}

export interface ExecutionPreviewTool {
  readonly toolId: string;
  readonly label: string;
  readonly toolType: string;
}

export type ExecutionPreviewAssignment =
  | { readonly kind: 'fixed'; readonly agent: ExecutionPreviewAgentRef }
  | { readonly kind: 'manager_delegated'; readonly configuredAgent?: ExecutionPreviewAgentRef };

export interface ExecutionPreviewStep {
  readonly taskId: string;
  readonly label: string;
  readonly planOrder: number;
  readonly assignment: ExecutionPreviewAssignment;
  readonly context: readonly ExecutionPreviewTaskRef[];
  readonly directTools: readonly ExecutionPreviewToolRef[];
  readonly description: string;
  readonly expectedOutput: string;
  readonly asyncExecution: boolean;
  readonly outputFormat: 'text' | 'json';
  readonly humanInput: boolean;
  readonly markdown: boolean;
  readonly outputFile?: string;
}

export interface ExecutionPreviewManager {
  readonly model: string;
}

export interface ExecutionPreviewReadModel {
  readonly version: typeof EXECUTION_PREVIEW_READ_MODEL_VERSION;
  readonly process: 'sequential' | 'hierarchical';
  readonly summary: {
    readonly taskCount: number;
    readonly agentCount: number;
    readonly toolCount: number;
  };
  readonly steps: readonly ExecutionPreviewStep[];
  readonly agents: readonly ExecutionPreviewAgent[];
  readonly tools: readonly ExecutionPreviewTool[];
  readonly manager?: ExecutionPreviewManager;
}
