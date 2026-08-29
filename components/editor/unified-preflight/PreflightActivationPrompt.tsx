'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { translations, type Language } from '@/lib/i18n/translations';

interface Props {
  lang: Language;
  onReview: (trigger: HTMLButtonElement) => void;
  onDismiss: () => void;
  onShown: () => void;
}

export function PreflightActivationPrompt({ lang, onReview, onDismiss, onShown }: Props) {
  const copy = translations[lang];

  useEffect(() => {
    onShown();
  }, [onShown]);

  return (
    <aside
      aria-labelledby="preflight-activation-prompt-heading"
      className="nodrag nopan relative w-[min(20rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-teal-700/70 bg-slate-900/95 p-4 pr-12 text-slate-100 shadow-2xl backdrop-blur-md"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <h2 id="preflight-activation-prompt-heading" className="text-sm font-extrabold text-teal-100">
        {copy.preflightActivationTitle}
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-300">
        {copy.preflightActivationBody}
      </p>
      <button
        type="button"
        onClick={(event) => onReview(event.currentTarget)}
        className="mt-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-teal-600 px-4 text-xs font-bold text-white transition hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
      >
        {copy.preflightActivationCta}
      </button>
      <button
        type="button"
        aria-label={copy.preflightActivationDismissLabel}
        onClick={onDismiss}
        className="absolute right-1.5 top-1.5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
