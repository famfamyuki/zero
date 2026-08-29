import type { GraphData } from "./editor";

export type CrewAIImportMappingStatus =
  | "MAPPED"
  | "MAPPED_WITH_INFERENCE"
  | "LOSSY"
  | "UNKNOWN"
  | "UNSUPPORTED";
export type CrewAIImportKnowledge = "KNOWN" | "INFERRED" | "UNKNOWN";
export type CrewAIImportResultState = "READY" | "BLOCKED";
export type CrewAIImportDiagnosticCode =
  | "SOURCE_FILE_TYPE_UNSUPPORTED"
  | "SOURCE_FILE_TOO_LARGE"
  | "SOURCE_ENCODING_INVALID"
  | "SOURCE_EMPTY"
  | "SOURCE_SYNTAX_INVALID"
  | "CREW_ROOT_NOT_FOUND"
  | "MULTIPLE_CREW_ROOTS"
  | "SOURCE_CONSTRUCT_UNSUPPORTED"
  | "SOURCE_REFERENCE_UNRESOLVED"
  | "SOURCE_VALUE_DYNAMIC"
  | "SOURCE_SEMANTIC_LOSSY"
  | "MODEL_CONFIG_UNREPRESENTABLE"
  | "TOOL_TYPE_UNSUPPORTED"
  | "TOOL_PARAMETER_UNSUPPORTED"
  | "CUSTOM_TOOL_UNSUPPORTED"
  | "STRUCTURED_OUTPUT_UNSUPPORTED"
  | "TASK_ORDER_CONTEXT_CONFLICT"
  | "DUPLICATE_SOURCE_REFERENCE"
  | "MAPPED_PRESENTATION_INFERENCE"
  | "FRAMEWORK_VERSION_UNKNOWN"
  | "BOOTSTRAP_CODE_EXCLUDED"
  | "MAPPED_NODE_LIMIT_EXCEEDED"
  | "MAPPED_EDGE_LIMIT_EXCEEDED"
  | "DIAGNOSTICS_TRUNCATED"
  | "GRAPH_VALIDATION_FAILED";

export interface CrewAIImportSourceLocation {
  file: string;
  line?: number;
  column?: number;
  symbol?: string;
  construct?: string;
}
export interface CrewAIImportTarget {
  scope: "crew" | "node" | "edge";
  nodeId?: string;
  edgeId?: string;
  field?: string;
}
export interface CrewAIImportDiagnostic {
  code: CrewAIImportDiagnosticCode;
  status: CrewAIImportMappingStatus;
  knowledge: CrewAIImportKnowledge;
  severity: "info" | "warning" | "error";
  blocking: boolean;
  source?: CrewAIImportSourceLocation;
  target?: CrewAIImportTarget;
  details?: Record<string, string | number | boolean>;
}
export interface CrewAIImportReport {
  adapterId: "crewai-python-direct-v0";
  adapterVersion: "0.1.0";
  mappingRuleVersion: "0.1.0";
  framework: "CrewAI";
  frameworkVersion: null;
  frameworkVersionKnowledge: "UNKNOWN";
  sourceFile: string;
  state: CrewAIImportResultState;
  summary: {
    mapped: number;
    mappedWithInference: number;
    lossy: number;
    unknown: number;
    unsupported: number;
  };
  diagnostics: CrewAIImportDiagnostic[];
}
export interface CrewAIImportResult {
  state: CrewAIImportResultState;
  graph: GraphData | null;
  report: CrewAIImportReport;
}
