'use client';

import { CircleCheck, ShieldAlert, TriangleAlert, Wrench } from 'lucide-react';
import type { ReadinessStatus } from '@/types/readiness';
import type { Language } from '@/lib/i18n/translations';

const config = {
  ready: { en: 'Ready', ja: '準備良好', icon: CircleCheck, color: 'border-emerald-500/60 bg-emerald-950/90 text-emerald-200' },
  needs_attention: { en: 'Needs attention', ja: '確認推奨', icon: TriangleAlert, color: 'border-amber-500/60 bg-amber-950/90 text-amber-200' },
  needs_improvement: { en: 'Needs improvement', ja: '改善が必要', icon: Wrench, color: 'border-orange-500/60 bg-orange-950/90 text-orange-200' },
  not_evaluable: { en: 'Cannot evaluate yet', ja: 'まだ評価できません', icon: ShieldAlert, color: 'border-slate-500/60 bg-slate-900/95 text-slate-200' },
} as const;

export function readinessStatusLabel(status: ReadinessStatus, lang: Language) { return config[status][lang]; }

export function ReadinessEntryButton({ status, lang, isOpen, onClick }: { status: ReadinessStatus; lang: Language; isOpen: boolean; onClick: () => void }) {
  const item = config[status];
  const Icon = item.icon;
  return <button type="button" onClick={onClick} aria-expanded={isOpen} aria-controls="readiness-panel" className={`flex min-h-11 items-center gap-2 rounded-full border px-3 text-xs font-bold shadow-xl backdrop-blur transition hover:brightness-110 ${item.color}`}>
    <Icon className="h-4 w-4" aria-hidden="true" />
    <span className="hidden sm:inline">Readiness · {item[lang]}</span><span className="sm:hidden">{item[lang]}</span>
  </button>;
}
