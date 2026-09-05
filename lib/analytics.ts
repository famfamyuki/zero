'use client';

import posthog from 'posthog-js';
import { AnalyticsEvent, sanitizeAnalyticsProperties } from '@/lib/analytics-config';
import type { PreflightActivationSource } from '@/lib/preflight-activation';
import { PREFLIGHT_ACTIVATION_VERSION } from '@/lib/preflight-activation';
import { UNIFIED_PREFLIGHT_REVIEW_VERSION, type UnifiedPreflightStage } from '@/types/unified-preflight';
import type { ArchitectureReviewErrorCode } from '@/types/architecture-review';

type AnalyticsProperties = {
  template_selected: { template_id: string; source: 'library' | 'sidebar' };
  json_imported: { source: 'button' | 'drag_drop' };
  crewai_imported: { adapter_version: '0.1.0'; mapping_quality: 'mapped' | 'mapped_with_presentation_inference' };
  code_generated: never;
  code_downloaded: {
    download_type: 'single_file' | 'all_files';
    export_mode: 'scaffold' | 'production';
  };
  buymeacoffee_clicked: { placement: 'header' | 'mobile_sticky' | 'mobile_more' };
  affiliate_clicked: {
    provider: 'conoha';
    placement: 'editor_mobile' | 'templates_header' | 'templates_mobile' | 'code_export';
  };
  readiness_opened: { status: string; evaluable: boolean; ruleset_version: string };
  readiness_finding_selected: { rule_id: string; impact: string; category: string; target_scope: string };
  execution_preview_opened: { state: 'available' | 'empty' | 'invalid'; process: 'sequential' | 'hierarchical' | 'none'; preview_version: '0.1.0' };
  execution_preview_located: { target_type: 'task' | 'agent' | 'tool' | 'crew'; source: 'task' | 'context' | 'assigned_agent' | 'direct_tool' | 'agent_section' | 'agent_tool' | 'manager' };
  resource_analysis_opened: {
    state: 'available' | 'empty' | 'invalid' | 'unavailable';
    process: 'sequential' | 'hierarchical' | 'none';
    analysis_version: '0.1.0';
  };
  resource_analysis_hotspot_selected: {
    hotspot_kind: 'dependency_depth' | 'context_fan_in' | 'tool_binding_concentration';
    target_type: 'task' | 'tool';
  };
  preflight_review_opened: {
    preflight_version: typeof UNIFIED_PREFLIGHT_REVIEW_VERSION;
    source: PreflightActivationSource;
  };
  preflight_activation_prompt_shown: {
    activation_version: typeof PREFLIGHT_ACTIVATION_VERSION;
    preflight_version: typeof UNIFIED_PREFLIGHT_REVIEW_VERSION;
  };
  preflight_first_value_reached: {
    activation_version: typeof PREFLIGHT_ACTIVATION_VERSION;
    preflight_version: typeof UNIFIED_PREFLIGHT_REVIEW_VERSION;
    review_state: 'available' | 'invalid' | 'partial';
    source: PreflightActivationSource;
  };
  preflight_review_stage_selected: {
    stage: UnifiedPreflightStage;
  };
  preflight_review_re_evaluated: {
    stage: UnifiedPreflightStage;
  };
  architecture_review_requested: { review_version: '0.1.0'; evidence_version: '0.1.0'; access_mode: 'paid_subscription_v0' };
  architecture_review_completed: { review_version: '0.1.0'; evidence_version: '0.1.0'; access_mode: 'paid_subscription_v0' };
  architecture_review_failed: { review_version: '0.1.0'; error_code: ArchitectureReviewErrorCode; access_mode: 'paid_subscription_v0' };
  paid_review_offer_shown: { offer_version: '0.1.0'; access_state: string };
  paid_review_checkout_started: { offer_version: '0.1.0' };
  paid_review_quota_exhausted: { offer_version: '0.1.0' };
  paid_review_subscription_management_opened: { offer_version: '0.1.0' };
};

export function trackEvent(event: 'code_generated'): void;
export function trackEvent<E extends Exclude<AnalyticsEvent, 'code_generated'>>(
  event: E,
  properties: AnalyticsProperties[E]
): void;
export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
): void {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;

  posthog.capture(event, sanitizeAnalyticsProperties(event, properties));
}
