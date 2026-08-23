'use client';

import { useEffect, useRef } from 'react';
import { RefreshCw, X } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import { translations } from '@/lib/i18n/translations';
import type { ExecutionPreviewState } from '@/hooks/useExecutionPreview';
import { ExecutionPreviewStepCard, type ExecutionPreviewLocateSource, type ExecutionPreviewTargetType } from './ExecutionPreviewStepCard';

export function ExecutionPreviewPanel({ isOpen, state, isRefreshing, lang, notice, onClose, onRetry, onLocate, onOpenValidation }: { isOpen: boolean; state: ExecutionPreviewState; isRefreshing: boolean; lang: Language; notice: string | null; onClose: () => void; onRetry: () => void; onLocate: (type: ExecutionPreviewTargetType, id: string | undefined, source: ExecutionPreviewLocateSource) => boolean; onOpenValidation: () => void }) {
  const copy = translations[lang];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => heading.current?.focus());
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  const result = state.status === 'available' ? state.result : null;
  const hasAsync = result?.steps.some((step) => step.asyncExecution) ?? false;
  const locate = (type: ExecutionPreviewTargetType, id: string | undefined, source: ExecutionPreviewLocateSource) => { onLocate(type, id, source); };

  return <aside id="execution-preview-panel" aria-labelledby="execution-preview-heading" aria-busy={isRefreshing} className="absolute inset-x-0 bottom-0 z-50 flex max-h-[78dvh] w-full flex-col border-t border-cyan-800/70 bg-slate-950/98 shadow-2xl backdrop-blur md:inset-y-0 md:left-auto md:max-h-none md:w-[400px] md:border-l md:border-t-0 lg:w-[420px] lg:max-w-[42vw]">
    <header className="flex items-start justify-between border-b border-slate-800 p-4"><div><h2 id="execution-preview-heading" ref={heading} tabIndex={-1} className="text-base font-extrabold text-white outline-none">{copy.executionPreviewTitle}</h2><p className="mt-1 max-w-sm text-[11px] leading-relaxed text-slate-400">{copy.executionPreviewDisclaimer}</p></div><button type="button" onClick={onClose} aria-label={copy.executionPreviewCloseLabel} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><X className="h-5 w-5" /></button></header>
    <div className="overflow-y-auto p-4 pb-8">
      <div aria-live="polite">{notice ? <p role="status" className="mb-3 rounded-lg bg-cyan-950/70 p-3 text-xs text-cyan-100">{notice}</p> : null}{isRefreshing ? <section className="flex min-h-40 items-center justify-center gap-2 text-sm text-cyan-200"><RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />{copy.executionPreviewUpdating}</section> : null}</div>
      {!isRefreshing && state.status === 'empty' ? <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4"><h3 className="font-bold text-white">{copy.executionPreviewEmptyTitle}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{copy.executionPreviewEmptyBody}</p></section> : null}
      {!isRefreshing && state.status === 'invalid' ? <section className="rounded-2xl border border-amber-700/60 bg-amber-950/20 p-4"><h3 className="font-bold text-amber-100">{copy.executionPreviewInvalidTitle}</h3><p className="mt-2 text-xs leading-relaxed text-slate-300">{copy.executionPreviewInvalidBody}</p><ul className="mt-3 list-disc pl-5 font-mono text-[11px] text-slate-400">{state.blockingCodes.map((code, index) => <li key={`${code}-${index}`}>{code}</li>)}</ul><button type="button" onClick={onOpenValidation} className="mt-4 min-h-11 rounded-lg bg-indigo-500 px-4 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">{copy.executionPreviewOpenValidation}</button></section> : null}
      {!isRefreshing && state.status === 'error' ? <section className="rounded-2xl border border-orange-700/60 bg-orange-950/20 p-4"><h3 className="font-bold text-orange-100">{copy.executionPreviewErrorTitle}</h3><p className="mt-2 text-xs leading-relaxed text-slate-300">{copy.executionPreviewErrorBody}</p><button type="button" onClick={onRetry} className="mt-4 min-h-11 rounded-lg bg-orange-500 px-4 text-xs font-bold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200">{copy.executionPreviewRetry}</button></section> : null}
      {!isRefreshing && result ? <>
        <section className="grid grid-cols-2 gap-2 rounded-2xl border border-cyan-900/70 bg-cyan-950/20 p-4 text-xs"><div><span className="text-slate-500">{copy.executionPreviewProcess}</span><p className="font-bold text-cyan-100">{result.process === 'sequential' ? copy.processSequential : copy.processHierarchical}</p></div><div><span className="text-slate-500">{copy.executionPreviewTasks}</span><p className="font-bold text-white">{result.summary.taskCount}</p></div><div><span className="text-slate-500">{copy.executionPreviewAgents}</span><p className="font-bold text-white">{result.summary.agentCount}</p></div><div><span className="text-slate-500">{copy.executionPreviewTools}</span><p className="font-bold text-white">{result.summary.toolCount}</p></div></section>
        {result.manager ? <section className="mt-4 rounded-2xl border border-indigo-800/70 bg-indigo-950/20 p-4"><h3 className="text-sm font-bold text-indigo-100">{copy.executionPreviewManager}</h3><p className="mt-1 break-all text-xs text-slate-300">{result.manager.model}</p><p className="mt-2 text-[11px] leading-relaxed text-slate-400">{copy.executionPreviewManagerNote}</p><button type="button" onClick={() => locate('crew', undefined, 'manager')} className="mt-3 min-h-11 rounded-lg border border-indigo-700 px-3 text-xs font-bold text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">{copy.executionPreviewLocateConfiguration}</button></section> : null}
        {hasAsync ? <p className="mt-4 rounded-xl bg-indigo-950/30 p-3 text-[11px] leading-relaxed text-indigo-200">{copy.executionPreviewAsyncNote}</p> : null}
        <ol className="mt-4 space-y-3" aria-label={copy.executionPreviewOrderedTasks}>{result.steps.map((step) => <ExecutionPreviewStepCard key={step.taskId} step={step} agents={result.agents} process={result.process} hasAsync={hasAsync} lang={lang} onLocate={locate} />)}</ol>
        <details className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/60 p-4"><summary className="cursor-pointer text-sm font-bold text-white">{copy.executionPreviewAgentsTools}</summary><div className="mt-4 space-y-4">{result.agents.map((agent) => <section key={agent.agentId} className="rounded-xl bg-slate-950/80 p-3"><h3 className="text-xs font-bold text-white">{agent.label}</h3><p className="text-[11px] text-slate-400">{agent.role}</p><p className="mt-1 break-all text-[10px] text-cyan-300">{agent.model}</p><button type="button" onClick={() => locate('agent', agent.agentId, 'agent_section')} className="mt-2 min-h-11 rounded-lg border border-cyan-800 px-3 text-xs text-cyan-200">{copy.executionPreviewLocateAgent}</button><h4 className="mt-3 text-[10px] uppercase text-slate-500">{copy.executionPreviewAgentTools}</h4><div className="mt-2 flex flex-wrap gap-2">{agent.tools.length ? agent.tools.map((tool) => <button type="button" key={tool.toolId} onClick={() => locate('tool', tool.toolId, 'agent_tool')} className="min-h-11 rounded-lg bg-slate-800 px-3 text-xs text-slate-200">{tool.label} · {tool.toolType}</button>) : <span className="text-xs text-slate-600">{copy.executionPreviewNone}</span>}</div></section>)}</div></details>
        <footer className="mt-4 text-[10px] text-slate-600">Preview {result.version}</footer>
      </> : null}
    </div>
  </aside>;
}
