'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Sparkles, Bot, CheckSquare, Wrench, ShieldCheck, Zap, ExternalLink, CreditCard, Check } from 'lucide-react';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { WorkflowTemplate } from '@/types/editor';
import { supabase } from '@/lib/supabase';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(PRESET_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSupabaseTemplates() {
      try {
        const { data, error } = await supabase.from('templates').select('*');
        if (data && data.length > 0 && !error) {
          // Merge Supabase database templates with fallback presets
          const formattedSupabase: WorkflowTemplate[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price || 0,
            category: item.category || 'General',
            badge: item.badge || (item.price > 0 ? 'PRO' : 'FREE'),
            previewNodesCount: item.preview_nodes_count || { agents: 2, tasks: 2, tools: 1 },
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

  const categories = ['All', 'Content Creation', 'Engineering', 'Finance'];

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  const handleUseFreeTemplate = (template: WorkflowTemplate) => {
    localStorage.setItem('agentgraph_active_flow', JSON.stringify(template.graphData));
    router.push('/');
  };

  const handleBuyTemplate = async (template: WorkflowTemplate) => {
    setLoadingTemplateId(template.id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initiate Stripe Checkout');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout error');
    } finally {
      setLoadingTemplateId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Canvas
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h1 className="font-extrabold text-base text-slate-100 tracking-tight">CrewAI Template Marketplace</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Supabase + Stripe Ready
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 px-6 border-b border-slate-800/80 overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Production-Grade AI Agent Architectures
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-emerald-200">
            Prebuilt CrewAI Workflow Templates
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Instantly deploy pre-configured multi-agent systems. Free templates load directly onto your canvas, while premium templates unlock advanced enterprise agent pipelines.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-600/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-6 space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/40">
                    {template.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      template.price === 0
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800/40'
                    }`}
                  >
                    {template.badge || (template.price === 0 ? 'FREE' : 'PRO')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition">
                  {template.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {template.description}
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
                  <span className="text-xs text-slate-500">Price</span>
                  <p className="text-base font-extrabold text-slate-100">
                    {template.price === 0 ? 'Free' : `$${template.price}`}
                  </p>
                </div>

                {template.price === 0 ? (
                  <button
                    onClick={() => handleUseFreeTemplate(template)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Load Template</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyTemplate(template)}
                    disabled={loadingTemplateId === template.id}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{loadingTemplateId === template.id ? 'Redirecting...' : 'Buy Template'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950">
        AgentGraph Studio • Zero Running Cost Client-Side Transpiler • Supabase & Stripe Powered
      </footer>
    </div>
  );
}
