import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResourceAnalysisPanel } from '../components/editor/resource-analysis/ResourceAnalysisPanel';
import type { ResourceAnalysisState } from '../hooks/useResourceAnalysis';
import { translations } from '../lib/i18n/translations';
import type { ResourceAnalysisReadModel } from '../types/resource-analysis';

const longModel = 'vendor/a-very-long-custom-model-identifier-that-must-remain-completely-visible/version-2026-08-24';
const result: ResourceAnalysisReadModel = {
  version: '0.1.0',
  process: 'hierarchical',
  summary: { agentCount: 1, taskCount: 2, toolCount: 1, executionStepCount: 2, uniqueModelCount: 1, dependencyDepth: 3, maxContextFanIn: 2, asyncTaskCount: 1, fixedAssignmentCount: 0, managerDelegatedTaskCount: 2, agentToolBindingCount: 1, taskToolBindingCount: 1 },
  models: [{ model: longModel, agents: [{ agentId: 'agent-a', label: 'Researcher', role: 'Research role' }], agentCount: 1, usedByManager: true, referenceCount: 2 }],
  tasks: [
    { task: { taskId: 'task-a', label: 'Research', planOrder: 0 }, assignment: { kind: 'manager_delegated', configuredAgent: { agentId: 'agent-a', label: 'Researcher', role: 'Research role' } }, asyncConfigured: true, dependencyDepth: 1, contextFanIn: 0, directTools: [] },
    { task: { taskId: 'task-b', label: 'Report', planOrder: 1 }, assignment: { kind: 'manager_delegated' }, asyncConfigured: false, dependencyDepth: 3, contextFanIn: 2, directTools: [{ toolId: 'tool-a', label: 'Reader', toolType: 'FileReadTool' }] },
  ],
  agentGuards: [{ agent: { agentId: 'agent-a', label: 'Researcher', role: 'Research role' }, maxIter: { value: 25, source: 'codegen_default' }, maxRpm: { value: null, source: 'codegen_default' }, maxExecutionTime: { value: 60, source: 'configured' } }],
  toolBindings: [{ tool: { toolId: 'tool-a', label: 'Reader', toolType: 'FileReadTool' }, agentBindings: [{ agentId: 'agent-a', label: 'Researcher', role: 'Research role' }], taskBindings: [{ taskId: 'task-b', label: 'Report', planOrder: 1 }], agentBindingCount: 1, taskBindingCount: 1, totalBindingCount: 2 }],
  hotspots: [
    { kind: 'dependency_depth', value: 3, target: { type: 'task', id: 'task-b' } },
    { kind: 'context_fan_in', value: 2, target: { type: 'task', id: 'task-b' } },
    { kind: 'tool_binding_concentration', value: 2, target: { type: 'tool', id: 'tool-a' } },
  ],
  unknowns: [{ code: 'runtime_cost' }, { code: 'runtime_latency' }, { code: 'token_consumption' }, { code: 'tool_invocation_count' }, { code: 'tool_execution_duration' }, { code: 'actual_iteration_count' }, { code: 'manager_runtime_assignment' }],
  manager: { model: longModel },
};

const available: ResourceAnalysisState = { status: 'available', result, blockingCodes: [], error: null };
const panel = (state: ResourceAnalysisState | null, lang: 'en' | 'ja' = 'en', isRefreshing = false) => renderToStaticMarkup(React.createElement(ResourceAnalysisPanel, { isOpen: true, state, isRefreshing, lang, notice: null, onClose() {}, onRetry() {}, onOpenValidation() {}, onLocate() { return true; } }));

test('panel exposes responsive identity, busy state, disclaimer, and accessible control sizing', () => {
  const html = panel(available);
  assert.match(html, /id="resource-analysis-panel"/);
  assert.match(html, /aria-labelledby="resource-analysis-heading"/);
  assert.match(html, /id="resource-analysis-heading"/);
  assert.match(html, /aria-busy="false"/);
  assert.match(html, /Static preflight analysis/);
  assert.match(html, /max-h-\[78dvh\]/);
  const source = readFileSync('components/editor/resource-analysis/ResourceAnalysisPanel.tsx', 'utf8');
  assert.match(source, /tabIndex=\{-1\}/);
  assert.match(source, /min-h-11 min-w-11/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /motion-reduce:animate-none/);
});

test('focus, Escape, and successful Locate suppression follow the established panel contract', () => {
  const source = readFileSync('components/editor/resource-analysis/ResourceAnalysisPanel.tsx', 'utf8');
  assert.match(source, /previousFocus\.current = document\.activeElement/);
  assert.match(source, /requestAnimationFrame\(\(\) => heading\.current\?\.focus\(\)\)/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /if \(!locating\.current\) previousFocus\.current\?\.focus\(\)/);
  assert.match(source, /locating\.current = onLocate\(target, 'hotspot'\)/);
});

test('refresh, empty, invalid, unavailable, and defensive null states are distinct and safe', () => {
  const refreshing = panel(null, 'en', true);
  assert.match(refreshing, /Updating analysis/);
  assert.doesNotMatch(refreshing, /Research role|Deepest dependency path/);
  assert.match(panel({ status: 'empty', result: null, blockingCodes: [], error: null }), /No workflow to analyze yet/);
  const invalid = panel({ status: 'invalid', result: null, blockingCodes: ['NO_AGENTS', 'NO_TASKS'], error: null });
  assert.match(invalid, /NO_AGENTS/); assert.match(invalid, /NO_TASKS/); assert.match(invalid, /Open Validation/);
  const unavailable = panel({ status: 'unavailable', result: null, blockingCodes: [], error: new Error('private projection details') });
  assert.match(unavailable, /could not be generated/); assert.match(unavailable, /Retry/); assert.doesNotMatch(unavailable, /private projection details/);
  assert.doesNotThrow(() => panel(null));
});

test('available overview and structural metrics preserve read-model facts without scoring', () => {
  const html = panel(available);
  for (const expected of ['Hierarchical', 'Execution steps', 'Unique models', 'Dependency depth', 'Max context fan-in', 'Async configured tasks', 'Fixed assignments', 'Manager-delegated tasks', 'Agent tool bindings', 'Task tool bindings']) assert.match(html, new RegExp(expected));
  assert.doesNotMatch(html, /complexity score|low complexity|high complexity/i);
});

test('hotspots render all three neutral kinds, values, Locate controls, and a neutral empty case', () => {
  const html = panel(available);
  for (const expected of ['Deepest dependency path', 'Highest direct context fan-in', 'Highest tool binding concentration']) assert.match(html, new RegExp(expected));
  assert.equal((html.match(/>Locate</g) || []).length, 3);
  assert.doesNotMatch(html, /Warning|Critical|High risk/);
  const noHotspots = panel({ ...available, result: { ...result, hotspots: [] } });
  assert.match(noHotspots, /No structural hotspots under the v0 rules/);
});

test('models and manager retain complete IDs, usage counts, and references', () => {
  const html = panel(available);
  assert.match(html, new RegExp(longModel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const expected of ['Agent count', 'Reference count', 'Used by manager', 'Agent references', 'Researcher', 'Manager']) assert.match(html, new RegExp(expected));
  const source = readFileSync('components/editor/resource-analysis/ResourceAnalysisPanel.tsx', 'utf8');
  assert.match(source, /break-all/); assert.match(source, /overflow-wrap:anywhere/);
});

test('execution guards distinguish defaults, configured values, and null as not configured', () => {
  const en = panel(available); const ja = panel(available, 'ja');
  assert.match(en, /25 · Codegen default/); assert.match(en, /60 · Configured/); assert.match(en, /Not configured/);
  assert.match(ja, /25 · コード生成デフォルト/); assert.match(ja, /60 · 設定済み/); assert.match(ja, /未設定/);
  assert.doesNotMatch(en, /Unlimited/); assert.doesNotMatch(ja, /無制限/);
});

test('task metrics preserve async, hierarchical configured-agent, depth, fan-in, and direct-tool semantics', () => {
  const html = panel(available);
  for (const expected of ['Task metrics', 'Plan order', 'Direct context fan-in', 'Async configured', 'Manager delegated', 'Configured Agent', 'Direct tools', 'Reader · FileReadTool']) assert.match(html, new RegExp(expected));
  assert.doesNotMatch(html, /Parallel guaranteed|Concurrent|Faster/);
  assert.doesNotMatch(html, /Fixed assignment: Researcher/);
});

test('tool bindings keep Agent, Task, and total binding counts separate from runtime invocations', () => {
  const html = panel(available);
  for (const expected of ['Tool bindings', 'Agent bindings', 'Task bindings', 'Total bindings', 'Bound Agents', 'Bound Tasks']) assert.match(html, new RegExp(expected));
  assert.doesNotMatch(html, /Usage count|Call count/);
});

test('runtime unknowns render every supported code as a separate non-severity boundary', () => {
  const html = panel(available);
  for (const expected of ['Runtime cost', 'Runtime duration', 'Token consumption', 'Actual tool invocation count', 'Tool execution duration', 'Actual iteration count', 'Manager runtime assignment', 'cannot be determined from static configuration alone']) assert.match(html, new RegExp(expected));
});

test('Resource Analysis copy is complete in EN and JA and avoids unsupported claims', () => {
  const keys = Object.keys(translations.en).filter((key) => key.startsWith('resourceAnalysis')) as (keyof typeof translations.en)[];
  assert.ok(keys.length >= 60);
  for (const key of keys) { assert.equal(typeof translations.en[key], 'string'); assert.ok(translations.en[key]); assert.equal(typeof translations.ja[key], 'string'); assert.ok(translations.ja[key]); }
  const scoped = keys.flatMap((key) => [translations.en[key], translations.ja[key]]).join('\n');
  assert.doesNotMatch(scoped, /complexity score|low complexity|high complexity|estimated cost|estimated latency|Unlimited|無制限/i);
  const ja = panel(available, 'ja');
  assert.match(ja, /リソース・複雑性分析/); assert.match(ja, /実行前の静的解析/); assert.match(ja, /実行時に未確定の値/);
});

test('RA-C2 component stays outside Canvas, app, analytics, persistence, and graph semantics', () => {
  const source = readFileSync('components/editor/resource-analysis/ResourceAnalysisPanel.tsx', 'utf8');
  for (const forbidden of ['@xyflow/react', 'useReactFlow', 'validateGraph', 'createSemanticPlan', 'createResourceAnalysisReadModel', 'localStorage', 'sessionStorage', 'analytics', 'useResourceAnalysis(']) assert.equal(source.includes(forbidden), false, forbidden);
});
