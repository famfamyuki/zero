import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExecutionPreviewEntryButton } from '../components/editor/execution-preview/ExecutionPreviewEntryButton';
import { ReadinessEntryButton } from '../components/editor/readiness/ReadinessEntryButton';
import { ResourceAnalysisEntryButton } from '../components/editor/resource-analysis/ResourceAnalysisEntryButton';
import { resolvePreflightNavigationTarget, shouldIgnoreSelectionChangeForOpenPreflight } from '../lib/preflight-navigation';
import { resolveExecutionPreviewNavigationTarget } from '../lib/execution-preview-navigation';
import type { CustomNode } from '../types/editor';

const task = { id: 'shared-id', type: 'task', position: { x: 1, y: 2 }, data: { label: 'Task', description: 'D', expectedOutput: 'O', asyncExecution: false } } as CustomNode;
const tool = { id: 'tool-a', type: 'tool', position: { x: 3, y: 4 }, data: { label: 'Tool', toolType: 'FileReadTool', description: 'Read' } } as CustomNode;

test('Resource Analysis entry has localized desktop/mobile copy and pointer-safe accessibility state', () => {
  const en = renderToStaticMarkup(React.createElement(ResourceAnalysisEntryButton, { lang: 'en', isOpen: true, onActivate() {} }));
  const ja = renderToStaticMarkup(React.createElement(ResourceAnalysisEntryButton, { lang: 'ja', isOpen: false, onActivate() {} }));
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
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight('readiness'), true);
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight('execution_preview'), true);
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight('resource_analysis'), true);
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight(null), false);
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
  assert.match(source, /isResourceAnalysisOpen: boolean/); assert.match(source, /onOpenResourceAnalysis: \(trigger: HTMLButtonElement\) => void/);
  assert.match(source, /md:!right-\[412px\]/); assert.match(source, /lg:!right-\[432px\]/);
  assert.match(source, /!bottom-\[calc\(78dvh\+0\.5rem\)\]/); assert.match(source, /compact=\{isPreflightOpen\}/g);
});

test('all preflight entries retain compact labels, touch targets, and pointer safety', () => {
  const readiness = renderToStaticMarkup(React.createElement(ReadinessEntryButton, { status: 'ready', lang: 'en', isOpen: false, compact: true, onActivate() {} }));
  const preview = renderToStaticMarkup(React.createElement(ExecutionPreviewEntryButton, { lang: 'en', isOpen: true, compact: true, onActivate() {} }));
  const analysis = renderToStaticMarkup(React.createElement(ResourceAnalysisEntryButton, { lang: 'en', isOpen: false, compact: true, onActivate() {} }));
  assert.match(readiness, />Ready</); assert.match(preview, />Plan</); assert.match(analysis, />Analysis</);
  for (const markup of [readiness, preview, analysis]) {
    assert.match(markup, /min-h-11/); assert.match(markup, /min-w-11/); assert.match(markup, /nodrag nopan/);
  }
});

test('all preflight entries explicitly focus and pass the exact activation trigger', () => {
  const paths = [
    'components/editor/readiness/ReadinessEntryButton.tsx',
    'components/editor/execution-preview/ExecutionPreviewEntryButton.tsx',
    'components/editor/resource-analysis/ResourceAnalysisEntryButton.tsx',
  ];
  for (const path of paths) {
    const source = readFileSync(path, 'utf8');
    const pointer = source.slice(source.indexOf('onPointerDown='), source.indexOf('onClick='));
    const keyboard = source.slice(source.indexOf('onClick='), source.indexOf('aria-expanded='));
    assert.match(pointer, /event\.currentTarget\.focus\(\{ preventScroll: true \}\)/, path);
    assert.match(pointer, /onActivate\(event\.currentTarget\)/, path);
    assert.ok(pointer.indexOf('.focus(') < pointer.indexOf('onActivate('), path);
    assert.match(keyboard, /event\.detail === 0/, path);
    assert.match(keyboard, /onActivate\(event\.currentTarget\)/, path);
  }
});

test('parent owns normal dismiss focus restoration without panel cleanup races', () => {
  const page = readFileSync('app/page.tsx', 'utf8');
  for (const name of ['readiness', 'executionPreview', 'resourceAnalysis']) {
    assert.match(page, new RegExp(`const ${name}EntryRef = useRef<HTMLButtonElement \\| null>\\(null\\)`));
  }
  assert.match(page, /requestAnimationFrame\(\(\) => \{\s*requestAnimationFrame\(\(\) => \{/);
  assert.equal((page.match(/if \(entry\?\.isConnected\) entry\.focus\(\{ preventScroll: true \}\)/g) ?? []).length, 2);
  assert.match(page, /onClose=\{closeReadiness\}/);
  assert.match(page, /onClose=\{closeExecutionPreview\}/);
  assert.match(page, /onClose=\{closeResourceAnalysis\}/);
  for (const path of [
    'components/editor/readiness/ReadinessPanel.tsx',
    'components/editor/execution-preview/ExecutionPreviewPanel.tsx',
    'components/editor/resource-analysis/ResourceAnalysisPanel.tsx',
  ]) {
    const panel = readFileSync(path, 'utf8');
    assert.doesNotMatch(panel, /document\.activeElement|previousFocus|locating/, path);
    assert.match(panel, /requestAnimationFrame\(\(\) => requestAnimationFrame\(\(\) => heading\.current\?\.focus\(\)\)\)/, path);
  }
});

test('direct switches capture destination trigger and never invoke source close handlers', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  const readinessOpen = source.slice(source.indexOf('const handleOpenReadiness'), source.indexOf('const handleOpenExecutionPreview'));
  const previewOpen = source.slice(source.indexOf('const handleOpenExecutionPreview'), source.indexOf('const handleOpenResourceAnalysis'));
  const analysisOpen = source.slice(source.indexOf('const handleOpenResourceAnalysis'), source.indexOf('const restoreEntryFocus'));
  for (const [handler, entry, owner] of [
    [readinessOpen, 'readinessEntryRef', 'readiness'],
    [previewOpen, 'executionPreviewEntryRef', 'execution_preview'],
    [analysisOpen, 'resourceAnalysisEntryRef', 'resource_analysis'],
  ] as const) {
    assert.match(handler, new RegExp(`${entry}\\.current = trigger`));
    assert.match(handler, new RegExp(`preflightSelectionOwnerRef\\.current = '${owner}'`));
    assert.doesNotMatch(handler, /closeReadiness|closeExecutionPreview|closeResourceAnalysis/);
  }
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
  for (const expected of ["preflightSelectionOwnerRef.current = 'resource_analysis'", 'resourceAnalysis.evaluateNow()', 'setIsInspectorOpen(false)', 'setIsReadinessOpen(false)', 'setIsExecutionPreviewOpen(false)', 'setIsMobileSidebarOpen(false)', 'setResourceAnalysisNotice(null)', 'setIsResourceAnalysisOpen(true)']) assert.ok(handler.includes(expected), expected);
  assert.ok(handler.indexOf("preflightSelectionOwnerRef.current = 'resource_analysis'") < handler.indexOf('resourceAnalysis.evaluateNow()'));
  assert.doesNotMatch(handler, /setSelectedNode\(null\)/);
  assert.equal((handler.match(/resource_analysis_opened/g) ?? []).length, 1);
});

test('Resource Analysis node and crew Locate transfer selection, panels, viewport, and focus', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  const handler = source.slice(source.indexOf('const handleLocateResourceAnalysis'), source.indexOf('const handleLocateFinding'));
  for (const expected of ['resolvePreflightNavigationTarget', 'selected: item.id === node.id', 'setSelectedNode(node)', 'setIsResourceAnalysisOpen(false)', 'setIsReadinessOpen(false)', 'setIsExecutionPreviewOpen(false)', 'setIsInspectorOpen(true)', "'focus-flow-node'", "'focus-inspector-heading'", 'setSelectedNode(null)', "'focus-manager-llm'", 'return true']) assert.ok(handler.includes(expected), expected);
  assert.equal((handler.match(/resource_analysis_hotspot_selected/g) ?? []).length, 1);
});

test('missing Resource target refreshes in place, announces stable EN/JA copy, and returns false', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  const resourceHandlerStart = source.indexOf('const handleLocateResourceAnalysis');
  const missingStart = source.indexOf("if (target.kind === 'missing')", resourceHandlerStart);
  const handler = source.slice(missingStart, source.indexOf('preflightSelectionOwnerRef.current = null', missingStart));
  assert.match(handler, /resourceAnalysis\.evaluateNow\(\)/); assert.match(handler, /setResourceAnalysisNotice\(t\('resourceAnalysisStaleNotice'\)\)/); assert.match(handler, /return false/);
  assert.doesNotMatch(handler, /setSelectedNode|setIsInspectorOpen|setIsResourceAnalysisOpen/);
  const translations = readFileSync('lib/i18n/translations.ts', 'utf8');
  assert.match(translations, /Target changed\. Resource Analysis was refreshed\./); assert.match(translations, /対象が変更されたため、リソース分析を更新しました。/);
});

test('selection guards and explicit Inspector entry preserve mutual exclusivity', () => {
  const source = readFileSync('app/page.tsx', 'utf8');
  assert.match(source, /shouldIgnoreSelectionChangeForOpenPreflight\(preflightSelectionOwnerRef\.current\)/);
  const explicit = source.slice(source.indexOf('const handleOpenInspector'), source.indexOf("window.addEventListener('open-node-inspector'"));
  assert.match(explicit, /preflightSelectionOwnerRef\.current = null/); assert.match(explicit, /setIsInspectorOpen\(true\)/); assert.match(explicit, /setIsReadinessOpen\(false\)/); assert.match(explicit, /setIsExecutionPreviewOpen\(false\)/); assert.match(explicit, /setIsResourceAnalysisOpen\(false\)/);
  const readinessOpen = source.slice(source.indexOf('const handleOpenReadiness'), source.indexOf('const handleOpenExecutionPreview'));
  const previewOpen = source.slice(source.indexOf('const handleOpenExecutionPreview'), source.indexOf('const handleOpenResourceAnalysis'));
  assert.match(readinessOpen, /preflightSelectionOwnerRef\.current = 'readiness'/); assert.match(readinessOpen, /setIsResourceAnalysisOpen\(false\)/); assert.match(readinessOpen, /setIsExecutionPreviewOpen\(false\)/);
  assert.match(previewOpen, /preflightSelectionOwnerRef\.current = 'execution_preview'/); assert.match(previewOpen, /setIsResourceAnalysisOpen\(false\)/); assert.match(previewOpen, /setIsReadinessOpen\(false\)/);
  assert.ok(readinessOpen.indexOf("preflightSelectionOwnerRef.current = 'readiness'") < readinessOpen.indexOf('readiness.evaluateNow()'));
  assert.ok(previewOpen.indexOf("preflightSelectionOwnerRef.current = 'execution_preview'") < previewOpen.indexOf('executionPreview.evaluateNow()'));
});

test('Resource Analysis analytics is parent-owned, transition-gated, and preserves Locate ordering', () => {
  const page = readFileSync('app/page.tsx', 'utf8');
  const open = page.slice(page.indexOf('const handleOpenResourceAnalysis'), page.indexOf('const restoreEntryFocus'));
  assert.match(open, /const current = resourceAnalysis\.evaluateNow\(\)/);
  assert.match(open, /if \(!isResourceAnalysisOpen\)/);
  assert.match(open, /createResourceAnalysisOpenedAnalyticsProperties\(current\)/);
  assert.equal((open.match(/resource_analysis_opened/g) ?? []).length, 1);
  assert.ok(open.indexOf('setIsResourceAnalysisOpen(true)') < open.indexOf("trackEvent(\n        'resource_analysis_opened'"));

  const locate = page.slice(page.indexOf('const handleLocateResourceAnalysis'), page.indexOf('const handleLocateFinding'));
  assert.match(locate, /createResourceAnalysisHotspotAnalyticsProperties/);
  assert.equal((locate.match(/resource_analysis_hotspot_selected/g) ?? []).length, 1);
  assert.ok(locate.indexOf('resource_analysis_hotspot_selected') < locate.indexOf('resolvePreflightNavigationTarget'));
  assert.ok(locate.indexOf('resource_analysis_hotspot_selected') < locate.indexOf("if (target.kind === 'missing')"));

  const panel = readFileSync('components/editor/resource-analysis/ResourceAnalysisPanel.tsx', 'utf8');
  assert.match(panel, /hotspotKind: ResourceAnalysisHotspot\['kind'\]/);
  assert.match(panel, /onLocate\(hotspot\.target, \{ source: 'hotspot', hotspotKind: hotspot\.kind \}\)/);
  const entry = readFileSync('components/editor/resource-analysis/ResourceAnalysisEntryButton.tsx', 'utf8');
  assert.doesNotMatch(entry, /trackEvent|resource_analysis_/);
});

test('Resource Analysis analytics adds no persistence or semantic coupling', () => {
  const files = ['app/page.tsx', 'components/editor/Canvas.tsx', 'components/editor/resource-analysis/ResourceAnalysisEntryButton.tsx', 'lib/preflight-navigation.ts'];
  const entryAndNavigation = files.slice(1).map((path) => readFileSync(path, 'utf8')).join('\n');
  for (const forbidden of ['localStorage', 'serializeGraph', 'SemanticPlan', 'createResourceAnalysisReadModel', 'CodegenPlan']) assert.equal(entryAndNavigation.includes(forbidden), false, forbidden);
});
