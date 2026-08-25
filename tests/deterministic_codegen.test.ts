import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { Edge } from '@xyflow/react';
import { CrewConfig, CustomNode, GraphData } from '../types/editor';
import { generateProjectFiles, getRequiredEnvVars, transpileToCrewAI } from '../lib/transpiler/crewai';
import { validateGraph } from '../lib/transpiler/validation';
import { PRESET_TEMPLATES } from '../lib/presets';
import { deserializeGraph, serializeGraph } from '../lib/graph-json';

const config: CrewConfig = { name: 'Deterministic Crew', process: 'sequential', verbose: true, memory: false };
const agent = (id: string, role = 'Worker', model = 'gpt-5.6-terra'): CustomNode => ({ id, type: 'agent', position: { x: 1, y: 1 }, data: { label: role, role, goal: 'Work', backstory: 'Expert', model, verbose: true, allowDelegation: false } });
const task = (id: string, label = 'Task', y = 0, extra: Record<string, unknown> = {}): CustomNode => ({ id, type: 'task', position: { x: 2, y }, data: { label, description: 'Do work', expectedOutput: 'Result', asyncExecution: false, ...extra } });
const tool = (id: string, label: string, toolType = 'FileReadTool', parameters?: Record<string, string>): CustomNode => ({ id, type: 'tool', position: { x: 0, y: 0 }, data: { label, toolType, description: 'Tool', parameters } as any });
const edge = (id: string, source: string, target: string): Edge => ({ id, source, target });
const reverse = <T>(items: T[]) => [...items].reverse();
const rotate = <T>(items: T[]) => items.length < 2 ? [...items] : [...items.slice(1), items[0]];
const files = (graph: GraphData, mode: 'scaffold' | 'production' = 'scaffold') => generateProjectFiles(graph.nodes, graph.edges, graph.crewConfig, mode).files.map(({ path, content }) => ({ path, content }));
const astValid = (content: string) => execFileSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], {
  input: content,
  env: { ...process.env, PYTHONUTF8: '1' },
});

function graph(): GraphData {
  const nodes = [agent('agent-b', 'Same', 'anthropic/claude-sonnet-4-6'), agent('agent-a', 'Same', 'gpt-5.6-terra'), tool('tool-b', 'Read', 'DirectoryReadTool', { directory: '{source_directory}' }), tool('tool-a', 'Read', 'FileReadTool', { file_path: '{source_file}' }), task('task-b', 'Same', 10), task('task-a', 'Same', 10), task('task-c', 'Result', -10, { outputFormat: 'json', outputSchema: '{"summary":"string"}' })];
  const edges = [edge('e1', 'agent-a', 'task-a'), edge('e2', 'agent-b', 'task-b'), edge('e3', 'agent-a', 'task-c'), edge('e4', 'tool-b', 'agent-a'), edge('e5', 'tool-a', 'agent-a'), edge('e6', 'tool-b', 'task-c'), edge('e7', 'tool-a', 'task-c'), edge('e8', 'task-a', 'task-c'), edge('e9', 'task-b', 'task-c')];
  return { nodes, edges, crewConfig: config };
}

describe('Packet B deterministic codegen boundary', () => {
  test('1-6 same, reversed, rotated, and combined permutations are byte-identical', () => {
    const base = graph(); const expected = files(base);
    for (const candidate of [{ ...base }, { ...base, nodes: reverse(base.nodes) }, { ...base, nodes: rotate(base.nodes) }, { ...base, edges: reverse(base.edges) }, { ...base, edges: rotate(base.edges) }, { ...base, nodes: rotate(base.nodes), edges: reverse(base.edges) }]) assert.deepEqual(files(candidate), expected);
  });
  test('7-10 task order uses ID tie-break, dependencies, and stable predecessor rank', () => {
    const base = graph(); const code = transpileToCrewAI(base.nodes, base.edges, base.crewConfig);
    assert.ok(code.indexOf('same_task = Task(') < code.indexOf('same_task_2 = Task('));
    assert.ok(code.indexOf('same_task_2 = Task(') < code.indexOf('result_task = Task('));
    assert.match(code, /context=\[same_task, same_task_2\]/);
    assert.equal(code, transpileToCrewAI(base.nodes, reverse(base.edges), base.crewConfig));
  });
  test('11-12 and 37-38 tool imports and Agent/Task bindings are stable', () => {
    const code = transpileToCrewAI(graph().nodes, reverse(graph().edges), config);
    assert.match(code, /tools=\[read_1, read_2\]/);
    assert.match(code, /from crewai_tools import \(\n    DirectoryReadTool,\n    FileReadTool/);
  });
  test('13-21 duplicate, cross-kind, empty, Japanese, punctuation, numeric, and keyword names are AST-valid and unique', () => {
    const names = ['', '日本語', '!!!', '123abc', 'class', 'Same'];
    const nodes: CustomNode[] = []; const edges: Edge[] = [];
    names.forEach((name, index) => { nodes.push(agent(`a${index}`, name || 'Worker'), task(`t${index}`, name, index)); edges.push(edge(`e${index}`, `a${index}`, `t${index}`)); });
    nodes.push(tool('z1', 'Same'), tool('z2', 'Same'));
    const code = transpileToCrewAI(nodes, edges, config); astValid(code);
    const assigned = [...code.matchAll(/^([a-zA-Z_][a-zA-Z0-9_]*) = (?:Agent|Task|\w+Tool)\(/gm)].map((match) => match[1]);
    assert.equal(new Set(assigned).size, assigned.length);
  });
  test('22 Python keyword output schema field is rejected', () => {
    const nodes = [agent('a'), task('t', 'T', 0, { outputFormat: 'json', outputSchema: '{"class":"string"}' })];
    assert.ok(validateGraph(nodes, [edge('e', 'a', 't')], config).errors.some((item) => item.code === 'INVALID_OUTPUT_SCHEMA'));
  });
  test('23-24 multi-provider and sanitization-colliding model variables are deterministic and unique', () => {
    const nodes = [agent('a', 'A', 'vendor/a-b'), agent('b', 'B', 'vendor/a_b'), task('ta'), task('tb')]; const edges = [edge('1', 'a', 'ta'), edge('2', 'b', 'tb')];
    const code = transpileToCrewAI(reverse(nodes), edges, config); assert.match(code, /llm_vendor_a_b = LLM/); assert.match(code, /llm_vendor_a_b_2 = LLM/);
  });
  test('25-29 assignment mappings dedupe, support both directions, and reject conflicts/bad references', () => {
    const nodes = [agent('a'), agent('b'), task('t')];
    assert.equal(validateGraph(nodes, [edge('1', 'a', 't')], config).taskAgentMap.t, 'a');
    assert.equal(validateGraph(nodes, [edge('1', 't', 'a')], config).taskAgentMap.t, 'a');
    assert.ok(validateGraph(nodes, [edge('1', 'a', 't'), edge('2', 'b', 't')], config).errors.some((item) => item.code === 'MULTIPLE_AGENTS_PER_TASK'));
    for (const assignedAgentId of ['missing', 't']) { const bad = structuredClone(nodes); (bad[2].data as any).assignedAgentId = assignedAgentId; assert.ok(validateGraph(bad, [], config).errors.some((item) => item.code === 'INVALID_ASSIGNED_AGENT_REFERENCE')); }
  });
  test('30-32 hierarchical manager is explicit/defaulted and tasks omit agent=', () => {
    const nodes = [agent('a'), task('t')]; const edges = [edge('e', 'a', 't')];
    for (const managerLlm of ['anthropic/claude-sonnet-4-6', undefined]) { const hierarchical = { ...config, process: 'hierarchical' as const, managerLlm }; const code = transpileToCrewAI(nodes, edges, hierarchical); assert.match(code, /manager_llm=llm/); assert.doesNotMatch(code.slice(code.indexOf('task_task = Task('), code.indexOf('# 6. Crew')), /agent=/); }
  });
  test('33-35 Ollama mapping/key boundary and unknown custom models are preserved', () => {
    const nodes = [agent('a', 'A', 'ollama/llama3.3'), task('t')]; const code = transpileToCrewAI(nodes, [edge('e', 'a', 't')], config);
    assert.match(code, /base_url="http:\/\/localhost:11434"/); assert.deepEqual(getRequiredEnvVars(nodes, config), []);
    assert.match(transpileToCrewAI([agent('a', 'A', 'vendor/custom-v1'), task('t')], [edge('e', 'a', 't')], config), /model="vendor\/custom-v1"/);
  });
  test('36 unknown Tool type fails without output', () => {
    const nodes = [agent('a'), task('t'), tool('x', 'X', 'UnknownTool')]; const result = generateProjectFiles(nodes, [edge('1', 'a', 't')], config);
    assert.ok(result.validation.errors.some((item) => item.code === 'UNSUPPORTED_TOOL_TYPE')); assert.deepEqual(result.files, []);
  });
  test('39-40 JSON round-trip and round-trip permutation remain byte-identical', () => {
    const base = graph(); const roundTrip = deserializeGraph(serializeGraph(base)).graph;
    assert.deepEqual(files(roundTrip), files(base)); assert.deepEqual(files({ ...roundTrip, nodes: reverse(roundTrip.nodes), edges: rotate(roundTrip.edges) }), files(base));
  });
  test('41-45 presets are AST-valid, permutation-equivalent in valid modes, and file paths stable', () => {
    for (const preset of PRESET_TEMPLATES) {
      const base = preset.graphData; const expected = files(base); assert.deepEqual(files({ ...base, nodes: reverse(base.nodes) }), expected); assert.deepEqual(files({ ...base, edges: reverse(base.edges) }), expected);
      for (const file of generateProjectFiles(base.nodes, base.edges, base.crewConfig).files.filter((item) => item.path.endsWith('.py'))) astValid(file.content);
      if (generateProjectFiles(base.nodes, base.edges, base.crewConfig, 'production').validation.isValid) assert.deepEqual(files({ ...base, nodes: rotate(base.nodes), edges: rotate(base.edges) }, 'production'), files(base, 'production'));
      assert.deepEqual(generateProjectFiles(base.nodes, base.edges, base.crewConfig).files.map((item) => item.path), generateProjectFiles(reverse(base.nodes), reverse(base.edges), base.crewConfig).files.map((item) => item.path));
    }
  });
});
