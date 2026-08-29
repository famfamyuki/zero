'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Code2, Coffee, Download, Globe, Network, Settings, Sparkles, Trash2, Upload } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { trackEvent } from '@/lib/analytics';

export type EditorSurface = 'overview' | 'design' | 'preflight';

interface HeaderProps {
  surface: EditorSurface;
  onSurfaceChange: (surface: EditorSurface, trigger: HTMLButtonElement) => void;
  onGenerateCode: (trigger: HTMLButtonElement) => void;
  onExportJson: () => void;
  onImportJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImportCrewAI: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewCrewAIReport?: () => void;
  onClearCanvas: () => void;
  onToggleSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ surface, onSurfaceChange, onGenerateCode, onExportJson, onImportJson, onImportCrewAI, onViewCrewAIReport, onClearCanvas, onToggleSettings }) => {
  const { lang, setLanguage } = useLanguage();
  const crewAIInputRef = useRef<HTMLInputElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const labels = lang === 'ja' ? { overview: '概要', design: '設計', preflight: 'レビュー' } : { overview: 'Overview', design: 'Design', preflight: 'Preflight' };

  return <header className="relative z-50 shrink-0 border-b border-slate-800 bg-slate-950/95 px-3 py-2 backdrop-blur-md">
    <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-2 lg:flex-nowrap">
      <div className="flex min-w-0 items-center gap-2 lg:w-[350px]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 text-white"><Network className="h-4 w-4" aria-hidden="true" /></div>
        <div className="min-w-0"><div className="truncate text-sm font-extrabold text-white">AgentGraph Studio</div><p className="hidden truncate text-[10px] text-slate-400 sm:block">{lang === 'ja' ? 'ポータブルAIワークフロー・アーキテクチャ・エンジニアリング・ツールチェーン' : 'Portable AI Workflow Architecture Engineering Toolchain'}</p></div>
      </div>
      <nav aria-label={lang === 'ja' ? 'プロダクト画面' : 'Product surfaces'} className="order-3 grid w-full grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 lg:order-none lg:mx-auto lg:w-auto lg:min-w-[330px]">
        {(['overview', 'design', 'preflight'] as const).map((item) => <button key={item} type="button" aria-current={surface === item ? 'page' : undefined} onClick={(event) => onSurfaceChange(item, event.currentTarget)} className="min-h-11 rounded-lg px-3 text-xs font-bold text-slate-300 transition hover:bg-slate-800 aria-[current=page]:bg-indigo-600 aria-[current=page]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300" aria-label={item === 'preflight' && lang === 'ja' ? 'Preflightレビュー' : labels[item]}>{labels[item]}</button>)}
      </nav>
      <div className="relative ml-auto flex items-center gap-1 lg:w-[350px] lg:justify-end">
        <div className="relative"><button ref={exportButtonRef} type="button" aria-expanded={exportOpen} onClick={() => { setExportOpen((value) => !value); setMoreOpen(false); }} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-emerald-600/60 px-3 text-xs font-bold text-emerald-200"><Download className="h-4 w-4" aria-hidden="true" />Export<ChevronDown className="h-3 w-3" aria-hidden="true" /></button>{exportOpen ? <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"><button type="button" onClick={() => { setExportOpen(false); onExportJson(); }} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-xs hover:bg-slate-800"><Download className="h-4 w-4 text-indigo-300" />AgentGraph JSON</button><button type="button" onClick={(event) => { setExportOpen(false); onGenerateCode(exportButtonRef.current ?? event.currentTarget); }} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-xs hover:bg-slate-800"><Code2 className="h-4 w-4 text-emerald-300" />CrewAI Python</button></div> : null}</div>
        <div className="relative"><button type="button" aria-expanded={moreOpen} onClick={() => { setMoreOpen((value) => !value); setExportOpen(false); }} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-700 px-3 text-xs font-bold text-slate-200">{lang === 'ja' ? 'その他' : 'More'}<ChevronDown className="h-3 w-3" /></button>{moreOpen ? <div className="absolute right-0 top-full mt-2 max-h-[70dvh] w-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
          <button data-crewai-entry type="button" onClick={() => crewAIInputRef.current?.click()} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-xs hover:bg-slate-800"><Upload className="h-4 w-4 text-violet-300" />CrewAI Python</button><input ref={crewAIInputRef} aria-label="Import CrewAI Python — Supported subset" type="file" accept=".py,text/x-python" onChange={onImportCrewAI} className="sr-only" />
          <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-xs hover:bg-slate-800"><Upload className="h-4 w-4 text-emerald-300" />AgentGraph JSON<input type="file" accept=".json,application/json" onChange={onImportJson} className="sr-only" /></label>
          <Link href="/templates" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs hover:bg-slate-800"><Sparkles className="h-4 w-4 text-amber-300" />{lang === 'ja' ? 'テンプレート' : 'Templates'}</Link>
          {onViewCrewAIReport ? <button type="button" onClick={onViewCrewAIReport} className="min-h-11 w-full rounded-lg px-3 text-left text-xs hover:bg-slate-800">{lang === 'ja' ? '読込レポート' : 'Import report'}</button> : null}
          <button type="button" onClick={onToggleSettings} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-xs hover:bg-slate-800"><Settings className="h-4 w-4" />{lang === 'ja' ? 'Crew全体設定' : 'Crew settings'}</button>
          <button type="button" onClick={onClearCanvas} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-xs text-red-300 hover:bg-red-950/40"><Trash2 className="h-4 w-4" />{lang === 'ja' ? 'ワークフローを消去' : 'Clear workflow'}</button>
          <button type="button" onClick={() => setLanguage(lang === 'en' ? 'ja' : 'en')} className="flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-xs hover:bg-slate-800"><Globe className="h-4 w-4" />{lang === 'en' ? '日本語' : 'English'}</button>
          <a href="https://www.buymeacoffee.com/agentgraph" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('buymeacoffee_clicked', { placement: window.matchMedia('(max-width: 767px)').matches ? 'mobile_more' : 'header' })} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs text-amber-300 hover:bg-slate-800"><Coffee className="h-4 w-4" />{lang === 'ja' ? '開発を支援' : 'Support AgentGraph'}</a>
        </div> : null}</div>
      </div>
    </div>
  </header>;
};
