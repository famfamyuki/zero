'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckSquare, ArrowRightCircle, Settings } from 'lucide-react';
import { TaskNodeData } from '@/types/editor';

export const TaskNode = memo(({ id, data, selected }: NodeProps<any>) => {
  const taskData = data as TaskNodeData;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent('open-node-inspector', { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  return (
    <div
      className={`relative min-w-[260px] rounded-xl bg-slate-900/90 border transition-all duration-200 shadow-xl backdrop-blur-md overflow-hidden ${
        selected
          ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-emerald-500/20'
          : 'border-emerald-950/80 hover:border-emerald-700/60'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900/80 px-4 py-2.5 border-b border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs text-emerald-200 tracking-wide uppercase">Task Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          {taskData.asyncExecution && (
            <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
              Async
            </span>
          )}
          <button
            onClick={handleEditClick}
            className="p-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 transition"
            title="Edit Node Details"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h4 className="text-sm font-bold text-slate-100 truncate">{taskData.label || 'Unnamed Task'}</h4>
          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{taskData.description || 'No description provided'}</p>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 text-[11px] text-emerald-300/80">
          <ArrowRightCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Expected: {taskData.expectedOutput || 'Output format'}</span>
        </div>
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-4 !h-4 bg-emerald-500 border-2 border-slate-900 rounded-full hover:scale-125 hover:border-white transition-all shadow-md shadow-emerald-500/50 cursor-pointer"
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 bg-emerald-400 border-2 border-slate-900 rounded-full hover:scale-125 hover:border-white transition-all shadow-md shadow-emerald-400/50 cursor-pointer"
      />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';
