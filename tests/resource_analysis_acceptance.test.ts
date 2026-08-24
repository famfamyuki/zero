import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResourceAnalysisPanel } from '../components/editor/resource-analysis/ResourceAnalysisPanel';
import { serializeGraph } from '../lib/graph-json';
import { PRESET_TEMPLATES } from '../lib/presets';
import { evaluateResourceAnalysis } from '../lib/resource-analysis-evaluation';
import { transpileToCrewAI } from '../lib/transpiler/crewai';

const graph = PRESET_TEMPLATES[0].graphData;

test('valid GraphData crosses evaluation and read-model boundaries into the fixed panel section order', () => {
  const state = evaluateResourceAnalysis(graph);
  assert.equal(state.status, 'available');
  if (state.status !== 'available') return;
  assert.equal(state.result.version, '0.1.0');

  const html = renderToStaticMarkup(React.createElement(ResourceAnalysisPanel, {
    isOpen: true,
    state,
    isRefreshing: false,
    lang: 'en',
    notice: null,
    onClose() {},
    onRetry() {},
    onOpenValidation() {},
    onLocate() { return true; },
  }));
  const sections = [
    'Overview',
    'Structural metrics',
    'Structural hotspots',
    'Models',
    'Agent execution guards',
    'Task metrics',
    'Tool bindings',
    'Runtime unknowns',
  ];
  let previous = -1;
  for (const section of sections) {
    const index = html.indexOf(section);
    assert.ok(index > previous, `${section} must follow the preceding v0 section`);
    previous = index;
  }
});

test('Resource Analysis evaluation is neutral to canonical persistence and CrewAI output', () => {
  const jsonBefore = serializeGraph(graph);
  const scaffoldBefore = transpileToCrewAI(graph.nodes, graph.edges, graph.crewConfig, 'scaffold');

  const state = evaluateResourceAnalysis(graph);
  assert.equal(state.status, 'available');

  assert.equal(serializeGraph(graph), jsonBefore);
  assert.equal(
    transpileToCrewAI(graph.nodes, graph.edges, graph.crewConfig, 'scaffold'),
    scaffoldBefore
  );
});
