'use client';

import React from 'react';
import { Sliders, Bot, CheckSquare, Wrench, Settings, Trash2, Cpu, Sparkles, ExternalLink } from 'lucide-react';
import { CustomNode, AgentNodeData, TaskNodeData, ToolNodeData, CrewConfig } from '@/types/editor';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface InspectorProps {
  selectedNode: CustomNode | null;
  onUpdateNodeData: (nodeId: string, newData: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  crewConfig: CrewConfig;
  onUpdateCrewConfig: (newConfig: Partial<CrewConfig>) => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode,
  crewConfig,
  onUpdateCrewConfig,
}) => {
  const { t } = useLanguage();

  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md p-4 flex flex-col gap-4 overflow-y-auto shrink-0 z-20">
        <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-3">
          <Settings className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider">{t('crewGlobalConfig')}</h3>
        </div>

        <p className="text-xs text-slate-400">{t('inspectorIntro')}</p>

        <div className="space-y-4 pt-2">
          {/* Crew Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('crewName')}</label>
            <input
              type="text"
              value={crewConfig.name}
              onChange={(e) => onUpdateCrewConfig({ name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Process Type */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('executionProcess')}</label>
            <select
              value={crewConfig.process}
              onChange={(e) => onUpdateCrewConfig({ process: e.target.value as 'sequential' | 'hierarchical' })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="sequential">{t('processSequential')}</option>
              <option value="hierarchical">{t('processHierarchical')}</option>
            </select>
          </div>

          {/* Verbose & Memory Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">{t('verboseLogs')}</span>
              <input
                type="checkbox"
                checked={crewConfig.verbose}
                onChange={(e) => onUpdateCrewConfig({ verbose: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">{t('crewMemory')}</span>
              <input
                type="checkbox"
                checked={crewConfig.memory}
                onChange={(e) => onUpdateCrewConfig({ memory: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      </aside>
    );
  }

  const { id, type, data } = selectedNode;

  return (
    <aside className="w-80 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md p-4 flex flex-col gap-4 overflow-y-auto shrink-0 z-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {t('nodeInspector')} ({type})
          </h3>
        </div>
        <button
          onClick={() => onDeleteNode(id)}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Form Fields according to Node Type */}
      {type === 'agent' && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-950/40 border border-indigo-900/40 text-indigo-300 text-xs font-semibold">
            <Bot className="w-4 h-4" /> {t('agentParameters')}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('label')}</label>
            <input
              type="text"
              value={(data as AgentNodeData).label || ''}
              onChange={(e) => onUpdateNodeData(id, { label: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('role')}</label>
            <input
              type="text"
              value={(data as AgentNodeData).role || ''}
              onChange={(e) => onUpdateNodeData(id, { role: e.target.value })}
              placeholder={t('rolePlaceholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('llmModel')}</label>
            <div className="relative">
              <select
                value={(data as AgentNodeData).model || 'gpt-4o'}
                onChange={(e) => onUpdateNodeData(id, { model: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
              >
                <option value="gpt-4o">OpenAI: gpt-4o</option>
                <option value="gpt-4o-mini">OpenAI: gpt-4o-mini</option>
                <option value="gemini/gemini-1.5-pro">Google: Gemini 1.5 Pro</option>
                <option value="claude-3-5-sonnet-20240620">Anthropic: Claude 3.5 Sonnet</option>
                <option value="ollama/llama3">Local Ollama: Llama 3</option>
              </select>
            </div>

            {/* Pro Tip Recommended Tools */}
            <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('proTipTitle')}</span>
              </div>
              <p className="text-slate-400 leading-normal">
                {t('groqTip')}{' '}
                <a
                  href="https://groq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-0.5"
                >
                  [Groq API ↗] <ExternalLink className="w-2.5 h-2.5 inline" />
                </a>
              </p>
              <p className="text-slate-400 leading-normal">
                {t('pineconeTip')}{' '}
                <a
                  href="https://pinecone.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-0.5"
                >
                  [Pinecone ↗] <ExternalLink className="w-2.5 h-2.5 inline" />
                </a>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('goal')}</label>
            <textarea
              rows={3}
              value={(data as AgentNodeData).goal || ''}
              onChange={(e) => onUpdateNodeData(id, { goal: e.target.value })}
              placeholder={t('goalPlaceholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('backstory')}</label>
            <textarea
              rows={3}
              value={(data as AgentNodeData).backstory || ''}
              onChange={(e) => onUpdateNodeData(id, { backstory: e.target.value })}
              placeholder={t('backstoryPlaceholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">{t('verboseOutput')}</span>
              <input
                type="checkbox"
                checked={(data as AgentNodeData).verbose ?? true}
                onChange={(e) => onUpdateNodeData(id, { verbose: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">{t('allowDelegation')}</span>
              <input
                type="checkbox"
                checked={(data as AgentNodeData).allowDelegation ?? false}
                onChange={(e) => onUpdateNodeData(id, { allowDelegation: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      )}

      {type === 'task' && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 text-xs font-semibold">
            <CheckSquare className="w-4 h-4" /> {t('taskParameters')}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('label')}</label>
            <input
              type="text"
              value={(data as TaskNodeData).label || ''}
              onChange={(e) => onUpdateNodeData(id, { label: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('description')}</label>
            <textarea
              rows={4}
              value={(data as TaskNodeData).description || ''}
              onChange={(e) => onUpdateNodeData(id, { description: e.target.value })}
              placeholder={t('descriptionPlaceholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('expectedOutput')}</label>
            <textarea
              rows={3}
              value={(data as TaskNodeData).expectedOutput || ''}
              onChange={(e) => onUpdateNodeData(id, { expectedOutput: e.target.value })}
              placeholder={t('expectedOutputPlaceholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">{t('asyncExecution')}</span>
              <input
                type="checkbox"
                checked={(data as TaskNodeData).asyncExecution ?? false}
                onChange={(e) => onUpdateNodeData(id, { asyncExecution: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>
      )}

      {type === 'tool' && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-950/40 border border-amber-900/40 text-amber-300 text-xs font-semibold">
            <Wrench className="w-4 h-4" /> {t('toolParameters')}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('label')}</label>
            <input
              type="text"
              value={(data as ToolNodeData).label || ''}
              onChange={(e) => onUpdateNodeData(id, { label: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('toolType')}</label>
            <select
              value={(data as ToolNodeData).toolType || 'SerperDevTool'}
              onChange={(e) => onUpdateNodeData(id, { toolType: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500 font-mono"
            >
              <option value="SerperDevTool">SerperDevTool (Google Search)</option>
              <option value="ScrapeWebsiteTool">ScrapeWebsiteTool (HTML Scraper)</option>
              <option value="DirectoryReadTool">DirectoryReadTool (Local Folders)</option>
              <option value="FileReadTool">FileReadTool (Local Files)</option>
              <option value="TXTSearchTool">TXTSearchTool (RAG Search)</option>
              <option value="CustomTool">Custom Function Tool</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('description')}</label>
            <textarea
              rows={3}
              value={(data as ToolNodeData).description || ''}
              onChange={(e) => onUpdateNodeData(id, { description: e.target.value })}
              placeholder={t('toolDescPlaceholder')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500 resize-none"
            />
          </div>
        </div>
      )}
    </aside>
  );
};
