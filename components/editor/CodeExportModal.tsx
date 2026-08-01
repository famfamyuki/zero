'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Code2, Terminal, ExternalLink, Sparkles, Rocket, FileText, BookOpen, Layers } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

type ExportTab = 'code' | 'requirements' | 'readme';

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose, code }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ExportTab>('code');
  const [copied, setCopied] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

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

  if (!isOpen) return null;

  const requirementsTxt = `# Dependencies for CrewAI Execution
crewai>=0.28.0
crewai-tools>=0.1.0
langchain-openai>=0.1.0
python-dotenv>=1.0.0
pydantic>=2.0.0
`;

  const readmeMdJa = `# 🚀 CrewAI AIエージェント 24時間自動実行ガイド (ConoHa VPS)

AgentGraph Studio で生成された CrewAI ワークフローを、定額・高速通信の ConoHa VPS 上で24時間ノンストップ連続稼働させるための完全ガイドです。

---

## 1. サーバー環境の初期セットアップ
ConoHa VPS (Ubuntu / Debian) に SSH 接続し、Python と仮想環境パッケージをインストールします:

\`\`\`bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip
\`\`\`

## 2. プロジェクトの作成と仮想環境構築
\`\`\`bash
mkdir -p ~/crewai-agent && cd ~/crewai-agent
python3 -m venv venv
source venv/bin/activate
\`\`\`

## 3. 依存ライブラリのインストール
作成した \`requirements.txt\` をディレクトリに配置し、以下を実行します:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## 4. APIキー（環境変数）の設定
\`.env\` ファイルを作成し、必要なAPIキーを設定します:

\`\`\`env
OPENAI_API_KEY=your_openai_api_key_here
SERPER_API_KEY=your_serper_api_key_here
\`\`\`

## 5. エージェントの実行
\`\`\`bash
python main.py
\`\`\`

## 6. 24時間常時バックグラウンド稼働 (nohup)
SSHを切っても24時間自動稼働を継続させるコマンド:

\`\`\`bash
nohup python main.py > agent.log 2>&1 &
\`\`\`
ログ確認: \`tail -f agent.log\`
`;

  const readmeMdEn = `# 🚀 CrewAI Agent 24/7 Deployment Guide (ConoHa VPS)

Complete guide for deploying and running your AgentGraph Studio CrewAI workflows continuously 24/7 on a Linux server / ConoHa VPS.

---

## 1. Server Environment Setup
Connect to your ConoHa VPS via SSH and install Python 3.10+ and venv:

\`\`\`bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip
\`\`\`

## 2. Project Directory & Virtual Environment
\`\`\`bash
mkdir -p ~/crewai-agent && cd ~/crewai-agent
python3 -m venv venv
source venv/bin/activate
\`\`\`

## 3. Install Dependencies
Save \`requirements.txt\` to the folder and run:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## 4. Configure Environment Variables (.env)
Create a \`.env\` file with your API keys:

\`\`\`env
OPENAI_API_KEY=your_openai_api_key_here
SERPER_API_KEY=your_serper_api_key_here
\`\`\`

## 5. Execute Agent Workflow
\`\`\`bash
python main.py
\`\`\`

## 6. 24/7 Continuous Background Execution (nohup)
To keep the agent running even after closing SSH:

\`\`\`bash
nohup python main.py > agent.log 2>&1 &
\`\`\`
Check logs: \`tail -f agent.log\`
`;

  const getActiveTabContent = () => {
    if (activeTab === 'code') return code;
    if (activeTab === 'requirements') return requirementsTxt;
    return lang === 'ja' ? readmeMdJa : readmeMdEn;
  };

  const getActiveTabFilename = () => {
    if (activeTab === 'code') return 'main.py';
    if (activeTab === 'requirements') return 'requirements.txt';
    return 'README.md';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveTabContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getActiveTabContent();
    const filename = getActiveTabFilename();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Main Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90dvh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Modal Header with Clear ✕ Close Button */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {t('codeModalTitle')} (<code className="text-emerald-300 font-mono text-xs">{getActiveTabFilename()}</code>)
              </h3>
              <p className="text-xs text-slate-400">{t('codeModalSub')}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-colors border border-transparent hover:border-slate-700 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Tabs Bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Agent Code (main.py)</span>
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dependencies (requirements.txt)</span>
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'readme'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>VPS Setup Guide (README.md)</span>
          </button>
        </div>

        {/* Modal Body - Tab Code / Doc Viewer */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto selection:bg-emerald-500 selection:text-white">
            <code>{getActiveTabContent()}</code>
          </pre>
        </div>

        {/* Local Execution Instructions */}
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {t('runCommandLabel')} <code className="text-slate-200 bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">pip install -r requirements.txt && python main.py</code>
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

        {/* Dismissable High-Conversion ConoHa VPS Affiliate Banner */}
        {isBannerVisible && (
          <div className="relative px-5 py-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border-t border-emerald-800/50 space-y-2.5 text-xs transition-all">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="text-emerald-300 font-bold">{t('readyToDeployTitle')}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[10px] font-extrabold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-md uppercase tracking-wider">
                  24/7 Auto Execution
                </span>
                
                {/* Banner Dismiss Button */}
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
        )}

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            File: <strong className="text-emerald-300">{getActiveTabFilename()}</strong>
          </span>

          <div className="flex items-center gap-2">
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
                  <span>{t('copyCode')} ({getActiveTabFilename()})</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download {getActiveTabFilename()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
