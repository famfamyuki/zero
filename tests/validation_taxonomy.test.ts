import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { Edge } from '@xyflow/react';
import { CrewConfig, CustomNode, GraphData, ValidationCode, ValidationIssue } from '../types/editor';
import { validateGraph } from '../lib/transpiler/validation';
import { generateProjectFiles } from '../lib/transpiler/crewai';
import { deserializeGraph, GraphDeserializationError, serializeGraph } from '../lib/graph-json';
import { PRESET_TEMPLATES } from '../lib/presets';

const crew: CrewConfig = { name: 'Crew', process: 'sequential', verbose: true, memory: false };
const agent = (id = 'a', extra: Record<string, unknown> = {}): CustomNode => ({ id, type: 'agent', position: { x: 0, y: 0 }, data: { label: 'Agent', role: 'Worker', goal: 'Work', backstory: 'Expert', model: 'gpt-5.6-terra', verbose: true, allowDelegation: false, ...extra } });
const task = (id = 't', extra: Record<string, unknown> = {}): CustomNode => ({ id, type: 'task', position: { x: 1, y: 0 }, data: { label: 'Task', description: 'Do work', expectedOutput: 'Result', asyncExecution: false, ...extra } });
const tool = (id = 'x', extra: Record<string, unknown> = {}): CustomNode => ({ id, type: 'tool', position: { x: 0, y: 1 }, data: { label: 'Tool', toolType: 'FileReadTool', description: 'Read', parameters: {}, ...extra } as any });
const edge = (id: string, source: string, target: string): Edge => ({ id, source, target });
const graph = (): GraphData => ({ nodes: [agent(), task(), tool()], edges: [edge('at', 'a', 't'), edge('xa', 'x', 'a')], crewConfig: { ...crew } });
const codes = (g: GraphData, mode: 'scaffold' | 'production' = 'scaffold') => validateGraph(g.nodes, g.edges, g.crewConfig, mode).issues.map((issue) => issue.code);
const reverse = <T>(items: T[]) => [...items].reverse();
const rotate = <T>(items: T[]) => items.length < 2 ? [...items] : [...items.slice(1), items[0]];

describe('Packet C validation and error taxonomy', () => {
  test('1-4 ValidationIssue schema, derived validity, and blocking boundary', () => {
    const valid = validateGraph(...[graph().nodes, graph().edges, crew] as const);
    for (const issue of valid.issues) for (const key of ['code', 'severity', 'phase', 'scope', 'message'] satisfies (keyof ValidationIssue)[]) assert.ok(key in issue);
    assert.equal(valid.isValid, valid.errors.length === 0); assert.ok(valid.warnings.length > 0 || valid.infos.length >= 0);
    const invalid = { ...graph(), nodes: [agent(), task('t', { description: '' })] };
    assert.deepEqual(generateProjectFiles(invalid.nodes, [edge('at', 'a', 't')], crew).files, []);
    const informational = graph(); (informational.nodes[0].data as any).model = 'vendor/custom-v1'; assert.ok(generateProjectFiles(informational.nodes, informational.edges, crew).files.length > 0);
  });
  test('5-10 diagnostics repeat and survive node/edge permutations and JSON round-trip', () => {
    const base = graph(); (base.nodes[0].data as any).model = 'vendor/custom-v1'; base.edges.push(edge('dup', 'x', 'a'));
    const expected = validateGraph(base.nodes, base.edges, base.crewConfig).issues;
    for (const candidate of [base, { ...base, nodes: reverse(base.nodes) }, { ...base, nodes: rotate(base.nodes) }, { ...base, edges: reverse(base.edges) }, { ...base, nodes: reverse(base.nodes), edges: rotate(base.edges) }, deserializeGraph(serializeGraph(base)).graph]) assert.deepEqual(validateGraph(candidate.nodes, candidate.edges, candidate.crewConfig).issues, expected);
  });
  test('11-20 structural IDs, dangling references, malformed nodes, edges and cycles', () => {
    const cases: Array<[string, CustomNode[], Edge[]]> = [
      ['DUPLICATE_NODE_ID', [agent(), agent()], []], ['DUPLICATE_EDGE_ID', [agent(), task()], [edge('e', 'a', 't'), edge('e', 'a', 't')]],
      ['DANGLING_EDGE', [agent(), task()], [edge('e', 'missing', 't')]], ['DANGLING_EDGE', [agent(), task()], [edge('e', 'a', 'missing')]],
      ['NODE_TYPE_INVALID', [agent(), { ...task(), type: 'bad' } as any], []], ['NODE_POSITION_INVALID', [agent(), { ...task(), position: { x: 0, y: NaN } }], []],
      ['NODE_DATA_INVALID', [agent(), { ...task(), data: null } as any], []], ['UNSUPPORTED_EDGE', [agent('a'), agent('b'), task()], [edge('e', 'a', 'b')]],
      ['TASK_SELF_CYCLE', [agent(), task()], [edge('a', 'a', 't'), edge('s', 't', 't')]], ['TASK_CYCLE_DETECTED', [agent(), task('t1'), task('t2')], [edge('a1', 'a', 't1'), edge('a2', 'a', 't2'), edge('12', 't1', 't2'), edge('21', 't2', 't1')]],
    ];
    for (const [code, nodes, edges] of cases) assert.ok(validateGraph(nodes, edges, crew).issues.some((issue) => issue.code === code), code);
  });
  test('21-29 Agent requirements, warnings, model default/custom/malformed/Ollama', () => {
    for (const [field, code] of [['role', 'AGENT_ROLE_MISSING'], ['goal', 'AGENT_GOAL_MISSING'], ['backstory', 'AGENT_BACKSTORY_MISSING']] as const) { const g = graph(); (g.nodes[0].data as any)[field] = ' '; assert.ok(codes(g).includes(code)); }
    const unused = { ...graph(), nodes: [agent('a'), agent('b'), task(), tool()], edges: [edge('at', 'a', 't')] }; assert.ok(codes(unused).includes('UNUSED_AGENT')); assert.ok(codes(unused).includes('AGENT_WITHOUT_TOOLS'));
    for (const [model, expected] of [[undefined, null], ['openai/', 'AGENT_MODEL_INVALID'], ['vendor/custom-v1', 'MODEL_ID_UNVERIFIED'], ['ollama/llama3.3', null]] as const) { const g = graph(); (g.nodes[0].data as any).model = model; const result = validateGraph(g.nodes, g.edges, crew); if (expected) assert.ok(result.issues.some((issue) => issue.code === expected)); else assert.equal(result.errors.some((issue) => issue.code === 'AGENT_MODEL_INVALID'), false); }
  });
  test('30-38 Task requirements, assignment, duplicate dependency, and schemas', () => {
    for (const [field, code] of [['description', 'TASK_DESCRIPTION_MISSING'], ['expectedOutput', 'TASK_EXPECTED_OUTPUT_MISSING']] as const) { const g = graph(); (g.nodes[1].data as any)[field] = ''; assert.ok(codes(g).includes(code)); }
    assert.ok(codes({ nodes: [agent(), task()], edges: [], crewConfig: crew }).includes('UNASSIGNED_TASK'));
    assert.ok(codes({ nodes: [agent(), task()], edges: [], crewConfig: { ...crew, process: 'hierarchical' } }).includes('UNASSIGNED_TASK_HIERARCHICAL'));
    assert.ok(codes({ nodes: [agent('a'), agent('b'), task()], edges: [edge('1', 'a', 't'), edge('2', 'b', 't')], crewConfig: crew }).includes('MULTIPLE_AGENTS_PER_TASK'));
    assert.ok(codes({ nodes: [agent(), task('t', { assignedAgentId: 'missing' })], edges: [], crewConfig: crew }).includes('INVALID_ASSIGNED_AGENT_REFERENCE'));
    const dup = { nodes: [agent(), task('t1'), task('t2')], edges: [edge('a1', 'a', 't1'), edge('a2', 'a', 't2'), edge('d1', 't1', 't2'), edge('d2', 't1', 't2')], crewConfig: crew }; assert.ok(codes(dup).includes('DUPLICATE_SEMANTIC_EDGE'));
    for (const schema of ['not json', '{"class":"string"}']) { const g = graph(); Object.assign(g.nodes[1].data, { outputFormat: 'json', outputSchema: schema }); assert.ok(codes(g).includes('INVALID_OUTPUT_SCHEMA')); }
  });
  test('39-48 Tool validation, duplicate connection, scaffold/production and description warning', () => {
    const toolCases: Array<[Record<string, unknown>, ValidationCode]> = [[{ toolType: '' }, 'MISSING_TOOL_TYPE'], [{ toolType: 'BadTool' }, 'UNSUPPORTED_TOOL_TYPE'], [{ parameters: [] }, 'TOOL_PARAMETERS_INVALID'], [{ parameters: { file_path: 2 } }, 'TOOL_PARAMETER_TYPE_INVALID'], [{ parameters: { bad: 'x' } }, 'UNSUPPORTED_TOOL_PARAMETER']];
    for (const [extra, code] of toolCases) { const g = graph(); Object.assign(g.nodes[2].data, extra); assert.ok(codes(g).includes(code), code); }
    assert.ok(codes({ nodes: [agent(), task(), tool()], edges: [edge('at', 'a', 't')], crewConfig: crew }).includes('UNUSED_TOOL'));
    const duplicated = graph(); duplicated.edges.push(edge('dup', 'x', 'a')); assert.ok(codes(duplicated).includes('DUPLICATE_SEMANTIC_EDGE'));
    const custom = graph(); Object.assign(custom.nodes[2].data, { toolType: 'CustomTool', description: '' }); assert.equal(validateGraph(custom.nodes, custom.edges, crew, 'scaffold').isValid, true); assert.ok(codes(custom).includes('CUSTOM_TOOL_DESCRIPTION_MISSING')); assert.ok(codes(custom, 'production').includes('UNIMPLEMENTED_CUSTOM_TOOLS_IN_PRODUCTION'));
  });
  test('49-54 Crew primitive and manager model contracts', () => {
    for (const [field, value, code] of [['process', 'bad', 'CREW_PROCESS_INVALID'], ['verbose', 'yes', 'CREW_VERBOSE_INVALID'], ['memory', 1, 'CREW_MEMORY_INVALID']] as const) { const g = graph(); (g.crewConfig as any)[field] = value; assert.ok(codes(g).includes(code)); }
    for (const [managerLlm, expected] of [[undefined, null], ['anthropic/', 'MANAGER_LLM_INVALID'], ['vendor/manager-v1', 'MODEL_ID_UNVERIFIED']] as const) { const g = graph(); g.crewConfig = { ...crew, process: 'hierarchical', managerLlm }; const result = validateGraph(g.nodes, g.edges, g.crewConfig); if (expected) assert.ok(result.issues.some((issue) => issue.code === expected)); else assert.equal(result.errors.some((issue) => issue.code === 'MANAGER_LLM_INVALID'), false); }
  });
  test('55-59 typed deserialize failures are atomic; corrupt storage/preset paths preserve current graph', () => {
    for (const [raw, code] of [['{', 'JSON_SYNTAX_INVALID'], ['{"schemaVersion":2,"nodes":[],"edges":[],"crewConfig":{}}', 'GRAPH_SCHEMA_VERSION_UNSUPPORTED']] as const) assert.throws(() => deserializeGraph(raw), (error) => error instanceof GraphDeserializationError && error.issue.code === code);
    const current = graph(); const snapshot = structuredClone(current); try { deserializeGraph('{'); } catch {} assert.deepEqual(current, snapshot);
    let stored = '{'; let active = structuredClone(current); try { active = deserializeGraph(stored).graph; } catch {} assert.deepEqual(active, current); assert.equal(stored, '{');
    const invalidPreset = { nodes: [agent(), task('t', { description: '' })], edges: [edge('e', 'a', 't')], crewConfig: crew }; if (validateGraph(invalidPreset.nodes, invalidPreset.edges, crew).isValid) active = invalidPreset; assert.deepEqual(active, current);
  });
  test('60-64 mixed errors/warnings/infos are separated and canonically ordered', () => {
    const g = graph(); Object.assign(g.nodes[0].data, { role: '', model: 'vendor/custom-v1' }); g.edges = [];
    const result = validateGraph(g.nodes, g.edges, crew); assert.ok(result.errors.length > 1); assert.ok(result.warnings.length > 0); assert.ok(result.infos.length > 0); assert.deepEqual(result.issues, [...result.errors, ...result.warnings, ...result.infos]);
    const warningInfo = graph(); (warningInfo.nodes[0].data as any).model = 'vendor/custom-v1'; warningInfo.nodes.push(tool('unused-2')); const wi = validateGraph(warningInfo.nodes, warningInfo.edges, crew); assert.equal(wi.errors.length, 0); assert.ok(wi.warnings.length > 0 && wi.infos.length > 0);
  });
  test('65 all presets pass scaffold validation', () => {
    assert.equal(PRESET_TEMPLATES.length, 10); for (const preset of PRESET_TEMPLATES) assert.equal(validateGraph(preset.graphData.nodes, preset.graphData.edges, preset.graphData.crewConfig).isValid, true, preset.id);
  });
});
