'use client';

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { translations, type Language } from '@/lib/i18n/translations';
import type { ReadinessCategory, ReadinessFinding } from '@/types/readiness';
import type { UnifiedPreflightStage } from '@/types/unified-preflight';
import type { useUnifiedPreflight } from '@/hooks/useUnifiedPreflight';
import type { ExecutionPreviewLocateSource, ExecutionPreviewTargetType } from '@/components/editor/execution-preview/ExecutionPreviewStepCard';
import type { ResourceAnalysisLocateContext } from '@/components/editor/resource-analysis/ResourceAnalysisStageContent';
import type { ResourceAnalysisTarget } from '@/types/resource-analysis';
import { ReadinessStageContent } from '@/components/editor/readiness/ReadinessStageContent';
import { ExecutionPreviewStageContent } from '@/components/editor/execution-preview/ExecutionPreviewStageContent';
import { ResourceAnalysisStageContent } from '@/components/editor/resource-analysis/ResourceAnalysisStageContent';
import { UnifiedPreflightOverview } from './UnifiedPreflightOverview';
import { getUnifiedPreflightTabDestination, unifiedPreflightStages } from './unifiedPreflightTabs';
import { ArchitectureReviewStageContent } from './ArchitectureReviewStageContent';
import type { ReturnTypeOfUseArchitectureReview } from '@/hooks/useArchitectureReview';

type Preflight = ReturnType<typeof useUnifiedPreflight>;
interface Props {
  isOpen: boolean; activeStage: UnifiedPreflightStage; onStageChange: (stage: UnifiedPreflightStage) => void;
  preflight: Preflight; lang: Language; readinessNotice: string | null; executionNotice: string | null; resourceNotice: string | null;
  readinessTargetSummary: (finding: ReadinessFinding) => string; onClose: () => void; onLocateReadiness: (finding: ReadinessFinding) => void;
  onLocateExecution: (type: ExecutionPreviewTargetType, id: string | undefined, source: ExecutionPreviewLocateSource) => boolean;
  onLocateResources: (target: ResourceAnalysisTarget, context: ResourceAnalysisLocateContext) => boolean; onOpenValidation: () => void;
  onReevaluate: () => void; updatedNotice: string | null;
  architectureReview: ReturnTypeOfUseArchitectureReview; onLocateArchitecture: (targetKey: string) => void; architectureTargetKeys: ReadonlySet<string>;
}

export function UnifiedPreflightPanel(props: Props) {
  const { isOpen, activeStage, onStageChange, preflight, lang, onClose } = props;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabRefs = useRef<Partial<Record<UnifiedPreflightStage, HTMLButtonElement>>>({});
  const [readinessFilter, setReadinessFilter] = useState<ReadinessCategory | 'all'>('all');
  const ja = lang === 'ja';
  const copy = translations[lang];
  const labels = [copy.unifiedPreflightOverview, copy.unifiedPreflightArchitecture, copy.unifiedPreflightReadiness, copy.unifiedPreflightExecution, copy.unifiedPreflightResources];

  const handleTabKeyDown = (stage: UnifiedPreflightStage, event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const destination = getUnifiedPreflightTabDestination(stage, event.key);
    if (!destination) return;

    event.preventDefault();
    onStageChange(destination);
    tabRefs.current[destination]?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true })); });
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } };
    window.addEventListener('keydown', escape);
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); window.removeEventListener('keydown', escape); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return <aside id="unified-preflight-panel" aria-labelledby="unified-preflight-heading" className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col rounded-t-3xl border border-slate-700 bg-slate-950 shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[440px] md:max-w-[45vw] md:rounded-none md:border-y-0 md:border-r-0 lg:w-[480px]">
    <header className="shrink-0 border-b border-slate-800 p-4"><div className="flex items-center justify-between gap-3"><h2 id="unified-preflight-heading" ref={headingRef} tabIndex={-1} className="text-lg font-bold text-white focus:outline-none">{copy.unifiedPreflightTitle}</h2><button type="button" onClick={onClose} aria-label={copy.unifiedPreflightCloseLabel} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"><X className="h-5 w-5" aria-hidden="true" /></button></div>
      <div className="mt-3 flex items-center gap-2"><button type="button" onClick={props.onReevaluate} className="min-h-11 rounded-lg border border-teal-700 px-3 text-xs font-bold text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">{copy.unifiedPreflightReevaluate}</button><div aria-live="polite">{props.updatedNotice ? <span role="status" className="text-xs text-teal-200">{props.updatedNotice}</span> : null}</div></div>
      <div role="tablist" aria-label={ja ? '事前レビューのステージ' : 'Preflight review stages'} className="mt-3 flex gap-1 overflow-x-auto pb-1">{unifiedPreflightStages.map((stage, index) => <button key={stage} ref={(element) => { tabRefs.current[stage] = element ?? undefined; }} id={`unified-preflight-tab-${stage}`} type="button" role="tab" aria-selected={activeStage === stage} aria-controls={`unified-preflight-tabpanel-${stage}`} tabIndex={activeStage === stage ? 0 : -1} onClick={() => onStageChange(stage)} onKeyDown={(event) => handleTabKeyDown(stage, event)} className="min-h-11 shrink-0 rounded-lg px-3 text-xs font-bold text-slate-300 aria-selected:bg-teal-700 aria-selected:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">{labels[index]}</button>)}</div>
    </header>
    <div id={`unified-preflight-tabpanel-${activeStage}`} role="tabpanel" aria-labelledby={`unified-preflight-tab-${activeStage}`} className="min-h-0 flex-1 overflow-y-auto p-4 pb-8">
      {activeStage === 'overview' ? <UnifiedPreflightOverview review={preflight.review} architectureState={props.architectureReview.state} lang={lang} onSelectStage={onStageChange} /> : null}
      {activeStage === 'architecture' ? <ArchitectureReviewStageContent state={props.architectureReview.state} evidence={props.architectureReview.displayEvidence} eligible={Boolean(props.architectureReview.evidence)} paid={props.architectureReview.paid} lang={lang} onRun={props.architectureReview.run} onLocate={props.onLocateArchitecture} currentTargetKeys={props.architectureTargetKeys} /> : null}
      {activeStage === 'readiness' ? <ReadinessStageContent result={preflight.readiness.result} error={preflight.readiness.error} isRefreshing={preflight.readiness.isRefreshing} lang={lang} filter={readinessFilter} onFilterChange={setReadinessFilter} targetSummary={props.readinessTargetSummary} onRetry={preflight.readiness.evaluateNow} onLocate={props.onLocateReadiness} onOpenValidation={props.onOpenValidation} notice={props.readinessNotice} /> : null}
      {activeStage === 'execution' ? <><p className="mb-4 text-xs leading-relaxed text-slate-400">{copy.executionPreviewDisclaimer}</p><ExecutionPreviewStageContent state={preflight.execution.state} isRefreshing={preflight.execution.isRefreshing} lang={lang} notice={props.executionNotice} onRetry={preflight.execution.evaluateNow} onLocate={props.onLocateExecution} onOpenValidation={props.onOpenValidation} /></> : null}
      {activeStage === 'resources' ? <><p className="mb-4 text-xs leading-relaxed text-slate-400">{copy.resourceAnalysisDisclaimer}</p><ResourceAnalysisStageContent state={preflight.resources.state} isRefreshing={preflight.resources.isRefreshing} lang={lang} notice={props.resourceNotice} onRetry={preflight.resources.evaluateNow} onOpenValidation={props.onOpenValidation} onLocate={props.onLocateResources} /></> : null}
    </div>
  </aside>;
}
