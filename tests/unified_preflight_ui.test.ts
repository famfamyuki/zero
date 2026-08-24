import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UnifiedPreflightEntryButton } from '../components/editor/unified-preflight/UnifiedPreflightEntryButton';
import { UnifiedPreflightOverview } from '../components/editor/unified-preflight/UnifiedPreflightOverview';
import type { UnifiedPreflightReadModel } from '../types/unified-preflight';

const availableReview: UnifiedPreflightReadModel = {
  version: '0.1.0', state: 'available', stages: {
    readiness: { state: 'available', result: { status: 'needs_attention', evaluable: true, counts: { total: 2, high: 1, medium: 1, low: 0, info: 0 }, rulesetVersion: '0.1.0' } },
    execution: { state: 'available', result: { process: 'sequential', summary: { taskCount: 2, agentCount: 2, toolCount: 1 }, version: '0.1.0' } },
    resources: { state: 'available', result: { process: 'sequential', summary: { agentCount: 2, taskCount: 2, toolCount: 1, executionStepCount: 2, uniqueModelCount: 1, dependencyDepth: 1, maxContextFanIn: 1, asyncTaskCount: 0, fixedAssignmentCount: 2, managerDelegatedTaskCount: 0, agentToolBindingCount: 1, taskToolBindingCount: 0 }, hotspotCount: 2, version: '0.1.0' } },
  },
};

test('entry renders desktop full and mobile compact labels with CSS-only responsive ownership', () => {
  const en = renderToStaticMarkup(React.createElement(UnifiedPreflightEntryButton, { lang: 'en', isOpen: false, onActivate() {} }));
  const ja = renderToStaticMarkup(React.createElement(UnifiedPreflightEntryButton, { lang: 'ja', isOpen: true, onActivate() {} }));
  assert.match(en, /hidden sm:inline[^>]*>Preflight Review/); assert.match(en, /sm:hidden[^>]*>Preflight/);
  assert.match(ja, /hidden sm:inline[^>]*>事前レビュー/); assert.match(ja, /sm:hidden[^>]*>レビュー/);
  assert.match(en, /aria-expanded="false"/); assert.match(en, /aria-controls="unified-preflight-panel"/); assert.match(en, /min-h-11/); assert.match(en, /min-w-11/);
  const source = readFileSync('components/editor/unified-preflight/UnifiedPreflightEntryButton.tsx', 'utf8');
  assert.match(source, /trigger\.focus\(\{ preventScroll: true \}\); onActivate\(trigger\)/); assert.match(source, /stopPropagation/); assert.doesNotMatch(source, /innerWidth|resize/);
  assert.doesNotMatch(readFileSync('components/editor/Canvas.tsx', 'utf8'), /compact=\{isPreflightOpen\}/);
});

test('available Overview is complete and localized in EN and JA', () => {
  const en = renderToStaticMarkup(React.createElement(UnifiedPreflightOverview, { review: availableReview, lang: 'en', onSelectStage() {} }));
  const ja = renderToStaticMarkup(React.createElement(UnifiedPreflightOverview, { review: availableReview, lang: 'ja', onSelectStage() {} }));
  for (const label of ['Readiness', 'Status', 'Findings', 'Ruleset', 'Process', 'Tasks', 'Agents', 'Tools', 'Hotspots', 'Version']) assert.match(en, new RegExp(`>${label}<`));
  for (const label of ['準備状況', '状態', '改善事項', 'ルールセット', 'プロセス', 'タスク', 'エージェント', 'ツール', 'ホットスポット', 'バージョン']) assert.match(ja, new RegExp(`>${label}<`));
  for (const label of ['Status', 'Findings', 'Ruleset', 'Process', 'Tasks', 'Agents', 'Tools', 'Hotspots', 'Version']) assert.doesNotMatch(ja, new RegExp(`>${label}<`));
  assert.match(ja, /確認推奨/); assert.doesNotMatch(ja, />needs_attention</);
});

test('all aggregate state messages are localized without changing projected state semantics', () => {
  const messages: Record<UnifiedPreflightReadModel['state'], readonly [string, string]> = {
    refreshing: ['Updating the review…', 'レビューを更新中です。'], empty: ['Add nodes to start a preflight review.', 'ノードを追加すると事前レビューを開始できます。'], invalid: ['Validation issues must be resolved', '先にValidationの問題を解決'], partial: ['Some review areas are unavailable.', '一部のレビューを利用できません。'], available: ['All three review areas are available', '3つのレビュー結果を確認できます。'],
  };
  for (const [state, [enText, jaText]] of Object.entries(messages)) {
    const review = { ...availableReview, state } as UnifiedPreflightReadModel;
    const en = renderToStaticMarkup(React.createElement(UnifiedPreflightOverview, { review, lang: 'en', onSelectStage() {} }));
    const ja = renderToStaticMarkup(React.createElement(UnifiedPreflightOverview, { review, lang: 'ja', onSelectStage() {} }));
    assert.match(en, new RegExp(enText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); assert.match(ja, new RegExp(jaText));
  }
});

test('Unified shell retains identity, tabs, focus, Escape, responsive shell, and one scroll owner', () => {
  const source = readFileSync('components/editor/unified-preflight/UnifiedPreflightPanel.tsx', 'utf8');
  assert.match(source, /id="unified-preflight-panel"/); assert.match(source, /id="unified-preflight-heading"/); assert.match(source, /role="tablist"/); assert.match(source, /role="tab"/); assert.match(source, /role="tabpanel"/);
  assert.match(source, /md:w-\[440px\]/); assert.match(source, /lg:w-\[480px\]/); assert.match(source, /max-h-\[80dvh\]/); assert.equal((source.match(/overflow-y-auto/g) ?? []).length, 1);
  assert.match(source, /event\.key === 'Escape'/); assert.match(source, /onClose\(\)/);
});

test('Unified stage intros reuse exact existing disclaimer translations', () => {
  const source = readFileSync('components/editor/unified-preflight/UnifiedPreflightPanel.tsx', 'utf8');
  assert.match(source, /copy\.executionPreviewDisclaimer/); assert.match(source, /copy\.resourceAnalysisDisclaimer/);
  assert.doesNotMatch(source, /A deterministic preview generated|現在の有効なグラフから決定論的に生成/);
  assert.doesNotMatch(source, /Static preflight analysis\. No workflow is executed or simulated/);
});

test('Unified directly composes B1 content and Overview remains projection-only', () => {
  const panel = readFileSync('components/editor/unified-preflight/UnifiedPreflightPanel.tsx', 'utf8');
  const overview = readFileSync('components/editor/unified-preflight/UnifiedPreflightOverview.tsx', 'utf8');
  assert.match(panel, /<ReadinessStageContent/); assert.match(panel, /<ExecutionPreviewStageContent/); assert.match(panel, /<ResourceAnalysisStageContent/); assert.doesNotMatch(panel, /<ReadinessPanel|<ExecutionPreviewPanel|<ResourceAnalysisPanel/);
  assert.match(overview, /review\.stages\.readiness/); assert.match(overview, /review\.stages\.execution/); assert.match(overview, /review\.stages\.resources/);
  assert.doesNotMatch(overview, /GraphData|crewConfig|validateGraph|complexity score|Safe to run|All checks passed/i);
});
