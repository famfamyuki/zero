'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Bot, CheckSquare, Wrench, Check, LayoutGrid, Globe, Rocket, ExternalLink, FileCode2, Target, PackageCheck, ChevronDown } from 'lucide-react';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { WorkflowTemplate } from '@/types/editor';
import { getSupabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function TemplatesPage() {
  const router = useRouter();
  const { lang, setLanguage, t } = useLanguage();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(PRESET_TEMPLATES);
  const [selectedUseCase, setSelectedUseCase] = useState<string>('ALL');
  const [selectedPattern, setSelectedPattern] = useState<string>('ALL');

  useEffect(() => {
    async function loadSupabaseTemplates() {
      try {
        const { data, error } = await getSupabase().from('templates').select('*');
        if (data && data.length > 0 && !error) {
          const formattedSupabase: WorkflowTemplate[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            titleEn: item.title_en || item.title,
            titleJa: item.title_ja || item.title,
            description: item.description,
            descriptionEn: item.description_en || item.description,
            descriptionJa: item.description_ja || item.description,
            price: 0,
            category: item.category || 'BUSINESS',
            badge: 'FREE',
            previewNodesCount: item.preview_nodes_count || { agents: 2, tasks: 2, tools: 2 },
            graphData: item.graph_data,
          }));
          setTemplates((prev) => {
            const ids = new Set(formattedSupabase.map((t) => t.id));
            return [...formattedSupabase, ...prev.filter((t) => !ids.has(t.id))];
          });
        }
      } catch (err) {
        console.log('Using default preset templates:', err);
      }
    }
    loadSupabaseTemplates();
  }, []);

  const useCases = Array.from(new Set(templates.map((template) => template.useCase).filter(Boolean))) as string[];
  const codePatterns = Array.from(new Set(templates.map((template) => template.codePattern).filter(Boolean))) as string[];

  const filteredTemplates = templates.filter((template) => {
    const useCaseMatches = selectedUseCase === 'ALL' || template.useCase === selectedUseCase;
    const patternMatches = selectedPattern === 'ALL' || template.codePattern === selectedPattern;
    return useCaseMatches && patternMatches;
  });

  const handleUseTemplate = (template: WorkflowTemplate) => {
    localStorage.setItem('agentgraph_active_flow', JSON.stringify(template.graphData));
    router.push('/');
  };

  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case 'MARKETING': case 'SOCIAL':
        return 'text-purple-300 bg-purple-950/80 border-purple-800/40';
      case 'CONTENT': case 'RESEARCH':
        return 'text-sky-300 bg-sky-950/80 border-sky-800/40';
      case 'DATA': case 'ENGINEERING':
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-800/40';
      case 'SECURITY':
        return 'text-red-300 bg-red-950/80 border-red-800/40';
      default:
        return 'text-indigo-400 bg-indigo-950/80 border-indigo-800/40';
    }
  };

  const useCaseLabel = (template: WorkflowTemplate) => lang === 'ja'
    ? (template.useCaseJa || template.useCase || template.category)
    : (template.useCaseEn || template.useCase || template.category);

  const patternLabel = (template: WorkflowTemplate) => lang === 'ja'
    ? (template.codePatternJa || template.codePattern || template.graphData.crewConfig.process)
    : (template.codePatternEn || template.codePattern || template.graphData.crewConfig.process);

  const filterUseCaseLabel = (value: string) => {
    if (value === 'ALL') return lang === 'ja' ? 'すべての用途' : 'All use cases';
    const template = templates.find((item) => item.useCase === value);
    return template ? useCaseLabel(template) : value;
  };

  const filterPatternLabel = (value: string) => {
    if (value === 'ALL') return lang === 'ja' ? 'すべてのコード構成' : 'All code patterns';
    const template = templates.find((item) => item.codePattern === value);
    return template ? patternLabel(template) : value;
  };

  const difficultyLabel = (difficulty?: WorkflowTemplate['difficulty']) => {
    const labels = lang === 'ja'
      ? { STARTER: '入門', INTERMEDIATE: '中級', ADVANCED: '上級' }
      : { STARTER: 'Starter', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' };
    return labels[difficulty || 'STARTER'];
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-2 overflow-x-auto no-scrollbar sm:overflow-visible">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('backToCanvas')}</span>
            <span className="sm:hidden font-semibold">Canvas</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            <h1 className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight">{t('templatesTitle')}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Toggle */}
          <button
            onClick={() => setLanguage(lang === 'en' ? 'ja' : 'en')}
            title="Switch Language / 言語切り替え"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-indigo-600/60 hover:text-indigo-300 transition shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-[11px] sm:text-xs">{lang === 'en' ? 'EN' : '日本語'}</span>
          </button>

          {/* ConoHa VPS Persistent High-Visibility Header CTA Button */}
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4B8DGU+BIDPTE+50+4YQJIQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all shrink-0 flex-shrink-0 border border-emerald-300/40 min-w-max whitespace-nowrap"
          >
            <Rocket className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
            <span>{t('deployConoHaHeader')}</span>
            <ExternalLink className="w-3 h-3 text-white/90 shrink-0" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 border-b border-slate-800/80 overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> {t('noPaywallsBadge')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-emerald-200 px-2">
            {t('templatesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto px-2">
            {t('templatesSub')}
          </p>

          <div className="mx-auto grid max-w-2xl gap-3 pt-3 text-left sm:grid-cols-2 sm:pt-5">
            <label className="text-[11px] font-semibold text-slate-400">
              <span className="mb-1.5 block">{lang === 'ja' ? '用途で絞り込む' : 'Filter by use case'}</span>
              <select
                value={selectedUseCase}
                onChange={(event) => setSelectedUseCase(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-100 focus:border-indigo-500"
              >
                {['ALL', ...useCases].map((value) => <option key={value} value={value}>{filterUseCaseLabel(value)}</option>)}
              </select>
            </label>
            <label className="text-[11px] font-semibold text-slate-400">
              <span className="mb-1.5 block">{lang === 'ja' ? 'コード構成で絞り込む' : 'Filter by code pattern'}</span>
              <select
                value={selectedPattern}
                onChange={(event) => setSelectedPattern(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-100 focus:border-indigo-500"
              >
                {['ALL', ...codePatterns].map((value) => <option key={value} value={value}>{filterPatternLabel(value)}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="mb-5 flex items-center justify-between gap-3 text-xs text-slate-400">
          <span>{lang === 'ja' ? `${filteredTemplates.length}件のテンプレート` : `${filteredTemplates.length} templates`}</span>
          {(selectedUseCase !== 'ALL' || selectedPattern !== 'ALL') && (
            <button type="button" onClick={() => { setSelectedUseCase('ALL'); setSelectedPattern('ALL'); }} className="text-indigo-300 hover:text-indigo-200">
              {lang === 'ja' ? '絞り込みを解除' : 'Clear filters'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredTemplates.map((template) => {
            const title = lang === 'ja' && template.titleJa ? template.titleJa : (template.titleEn || template.title);
            const description = lang === 'ja' && template.descriptionJa ? template.descriptionJa : (template.descriptionEn || template.description);
            const bestFor = lang === 'ja' ? template.bestForJa : template.bestForEn;
            const codeGuide = lang === 'ja' ? template.codeGuideJa : template.codeGuideEn;
            const prerequisites = (lang === 'ja' ? template.prerequisitesJa : template.prerequisitesEn) || [];
            const deliverables = (lang === 'ja' ? template.deliverablesJa : template.deliverablesEn) || [];

            return (
              <div
                key={template.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-600/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-5 sm:p-6 space-y-3 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border ${getCategoryBadgeClass(template.useCase)}`}>
                      {useCaseLabel(template)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full border border-indigo-800/60 bg-indigo-950/70 px-2.5 py-1 text-[10px] font-bold text-indigo-300">{patternLabel(template)}</span>
                      <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[9px] font-bold text-slate-400">{difficultyLabel(template.difficulty)}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {description}
                  </p>

                  {bestFor && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                        <Target className="h-3.5 w-3.5" /> {lang === 'ja' ? 'こんな人・業務に' : 'Best for'}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">{bestFor}</p>
                    </div>
                  )}

                  {codeGuide && (
                    <div className="rounded-xl border border-indigo-900/60 bg-indigo-950/25 px-3 py-2.5">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-indigo-300">
                        <FileCode2 className="h-3.5 w-3.5" /> {lang === 'ja' ? '生成されるコード構成' : 'Generated code shape'}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">{codeGuide}</p>
                    </div>
                  )}

                  {/* Node Composition Summary */}
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      <span>{template.previewNodesCount.agents} Agents</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>{template.previewNodesCount.tasks} Tasks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span>{template.previewNodesCount.tools} Tools</span>
                    </div>
                  </div>

                  <details className="group/details rounded-xl border border-slate-800 bg-slate-950/40">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-[11px] font-semibold text-slate-300">
                      <span className="flex items-center gap-1.5"><PackageCheck className="h-3.5 w-3.5 text-amber-400" />{lang === 'ja' ? '必要なもの・得られる成果物' : 'Requirements & deliverables'}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition group-open/details:rotate-180" />
                    </summary>
                    <div className="grid gap-3 border-t border-slate-800 px-3 py-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-1.5 text-[10px] font-bold text-amber-300">{lang === 'ja' ? '事前に必要' : 'Prerequisites'}</p>
                        <ul className="space-y-1 text-[10px] text-slate-400">{prerequisites.map((item) => <li key={item}>• {item}</li>)}</ul>
                      </div>
                      <div>
                        <p className="mb-1.5 text-[10px] font-bold text-emerald-300">{lang === 'ja' ? '主な成果物' : 'Deliverables'}</p>
                        <ul className="space-y-1 text-[10px] text-slate-400">{deliverables.map((item) => <li key={item}>• {item}</li>)}</ul>
                      </div>
                    </div>
                  </details>
                </div>

                {/* Card Footer / Action */}
                <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">{t('access')}</span>
                    <p className="text-sm font-extrabold text-emerald-400">
                      {t('freeAccess')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>{t('loadTemplateBtn')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950 pb-20 sm:pb-6">
        {t('templatesFooter')}
      </footer>

      {/* Dedicated Mobile Bottom Sticky ConoHa VPS Affiliate Banner (sm:hidden) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-3 py-2 bg-slate-950/95 border-t border-emerald-500/60 backdrop-blur-md flex items-center justify-between gap-2 shadow-2xl">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Rocket className="w-3.5 h-3.5 animate-bounce" />
          </div>
          <div className="truncate">
            <span className="font-extrabold text-[11px] text-emerald-300 block leading-tight truncate">
              {lang === 'ja' ? '24時間自動実行用 ConoHa VPS' : '24/7 CrewAI Server'}
            </span>
            <span className="text-[9px] text-slate-400 block truncate">
              {lang === 'ja' ? '月額定額・高速SSD' : 'Fixed Monthly • Fast SSD'}
            </span>
          </div>
        </div>

        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B8DGU+BIDPTE+50+4YQJIQ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-[11px] shadow-lg shadow-emerald-500/40 shrink-0 border border-emerald-300/40 whitespace-nowrap active:scale-95 transition"
        >
          <span>{lang === 'ja' ? '🚀 サーバー構築' : '🚀 Deploy VPS'}</span>
          <ExternalLink className="w-3 h-3 text-white/90" />
        </a>
      </div>
    </div>
  );
}
