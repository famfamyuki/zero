import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = (path: string) => readFileSync(path, 'utf8');
const page = source('app/page.tsx');
const panel = source('components/editor/unified-preflight/UnifiedPreflightPanel.tsx');
const header = source('components/editor/Header.tsx');
const modal = source('components/editor/CodeExportModal.tsx');

test('Back to finding suppresses competing heading focus and retains fallback behavior', () => {
  const back = page.slice(page.indexOf('const handleBackToReview'), page.indexOf('const counts'));
  assert.ok(back.indexOf('setFocusPreflightHeadingOnOpen(false)') < back.indexOf('setIsPreflightReviewOpen(true)'));
  assert.match(back, /\[data-review-item=/);
  assert.match(back, /item\.focus\(\{ preventScroll: false \}\)/);
  assert.match(back, /unified-preflight-heading/);
  assert.match(back, /previous review item is no longer present/);
  assert.match(panel, /if \(!isOpen \|\| props\.focusHeadingOnOpen === false\) return/);
  assert.match(page, /focusHeadingOnOpen=\{focusPreflightHeadingOnOpen\}/);
});

test('normal Preflight entry still requests heading focus', () => {
  const open = page.slice(page.indexOf('const handleOpenPreflightReview'), page.indexOf('const handlePreflightStageChange'));
  assert.ok(open.indexOf('setFocusPreflightHeadingOnOpen(true)') < open.indexOf('setIsPreflightReviewOpen(true)'));
  assert.match(panel, /headingRef\.current\?\.focus/);
});

test('CrewAI Python Export captures the stable Header Export invoker', () => {
  assert.match(header, /ref=\{exportButtonRef\}/);
  assert.match(header, /onGenerateCode\(exportButtonRef\.current \?\? event\.currentTarget\)/);
  assert.match(page, /codeExportEntryRef\.current = trigger/);
  assert.match(page, /onGenerateCode=\{handleGenerateCode\}/);
});

test('Code Export modal owns initial focus, traps Tab, closes on Escape, and restores invoker', () => {
  assert.match(modal, /ref=\{dialogRef\}/);
  assert.match(modal, /ref=\{closeButtonRef\}/);
  assert.match(modal, /closeButtonRef\.current\?\.focus/);
  assert.match(modal, /e\.key === 'Tab'/);
  assert.match(modal, /e\.shiftKey/);
  assert.match(modal, /e\.key === 'Escape'/);
  const close = page.slice(page.indexOf('const closeCodeExportModal'), page.indexOf('const handleOpenPreflightReview'));
  assert.equal((close.match(/requestAnimationFrame/g) ?? []).length, 2);
  assert.match(close, /entry\?\.isConnected/);
  assert.match(close, /entry\.focus\(\{ preventScroll: true \}\)/);
  assert.match(page, /onClose=\{closeCodeExportModal\}/);
});

test('focus hardening does not alter export generation or persistence contracts', () => {
  assert.doesNotMatch(modal, /localStorage|GraphDocumentV2|trackEvent\('code_generated'/);
  assert.doesNotMatch(page.slice(page.indexOf('const closeCodeExportModal'), page.indexOf('const handleOpenPreflightReview')), /serializeGraph|setNodes|setEdges/);
});
