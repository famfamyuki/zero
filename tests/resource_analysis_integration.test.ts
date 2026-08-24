import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResourceAnalysisEntryButton } from '../components/editor/resource-analysis/ResourceAnalysisEntryButton';
import { resolvePreflightNavigationTarget, shouldIgnoreSelectionChangeForOpenPreflight } from '../lib/preflight-navigation';

const page = () => readFileSync('app/page.tsx', 'utf8');
const canvas = () => readFileSync('components/editor/Canvas.tsx', 'utf8');

test('legacy Resource Analysis entry remains compile-compatible outside Canvas', () => {
  const html = renderToStaticMarkup(React.createElement(ResourceAnalysisEntryButton, { lang: 'en', isOpen: false, onActivate() {} }));
  assert.match(html, /Resource Analysis/); assert.match(html, /resource-analysis-panel/);
});

test('generic navigation keeps task, tool, crew, and missing semantics', () => {
  const nodes = [{ id: 'task-1', type: 'task' }, { id: 'tool-1', type: 'tool' }] as any;
  assert.equal(resolvePreflightNavigationTarget({ type: 'task', id: 'task-1' }, nodes).kind, 'node');
  assert.equal(resolvePreflightNavigationTarget({ type: 'tool', id: 'tool-1' }, nodes).kind, 'node');
  assert.equal(resolvePreflightNavigationTarget({ type: 'crew' }, nodes).kind, 'crew');
  assert.equal(resolvePreflightNavigationTarget({ type: 'agent', id: 'task-1' }, nodes).kind, 'missing');
});

test('Canvas exposes one Unified entry and no standalone preflight entries', () => {
  const source = canvas();
  assert.equal((source.match(/<UnifiedPreflightEntryButton/g) ?? []).length, 1);
  assert.doesNotMatch(source, /<ReadinessEntryButton|<ExecutionPreviewEntryButton|<ResourceAnalysisEntryButton/);
});

test('page composes source evaluations only through useUnifiedPreflight', () => {
  const source = page();
  assert.match(source, /const preflight = useUnifiedPreflight\(readinessGraph\)/);
  assert.doesNotMatch(source, /useReadinessEvaluation\(|useExecutionPreview\(|useResourceAnalysis\(/);
  assert.match(source, /preflight\.evaluateAll\(\)/);
});

test('Unified owner is claimed before opening and suppresses passive selection', () => {
  const source = page();
  const open = source.slice(source.indexOf('const handleOpenPreflightReview'), source.indexOf('const handlePreflightStageChange'));
  assert.ok(open.indexOf("preflightSelectionOwnerRef.current = 'unified_preflight'") < open.indexOf('setIsPreflightReviewOpen(true)'));
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight('unified_preflight'), true);
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight(null), false);
});

test('Resource Locate success closes Unified while missing refreshes in place', () => {
  const source = page();
  const locate = source.slice(source.indexOf('const handleLocateResourceAnalysis'), source.indexOf('const handleLocateFinding'));
  const missing = locate.slice(locate.indexOf("target.kind === 'missing'"), locate.indexOf('preflightSelectionOwnerRef.current = null'));
  assert.match(missing, /resourceAnalysis\.evaluateNow\(\)/); assert.doesNotMatch(missing, /setIsPreflightReviewOpen\(false\)/);
  assert.match(locate, /setIsPreflightReviewOpen\(false\)/); assert.match(locate, /focus-flow-node/); assert.match(locate, /focus-inspector-heading/);
});

test('existing Resource analytics remains interaction-owned alongside D1 Unified events', () => {
  const source = page();
  assert.match(source, /resource_analysis_opened/); assert.match(source, /resource_analysis_hotspot_selected/);
  assert.match(source, /preflight_review_opened/);
  assert.match(source, /preflight_review_stage_selected/);
  assert.match(source, /preflight_review_re_evaluated/);
});

test('Unified integration adds no persistence or semantic coupling', () => {
  for (const file of ['components/editor/unified-preflight/UnifiedPreflightPanel.tsx', 'components/editor/unified-preflight/UnifiedPreflightOverview.tsx']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /localStorage|serializeGraph|validateGraph|createSemanticPlan|createExecutionPreviewReadModel|createResourceAnalysisReadModel/);
  }
});
