'use client';

import { useState } from 'react';
import { ChevronDown, LocateFixed } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import { translateReadinessKey } from '@/lib/readiness/translations';
import type { ReadinessFinding } from '@/types/readiness';

const impactStyle = { high: 'bg-orange-500/15 text-orange-300 border-orange-500/40', medium: 'bg-amber-500/15 text-amber-300 border-amber-500/40', low: 'bg-sky-500/15 text-sky-300 border-sky-500/40', info: 'bg-slate-500/15 text-slate-300 border-slate-500/40' };

export function ReadinessFindingCard({ finding, lang, disabled, canLocate, targetSummary, onLocate }: { finding: ReadinessFinding; lang: Language; disabled: boolean; canLocate: boolean; targetSummary: string; onLocate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const title = translateReadinessKey(lang, finding.titleKey, finding.params);
  const explanation = translateReadinessKey(lang, finding.explanationKey, finding.params);
  const suggestion = finding.suggestionKey ? translateReadinessKey(lang, finding.suggestionKey, finding.params) : '';
  return <li className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0 flex-1"><span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${impactStyle[finding.impact]}`}>{finding.impact} impact</span><h3 className="mt-2 break-words text-sm font-bold text-slate-100">{title}</h3><p className="mt-1 break-words text-[11px] text-slate-400">{targetSummary}</p></div>
    </div>
    {suggestion && <p className="mt-3 break-words text-xs leading-relaxed text-slate-300">{suggestion}</p>}
    <div className="mt-3 flex flex-wrap gap-2">
      {canLocate && <button type="button" disabled={disabled} onClick={onLocate} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-indigo-500/15 px-3 text-xs font-bold text-indigo-200 hover:bg-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-40"><LocateFixed className="h-3.5 w-3.5" />{lang === 'ja' ? '場所を表示' : 'Locate'}</button>}
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-300 hover:bg-slate-800">{lang === 'ja' ? '詳細' : 'Details'}<ChevronDown className={`h-3.5 w-3.5 transition ${expanded ? 'rotate-180' : ''}`} /></button>
    </div>
    {expanded && <div className="mt-3 space-y-3 border-t border-slate-800 pt-3 text-xs leading-relaxed text-slate-300">
      <p className="break-words">{explanation}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 break-all text-[11px]"><dt className="text-slate-500">Target</dt><dd>{targetSummary}</dd><dt className="text-slate-500">Source</dt><dd>{finding.source.kind}{finding.source.kind === 'validation' ? ` · ${finding.source.validationCode}` : ''}</dd><dt className="text-slate-500">Rule ID</dt><dd className="font-mono">{finding.ruleId}</dd>{finding.evidence && <><dt className="text-slate-500">Evidence</dt><dd className="font-mono">{JSON.stringify(finding.evidence)}</dd></>}</dl>
    </div>}
  </li>;
}
