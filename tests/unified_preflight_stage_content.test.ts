import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const components = [
  {
    name: 'Readiness',
    panel: 'components/editor/readiness/ReadinessPanel.tsx',
    stage: 'components/editor/readiness/ReadinessStageContent.tsx',
    component: 'ReadinessStageContent',
    panelId: 'readiness-panel',
    headingId: 'readiness-heading',
  },
  {
    name: 'Execution Preview',
    panel: 'components/editor/execution-preview/ExecutionPreviewPanel.tsx',
    stage: 'components/editor/execution-preview/ExecutionPreviewStageContent.tsx',
    component: 'ExecutionPreviewStageContent',
    panelId: 'execution-preview-panel',
    headingId: 'execution-preview-heading',
  },
  {
    name: 'Resource Analysis',
    panel: 'components/editor/resource-analysis/ResourceAnalysisPanel.tsx',
    stage: 'components/editor/resource-analysis/ResourceAnalysisStageContent.tsx',
    component: 'ResourceAnalysisStageContent',
    panelId: 'resource-analysis-panel',
    headingId: 'resource-analysis-heading',
  },
] as const;

test('standalone panels compose the three reusable stage content components', () => {
  for (const item of components) {
    const panel = readFileSync(item.panel, 'utf8');
    assert.match(panel, new RegExp(`import \\{ ${item.component}`), item.name);
    assert.match(panel, new RegExp(`<${item.component} `), item.name);
  }
});

test('standalone shells retain identity, busy state, focus, Escape, and scroll ownership', () => {
  for (const item of components) {
    const panel = readFileSync(item.panel, 'utf8');
    assert.match(panel, new RegExp(`id="${item.panelId}"`), item.name);
    assert.match(panel, new RegExp(`aria-labelledby="${item.headingId}"`), item.name);
    assert.match(panel, /aria-busy=\{isRefreshing\}/, item.name);
    assert.match(panel, /requestAnimationFrame\(\(\) => requestAnimationFrame/, item.name);
    assert.match(panel, /window\.addEventListener\('keydown'/, item.name);
    assert.match(panel, /event\.key === 'Escape'|e\.key === 'Escape'/, item.name);
    assert.match(panel, /overflow-y-auto p-4 pb-8/, item.name);
  }
});

test('stage content remains context-neutral and does not own shell behavior', () => {
  for (const item of components) {
    const stage = readFileSync(item.stage, 'utf8');
    assert.doesNotMatch(stage, /<aside|aria-labelledby|window\.addEventListener|requestAnimationFrame|heading\.current|\bonClose\b|\bisOpen\b/, item.name);
    assert.doesNotMatch(stage, /overflow-y-auto|max-h-\[|className="[^"]*\bfixed\b|className="[^"]*\babsolute\b/, item.name);
  }
});

test('stage content renders evaluated inputs without semantic or Unified dependencies', () => {
  const source = components.map((item) => readFileSync(item.stage, 'utf8')).join('\n');
  for (const forbidden of [
    'useUnifiedPreflight',
    'UnifiedPreflightReadModel',
    'UnifiedPreflightStage',
    'validateGraph',
    'createSemanticPlan',
    'evaluateReadiness',
    'createExecutionPreviewReadModel',
    'createResourceAnalysisReadModel',
    'evaluateResourceAnalysis',
    'trackEvent',
  ]) assert.equal(source.includes(forbidden), false, forbidden);
});

test('Readiness wrapper retains filter state and its existing helper export path', () => {
  const panel = readFileSync('components/editor/readiness/ReadinessPanel.tsx', 'utf8');
  assert.match(panel, /useState<ReadinessCategory \| 'all'>\('all'\)/);
  assert.match(panel, /filter=\{filter\}/);
  assert.match(panel, /onFilterChange=\{setFilter\}/);
  assert.match(panel, /export \{ filterReadinessFindings \} from '\.\/ReadinessStageContent'/);
});

test('ResourceAnalysisLocateContext remains available from the old panel import path', () => {
  const panel = readFileSync('components/editor/resource-analysis/ResourceAnalysisPanel.tsx', 'utf8');
  const stage = readFileSync('components/editor/resource-analysis/ResourceAnalysisStageContent.tsx', 'utf8');
  assert.match(panel, /export type \{ ResourceAnalysisLocateContext \} from '\.\/ResourceAnalysisStageContent'/);
  assert.match(stage, /export interface ResourceAnalysisLocateContext/);
  assert.match(stage, /hotspotKind: ResourceAnalysisHotspot\['kind'\]/);
});

test('B1 leaves Canvas, page integration, and analytics taxonomy unchanged', () => {
  const changedProductFiles: readonly string[] = components.flatMap((item) => [item.panel, item.stage]);
  assert.equal(changedProductFiles.some((path) => path === 'app/page.tsx' || path.endsWith('/Canvas.tsx')), false);
  const source = changedProductFiles.map((path) => readFileSync(path, 'utf8')).join('\n');
  assert.doesNotMatch(source, /resource_analysis_opened|execution_preview_opened|readiness_opened/);
});
