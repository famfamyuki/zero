import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { shouldIgnoreSelectionChangeForOpenPreflight } from '../lib/preflight-navigation';

const page = readFileSync('app/page.tsx', 'utf8');
const panel = readFileSync('components/editor/unified-preflight/UnifiedPreflightPanel.tsx', 'utf8');
const entry = readFileSync('components/editor/unified-preflight/UnifiedPreflightEntryButton.tsx', 'utf8');
const between = (start: string, end: string) => page.slice(page.indexOf(start), page.indexOf(end));

test('entry and page retain explicit trigger focus ownership', () => {
  assert.match(entry, /trigger\.focus\(\{ preventScroll: true \}\); onActivate\(trigger\)/);
  assert.match(entry, /onPointerDown=.*stopPropagation/); assert.match(entry, /onClick=.*event\.detail === 0/);
  assert.match(page, /const preflightReviewEntryRef = useRef<HTMLButtonElement \| null>\(null\)/);
  assert.match(page, /preflightReviewEntryRef\.current = trigger/);
});

test('normal Close and Escape share owner release and double-rAF focus restoration', () => {
  const close = between('const closePreflightReview', 'const handleLocateExecutionPreview');
  const restore = between('const restoreEntryFocus', 'const closePreflightReview');
  assert.match(close, /preflightSelectionOwnerRef\.current = null/); assert.match(close, /setIsPreflightReviewOpen\(false\)/); assert.match(close, /restoreEntryFocus\(preflightReviewEntryRef\.current\)/);
  assert.equal((restore.match(/requestAnimationFrame/g) ?? []).length, 2); assert.match(restore, /entry\?\.isConnected/);
  assert.match(panel, /event\.key === 'Escape'/); assert.match(panel, /onClose\(\)/); assert.match(page, /onClose=\{closePreflightReview\}/);
});

test('Unified owner is claimed before opening and suppresses passive selection', () => {
  const open = between('const handleOpenPreflightReview', 'const handlePreflightStageChange');
  assert.ok(open.indexOf("preflightSelectionOwnerRef.current = 'unified_preflight'") < open.indexOf('setIsPreflightReviewOpen(true)'));
  assert.match(open, /if \(!isPreflightReviewOpen\) \{[\s\S]*preflight\.evaluateAll\(\);[\s\S]*\}/);
  assert.equal(shouldIgnoreSelectionChangeForOpenPreflight('unified_preflight'), true); assert.equal(shouldIgnoreSelectionChangeForOpenPreflight(null), false);
  assert.match(page, /shouldIgnoreSelectionChangeForOpenPreflight\(preflightSelectionOwnerRef\.current\)/);
});

test('explicit Inspector, Crew settings, and Code Export release owner and close Unified', () => {
  const inspector = between('const handleOpenInspector', "window.addEventListener('open-node-inspector'");
  const code = between('const handleGenerateCode', 'const handleOpenPreflightReview');
  const crew = page.slice(page.indexOf('onToggleSettings={() =>'), page.indexOf('nodeCount={nodes.length}'));
  for (const source of [inspector, code, crew]) { assert.match(source, /preflightSelectionOwnerRef\.current = null/); assert.match(source, /setIsPreflightReviewOpen\(false\)/); }
  assert.match(inspector, /setIsInspectorOpen\(true\)/); assert.match(crew, /setIsInspectorOpen\(!isInspectorOpen\)/); assert.match(code, /setIsCodeModalOpen\(true\)/);
});

test('Overview open emits only the Unified opened event and can emit again after close', () => {
  const open = between('const handleOpenPreflightReview', 'const handlePreflightStageChange');
  assert.doesNotMatch(open, /readiness_opened|execution_preview_opened|resource_analysis_opened/);
  assert.equal((open.match(/trackEvent\('preflight_review_opened'/g) ?? []).length, 1);
  assert.match(open, /if \(!isPreflightReviewOpen\)/);
  assert.match(open, /preflight_version: UNIFIED_PREFLIGHT_REVIEW_VERSION/);
  assert.doesNotMatch(open, /preflight_review_stage_selected|preflight_review_re_evaluated/);
  assert.doesNotMatch(open, /useRef|sessionStorage|openedOnce/);
});

test('explicit stage selection retains exact legacy analytics and deduplicates active-stage selection', () => {
  const stage = between('const handlePreflightStageChange', 'const restoreEntryFocus');
  assert.ok(stage.indexOf('if (stage === activePreflightStage) return') < stage.indexOf('setActivePreflightStage(stage)'));
  assert.ok(stage.indexOf('if (stage === activePreflightStage) return') < stage.indexOf("trackEvent('preflight_review_stage_selected', { stage })"));
  assert.equal((stage.match(/trackEvent\('preflight_review_stage_selected', \{ stage \}\)/g) ?? []).length, 1);
  assert.match(stage, /trackEvent\('readiness_opened', \{ status: readiness\.result\.status, evaluable: readiness\.result\.evaluable, ruleset_version: readiness\.result\.rulesetVersion \}\)/);
  assert.match(stage, /trackEvent\('execution_preview_opened', \{ state: executionPreview\.state\.status, process:/); assert.match(stage, /preview_version: '0\.1\.0'/);
  assert.match(stage, /trackEvent\('resource_analysis_opened', createResourceAnalysisOpenedAnalyticsProperties\(resourceAnalysis\.state\)\)/);
});

test('manual Re-evaluate emits once, clears stale notices, and calls only evaluateAll exactly once', () => {
  const reevaluate = between('const handleReevaluatePreflight', 'const restoreEntryFocus');
  assert.equal((reevaluate.match(/preflight\.evaluateAll\(\)/g) ?? []).length, 1);
  assert.match(reevaluate, /setReadinessNotice\(null\)/);
  assert.match(reevaluate, /setExecutionPreviewNotice\(null\)/);
  assert.match(reevaluate, /setResourceAnalysisNotice\(null\)/);
  assert.doesNotMatch(reevaluate, /readiness\.evaluateNow|executionPreview\.evaluateNow|resourceAnalysis\.evaluateNow/);
  assert.doesNotMatch(reevaluate, /setActivePreflightStage|setIsPreflightReviewOpen|preflightSelectionOwnerRef|setSelectedNode|setNodes|setEdges|setIsInspectorOpen|setIsMobileSidebarOpen/);
  assert.equal((reevaluate.match(/trackEvent\('preflight_review_re_evaluated'/g) ?? []).length, 1);
  assert.match(reevaluate, /trackEvent\('preflight_review_re_evaluated', \{ stage: activePreflightStage \}\)/);
  assert.match(panel, /onClick=\{props\.onReevaluate\}/);
  assert.doesNotMatch(panel, /key=\{.*updatedNotice|updatedNotice.*key=/);
  assert.match(page, /if \(!isPreflightReviewOpen\) setPreflightUpdatedNotice\(null\)/);
  assert.match(page, /if \(preflight\.isRefreshing\) setPreflightUpdatedNotice\(null\)/);
});

test('Unified analytics stay inside explicit user action handlers', () => {
  assert.equal((page.match(/trackEvent\('preflight_review_opened'/g) ?? []).length, 1);
  assert.equal((page.match(/trackEvent\('preflight_review_stage_selected'/g) ?? []).length, 1);
  assert.equal((page.match(/trackEvent\('preflight_review_re_evaluated'/g) ?? []).length, 1);
  assert.doesNotMatch(panel, /preflight_review_/);
  assert.doesNotMatch(readFileSync('hooks/useUnifiedPreflight.ts', 'utf8'), /preflight_review_|trackEvent/);
});

test('active Unified stage remains page-session state and is not reset by workflow actions', () => {
  assert.match(page, /useState<UnifiedPreflightStage>\('overview'\)/);
  const actions = page.slice(page.indexOf('const handleReevaluatePreflight'), page.indexOf('const readinessTargetSummary'));
  assert.doesNotMatch(actions, /setActivePreflightStage/);
  assert.doesNotMatch(page, /localStorage[^\n]*activePreflightStage|serializeGraph[^\n]*activePreflightStage|searchParams[^\n]*activePreflightStage/);
});

test('missing targets preserve Unified navigation state while valid Locate retains destination focus', () => {
  const readiness = between('const handleLocateFinding', 'const readinessTargetSummary');
  const execution = between('const handleLocateExecutionPreview', 'const handleLocateResourceAnalysis');
  const resource = between('const handleLocateResourceAnalysis', 'const handleLocateFinding');
  for (const [source, marker] of [[readiness, 'if (!node)'], [readiness, 'if (!edge)'], [execution, "if (target.kind === 'missing')"], [resource, "if (target.kind === 'missing')"]] as const) {
    const missing = source.slice(source.indexOf(marker), source.indexOf('return', source.indexOf(marker)) + 6);
    assert.doesNotMatch(missing, /setIsPreflightReviewOpen|setActivePreflightStage|preflightSelectionOwnerRef|setSelectedNode|setIsInspectorOpen/);
  }
  assert.doesNotMatch(readiness + execution + resource, /closePreflightReview\(/);
  assert.match(readiness, /focus-flow-node|focus-flow-edge/);
  assert.match(execution, /focus-inspector-heading|focus-manager-llm/);
  assert.match(resource, /focus-inspector-heading|focus-manager-llm/);
});

test('Readiness and Execution interaction analytics and destination focus remain unchanged', () => {
  const readiness = between('const handleLocateFinding', 'const readinessTargetSummary');
  const execution = between('const handleLocateExecutionPreview', 'const handleLocateResourceAnalysis');
  assert.match(readiness, /trackEvent\('readiness_finding_selected', \{ rule_id: finding\.ruleId, impact: finding\.impact, category: finding\.category, target_scope: target\.scope \}\)/);
  assert.match(execution, /trackEvent\('execution_preview_located', \{ target_type: targetType, source \}\)/); assert.match(execution, /target_type: 'crew'/);
  assert.match(execution, /setIsPreflightReviewOpen\(false\)/); assert.match(execution, /focus-flow-node/); assert.match(execution, /focus-inspector-heading|focus-manager-llm/);
});

test('Resource hotspot intent is tracked before resolution and missing refreshes without closing or opening Inspector', () => {
  const resource = between('const handleLocateResourceAnalysis', 'const handleLocateFinding');
  assert.ok(resource.indexOf("trackEvent('resource_analysis_hotspot_selected'") < resource.indexOf('resolvePreflightNavigationTarget'));
  const missing = resource.slice(resource.indexOf("if (target.kind === 'missing')"), resource.indexOf('preflightSelectionOwnerRef.current = null'));
  assert.match(missing, /resourceAnalysis\.evaluateNow\(\)/); assert.match(missing, /setResourceAnalysisNotice/);
  assert.doesNotMatch(missing, /setIsPreflightReviewOpen\(false\)|setIsInspectorOpen\(true\)|trackEvent\(/);
});

test('successful Resource Task, Tool, and Crew destinations close Unified and retain focus transfer', () => {
  const resource = between('const handleLocateResourceAnalysis', 'const handleLocateFinding');
  const success = resource.slice(resource.indexOf('preflightSelectionOwnerRef.current = null'));
  assert.match(success, /setIsPreflightReviewOpen\(false\)/); assert.match(success, /setIsInspectorOpen\(true\)/);
  assert.match(success, /focus-manager-llm/); assert.match(success, /focus-flow-node/); assert.match(success, /focus-inspector-heading/);
  assert.match(success, /item\.id === node\.id/);
});

test('all three Open Validation paths use one overlap-safe parent transition', () => {
  assert.equal((panel.match(/onOpenValidation=\{props\.onOpenValidation\}/g) ?? []).length, 3);
  const wiring = page.slice(page.indexOf('<UnifiedPreflightPanel'), page.indexOf('/>', page.indexOf('<UnifiedPreflightPanel')) + 2);
  assert.match(wiring, /onOpenValidation=\{\(\) => \{ preflightSelectionOwnerRef\.current = null; setIsPreflightReviewOpen\(false\); setIsCodeModalOpen\(true\); \}\}/);
});

test('single-entry, Unified-hook, persistence, codegen, and analytics boundaries remain intact', () => {
  const canvas = readFileSync('components/editor/Canvas.tsx', 'utf8');
  assert.equal((canvas.match(/<UnifiedPreflightEntryButton/g) ?? []).length, 1); assert.doesNotMatch(canvas, /<ReadinessEntryButton|<ExecutionPreviewEntryButton|<ResourceAnalysisEntryButton/);
  assert.match(page, /const preflight = useUnifiedPreflight\(readinessGraph\)/); assert.doesNotMatch(page, /useReadinessEvaluation\(|useExecutionPreview\(|useResourceAnalysis\(/);
  assert.doesNotMatch(panel, /validateGraph|createSemanticPlan|localStorage|serializeGraph|trackEvent/);
});
