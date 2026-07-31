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
}

export interface ToolNodeData extends Record<string, unknown> {
  label: string;
  toolType: 'SerperDevTool' | 'ScrapeWebsiteTool' | 'DirectoryReadTool' | 'FileReadTool' | 'TXTSearchTool' | 'CustomTool';
  description: string;
  parameters?: string;
}

export type CustomNode = Node<AgentNodeData | TaskNodeData | ToolNodeData>;

export interface CrewConfig {
  name: string;
  process: 'sequential' | 'hierarchical';
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
  description: string;
  price: number; // 0 for free
  category: string;
  badge?: string;
  previewNodesCount: {
    agents: number;
    tasks: number;
    tools: number;
  };
  graphData: GraphData;
  created_at?: string;
}
