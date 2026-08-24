'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import type { ReadinessCategory, ReadinessFinding, ReadinessResult } from '@/types/readiness';
import { ReadinessStageContent } from './ReadinessStageContent';

export { filterReadinessFindings } from './ReadinessStageContent';

export function ReadinessPanel({ isOpen, result, error, isRefreshing, lang, targetSummary, onClose, onRetry, onLocate, onOpenValidation }: { isOpen: boolean; result: ReadinessResult | null; error: Error | null; isRefreshing: boolean; lang: Language; targetSummary: (finding: ReadinessFinding) => string; onClose: () => void; onRetry: () => void; onLocate: (finding: ReadinessFinding) => void; onOpenValidation: () => void }) {
  const [filter, setFilter] = useState<ReadinessCategory | 'all'>('all');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (!isOpen) return; requestAnimationFrame(() => requestAnimationFrame(() => heading.current?.focus())); }, [isOpen]);
  useEffect(() => { if (!isOpen) return; const close = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [isOpen, onClose]);
  if (!isOpen) return null;
  const ja = lang === 'ja';
  return <aside id="readiness-panel" aria-labelledby="readiness-heading" aria-busy={isRefreshing} className="absolute inset-x-0 bottom-0 z-50 flex max-h-[72dvh] w-full flex-col border-t border-slate-700 bg-slate-950/98 shadow-2xl backdrop-blur md:inset-y-0 md:left-auto md:max-h-none md:w-[360px] md:border-l md:border-t-0 lg:w-[400px] lg:max-w-[42vw]">
    <header className="flex items-start justify-between border-b border-slate-800 p-4"><div><h2 id="readiness-heading" ref={heading} tabIndex={-1} className="text-base font-extrabold text-white outline-none">Readiness</h2>{isRefreshing && <span className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-300"><RefreshCw className="h-3 w-3 animate-spin" />{ja ? '更新中…' : 'Updating…'}</span>}</div><button type="button" onClick={onClose} aria-label={ja ? 'Readinessを閉じる' : 'Close Readiness'} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-5 w-5" /></button></header>
    <div className="overflow-y-auto p-4 pb-8">
      <ReadinessStageContent result={result} error={error} isRefreshing={isRefreshing} lang={lang} filter={filter} onFilterChange={setFilter} targetSummary={targetSummary} onRetry={onRetry} onLocate={onLocate} onOpenValidation={onOpenValidation} />
    </div>
  </aside>;
}
