'use client';

import type { ReactNode } from 'react';
import { translations, type Language } from '@/lib/i18n/translations';
import { readinessStatusLabel } from '@/components/editor/readiness/ReadinessEntryButton';
import type { UnifiedPreflightReadModel, UnifiedPreflightStage } from '@/types/unified-preflight';
import type { ArchitectureReviewClientState } from '@/types/architecture-review';

interface Props {
  review: UnifiedPreflightReadModel;
  lang: Language;
  onSelectStage: (stage: Exclude<UnifiedPreflightStage, 'overview'>) => void;
  architectureState?: ArchitectureReviewClientState;
}

interface CardProps {
  stage: Exclude<UnifiedPreflightStage, 'overview'>;
  title: string;
  question: string;
  state: string | null;
  summary: ReactNode;
  lang: Language;
  onSelectStage: Props['onSelectStage'];
}

const cardClass = 'rounded-2xl border border-slate-700 bg-slate-900/70 p-4';

function stageStateLabel(state: string, lang: Language): string {
  if (lang === 'en') return state.replaceAll('_', ' ');
  return ({ refreshing: '更新中', available: '利用可能', not_evaluable: '評価不可', unavailable: '利用不可', empty: '空', invalid: '無効', needs_preflight_evidence: 'Preflight evidenceが必要', not_reviewed: '未レビュー', reviewing: 'レビュー中', reviewed: 'レビュー済み', workflow_changed: 'Workflow変更済み', review_unavailable: 'レビュー利用不可' } as Record<string, string>)[state] ?? state;
}

function Summary({ rows }: { rows: readonly (readonly [string, string | number])[] }) {
  return <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">{rows.map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="text-slate-200">{value}</dd></div>)}</dl>;
}

function OverviewCard({ stage, title, question, state, summary, lang, onSelectStage }: CardProps) {
  const copy = translations[lang];
  return <section className={cardClass}>
    <div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-1 text-xs text-slate-400">{question}</p></div>{state ? <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-300">{stageStateLabel(state, lang)}</span> : null}</div>
    {summary}
    <button type="button" onClick={() => onSelectStage(stage)} className="mt-3 min-h-11 rounded-lg border border-teal-700 px-3 text-xs font-bold text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">{lang === 'ja' ? `${title}を${copy.unifiedPreflightOpenStage}` : `${copy.unifiedPreflightOpenStage} ${title}`}</button>
  </section>;
}

export function UnifiedPreflightOverview({ review, lang, onSelectStage, architectureState }: Props) {
  const copy = translations[lang];
  const readiness = review.stages.readiness;
  const execution = review.stages.execution;
  const resources = review.stages.resources;
  const message = { refreshing: copy.unifiedPreflightUpdating, empty: copy.unifiedPreflightEmpty, invalid: copy.unifiedPreflightInvalid, partial: copy.unifiedPreflightPartial, available: copy.unifiedPreflightAvailable }[review.state];
  const aggregateState = stageStateLabel(review.state, lang);
  const processLabel = (process: 'sequential' | 'hierarchical') => process === 'sequential' ? copy.processSequential : copy.processHierarchical;
  const isGloballyRefreshing = review.state === 'refreshing';
  const architecture = architectureState ?? { status: 'idle', result: null, stale: false, errorCode: null };

  return <>
    <section aria-live="polite" className="rounded-2xl border border-teal-800/70 bg-teal-950/20 p-4"><p className="text-xs font-bold uppercase tracking-wide text-teal-300">{aggregateState}</p><p className="mt-2 text-xs leading-relaxed text-slate-200">{message}</p>{review.state === 'invalid' ? <button type="button" onClick={() => onSelectStage('readiness')} className="mt-3 min-h-11 rounded-lg bg-indigo-500 px-4 text-xs font-bold text-white">{copy.unifiedPreflightReviewReadiness}</button> : null}</section>
    <div className="mt-4 space-y-3">
      <OverviewCard stage="architecture" title={copy.unifiedPreflightArchitecture} question={lang === 'ja' ? 'Evidenceから何が推論できるか？' : 'What can be inferred from the evidence?'} state={architecture.stale ? 'workflow_changed' : architecture.status === 'not_ready' ? 'needs_preflight_evidence' : architecture.status === 'idle' ? 'not_reviewed' : architecture.status === 'loading' ? 'reviewing' : architecture.status === 'available' ? 'reviewed' : 'review_unavailable'} lang={lang} onSelectStage={onSelectStage} summary={null} />
      <OverviewCard stage="readiness" title={copy.unifiedPreflightReadiness} question={copy.unifiedPreflightQuestionReadiness} state={isGloballyRefreshing ? null : readiness.state} lang={lang} onSelectStage={onSelectStage} summary={!isGloballyRefreshing && readiness.result ? <Summary rows={[[copy.unifiedPreflightStatus, readinessStatusLabel(readiness.result.status, lang)], [copy.unifiedPreflightFindings, readiness.result.counts.total], [copy.unifiedPreflightRuleset, readiness.result.rulesetVersion]]} /> : null} />
      <OverviewCard stage="execution" title={copy.unifiedPreflightExecution} question={copy.unifiedPreflightQuestionExecution} state={isGloballyRefreshing ? null : execution.state} lang={lang} onSelectStage={onSelectStage} summary={!isGloballyRefreshing && execution.result ? <Summary rows={[[copy.unifiedPreflightProcess, processLabel(execution.result.process)], [copy.unifiedPreflightTasks, execution.result.summary.taskCount], [copy.unifiedPreflightAgents, execution.result.summary.agentCount], [copy.unifiedPreflightTools, execution.result.summary.toolCount], [copy.unifiedPreflightVersion, execution.result.version]]} /> : null} />
      <OverviewCard stage="resources" title={copy.unifiedPreflightResources} question={copy.unifiedPreflightQuestionResources} state={isGloballyRefreshing ? null : resources.state} lang={lang} onSelectStage={onSelectStage} summary={!isGloballyRefreshing && resources.result ? <Summary rows={[[copy.unifiedPreflightProcess, processLabel(resources.result.process)], [copy.unifiedPreflightTasks, resources.result.summary.taskCount], [copy.unifiedPreflightHotspots, resources.result.hotspotCount], [copy.unifiedPreflightVersion, resources.result.version]]} /> : null} />
    </div>
    <footer className="mt-4 text-[10px] text-slate-600">Unified Preflight {review.version}</footer>
  </>;
}
