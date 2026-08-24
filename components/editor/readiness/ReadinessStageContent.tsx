'use client';

import { CircleCheck, ShieldAlert, TriangleAlert, Wrench } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import type { ReadinessCategory, ReadinessFinding, ReadinessResult } from '@/types/readiness';
import { ReadinessEvaluationError } from '@/lib/readiness';
import { readinessStatusLabel } from './ReadinessEntryButton';
import { ReadinessFindingCard } from './ReadinessFindingCard';

const categories: readonly ReadinessCategory[] = ['workflow_structure', 'execution_configuration', 'tooling', 'output_contract', 'maintainability'];
const labels = { workflow_structure: ['Workflow structure', 'ワークフロー構造'], execution_configuration: ['Execution configuration', '実行設定'], tooling: ['Tooling', 'Tool構成'], output_contract: ['Output contract', '出力契約'], maintainability: ['Maintainability', '保守性'] } as const;
const statusIcons = { ready: CircleCheck, needs_attention: TriangleAlert, needs_improvement: Wrench, not_evaluable: ShieldAlert };

export function filterReadinessFindings(findings: readonly ReadinessFinding[], category: ReadinessCategory | 'all') { return category === 'all' ? findings : findings.filter((finding) => finding.category === category); }

interface ReadinessStageContentProps {
  result: ReadinessResult | null;
  error: Error | null;
  isRefreshing: boolean;
  lang: Language;
  filter: ReadinessCategory | 'all';
  onFilterChange: (filter: ReadinessCategory | 'all') => void;
  targetSummary: (finding: ReadinessFinding) => string;
  onRetry: () => void;
  onLocate: (finding: ReadinessFinding) => void;
  onOpenValidation: () => void;
}

export function ReadinessStageContent({ result, error, isRefreshing, lang, filter, onFilterChange, targetSummary, onRetry, onLocate, onOpenValidation }: ReadinessStageContentProps) {
  const findings = filterReadinessFindings(result?.findings ?? [], filter);
  const status = result?.status ?? 'not_evaluable';
  const Icon = statusIcons[status];
  const ja = lang === 'ja';

  return <>
    {error ? <section className="rounded-2xl border border-orange-700/50 bg-orange-950/20 p-4"><h3 className="font-bold text-orange-200">{ja ? 'Readinessの評価に失敗しました。' : 'Readiness check failed.'}</h3><p className="mt-2 text-xs leading-relaxed text-slate-300">{ja ? '評価を完了できなかったため、Readiness結果は表示していません。' : 'No Readiness result is being shown because the evaluation could not complete.'}</p><button type="button" onClick={onRetry} className="mt-4 min-h-11 rounded-lg bg-orange-500 px-4 text-xs font-bold text-slate-950">{ja ? '再試行' : 'Retry'}</button>{error instanceof ReadinessEvaluationError && <details className="mt-4 text-[11px] text-slate-500"><summary>Technical details</summary><code>{error.ruleId}</code></details>}</section> : result && <>
      <section><div className="flex items-center gap-2"><Icon className="h-5 w-5" /><strong className="text-sm text-white">{readinessStatusLabel(status, lang)}</strong></div><p className="mt-2 text-xs leading-relaxed text-slate-300">{ja ? 'Readinessは、Validationを通過したワークフローの設計上の改善余地を確認します。本番実行の成功を保証するものではありません。' : 'Readiness checks design signals for a valid workflow and suggests improvements for clarity and production preparedness. It does not guarantee runtime success.'}</p><p className="mt-2 text-[11px] leading-relaxed text-slate-500">{ja ? 'Validationはコード生成可能かを判定します。Readinessはコード生成を止めず、設計改善の指針を示します。' : 'Validation decides whether code can be generated. Readiness gives non-blocking improvement guidance.'}</p>
        {result.evaluable && <div className="mt-3 flex flex-wrap gap-2">{(['high','medium','low','info'] as const).filter(k => result.counts[k] > 0).map(k => <span key={k} className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-300">{k} {result.counts[k]}</span>)}</div>}
      </section>
      {!result.evaluable ? <section className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/70 p-4"><h3 className="font-bold text-slate-100">{ja ? 'Readinessはまだ評価できません' : 'Readiness cannot be evaluated yet'}</h3><p className="mt-2 text-xs text-slate-400">{ja ? 'Validation blocking件数' : 'Validation blocking count'}: {result.blockedByValidationCodes.length}</p><ul className="mt-2 list-disc pl-5 font-mono text-[11px] text-slate-400">{result.blockedByValidationCodes.map(code => <li key={code}>{code}</li>)}</ul><button type="button" onClick={onOpenValidation} className="mt-4 min-h-11 rounded-lg bg-indigo-500 px-4 text-xs font-bold text-white">{ja ? 'Validationを開く' : 'Open validation'}</button></section> : <>
        <nav aria-label={ja ? 'Readinessカテゴリ' : 'Readiness categories'} className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2"><button type="button" aria-pressed={filter === 'all'} onClick={() => onFilterChange('all')} className="min-h-11 shrink-0 rounded-full bg-slate-800 px-3 text-xs aria-pressed:bg-indigo-600">All · {result.counts.total}</button>{categories.map((category) => { const item = result.categories.find(x => x.category === category)!; return <button key={category} type="button" aria-pressed={filter === category} onClick={() => onFilterChange(category)} className="min-h-11 shrink-0 rounded-full bg-slate-800 px-3 text-xs aria-pressed:bg-indigo-600">{labels[category][ja ? 1 : 0]} · {readinessStatusLabel(item.status, lang)} · {item.counts.total}</button>; })}</nav>
        {result.findings.length === 0 && result.status === 'ready' ? <section className="mt-5 rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-4"><h3 className="font-bold text-emerald-200">{ja ? '準備良好' : 'Ready'}</h3><p className="mt-2 text-xs leading-relaxed text-slate-300">{ja ? 'Readiness v0の改善事項はありません。Validationを通過し、現在のReadinessルールでは追加の改善事項は見つかっていません。本番実行の成功を保証するものではありません。' : 'No Readiness v0 findings. The workflow passed Validation and the current Readiness rules found no additional improvements. This does not guarantee runtime success.'}</p></section> : <ul className="mt-4 space-y-3" aria-label={ja ? 'Readiness改善事項' : 'Readiness findings'}>{findings.map((finding, index) => <ReadinessFindingCard key={`${finding.ruleId}-${finding.target.nodeId ?? finding.target.edgeId ?? finding.target.field ?? index}`} finding={finding} lang={lang} disabled={isRefreshing} canLocate={finding.target.scope !== 'graph'} targetSummary={targetSummary(finding)} onLocate={() => onLocate(finding)} />)}</ul>}
      </>}
      <p className="mt-5 text-[10px] text-slate-500">{ja ? 'Readiness impactは改善優先度です。Code Exportを停止するseverityではありません。' : 'Readiness impact shows improvement priority. It does not block code export.'}</p><footer className="mt-3 border-t border-slate-800 pt-3 text-[10px] text-slate-600">Ruleset {result.rulesetVersion}</footer>
    </>}
  </>;
}
