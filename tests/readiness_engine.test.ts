import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Edge } from '@xyflow/react';
import type { CrewConfig, CustomNode, GraphData } from '../types/editor';
import { deserializeGraph, serializeGraph } from '../lib/graph-json';
import { PRESET_TEMPLATES } from '../lib/presets';
import { evaluateReadiness, READINESS_RULESET_VERSION } from '../lib/readiness';

const crew = (extra: Partial<CrewConfig> = {}): CrewConfig => ({ name: 'Ready Crew', process: 'sequential', verbose: true, memory: false, ...extra });
const agent = (id = 'a', extra: Record<string, unknown> = {}): CustomNode => ({ id, type: 'agent', position: { x: 0, y: 0 }, data: { label: 'Agent', role: 'Worker', goal: 'Work', backstory: 'Expert', model: 'gpt-5.6-terra', verbose: true, allowDelegation: false, ...extra } });
const task = (id = 't', extra: Record<string, unknown> = {}, y = 0): CustomNode => ({ id, type: 'task', position: { x: 1, y }, data: { label: 'Task', description: 'Do work', expectedOutput: 'Result', asyncExecution: false, ...extra } });
const tool = (id = 'x', extra: Record<string, unknown> = {}): CustomNode => ({ id, type: 'tool', position: { x: 0, y: 1 }, data: { label: 'Tool', toolType: 'FileReadTool', description: 'Read', parameters: {}, ...extra } as any });
const edge = (id: string, source: string, target: string): Edge => ({ id, source, target });
const minimal = (): GraphData => ({ nodes: [agent(), task()], edges: [edge('at', 'a', 't')], crewConfig: crew() });
const reverse = <T>(items: T[]) => [...items].reverse();
const rotate = <T>(items: T[]) => items.length < 2 ? [...items] : [...items.slice(1), items[0]];
const findings = (graph: GraphData, ruleId: string) => evaluateReadiness(graph).findings.filter((finding) => finding.ruleId === ruleId);

describe('Packet D Readiness v0 rule engine', () => {
  test('1-10 minimal, invalid, statuses, categories and counts', () => {
    const ready = evaluateReadiness(minimal()); assert.equal(ready.rulesetVersion, READINESS_RULESET_VERSION); assert.equal(ready.evaluable, true); assert.equal(ready.status, 'ready'); assert.equal(ready.counts.total, 0);
    const invalid = minimal(); (invalid.nodes[0].data as any).role = ''; const blocked = evaluateReadiness(invalid); assert.equal(blocked.evaluable, false); assert.equal(blocked.status, 'not_evaluable'); assert.deepEqual(blocked.findings, []); assert.deepEqual(blocked.blockedByValidationCodes, ['AGENT_ROLE_MISSING']);
    const medium = minimal(); medium.nodes.push(tool()); assert.equal(evaluateReadiness(medium).status, 'needs_attention');
    const high = minimal(); high.nodes.push(tool('c', { toolType: 'CustomTool' })); high.edges.push(edge('ca', 'c', 'a')); assert.equal(evaluateReadiness(high).status, 'needs_improvement');
    const low = minimal(); low.crewConfig.name = ''; assert.equal(evaluateReadiness(low).status, 'ready'); assert.equal(evaluateReadiness(low).counts.low, 1);
    const info = minimal(); (info.nodes[0].data as any).model = 'vendor/custom-v1'; assert.equal(evaluateReadiness(info).status, 'ready'); assert.equal(evaluateReadiness(info).counts.info, 1);
    const category = evaluateReadiness(high).categories.find((item) => item.category === 'tooling'); assert.equal(category?.status, 'needs_improvement'); assert.equal(category?.counts.high, 1);
  });

  test('11-17 repeated, node/edge permutations, and JSON round-trip are deepEqual', () => {
    const base = minimal(); base.nodes.push(tool('x'), tool('y')); base.edges.push(edge('xa', 'x', 'a'), edge('ya', 'y', 'a'), edge('dup', 'x', 'a')); (base.nodes[0].data as any).model = 'vendor/custom-v1';
    const expected = evaluateReadiness(base);
    for (const candidate of [base, { ...base, nodes: reverse(base.nodes) }, { ...base, nodes: rotate(base.nodes) }, { ...base, edges: reverse(base.edges) }, { ...base, edges: rotate(base.edges) }, { ...base, nodes: rotate(base.nodes), edges: reverse(base.edges) }, deserializeGraph(serializeGraph(base)).graph]) assert.deepEqual(evaluateReadiness(candidate), expected);
  });

  test('18-21 empty crew and Agent/Task/Tool labels', () => {
    const graph = minimal(); graph.crewConfig.name = ''; (graph.nodes[0].data as any).label = ''; (graph.nodes[1].data as any).label = ''; graph.nodes.push(tool('x', { label: '' })); graph.edges.push(edge('xa', 'x', 'a'));
    const result = evaluateReadiness(graph); assert.equal(findings(graph, 'RDY_CREW_NAME_EMPTY').length, 1); assert.deepEqual(findings(graph, 'RDY_NODE_LABEL_EMPTY').map((item) => item.target.nodeId), ['a', 't', 'x']); assert.equal(result.status, 'ready');
  });

  test('22-28 unused mappings, duplicate/legacy edges, and redundant assignment channels', () => {
    const unusedAgent = minimal(); unusedAgent.nodes.push(agent('b')); assert.equal(findings(unusedAgent, 'RDY_AGENT_UNUSED').length, 1);
    unusedAgent.crewConfig.process = 'hierarchical'; unusedAgent.crewConfig.managerLlm = 'gpt-5.6-terra'; assert.equal(findings(unusedAgent, 'RDY_AGENT_UNUSED').length, 0);
    const unusedTool = minimal(); unusedTool.nodes.push(tool()); assert.equal(findings(unusedTool, 'RDY_TOOL_UNUSED').length, 1);
    const duplicate = minimal(); duplicate.edges.push(edge('at2', 'a', 't')); assert.equal(findings(duplicate, 'RDY_DUPLICATE_SEMANTIC_EDGE').length, 1);
    const legacy = minimal(); legacy.edges = [edge('ta', 't', 'a')]; assert.equal(findings(legacy, 'RDY_LEGACY_TASK_AGENT_EDGE').length, 1);
    const assignedAndEdge = minimal(); (assignedAndEdge.nodes[1].data as any).assignedAgentId = 'a'; assert.equal(findings(assignedAndEdge, 'RDY_REDUNDANT_AGENT_ASSIGNMENT').length, 1);
    const bothDirections = minimal(); bothDirections.edges.push(edge('ta', 't', 'a')); assert.equal(findings(bothDirections, 'RDY_REDUNDANT_AGENT_ASSIGNMENT').length, 1);
  });

  test('29-32 hierarchical manager and ignored assignment channels', () => {
    const implicit = minimal(); implicit.crewConfig = crew({ process: 'hierarchical' }); implicit.edges = []; assert.equal(findings(implicit, 'RDY_HIERARCHICAL_MANAGER_IMPLICIT').length, 1); assert.equal(findings(implicit, 'RDY_HIERARCHICAL_ASSIGNMENT_IGNORED').length, 0);
    for (const channel of ['assigned', 'forward', 'reverse'] as const) { const graph = minimal(); graph.crewConfig = crew({ process: 'hierarchical', managerLlm: 'gpt-5.6-terra' }); graph.edges = []; if (channel === 'assigned') (graph.nodes[1].data as any).assignedAgentId = 'a'; if (channel === 'forward') graph.edges.push(edge('at', 'a', 't')); if (channel === 'reverse') graph.edges.push(edge('ta', 't', 'a')); assert.equal(findings(graph, 'RDY_HIERARCHICAL_ASSIGNMENT_IGNORED').length, 1, channel); }
  });

  test('33-39 custom model/tool, output contracts, collision and safety mapping', () => {
    const customModel = minimal(); (customModel.nodes[0].data as any).model = 'vendor/custom-v1'; const modelFinding = findings(customModel, 'RDY_CUSTOM_MODEL_UNVERIFIED')[0]; assert.equal(modelFinding.impact, 'info'); assert.deepEqual(modelFinding.source, { kind: 'validation', validationCode: 'MODEL_ID_UNVERIFIED' });
    const customTool = minimal(); customTool.nodes.push(tool('c', { toolType: 'CustomTool' })); customTool.edges.push(edge('ca', 'c', 'a')); assert.equal(findings(customTool, 'RDY_CUSTOM_TOOL_STUB').length, 1);
    const implicitSchema = minimal(); Object.assign(implicitSchema.nodes[1].data, { outputFormat: 'json', outputSchema: ' ' }); assert.equal(findings(implicitSchema, 'RDY_JSON_OUTPUT_SCHEMA_IMPLICIT').length, 1);
    const mismatch = minimal(); Object.assign(mismatch.nodes[1].data, { expectedOutput: 'Return a JSON schema', outputFormat: 'text' }); assert.equal(findings(mismatch, 'RDY_STRUCTURED_OUTPUT_MISMATCH').length, 1);
    const collision = minimal(); collision.nodes.push(task('t2', { outputFile: ' result.md ' }, 2)); (collision.nodes[1].data as any).outputFile = 'result.md'; collision.edges.push(edge('at2', 'a', 't2')); const collisionFinding = findings(collision, 'RDY_OUTPUT_FILE_COLLISION')[0]; assert.deepEqual(collisionFinding.evidence, { taskIds: ['t', 't2'], outputFile: 'result.md' });
    (collision.nodes[2].data as any).outputFile = 'Result.md'; assert.equal(findings(collision, 'RDY_OUTPUT_FILE_COLLISION').length, 0);
    const safety = minimal(); (safety.nodes[1].data as any).description = 'Run in an isolated sandbox environment'; assert.equal(findings(safety, 'RDY_SAFETY_CLAIM_UNENFORCED').length, 1);
  });

  test('40-45 explicit non-rules remain absent', () => {
    const graph = minimal(); (graph.nodes[0].data as any).goal = 'x'; (graph.nodes[0].data as any).backstory = 'y'; assert.equal(evaluateReadiness(graph).findings.some((finding) => finding.ruleId.includes('WITHOUT_TOOLS')), false);
    const hierarchical = minimal(); hierarchical.crewConfig = crew({ process: 'hierarchical', managerLlm: 'gpt-5.6-terra' }); hierarchical.edges = []; assert.equal(evaluateReadiness(hierarchical).status, 'ready');
    const large = syntheticGraph(60); assert.equal(evaluateReadiness(large).findings.some((finding) => finding.ruleId.includes('COMPLEX')), false);
    const deep = syntheticGraph(8); for (let index = 0; index < 7; index++) deep.edges.push(edge(`d${index}`, `t${index}`, `t${index + 1}`)); assert.equal(evaluateReadiness(deep).evaluable, true);
  });

  test('46-47 Packet A fixture is evaluable and round-trip stable', () => {
    const fixture = deserializeGraph(readFileSync(new URL('./fixtures/graph-roundtrip-v1.json', import.meta.url), 'utf8')).graph; const expected = evaluateReadiness(fixture); assert.equal(expected.evaluable, true); assert.deepEqual(evaluateReadiness(deserializeGraph(serializeGraph(fixture)).graph), expected);
  });

  test('48-51 all presets are evaluable and permutation-stable', () => {
    assert.equal(PRESET_TEMPLATES.length, 10); for (const preset of PRESET_TEMPLATES) { const graph = preset.graphData; const expected = evaluateReadiness(graph); assert.equal(expected.evaluable, true, preset.id); assert.deepEqual(evaluateReadiness(graph), expected); assert.deepEqual(evaluateReadiness({ ...graph, nodes: reverse(graph.nodes) }), expected); assert.deepEqual(evaluateReadiness({ ...graph, edges: reverse(graph.edges) }), expected); }
  });

  test('52-53 Ollama and custom model graphs remain evaluable', () => {
    for (const model of ['ollama/llama3.3', 'vendor/custom-v1']) { const graph = minimal(); (graph.nodes[0].data as any).model = model; assert.equal(evaluateReadiness(graph).evaluable, true); }
  });

  test('54-56 120-node graph evaluates, reverses identically, and is not mutated', () => {
    const graph = syntheticGraph(60); const snapshot = structuredClone(graph); const expected = evaluateReadiness(graph); assert.equal(graph.nodes.length, 120); assert.equal(expected.evaluable, true); assert.deepEqual(evaluateReadiness({ ...graph, nodes: reverse(graph.nodes), edges: reverse(graph.edges) }), expected); assert.deepEqual(graph, snapshot);
  });
});

function syntheticGraph(size: number): GraphData {
  const nodes: CustomNode[] = []; const edges: Edge[] = [];
  for (let index = 0; index < size; index++) { nodes.push(agent(`a${index}`, { label: `Agent ${index}` }), task(`t${index}`, { label: `Task ${index}` }, index)); edges.push(edge(`a${index}-t${index}`, `a${index}`, `t${index}`)); }
  return { nodes, edges, crewConfig: crew() };
}
