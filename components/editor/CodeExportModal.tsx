'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2, Terminal, ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose, code }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {t('codeModalTitle')} (<code className="text-indigo-300 font-mono text-xs">main.py</code>)
              </h3>
              <p className="text-xs text-slate-400">{t('codeModalSub')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Code Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto selection:bg-indigo-500 selection:text-white">
            <code>{code}</code>
          </pre>
        </div>

        {/* Local Execution Instructions */}
        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>
              {t('runCommandLabel')} <code className="text-slate-200 bg-slate-800 px-2 py-0.5 rounded font-mono">pip install crewai crewai-tools && python main.py</code>
            </span>
          </div>
          <a
            href="https://docs.crewai.com"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
          >
            CrewAI Docs <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Recommended Server & Cloud Infrastructure (Affiliate Section) */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('readyToDeployTitle')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            {/* Cloudways Managed Cloud */}
            <a
              href="https://www.cloudways.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-600/60 hover:bg-slate-900 transition flex flex-col gap-0.5 group shadow-sm"
            >
              <span className="font-semibold text-indigo-300 group-hover:underline flex items-center justify-between">
                Cloudways <ExternalLink className="w-2.5 h-2.5" />
              </span>
              <span className="text-slate-400 text-[10px] truncate">{t('cloudwaysSub')}</span>
            </a>

            {/* ConoHa VPS (Japan) */}
            <a
              href="https://www.conoha.jp/vps/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-600/60 hover:bg-slate-900 transition flex flex-col gap-0.5 group shadow-sm"
            >
              <span className="font-semibold text-indigo-300 group-hover:underline flex items-center justify-between">
                ConoHa VPS <ExternalLink className="w-2.5 h-2.5" />
              </span>
              <span className="text-slate-400 text-[10px] truncate">{t('conohaSub')}</span>
            </a>

            {/* Hetzner Cloud VPS */}
            <a
              href="https://www.hetzner.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-600/60 hover:bg-slate-900 transition flex flex-col gap-0.5 group shadow-sm"
            >
              <span className="font-semibold text-indigo-300 group-hover:underline flex items-center justify-between">
                Hetzner Cloud <ExternalLink className="w-2.5 h-2.5" />
              </span>
              <span className="text-slate-400 text-[10px] truncate">{t('hetznerSub')}</span>
            </a>

            {/* DigitalOcean */}
            <a
              href="https://www.digitalocean.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-600/60 hover:bg-slate-900 transition flex flex-col gap-0.5 group shadow-sm"
            >
              <span className="font-semibold text-indigo-300 group-hover:underline flex items-center justify-between">
                DigitalOcean <ExternalLink className="w-2.5 h-2.5" />
              </span>
              <span className="text-slate-400 text-[10px] truncate">{t('digitalOceanSub')}</span>
            </a>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>{t('copyCode')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadPy')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
