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
  ArrowLeft,
  MapPin,
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

function getLocalizedErrorMessage(
  error: ValidationError,
  lang: 'en' | 'ja',
  nodes: CustomNode[],
  edges: Edge[]
): string {
  if (lang === 'en') return error.message;

  const node = error.nodeId ? nodes.find((item) => item.id === error.nodeId) : undefined;
  const nodeLabel = String(node?.data?.label || error.nodeId || '対象ノード');

  switch (error.code) {
    case 'MULTIPLE_AGENTS_PER_TASK': {
      const assignedAgentIds = new Set<string>();
      const assignedAgentId = node?.type === 'task'
        ? (node.data as { assignedAgentId?: string }).assignedAgentId
        : undefined;
      if (assignedAgentId) assignedAgentIds.add(assignedAgentId);

      edges.forEach((edge) => {
        const source = nodes.find((item) => item.id === edge.source);
        const target = nodes.find((item) => item.id === edge.target);
        if (edge.target === error.nodeId && source?.type === 'agent') assignedAgentIds.add(source.id);
        if (edge.source === error.nodeId && target?.type === 'agent') assignedAgentIds.add(target.id);
      });

      const agentNames = Array.from(assignedAgentIds).map((agentId) => {
        const agent = nodes.find((item) => item.id === agentId);
        const agentData = agent?.data as { role?: string; label?: string } | undefined;
        return String(agentData?.role || agentData?.label || agentId);
      });
      return `Task「${nodeLabel}」に${agentNames.length}人のAgentが割り当てられています。主担当は1人だけにしてください。現在の担当: ${agentNames.join('、')}`;
    }
    case 'UNASSIGNED_TASK':
      return `Task「${nodeLabel}」に主担当Agentが割り当てられていません。`;
    case 'TASK_CYCLE_DETECTED':
    case 'TASK_SELF_CYCLE':
      return `Task「${nodeLabel}」を含む依存関係が循環しています。`;
    case 'DANGLING_EDGE':
      return '存在しないノードにつながる接続があります。不要な接続を削除してください。';
    case 'DUPLICATE_NODE_ID':
      return `ノードID「${error.nodeId}」が重複しています。`;
    case 'DUPLICATE_EDGE_ID':
      return `接続ID「${error.edgeId}」が重複しています。`;
    default:
      return error.message;
  }
}

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditNode: (nodeId?: string) => void;
  nodes: CustomNode[];
  edges: Edge[];
  crewConfig?: CrewConfig;
  initialCode?: string;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  onEditNode,
  nodes,
  edges,
  crewConfig = { name: 'My Crew', process: 'sequential', verbose: true, memory: false },
}) => {
  const { lang, t } = useLanguage();
  const [exportMode, setExportMode] = useState<ExportMode>('scaffold');
  const [activeTabPath, setActiveTabPath] = useState<string>('main.py');
  const [copied, setCopied] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [showDeploymentOptions, setShowDeploymentOptions] = useState(true);

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="code-export-modal-title"
        className="relative flex h-[calc(100dvh-1.5rem)] max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl sm:h-[92dvh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm shrink-0 border ${
              hasErrors
                ? 'bg-red-600/20 border-red-500/40 text-red-400'
                : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
            }`}>
              {hasErrors ? <AlertCircle className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="code-export-modal-title" className="text-base font-bold text-slate-100">
                  {hasErrors
                    ? (lang === 'ja' ? 'コードを生成できません' : 'Code generation blocked')
                    : t('codeModalTitle')}
                </h3>
                {!hasErrors && (
                  <span className="text-xs font-mono text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {activeFile.path}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {hasErrors
                  ? (lang === 'ja'
                    ? '実行できないファイルは出力していません。下の項目を修正してから再度生成してください。'
                    : 'No runnable files were created. Fix the items below, then generate again.')
                  : t('codeModalSub')}
              </p>
            </div>
          </div>

          {/* Export Mode Toggle & Close */}
          <div className="flex items-center gap-2">
            {!hasErrors && !showDeploymentOptions && (
              <button
                type="button"
                onClick={() => setShowDeploymentOptions(true)}
                className="hidden items-center gap-1.5 rounded-lg border border-emerald-600/50 bg-emerald-950/50 px-2.5 py-1.5 text-xs font-bold text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-900/60 md:flex"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>{lang === 'ja' ? 'サーバー案内を表示' : 'Show server offers'}</span>
              </button>
            )}

            {/* Mode Switcher */}
            {!hasErrors && <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
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
            </div>}

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-colors border border-transparent hover:border-slate-700 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!hasErrors && showDeploymentOptions && (
          <div className="shrink-0 border-b border-orange-700/50 bg-gradient-to-r from-orange-950/95 via-slate-950 to-emerald-950/95 px-3 py-2.5 sm:px-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                <span className="truncate text-xs font-bold text-slate-100">{t('readyToDeployTitle')}</span>
                <span className="hidden rounded-full border border-amber-300/60 bg-amber-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-orange-950 sm:inline-flex">
                  24/7 Auto Execution
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDeploymentOptions(false)}
                className="shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                aria-label={lang === 'ja' ? 'サーバー案内を非表示' : 'Hide server offers'}
              >
                {lang === 'ja' ? '非表示' : 'Hide'}
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href="https://unified.cloudways.com/signup?id=2194173&coupon=SUMMER404"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border-2 border-orange-400/80 bg-gradient-to-r from-orange-900 to-amber-800 px-3 py-2.5 shadow-lg shadow-orange-950/40 transition hover:from-orange-800 hover:to-amber-700"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <strong className="text-xs font-black text-orange-50 sm:text-sm">{t('cloudwaysTitle')}</strong>
                    <span className="rounded-full bg-amber-300 px-1.5 py-0.5 text-[9px] font-black text-orange-950">40% OFF</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] text-orange-100/90">
                    <span>{t('cloudwaysDeadline')}</span>
                    <code className="font-mono font-bold text-amber-200">SUMMER404</code>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-2 text-[10px] font-black text-white ring-1 ring-orange-200/70 group-hover:bg-orange-400 sm:text-xs">
                  {t('cloudwaysCtaBtn')}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </a>

              <a
                href="https://px.a8.net/svt/ejp?a8mat=4B8DGU+BIDPTE+50+4YQJIQ"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-emerald-500/60 bg-emerald-950/80 px-3 py-2.5 shadow-lg shadow-emerald-950/30 transition hover:border-emerald-400 hover:bg-emerald-900/80"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/50 bg-emerald-600/25">
                    <Terminal className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div className="min-w-0">
                    <strong className="block truncate text-xs font-bold text-emerald-100 sm:text-sm">{t('conohaTitle')}</strong>
                    <span className="text-[10px] text-emerald-200/80">{t('conohaJapanBadge')} · Python / Docker</span>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-2.5 py-2 text-[10px] font-black text-white group-hover:from-emerald-500 group-hover:to-green-500 sm:text-xs">
                  {t('conohaCtaBtn')}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </div>
            <p className="mt-1.5 text-center text-[9px] leading-tight text-slate-500">{t('affiliateDisclosure')}</p>
          </div>
        )}

        {/* Validation Errors Panel (Blocking) */}
        {hasErrors && (
          <div className="flex-1 overflow-y-auto bg-slate-950 px-4 py-5 sm:px-6 sm:py-6">
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="rounded-2xl border border-red-800/80 bg-red-950/55 p-4 text-red-100 shadow-lg shadow-red-950/20 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-xl border border-red-700/60 bg-red-900/50 p-2 text-red-300">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-red-200">
                      {lang === 'ja'
                        ? `${project.validation.errors.length}件の修正が必要です`
                        : `${project.validation.errors.length} ${project.validation.errors.length === 1 ? 'issue' : 'issues'} must be fixed`}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-red-200/80">
                      {lang === 'ja'
                        ? 'グラフは保存されたままです。自動修正で構成を変えず、担当や依存関係を確認して修正できます。'
                        : 'Your graph remains saved. Automatic repair is avoided because choosing agents or dependencies could change the workflow meaning.'}
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-red-100">
                {project.validation.errors.map((err, idx) => (
                  <li key={`${err.code}-${err.nodeId || err.edgeId || idx}`} className="rounded-2xl border border-red-900/70 bg-slate-900 p-4 leading-relaxed list-none sm:p-5">
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="font-mono font-bold bg-red-950 px-2 py-1 rounded-md text-[10px] text-red-300 border border-red-800/70 shrink-0">
                        {err.code}
                      </span>
                      <span className="min-w-0 flex-1 text-sm text-slate-200">
                        {getLocalizedErrorMessage(err, lang, nodes, edges)}
                      </span>
                    </div>
                    {getLocalizedSuggestion(err, lang) && (
                      <div className="mt-3 rounded-xl border border-amber-700/40 bg-amber-950/35 px-3 py-2.5 text-amber-100">
                        <strong className="text-amber-300">
                          {lang === 'ja' ? '修正方法: ' : 'How to fix: '}
                        </strong>
                        {getLocalizedSuggestion(err, lang)}
                      </div>
                    )}
                    {err.nodeId && (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onEditNode(err.nodeId)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/50 bg-indigo-950/60 px-3 py-2 font-semibold text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-900/60"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          {lang === 'ja' ? '該当ノードを表示' : 'Show affected node'}
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!hasErrors && (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth">

        {/* Validation Warnings Panel (Collapsible) */}
        {hasWarnings && (
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
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-[11px] text-amber-200/90 pl-5 pr-2 list-disc">
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
        <div className="sticky top-0 z-20 px-4 py-2 bg-slate-950/95 backdrop-blur border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
        <div className="min-h-[220px] max-h-[46dvh] overflow-y-auto bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-300 sm:p-6">
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

          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {hasErrors ? (
            <button
              type="button"
              onClick={() => onEditNode()}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500"
            >
              <ArrowLeft className="h-4 w-4" />
              {lang === 'ja' ? '編集画面に戻る' : 'Back to editor'}
            </button>
          ) : (
            <>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                File: <strong className="text-emerald-300">{activeFile.filename}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download {activeFile.filename}</span>
                </button>

                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
                  title="Download all project files"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Download Full Project</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
