'use client';

import posthog from 'posthog-js';
import { AnalyticsEvent, sanitizeAnalyticsProperties } from '@/lib/analytics-config';

type AnalyticsProperties = {
  template_selected: { template_id: string; source: 'library' | 'sidebar' };
  json_imported: never;
  code_generated: never;
  code_downloaded: {
    download_type: 'single_file' | 'all_files';
    export_mode: 'scaffold' | 'production';
  };
  buymeacoffee_clicked: { placement: 'header' | 'mobile_sticky' };
  affiliate_clicked: {
    provider: 'cloudways' | 'conoha';
    placement: 'editor_mobile' | 'templates_header' | 'templates_mobile' | 'code_export';
  };
};

export function trackEvent(event: 'json_imported' | 'code_generated'): void;
export function trackEvent<E extends Exclude<AnalyticsEvent, 'json_imported' | 'code_generated'>>(
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
