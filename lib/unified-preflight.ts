import type {
  UnifiedPreflightExecutionStage,
  UnifiedPreflightProjectionInput,
  UnifiedPreflightReadModel,
  UnifiedPreflightReadinessStage,
  UnifiedPreflightResourceStage,
  UnifiedPreflightReviewState,
} from '@/types/unified-preflight';
import { UNIFIED_PREFLIGHT_REVIEW_VERSION } from '@/types/unified-preflight';

function projectReadiness(
  source: UnifiedPreflightProjectionInput['readiness'],
): UnifiedPreflightReadinessStage {
  if (source.isRefreshing) return { state: 'refreshing', result: null };
  if (source.error !== null || source.result === null) return { state: 'unavailable', result: null };

  const result = {
    status: source.result.status,
    evaluable: source.result.evaluable,
    counts: { ...source.result.counts },
    rulesetVersion: source.result.rulesetVersion,
  };

  if (!source.result.evaluable || source.result.status === 'not_evaluable') {
    return { state: 'not_evaluable', result };
  }
  return { state: 'available', result };
}

function projectExecution(
  source: UnifiedPreflightProjectionInput['execution'],
): UnifiedPreflightExecutionStage {
  if (source.isRefreshing) return { state: 'refreshing', result: null };
  if (source.state.status === 'available') {
    return {
      state: 'available',
      result: {
        process: source.state.result.process,
        summary: { ...source.state.result.summary },
        version: source.state.result.version,
      },
    };
  }
  if (source.state.status === 'error') return { state: 'unavailable', result: null };
  return { state: source.state.status, result: null };
}

function projectResources(
  source: UnifiedPreflightProjectionInput['resources'],
): UnifiedPreflightResourceStage {
  if (source.isRefreshing || source.state === null) return { state: 'refreshing', result: null };
  if (source.state.status === 'available') {
    return {
      state: 'available',
      result: {
        process: source.state.result.process,
        summary: { ...source.state.result.summary },
        hotspotCount: source.state.result.hotspots.length,
        version: source.state.result.version,
      },
    };
  }
  return { state: source.state.status, result: null };
}

function aggregateState(
  readiness: UnifiedPreflightReadinessStage,
  execution: UnifiedPreflightExecutionStage,
  resources: UnifiedPreflightResourceStage,
): UnifiedPreflightReviewState {
  if (readiness.state === 'refreshing' || execution.state === 'refreshing' || resources.state === 'refreshing') {
    return 'refreshing';
  }
  if (execution.state === 'empty' && resources.state === 'empty') return 'empty';
  if (readiness.state === 'not_evaluable' || execution.state === 'invalid' || resources.state === 'invalid') {
    return 'invalid';
  }
  if (readiness.state === 'available' && execution.state === 'available' && resources.state === 'available') {
    return 'available';
  }
  return 'partial';
}

export function createUnifiedPreflightReadModel(
  input: UnifiedPreflightProjectionInput,
): UnifiedPreflightReadModel {
  const readiness = projectReadiness(input.readiness);
  const execution = projectExecution(input.execution);
  const resources = projectResources(input.resources);

  return {
    version: UNIFIED_PREFLIGHT_REVIEW_VERSION,
    state: aggregateState(readiness, execution, resources),
    stages: { readiness, execution, resources },
  };
}
