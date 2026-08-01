'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2, Terminal, ExternalLink, Sparkles, Rocket } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose, code }) => {
  const { lang, t } = useLanguage();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90dvh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {t('codeModalTitle')} (<code className="text-emerald-300 font-mono text-xs">main.py</code>)
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto selection:bg-emerald-500 selection:text-white">
            <code>{code}</code>
          </pre>
        </div>

        {/* Local Execution Instructions */}
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {t('runCommandLabel')} <code className="text-slate-200 bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">pip install crewai crewai-tools && python main.py</code>
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

        {/* High-Conversion ConoHa VPS Production Affiliate Banner */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border-t border-emerald-800/50 space-y-2.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-200">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span className="text-emerald-300 font-bold">{t('readyToDeployTitle')}</span>
            </div>
            <span className="text-[10px] font-extrabold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-md uppercase tracking-wider">
              24/7 Auto Execution
            </span>
          </div>

          {/* ConoHa VPS Exclusive CTA Button Banner */}
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4B8DGU+BIDPTE+50+4YQJIQ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/80 hover:border-emerald-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group shadow-2xl shadow-emerald-500/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shrink-0 font-extrabold shadow-inner">
                <Rocket className="w-5 h-5 text-emerald-400 animate-bounce" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-emerald-200 group-hover:text-white transition flex items-center gap-1.5">
                  {t('conohaTitle')} <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
                </span>
                <span className="text-slate-300 text-xs block mt-0.5 leading-normal">
                  {t('conohaSub')}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-300 text-slate-950 font-extrabold text-xs transition shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40">
              <span>{t('conohaCtaBtn')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
            </div>
          </a>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadPy')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
