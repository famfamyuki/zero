import { parser } from '@lezer/python';
import type { SyntaxNode } from '@lezer/common';
import type { Edge } from '@xyflow/react';
import type { AgentNodeData, CustomNode, GraphData, TaskNodeData, ToolNodeData } from '@/types/editor';
import type { CrewAIImportDiagnostic, CrewAIImportDiagnosticCode, CrewAIImportKnowledge, CrewAIImportMappingStatus, CrewAIImportResult } from '@/types/crewai-import';
import { TOOL_PARAMETER_DEFINITIONS } from '@/lib/tool-config';
import { validateGraph } from '@/lib/transpiler/validation';

export const CREWAI_IMPORT_ADAPTER_VERSION = '0.1.0' as const;
export const CREWAI_IMPORT_MAX_BYTES = 524_288;
const MAX_NODES = 200, MAX_EDGES = 500, MAX_DIAGNOSTICS = 200;
const SUPPORTED_TOOLS = new Set(Object.keys(TOOL_PARAMETER_DEFINITIONS).filter((value) => value !== 'CustomTool'));
const CORE = new Set(['Agent', 'Task', 'Crew', 'LLM', 'Process']);

type StaticValue = { kind: 'string'; value: string } | { kind: 'number'; value: number } | { kind: 'boolean'; value: boolean }
  | { kind: 'none' } | { kind: 'ref'; value: string } | { kind: 'refs'; value: string[] } | { kind: 'process'; value: 'sequential' | 'hierarchical' } | { kind: 'dynamic' };
interface Fact { symbol: string; kind: string; kwargs: Map<string, { value: StaticValue; node: SyntaxNode }>; node: SyntaxNode }

const cleanFileName = (name: string) => (name.replace(/\\/g, '/').split('/').pop() || 'workflow.py').replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 180);
const words = (symbol: string) => symbol.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const stableId = (type: string, symbol: string) => `${type}-${symbol.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') || 'item'}`;

export function importCrewAISource(fileName: string, bytes: Uint8Array): CrewAIImportResult {
  const file = cleanFileName(fileName);
  const diagnostics: CrewAIImportDiagnostic[] = [];
  const add = (code: CrewAIImportDiagnosticCode, status: CrewAIImportMappingStatus, knowledge: CrewAIImportKnowledge, blocking: boolean, node?: SyntaxNode, symbol?: string, target?: CrewAIImportDiagnostic['target'], details?: CrewAIImportDiagnostic['details']) => {
    if (diagnostics.length >= MAX_DIAGNOSTICS) return;
    const line = node ? lineColumn(source, node.from) : undefined;
    diagnostics.push({ code, status, knowledge, severity: blocking ? 'error' : status === 'MAPPED_WITH_INFERENCE' || status === 'UNSUPPORTED' ? 'warning' : 'info', blocking,
      source: node ? { file, ...line, symbol, construct: node.name } : { file }, target, details });
  };
  const finish = (graph: GraphData | null): CrewAIImportResult => {
    if (diagnostics.length >= MAX_DIAGNOSTICS && !diagnostics.some((d) => d.code === 'DIAGNOSTICS_TRUNCATED')) {
      diagnostics[MAX_DIAGNOSTICS - 1] = { code: 'DIAGNOSTICS_TRUNCATED', status: 'UNKNOWN', knowledge: 'UNKNOWN', severity: 'error', blocking: true, source: { file } };
    }
    diagnostics.sort((a, b) => Number(b.blocking) - Number(a.blocking) || a.code.localeCompare(b.code) || (a.source?.line || 0) - (b.source?.line || 0) || (a.source?.symbol || '').localeCompare(b.source?.symbol || ''));
    const count = (status: CrewAIImportMappingStatus) => diagnostics.filter((d) => d.status === status).length;
    const state = diagnostics.some((d) => d.blocking) || !graph ? 'BLOCKED' : 'READY';
    return { state, graph: state === 'READY' ? graph : null, report: { adapterId: 'crewai-python-direct-v0', adapterVersion: CREWAI_IMPORT_ADAPTER_VERSION, mappingRuleVersion: '0.1.0', framework: 'CrewAI', frameworkVersion: null, frameworkVersionKnowledge: 'UNKNOWN', sourceFile: file, state,
      summary: { mapped: count('MAPPED'), mappedWithInference: count('MAPPED_WITH_INFERENCE'), lossy: count('LOSSY'), unknown: count('UNKNOWN'), unsupported: count('UNSUPPORTED') }, diagnostics } };
  };
  let source = '';
  if (!file.toLowerCase().endsWith('.py')) { add('SOURCE_FILE_TYPE_UNSUPPORTED', 'UNSUPPORTED', 'KNOWN', true); return finish(null); }
  if (bytes.byteLength > CREWAI_IMPORT_MAX_BYTES) { add('SOURCE_FILE_TOO_LARGE', 'UNSUPPORTED', 'KNOWN', true, undefined, undefined, undefined, { maxBytes: CREWAI_IMPORT_MAX_BYTES }); return finish(null); }
  try { source = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { add('SOURCE_ENCODING_INVALID', 'UNSUPPORTED', 'KNOWN', true); return finish(null); }
  if (!source.trim()) { add('SOURCE_EMPTY', 'UNSUPPORTED', 'KNOWN', true); return finish(null); }

  const tree = parser.parse(source);
  if (hasError(tree.topNode)) { add('SOURCE_SYNTAX_INVALID', 'UNKNOWN', 'UNKNOWN', true); return finish(null); }
  const aliases = new Map<string, string>();
  const facts = new Map<string, Fact>();
  const topStatements: SyntaxNode[] = [];
  for (let node = tree.topNode.firstChild; node; node = node.nextSibling) topStatements.push(node);
  topStatements.forEach((node) => { if (node.name === 'ImportStatement') parseImport(node, source, aliases); });
  topStatements.forEach((node) => {
    if (node.name === 'AssignStatement') {
      const fact = parseAssignment(node, source, aliases);
      if (fact) facts.set(fact.symbol, fact);
    }
  });
  add('FRAMEWORK_VERSION_UNKNOWN', 'MAPPED', 'UNKNOWN', false);
  const crews = [...facts.values()].filter((f) => f.kind === 'Crew');
  if (!crews.length) {
    const decorated = source.includes('@CrewBase') || source.includes('CrewBase');
    add(decorated ? 'SOURCE_CONSTRUCT_UNSUPPORTED' : 'CREW_ROOT_NOT_FOUND', 'UNSUPPORTED', decorated ? 'KNOWN' : 'UNKNOWN', true);
    return finish(null);
  }
  if (crews.length > 1) { crews.forEach((f) => add('MULTIPLE_CREW_ROOTS', 'UNSUPPORTED', 'KNOWN', true, f.node, f.symbol)); return finish(null); }
  const crew = crews[0];
  const crewAllowed = new Set(['agents', 'tasks', 'process', 'manager_llm', 'verbose', 'memory']);
  rejectUnknownKwargs(crew, crewAllowed, add);
  const agentRefs = requireRefs(crew, 'agents', add), taskRefs = requireRefs(crew, 'tasks', add);
  const process = requireValue(crew, 'process', 'process', add), crewVerbose = requireValue(crew, 'verbose', 'boolean', add), memory = requireValue(crew, 'memory', 'boolean', add);
  const nodes: CustomNode[] = [], edges: Edge[] = [];
  const edgeKeys = new Set<string>();
  const addEdge = (sourceId: string, targetId: string, node: SyntaxNode, symbol: string) => {
    const key = `${sourceId}->${targetId}`;
    if (edgeKeys.has(key)) { add('DUPLICATE_SOURCE_REFERENCE', 'LOSSY', 'KNOWN', true, node, symbol); return; }
    edgeKeys.add(key); edges.push({ id: `edge-${sourceId}-${targetId}`, source: sourceId, target: targetId });
  };
  const reachable = new Set([crew.symbol, ...agentRefs, ...taskRefs]);
  const toolRefs = new Set<string>(), llmRefs = new Set<string>();
  const resolveFact = (ref: string, expected: string, owner: Fact): Fact | null => {
    const fact = facts.get(ref); if (!fact || (expected && fact.kind !== expected)) { add('SOURCE_REFERENCE_UNRESOLVED', 'UNKNOWN', 'UNKNOWN', true, owner.node, owner.symbol, undefined, { reference: ref }); return null; } return fact;
  };
  const agentAllowed = new Set(['role','goal','backstory','llm','verbose','allow_delegation','max_iter','max_rpm','max_execution_time','respect_context_window','cache','tools']);
  agentRefs.forEach((ref, index) => {
    const fact = resolveFact(ref, 'Agent', crew); if (!fact) return; reachable.add(ref); rejectUnknownKwargs(fact, agentAllowed, add);
    const id = stableId('agent', ref), model = resolveModel(fact, facts, llmRefs, add);
    const role = requireValue(fact, 'role', 'string', add), goal = requireValue(fact, 'goal', 'string', add), backstory = requireValue(fact, 'backstory', 'string', add);
    const verbose = requireValue(fact, 'verbose', 'boolean', add), allowDelegation = requireValue(fact, 'allow_delegation', 'boolean', add), maxIter = requireValue(fact, 'max_iter', 'number', add);
    const maxRpm = optionalNumber(fact, 'max_rpm', add), maxExecutionTime = optionalNumber(fact, 'max_execution_time', add), respectContextWindow = requireValue(fact, 'respect_context_window', 'boolean', add), cache = requireValue(fact, 'cache', 'boolean', add);
    const data: AgentNodeData = { label: words(ref), role: stringOrEmpty(role), goal: stringOrEmpty(goal), backstory: stringOrEmpty(backstory), model: model || '', verbose: boolOrFalse(verbose), allowDelegation: boolOrFalse(allowDelegation), maxIter: numberOrZero(maxIter), respectContextWindow: boolOrFalse(respectContextWindow), cache: boolOrFalse(cache), ...(maxRpm !== undefined ? { maxRpm } : {}), ...(maxExecutionTime !== undefined ? { maxExecutionTime } : {}) };
    nodes.push({ id, type: 'agent', position: { x: 360, y: 80 + index * 220 }, data });
    add('MAPPED_PRESENTATION_INFERENCE', 'MAPPED_WITH_INFERENCE', 'INFERRED', false, fact.node, ref, { scope: 'node', nodeId: id, field: 'label' });
    optionalRefs(fact, 'tools', add).forEach((tool) => toolRefs.add(tool));
  });
  const taskAllowed = new Set(['description','expected_output','agent','tools','context','async_execution','markdown','output_file','human_input']);
  taskRefs.forEach((ref, index) => {
    const fact = resolveFact(ref, 'Task', crew); if (!fact) return; reachable.add(ref); rejectUnknownKwargs(fact, taskAllowed, add);
    if (fact.kwargs.has('output_pydantic') || fact.kwargs.has('output_json')) add('STRUCTURED_OUTPUT_UNSUPPORTED', 'UNSUPPORTED', 'KNOWN', true, fact.node, ref);
    const id = stableId('task', ref), description = requireValue(fact, 'description', 'string', add), expected = requireValue(fact, 'expected_output', 'string', add);
    const asyncExecution = requireValue(fact, 'async_execution', 'boolean', add);
    const agent = optionalRef(fact, 'agent', add), assignedAgentId = agent ? stableId('agent', agent) : undefined;
    if (agent && !agentRefs.includes(agent)) add('SOURCE_REFERENCE_UNRESOLVED', 'UNKNOWN', 'UNKNOWN', true, fact.node, ref, undefined, { reference: agent });
    const data: TaskNodeData = { label: words(ref), description: stringOrEmpty(description), expectedOutput: stringOrEmpty(expected), asyncExecution: boolOrFalse(asyncExecution), ...(assignedAgentId ? { assignedAgentId } : {}) };
    for (const [key, field] of [['markdown','markdown'],['human_input','humanInput']] as const) { const value = optionalValue(fact, key, 'boolean', add); if (value?.kind === 'boolean') data[field] = value.value; }
    const output = optionalValue(fact, 'output_file', 'string', add); if (output?.kind === 'string') data.outputFile = output.value;
    nodes.push({ id, type: 'task', position: { x: 700, y: 80 + index * 220 }, data });
    add('MAPPED_PRESENTATION_INFERENCE', 'MAPPED_WITH_INFERENCE', 'INFERRED', false, fact.node, ref, { scope: 'node', nodeId: id, field: 'label' });
    if (agent) addEdge(stableId('agent', agent), id, fact.node, ref);
    optionalRefs(fact, 'tools', add).forEach((tool) => toolRefs.add(tool));
    optionalRefs(fact, 'context', add).forEach((prior) => { if (!taskRefs.includes(prior)) add('SOURCE_REFERENCE_UNRESOLVED', 'UNKNOWN', 'UNKNOWN', true, fact.node, ref, undefined, { reference: prior }); else { if (taskRefs.indexOf(prior) >= index) add('TASK_ORDER_CONTEXT_CONFLICT', 'LOSSY', 'KNOWN', true, fact.node, ref); addEdge(stableId('task', prior), id, fact.node, ref); } });
  });
  const llmAllowed = new Set(['model','temperature','base_url']);
  llmRefs.forEach((ref) => { const f = resolveFact(ref, 'LLM', crew); if (f) { reachable.add(ref); rejectUnknownKwargs(f, llmAllowed, add); } });
  const toolList = [...toolRefs];
  toolList.forEach((ref, index) => {
    const fact = facts.get(ref); if (!fact) { add('SOURCE_REFERENCE_UNRESOLVED', 'UNKNOWN', 'UNKNOWN', true, crew.node, crew.symbol, undefined, { reference: ref }); return; }
    reachable.add(ref);
    if (!SUPPORTED_TOOLS.has(fact.kind)) { add(fact.kind === 'CustomTool' ? 'CUSTOM_TOOL_UNSUPPORTED' : 'TOOL_TYPE_UNSUPPORTED', 'UNSUPPORTED', 'KNOWN', true, fact.node, ref); return; }
    const allowed = new Set(TOOL_PARAMETER_DEFINITIONS[fact.kind].map((p) => p.key)); rejectToolKwargs(fact, allowed, add);
    const parameters: Record<string, string> = {}; allowed.forEach((key) => { const value = optionalValue(fact, key, 'string', add); if (value?.kind === 'string') parameters[key] = value.value; });
    const id = stableId('tool', ref); const data: ToolNodeData = { label: words(ref), toolType: fact.kind as ToolNodeData['toolType'], description: `${fact.kind} imported from ${ref}`, parameters };
    nodes.push({ id, type: 'tool', position: { x: 20, y: 80 + index * 180 }, data });
    add('MAPPED_PRESENTATION_INFERENCE', 'MAPPED_WITH_INFERENCE', 'INFERRED', false, fact.node, ref, { scope: 'node', nodeId: id, field: 'label' });
    agentRefs.forEach((owner) => { const f = facts.get(owner); if (f && optionalRefs(f, 'tools', add).includes(ref)) addEdge(id, stableId('agent', owner), f.node, owner); });
    taskRefs.forEach((owner) => { const f = facts.get(owner); if (f && optionalRefs(f, 'tools', add).includes(ref)) addEdge(id, stableId('task', owner), f.node, owner); });
  });
  const manager = optionalRef(crew, 'manager_llm', add); let managerLlm: string | undefined;
  if (manager) { llmRefs.add(manager); const managerFact = resolveFact(manager, 'LLM', crew); if (managerFact) managerLlm = resolveLlm(managerFact, add) || undefined; }
  topStatements.forEach((node) => {
    if (node.name !== 'AssignStatement' || facts.has(text(source, children(node).find((child) => child.name === 'VariableName') || node))) return;
    const member = children(node).find((child) => child.name === 'MemberExpression');
    const base = member?.firstChild && member.firstChild.name === 'VariableName' ? text(source, member.firstChild) : undefined;
    if (base && reachable.has(base)) add('SOURCE_CONSTRUCT_UNSUPPORTED', 'UNSUPPORTED', 'KNOWN', true, node, base);
  });
  topStatements.forEach((node) => { if (node.name !== 'ImportStatement' && node.name !== 'AssignStatement' && node.name !== 'Comment') add('BOOTSTRAP_CODE_EXCLUDED', 'UNSUPPORTED', 'KNOWN', false, node); });
  if (nodes.length > MAX_NODES) add('MAPPED_NODE_LIMIT_EXCEEDED', 'UNSUPPORTED', 'KNOWN', true, crew.node, crew.symbol, undefined, { maxNodes: MAX_NODES });
  if (edges.length > MAX_EDGES) add('MAPPED_EDGE_LIMIT_EXCEEDED', 'UNSUPPORTED', 'KNOWN', true, crew.node, crew.symbol, undefined, { maxEdges: MAX_EDGES });
  const header = source.match(/^\s*#\s*CrewAI Autonomous Agent Flow:\s*(.+?)\s*$/m)?.[1];
  const inferredName = file.replace(/\.py$/i, '').replace(/[_-]+/g, ' ').trim() || 'Imported Crew';
  if (!header) add('MAPPED_PRESENTATION_INFERENCE', 'MAPPED_WITH_INFERENCE', 'INFERRED', false, crew.node, crew.symbol, { scope: 'crew', field: 'name' });
  const graph: GraphData = { nodes, edges, crewConfig: { name: header || words(inferredName), process: process?.kind === 'process' ? process.value : 'sequential', verbose: boolOrFalse(crewVerbose), memory: boolOrFalse(memory), ...(managerLlm ? { managerLlm } : {}) } };
  if (!diagnostics.some((d) => d.blocking)) { const validation = validateGraph(graph.nodes, graph.edges, graph.crewConfig, 'scaffold'); if (!validation.isValid) add('GRAPH_VALIDATION_FAILED', 'UNKNOWN', 'UNKNOWN', true, crew.node, crew.symbol, undefined, { errorCount: validation.errors.length }); }
  if (!diagnostics.some((d) => d.blocking)) addMappedDiagnostics(crew, agentRefs, taskRefs, toolList, add);
  return finish(graph);
}

function lineColumn(source: string, offset: number) { const before = source.slice(0, offset), lines = before.split('\n'); return { line: lines.length, column: lines[lines.length - 1].length + 1 }; }
function hasError(node: SyntaxNode): boolean { if (node.type.isError) return true; for (let c = node.firstChild; c; c = c.nextSibling) if (hasError(c)) return true; return false; }
function children(node: SyntaxNode) { const out: SyntaxNode[] = []; for (let c = node.firstChild; c; c = c.nextSibling) out.push(c); return out; }
function text(source: string, node: SyntaxNode) { return source.slice(node.from, node.to); }
function parseImport(node: SyntaxNode, source: string, aliases: Map<string,string>) {
  const raw = text(source, node); if (!raw.startsWith('from crewai ') && !raw.startsWith('from crewai_tools ')) return;
  const vars = children(node).filter((n) => n.name === 'VariableName').map((n) => text(source,n)); const start = vars[0] === 'crewai' || vars[0] === 'crewai_tools' ? 1 : 0;
  for (let i=start;i<vars.length;i++) { const canonical = vars[i]; if (CORE.has(canonical) || SUPPORTED_TOOLS.has(canonical) || canonical === 'CustomTool') { const aliasMatch = raw.match(new RegExp(`\\b${canonical}\\s+as\\s+([A-Za-z_]\\w*)`)); aliases.set(aliasMatch?.[1] || canonical, canonical); } }
}
function parseAssignment(node: SyntaxNode, source: string, aliases: Map<string,string>): Fact | null {
  const cs=children(node), lhs=cs.find((n)=>n.name==='VariableName'), call=cs.find((n)=>n.name==='CallExpression'); if(!lhs||!call)return null;
  const callChildren=children(call), callee=callChildren[0]; if(!callee||callee.name!=='VariableName')return null; const rawKind=text(source,callee), kind=aliases.get(rawKind);
  if(!kind)return null; const args=callChildren.find((n)=>n.name==='ArgList'); const kwargs=new Map<string,{value:StaticValue;node:SyntaxNode}>(); if(args){const ac=children(args); for(let i=0;i<ac.length-2;i++){if(ac[i].name==='VariableName'&&ac[i+1].name==='AssignOp'){kwargs.set(text(source,ac[i]),{value:parseValue(ac[i+2],source),node:ac[i+2]});i+=2;}} if(text(source,args).includes('**'))kwargs.set('__dynamic_kwargs__',{value:{kind:'dynamic'},node:args});}
  return {symbol:text(source,lhs),kind,kwargs,node};
}
function parseValue(node: SyntaxNode, source:string):StaticValue { const raw=text(source,node); if(node.name==='String'){try{return{kind:'string',value:decodePythonString(raw)}}catch{return{kind:'dynamic'}}} if(node.name==='Boolean')return{kind:'boolean',value:raw==='True'}; if(node.name==='None')return{kind:'none'}; if(node.name==='Number'&&/^-?\d+(?:\.\d+)?$/.test(raw))return{kind:'number',value:Number(raw)}; if(node.name==='VariableName')return{kind:'ref',value:raw}; if(node.name==='ArrayExpression'||node.name==='TupleExpression'){const vals=children(node).filter((n)=>n.name==='VariableName').map((n)=>text(source,n)); return{kind:'refs',value:vals};} if(node.name==='MemberExpression'&&(raw==='Process.sequential'||raw==='Process.hierarchical'))return{kind:'process',value:raw.endsWith('sequential')?'sequential':'hierarchical'}; return{kind:'dynamic'}; }
function decodePythonString(raw:string){ let s=raw; const prefix=s.match(/^[rRuUbBfF]+/)?.[0]||''; if(prefix.toLowerCase().includes('f'))throw new Error(); s=s.slice(prefix.length); const q=s.startsWith("'''")?"'''":s.startsWith('"""')?'"""':s[0]; const body=s.slice(q.length,-q.length); if(prefix.toLowerCase().includes('r'))return body; return body.replace(/\\n/g,'\n').replace(/\\r/g,'\r').replace(/\\t/g,'\t').replace(/\\(['"\\])/g,'$1'); }
type Add = (code:CrewAIImportDiagnosticCode,status:CrewAIImportMappingStatus,knowledge:CrewAIImportKnowledge,blocking:boolean,node?:SyntaxNode,symbol?:string,target?:CrewAIImportDiagnostic['target'],details?:CrewAIImportDiagnostic['details'])=>void;
function rejectUnknownKwargs(f:Fact,allowed:Set<string>,add:Add){f.kwargs.forEach((_,key)=>{if(!allowed.has(key))add('SOURCE_SEMANTIC_LOSSY','LOSSY','KNOWN',true,f.node,f.symbol,undefined,{keyword:key});});}
function rejectToolKwargs(f:Fact,allowed:Set<string>,add:Add){f.kwargs.forEach((_,key)=>{if(!allowed.has(key))add('TOOL_PARAMETER_UNSUPPORTED','LOSSY','KNOWN',true,f.node,f.symbol,undefined,{keyword:key});});}
function requireValue(f:Fact,key:string,kind:StaticValue['kind'],add:Add){const item=f.kwargs.get(key);if(!item){add('SOURCE_VALUE_DYNAMIC','UNKNOWN','UNKNOWN',true,f.node,f.symbol,undefined,{field:key});return undefined;}if(item.value.kind!==kind){add('SOURCE_VALUE_DYNAMIC','UNKNOWN','UNKNOWN',true,item.node,f.symbol,undefined,{field:key});return undefined;}return item.value;}
function optionalValue(f:Fact,key:string,kind:StaticValue['kind'],add:Add){const item=f.kwargs.get(key);if(!item)return undefined;if(item.value.kind!==kind){add('SOURCE_VALUE_DYNAMIC','UNKNOWN','UNKNOWN',true,item.node,f.symbol,undefined,{field:key});return undefined;}return item.value;}
function requireRefs(f:Fact,key:string,add:Add){const v=requireValue(f,key,'refs',add);return v?.kind==='refs'?duplicateCheck(v.value,f,key,add):[];}
function optionalRefs(f:Fact,key:string,add:Add){const v=optionalValue(f,key,'refs',add);return v?.kind==='refs'?duplicateCheck(v.value,f,key,add):[];}
function duplicateCheck(values:string[],f:Fact,key:string,add:Add){if(new Set(values).size!==values.length)add('DUPLICATE_SOURCE_REFERENCE','LOSSY','KNOWN',true,f.node,f.symbol,undefined,{field:key});return values;}
function optionalRef(f:Fact,key:string,add:Add){const v=optionalValue(f,key,'ref',add);return v?.kind==='ref'?v.value:undefined;}
function optionalNumber(f:Fact,key:string,add:Add){const item=f.kwargs.get(key);if(!item||item.value.kind==='none')return undefined;if(item.value.kind!=='number'||!Number.isInteger(item.value.value)){add('SOURCE_VALUE_DYNAMIC','UNKNOWN','UNKNOWN',true,item.node,f.symbol,undefined,{field:key});return undefined;}return item.value.value;}
function resolveModel(agent:Fact,facts:Map<string,Fact>,refs:Set<string>,add:Add){const item=agent.kwargs.get('llm');if(!item){add('SOURCE_VALUE_DYNAMIC','UNKNOWN','UNKNOWN',true,agent.node,agent.symbol,undefined,{field:'llm'});return undefined;}if(item.value.kind==='string')return item.value.value;if(item.value.kind==='ref'){refs.add(item.value.value);const llm=facts.get(item.value.value);if(!llm||llm.kind!=='LLM'){add('SOURCE_REFERENCE_UNRESOLVED','UNKNOWN','UNKNOWN',true,item.node,agent.symbol,undefined,{reference:item.value.value});return undefined;}return resolveLlm(llm,add);}add('SOURCE_VALUE_DYNAMIC','UNKNOWN','UNKNOWN',true,item.node,agent.symbol,undefined,{field:'llm'});return undefined;}
function resolveLlm(llm:Fact,add:Add){const allowed=new Set(['model','temperature','base_url']);rejectUnknownKwargs(llm,allowed,add);const model=requireValue(llm,'model','string',add);const temp=optionalValue(llm,'temperature','number',add);if(temp?.kind==='number'&&temp.value!==0.1)add('MODEL_CONFIG_UNREPRESENTABLE','LOSSY','KNOWN',true,llm.node,llm.symbol,undefined,{field:'temperature'});const base=optionalValue(llm,'base_url','string',add);if(base?.kind==='string'&&base.value!=='http://localhost:11434')add('MODEL_CONFIG_UNREPRESENTABLE','LOSSY','KNOWN',true,llm.node,llm.symbol,undefined,{field:'base_url'});return model?.kind==='string'?model.value:undefined;}
function stringOrEmpty(v:StaticValue|undefined){return v?.kind==='string'?v.value:''} function boolOrFalse(v:StaticValue|undefined){return v?.kind==='boolean'?v.value:false} function numberOrZero(v:StaticValue|undefined){return v?.kind==='number'?v.value:0}
function addMappedDiagnostics(crew:Fact,agents:string[],tasks:string[],tools:string[],add:Add){add('MAPPED_PRESENTATION_INFERENCE','MAPPED','KNOWN',false,crew.node,crew.symbol,{scope:'crew'});agents.forEach((s)=>add('MAPPED_PRESENTATION_INFERENCE','MAPPED','KNOWN',false,crew.node,s,{scope:'node',nodeId:stableId('agent',s)}));tasks.forEach((s)=>add('MAPPED_PRESENTATION_INFERENCE','MAPPED','KNOWN',false,crew.node,s,{scope:'node',nodeId:stableId('task',s)}));tools.forEach((s)=>add('MAPPED_PRESENTATION_INFERENCE','MAPPED','KNOWN',false,crew.node,s,{scope:'node',nodeId:stableId('tool',s)}));}
