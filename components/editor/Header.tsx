'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Code2, Download, Upload, Trash2, ShoppingBag, Sparkles, FolderOpen } from 'lucide-react';
import { PRESET_TEMPLATES } from '@/lib/presets';
import { WorkflowTemplate } from '@/types/editor';

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
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
            <Network className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-emerald-300">
              AgentGraph Studio
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
              Zero Cost
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">Visual AI Agent Workflow Builder & Code Transpiler</p>
        </div>
      </div>

      {/* Center Quick Presets & Status */}
      <div className="hidden md:flex items-center gap-2">
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-slate-700 transition">
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Preset</span>
          </button>
          <div className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">Preset Workflows</p>
            {PRESET_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => onLoadPreset(tmpl)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between group/item"
              >
                <span className="truncate">{tmpl.title}</span>
                <span className="text-[10px] text-indigo-400 opacity-0 group-hover/item:opacity-100 font-semibold">
                  Load
                </span>
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500">|</span>
        <span className="text-xs text-slate-400">
          <strong className="text-indigo-400">{nodeCount}</strong> Nodes
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/templates"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-indigo-900/60 text-indigo-300 text-xs hover:bg-indigo-950/50 hover:border-indigo-700 transition shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Marketplace</span>
        </Link>

        {/* JSON Import/Export */}
        <button
          onClick={onExportJson}
          title="Export Workflow JSON"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
        >
          <Download className="w-4 h-4" />
        </button>

        <label
          title="Import Workflow JSON"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
        </label>

        <button
          onClick={onClearCanvas}
          title="Clear Canvas"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-950/40 hover:border-red-900/60 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Transpile Button */}
        <button
          onClick={onGenerateCode}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-95 transition"
        >
          <Code2 className="w-4 h-4" />
          <span>Generate Python</span>
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
        </button>
      </div>
    </header>
  );
};
