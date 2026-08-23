import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResourceAnalysisEntryButton } from '../components/editor/resource-analysis/ResourceAnalysisEntryButton';
import { resolvePreflightNavigationTarget, shouldIgnoreSelectionChangeForOpenPreflight } from '../lib/preflight-navigation';
import { resolveExecutionPreviewNavigationTarget } from '../lib/execution-preview-navigation';
import type { CustomNode } from '../types/editor';

const task = { id: 'shared-id', type: 'task', position: { x: 1, y: 2 }, data: { label: 'Task', description: 'D', expectedOutput: 'O', asyncExecution: false } } as CustomNode;
const tool = { id: 'tool-a', type: 'tool', position: { x: 3, y: 4 }, data: { label: 'Tool', toolType: 'FileReadTool', description: 'Read' } } as CustomNode;

test('Resource Analysis entry has localized desktop/mobile copy and pointer-safe accessibility state', () => {
  const en = renderToStaticMarkup(React.createElement(ResourceAnalysisEntryButton, { lang: 'en', isOpen: true, onClick() {} }));
  const ja = renderToStaticMarkup(React.createElement(ResourceAnalysisEntryButton, { lang: 'ja', isOpen: false, onClick() {} }));
  assert.match(en, /Resource Analysis/); assert.match(en, />Analysis</); assert.match(en, /aria-expanded="true"/); assert.match(en, /aria-controls="resource-analysis-panel"/); assert.match(en, /aria-label="Open Resource Analysis"/);
  assert.match(ja, /リソース分析/); assert.match(ja, />分析</); assert.match(ja, /aria-label="リソース分析を開く"/);
  const source = readFileSync('components/editor/resource-analysis/ResourceAnalysisEntryButton.tsx', 'utf8');
  assert.match(source, /type="button"/); assert.match(source, /onPointerDown=.*stopPropagation/); assert.match(source, /onClick=.*stopPropagation/); assert.match(source, /min-h-11 min-w-11/); assert.match(source, /focus-visible:ring-2/);
});

test('generic preflight navigation resolves matching nodes and crew while rejecting missing and wrong types', () => {
  assert.deepEqual(resolvePreflightNavigationTarget({ type: 'task', id: 'shared-id' }, [task, tool]), { kind: 'node', node: task });
  assert.deepEqual(resolvePreflightNavigationTarget({ type: 'tool', id: 'tool-a' }, [task, tool]), { kind: 'node', node: tool });
  assert.equal(resolvePreflightNavigationTarget({ type: 'agent', id: 'shared-id' }, [task, tool]).kind, 'missing');
  assert.equal(resolvePreflightNavigationTarget({ type: 'task', id: 'deleted' }, [task, tool]).kind, 'missing');
  assert.equal(resolvePreflightNavigationTarget({ type: 'crew' }, [task, tool]).kind, 'crew');
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight(true), true);
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight(false), false);
});

test('Execution Preview remains a compatible thin wrapper over shared navigation', () => {
  assert.equal(resolveExecutionPreviewNavigationTarget('task', 'shared-id', [task, tool]).kind, 'node');
  assert.equal(resolveExecutionPreviewNavigationTarget('agent', 'shared-id', [task, tool]).kind, 'missing');
  assert.equal(resolveExecutionPreviewNavigationTarget('crew', undefined, [task, tool]).kind, 'crew');
  const source = readFileSync('lib/execution-preview-navigation.ts', 'utf8');
  assert.match(source, /resolvePreflightNavigationTarget/); assert.match(source, /shouldIgnoreSelectionChangeForOpenPreflight/);
});

test('Canvas control order is Readiness, Execution Preview, then Resource Analysis', () => {
  const source = readFileSync('components/editor/Canvas.tsx', 'utf8');
  const readiness = source.indexOf('<ReadinessEntryButton');
  const preview = source.indexOf('<ExecutionPreviewEntryButton');
  const analysis = source.indexOf('<ResourceAnalysisEntryButton');
  assert.ok(readiness >= 0 && readiness < preview && preview < analysis);
  assert.match(source, /isResourceAnalysisOpen: boolean/); assert.match(source, /onOpenResourceAnalysis: \(\) => void/);
});

test('page evaluates the same graph independently and wires panel state, refresh, retry, validation, and notice', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  assert.match(source, /const resourceAnalysis = useResourceAnalysis\(readinessGraph\)/);
  assert.match(source, /<ResourceAnalysisPanel isOpen=\{isResourceAnalysisOpen\} state=\{resourceAnalysis\.state\} isRefreshing=\{resourceAnalysis\.isRefreshing\}/);
  assert.match(source, /notice=\{resourceAnalysisNotice\}/); assert.match(source, /onRetry=\{resourceAnalysis\.evaluateNow\}/); assert.match(source, /setIsCodeModalOpen\(true\)/);
  assert.match(source, /!isReadinessOpen && !isExecutionPreviewOpen && !isResourceAnalysisOpen/g);
});

test('opening Analysis evaluates now and closes Inspector, Readiness, Preview, and mobile sidebar', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  const handler = source.slice(source.indexOf('const handleOpenResourceAnalysis'), source.indexOf('const handleLocateExecutionPreview'));
  for (const expected of ['resourceAnalysis.evaluateNow()', 'resourceAnalysisOpenRef.current = true', 'setIsInspectorOpen(false)', 'setIsReadinessOpen(false)', 'setIsExecutionPreviewOpen(false)', 'setIsMobileSidebarOpen(false)', 'setResourceAnalysisNotice(null)', 'setIsResourceAnalysisOpen(true)']) assert.ok(handler.includes(expected), expected);
  assert.doesNotMatch(handler, /trackEvent/);
});

test('Resource Analysis node and crew Locate transfer selection, panels, viewport, and focus', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  const handler = source.slice(source.indexOf('const handleLocateResourceAnalysis'), source.indexOf('const handleLocateFinding'));
  for (const expected of ['resolvePreflightNavigationTarget', 'selected: item.id === node.id', 'setSelectedNode(node)', 'setIsResourceAnalysisOpen(false)', 'setIsReadinessOpen(false)', 'setIsExecutionPreviewOpen(false)', 'setIsInspectorOpen(true)', "'focus-flow-node'", "'focus-inspector-heading'", 'setSelectedNode(null)', "'focus-manager-llm'", 'return true']) assert.ok(handler.includes(expected), expected);
  assert.doesNotMatch(handler, /trackEvent/);
});

test('missing Resource target refreshes in place, announces stable EN/JA copy, and returns false', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  const resourceHandlerStart = source.indexOf('const handleLocateResourceAnalysis');
  const missingStart = source.indexOf("if (target.kind === 'missing')", resourceHandlerStart);
  const handler = source.slice(missingStart, source.indexOf('resourceAnalysisOpenRef.current = false', missingStart));
  assert.match(handler, /resourceAnalysis\.evaluateNow\(\)/); assert.match(handler, /setResourceAnalysisNotice\(t\('resourceAnalysisStaleNotice'\)\)/); assert.match(handler, /return false/);
  assert.doesNotMatch(handler, /setSelectedNode|setIsInspectorOpen|setIsResourceAnalysisOpen/);
  const translations = readFileSync('lib/i18n/translations.ts', 'utf8');
  assert.match(translations, /Target changed\. Resource Analysis was refreshed\./); assert.match(translations, /対象が変更されたため、リソース分析を更新しました。/);
});

test('selection guards and explicit Inspector entry preserve mutual exclusivity', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  assert.match(source, /shouldIgnoreSelectionChangeForOpenPreflight\(executionPreviewOpenRef\.current \|\| resourceAnalysisOpenRef\.current\)/);
  const explicit = source.slice(source.indexOf('const handleOpenInspector'), source.indexOf("window.addEventListener('open-node-inspector'"));
  assert.match(explicit, /setIsInspectorOpen\(true\)/); assert.match(explicit, /setIsResourceAnalysisOpen\(false\)/);
  const readinessOpen = source.slice(source.indexOf('const handleOpenReadiness'), source.indexOf('const handleOpenExecutionPreview'));
  const previewOpen = source.slice(source.indexOf('const handleOpenExecutionPreview'), source.indexOf('const handleOpenResourceAnalysis'));
  assert.match(readinessOpen, /setIsResourceAnalysisOpen\(false\)/); assert.match(previewOpen, /setIsResourceAnalysisOpen\(false\)/);
});

test('integration adds no Resource Analysis analytics or persistence/semantic coupling', () => {
  const files = ['app/page.tsx', 'components/editor/Canvas.tsx', 'components/editor/resource-analysis/ResourceAnalysisEntryButton.tsx', 'lib/preflight-navigation.ts'];
  const source = files.map((path) => readFileSync(path, 'utf8')).join('\n');
  assert.doesNotMatch(source, /resource_analysis_opened|resource_analysis_hotspot_selected/);
  const entryAndNavigation = files.slice(1).map((path) => readFileSync(path, 'utf8')).join('\n');
  for (const forbidden of ['localStorage', 'serializeGraph', 'SemanticPlan', 'createResourceAnalysisReadModel', 'CodegenPlan']) assert.equal(entryAndNavigation.includes(forbidden), false, forbidden);
});
