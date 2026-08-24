'use client';

import { useCallback, useMemo } from 'react';
import { useExecutionPreview } from '@/hooks/useExecutionPreview';
import { useReadinessEvaluation } from '@/hooks/useReadinessEvaluation';
import { useResourceAnalysis } from '@/hooks/useResourceAnalysis';
import { evaluateUnifiedPreflightNow } from '@/lib/unified-preflight-orchestration';
import { createUnifiedPreflightReadModel } from '@/lib/unified-preflight';
import type { GraphData } from '@/types/editor';

export function useUnifiedPreflight(graph: GraphData) {
  const readiness = useReadinessEvaluation(graph);
  const execution = useExecutionPreview(graph);
  const resources = useResourceAnalysis(graph);

  const review = useMemo(() => createUnifiedPreflightReadModel({
    readiness: {
      result: readiness.result,
      error: readiness.error,
      isRefreshing: readiness.isRefreshing,
    },
    execution: {
      state: execution.state,
      isRefreshing: execution.isRefreshing,
    },
    resources: {
      state: resources.state,
      isRefreshing: resources.isRefreshing,
    },
  }), [
    readiness.result,
    readiness.error,
    readiness.isRefreshing,
    execution.state,
    execution.isRefreshing,
    resources.state,
    resources.isRefreshing,
  ]);

  const evaluateAll = useCallback(() => evaluateUnifiedPreflightNow({
    readiness: readiness.evaluateNow,
    execution: execution.evaluateNow,
    resources: resources.evaluateNow,
  }), [readiness.evaluateNow, execution.evaluateNow, resources.evaluateNow]);

  return {
    review,
    readiness,
    execution,
    resources,
    isRefreshing: review.state === 'refreshing',
    evaluateAll,
  };
}
