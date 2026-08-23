import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { READINESS_RULES } from '../lib/readiness/rules';
import { READINESS_TRANSLATION_KEYS, translateReadinessKey } from '../lib/readiness/translations';
import { ReadinessEntryButton, readinessStatusLabel } from '../components/editor/readiness/ReadinessEntryButton';
import { ReadinessPanel, filterReadinessFindings } from '../components/editor/readiness/ReadinessPanel';
import { resolveReadinessNavigationTarget } from '../lib/readiness/navigation';
import type { ReadinessFinding, ReadinessResult, ReadinessStatus } from '../types/readiness';

const counts = { high: 0, medium: 0, low: 0, info: 0, total: 0 } as const;
const categories = ['workflow_structure', 'execution_configuration', 'tooling', 'output_contract', 'maintainability'] as const;
function result(status: ReadinessStatus, findings: ReadinessFinding[] = [], evaluable = true): ReadinessResult {
  const nextCounts = { ...counts };
  for (const finding of findings) { nextCounts[finding.impact]++; nextCounts.total++; }
  return { rulesetVersion: '0.1.0', evaluable, status, counts: nextCounts, findings, blockedByValidationCodes: evaluable ? [] : ['NO_AGENTS'], categories: categories.map(category => ({ category, status: evaluable ? 'ready' : 'not_evaluable', counts: { ...counts, total: findings.filter(x => x.category === category).length } })) };
}
function panel(value: ReadinessResult | null, lang: 'en' | 'ja' = 'en', error: Error | null = null, refreshing = false) {
  return renderToStaticMarkup(React.createElement(ReadinessPanel, { isOpen: true, result: value, error, isRefreshing: refreshing, lang, targetSummary: finding => finding.target.nodeId ?? finding.target.edgeId ?? 'Crew Config', onClose() {}, onRetry() {}, onLocate() {}, onOpenValidation() {} }));
}

test('all 15 rule title, explanation, and suggestion keys resolve in EN and JA without raw keys', () => {
  assert.equal(READINESS_RULES.length, 15);
  for (const rule of READINESS_RULES) for (const key of [rule.titleKey, rule.explanationKey, rule.suggestionKey].filter(Boolean) as string[]) {
    assert.notEqual(translateReadinessKey('en', key), key);
    assert.notEqual(translateReadinessKey('ja', key), key);
    assert.equal(READINESS_TRANSLATION_KEYS.includes(key as never), true);
  }
});

test('translation fallback is localized and never exposes a raw key', () => {
  assert.equal(translateReadinessKey('en', 'unknown.key'), 'Review this Readiness finding.');
  assert.equal(translateReadinessKey('ja', 'unknown.key'), 'Readinessの詳細を確認してください。');
});

test('entry renders all statuses with labels and accessibility state', () => {
  for (const status of ['ready', 'needs_attention', 'needs_improvement', 'not_evaluable'] as const) {
    const html = renderToStaticMarkup(React.createElement(ReadinessEntryButton, { status, lang: 'en', isOpen: true, onClick() {} }));
    assert.match(html, /aria-expanded="true"/); assert.match(html, /aria-controls="readiness-panel"/); assert.match(html, new RegExp(readinessStatusLabel(status, 'en')));
  }
  assert.equal(readinessStatusLabel('ready', 'ja'), '準備良好');
});

test('ready zero-findings and not-evaluable states render distinct workflows', () => {
  assert.match(panel(result('ready')), /No Readiness v0 findings/);
  const blocked = panel(result('not_evaluable', [], false));
  assert.match(blocked, /Readiness cannot be evaluated yet/); assert.match(blocked, /NO_AGENTS/); assert.match(blocked, /Open validation/); assert.doesNotMatch(blocked, /Readiness findings/);
});

test('all rules, repeated targets, impacts, technical Rule ID, and Packet D order render', () => {
  const findings = READINESS_RULES.map((rule, index): ReadinessFinding => ({ ruleId: rule.id, category: rule.category, impact: index === 0 ? 'high' : index === 1 ? 'medium' : index === 2 ? 'low' : 'info', target: { scope: 'node', nodeId: `node-${index}` }, titleKey: rule.titleKey, explanationKey: rule.explanationKey, ...(rule.suggestionKey ? { suggestionKey: rule.suggestionKey } : {}), source: { kind: 'readiness_rule' } }));
  findings.push({ ...findings[0], target: { scope: 'node', nodeId: 'node-repeat' } });
  const html = panel(result('needs_improvement', findings));
  for (const rule of READINESS_RULES) assert.match(html, new RegExp(translateReadinessKey('en', rule.titleKey)));
  assert.match(html, /high impact/); assert.match(html, /medium impact/); assert.match(html, /low impact/); assert.ok(html.indexOf(translateReadinessKey('en', findings[0].titleKey)) < html.indexOf(translateReadinessKey('en', findings[1].titleKey)));
  assert.match(html, /aria-expanded="false"/); assert.match(html, /aria-pressed="true"/); assert.match(html, /node-repeat/);
  assert.match(readFileSync('components/editor/readiness/ReadinessFindingCard.tsx', 'utf8'), /Rule ID/);
});

test('long EN/JA wraps, language switches text only, refreshing and error are explicit', () => {
  const finding: ReadinessFinding = { ruleId: 'RDY_HIERARCHICAL_ASSIGNMENT_IGNORED', category: 'execution_configuration', impact: 'high', target: { scope: 'node', nodeId: 'long-target' }, titleKey: READINESS_RULES[8].titleKey, explanationKey: READINESS_RULES[8].explanationKey, suggestionKey: READINESS_RULES[8].suggestionKey, source: { kind: 'readiness_rule' } };
  assert.match(panel(result('needs_improvement', [finding]), 'en'), /Explicit task ownership/);
  assert.match(panel(result('needs_improvement', [finding]), 'ja'), /Hierarchicalでは明示Task割当/);
  const updating = panel(result('needs_improvement', [finding]), 'en', null, true); assert.match(updating, /aria-busy="true"/); assert.match(updating, /Updating/); assert.match(updating, /disabled=""/);
  const failed = panel(null, 'en', new Error('failed')); assert.match(failed, /Readiness check failed/); assert.match(failed, /Retry/); assert.doesNotMatch(failed, />Ready</);
});

test('category filtering preserves Packet D order', () => {
  const findings = READINESS_RULES.slice(0, 5).map((rule, index): ReadinessFinding => ({ ruleId: rule.id, category: rule.category, impact: rule.impact, target: { scope: 'node', nodeId: `node-${index}` }, titleKey: rule.titleKey, explanationKey: rule.explanationKey, source: { kind: 'readiness_rule' } }));
  const expected = findings.filter(item => item.category === 'maintainability');
  assert.deepEqual(filterReadinessFindings(findings, 'maintainability'), expected);
  assert.equal(filterReadinessFindings(findings, 'all'), findings);
});

test('Node, Edge, Crew, graph and deleted targets resolve without crashing', () => {
  const node = { id: 'agent-1', type: 'agent', position: { x: 0, y: 0 }, data: { label: 'Agent', role: 'Role', goal: 'Goal', backstory: 'Story', model: 'openai/gpt-4o-mini', verbose: true, allowDelegation: false } } as const;
  const edge = { id: 'edge-1', source: 'agent-1', target: 'task-1' };
  assert.equal(resolveReadinessNavigationTarget({ scope: 'node', nodeId: 'agent-1' }, [node], [edge]).kind, 'node');
  assert.equal(resolveReadinessNavigationTarget({ scope: 'field', nodeId: 'agent-1', field: 'label' }, [node], [edge]).kind, 'node');
  assert.equal(resolveReadinessNavigationTarget({ scope: 'edge', edgeId: 'edge-1' }, [node], [edge]).kind, 'edge');
  assert.equal(resolveReadinessNavigationTarget({ scope: 'field', field: 'name' }, [node], [edge]).kind, 'crew');
  assert.equal(resolveReadinessNavigationTarget({ scope: 'graph' }, [node], [edge]).kind, 'graph');
  assert.equal(resolveReadinessNavigationTarget({ scope: 'node', nodeId: 'deleted' }, [node], [edge]).kind, 'missing');
  assert.equal(resolveReadinessNavigationTarget({ scope: 'edge', edgeId: 'deleted' }, [node], [edge]).kind, 'missing');
});
