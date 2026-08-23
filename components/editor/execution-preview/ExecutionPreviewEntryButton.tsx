'use client';

import { ListTree } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import { translations } from '@/lib/i18n/translations';

export function ExecutionPreviewEntryButton({ lang, isOpen, onClick }: { lang: Language; isOpen: boolean; onClick: () => void }) {
  const copy = translations[lang];
  return <button type="button" onPointerDown={(event) => { event.stopPropagation(); onClick(); }} onClick={(event) => { event.stopPropagation(); if (event.detail === 0) onClick(); }} aria-expanded={isOpen} aria-controls="execution-preview-panel" aria-label={copy.executionPreviewOpenLabel} className="flex min-h-11 items-center gap-2 rounded-full border border-cyan-500/60 bg-slate-950/95 px-3 text-xs font-bold text-cyan-100 shadow-xl backdrop-blur transition hover:bg-cyan-950/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
    <ListTree className="h-4 w-4" aria-hidden="true" />
    <span className="hidden md:inline">{copy.executionPreviewTitle}</span>
    <span className="md:hidden">{copy.executionPreviewMobile}</span>
  </button>;
}
