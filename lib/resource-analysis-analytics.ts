import type { ResourceAnalysisState } from '@/lib/resource-analysis-evaluation';
import {
  RESOURCE_ANALYSIS_READ_MODEL_VERSION,
  type ResourceAnalysisHotspot,
  type ResourceAnalysisTarget,
} from '@/types/resource-analysis';

export interface ResourceAnalysisOpenedAnalyticsProperties {
  readonly state: 'available' | 'empty' | 'invalid' | 'unavailable';
  readonly process: 'sequential' | 'hierarchical' | 'none';
  readonly analysis_version: typeof RESOURCE_ANALYSIS_READ_MODEL_VERSION;
}

export interface ResourceAnalysisHotspotAnalyticsProperties {
  readonly hotspot_kind: ResourceAnalysisHotspot['kind'];
  readonly target_type: 'task' | 'tool';
}

export function createResourceAnalysisOpenedAnalyticsProperties(
  state: ResourceAnalysisState
): ResourceAnalysisOpenedAnalyticsProperties {
  return {
    state: state.status,
    process: state.status === 'available' ? state.result.process : 'none',
    analysis_version: RESOURCE_ANALYSIS_READ_MODEL_VERSION,
  };
}

export function createResourceAnalysisHotspotAnalyticsProperties(
  kind: ResourceAnalysisHotspot['kind'],
  target: ResourceAnalysisTarget
): ResourceAnalysisHotspotAnalyticsProperties | null {
  if (
    (kind === 'dependency_depth' || kind === 'context_fan_in')
    && target.type === 'task'
  ) {
    return { hotspot_kind: kind, target_type: 'task' };
  }
  if (kind === 'tool_binding_concentration' && target.type === 'tool') {
    return { hotspot_kind: kind, target_type: 'tool' };
  }
  return null;
}
