'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Code2, Download, Upload, Trash2, Sparkles, FolderOpen, Globe, Rocket, ExternalLink } from 'lucide-react';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { WorkflowTemplate } from '@/types/editor';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface HeaderProps {
  onGenerateCode: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearCanvas: () => void;
  onLoadPreset: (template: WorkflowTemplate) => void;
  nodeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onGenerateCode,
  onExportJson,
  onImportJson,
  onClearCanvas,
  onLoadPreset,
  nodeCount,
}) => {
  const { lang, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(lang === 'en' ? 'ja' : 'en');
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 gap-2 overflow-x-auto sm:overflow-visible">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
            <Network className="w-4 h-4" />
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-emerald-300 whitespace-nowrap">
              {t('appName')}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40 whitespace-nowrap hidden xs:inline-block">
              {t('zeroCostBadge')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden md:block whitespace-nowrap">
            {t('subTitle')}
          </p>
        </div>
      </div>

      {/* Center Quick Presets & Status */}
      <div className="hidden lg:flex items-center gap-2 shrink-0">
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-slate-700 transition whitespace-nowrap">
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('loadPreset')}</span>
          </button>
          <div className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">{t('presetWorkflows')}</p>
            {PRESET_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => onLoadPreset(tmpl)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between group/item"
              >
                <span className="truncate">
                  {lang === 'ja' && tmpl.titleJa ? tmpl.titleJa : (tmpl.titleEn || tmpl.title)}
                </span>
                <span className="text-[10px] text-indigo-400 opacity-0 group-hover/item:opacity-100 font-semibold">
                  Load
                </span>
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500">|</span>
        <span className="text-xs text-slate-400 whitespace-nowrap">
          <strong className="text-indigo-400">{nodeCount}</strong> {t('nodesCount')}
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Language Switcher Toggle */}
        <button
          onClick={toggleLanguage}
          title="Switch Language / 言語切り替え"
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-indigo-600/60 hover:text-indigo-300 transition shrink-0 whitespace-nowrap"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-[11px] sm:text-xs">{lang === 'en' ? 'EN' : '日本語'}</span>
        </button>

        <Link
          href="/templates"
          className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-indigo-900/60 text-indigo-300 text-xs hover:bg-indigo-950/50 hover:border-indigo-700 transition shadow-sm shrink-0 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('freeTemplates')}</span>
        </Link>

        {/* JSON Import/Export (Desktop) */}
        <button
          onClick={onExportJson}
          title={t('exportJson')}
          className="hidden md:block p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition shrink-0"
        >
          <Download className="w-4 h-4" />
        </button>

        <label
          title={t('importJson')}
          className="hidden md:block p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
        </label>

        <button
          onClick={onClearCanvas}
          title={t('clearCanvas')}
          className="hidden md:block p-2 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-950/40 hover:border-red-900/60 transition shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Export Python Code Button */}
        <button
          onClick={onGenerateCode}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs hover:bg-emerald-950/40 transition shrink-0 whitespace-nowrap"
        >
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">{t('generatePython')}</span>
          <span className="sm:hidden font-bold">Code</span>
        </button>

        {/* ConoHa VPS Persistent High-Visibility Header CTA Button (Desktop & Tablet) */}
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B8DGU+BIDPTE+50+4YQJIQ"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all shrink-0 border border-emerald-300/40 min-w-max whitespace-nowrap"
        >
          <Rocket className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
          <span>{t('deployConoHaHeader')}</span>
          <ExternalLink className="w-3 h-3 text-white/90 shrink-0" />
        </a>
      </div>
    </header>
  );
};
