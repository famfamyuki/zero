import type { ExecutionPreviewState } from '@/hooks/useExecutionPreview';
import type { ResourceAnalysisState } from '@/lib/resource-analysis-evaluation';
import type { ExecutionPreviewReadModel } from '@/types/execution-preview';
import type { ReadinessCounts, ReadinessResult, ReadinessStatus } from '@/types/readiness';
import type { ResourceAnalysisReadModel, ResourceAnalysisSummary } from '@/types/resource-analysis';

export const UNIFIED_PREFLIGHT_REVIEW_VERSION = '0.1.0' as const;

export type UnifiedPreflightReviewState =
  | 'refreshing'
  | 'empty'
  | 'invalid'
  | 'partial'
  | 'available';

export type UnifiedPreflightStage = 'overview' | 'architecture' | 'readiness' | 'execution' | 'resources';

export type UnifiedPreflightReadinessState =
  | 'refreshing'
  | 'available'
  | 'not_evaluable'
  | 'unavailable';

export type UnifiedPreflightExecutionState =
  | 'refreshing'
  | 'available'
  | 'empty'
  | 'invalid'
  | 'unavailable';

export type UnifiedPreflightResourceState = UnifiedPreflightExecutionState;

export interface UnifiedPreflightProjectionInput {
  readonly readiness: {
    readonly result: ReadinessResult | null;
    readonly error: Error | null;
    readonly isRefreshing: boolean;
  };
  readonly execution: {
    readonly state: ExecutionPreviewState;
    readonly isRefreshing: boolean;
  };
  readonly resources: {
    readonly state: ResourceAnalysisState | null;
    readonly isRefreshing: boolean;
  };
}

export interface UnifiedPreflightReadinessSummary {
  readonly status: ReadinessStatus;
  readonly evaluable: boolean;
  readonly counts: ReadinessCounts;
  readonly rulesetVersion: ReadinessResult['rulesetVersion'];
}

export type UnifiedPreflightReadinessStage =
  | { readonly state: 'refreshing' | 'unavailable'; readonly result: null }
  | { readonly state: 'available' | 'not_evaluable'; readonly result: UnifiedPreflightReadinessSummary };

export interface UnifiedPreflightExecutionSummary {
  readonly process: ExecutionPreviewReadModel['process'];
  readonly summary: ExecutionPreviewReadModel['summary'];
  readonly version: ExecutionPreviewReadModel['version'];
}

export type UnifiedPreflightExecutionStage =
  | { readonly state: 'refreshing' | 'empty' | 'invalid' | 'unavailable'; readonly result: null }
  | { readonly state: 'available'; readonly result: UnifiedPreflightExecutionSummary };

export interface UnifiedPreflightResourceSummary {
  readonly process: ResourceAnalysisReadModel['process'];
  readonly summary: ResourceAnalysisSummary;
  readonly hotspotCount: number;
  readonly version: ResourceAnalysisReadModel['version'];
}

export type UnifiedPreflightResourceStage =
  | { readonly state: 'refreshing' | 'empty' | 'invalid' | 'unavailable'; readonly result: null }
  | { readonly state: 'available'; readonly result: UnifiedPreflightResourceSummary };

export interface UnifiedPreflightReadModel {
  readonly version: typeof UNIFIED_PREFLIGHT_REVIEW_VERSION;
  readonly state: UnifiedPreflightReviewState;
  readonly stages: {
    readonly readiness: UnifiedPreflightReadinessStage;
    readonly execution: UnifiedPreflightExecutionStage;
    readonly resources: UnifiedPreflightResourceStage;
  };
}
