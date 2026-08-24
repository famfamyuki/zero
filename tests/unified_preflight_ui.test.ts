import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UnifiedPreflightEntryButton } from '../components/editor/unified-preflight/UnifiedPreflightEntryButton';

test('single entry has localized labels, touch target, and ARIA contract', () => {
  const en = renderToStaticMarkup(React.createElement(UnifiedPreflightEntryButton, { lang: 'en', isOpen: true, onActivate() {} }));
  const ja = renderToStaticMarkup(React.createElement(UnifiedPreflightEntryButton, { lang: 'ja', isOpen: false, compact: true, onActivate() {} }));
  assert.match(en, /Preflight Review/); assert.match(en, /aria-expanded="true"/); assert.match(en, /aria-controls="unified-preflight-panel"/);
  assert.match(ja, /レビュー/); assert.match(en, /min-h-11/); assert.match(en, /min-w-11/);
});

test('Unified shell owns responsive aside, heading, tabs, focus, Escape, and one scroll container', () => {
  const source = readFileSync('components/editor/unified-preflight/UnifiedPreflightPanel.tsx', 'utf8');
  assert.match(source, /id="unified-preflight-panel"/); assert.match(source, /id="unified-preflight-heading"/);
  assert.match(source, /role="tablist"/); assert.match(source, /role="tab"/); assert.match(source, /role="tabpanel"/);
  assert.match(source, /md:w-\[440px\]/); assert.match(source, /lg:w-\[480px\]/); assert.match(source, /max-h-\[80dvh\]/);
  assert.equal((source.match(/overflow-y-auto/g) ?? []).length, 1); assert.match(source, /event\.key === 'Escape'/);
});

test('Unified panel directly composes B1 content and never nests standalone panels', () => {
  const source = readFileSync('components/editor/unified-preflight/UnifiedPreflightPanel.tsx', 'utf8');
  assert.match(source, /<ReadinessStageContent/); assert.match(source, /<ExecutionPreviewStageContent/); assert.match(source, /<ResourceAnalysisStageContent/);
  assert.doesNotMatch(source, /<ReadinessPanel|<ExecutionPreviewPanel|<ResourceAnalysisPanel/);
  assert.match(source, /useState<ReadinessCategory \| 'all'>\('all'\)/);
});

test('Overview consumes projected review only and has no overall score or safety judgment', () => {
  const source = readFileSync('components/editor/unified-preflight/UnifiedPreflightOverview.tsx', 'utf8');
  assert.match(source, /review\.stages\.readiness/); assert.match(source, /review\.stages\.execution/); assert.match(source, /review\.stages\.resources/);
  assert.doesNotMatch(source, /GraphData|crewConfig|validateGraph|complexity score|Safe to run|All checks passed/i);
});
