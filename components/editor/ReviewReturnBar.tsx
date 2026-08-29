import type { Language } from '@/lib/i18n/translations';
import type { UnifiedPreflightStage } from '@/types/unified-preflight';

export interface ReviewReturnContext { stage: Exclude<UnifiedPreflightStage, 'overview'>; label: string; itemKey: string; }

export function ReviewReturnBar({ context, lang, isRefreshing, onBack, onClear }: { context: ReviewReturnContext; lang: Language; isRefreshing: boolean; onBack: () => void; onClear: () => void }) {
  const ja = lang === 'ja';
  return <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-teal-800/60 bg-teal-950/40 px-4 py-2 text-xs" role="status">
    <span className="min-w-0 truncate text-teal-100">{ja ? 'Preflightから' : 'From Preflight'} · {context.stage} · {context.label}{isRefreshing ? ` · ${ja ? '編集後に更新中' : 'Updating after edit'}` : ''}</span>
    <span className="flex gap-1"><button type="button" onClick={onBack} className="min-h-11 rounded-lg border border-teal-700 px-3 font-bold text-teal-100">{ja ? '指摘に戻る' : 'Back to finding'}</button><button type="button" onClick={onClear} aria-label={ja ? 'レビューコンテキストを閉じる' : 'Clear review context'} className="min-h-11 rounded-lg px-3 text-slate-400">×</button></span>
  </div>;
}
