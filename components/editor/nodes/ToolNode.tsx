'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Wrench, Globe, Search, Folder, FileText, Code2 } from 'lucide-react';
import { ToolNodeData } from '@/types/editor';

const toolIcons: Record<string, React.ReactNode> = {
  SerperDevTool: <Search className="w-4 h-4 text-amber-400" />,
  ScrapeWebsiteTool: <Globe className="w-4 h-4 text-amber-400" />,
  DirectoryReadTool: <Folder className="w-4 h-4 text-amber-400" />,
  FileReadTool: <FileText className="w-4 h-4 text-amber-400" />,
  TXTSearchTool: <FileText className="w-4 h-4 text-amber-400" />,
  CustomTool: <Code2 className="w-4 h-4 text-amber-400" />,
};

export const ToolNode = memo(({ data, selected }: NodeProps<any>) => {
  const toolData = data as ToolNodeData;
  const icon = toolIcons[toolData.toolType] || <Wrench className="w-4 h-4 text-amber-400" />;

  return (
    <div
      className={`relative min-w-[240px] rounded-xl bg-slate-900/90 border transition-all duration-200 shadow-xl backdrop-blur-md overflow-hidden ${
        selected
          ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-amber-500/20'
          : 'border-amber-950/80 hover:border-amber-700/60'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900/80 px-4 py-2 border-b border-amber-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            {icon}
          </div>
          <span className="font-semibold text-xs text-amber-200 tracking-wide uppercase">Tool Node</span>
        </div>
        <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/40 font-mono">
          {toolData.toolType || 'Tool'}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-3 space-y-1.5">
        <h4 className="text-xs font-bold text-slate-100 truncate">{toolData.label || 'Unnamed Tool'}</h4>
        <p className="text-[11px] text-slate-400 line-clamp-2">{toolData.description || 'Prebuilt CrewAI Integration'}</p>
      </div>

      {/* Output Handle (Tool connecting to Agent or Task) */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="w-3.5 h-3.5 bg-amber-400 border-2 border-slate-900 rounded-full hover:scale-125 transition-transform"
      />
    </div>
  );
});

ToolNode.displayName = 'ToolNode';
