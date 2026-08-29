import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { sanitizeAnalyticsProperties } from '../lib/analytics-config';

const source = (path: string) => readFileSync(path, 'utf8');
const page = source('app/page.tsx');
const header = source('components/editor/Header.tsx');
const overview = source('components/editor/WorkflowOverview.tsx');
const preflight = source('components/editor/unified-preflight/UnifiedPreflightPanel.tsx');
const finding = source('components/editor/readiness/ReadinessFindingCard.tsx');

test('Product shell exposes only Overview, Design, and Preflight peer surfaces', () => {
  assert.match(header, /export type EditorSurface = 'overview' \| 'design' \| 'preflight'/);
  assert.match(header, /aria-current=/);
  assert.doesNotMatch(header, />Changes<|>History<|>Runtime<|Architecture Review/);
  assert.match(page, /useState<EditorSurface>\('overview'\)/);
});

test('Overview presents the four fixed entry choices and truthful browser origin', () => {
  const entries = overview.slice(overview.indexOf('const cards = ['), overview.indexOf('return <main'));
  const order = ['CrewAI Python', 'AgentGraph JSON', 'Example / Template', 'Manual Design'].map((label) => entries.indexOf(label));
  assert.ok(order.every((index) => index >= 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.match(overview, /Current browser workflow/);
  assert.match(overview, /Original source is not retained in the current Graph artifact\./);
  assert.match(overview, /Python is not executed/);
});

test('Preflight is main content rather than a Canvas overlay and Design retains current editor', () => {
  assert.match(preflight, /return <main id="unified-preflight-panel"/);
  assert.doesNotMatch(preflight, /fixed inset|max-h-\[80dvh\]/);
  for (const component of ['<Sidebar', '<Canvas', '<Inspector']) assert.match(page, new RegExp(component));
});

test('Readiness anatomy and evidence details are explicit without fabricated Unknown or recommendation', () => {
  for (const label of ['What', 'Where', 'Why', 'Next', 'Deterministic basis']) assert.match(finding, new RegExp(label));
  assert.match(finding, /Object\.entries\(finding\.evidence\)/);
  assert.match(finding, /finding\.suggestionKey \?/);
  assert.doesNotMatch(finding, /Unknown impact|Recommended action/);
});

test('Locate return context is session-only and mobile support placement is privacy-safe', () => {
  assert.match(page, /useState<ReviewReturnContext \| null>\(null\)/);
  assert.match(page, /Back to finding is available/);
  assert.doesNotMatch(page, /mobile_sticky/);
  assert.deepEqual(sanitizeAnalyticsProperties('buymeacoffee_clicked', { placement: 'mobile_more', workflow: 'private', node_id: 'private' }), { placement: 'mobile_more' });
});

test('presentation-only state does not enter Graph persistence or semantic contracts', () => {
  const serialized = page.slice(page.indexOf('// Auto-sync state changes'), page.indexOf('// Listen for explicit node edit'));
  assert.doesNotMatch(serialized, /surface|presentationOrigin|reviewReturnContext/);
  assert.doesNotMatch(page, /GraphDocumentV2|WorkflowV2|Architecture Review|Semantic Patch/);
});
