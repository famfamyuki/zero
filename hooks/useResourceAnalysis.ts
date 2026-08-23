'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GraphData } from '@/types/editor';
import { evaluateResourceAnalysis, type ResourceAnalysisState } from '@/lib/resource-analysis-evaluation';

export type { ResourceAnalysisState } from '@/lib/resource-analysis-evaluation';

export const RESOURCE_ANALYSIS_DEBOUNCE_MS = 250;

export function useResourceAnalysis(graph: GraphData) {
  const latestGraph = useRef(graph);
  const evaluatedGraph = useRef(graph);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const alive = useRef(true);
  const [state, setState] = useState<ResourceAnalysisState | null>(() => evaluateResourceAnalysis(graph));
  const [isRefreshing, setIsRefreshing] = useState(false);
  latestGraph.current = graph;

  const evaluateNow = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const currentGraph = latestGraph.current;
    const next = evaluateResourceAnalysis(currentGraph);
    if (alive.current) {
      evaluatedGraph.current = currentGraph;
      setState(next);
      setIsRefreshing(false);
    }
    return next;
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setState(null);
    setIsRefreshing(true);
    timer.current = setTimeout(evaluateNow, RESOURCE_ANALYSIS_DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [graph.nodes, graph.edges, graph.crewConfig, evaluateNow]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const graphChanged = evaluatedGraph.current.nodes !== graph.nodes
    || evaluatedGraph.current.edges !== graph.edges
    || evaluatedGraph.current.crewConfig !== graph.crewConfig;

  return {
    state: graphChanged ? null : state,
    isRefreshing: graphChanged ? true : isRefreshing,
    evaluateNow,
  };
}
