'use client';

import type { Language } from '@/lib/i18n/translations';
import type { UnifiedPreflightReadModel, UnifiedPreflightStage } from '@/types/unified-preflight';

interface Props { review: UnifiedPreflightReadModel; lang: Language; onSelectStage: (stage: Exclude<UnifiedPreflightStage, 'overview'>) => void; }
const cardClass = 'rounded-2xl border border-slate-700 bg-slate-900/70 p-4';

export function UnifiedPreflightOverview({ review, lang, onSelectStage }: Props) {
  const ja = lang === 'ja';
  const message = { refreshing: ja ? 'レビューを更新中です。' : 'Updating the review…', empty: ja ? 'ノードを追加すると事前レビューを開始できます。' : 'Add nodes to start a preflight review.', invalid: ja ? '実行とリソースのレビューを利用するには、先にValidationの問題を解決してください。' : 'Validation issues must be resolved before execution and resource review are fully available.', partial: ja ? '一部のレビューを利用できません。利用可能なレビュー結果は引き続き確認できます。' : 'Some review areas are unavailable. Available review data can still be inspected.', available: ja ? '3つのレビュー結果を確認できます。' : 'All three review areas are available for inspection.' }[review.state];
  const stages = [
    { key: 'readiness' as const, title: 'Readiness', question: ja ? '実行前に問題はないか？' : 'Is it ready?', data: review.stages.readiness },
    { key: 'execution' as const, title: ja ? '実行' : 'Execution', question: ja ? '何が起きるか？' : 'What will happen?', data: review.stages.execution },
    { key: 'resources' as const, title: ja ? 'リソース' : 'Resources', question: ja ? 'その構造は何を意味するか？' : 'What does it imply?', data: review.stages.resources },
  ];
  return <><section aria-live="polite" className="rounded-2xl border border-teal-800/70 bg-teal-950/20 p-4"><p className="text-xs font-bold uppercase tracking-wide text-teal-300">{review.state}</p><p className="mt-2 text-xs leading-relaxed text-slate-200">{message}</p>{review.state === 'invalid' ? <button type="button" onClick={() => onSelectStage('readiness')} className="mt-3 min-h-11 rounded-lg bg-indigo-500 px-4 text-xs font-bold text-white">{ja ? 'Readinessを確認' : 'Review Readiness'}</button> : null}</section><div className="mt-4 space-y-3">{stages.map(({ key, title, question, data }) => <section key={key} className={cardClass}><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-1 text-xs text-slate-400">{question}</p></div><span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-300">{data.state}</span></div>{data.result ? <pre className="mt-3 whitespace-pre-wrap text-[11px] text-slate-300">{summaryText(key, data.result)}</pre> : null}<button type="button" onClick={() => onSelectStage(key)} className="mt-3 min-h-11 rounded-lg border border-teal-700 px-3 text-xs font-bold text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">{ja ? `${title}を開く` : `Open ${title}`}</button></section>)}</div><footer className="mt-4 text-[10px] text-slate-600">Unified Preflight {review.version}</footer></>;
}

function summaryText(stage: 'readiness' | 'execution' | 'resources', result: NonNullable<UnifiedPreflightReadModel['stages'][typeof stage]['result']>): string {
  if ('status' in result) return `Status: ${result.status}\nFindings: ${result.counts.total}\nRuleset: ${result.rulesetVersion}`;
  if ('hotspotCount' in result) return `Process: ${result.process}\nTasks: ${result.summary.taskCount}\nHotspots: ${result.hotspotCount}\nVersion: ${result.version}`;
  return `Process: ${result.process}\nTasks: ${result.summary.taskCount}\nAgents: ${result.summary.agentCount}\nTools: ${result.summary.toolCount}\nVersion: ${result.version}`;
}
