'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Wrench, Globe, Search, Folder, FileText, Code2, Settings, Trash2 } from 'lucide-react';
import { ToolNodeData } from '@/types/editor';
import { useNodeZoomMode } from './useNodeZoomMode';

const toolIcons: Record<string, React.ReactNode> = {
  SerperDevTool: <Search className="w-4 h-4 text-amber-400" />,
  ScrapeWebsiteTool: <Globe className="w-4 h-4 text-amber-400" />,
  DirectoryReadTool: <Folder className="w-4 h-4 text-amber-400" />,
  FileReadTool: <FileText className="w-4 h-4 text-amber-400" />,
  TXTSearchTool: <FileText className="w-4 h-4 text-amber-400" />,
  CustomTool: <Code2 className="w-4 h-4 text-amber-400" />,
};

export const ToolNode = memo(({ id, data, selected }: NodeProps<any>) => {
  const toolData = data as ToolNodeData;
  const zoomMode = useNodeZoomMode();
  const isCompact = zoomMode === 'compact';
  const icon = toolIcons[toolData.toolType] || <Wrench className="w-4 h-4 text-amber-400" />;

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
      className={`relative ${isCompact ? 'min-w-[200px]' : 'min-w-[240px]'} rounded-xl bg-slate-900/90 border transition-[border-color,box-shadow] duration-200 shadow-xl backdrop-blur-md ${
        selected
          ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-amber-500/20'
          : 'border-amber-950/80 hover:border-amber-700/60'
      }`}
    >
      {/* Floating Action Toolbar on Node Selection (Touch Ergonomics) */}
      {selected && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-slate-900 border border-amber-500/80 p-1 rounded-full shadow-2xl animate-in zoom-in-95 duration-150 shrink-0">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] transition"
          >
            <Settings className="w-3 h-3 text-slate-950" />
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
      <div className={`bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900/80 ${isCompact ? 'px-3 py-2 rounded-xl border-b-0' : 'px-4 py-2 rounded-t-xl border-b'} border-amber-900/40 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            {icon}
          </div>
          <span className={`font-semibold text-amber-200 tracking-wide ${isCompact ? 'max-w-[135px] truncate text-sm normal-case' : 'text-xs uppercase'}`}>
            {isCompact ? (toolData.label || 'Unnamed Tool') : 'Tool Node'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {!isCompact && <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/40 font-mono">
            {toolData.toolType || 'Tool'}
          </span>}
          <button
            onClick={handleEditClick}
            className="p-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800/60 text-amber-300 transition"
            title="Edit Node Details"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      {!isCompact && <div className="p-3 space-y-1.5">
        <h4 className="text-xs font-bold text-slate-100 truncate">{toolData.label || 'Unnamed Tool'}</h4>
        <p className="text-[11px] text-slate-400 line-clamp-2">{toolData.description || 'Prebuilt CrewAI Integration'}</p>
      </div>}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-4 !h-4 bg-amber-500 border-2 border-slate-900 rounded-full hover:scale-125 hover:border-white transition-all shadow-md shadow-amber-500/50 cursor-pointer"
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-4 !h-4 bg-amber-400 border-2 border-slate-900 rounded-full hover:scale-125 hover:border-white transition-all shadow-md shadow-amber-400/50 cursor-pointer"
      />
    </div>
  );
});

ToolNode.displayName = 'ToolNode';
