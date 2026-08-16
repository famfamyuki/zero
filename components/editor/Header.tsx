'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Code2, Download, Upload, Trash2, Sparkles, Globe, Rocket, Settings } from 'lucide-react';
import { WorkflowTemplate } from '@/types/editor';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface HeaderProps {
  onGenerateCode: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearCanvas: () => void;
  onLoadPreset?: (template: WorkflowTemplate) => void;
  onToggleSettings: () => void;
  nodeCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onGenerateCode,
  onExportJson,
  onImportJson,
  onClearCanvas,
  onToggleSettings,
}) => {
  const { lang, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(lang === 'en' ? 'ja' : 'en');
  };

  return (
    <header className="min-h-[56px] py-2 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-3 flex flex-nowrap items-center justify-between shrink-0 z-30 gap-1.5 w-full max-w-full overflow-hidden">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 shrink-0 max-w-[50%]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
            <Network className="w-4 h-4" />
          </div>
        </div>
        <div className="shrink min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-emerald-300 whitespace-nowrap truncate">
              {t('appName')}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40 whitespace-nowrap hidden sm:inline-block shrink-0">
              {t('zeroCostBadge')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden lg:block whitespace-nowrap truncate">
            {t('subTitle')}
          </p>
        </div>
      </div>



      {/* Right Actions */}
      <div className="flex flex-nowrap items-center justify-end gap-1 sm:gap-1.5 shrink-0 ml-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Language Switcher Toggle */}
        <button
          onClick={toggleLanguage}
          title="Switch Language / 言語切り替え"
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-indigo-600/60 hover:text-indigo-300 transition shrink-0 whitespace-nowrap"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="font-semibold text-[11px] sm:text-xs shrink-0">{lang === 'en' ? 'EN' : '日本語'}</span>
        </button>

        <Link
          href="/templates"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-indigo-900/60 text-indigo-300 text-xs hover:bg-indigo-950/50 hover:border-indigo-700 transition shadow-sm shrink-0 whitespace-nowrap"
          title={t('freeTemplates')}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden lg:inline shrink-0">{t('freeTemplates')}</span>
        </Link>

        {/* JSON Import/Export (Save/Load) (Desktop) */}
        <button
          onClick={onExportJson}
          title={t('exportJson')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition shrink-0 whitespace-nowrap"
        >
          <Download className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold shrink-0">Save</span>
        </button>

        <label
          title={t('importJson')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition cursor-pointer shrink-0 whitespace-nowrap"
        >
          <Upload className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold shrink-0">Load</span>
          <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
        </label>

        <button
          onClick={onClearCanvas}
          title={t('clearCanvas')}
          className="hidden md:block p-1.5 lg:p-2 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-950/40 hover:border-red-900/60 transition shrink-0"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
        </button>

        <button
          onClick={onToggleSettings}
          title={t('crewGlobalConfig') || 'Settings'}
          className="hidden md:block p-1.5 lg:p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
        >
          <Settings className="w-4 h-4 shrink-0" />
        </button>

        {/* Export Python Code Button */}
        <button
          onClick={onGenerateCode}
          title={t('generatePython')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs hover:bg-emerald-950/40 transition shrink-0 whitespace-nowrap"
        >
          <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="hidden md:inline shrink-0">{t('generatePython')}</span>
          <span className="hidden sm:inline md:hidden font-bold shrink-0">Code</span>
        </button>

        {/* Persistent High-Visibility Header CTA Button (Desktop & Tablet) */}
        {lang === 'en' ? (
          <a
            href="https://unified.cloudways.com/signup?id=2194173&coupon=SUMMER404"
            target="_blank"
            rel="noopener noreferrer"
            title={t('deployCloudwaysHeader')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all shrink-0 border border-violet-400/40 whitespace-nowrap"
          >
            <Rocket className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
            <span className="hidden lg:inline shrink-0">{t('deployCloudwaysHeader')}</span>
          </a>
        ) : (
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4B8DGU+BIDPTE+50+4YQJIQ"
            target="_blank"
            rel="noopener noreferrer"
            title={t('deployConoHaHeader')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all shrink-0 border border-emerald-300/40 whitespace-nowrap"
          >
            <Rocket className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
            <span className="hidden lg:inline shrink-0">{t('deployConoHaHeader')}</span>
          </a>
        )}
      </div>
    </header>
  );
};
