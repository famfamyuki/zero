'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Bot, CheckSquare, Wrench, Zap, Check, LayoutGrid, Globe, Rocket, ExternalLink } from 'lucide-react';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { WorkflowTemplate } from '@/types/editor';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function TemplatesPage() {
  const router = useRouter();
  const { lang, setLanguage, t } = useLanguage();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(PRESET_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function loadSupabaseTemplates() {
      try {
        const { data, error } = await supabase.from('templates').select('*');
        if (data && data.length > 0 && !error) {
          const formattedSupabase: WorkflowTemplate[] = data.map((item: any) => ({
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

  const categories = ['All', 'MARKETING', 'CONTENT', 'BUSINESS'];

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (template: WorkflowTemplate) => {
    localStorage.setItem('agentgraph_active_flow', JSON.stringify(template.graphData));
    router.push('/');
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'MARKETING':
        return 'text-purple-300 bg-purple-950/80 border-purple-800/40';
      case 'CONTENT':
        return 'text-sky-300 bg-sky-950/80 border-sky-800/40';
      case 'BUSINESS':
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-800/40';
      default:
        return 'text-indigo-400 bg-indigo-950/80 border-indigo-800/40';
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
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
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all shrink-0 border border-emerald-300/40"
          >
            <Rocket className="w-3.5 h-3.5 text-white animate-bounce" />
            <span className="hidden sm:inline">{t('deployConoHaHeader')}</span>
            <span className="sm:hidden font-extrabold text-[11px]">{lang === 'ja' ? '🚀 24h稼働' : '🚀 24/7 VPS'}</span>
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

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const title = lang === 'ja' && template.titleJa ? template.titleJa : (template.titleEn || template.title);
            const description = lang === 'ja' && template.descriptionJa ? template.descriptionJa : (template.descriptionEn || template.description);

            return (
              <div
                key={template.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-600/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-6 space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryBadgeClass(template.category)}`}>
                      {template.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border bg-emerald-950/80 text-emerald-400 border-emerald-800/40">
                      FREE
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {description}
                  </p>

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
