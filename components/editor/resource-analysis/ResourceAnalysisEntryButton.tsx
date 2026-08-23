'use client';

import { ChartNoAxesCombined } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import { translations } from '@/lib/i18n/translations';

export function ResourceAnalysisEntryButton({ lang, isOpen, compact = false, onClick }: { lang: Language; isOpen: boolean; compact?: boolean; onClick: () => void }) {
  const copy = translations[lang];
  return <button type="button" onPointerDown={(event) => { event.stopPropagation(); onClick(); }} onClick={(event) => { event.stopPropagation(); if (event.detail === 0) onClick(); }} aria-expanded={isOpen} aria-controls="resource-analysis-panel" aria-label={copy.resourceAnalysisOpenLabel} className="nodrag nopan flex min-h-11 min-w-11 items-center gap-2 rounded-full border border-violet-500/60 bg-slate-950/95 px-3 text-xs font-bold text-violet-100 shadow-xl backdrop-blur transition hover:bg-violet-950/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
    <ChartNoAxesCombined className="h-4 w-4" aria-hidden="true" />
    {compact ? <span>{copy.resourceAnalysisMobile}</span> : <><span className="hidden md:inline">{copy.resourceAnalysisEntry}</span><span className="md:hidden">{copy.resourceAnalysisMobile}</span></>}
  </button>;
}
