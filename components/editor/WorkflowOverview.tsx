'use client';

import Link from 'next/link';
import { Braces, FileCode2, LayoutTemplate, PenTool, Upload } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';
import type { CrewConfig } from '@/types/editor';
import type { UnifiedPreflightReadModel } from '@/types/unified-preflight';
import { PreflightActivationPrompt } from '@/components/editor/unified-preflight/PreflightActivationPrompt';

export type PresentationOrigin = 'example' | 'template' | 'crewai_python' | 'agentgraph_json' | 'manual' | 'existing_browser_workflow';

interface Props {
  lang: Language; origin: PresentationOrigin; crewConfig: CrewConfig; agentCount: number; taskCount: number; toolCount: number;
  preflight: UnifiedPreflightReadModel; hasMappingReport: boolean; onCrewAI: () => void; onJson: () => void; onDesign: () => void;
  onPreflight: (trigger: HTMLButtonElement, source: 'entry' | 'activation_prompt') => void; onMappingReport: () => void;
  activationPromptVisible: boolean; onActivationPromptShown: () => void; onDismissActivationPrompt: () => void;
}

export function WorkflowOverview(props: Props) {
  const ja = props.lang === 'ja';
  const origin = {
    example: ja ? 'Exampleワークフロー' : 'Example workflow', template: ja ? 'Template' : 'Template', crewai_python: 'CrewAI Python · Supported subset · Mapping Ready',
    agentgraph_json: 'AgentGraph JSON', manual: ja ? 'Manual Design' : 'Manual Design', existing_browser_workflow: ja ? '現在のブラウザワークフロー' : 'Current browser workflow',
  }[props.origin];
  const cards = [
    { title: 'CrewAI Python', body: ja ? '対応する直接コンストラクターのサブセット。静的解析のみで、Pythonは実行しません。' : 'Supported direct-constructor subset. Static analysis only; Python is not executed.', icon: FileCode2, action: props.onCrewAI },
    { title: 'AgentGraph JSON', body: ja ? 'ポータブルなAgentGraphワークフロー成果物を開きます。' : 'Open a portable AgentGraph workflow artifact.', icon: Braces, action: props.onJson },
    { title: ja ? 'Example / Template' : 'Example / Template', body: ja ? '読み込み済みのExampleを確認するか、既存のスターターテンプレートを選びます。' : 'Review the loaded example or choose an existing starter template.', icon: LayoutTemplate, href: '/templates' },
    { title: 'Manual Design', body: ja ? 'DesignでAgent、Task、Toolを手動で追加・接続します。' : 'Use Design to add and connect Agent, Task, and Tool nodes manually.', icon: PenTool, action: props.onDesign },
  ];
  return <main className="min-h-0 flex-1 overflow-y-auto" aria-labelledby="overview-heading">
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">CrewAI-first today · AgentGraph JSON portable artifact</p>
      <h1 id="overview-heading" tabIndex={-1} className="mt-3 text-3xl font-black tracking-tight text-white focus:outline-none sm:text-5xl">{ja ? '実行する前に、ワークフローを理解する。' : 'Understand the workflow before you run it.'}</h1>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">{ja ? '対応するCrewAIソース、AgentGraph JSON、Example、またはManual Designから始めます。決定論的なReadiness・実行構造・リソース上の含意を確認し、手動で改善し、再評価して、所有できる形式でエクスポートします。' : 'Bring a supported CrewAI source, AgentGraph JSON, an example, or a manual design. Review deterministic readiness, execution structure, and resource implications; improve the workflow manually; verify again; export what you own.'}</p>

      <section className="mt-8 rounded-3xl border border-indigo-800/60 bg-gradient-to-br from-indigo-950/70 to-slate-900 p-5" aria-labelledby="artifact-heading">
        {props.activationPromptVisible ? <div className="mb-5"><PreflightActivationPrompt lang={props.lang} onReview={(trigger) => props.onPreflight(trigger, 'activation_prompt')} onDismiss={props.onDismissActivationPrompt} onShown={props.onActivationPromptShown} /></div> : null}
        <div className="flex flex-col justify-between gap-5 md:flex-row"><div><p className="text-xs font-bold uppercase tracking-wide text-indigo-300">{origin}</p><h2 id="artifact-heading" className="mt-2 text-2xl font-bold text-white">{props.crewConfig.name}</h2><p className="mt-2 text-sm text-slate-300">Agents {props.agentCount} · Tasks {props.taskCount} · Tools {props.toolCount} · Process {props.crewConfig.process}</p>{props.origin === 'existing_browser_workflow' ? <p className="mt-2 text-xs text-slate-500">{ja ? '元のソースは現在のGraph成果物には保持されていません。' : 'Original source is not retained in the current Graph artifact.'}</p> : null}{props.hasMappingReport ? <button type="button" onClick={props.onMappingReport} className="mt-3 min-h-11 text-xs font-bold text-violet-300 underline">{ja ? 'マッピングレポートを表示' : 'View mapping report'}</button> : null}</div>
          <div className="flex flex-wrap items-start gap-2"><button type="button" onClick={(event) => props.onPreflight(event.currentTarget, 'entry')} className="min-h-11 rounded-xl bg-indigo-500 px-5 text-sm font-extrabold text-white hover:bg-indigo-400">{ja ? 'Preflightを確認' : 'Run Preflight'}</button><button type="button" onClick={props.onDesign} className="min-h-11 rounded-xl border border-slate-600 px-5 text-sm font-bold text-white hover:bg-slate-800">{ja ? 'Designを開く' : 'Open Design'}</button></div></div>
        <div className="mt-5 border-t border-slate-700/70 pt-4"><span className="rounded-full border border-teal-700/60 bg-teal-950/40 px-3 py-1 text-xs font-bold text-teal-200">Deterministic · Static · {props.preflight.state}</span><p className="mt-3 text-xs leading-6 text-slate-400">{ja ? 'Preflightは静的かつ決定論的です。ワークフローの実行やシミュレーションは行わず、実行時の挙動はここでは観測されません。' : 'Preflight is static and deterministic. It does not execute or simulate the workflow, and runtime behavior is not observed here.'}</p></div>
      </section>

      <section className="mt-10" aria-labelledby="entry-heading"><h2 id="entry-heading" className="text-xl font-bold text-white">{ja ? '手元のものから始める' : 'Start from what you have'}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({ title, body, icon: Icon, action, href }) => { const content = <><Icon className="h-5 w-5 text-indigo-300" aria-hidden="true" /><h3 className="mt-3 font-bold text-white">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{body}</p></>; return href ? <Link key={title} href={href} className="min-h-44 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">{content}</Link> : <button key={title} type="button" data-crewai-entry={title === 'CrewAI Python' ? true : undefined} onClick={action} className="min-h-44 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left hover:border-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">{content}</button>; })}</div></section>
      <footer className="mt-10 border-t border-slate-800 py-6 text-xs text-slate-500"><a href="https://www.buymeacoffee.com/agentgraph" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-amber-300"><Upload className="h-4 w-4" />{ja ? 'AgentGraph Studioの開発を支援' : 'Support AgentGraph Studio development'}</a></footer>
    </div>
  </main>;
}
