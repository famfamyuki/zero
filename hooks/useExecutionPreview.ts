'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GraphData } from '@/types/editor';
import type { ExecutionPreviewReadModel } from '@/types/execution-preview';
import { validateGraph } from '@/lib/transpiler/validation';
import { createSemanticPlan } from '@/lib/transpiler/semantic-plan';
import { createExecutionPreviewReadModel } from '@/lib/execution-preview';

export type ExecutionPreviewState =
  | { status: 'available'; result: ExecutionPreviewReadModel; blockingCodes: readonly []; error: null }
  | { status: 'empty'; result: null; blockingCodes: readonly []; error: null }
  | { status: 'invalid'; result: null; blockingCodes: readonly string[]; error: null }
  | { status: 'error'; result: null; blockingCodes: readonly []; error: Error };

function evaluate(graph: GraphData): ExecutionPreviewState {
  if (graph.nodes.length === 0 && graph.edges.length === 0) {
    return { status: 'empty', result: null, blockingCodes: [], error: null };
  }
  try {
    const validation = validateGraph(graph.nodes, graph.edges, graph.crewConfig, 'scaffold');
    if (!validation.isValid) {
      return { status: 'invalid', result: null, blockingCodes: validation.errors.map((issue) => issue.code), error: null };
    }
    const plan = createSemanticPlan(graph.nodes, graph.edges, graph.crewConfig, validation);
    return { status: 'available', result: createExecutionPreviewReadModel(plan), blockingCodes: [], error: null };
  } catch (cause) {
    return { status: 'error', result: null, blockingCodes: [], error: cause instanceof Error ? cause : new Error('Execution Preview failed') };
  }
}

export function useExecutionPreview(graph: GraphData) {
  const latestGraph = useRef(graph);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const [state, setState] = useState<ExecutionPreviewState>(() => evaluate(graph));
  const [isRefreshing, setIsRefreshing] = useState(false);
  latestGraph.current = graph;

  const run = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const next = evaluate(latestGraph.current);
    setState(next);
    setIsRefreshing(false);
    return next;
  }, []);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (timer.current) clearTimeout(timer.current);
    setState({ status: 'empty', result: null, blockingCodes: [], error: null });
    setIsRefreshing(true);
    timer.current = setTimeout(run, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [graph.nodes, graph.edges, graph.crewConfig, run]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { state, isRefreshing, evaluateNow: run };
}
