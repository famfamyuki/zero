import type { CaptureResult } from 'posthog-js';

export const ANALYTICS_EVENTS = [
  'template_selected',
  'json_imported',
  'crewai_imported',
  'code_generated',
  'code_downloaded',
  'buymeacoffee_clicked',
  'affiliate_clicked',
  'readiness_opened',
  'readiness_finding_selected',
  'execution_preview_opened',
  'execution_preview_located',
  'resource_analysis_opened',
  'resource_analysis_hotspot_selected',
  'preflight_review_opened',
  'preflight_review_stage_selected',
  'preflight_review_re_evaluated',
  'preflight_activation_prompt_shown',
  'preflight_first_value_reached',
  'architecture_review_requested',
  'architecture_review_completed',
  'architecture_review_failed',
  'paid_review_offer_shown',
  'paid_review_checkout_started',
  'paid_review_quota_exhausted',
  'paid_review_subscription_management_opened',
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

const EVENT_PROPERTY_ALLOWLIST: Record<AnalyticsEvent, readonly string[]> = {
  template_selected: ['template_id', 'source'],
  json_imported: ['source'],
  crewai_imported: ['adapter_version', 'mapping_quality'],
  code_generated: [],
  code_downloaded: ['download_type', 'export_mode'],
  buymeacoffee_clicked: ['placement'],
  affiliate_clicked: ['provider', 'placement'],
  readiness_opened: ['status', 'evaluable', 'ruleset_version'],
  readiness_finding_selected: ['rule_id', 'impact', 'category', 'target_scope'],
  execution_preview_opened: ['state', 'process', 'preview_version'],
  execution_preview_located: ['target_type', 'source'],
  resource_analysis_opened: ['state', 'process', 'analysis_version'],
  resource_analysis_hotspot_selected: ['hotspot_kind', 'target_type'],
  preflight_review_opened: ['preflight_version', 'source'],
  preflight_review_stage_selected: ['stage'],
  preflight_review_re_evaluated: ['stage'],
  preflight_activation_prompt_shown: ['activation_version', 'preflight_version'],
  preflight_first_value_reached: ['activation_version', 'preflight_version', 'review_state', 'source'],
  architecture_review_requested: ['review_version', 'evidence_version', 'access_mode'],
  architecture_review_completed: ['review_version', 'evidence_version', 'access_mode'],
  architecture_review_failed: ['review_version', 'error_code', 'access_mode'],
  paid_review_offer_shown: ['offer_version', 'access_state'],
  paid_review_checkout_started: ['offer_version'],
  paid_review_quota_exhausted: ['offer_version'],
  paid_review_subscription_management_opened: ['offer_version'],
};

// PostHog adds these anonymous SDK properties. URL, referrer, UTM, element text,
// user input, and all other properties are intentionally removed before transmission.
// 'token' is the public PostHog project API key required for event ingestion by PostHog endpoints.
const ANONYMOUS_SDK_PROPERTY_ALLOWLIST = new Set([
  'token',
  'distinct_id',
  '$device_id',
  '$session_id',
  '$window_id',
  '$insert_id',
  '$lib',
  '$lib_version',
  '$time',
  '$browser',
  '$browser_version',
  '$os',
  '$os_version',
  '$device_type',
]);

export function isAnalyticsEvent(event: string): event is AnalyticsEvent {
  return (ANALYTICS_EVENTS as readonly string[]).includes(event);
}

export function sanitizeAnalyticsProperties(
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {}
): Record<string, unknown> {
  const allowed = new Set([
    ...ANONYMOUS_SDK_PROPERTY_ALLOWLIST,
    ...EVENT_PROPERTY_ALLOWLIST[event],
  ]);

  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => allowed.has(key) && value !== undefined)
  );
}

// $pageview is allowed through before_send but with strict property filtering.
// Only $pathname (page path without query string) and anonymous SDK metadata
// are kept. $current_url, $referrer, UTM parameters, and all other properties
// are intentionally stripped to maintain privacy-first design.
const PAGEVIEW_PROPERTY_ALLOWLIST = new Set([
  ...ANONYMOUS_SDK_PROPERTY_ALLOWLIST,
  '$pathname',
]);

export function sanitizePageviewProperties(
  properties: Record<string, unknown> = {}
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(properties).filter(
      ([key, value]) => PAGEVIEW_PROPERTY_ALLOWLIST.has(key) && value !== undefined
    )
  );
}

/**
 * PostHog before_send filter used in instrumentation-client.ts.
 *
 * - `$pageview`: allowed, properties sanitized via pageview allowlist
 * - Custom analytics events (ANALYTICS_EVENTS): allowed, properties sanitized
 * - Everything else: rejected (returns null)
 */
export function filterPostHogCapture(
  capture: CaptureResult | null
): CaptureResult | null {
  if (!capture) return null;

  if (capture.event === '$pageview') {
    return {
      ...capture,
      properties: sanitizePageviewProperties(capture.properties),
    };
  }

  if (!isAnalyticsEvent(capture.event)) return null;

  return {
    ...capture,
    properties: sanitizeAnalyticsProperties(capture.event, capture.properties),
  };
}
