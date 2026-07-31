'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Bot, CheckSquare, Wrench, Zap, Check, LayoutGrid } from 'lucide-react';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { WorkflowTemplate } from '@/types/editor';
import { supabase } from '@/lib/supabase';

export default function TemplatesPage() {
  const router = useRouter();
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
            description: item.description,
            price: 0,
            category: item.category || 'General',
            badge: 'FREE',
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

  const handleUseTemplate = (template: WorkflowTemplate) => {
    localStorage.setItem('agentgraph_active_flow', JSON.stringify(template.graphData));
    router.push('/');
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
            <LayoutGrid className="w-5 h-5 text-indigo-400" />
            <h1 className="font-extrabold text-base text-slate-100 tracking-tight">CrewAI Free Template Library</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> 100% Free & Open Source
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 px-6 border-b border-slate-800/80 overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Access • No Paywalls
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-emerald-200">
            Prebuilt CrewAI Workflow Templates
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Instantly deploy pre-configured multi-agent systems onto your canvas. All templates are 100% free with raw Python code export.
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
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border bg-emerald-950/80 text-emerald-400 border-emerald-800/40">
                    FREE
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
                  <span className="text-xs text-slate-500">Access</span>
                  <p className="text-sm font-extrabold text-emerald-400">
                    100% Free
                  </p>
                </div>

                <button
                  onClick={() => handleUseTemplate(template)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Load Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950">
        AgentGraph Studio • 100% Free Open Source AI Agent Builder • Zero Vendor Lock-in
      </footer>
    </div>
  );
}
