import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { PRESET_TEMPLATES } from '../lib/presets';
import { evaluateReadiness } from '../lib/readiness';
import { validateGraph } from '../lib/transpiler/validation';
import { serializeGraph, deserializeGraph } from '../lib/graph-json';
import type { TaskNodeData } from '../types/editor';

test('launch example retains the exact medium finding; manual schema fix remains valid and portable', () => {
  const graph = structuredClone(PRESET_TEMPLATES.find((preset) => preset.id === 'competitor-price-monitor')!.graphData);
  const canonical = (result: ReturnType<typeof evaluateReadiness>) => result.findings.filter((finding) => finding.ruleId === 'RDY_JSON_OUTPUT_SCHEMA_IMPLICIT' && finding.target.nodeId === 'task-5' && finding.target.field === 'outputSchema');
  assert.equal(graph.crewConfig.name, 'Competitor Catalog Review Crew');
  assert.equal(canonical(evaluateReadiness(graph)).length, 1);
  assert.equal(canonical(evaluateReadiness(graph))[0].impact, 'medium');
  const task = graph.nodes.find((node) => node.id === 'task-5')!;
  (task.data as TaskNodeData).outputSchema = '{"snapshot_metadata":"object","products":"array[object]"}';
  assert.equal(canonical(evaluateReadiness(graph)).length, 0);
  assert.equal(validateGraph(graph.nodes, graph.edges, graph.crewConfig).isValid, true);
  assert.deepEqual(deserializeGraph(serializeGraph(graph)).graph, graph);
});

test('repository social image is a 1200 by 630 PNG with bounded source content', () => {
  const png = readFileSync('public/launch-preview.png');
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const source = readFileSync('public/launch-preview.svg', 'utf8');
  for (const text of ['AgentGraph Studio', 'Understand → Evaluate → Improve → Verify → Own', 'Deterministic Preflight · Portable Export']) assert.ok(source.includes(text));
  assert.doesNotMatch(source, /Powered by GPT-6 Astra|Astra-powered|runs on Astra/i);
});
