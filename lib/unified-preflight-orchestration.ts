import type { ExecutionPreviewState } from '@/hooks/useExecutionPreview';
import type { ResourceAnalysisState } from '@/lib/resource-analysis-evaluation';
import { createUnifiedPreflightReadModel } from '@/lib/unified-preflight';
import type { ReadinessResult } from '@/types/readiness';
import type { UnifiedPreflightReadModel } from '@/types/unified-preflight';

export interface UnifiedPreflightEvaluators {
  readonly readiness: () => ReadinessResult | null;
  readonly execution: () => ExecutionPreviewState;
  readonly resources: () => ResourceAnalysisState;
}

export function evaluateUnifiedPreflightNow(
  evaluators: UnifiedPreflightEvaluators,
): UnifiedPreflightReadModel {
  const readinessResult = evaluators.readiness();
  const executionState = evaluators.execution();
  const resourceState = evaluators.resources();

  return createUnifiedPreflightReadModel({
    readiness: { result: readinessResult, error: null, isRefreshing: false },
    execution: { state: executionState, isRefreshing: false },
    resources: { state: resourceState, isRefreshing: false },
  });
}
