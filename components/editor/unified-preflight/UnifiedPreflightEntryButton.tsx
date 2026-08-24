'use client';

import { ClipboardCheck } from 'lucide-react';
import { translations, type Language } from '@/lib/i18n/translations';

interface Props { lang: Language; isOpen: boolean; compact?: boolean; onActivate: (trigger: HTMLButtonElement) => void; }

export function UnifiedPreflightEntryButton({ lang, isOpen, compact = false, onActivate }: Props) {
  const copy = translations[lang];
  const label = compact ? copy.unifiedPreflightEntryCompact : copy.unifiedPreflightEntry;
  const activate = (trigger: HTMLButtonElement) => { trigger.focus({ preventScroll: true }); onActivate(trigger); };
  return <button type="button" aria-expanded={isOpen} aria-controls="unified-preflight-panel" aria-label={copy.unifiedPreflightOpenLabel} onPointerDown={(event) => { event.stopPropagation(); activate(event.currentTarget); }} onClick={(event) => { event.stopPropagation(); if (event.detail === 0) activate(event.currentTarget); }} className="nodrag nopan inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-teal-700/70 bg-slate-900/95 px-3 text-xs font-bold text-teal-100 shadow-xl backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"><ClipboardCheck className="h-4 w-4" aria-hidden="true" /><span>{label}</span></button>;
}
