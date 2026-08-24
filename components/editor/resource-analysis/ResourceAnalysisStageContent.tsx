'use client';

import { RefreshCw } from 'lucide-react';
import type { ResourceAnalysisState } from '@/hooks/useResourceAnalysis';
import type { Language } from '@/lib/i18n/translations';
import { translations } from '@/lib/i18n/translations';
import type {
  ResourceAnalysisGuardValue,
  ResourceAnalysisHotspot,
  ResourceAnalysisTarget,
  ResourceAnalysisUnknown,
} from '@/types/resource-analysis';

export interface ResourceAnalysisLocateContext {
  readonly source: 'hotspot';
  readonly hotspotKind: ResourceAnalysisHotspot['kind'];
}

interface ResourceAnalysisStageContentProps {
  state: ResourceAnalysisState | null;
  isRefreshing: boolean;
  lang: Language;
  notice: string | null;
  onRetry: () => void;
  onOpenValidation: () => void;
  onLocate: (target: ResourceAnalysisTarget, context: ResourceAnalysisLocateContext) => boolean;
}

const sectionClass = 'mt-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-4';
const actionClass = 'min-h-11 min-w-11 rounded-lg border border-violet-700 px-3 text-xs font-bold text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300';

export function ResourceAnalysisStageContent({ state, isRefreshing, lang, notice, onRetry, onOpenValidation, onLocate }: ResourceAnalysisStageContentProps) {
  const copy = translations[lang];
  const result = state?.status === 'available' ? state.result : null;
  const locate = (hotspot: ResourceAnalysisHotspot) => {
    onLocate(hotspot.target, { source: 'hotspot', hotspotKind: hotspot.kind });
  };
  const guard = (item: ResourceAnalysisGuardValue) => item.value === null
    ? copy.resourceAnalysisNotConfigured
    : `${item.value} · ${item.source === 'configured' ? copy.resourceAnalysisConfigured : copy.resourceAnalysisCodegenDefault}`;
  const hotspotLabel = (kind: ResourceAnalysisHotspot['kind']) => ({
    dependency_depth: copy.resourceAnalysisHotspotDependency,
    context_fan_in: copy.resourceAnalysisHotspotContext,
    tool_binding_concentration: copy.resourceAnalysisHotspotTool,
  })[kind];
  const unknownLabel = (code: ResourceAnalysisUnknown['code']) => ({
    runtime_cost: copy.resourceAnalysisUnknownRuntimeCost,
    runtime_latency: copy.resourceAnalysisUnknownRuntimeLatency,
    token_consumption: copy.resourceAnalysisUnknownTokens,
    tool_invocation_count: copy.resourceAnalysisUnknownToolCalls,
    tool_execution_duration: copy.resourceAnalysisUnknownToolDuration,
    actual_iteration_count: copy.resourceAnalysisUnknownIterations,
    manager_runtime_assignment: copy.resourceAnalysisUnknownManagerAssignment,
  })[code];

  return <>
  <div aria-live="polite">
    {notice ? <p role="status" className="mb-3 rounded-lg bg-violet-950/70 p-3 text-xs text-violet-100">{notice}</p> : null}
    {isRefreshing ? <section className="flex min-h-40 items-center justify-center gap-2 text-sm text-violet-200"><RefreshCw className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />{copy.resourceAnalysisUpdating}</section> : null}
  </div>

  {!isRefreshing && state?.status === 'empty' ? <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4"><h3 className="font-bold text-white">{copy.resourceAnalysisEmptyTitle}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{copy.resourceAnalysisEmptyBody}</p></section> : null}
  {!isRefreshing && state?.status === 'invalid' ? <section className="rounded-2xl border border-amber-700/60 bg-amber-950/20 p-4"><h3 className="font-bold text-amber-100">{copy.resourceAnalysisInvalidTitle}</h3><p className="mt-2 text-xs leading-relaxed text-slate-300">{copy.resourceAnalysisInvalidBody}</p><ul className="mt-3 list-disc pl-5 font-mono text-[11px] text-slate-400">{state.blockingCodes.map((code) => <li key={code}>{code}</li>)}</ul><button type="button" onClick={onOpenValidation} className="mt-4 min-h-11 min-w-11 rounded-lg bg-indigo-500 px-4 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">{copy.resourceAnalysisOpenValidation}</button></section> : null}
  {!isRefreshing && state?.status === 'unavailable' ? <section className="rounded-2xl border border-orange-700/60 bg-orange-950/20 p-4"><h3 className="font-bold text-orange-100">{copy.resourceAnalysisUnavailableTitle}</h3><p className="mt-2 text-xs leading-relaxed text-slate-300">{copy.resourceAnalysisUnavailableBody}</p><button type="button" onClick={onRetry} className="mt-4 min-h-11 min-w-11 rounded-lg bg-orange-500 px-4 text-xs font-bold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200">{copy.resourceAnalysisRetry}</button></section> : null}

  {!isRefreshing && result ? <>
    <section className="rounded-2xl border border-violet-900/70 bg-violet-950/20 p-4"><h3 className="text-sm font-bold text-violet-100">{copy.resourceAnalysisOverview}</h3><dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
      {[[copy.resourceAnalysisProcess, result.process === 'sequential' ? copy.processSequential : copy.processHierarchical], [copy.resourceAnalysisAgents, result.summary.agentCount], [copy.resourceAnalysisTasks, result.summary.taskCount], [copy.resourceAnalysisTools, result.summary.toolCount], [copy.resourceAnalysisExecutionSteps, result.summary.executionStepCount], [copy.resourceAnalysisUniqueModels, result.summary.uniqueModelCount]].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="font-bold text-white">{value}</dd></div>)}
    </dl></section>

    <section className={sectionClass}><h3 className="text-sm font-bold text-white">{copy.resourceAnalysisStructuralMetrics}</h3><dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
      {[[copy.resourceAnalysisDependencyDepth, result.summary.dependencyDepth], [copy.resourceAnalysisContextFanIn, result.summary.maxContextFanIn], [copy.resourceAnalysisAsyncTasks, result.summary.asyncTaskCount], [copy.resourceAnalysisFixedAssignments, result.summary.fixedAssignmentCount], [copy.resourceAnalysisManagerAssignments, result.summary.managerDelegatedTaskCount], [copy.resourceAnalysisAgentBindings, result.summary.agentToolBindingCount], [copy.resourceAnalysisTaskBindings, result.summary.taskToolBindingCount]].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="font-bold text-white">{value}</dd></div>)}
    </dl></section>

    <section className={sectionClass}><h3 className="text-sm font-bold text-white">{copy.resourceAnalysisHotspots}</h3>{result.hotspots.length ? <ul className="mt-3 space-y-3">{result.hotspots.map((item, index) => <li key={`${item.kind}-${item.target.type}-${'id' in item.target ? item.target.id : 'crew'}-${index}`} className="rounded-xl bg-slate-950/80 p-3"><p className="text-xs font-bold text-slate-100">{hotspotLabel(item.kind)}</p><p className="mt-1 text-[11px] text-slate-400">{copy.resourceAnalysisValue}: <span className="font-bold text-violet-200">{item.value}</span></p><button type="button" onClick={() => locate(item)} className={`mt-2 ${actionClass}`}>{copy.resourceAnalysisLocate}</button></li>)}</ul> : <p className="mt-2 text-xs leading-relaxed text-slate-400">{copy.resourceAnalysisNoHotspots}</p>}</section>

    <section className={sectionClass}><h3 className="text-sm font-bold text-white">{copy.resourceAnalysisModels}</h3><div className="mt-3 space-y-3">{result.models.map((model) => <article key={model.model} className="rounded-xl bg-slate-950/80 p-3 text-xs"><p className="text-[10px] uppercase text-slate-500">{copy.resourceAnalysisModelId}</p><p className="break-all font-mono text-violet-200 [overflow-wrap:anywhere]">{model.model}</p><dl className="mt-2 grid grid-cols-2 gap-2"><div><dt className="text-slate-500">{copy.resourceAnalysisAgentCount}</dt><dd className="text-white">{model.agentCount}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisReferenceCount}</dt><dd className="text-white">{model.referenceCount}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisUsedByManager}</dt><dd className="text-white">{model.usedByManager ? copy.resourceAnalysisYes : copy.resourceAnalysisNo}</dd></div></dl><p className="mt-2 text-slate-500">{copy.resourceAnalysisAgentReferences}</p><ul className="mt-1 text-slate-300">{model.agents.length ? model.agents.map((agent) => <li key={agent.agentId}>{agent.label} · {agent.role}</li>) : <li>{copy.resourceAnalysisNone}</li>}</ul></article>)}</div></section>

    {result.manager ? <section className={sectionClass}><h3 className="text-sm font-bold text-white">{copy.resourceAnalysisManager}</h3><p className="mt-2 break-all font-mono text-xs text-violet-200 [overflow-wrap:anywhere]">{result.manager.model}</p></section> : null}

    <section className={sectionClass}><h3 className="text-sm font-bold text-white">{copy.resourceAnalysisExecutionGuards}</h3><div className="mt-3 space-y-3">{result.agentGuards.map((profile) => <article key={profile.agent.agentId} className="rounded-xl bg-slate-950/80 p-3"><h4 className="text-xs font-bold text-white">{profile.agent.label}</h4><p className="text-[11px] text-slate-400">{profile.agent.role}</p><dl className="mt-2 space-y-2 text-xs"><div><dt className="text-slate-500">{copy.resourceAnalysisMaxIterations}</dt><dd className="text-slate-200">{guard(profile.maxIter)}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisMaxRpm}</dt><dd className="text-slate-200">{guard(profile.maxRpm)}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisMaxExecutionTime}</dt><dd className="text-slate-200">{guard(profile.maxExecutionTime)}</dd></div></dl></article>)}</div></section>

    <details className={sectionClass}><summary className="cursor-pointer text-sm font-bold text-white">{copy.resourceAnalysisTaskMetrics}</summary><div className="mt-3 space-y-3">{result.tasks.map((profile) => <article key={profile.task.taskId} className="rounded-xl bg-slate-950/80 p-3 text-xs"><h3 className="font-bold text-white">{profile.task.label}</h3><dl className="mt-2 grid grid-cols-2 gap-2"><div><dt className="text-slate-500">{copy.resourceAnalysisPlanOrder}</dt><dd>{profile.task.planOrder}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisDependencyDepth}</dt><dd>{profile.dependencyDepth}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisDirectFanIn}</dt><dd>{profile.contextFanIn}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisAsyncConfigured}</dt><dd>{profile.asyncConfigured ? copy.resourceAnalysisYes : copy.resourceAnalysisNo}</dd></div></dl><p className="mt-2 text-slate-500">{copy.resourceAnalysisAssignment}</p>{profile.assignment.kind === 'fixed' ? <p className="text-slate-200">{copy.resourceAnalysisFixedAssignment}: {profile.assignment.agent.label} · {profile.assignment.agent.role}</p> : <><p className="text-slate-200">{copy.resourceAnalysisManagerDelegated}</p>{profile.assignment.configuredAgent ? <p className="text-slate-400">{copy.resourceAnalysisConfiguredAgent}: {profile.assignment.configuredAgent.label} · {profile.assignment.configuredAgent.role}</p> : null}</>}<p className="mt-2 text-slate-500">{copy.resourceAnalysisDirectTools}</p><p className="text-slate-200">{profile.directTools.length ? profile.directTools.map((tool) => `${tool.label} · ${tool.toolType}`).join(', ') : copy.resourceAnalysisNone}</p></article>)}</div></details>

    <details className={sectionClass}><summary className="cursor-pointer text-sm font-bold text-white">{copy.resourceAnalysisToolBindings}</summary><div className="mt-3 space-y-3">{result.toolBindings.map((profile) => <article key={profile.tool.toolId} className="rounded-xl bg-slate-950/80 p-3 text-xs"><h3 className="font-bold text-white">{profile.tool.label}</h3><p className="text-[11px] text-violet-200">{profile.tool.toolType}</p><dl className="mt-2 grid grid-cols-3 gap-2"><div><dt className="text-slate-500">{copy.resourceAnalysisAgentBindingCount}</dt><dd>{profile.agentBindingCount}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisTaskBindingCount}</dt><dd>{profile.taskBindingCount}</dd></div><div><dt className="text-slate-500">{copy.resourceAnalysisTotalBindingCount}</dt><dd>{profile.totalBindingCount}</dd></div></dl><p className="mt-2 text-slate-500">{copy.resourceAnalysisBoundAgents}</p><p>{profile.agentBindings.length ? profile.agentBindings.map((agent) => agent.label).join(', ') : copy.resourceAnalysisNone}</p><p className="mt-2 text-slate-500">{copy.resourceAnalysisBoundTasks}</p><p>{profile.taskBindings.length ? profile.taskBindings.map((task) => task.label).join(', ') : copy.resourceAnalysisNone}</p></article>)}</div></details>

    <section className={sectionClass}><h3 className="text-sm font-bold text-white">{copy.resourceAnalysisRuntimeUnknowns}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{copy.resourceAnalysisUnknownsNote}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-300">{result.unknowns.map((item) => <li key={item.code}>{unknownLabel(item.code)}</li>)}</ul></section>
    <footer className="mt-4 text-[10px] text-slate-600">Resource Analysis {result.version}</footer>
  </> : null}

  </>;
}

