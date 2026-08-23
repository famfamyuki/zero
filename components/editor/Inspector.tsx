'use client';

import React, { useEffect, useRef } from 'react';
import { Sliders, Bot, CheckSquare, Wrench, Settings, Trash2, Sparkles, ExternalLink, X } from 'lucide-react';
import { CustomNode, AgentNodeData, TaskNodeData, ToolNodeData, CrewConfig } from '@/types/editor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LLM_MODEL_GROUPS, DEFAULT_LLM_MODEL, CUSTOM_MODEL_VALUE, isKnownModel } from '@/lib/models';
import { getToolParameterDefinitions } from '@/lib/tool-config';

interface InspectorProps {
  selectedNode: CustomNode | null;
  onUpdateNodeData: (nodeId: string, newData: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  crewConfig: CrewConfig;
  onUpdateCrewConfig: (newConfig: Partial<CrewConfig>) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode,
  crewConfig,
  onUpdateCrewConfig,
  isOpen = false,
  onClose,
}) => {
  const { t, lang } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const focusHeading = () => headingRef.current?.focus();
    window.addEventListener('focus-inspector-heading', focusHeading);
    return () => window.removeEventListener('focus-inspector-heading', focusHeading);
  }, []);

  const containerClasses = `w-full max-w-sm md:w-80 border-l border-slate-800 bg-slate-950/95 md:bg-slate-950/90 backdrop-blur-md p-4 pb-32 md:pb-4 flex flex-col gap-4 overflow-y-auto shrink-0 z-40 absolute inset-y-0 right-0 transition-transform duration-300 ease-in-out shadow-2xl ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
        />
      )}

      {!selectedNode ? (
        <aside className={containerClasses}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Settings className="w-4 h-4 text-indigo-400" />
              <h3 ref={headingRef} tabIndex={-1} className="text-xs font-bold uppercase tracking-wider outline-none">{t('crewGlobalConfig')}</h3>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
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
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                {crewConfig.process === 'hierarchical' ? t('processHierarchicalHelp') : t('processSequentialHelp')}
              </p>
            </div>

            {/* Manager LLM (Only for Hierarchical) */}
            {crewConfig.process === 'hierarchical' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('managerLlm')}</label>
                <select
                  value={isKnownModel(crewConfig.managerLlm || DEFAULT_LLM_MODEL) ? (crewConfig.managerLlm || DEFAULT_LLM_MODEL) : CUSTOM_MODEL_VALUE}
                  onChange={(e) => onUpdateCrewConfig({ managerLlm: e.target.value === CUSTOM_MODEL_VALUE ? 'custom/' : e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {LLM_MODEL_GROUPS.map((group) => (
                    <optgroup key={group.group} label={group.group} className="bg-slate-900 text-slate-300 font-semibold">
                      {group.models.map((model) => (
                        <option key={model.value} value={model.value} className="bg-slate-950 text-slate-100 font-normal">
                          {model.label}{model.badge ? ` · ${model.badge}` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value={CUSTOM_MODEL_VALUE}>{t('customModel')}</option>
                </select>
                {!isKnownModel(crewConfig.managerLlm || DEFAULT_LLM_MODEL) && (
                  <input
                    type="text"
                    value={crewConfig.managerLlm || ''}
                    onChange={(e) => onUpdateCrewConfig({ managerLlm: e.target.value })}
                    placeholder={t('customModelPlaceholder')}
                    className="mt-2 w-full rounded-lg border border-indigo-800/70 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100 focus:border-indigo-500"
                  />
                )}
              </div>
            )}

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
      ) : (
        <aside className={containerClasses}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 ref={headingRef} tabIndex={-1} className="text-xs font-bold uppercase tracking-wider text-slate-200 outline-none">
                {t('nodeInspector')} ({selectedNode.type})
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDeleteNode(selectedNode.id)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
                title="Delete Node"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Form Fields according to Node Type */}
          <details className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <summary className="cursor-pointer text-xs font-semibold text-indigo-300">{t('crewGlobalConfig')}</summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-300">{t('crewName')}</label>
                <input value={crewConfig.name} onChange={(e) => onUpdateCrewConfig({ name: e.target.value })} className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">{t('executionProcess')}</label>
                <select
                  value={crewConfig.process}
                  onChange={(e) => onUpdateCrewConfig({ process: e.target.value as 'sequential' | 'hierarchical' })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                >
                  <option value="sequential">{t('processSequential')}</option>
                  <option value="hierarchical">{t('processHierarchical')}</option>
                </select>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                  {crewConfig.process === 'hierarchical' ? t('processHierarchicalHelp') : t('processSequentialHelp')}
                </p>
              </div>
              {crewConfig.process === 'hierarchical' && (
                <div>
                  <label className="mb-1 block text-xs text-slate-300">{t('managerLlm')}</label>
                  <select
                    value={isKnownModel(crewConfig.managerLlm || DEFAULT_LLM_MODEL) ? (crewConfig.managerLlm || DEFAULT_LLM_MODEL) : CUSTOM_MODEL_VALUE}
                    onChange={(e) => onUpdateCrewConfig({ managerLlm: e.target.value === CUSTOM_MODEL_VALUE ? 'custom/' : e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                  >
                    {LLM_MODEL_GROUPS.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.models.map((model) => <option key={model.value} value={model.value}>{model.label}</option>)}
                      </optgroup>
                    ))}
                    <option value={CUSTOM_MODEL_VALUE}>{t('customModel')}</option>
                  </select>
                  {!isKnownModel(crewConfig.managerLlm || DEFAULT_LLM_MODEL) && (
                    <input
                      value={crewConfig.managerLlm || ''}
                      onChange={(e) => onUpdateCrewConfig({ managerLlm: e.target.value })}
                      placeholder={t('customModelPlaceholder')}
                      className="mt-2 w-full rounded-lg border border-indigo-800 bg-slate-950 px-3 py-2 font-mono text-xs"
                    />
                  )}
                </div>
              )}
              <label className="flex items-center justify-between text-xs text-slate-300">{t('verboseLogs')}<input type="checkbox" checked={crewConfig.verbose} onChange={(e) => onUpdateCrewConfig({ verbose: e.target.checked })} /></label>
              <label className="flex items-center justify-between text-xs text-slate-300">{t('crewMemory')}<input type="checkbox" checked={crewConfig.memory} onChange={(e) => onUpdateCrewConfig({ memory: e.target.checked })} /></label>
            </div>
          </details>

          {selectedNode.type === 'agent' && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-950/40 border border-indigo-900/40 text-indigo-300 text-xs font-semibold">
                <Bot className="w-4 h-4" /> {t('agentParameters')}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('label')}</label>
                <input
                  type="text"
                  value={(selectedNode.data as AgentNodeData).label || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { label: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('role')}</label>
                <input
                  type="text"
                  value={(selectedNode.data as AgentNodeData).role || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { role: e.target.value })}
                  placeholder={t('rolePlaceholder')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('llmModel')}</label>
                <div className="relative">
                  <select
                    value={isKnownModel((selectedNode.data as AgentNodeData).model || DEFAULT_LLM_MODEL) ? ((selectedNode.data as AgentNodeData).model || DEFAULT_LLM_MODEL) : CUSTOM_MODEL_VALUE}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, { model: e.target.value === CUSTOM_MODEL_VALUE ? 'custom/' : e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500"
                  >
                    {LLM_MODEL_GROUPS.map((group) => (
                      <optgroup key={group.group} label={group.group} className="bg-slate-900 text-slate-300 font-semibold">
                        {group.models.map((model) => (
                          <option key={model.value} value={model.value} className="bg-slate-950 text-slate-100 font-normal">
                            {model.label}{model.badge ? ` · ${model.badge}` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value={CUSTOM_MODEL_VALUE}>{t('customModel')}</option>
                  </select>
                  {!isKnownModel((selectedNode.data as AgentNodeData).model || DEFAULT_LLM_MODEL) && (
                    <input
                      type="text"
                      value={(selectedNode.data as AgentNodeData).model || ''}
                      onChange={(e) => onUpdateNodeData(selectedNode.id, { model: e.target.value })}
                      placeholder={t('customModelPlaceholder')}
                      className="mt-2 w-full rounded-lg border border-indigo-800/70 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100 focus:border-indigo-500"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('goal')}</label>
                <textarea
                  rows={3}
                  value={(selectedNode.data as AgentNodeData).goal || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { goal: e.target.value })}
                  placeholder={t('goalPlaceholder')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('backstory')}</label>
                <textarea
                  rows={3}
                  value={(selectedNode.data as AgentNodeData).backstory || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { backstory: e.target.value })}
                  placeholder={t('backstoryPlaceholder')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">{t('verboseOutput')}</span>
                  <input
                    type="checkbox"
                    checked={(selectedNode.data as AgentNodeData).verbose ?? true}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, { verbose: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">{t('allowDelegation')}</span>
                  <input
                    type="checkbox"
                    checked={(selectedNode.data as AgentNodeData).allowDelegation ?? false}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, { allowDelegation: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>

              <details className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <summary className="cursor-pointer text-xs font-semibold text-slate-300">{t('advancedSettings')}</summary>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="text-[11px] text-slate-400">{t('maxIterations')}
                    <input type="number" min={1} value={(selectedNode.data as AgentNodeData).maxIter ?? 25} onChange={(e) => onUpdateNodeData(selectedNode.id, { maxIter: Number(e.target.value) })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs" />
                  </label>
                  <label className="text-[11px] text-slate-400">{t('maxRpm')}
                    <input type="number" min={1} value={(selectedNode.data as AgentNodeData).maxRpm ?? ''} placeholder="Unlimited" onChange={(e) => onUpdateNodeData(selectedNode.id, { maxRpm: e.target.value ? Number(e.target.value) : undefined })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs" />
                  </label>
                  <label className="col-span-2 text-[11px] text-slate-400">{t('maxExecutionTime')}
                    <input type="number" min={1} value={(selectedNode.data as AgentNodeData).maxExecutionTime ?? ''} placeholder={t('unlimited')} onChange={(e) => onUpdateNodeData(selectedNode.id, { maxExecutionTime: e.target.value ? Number(e.target.value) : undefined })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs" />
                  </label>
                  <label className="col-span-2 flex items-center justify-between text-xs text-slate-300">{t('respectContextWindow')}<input type="checkbox" checked={(selectedNode.data as AgentNodeData).respectContextWindow ?? true} onChange={(e) => onUpdateNodeData(selectedNode.id, { respectContextWindow: e.target.checked })} /></label>
                  <label className="col-span-2 flex items-center justify-between text-xs text-slate-300">{t('cacheResponses')}<input type="checkbox" checked={(selectedNode.data as AgentNodeData).cache ?? true} onChange={(e) => onUpdateNodeData(selectedNode.id, { cache: e.target.checked })} /></label>
                </div>
              </details>
            </div>
          )}

          {selectedNode.type === 'task' && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 text-xs font-semibold">
                <CheckSquare className="w-4 h-4" /> {t('taskParameters')}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('label')}</label>
                <input
                  type="text"
                  value={(selectedNode.data as TaskNodeData).label || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { label: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('description')}</label>
                <textarea
                  rows={4}
                  value={(selectedNode.data as TaskNodeData).description || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { description: e.target.value })}
                  placeholder={t('descriptionPlaceholder')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('expectedOutput')}</label>
                <textarea
                  rows={3}
                  value={(selectedNode.data as TaskNodeData).expectedOutput || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { expectedOutput: e.target.value })}
                  placeholder={t('expectedOutputPlaceholder')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('outputFormat')}</label>
                <select
                  value={(selectedNode.data as TaskNodeData).outputFormat || 'text'}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { outputFormat: e.target.value as 'text' | 'json' })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500"
                >
                  <option value="text">{t('outputFormatText')}</option>
                  <option value="json">{t('outputFormatJson')}</option>
                </select>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{t('outputFormatHelp')}</p>
              </div>

              {(selectedNode.data as TaskNodeData).outputFormat === 'json' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">{t('outputSchema')}</label>
                  <textarea
                    rows={4}
                    value={(selectedNode.data as TaskNodeData).outputSchema || ''}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, { outputSchema: e.target.value })}
                    placeholder={'{"summary":"string","score":"number"}'}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">{t('outputSchemaHelp')}</p>
                </div>
              )}

              <details className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <summary className="cursor-pointer text-xs font-semibold text-slate-300">{t('advancedSettings')}</summary>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center justify-between text-xs text-slate-300">{t('markdownOutput')}<input type="checkbox" checked={(selectedNode.data as TaskNodeData).markdown ?? false} onChange={(e) => onUpdateNodeData(selectedNode.id, { markdown: e.target.checked })} /></label>
                  <label className="flex items-center justify-between text-xs text-slate-300">{t('humanApproval')}<input type="checkbox" checked={(selectedNode.data as TaskNodeData).humanInput ?? false} onChange={(e) => onUpdateNodeData(selectedNode.id, { humanInput: e.target.checked })} /></label>
                  <label className="block text-xs text-slate-300">{t('outputFile')}
                    <input value={(selectedNode.data as TaskNodeData).outputFile || ''} onChange={(e) => onUpdateNodeData(selectedNode.id, { outputFile: e.target.value })} placeholder="report.md" className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 font-mono text-xs" />
                  </label>
                </div>
              </details>

              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-slate-300">{t('asyncExecution')}</span>
                  <input
                    type="checkbox"
                    checked={(selectedNode.data as TaskNodeData).asyncExecution ?? false}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, { asyncExecution: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>
          )}

          {selectedNode.type === 'tool' && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-950/40 border border-amber-900/40 text-amber-300 text-xs font-semibold">
                <Wrench className="w-4 h-4" /> {t('toolParameters')}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('label')}</label>
                <input
                  type="text"
                  value={(selectedNode.data as ToolNodeData).label || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { label: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('toolType')}</label>
                <select
                  value={(selectedNode.data as ToolNodeData).toolType || 'SerperDevTool'}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { toolType: e.target.value, parameters: {} })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500 font-mono"
                >
                  <option value="SerperDevTool">SerperDevTool (Google Search)</option>
                  <option value="ScrapeWebsiteTool">ScrapeWebsiteTool (HTML Scraper)</option>
                  <option value="DirectoryReadTool">DirectoryReadTool (Local Folders)</option>
                  <option value="FileReadTool">FileReadTool (Local Files)</option>
                  <option value="TXTSearchTool">TXTSearchTool (RAG Search)</option>
                  <option value="PDFSearchTool">PDFSearchTool (PDF Search)</option>
                  <option value="CSVSearchTool">CSVSearchTool (CSV Search)</option>
                  <option value="YoutubeVideoSearchTool">YoutubeVideoSearchTool (YouTube Search)</option>
                  <option value="GithubSearchTool">GithubSearchTool (GitHub Search)</option>
                  <option value="MDXSearchTool">MDXSearchTool (Markdown Search)</option>
                  <option value="CustomTool">Custom Function Tool</option>
                </select>
              </div>

              {getToolParameterDefinitions((selectedNode.data as ToolNodeData).toolType).map((parameter) => (
                <div key={parameter.key}>
                  <label className="mb-1 block text-xs font-medium text-slate-300">{lang === 'ja' ? parameter.labelJa : parameter.label}</label>
                  <input
                    value={(selectedNode.data as ToolNodeData).parameters?.[parameter.key] || ''}
                    onChange={(e) => onUpdateNodeData(selectedNode.id, {
                      parameters: { ...((selectedNode.data as ToolNodeData).parameters || {}), [parameter.key]: e.target.value },
                    })}
                    placeholder={parameter.placeholder}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100"
                  />
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{lang === 'ja' ? parameter.helpJa : parameter.help}</p>
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('description')}</label>
                <textarea
                  rows={3}
                  value={(selectedNode.data as ToolNodeData).description || ''}
                  onChange={(e) => onUpdateNodeData(selectedNode.id, { description: e.target.value })}
                  placeholder={t('toolDescPlaceholder')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  );
};
