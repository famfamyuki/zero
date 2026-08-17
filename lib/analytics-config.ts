export const ANALYTICS_EVENTS = [
  'template_selected',
  'json_imported',
  'code_generated',
  'code_downloaded',
  'buymeacoffee_clicked',
  'affiliate_clicked',
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

const EVENT_PROPERTY_ALLOWLIST: Record<AnalyticsEvent, readonly string[]> = {
  template_selected: ['template_id', 'source'],
  json_imported: ['source'],
  code_generated: [],
  code_downloaded: ['download_type', 'export_mode'],
  buymeacoffee_clicked: ['placement'],
  affiliate_clicked: ['provider', 'placement'],
};

// PostHog adds these anonymous SDK properties. URL, referrer, UTM, element text,
// and all other properties are intentionally removed before transmission.
const ANONYMOUS_SDK_PROPERTY_ALLOWLIST = new Set([
  '$browser',
  '$browser_version',
  '$device_id',
  '$device_type',
  '$insert_id',
  '$lib',
  '$lib_version',
  '$os',
  '$os_version',
  '$session_id',
  '$time',
  'distinct_id',
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
