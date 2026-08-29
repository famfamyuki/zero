"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  X,
} from "lucide-react";
import type { CrewAIImportResult } from "@/types/crewai-import";

interface Props {
  result: CrewAIImportResult;
  lang: "en" | "ja";
  replacing: boolean;
  onClose: () => void;
  onApply: () => void;
}
const copy = {
  en: {
    title: "CrewAI Static Import",
    description:
      "Review the supported-subset mapping before changing your canvas.",
    trust: "Static analysis only — your Python code is not executed",
    subset: "CrewAI Python direct constructors — supported subset",
    version: "CrewAI runtime version: Unknown (not detected)",
    provenance:
      "Import diagnostics/provenance are session-only and are not saved with the workflow in this v0.",
    blocking: "Blocking issues",
    info: "Warnings / information",
    cancel: "Cancel",
    apply: "Apply import",
    replace: "Replace workflow",
    disabled: "Apply is unavailable until every material issue is resolved.",
    proposed: "Proposed graph",
    file: "File",
    mapped: "Mapped",
    inferred: "Inferred",
    lossy: "Lossy",
    unknown: "Unknown",
    unsupported: "Unsupported",
    adapter: "Adapter",
    mapping: "mapping",
    ready: "Ready",
    blocked: "Blocked",
    location: "Source provenance",
    status: { MAPPED: "Mapped", MAPPED_WITH_INFERENCE: "Inferred", LOSSY: "Lossy", UNKNOWN: "Unknown", UNSUPPORTED: "Unsupported" },
  },
  ja: {
    title: "CrewAI 静的インポート",
    description:
      "キャンバスを変更する前に、対応範囲のマッピングを確認してください。",
    trust: "静的解析のみ — Pythonコードは実行されません",
    subset: "CrewAI Python 直接コンストラクター — 対応サブセット",
    version: "CrewAIランタイムバージョン: 不明（未検出）",
    provenance:
      "インポート診断と出典情報はセッション限定で、このv0ではワークフローに保存されません。",
    blocking: "ブロッキング項目",
    info: "警告 / 情報",
    cancel: "キャンセル",
    apply: "インポートを適用",
    replace: "ワークフローを置換",
    disabled: "すべての重大な問題が解決するまで適用できません。",
    proposed: "提案グラフ",
    file: "ファイル",
    mapped: "マッピング済み",
    inferred: "推定",
    lossy: "欠損あり",
    unknown: "不明",
    unsupported: "未対応",
    adapter: "アダプター",
    mapping: "マッピング",
    ready: "準備完了",
    blocked: "適用不可",
    location: "ソースの出典情報",
    status: { MAPPED: "マッピング済み", MAPPED_WITH_INFERENCE: "推定", LOSSY: "欠損あり", UNKNOWN: "不明", UNSUPPORTED: "未対応" },
  },
};

export function CrewAIImportReview({
  result,
  lang,
  replacing,
  onClose,
  onApply,
}: Props) {
  const c = copy[lang],
    dialog = useRef<HTMLDivElement>(null),
    close = useRef<HTMLButtonElement>(null),
    [expanded, setExpanded] = useState<Set<number>>(new Set());
  useEffect(() => {
    close.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && dialog.current) {
        const focusable = Array.from(
          dialog.current.querySelectorAll<HTMLElement>(
            "button:not([disabled])",
          ),
        );
        if (!focusable.length) return;
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);
  const blocking = result.report.diagnostics.filter((d) => d.blocking),
    info = result.report.diagnostics.filter((d) => !d.blocking);
  const counts = result.graph
    ? {
        agents: result.graph.nodes.filter((n) => n.type === "agent").length,
        tasks: result.graph.nodes.filter((n) => n.type === "task").length,
        tools: result.graph.nodes.filter((n) => n.type === "tool").length,
      }
    : null;
  const list = (items: typeof blocking, offset: number) => (
    <ul className="space-y-2">
      {items.map((d, i) => {
        const index = offset + i,
          open = expanded.has(index),
          loc = d.source;
        return (
          <li
            key={`${d.code}-${i}`}
            className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 min-w-0"
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[11px] font-bold uppercase text-slate-300">
                {c.status[d.status]}
              </span>
              <code className="min-w-0 break-all text-xs text-slate-200">
                {d.code}
              </code>
              {loc && (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setExpanded((s) => {
                      const n = new Set(s);
                      n.has(index) ? n.delete(index) : n.add(index);
                      return n;
                    })
                  }
                  className="ml-auto min-h-11 min-w-11 rounded-lg p-2 text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  title={c.location}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
            {open && loc && (
              <div className="mt-2 break-words text-xs text-slate-400">
                {loc.file}
                {loc.line ? `:${loc.line}:${loc.column || 1}` : ""}
                {loc.symbol ? ` · ${loc.symbol}` : ""}
                <br />
                {result.report.adapterId} {result.report.adapterVersion} ·
                {c.mapping} {result.report.mappingRuleVersion}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-0 sm:p-4"
      role="presentation"
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crewai-import-title"
        aria-describedby="crewai-import-description"
        className="flex h-[100dvh] w-full min-w-0 flex-col overflow-hidden bg-slate-900 shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:max-w-3xl sm:rounded-2xl sm:border sm:border-slate-700"
      >
        <header className="flex items-start gap-3 border-b border-slate-700 p-4">
          <div className="min-w-0 flex-1">
            <h2
              id="crewai-import-title"
              className="text-lg font-extrabold text-white"
            >
              {c.title}
            </h2>
            <p
              id="crewai-import-description"
              className="mt-1 text-sm text-slate-400"
            >
              {c.description}
            </p>
          </div>
          <button
            ref={close}
            type="button"
            onClick={onClose}
            aria-label={c.cancel}
            className="min-h-11 min-w-11 rounded-lg p-2 text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
          <div className="rounded-xl border border-emerald-700/60 bg-emerald-950/40 p-3 text-sm text-emerald-200">
            <ShieldCheck className="mr-2 inline h-4 w-4" />
            {c.trust}
          </div>
          <p className="mt-3 text-sm font-semibold text-indigo-200">
            {c.subset}
          </p>
          <dl className="mt-3 grid min-w-0 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">{c.file}</dt>
              <dd
                className="break-all text-slate-200"
                title={result.report.sourceFile}
              >
                {result.report.sourceFile}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">{c.adapter}</dt>
              <dd className="text-slate-200">
                {result.report.adapterId} · {result.report.adapterVersion}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-slate-400">{c.version}</p>
          {counts && (
            <p className="mt-3 text-sm text-slate-300">
              {c.proposed}: {counts.agents} Agent · {counts.tasks} Task ·{" "}
              {counts.tools} Tool
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-5">
            {[
              [c.mapped, result.report.summary.mapped],
              [c.inferred, result.report.summary.mappedWithInference],
              [c.lossy, result.report.summary.lossy],
              [c.unknown, result.report.summary.unknown],
              [c.unsupported, result.report.summary.unsupported],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-lg border border-slate-700 p-2"
              >
                <strong className="block text-base text-white">{value}</strong>
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
          <div
            aria-live="polite"
            className={`mt-4 flex items-center gap-2 rounded-xl border p-3 text-sm ${result.state === "READY" ? "border-emerald-700 text-emerald-200" : "border-red-800 text-red-200"}`}
          >
            {result.state === "READY" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {result.state === "READY" ? c.ready : c.blocked}
            {result.state === "BLOCKED"
              ? ` — ${blocking.length} ${c.blocking}`
              : ""}
          </div>
          {blocking.length > 0 && (
            <section className="mt-4">
              <h3 className="mb-2 font-bold text-red-200">{c.blocking}</h3>
              {list(blocking, 0)}
            </section>
          )}
          {info.length > 0 && (
            <section className="mt-4">
              <h3 className="mb-2 font-bold text-slate-200">{c.info}</h3>
              {list(info, blocking.length)}
            </section>
          )}
          <p className="mt-4 rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-slate-400">
            {c.provenance}
          </p>
        </div>
        <footer className="flex items-center justify-end gap-3 border-t border-slate-700 bg-slate-900 p-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg px-4 text-sm font-bold text-slate-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {c.cancel}
          </button>
          <button
            type="button"
            disabled={result.state !== "READY"}
            title={result.state !== "READY" ? c.disabled : undefined}
            onClick={onApply}
            className="min-h-11 rounded-lg bg-indigo-600 px-4 text-sm font-extrabold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {replacing ? c.replace : c.apply}
          </button>
        </footer>
      </div>
    </div>
  );
}
