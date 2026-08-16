import { Node, Edge } from '@xyflow/react';

export type NodeType = 'agent' | 'task' | 'tool';

export interface AgentNodeData extends Record<string, unknown> {
  label: string;
  role: string;
  goal: string;
  backstory: string;
  model: string;
  verbose: boolean;
  allowDelegation: boolean;
}

export interface TaskNodeData extends Record<string, unknown> {
  label: string;
  description: string;
  expectedOutput: string;
  assignedAgentId?: string;
  asyncExecution: boolean;
  outputFormat?: 'text' | 'json';
}

export interface ToolNodeData extends Record<string, unknown> {
  label: string;
  toolType: 'SerperDevTool' | 'ScrapeWebsiteTool' | 'DirectoryReadTool' | 'FileReadTool' | 'TXTSearchTool' | 'CustomTool' | 'PDFSearchTool' | 'CSVSearchTool' | 'YoutubeVideoSearchTool' | 'GithubSearchTool' | 'MDXSearchTool';
  description: string;
  parameters?: string;
}

export type CustomNode = Node<AgentNodeData | TaskNodeData | ToolNodeData>;

export interface CrewConfig {
  name: string;
  process: 'sequential' | 'hierarchical';
  managerLlm?: string;
  verbose: boolean;
  memory: boolean;
}

export interface GraphData {
  nodes: CustomNode[];
  edges: Edge[];
  crewConfig: CrewConfig;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  titleEn?: string;
  titleJa?: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  price: number; // 0 for free
  category: 'MARKETING' | 'CONTENT' | 'BUSINESS' | string;
  badge?: string;
  previewNodesCount: {
    agents: number;
    tasks: number;
    tools: number;
  };
  graphData: GraphData;
  created_at?: string;
}

export interface ValidationError {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
  details?: string;
  suggestion?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  nodeId?: string;
  details?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  inputVariables: string[];
  customTools: {
    id: string;
    varName: string;
    className: string;
    label: string;
    description: string;
  }[];
  sortedTaskIds: string[];
  taskAgentMap: Record<string, string>;
  taskContextMap: Record<string, string[]>;
}

export type ExportMode = 'production' | 'scaffold';

export interface ProjectFile {
  path: string;
  filename: string;
  content: string;
  language: string;
  description?: string;
}

export interface ProjectExportResult {
  mode: ExportMode;
  validation: ValidationResult;
  files: ProjectFile[];
  mainCode: string;
}

