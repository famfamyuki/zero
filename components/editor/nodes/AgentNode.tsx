'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot, Cpu, Sparkles, Settings, Trash2 } from 'lucide-react';
import { AgentNodeData } from '@/types/editor';
import { DEFAULT_LLM_MODEL } from '@/lib/models';

export const AgentNode = memo(({ id, data, selected }: NodeProps<any>) => {
  const agentData = data as AgentNodeData;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent('open-node-inspector', { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent('delete-node-id', { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      className={`relative min-w-[260px] rounded-xl bg-slate-900/90 border transition-all duration-200 shadow-xl backdrop-blur-md ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-indigo-500/20'
          : 'border-indigo-950/80 hover:border-indigo-700/60'
      }`}
    >
      {/* Floating Action Toolbar on Node Selection (Touch Ergonomics) */}
      {selected && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-slate-900 border border-indigo-500/80 p-1 rounded-full shadow-2xl animate-in zoom-in-95 duration-150 shrink-0">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition"
          >
            <Settings className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1 rounded-full bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800/60 transition"
            title="Delete Node"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900/80 px-4 py-2.5 border-b border-indigo-900/40 flex items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs text-indigo-200 tracking-wide uppercase">Agent Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/40">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>{agentData.model || DEFAULT_LLM_MODEL}</span>
          </div>
          <button
            onClick={handleEditClick}
            className="p-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 transition"
            title="Edit Node Details"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h4 className="text-sm font-bold text-slate-100 truncate">{agentData.role || 'Unnamed Agent'}</h4>
          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{agentData.goal || 'No goal specified'}</p>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate">{agentData.backstory ? 'Backstory configured' : 'No backstory'}</span>
        </div>
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-4 !h-4 bg-indigo-500 border-2 border-slate-900 rounded-full hover:scale-125 hover:border-white transition-all shadow-md shadow-indigo-500/50 cursor-pointer"
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 bg-indigo-400 border-2 border-slate-900 rounded-full hover:scale-125 hover:border-white transition-all shadow-md shadow-indigo-400/50 cursor-pointer"
      />
    </div>
  );
});

AgentNode.displayName = 'AgentNode';
