'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { evaluateReadiness } from '@/lib/readiness';
import type { GraphData } from '@/types/editor';
import type { ReadinessResult } from '@/types/readiness';

export interface ReadinessEvaluationState {
  result: ReadinessResult | null;
  error: Error | null;
  isRefreshing: boolean;
  evaluateNow: () => ReadinessResult | null;
}

export function useReadinessEvaluation(graph: GraphData): ReadinessEvaluationState {
  const latestGraph = useRef(graph);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const initial = useRef<{ result: ReadinessResult | null; error: Error | null } | null>(null);
  if (!initial.current) {
    try { initial.current = { result: evaluateReadiness(graph), error: null }; }
    catch (cause) { initial.current = { result: null, error: cause instanceof Error ? cause : new Error('Readiness evaluation failed') }; }
  }
  const [result, setResult] = useState<ReadinessResult | null>(initial.current.result);
  const [error, setError] = useState<Error | null>(initial.current.error);
  const [isRefreshing, setIsRefreshing] = useState(false);

  latestGraph.current = graph;

  const run = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    try {
      const nextResult = evaluateReadiness(latestGraph.current);
      setResult(nextResult);
      setError(null);
      return nextResult;
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause : new Error('Readiness evaluation failed'));
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setIsRefreshing(true);
    timer.current = setTimeout(run, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [graph.nodes, graph.edges, graph.crewConfig, run]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { result, error, isRefreshing, evaluateNow: run };
}
