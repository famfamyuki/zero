'use client';

import React from 'react';
import { Bot, CheckSquare, Wrench, Sparkles, Layers, Info, X } from 'lucide-react';
import { NodeType, WorkflowTemplate } from '@/types/editor';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SidebarProps {
  onLoadPreset: (tmpl: WorkflowTemplate) => void;
  onAddNode?: (nodeType: NodeType) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLoadPreset, onAddNode, isMobileOpen = false, onCloseMobile }) => {
  const { lang, t } = useLanguage();

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (nodeType: NodeType) => {
    if (onAddNode) {
      onAddNode(nodeType);
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`w-72 md:w-64 border-r border-slate-800 bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-md p-4 flex flex-col gap-5 overflow-y-auto shrink-0 z-40 md:z-20 fixed md:relative inset-y-0 left-0 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between md:hidden border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{t('nodePalette')}</span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section 1: Drag & Drop Node Palette */}
        <div>
          <div className="hidden md:flex items-center gap-2 mb-3 text-slate-400">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">{t('nodePalette')}</h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">{t('nodePaletteSub')}</p>

          <div className="space-y-2.5">
            {/* Agent Node Item */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'agent')}
              onClick={() => handleNodeClick('agent')}
              className="group cursor-pointer active:scale-95 p-3 rounded-xl bg-slate-900/80 border border-indigo-900/40 hover:border-indigo-600/70 hover:bg-slate-900 transition-all shadow-md hover:shadow-indigo-500/10 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition">{t('agentNodeTitle')}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{t('agentNodeSub')}</p>
              </div>
            </div>

            {/* Task Node Item */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'task')}
              onClick={() => handleNodeClick('task')}
              className="group cursor-pointer active:scale-95 p-3 rounded-xl bg-slate-900/80 border border-emerald-900/40 hover:border-emerald-600/70 hover:bg-slate-900 transition-all shadow-md hover:shadow-emerald-500/10 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition">{t('taskNodeTitle')}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{t('taskNodeSub')}</p>
              </div>
            </div>

            {/* Tool Node Item */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'tool')}
              onClick={() => handleNodeClick('tool')}
              className="group cursor-pointer active:scale-95 p-3 rounded-xl bg-slate-900/80 border border-amber-900/40 hover:border-amber-600/70 hover:bg-slate-900 transition-all shadow-md hover:shadow-amber-500/10 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition">{t('toolNodeTitle')}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{t('toolNodeSub')}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-800" />

        {/* Section 2: Quick Template Loader */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">{t('starterTemplates')}</h3>
          </div>

          <div className="space-y-2">
            {PRESET_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  onLoadPreset(tmpl);
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition text-xs flex flex-col gap-1 group"
              >
                <span className="font-semibold text-slate-300 group-hover:text-indigo-300 transition truncate">
                  {lang === 'ja' && tmpl.titleJa ? tmpl.titleJa : (tmpl.titleEn || tmpl.title)}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{tmpl.previewNodesCount.agents} Agents</span>
                  <span>•</span>
                  <span>{tmpl.previewNodesCount.tasks} Tasks</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 flex items-start gap-2.5 text-[11px] text-indigo-300">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p>{t('sidebarTip')}</p>
        </div>
      </aside>
    </>
  );
};
