import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { ANALYTICS_EVENTS, filterPostHogCapture } from '../lib/analytics-config';
import {
  getUnifiedPreflightTabDestination,
  unifiedPreflightStages,
} from '../components/editor/unified-preflight/unifiedPreflightTabs';
import { UNIFIED_PREFLIGHT_REVIEW_VERSION } from '../types/unified-preflight';

const source = (path: string) => readFileSync(path, 'utf8');
const page = source('app/page.tsx');
const panel = source('components/editor/unified-preflight/UnifiedPreflightPanel.tsx');
const overview = source('components/editor/unified-preflight/UnifiedPreflightOverview.tsx');
const hook = source('hooks/useUnifiedPreflight.ts');
const projection = source('lib/unified-preflight.ts');
const orchestration = source('lib/unified-preflight-orchestration.ts');

test('UPR acceptance: one surface composes the three existing semantic sources', () => {
  assert.match(page, /const preflight = useUnifiedPreflight\(readinessGraph\)/);
  for (const sourceHook of ['useReadinessEvaluation', 'useExecutionPreview', 'useResourceAnalysis']) {
    assert.equal((hook.match(new RegExp(`${sourceHook}\\(graph\\)`, 'g')) ?? []).length, 1);
  }
  assert.equal((source('components/editor/Canvas.tsx').match(/<UnifiedPreflightEntryButton/g) ?? []).length, 1);
  assert.doesNotMatch(source('components/editor/Canvas.tsx'), /<ReadinessEntryButton|<ExecutionPreviewEntryButton|<ResourceAnalysisEntryButton/);
  assert.deepEqual(unifiedPreflightStages, ['overview', 'readiness', 'execution', 'resources']);
  for (const content of ['ReadinessStageContent', 'ExecutionPreviewStageContent', 'ResourceAnalysisStageContent']) {
    assert.match(panel, new RegExp(`<${content}`));
  }
  assert.doesNotMatch(panel, /<ReadinessPanel|<ExecutionPreviewPanel|<ResourceAnalysisPanel/);
  for (const forbidden of ['validateGraph', 'createSemanticPlan', 'overallScore', 'safeToRun']) {
    assert.doesNotMatch(hook + panel + overview + projection, new RegExp(forbidden));
  }
});

test('UPR acceptance: projection stays content-free and preserves aggregate state semantics', () => {
  assert.equal(UNIFIED_PREFLIGHT_REVIEW_VERSION, '0.1.0');
  assert.match(overview, /review\.stages\.readiness/);
  assert.match(overview, /review\.stages\.execution/);
  assert.match(overview, /review\.stages\.resources/);
  assert.doesNotMatch(overview, /GraphData|nodes|edges|crewConfig|validateGraph|createSemanticPlan/);
  assert.doesNotMatch(source('types/unified-preflight.ts'), /label|prompt|nodeId|edgeId|graphJson/);
  for (const state of ['refreshing', 'empty', 'invalid', 'partial', 'available']) {
    assert.match(source('types/unified-preflight.ts'), new RegExp(`'${state}'`));
  }
  assert.match(projection, /readiness\.state === 'refreshing' \|\| execution\.state === 'refreshing' \|\| resources\.state === 'refreshing'/);
  assert.match(projection, /readiness\.state === 'available' && execution\.state === 'available' && resources\.state === 'available'/);
  assert.doesNotMatch(projection + overview, /overall score|overall pass|safe\/unsafe|safe to run/i);
  assert.match(overview, /isGloballyRefreshing \? null : readiness\.state/);
  assert.match(overview, /!isGloballyRefreshing && readiness\.result/);
});

test('UPR acceptance: orchestration and workflow retain focus, refresh, Locate, and stage ownership', () => {
  const readinessIndex = orchestration.indexOf('evaluators.readiness()');
  const executionIndex = orchestration.indexOf('evaluators.execution()');
  const resourcesIndex = orchestration.indexOf('evaluators.resources()');
  assert.ok(readinessIndex < executionIndex && executionIndex < resourcesIndex);
  assert.doesNotMatch(hook + orchestration, /setTimeout|setInterval|250/);

  assert.match(page, /preflightSelectionOwnerRef\.current = 'unified_preflight'/);
  assert.match(page, /setIsInspectorOpen\(false\)/);
  assert.match(page, /setIsMobileSidebarOpen\(false\)/);
  assert.match(panel, /headingRef\.current\?\.focus/);
  assert.match(page, /preflightSelectionOwnerRef\.current = null/);
  assert.match(page, /restoreEntryFocus\(preflightReviewEntryRef\.current\)/);
  assert.doesNotMatch(page.slice(page.indexOf('const handleLocateExecutionPreview'), page.indexOf('const readinessTargetSummary')), /closePreflightReview\(/);
  assert.match(page, /useState<UnifiedPreflightStage>\('overview'\)/);
  assert.doesNotMatch(page, /localStorage[^\n]*activePreflightStage|serializeGraph[^\n]*activePreflightStage/);

  const reevaluate = page.slice(page.indexOf('const handleReevaluatePreflight'), page.indexOf('const restoreEntryFocus'));
  assert.equal((reevaluate.match(/preflight\.evaluateAll\(\)/g) ?? []).length, 1);
  assert.doesNotMatch(reevaluate, /setActivePreflightStage|setIsPreflightReviewOpen|setSelectedNode|setIsInspectorOpen|preflightSelectionOwnerRef/);
  assert.match(panel, /aria-live="polite"/);
  assert.match(panel, /role="status"/);
  assert.match(panel, /onClick=\{props\.onReevaluate\}/);
});

test('UPR acceptance: tabs, ARIA, and responsive shell remain hardened without JS breakpoints', () => {
  assert.equal(getUnifiedPreflightTabDestination('resources', 'ArrowRight'), 'overview');
  assert.equal(getUnifiedPreflightTabDestination('overview', 'ArrowLeft'), 'resources');
  assert.equal(getUnifiedPreflightTabDestination('execution', 'Home'), 'overview');
  assert.equal(getUnifiedPreflightTabDestination('readiness', 'End'), 'resources');
  assert.equal(getUnifiedPreflightTabDestination('readiness', 'Tab'), null);
  assert.match(panel, /tabIndex=\{activeStage === stage \? 0 : -1\}/);
  assert.match(panel, /aria-controls=\{`unified-preflight-tabpanel-\$\{stage\}`\}/);
  assert.match(panel, /aria-labelledby=\{`unified-preflight-tab-\$\{activeStage\}`\}/);
  assert.match(panel, /tabRefs\.current\[destination\]\?\.focus\(\)/);
  assert.match(panel, /event\.key === 'Escape'/);
  assert.match(panel, /max-h-\[80dvh\]/);
  assert.match(panel, /md:w-\[440px\]/);
  assert.match(panel, /lg:w-\[480px\]/);
  assert.match(panel, /md:max-w-\[45vw\]/);
  assert.equal((panel.match(/overflow-y-auto/g) ?? []).length, 1);
  assert.match(panel, /overflow-x-auto/);
  assert.doesNotMatch(panel + source('components/editor/unified-preflight/UnifiedPreflightEntryButton.tsx'), /innerWidth|ResizeObserver|addEventListener\(['"]resize/);
});

test('UPR acceptance: analytics taxonomy, emission boundaries, and privacy are exact', () => {
  assert.equal(ANALYTICS_EVENTS.length, 17);
  assert.deepEqual(ANALYTICS_EVENTS.slice(-5), [
    'preflight_review_opened',
    'preflight_review_stage_selected',
    'preflight_review_re_evaluated',
    'preflight_activation_prompt_shown',
    'preflight_first_value_reached',
  ]);
  assert.equal((page.match(/trackEvent\('preflight_review_opened'/g) ?? []).length, 1);
  assert.equal((page.match(/trackEvent\('preflight_review_stage_selected'/g) ?? []).length, 1);
  assert.equal((page.match(/trackEvent\('preflight_review_re_evaluated'/g) ?? []).length, 1);
  assert.match(page, /if \(stage === activePreflightStage\) return/);
  assert.match(page, /preflight_version: UNIFIED_PREFLIGHT_REVIEW_VERSION/);
  assert.doesNotMatch(panel + hook, /preflight_review_|trackEvent/);

  const privateProperties = {
    label: 'private', prompt: 'private', role: 'private', goal: 'private', backstory: 'private',
    task_description: 'private', graph_json: 'private', generated_code: 'private', model_id: 'private',
    tool_params: 'private', node_id: 'private', edge_id: 'private', filename: 'private', contents: 'private',
    labels: 'private', descriptions: 'private', goals: 'private', backstories: 'private', task_content: 'private',
    raw_errors: 'private', validation_text: 'private', language: 'private', url: 'private', query_string: 'private',
    query: 'private', $referrer: 'private', utm_source: 'private', $current_url: 'private',
  };
  const opened = filterPostHogCapture({ uuid: 'open', event: 'preflight_review_opened', properties: { preflight_version: '0.1.0', source: 'entry', ...privateProperties } });
  const stage = filterPostHogCapture({ uuid: 'stage', event: 'preflight_review_stage_selected', properties: { stage: 'resources', ...privateProperties } });
  assert.deepEqual(opened?.properties, { preflight_version: '0.1.0', source: 'entry' });
  assert.deepEqual(stage?.properties, { stage: 'resources' });
  assert.equal(filterPostHogCapture({ uuid: 'unknown', event: '$autocapture', properties: {} }), null);
  assert.match(source('lib/analytics-config.ts'), /capture\.event === '\$pageview'/);
});

test('UPR acceptance: localization, persistence, and deterministic codegen boundaries remain unchanged', () => {
  const translations = source('lib/i18n/translations.ts');
  for (const copy of [
    'Preflight Review', 'Preflight Engineering Review', 'Overview', 'Readiness', 'Execution', 'Resources', 'Re-evaluate',
    '事前レビュー', '事前エンジニアリングレビュー', '概要', '準備状況', '実行', 'リソース', '再評価',
  ]) assert.ok(translations.includes(copy), copy);

  const graphJson = source('lib/graph-json.ts');
  assert.match(source('types/editor.ts'), /GRAPH_SCHEMA_VERSION = 1/);
  assert.match(graphJson, /schemaVersion: GRAPH_SCHEMA_VERSION/);
  assert.match(graphJson, /export function serializeGraph/);
  assert.match(graphJson, /export function deserializeGraph/);
  assert.doesNotMatch(graphJson, /UnifiedPreflight|activePreflightStage|preflightReview/);
  assert.doesNotMatch(source('lib/transpiler/validation.ts') + source('lib/transpiler/semantic-plan.ts') + source('lib/transpiler/codegen-plan.ts') + source('lib/transpiler/crewai.ts'), /UnifiedPreflight|preflightReview/);
  const generate = page.slice(page.indexOf('const handleGenerateCode'), page.indexOf('const handleOpenPreflightReview'));
  assert.doesNotMatch(generate, /preflight\.review|review\.state|activePreflightStage/);
});
