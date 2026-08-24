import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PreflightActivationPrompt } from '../components/editor/unified-preflight/PreflightActivationPrompt';

const source = (path: string) => readFileSync(path, 'utf8');
const page = source('app/page.tsx');
const canvas = source('components/editor/Canvas.tsx');
const prompt = source('components/editor/unified-preflight/PreflightActivationPrompt.tsx');
const entry = source('components/editor/unified-preflight/UnifiedPreflightEntryButton.tsx');
const analytics = source('lib/analytics.ts');

test('activation prompt renders exact localized non-modal accessible content', () => {
  const render = (lang: 'en' | 'ja') => renderToStaticMarkup(React.createElement(
    PreflightActivationPrompt,
    { lang, onReview: () => {}, onDismiss: () => {}, onShown: () => {} },
  ));
  const en = render('en');
  const ja = render('ja');
  assert.match(en, /Review before export/);
  assert.match(en, /Check readiness, execution flow, and resource implications in one preflight review\./);
  assert.match(en, /Review now/);
  assert.match(en, /aria-label="Dismiss Preflight introduction"/);
  assert.match(ja, /出力前に事前レビュー/);
  assert.match(ja, /準備状況・実行の流れ・リソース上の示唆を1つの事前レビューで確認できます。/);
  assert.match(ja, /今すぐ確認/);
  assert.match(ja, /aria-label="事前レビューの案内を閉じる"/);
  assert.match(en, /<aside[^>]*aria-labelledby="preflight-activation-prompt-heading"/);
  assert.doesNotMatch(en, /role="dialog"|aria-live/);
  assert.equal((en.match(/<button/g) ?? []).length, 2);
});

test('prompt presentation is responsive, non-blocking, focus-visible, and Canvas-safe', () => {
  assert.match(prompt, /nodrag nopan/);
  assert.match(prompt, /w-\[min\(20rem,calc\(100vw-1\.5rem\)\)\]/);
  assert.match(prompt, /max-w-\[calc\(100vw-1\.5rem\)\]/);
  assert.equal((prompt.match(/min-h-11 min-w-11/g) ?? []).length, 2);
  assert.equal((prompt.match(/focus-visible:ring-2/g) ?? []).length, 2);
  assert.match(prompt, /event\.stopPropagation\(\)/);
  assert.doesNotMatch(prompt, /trackEvent|localStorage|posthog|hasMeaningfulPreflightFirstValue|GraphData|onKeyDown|Escape/);
  assert.match(prompt, /useEffect\(\(\) => \{\s*onShown\(\)/);
});

test('workspace and activation persistence hydrate independently and fail safely', () => {
  assert.match(page, /setWorkspaceHydrated\(true\)/);
  assert.match(page, /setActivationPersistenceHydrated\(true\)/);
  assert.match(page, /parsePreflightActivationPersistence\(/);
  assert.match(page, /localStorage\.getItem\(PREFLIGHT_ACTIVATION_STORAGE_KEY\)/);
  assert.match(page, /serializePreflightActivationPersistence\(status\)/);
  assert.match(page, /catch \{\s*setActivationPersistentStatus\(null\)/);
  assert.match(page, /catch \{\s*\/\/ In-memory state preserves one-shot behavior/);
});

test('eligibility requires both hydrations, unseen state, closed panel, and Packet 1 predicate', () => {
  for (const condition of [
    'workspaceHydrated',
    'activationPersistenceHydrated',
    'activationPersistentStatus === null',
    '!isPreflightReviewOpen',
    '!activationPromptVisible',
    'hasMeaningfulPreflightFirstValue(preflight.review)',
  ]) assert.ok(page.includes(condition), condition);
  assert.doesNotMatch(page, /hasMeaningfulPreflightFirstValue\(readinessGraph\)|nodes\.length[^\n]*activationPrompt/);
});

test('shown, dismiss, CTA, and direct entry preserve one-shot persistence and canonical focus', () => {
  assert.match(page, /activationPromptShownEmittedRef\.current/);
  assert.match(page, /persistActivationStatus\('prompted'\)/);
  assert.match(page, /trackEvent\('preflight_activation_prompt_shown'/);
  assert.match(page, /activationPersistentStatus === 'prompted'\) persistActivationStatus\('dismissed'\)/);
  assert.match(canvas, /focusPreflightEntry\(\);\s*onOpenPreflightReview\(entry, 'activation_prompt'\)/);
  assert.match(canvas, /onOpenPreflightReview\(trigger, 'entry'\)/);
  assert.match(canvas, /onDismissActivationPrompt\(\);\s*focusPreflightEntry\(\)/);
  assert.match(entry, /forwardRef<HTMLButtonElement/);
  assert.match(entry, /aria-expanded=\{isOpen\}/);
  assert.match(entry, /aria-controls="unified-preflight-panel"/);
});

test('source-aware open and First Value are explicit, guarded, and emitted only by page runtime', () => {
  assert.match(page, /handleOpenPreflightReview = useCallback\(\(trigger: HTMLButtonElement, source: PreflightActivationSource\)/);
  assert.match(page, /if \(!isPreflightReviewOpen\) \{/);
  assert.match(page, /source,\s*\}\);\s*preflight\.evaluateAll\(\)/);
  assert.match(page, /setCurrentActivationAttemptSource\(source\)/);
  assert.match(page, /firstValueEmittedRef\.current/);
  assert.match(page, /activationPersistentStatus === 'completed'/);
  assert.match(page, /trackEvent\('preflight_first_value_reached'/);
  assert.match(page, /persistActivationStatus\('completed'\)/);
  assert.match(page, /if \(!isPreflightReviewOpen\) setCurrentActivationAttemptSource\(null\)/);
  assert.equal((page.match(/hasMeaningfulPreflightFirstValue\(preflight\.review\)/g) ?? []).length, 2);
  assert.doesNotMatch(canvas + prompt + entry, /trackEvent|localStorage|posthog/);
});

test('Packet 1 compatibility bridge is removed and runtime supplies source without fallback', () => {
  assert.doesNotMatch(analytics, /source-less overload|properties: \{ preflight_version: typeof UNIFIED_PREFLIGHT_REVIEW_VERSION \}/);
  assert.doesNotMatch(page + analytics, /source \?\? ['"]entry['"]/);
  assert.equal((page.match(/trackEvent\('preflight_review_opened'/g) ?? []).length, 1);
  assert.match(page, /preflight_version: UNIFIED_PREFLIGHT_REVIEW_VERSION,\s*source,/);
});

test('activation integration does not modify semantic ownership or graph persistence', () => {
  assert.doesNotMatch(page, /serializeGraph[^\n]*activation|GraphData[^\n]*activation/);
  assert.doesNotMatch(canvas + prompt, /evaluateAll|validateGraph|createSemanticPlan/);
  assert.equal((canvas.match(/<UnifiedPreflightEntryButton/g) ?? []).length, 1);
});
