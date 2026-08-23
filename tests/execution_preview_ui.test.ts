import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { ExecutionPreviewEntryButton } from '../components/editor/execution-preview/ExecutionPreviewEntryButton';
import { ExecutionPreviewPanel } from '../components/editor/execution-preview/ExecutionPreviewPanel';
import { resolveExecutionPreviewNavigationTarget } from '../lib/execution-preview-navigation';
import type { ExecutionPreviewReadModel } from '../types/execution-preview';
import type { ExecutionPreviewState } from '../hooks/useExecutionPreview';
import type { CustomNode } from '../types/editor';

const agent = { agentId: 'agent-a', label: 'Researcher', role: 'Research role', model: 'openai/gpt-5', tools: [{ toolId: 'tool-agent', label: 'Agent Search', toolType: 'SerperDevTool' }] } as const;
const sequential: ExecutionPreviewReadModel = {
  version: '0.1.0', process: 'sequential', summary: { taskCount: 2, agentCount: 1, toolCount: 2 }, agents: [agent], tools: [{ toolId: 'tool-agent', label: 'Agent Search', toolType: 'SerperDevTool' }, { toolId: 'tool-task', label: 'Task Reader', toolType: 'FileReadTool' }],
  steps: [
    { taskId: 'task-a', label: 'Research', planOrder: 1, assignment: { kind: 'fixed', agent: { agentId: 'agent-a', label: 'Researcher', role: 'Research role' } }, context: [], directTools: [], description: 'Research safely', expectedOutput: 'Notes', asyncExecution: false, outputFormat: 'text', humanInput: false, markdown: false },
    { taskId: 'task-b', label: 'Report', planOrder: 2, assignment: { kind: 'fixed', agent: { agentId: 'agent-a', label: 'Researcher', role: 'Research role' } }, context: [{ taskId: 'task-a', label: 'Research' }], directTools: [{ toolId: 'tool-task', label: 'Task Reader', toolType: 'FileReadTool' }], description: 'Write report', expectedOutput: 'Report', asyncExecution: true, outputFormat: 'json', humanInput: true, markdown: true, outputFile: 'report.json' },
  ],
};
const hierarchical: ExecutionPreviewReadModel = { ...sequential, process: 'hierarchical', manager: { model: 'anthropic/claude-sonnet' }, steps: sequential.steps.map((step, index) => ({ ...step, assignment: index === 0 ? { kind: 'manager_delegated' as const, configuredAgent: { agentId: 'agent-a', label: 'Researcher', role: 'Research role' } } : { kind: 'manager_delegated' as const } })) };
const available = (result: ExecutionPreviewReadModel): ExecutionPreviewState => ({ status: 'available', result, blockingCodes: [], error: null });
const panel = (state: ExecutionPreviewState, lang: 'en' | 'ja' = 'en', refreshing = false) => renderToStaticMarkup(React.createElement(ExecutionPreviewPanel, { isOpen: true, state, isRefreshing: refreshing, lang, notice: null, onClose() {}, onRetry() {}, onLocate() { return true; }, onOpenValidation() {} }));

test('entry is localized and exposes expanded/control accessibility state', () => {
  const en = renderToStaticMarkup(React.createElement(ExecutionPreviewEntryButton, { lang: 'en', isOpen: true, onClick() {} }));
  const ja = renderToStaticMarkup(React.createElement(ExecutionPreviewEntryButton, { lang: 'ja', isOpen: false, onClick() {} }));
  assert.match(en, /Execution Preview/); assert.match(en, /aria-expanded="true"/); assert.match(en, /aria-controls="execution-preview-panel"/);
  assert.match(ja, /実行プレビュー/); assert.match(ja, /プラン/); assert.match(ja, /aria-label="実行プレビューを開く"/);
});

test('sequential panel preserves order, context, direct vs Agent tools, async facts and task metadata', () => {
  const html = panel(available(sequential));
  assert.match(html, /Static code-generation plan/); assert.ok(html.indexOf('Research') < html.indexOf('Report'));
  assert.match(html, /Plan order 1/); assert.match(html, /Fixed assignment/); assert.match(html, /Context from/);
  assert.match(html, /Task Reader/); assert.match(html, /Agent Search/); assert.match(html, /Async enabled/); assert.match(html, /Runtime overlap or timing is not predicted/);
  assert.match(html, /Structured JSON/); assert.match(html, /report.json/); assert.doesNotMatch(html, /manager delegates tasks at runtime/i);
  assert.match(html, /<ol/); assert.match(html, /aria-labelledby="execution-preview-heading"/); assert.match(html, /aria-busy="false"/);
});

test('hierarchical panel shows plan order, manager and configured Agent as informational only in EN and JA', () => {
  const en = panel(available(hierarchical)); const ja = panel(available(hierarchical), 'ja');
  assert.match(en, /Manager delegated/); assert.match(en, /Configured Agent/); assert.match(en, /Not emitted as a fixed Task assignment/); assert.match(en, /does not predict which Agent/); assert.doesNotMatch(en, /Executing Agent|Will execute/);
  assert.match(ja, /Manager委任/); assert.match(ja, /設定済みAgent/); assert.match(ja, /実行Agentを予測しません/); assert.match(ja, /コード生成時の静的プラン/);
});

test('empty, invalid, internal error and refreshing states never show a stale plan', () => {
  assert.match(panel({ status: 'empty', result: null, blockingCodes: [], error: null }), /No workflow to preview yet/);
  const invalid = panel({ status: 'invalid', result: null, blockingCodes: ['NO_TASKS'], error: null }); assert.match(invalid, /Execution Preview unavailable/); assert.match(invalid, /NO_TASKS/); assert.match(invalid, /Open Validation/);
  const error = panel({ status: 'error', result: null, blockingCodes: [], error: new Error('private') }); assert.match(error, /could not be generated/); assert.doesNotMatch(error, /private/);
  const refreshing = panel(available(sequential), 'en', true); assert.match(refreshing, /Updating execution plan/); assert.doesNotMatch(refreshing, /Research safely/);
});

test('Locate resolution accepts stable node IDs and safely rejects stale or wrong-kind targets', () => {
  const node = { id: 'task-a', type: 'task', position: { x: 1, y: 2 }, data: { label: 'Task', description: 'D', expectedOutput: 'O', asyncExecution: false } } as CustomNode;
  assert.equal(resolveExecutionPreviewNavigationTarget('task', 'task-a', [node]).kind, 'node');
  assert.equal(resolveExecutionPreviewNavigationTarget('agent', 'task-a', [node]).kind, 'missing');
  assert.equal(resolveExecutionPreviewNavigationTarget('tool', 'deleted', [node]).kind, 'missing');
  assert.equal(resolveExecutionPreviewNavigationTarget('crew', undefined, [node]).kind, 'crew');
});

test('presentation components do not import graph semantics or recalculate ordering', () => {
  const sources = ['components/editor/execution-preview/ExecutionPreviewPanel.tsx', 'components/editor/execution-preview/ExecutionPreviewStepCard.tsx'].map((path) => readFileSync(path, 'utf8')).join('\n');
  for (const forbidden of ['validateGraph', 'createSemanticPlan', 'normalizeModel', 'CodegenPlan', '@xyflow/react', '.sort(']) assert.equal(sources.includes(forbidden), false, forbidden);
});
