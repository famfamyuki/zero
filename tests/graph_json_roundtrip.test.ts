import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { deserializeGraph, serializeGraph, toGraphDocument } from '../lib/graph-json';
import { generateProjectFiles, transpileToCrewAI } from '../lib/transpiler/crewai';
import { validateGraph } from '../lib/transpiler/validation';
import { PRESET_TEMPLATES } from '../lib/presets';
import { DEFAULT_LLM_MODEL } from '../lib/models';
import { GraphData } from '../types/editor';

const fixturePath = fileURLToPath(new URL('./fixtures/graph-roundtrip-v1.json', import.meta.url));
const fixtureJson = readFileSync(fixturePath, 'utf8');
const fixtureGraph = deserializeGraph(fixtureJson).graph;

function assertPython(code: string): void {
  execFileSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], {
    input: code,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

describe('Graph JSON v1 persistence contract', () => {
  test('v1 structure, field policy, order, handles and runtime stripping', () => {
    const runtimeGraph = {
      ...fixtureGraph,
      nodes: fixtureGraph.nodes.map((node, index) => ({
        ...node,
        selected: index === 0,
        dragging: false,
        measured: { width: 200, height: 100 },
        style: { opacity: 0.5 },
      })),
      edges: fixtureGraph.edges.map((edge) => ({
        ...edge,
        selected: true,
        style: { stroke: 'red' },
        markerEnd: { type: 'arrowclosed' },
        interactionWidth: 40,
      })),
    } as GraphData;
    const document = toGraphDocument(runtimeGraph);
    assert.deepEqual(Object.keys(document), ['schemaVersion', 'nodes', 'edges', 'crewConfig']);
    assert.equal(document.schemaVersion, 1);
    assert.deepEqual(document.nodes.map((node) => node.id), fixtureGraph.nodes.map((node) => node.id));
    assert.deepEqual(document.edges.map((edge) => edge.id), fixtureGraph.edges.map((edge) => edge.id));
    assert.deepEqual(document.edges[0].sourceHandle, 'out');
    assert.deepEqual(document.edges[0].targetHandle, 'tools');
    assert.deepEqual(Object.keys(document.nodes[0]), ['id', 'type', 'position', 'data']);
    assert.deepEqual(Object.keys(document.edges[0]), ['id', 'source', 'target', 'sourceHandle', 'targetHandle']);
    assert.equal('selected' in document.nodes[0], false);
    assert.equal('measured' in document.nodes[0], false);
    assert.equal('style' in document.nodes[0], false);
    assert.equal('style' in document.edges[0], false);
    assert.match(serializeGraph(runtimeGraph), /^\{\n  "schemaVersion": 1,/);
  });

  test('canonical graph is semantically and byte-identically idempotent', () => {
    const first = serializeGraph(fixtureGraph);
    const secondGraph = deserializeGraph(first).graph;
    const second = serializeGraph(secondGraph);
    assert.equal(first, second);
    assert.deepEqual(secondGraph, fixtureGraph);
    assert.deepEqual(secondGraph.nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
      fixtureGraph.nodes.map(({ id, type, position, data }) => ({ id, type, position, data })));
    assert.equal(secondGraph.nodes[0].data.maxIter, 0);
    assert.equal(secondGraph.nodes[0].data.verbose, false);
    assert.equal(secondGraph.nodes[0].data.futureNodeData instanceof Object, true);
    assert.deepEqual(secondGraph.crewConfig, fixtureGraph.crewConfig);
  });

  test('unknown root and envelope fields are dropped while node.data and crew fields survive', () => {
    const raw = JSON.parse(fixtureJson);
    raw.futureRoot = true;
    raw.nodes[0].futureEnvelope = true;
    raw.edges[0].futureEnvelope = true;
    const output = JSON.parse(serializeGraph(deserializeGraph(JSON.stringify(raw)).graph));
    assert.equal(output.futureRoot, undefined);
    assert.equal(output.nodes[0].futureEnvelope, undefined);
    assert.equal(output.edges[0].futureEnvelope, undefined);
    assert.deepEqual(output.nodes[0].data.futureNodeData, { enabled: true });
    assert.equal(output.crewConfig.futureCrewSetting, 'preserved');
  });

  test('rejects future, malformed, duplicate and structurally invalid input', () => {
    assert.throws(() => deserializeGraph('{'), /Invalid JSON/);
    assert.throws(() => deserializeGraph('[]'), /root/);
    assert.throws(() => deserializeGraph(JSON.stringify({ schemaVersion: 2, nodes: [], edges: [], crewConfig: {} })), /Unsupported/);
    const malformedNode = JSON.parse(fixtureJson);
    malformedNode.nodes[0].position.x = null;
    assert.throws(() => deserializeGraph(JSON.stringify(malformedNode)), /finite/);
    const duplicateNode = JSON.parse(fixtureJson);
    duplicateNode.nodes[1].id = duplicateNode.nodes[0].id;
    assert.throws(() => deserializeGraph(JSON.stringify(duplicateNode)), /Duplicate node/);
    const duplicateEdge = JSON.parse(fixtureJson);
    duplicateEdge.edges[1].id = duplicateEdge.edges[0].id;
    assert.throws(() => deserializeGraph(JSON.stringify(duplicateEdge)), /Duplicate edge/);
  });

  test('legacy aliases, field migrations, falsy values and defaults are deterministic', () => {
    const legacy = {
      nodes: [
        { id: 'a', type: 'LegacyAgentNode', position: { x: 0, y: 0 }, data: { name: 'A', llm: 'legacy-model', verbose: false, allowDelegation: false } },
        { id: 't', type: 'TASK_NODE', position: { x: 1, y: 2 }, data: { name: '', asyncExecution: false } },
        { id: 'x', type: 'tool-widget', position: { x: 3, y: 4 }, data: { name: 'X' } },
      ],
      edges: [],
    };
    const result = deserializeGraph(JSON.stringify(legacy));
    assert.equal(result.migratedFromLegacy, true);
    assert.deepEqual(result.graph.nodes.map((node) => node.type), ['agent', 'task', 'tool']);
    assert.equal(result.graph.nodes[0].data.model, 'legacy-model');
    assert.equal(result.graph.nodes[0].data.label, 'A');
    assert.equal(result.graph.nodes[0].data.verbose, false);
    assert.equal(result.graph.nodes[1].data.label, '');
    assert.deepEqual(result.graph.crewConfig, { name: 'My Crew', process: 'sequential', verbose: true, memory: false });
    assert.equal(JSON.parse(serializeGraph(result.graph)).schemaVersion, 1);

    const missingAgentDefaults = { ...legacy, nodes: [{ id: 'a', type: 'agent', position: { x: 0, y: 0 }, data: {} }] };
    const defaulted = deserializeGraph(JSON.stringify(missingAgentDefaults)).graph.nodes[0].data;
    assert.equal(defaulted.model, DEFAULT_LLM_MODEL);
    assert.equal(defaulted.label, 'New Agent');
    assert.equal(defaulted.verbose, true);
    assert.equal(defaulted.allowDelegation, false);
    assert.throws(() => deserializeGraph(JSON.stringify({ ...legacy, nodes: [{ id: 'z', type: 'mystery', position: { x: 0, y: 0 }, data: {} }] })), /Unsupported legacy/);
  });

  test('failed parse cannot mutate caller state', () => {
    let current = fixtureGraph;
    let historyWrites = 0;
    let storageWrites = 0;
    let analyticsWrites = 0;
    const importIfValid = (json: string) => {
      const result = deserializeGraph(json);
      current = result.graph;
      historyWrites += 1;
      storageWrites += 1;
      analyticsWrites += 1;
    };
    assert.throws(() => importIfValid('{'));
    assert.equal(current, fixtureGraph);
    assert.deepEqual([historyWrites, storageWrites, analyticsWrites], [0, 0, 0]);
  });

  test('CrewAI scaffold, production, project files and validation are unchanged', () => {
    const roundTripped = deserializeGraph(serializeGraph(fixtureGraph)).graph;
    const beforeValidation = validateGraph(fixtureGraph.nodes, fixtureGraph.edges, fixtureGraph.crewConfig);
    const afterValidation = validateGraph(roundTripped.nodes, roundTripped.edges, roundTripped.crewConfig);
    assert.deepEqual(afterValidation, beforeValidation);
    assert.equal(beforeValidation.isValid, true);

    for (const mode of ['scaffold', 'production'] as const) {
      const beforeCode = transpileToCrewAI(fixtureGraph.nodes, fixtureGraph.edges, fixtureGraph.crewConfig, mode);
      const afterCode = transpileToCrewAI(roundTripped.nodes, roundTripped.edges, roundTripped.crewConfig, mode);
      assert.equal(afterCode, beforeCode);
      assertPython(afterCode);
      const beforeProject = generateProjectFiles(fixtureGraph.nodes, fixtureGraph.edges, fixtureGraph.crewConfig, mode);
      const afterProject = generateProjectFiles(roundTripped.nodes, roundTripped.edges, roundTripped.crewConfig, mode);
      assert.deepEqual(afterProject.files.map(({ path, content }) => ({ path, content })),
        beforeProject.files.map(({ path, content }) => ({ path, content })));
      afterProject.files.filter((file) => file.path.endsWith('.py')).forEach((file) => assertPython(file.content));
    }
  });

  test('every preset round-trips and keeps generated outputs equivalent', () => {
    for (const preset of PRESET_TEMPLATES) {
      const graph = preset.graphData;
      const roundTripped = deserializeGraph(serializeGraph(graph)).graph;
      assert.equal(serializeGraph(roundTripped), serializeGraph(graph), preset.id);
      assert.deepEqual(validateGraph(roundTripped.nodes, roundTripped.edges, roundTripped.crewConfig),
        validateGraph(graph.nodes, graph.edges, graph.crewConfig), preset.id);
      for (const mode of ['scaffold', 'production'] as const) {
        const before = generateProjectFiles(graph.nodes, graph.edges, graph.crewConfig, mode);
        const after = generateProjectFiles(roundTripped.nodes, roundTripped.edges, roundTripped.crewConfig, mode);
        assert.deepEqual(after.files.map(({ path, content }) => ({ path, content })),
          before.files.map(({ path, content }) => ({ path, content })), `${preset.id}:${mode}`);
        after.files.filter((file) => file.path.endsWith('.py')).forEach((file) => assertPython(file.content));
      }
    }
  });

  test('legacy LocalStorage payload rehydrates and becomes canonical v1', () => {
    const legacyStorage = JSON.stringify({ nodes: fixtureGraph.nodes, edges: fixtureGraph.edges, crewConfig: fixtureGraph.crewConfig });
    const rehydrated = deserializeGraph(legacyStorage);
    assert.equal(rehydrated.migratedFromLegacy, true);
    const nextWrite = serializeGraph(rehydrated.graph);
    assert.equal(JSON.parse(nextWrite).schemaVersion, 1);
    assert.equal(serializeGraph(deserializeGraph(nextWrite).graph), nextWrite);
  });
});
