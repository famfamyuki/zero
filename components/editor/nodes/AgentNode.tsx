'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot, Cpu, Sparkles } from 'lucide-react';
import { AgentNodeData } from '@/types/editor';

export const AgentNode = memo(({ data, selected }: NodeProps<any>) => {
  const agentData = data as AgentNodeData;

  return (
    <div
      className={`relative min-w-[260px] rounded-xl bg-slate-900/90 border transition-all duration-200 shadow-xl backdrop-blur-md overflow-hidden ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-indigo-500/20'
          : 'border-indigo-950/80 hover:border-indigo-700/60'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900/80 px-4 py-2.5 border-b border-indigo-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs text-indigo-200 tracking-wide uppercase">Agent Node</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/40">
          <Cpu className="w-3 h-3 text-indigo-400" />
          <span>{agentData.model || 'gpt-4o'}</span>
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

      {/* Input Handle (Tools or Tasks connecting to Agent) */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="w-3.5 h-3.5 bg-indigo-500 border-2 border-slate-900 rounded-full hover:scale-125 transition-transform"
      />

      {/* Output Handle (Agent connecting to Tasks) */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="w-3.5 h-3.5 bg-indigo-400 border-2 border-slate-900 rounded-full hover:scale-125 transition-transform"
      />
    </div>
  );
});

AgentNode.displayName = 'AgentNode';
