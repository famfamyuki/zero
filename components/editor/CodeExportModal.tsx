'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  Terminal,
  ExternalLink,
  Sparkles,
  Rocket,
  FileText,
  BookOpen,
  Layers,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Hammer,
  FileCode2,
  FolderGit2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { CustomNode, CrewConfig, ExportMode } from '@/types/editor';
import { Edge } from '@xyflow/react';
import { generateProjectFiles } from '@/lib/transpiler/crewai';
import { ValidationError } from '@/types/editor';

function getLocalizedSuggestion(error: ValidationError, lang: 'en' | 'ja'): string | undefined {
  if (lang === 'en') return error.suggestion;

  switch (error.code) {
    case 'MULTIPLE_AGENTS_PER_TASK':
      return '主担当Agentを1人だけ残すか、AgentごとにTaskを分割し、各結果を Task → Task エッジで後続の統合Taskへ接続してください。';
    case 'UNASSIGNED_TASK':
      return 'Agent → Task エッジを追加し、このTaskへ主担当Agentを1人だけ割り当ててください。';
    case 'TASK_CYCLE_DETECTED':
    case 'TASK_SELF_CYCLE':
      return '依存関係が一方向になるよう、循環を作っている Task → Task エッジを削除してください。';
    case 'UNIMPLEMENTED_CUSTOM_TOOLS_IN_PRODUCTION':
      return 'Scaffold Modeで安全なToolスタブを出力し、実装後にProduction Modeへ切り替えてください。';
    default:
      return error.suggestion;
  }
}

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: CustomNode[];
  edges: Edge[];
  crewConfig?: CrewConfig;
  initialCode?: string;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  crewConfig = { name: 'My Crew', process: 'sequential', verbose: true, memory: false },
}) => {
  const { lang, t } = useLanguage();
  const [exportMode, setExportMode] = useState<ExportMode>('scaffold');
  const [activeTabPath, setActiveTabPath] = useState<string>('main.py');
  const [copied, setCopied] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generate project files and validation results reactively
  const project = useMemo(() => {
    return generateProjectFiles(nodes, edges, crewConfig, exportMode);
  }, [nodes, edges, crewConfig, exportMode]);

  // Adjust active tab if current file doesn't exist
  useEffect(() => {
    if (project.files.length > 0 && !project.files.some((f) => f.path === activeTabPath)) {
      setActiveTabPath(project.files[0].path);
    }
  }, [project.files, activeTabPath]);

  if (!isOpen) return null;

  const activeFile = project.files.find((f) => f.path === activeTabPath) || project.files[0] || {
    path: 'main.py',
    filename: 'main.py',
    content: project.mainCode,
    language: 'python',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    project.files.forEach((file, index) => {
      setTimeout(() => {
        const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, index * 200);
    });
  };

  const hasErrors = !project.validation.isValid;
  const hasWarnings = project.validation.warnings.length > 0;
  const hasCustomTools = project.validation.customTools.length > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Main Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92dvh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  {t('codeModalTitle')}
                </h3>
                <span className="text-xs font-mono text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {activeFile.path}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('codeModalSub')}</p>
            </div>
          </div>

          {/* Export Mode Toggle & Close */}
          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setExportMode('scaffold')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                  exportMode === 'scaffold'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Generate runnable project with BaseTool stubs and placeholder models"
              >
                <Hammer className="w-3.5 h-3.5 text-amber-400" />
                <span>Scaffold Mode</span>
              </button>

              <button
                onClick={() => setExportMode('production')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                  exportMode === 'production'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Strict production verification (blocks export if unimplemented tools exist)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Production Mode</span>
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-colors border border-transparent hover:border-slate-700 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Validation Errors Panel (Blocking) */}
        {hasErrors && (
          <div className="px-5 py-3.5 bg-red-950/80 border-b border-red-800/80 text-red-200 space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-bold text-sm text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                {lang === 'ja'
                  ? 'グラフ検証エラー: エクスポートが停止しました'
                  : 'Graph Validation Errors: Export Blocked'}
              </span>
            </div>
            <ul className="space-y-2 text-xs text-red-200">
              {project.validation.errors.map((err, idx) => (
                <li key={`${err.code}-${err.nodeId || err.edgeId || idx}`} className="rounded-xl border border-red-800/70 bg-red-950/60 p-3 leading-relaxed list-none">
                  <div className="flex flex-wrap items-start gap-2">
                    <span className="font-mono font-bold bg-red-900/60 px-1.5 py-0.5 rounded text-[10px] border border-red-700/60 shrink-0">
                      {err.code}
                    </span>
                    <span className="min-w-0 flex-1">{err.message}</span>
                  </div>
                  {getLocalizedSuggestion(err, lang) && (
                    <div className="mt-2 rounded-lg border border-amber-700/50 bg-amber-950/50 px-3 py-2 text-amber-100">
                      <strong className="text-amber-300">
                        {lang === 'ja' ? '修正方法: ' : 'How to fix: '}
                      </strong>
                      {getLocalizedSuggestion(err, lang)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Validation Warnings Panel (Collapsible) */}
        {hasWarnings && !hasErrors && (
          <div className="px-5 py-2 bg-amber-950/50 border-b border-amber-800/50 text-amber-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-amber-300">
                  {lang === 'ja'
                    ? `注意・安全性警告 (${project.validation.warnings.length}件)`
                    : `Warnings & Safety Notices (${project.validation.warnings.length})`}
                </span>
                {hasCustomTools && exportMode === 'scaffold' && (
                  <span className="bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded text-[10px] border border-amber-700/60 font-mono">
                    Scaffold Stubs Active
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowWarnings(!showWarnings)}
                className="text-[11px] text-amber-400 hover:text-amber-200 underline"
              >
                {showWarnings ? (lang === 'ja' ? '折りたたむ' : 'Hide') : (lang === 'ja' ? '詳細を表示' : 'Show details')}
              </button>
            </div>
            {showWarnings && (
              <ul className="mt-2 space-y-1 text-[11px] text-amber-200/90 pl-5 list-disc">
                {project.validation.warnings.map((w, idx) => (
                  <li key={idx}>
                    <span className="font-mono bg-amber-900/60 px-1 py-0.2 rounded text-[10px] mr-1 border border-amber-700/40">
                      {w.code}
                    </span>
                    {w.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Multi-file Project Tabs Bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {project.files.map((file) => {
            const isActive = file.path === activeTabPath;
            return (
              <button
                key={file.path}
                onClick={() => setActiveTabPath(file.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={file.description || file.filename}
              >
                {file.path.endsWith('.py') ? (
                  <FileCode2 className="w-3.5 h-3.5" />
                ) : file.path.endsWith('.md') ? (
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                ) : file.path.startsWith('.') ? (
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body - Code Viewer */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300 min-h-[220px]">
          <div className="relative">
            {activeFile.description && (
              <div className="mb-2 text-[11px] text-slate-400 font-sans italic">
                # {activeFile.description} ({activeFile.path})
              </div>
            )}
            <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto selection:bg-emerald-500 selection:text-white">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>

        {/* Local Execution Instructions */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {t('runCommandLabel')}{' '}
              <code className="text-slate-200 bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">
                pip install -r requirements.txt && python main.py
              </code>
            </span>
          </div>
          <a
            href="https://docs.crewai.com"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
          >
            CrewAI Docs <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Affiliate Deployment Banner */}
        {isBannerVisible && (
          <div className="relative px-5 py-4 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-emerald-950/70 border-t border-indigo-800/50 space-y-3 text-xs transition-all">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="text-emerald-300 font-bold">{t('readyToDeployTitle')}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] font-extrabold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-md uppercase tracking-wider">
                  24/7 Auto Execution
                </span>
                
                <button
                  onClick={() => setIsBannerVisible(false)}
                  title="Dismiss banner"
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5 px-2 py-0.5 rounded-lg hover:bg-slate-800/60 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{lang === 'ja' ? '非表示' : 'Skip'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-2xl border-2 border-orange-400/80 bg-gradient-to-r from-orange-950 via-orange-900/80 to-amber-950 p-4 shadow-xl shadow-orange-950/50 sm:p-5">
                <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-orange-400/15 blur-2xl" aria-hidden="true" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-300/60 bg-orange-500/25 shadow-inner">
                      <Rocket className="h-5 w-5 text-orange-200" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-amber-300/70 bg-amber-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-orange-950">
                          {t('cloudwaysRecommendedBadge')}
                        </span>
                        <span className="rounded-full border border-orange-300/50 bg-orange-500/20 px-2.5 py-1 text-[10px] font-bold text-orange-100">
                          {t('cloudwaysDeadline')}
                        </span>
                      </div>
                      <strong className="block text-sm font-black leading-snug text-orange-100 sm:text-base">{t('cloudwaysTitle')}</strong>
                      <p className="mt-1 text-[11px] leading-relaxed text-orange-50/90 sm:text-xs">{t('cloudwaysSub')}</p>
                      <code className="mt-2 inline-block rounded-md border border-orange-300/50 bg-slate-950/50 px-2.5 py-1 font-mono text-[11px] font-bold text-amber-200">
                        {t('cloudwaysPromoCode')}
                      </code>
                    </div>
                  </div>
                  <a
                    href="https://unified.cloudways.com/signup?id=2194173&coupon=SUMMER404"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-center text-xs font-black text-white shadow-lg shadow-orange-950/50 ring-1 ring-orange-200/60 transition hover:from-orange-400 hover:to-amber-300 sm:w-auto sm:min-w-60"
                  >
                    <span>{t('cloudwaysCtaBtn')}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white" />
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/35 p-3 shadow-lg sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/50 bg-emerald-600/25">
                      <Terminal className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm text-emerald-200">{t('conohaTitle')}</strong>
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200">{t('conohaJapanBadge')}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{t('conohaSub')}</p>
                    </div>
                  </div>
                  <a
                    href="https://px.a8.net/svt/ejp?a8mat=4B8DGU+BIDPTE+50+4YQJIQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-center text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 transition hover:from-emerald-500 hover:to-green-500 sm:w-auto"
                  >
                    <span>{t('conohaCtaBtn')}</span>
                    <ExternalLink className="h-3 w-3 text-white" />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] leading-relaxed text-slate-500">{t('affiliateDisclosure')}</p>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              File: <strong className="text-emerald-300">{activeFile.filename}</strong>
            </span>
            {hasErrors && (
              <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {lang === 'ja' ? 'エラーを修正してください' : 'Fix graph errors before export'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={hasErrors}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">{t('copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{t('copyCode')} ({activeFile.filename})</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={hasErrors}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download {activeFile.filename}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              disabled={hasErrors}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
              title="Download all project files"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Download Full Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
