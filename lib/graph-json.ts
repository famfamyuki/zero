import { DEFAULT_LLM_MODEL } from '@/lib/models';
import {
  AgentNodeData, CrewConfig, CustomNode, GRAPH_SCHEMA_VERSION, GraphData,
  GraphDocumentV1, GraphImportResult, NodeType, PersistedEdge, PersistedNode,
  TaskNodeData, ToolNodeData,
  ValidationCode, ValidationIssue,
} from '@/types/editor';

const LEGACY_CREW_CONFIG: CrewConfig = {
  name: 'My Crew', process: 'sequential', verbose: true, memory: false,
};

type JsonObject = Record<string, unknown>;

export class GraphDeserializationError extends Error {
  constructor(public readonly issue: ValidationIssue) {
    super(issue.message);
    this.name = 'GraphDeserializationError';
  }
}

function deserializeIssue(code: ValidationCode, message: string, scope: ValidationIssue['scope'] = 'graph', field?: string): GraphDeserializationError {
  return new GraphDeserializationError({ code, severity: 'error', phase: 'deserialize', scope, message, field });
}

function classifyDeserializationError(error: unknown): GraphDeserializationError {
  if (error instanceof GraphDeserializationError) return error;
  const message = error instanceof Error ? error.message : 'Invalid graph document.';
  let code: ValidationCode = 'GRAPH_DOCUMENT_ROOT_INVALID';
  let scope: ValidationIssue['scope'] = 'graph';
  if (/nodes\[\d+\]\.id/.test(message)) { code = 'NODE_ID_INVALID'; scope = 'node'; }
  else if (/node type|nodes\[\d+\]\.type/i.test(message)) { code = 'NODE_TYPE_INVALID'; scope = 'node'; }
  else if (/nodes\[\d+\]\.position/.test(message)) { code = 'NODE_POSITION_INVALID'; scope = 'node'; }
  else if (/nodes\[\d+\]\.data/.test(message)) { code = 'NODE_DATA_INVALID'; scope = 'node'; }
  else if (/edges\[\d+\]\.id/.test(message)) { code = 'EDGE_ID_INVALID'; scope = 'edge'; }
  else if (/edges\[\d+\]\.source/.test(message)) { code = 'EDGE_SOURCE_INVALID'; scope = 'edge'; }
  else if (/edges\[\d+\]\.target/.test(message)) { code = 'EDGE_TARGET_INVALID'; scope = 'edge'; }
  else if (/Handle/.test(message)) { code = 'EDGE_HANDLE_INVALID'; scope = 'edge'; }
  else if (/Duplicate node ID/.test(message)) { code = 'DUPLICATE_NODE_ID'; scope = 'node'; }
  else if (/Duplicate edge ID/.test(message)) { code = 'DUPLICATE_EDGE_ID'; scope = 'edge'; }
  else if (/crewConfig\.name/.test(message)) { code = 'CREW_NAME_INVALID'; scope = 'crew'; }
  else if (/crewConfig\.process/.test(message)) { code = 'CREW_PROCESS_INVALID'; scope = 'crew'; }
  else if (/crewConfig\.verbose/.test(message)) { code = 'CREW_VERBOSE_INVALID'; scope = 'crew'; }
  else if (/crewConfig\.memory/.test(message)) { code = 'CREW_MEMORY_INVALID'; scope = 'crew'; }
  else if (/crewConfig\.managerLlm/.test(message)) { code = 'MANAGER_LLM_INVALID'; scope = 'crew'; }
  return deserializeIssue(code, message, scope);
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string.`);
  }
  return value;
}

function parseNodeType(value: unknown, legacy: boolean): NodeType {
  if (!legacy) {
    if (value === 'agent' || value === 'task' || value === 'tool') return value;
    throw new Error(`Unsupported node type: ${String(value)}`);
  }
  if (typeof value !== 'string') throw new Error('Legacy node type must be a string.');
  const normalized = value.toLowerCase();
  if (normalized.includes('agent')) return 'agent';
  if (normalized.includes('task')) return 'task';
  if (normalized.includes('tool')) return 'tool';
  throw new Error(`Unsupported legacy node type: ${value}`);
}

function migrateNodeData(type: NodeType, rawData: JsonObject): AgentNodeData | TaskNodeData | ToolNodeData {
  const data = { ...rawData };
  if (type === 'agent') {
    if (data.model === undefined && data.llm !== undefined) data.model = data.llm;
    if (data.model === undefined) data.model = DEFAULT_LLM_MODEL;
    if (data.label === undefined) data.label = data.name !== undefined ? data.name : 'New Agent';
    if (data.verbose === undefined) data.verbose = true;
    if (data.allowDelegation === undefined) data.allowDelegation = false;
    return data as AgentNodeData;
  }
  if (type === 'task') {
    if (data.label === undefined) data.label = data.name !== undefined ? data.name : 'New Task';
    if (data.asyncExecution === undefined) data.asyncExecution = false;
    return data as TaskNodeData;
  }
  if (data.label === undefined) data.label = data.name !== undefined ? data.name : 'New Tool';
  return data as ToolNodeData;
}

function parseNode(value: unknown, index: number, legacy: boolean): CustomNode {
  if (!isObject(value)) throw new Error(`nodes[${index}] must be an object.`);
  const id = requireNonEmptyString(value.id, `nodes[${index}].id`);
  const type = parseNodeType(value.type, legacy);
  if (!isObject(value.position)) throw new Error(`nodes[${index}].position must be an object.`);
  const { x, y } = value.position;
  if (typeof x !== 'number' || !Number.isFinite(x) || typeof y !== 'number' || !Number.isFinite(y)) {
    throw new Error(`nodes[${index}].position must contain finite x and y values.`);
  }
  if (!isObject(value.data)) throw new Error(`nodes[${index}].data must be an object.`);
  return {
    id, type, position: { x, y },
    data: legacy ? migrateNodeData(type, value.data) : { ...value.data },
  } as CustomNode;
}

function parseOptionalHandle(value: unknown, field: string): string | null | undefined {
  if (value === undefined || value === null || typeof value === 'string') return value;
  throw new Error(`${field} must be a string or null when present.`);
}

function parseEdge(value: unknown, index: number): PersistedEdge {
  if (!isObject(value)) throw new Error(`edges[${index}] must be an object.`);
  const edge: PersistedEdge = {
    id: requireNonEmptyString(value.id, `edges[${index}].id`),
    source: requireNonEmptyString(value.source, `edges[${index}].source`),
    target: requireNonEmptyString(value.target, `edges[${index}].target`),
  };
  if (Object.prototype.hasOwnProperty.call(value, 'sourceHandle')) {
    edge.sourceHandle = parseOptionalHandle(value.sourceHandle, `edges[${index}].sourceHandle`);
  }
  if (Object.prototype.hasOwnProperty.call(value, 'targetHandle')) {
    edge.targetHandle = parseOptionalHandle(value.targetHandle, `edges[${index}].targetHandle`);
  }
  return edge;
}

function parseCrewConfig(value: unknown): CrewConfig {
  if (!isObject(value)) throw new Error('crewConfig must be an object.');
  if (typeof value.name !== 'string') throw new Error('crewConfig.name must be a string.');
  if (value.process !== 'sequential' && value.process !== 'hierarchical') {
    throw new Error('crewConfig.process must be sequential or hierarchical.');
  }
  if (typeof value.verbose !== 'boolean') throw new Error('crewConfig.verbose must be a boolean.');
  if (typeof value.memory !== 'boolean') throw new Error('crewConfig.memory must be a boolean.');
  if (value.managerLlm !== undefined && typeof value.managerLlm !== 'string') {
    throw new Error('crewConfig.managerLlm must be a string when present.');
  }
  return { ...value } as CrewConfig;
}

function assertUniqueIds(items: Array<{ id: string }>, label: string): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate ${label} ID: ${item.id}`);
    seen.add(item.id);
  }
}

export function toGraphDocument(graph: GraphData): GraphDocumentV1 {
  return {
    schemaVersion: GRAPH_SCHEMA_VERSION,
    nodes: graph.nodes.map((node): PersistedNode => ({
      id: node.id,
      type: node.type as NodeType,
      position: { x: node.position.x, y: node.position.y },
      data: { ...node.data } as AgentNodeData | TaskNodeData | ToolNodeData,
    })),
    edges: graph.edges.map((edge): PersistedEdge => {
      const persisted: PersistedEdge = { id: edge.id, source: edge.source, target: edge.target };
      if (edge.sourceHandle !== undefined) persisted.sourceHandle = edge.sourceHandle;
      if (edge.targetHandle !== undefined) persisted.targetHandle = edge.targetHandle;
      return persisted;
    }),
    crewConfig: { ...graph.crewConfig },
  };
}

export function serializeGraph(graph: GraphData): string {
  return JSON.stringify(toGraphDocument(graph), null, 2);
}

export function deserializeGraph(json: string): GraphImportResult {
  let root: unknown;
  try { root = JSON.parse(json); } catch { throw deserializeIssue('JSON_SYNTAX_INVALID', 'Invalid JSON.'); }
  if (!isObject(root)) throw deserializeIssue('GRAPH_DOCUMENT_ROOT_INVALID', 'Graph document root must be an object.');

  const legacy = !Object.prototype.hasOwnProperty.call(root, 'schemaVersion');
  if (!legacy && root.schemaVersion !== GRAPH_SCHEMA_VERSION) {
    throw deserializeIssue('GRAPH_SCHEMA_VERSION_UNSUPPORTED', `Unsupported graph schema version: ${String(root.schemaVersion)}`, 'graph', 'schemaVersion');
  }
  if (!Array.isArray(root.nodes)) throw deserializeIssue('GRAPH_NODES_INVALID', 'Graph document must contain a nodes array.', 'graph', 'nodes');
  if (!Array.isArray(root.edges)) throw deserializeIssue('GRAPH_EDGES_INVALID', 'Graph document must contain an edges array.', 'graph', 'edges');
  try {
    const nodes = root.nodes.map((node, index) => parseNode(node, index, legacy));
    const edges = root.edges.map((edge, index) => parseEdge(edge, index));
    assertUniqueIds(nodes, 'node');
    assertUniqueIds(edges, 'edge');
    const crewConfig = legacy && root.crewConfig === undefined ? { ...LEGACY_CREW_CONFIG } : parseCrewConfig(root.crewConfig);
    return { graph: { nodes, edges, crewConfig }, migratedFromLegacy: legacy };
  } catch (error) {
    throw classifyDeserializationError(error);
  }
}
