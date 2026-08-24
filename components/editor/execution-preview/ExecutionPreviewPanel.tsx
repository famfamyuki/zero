'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import { translations } from '@/lib/i18n/translations';
import type { ExecutionPreviewState } from '@/hooks/useExecutionPreview';
import type { ExecutionPreviewLocateSource, ExecutionPreviewTargetType } from './ExecutionPreviewStepCard';
import { ExecutionPreviewStageContent } from './ExecutionPreviewStageContent';

export function ExecutionPreviewPanel({ isOpen, state, isRefreshing, lang, notice, onClose, onRetry, onLocate, onOpenValidation }: { isOpen: boolean; state: ExecutionPreviewState; isRefreshing: boolean; lang: Language; notice: string | null; onClose: () => void; onRetry: () => void; onLocate: (type: ExecutionPreviewTargetType, id: string | undefined, source: ExecutionPreviewLocateSource) => boolean; onOpenValidation: () => void }) {
  const copy = translations[lang];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => requestAnimationFrame(() => heading.current?.focus()));
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return <aside id="execution-preview-panel" aria-labelledby="execution-preview-heading" aria-busy={isRefreshing} className="absolute inset-x-0 bottom-0 z-50 flex max-h-[78dvh] w-full flex-col border-t border-cyan-800/70 bg-slate-950/98 shadow-2xl backdrop-blur md:inset-y-0 md:left-auto md:max-h-none md:w-[400px] md:border-l md:border-t-0 lg:w-[420px] lg:max-w-[42vw]">
    <header className="flex items-start justify-between border-b border-slate-800 p-4"><div><h2 id="execution-preview-heading" ref={heading} tabIndex={-1} className="text-base font-extrabold text-white outline-none">{copy.executionPreviewTitle}</h2><p className="mt-1 max-w-sm text-[11px] leading-relaxed text-slate-400">{copy.executionPreviewDisclaimer}</p></div><button type="button" onClick={onClose} aria-label={copy.executionPreviewCloseLabel} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><X className="h-5 w-5" /></button></header>
    <div className="overflow-y-auto p-4 pb-8">
      <ExecutionPreviewStageContent state={state} isRefreshing={isRefreshing} lang={lang} notice={notice} onRetry={onRetry} onLocate={onLocate} onOpenValidation={onOpenValidation} />
    </div>
  </aside>;
}
