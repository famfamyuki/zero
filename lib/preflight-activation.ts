import type { UnifiedPreflightReadModel } from '@/types/unified-preflight';

export const PREFLIGHT_ACTIVATION_VERSION = '0.1.0' as const;

export const PREFLIGHT_ACTIVATION_STORAGE_KEY =
  'agentgraph_preflight_activation_v0' as const;

export type PreflightActivationPersistentStatus =
  | 'prompted'
  | 'dismissed'
  | 'completed';

export type PreflightActivationSource = 'entry' | 'activation_prompt';

interface PreflightActivationPersistencePayload {
  readonly version: 1;
  readonly status: PreflightActivationPersistentStatus;
}

const persistentStatuses = new Set<PreflightActivationPersistentStatus>([
  'prompted',
  'dismissed',
  'completed',
]);

export function parsePreflightActivationPersistence(
  serialized: string | null,
): PreflightActivationPersistentStatus | null {
  if (serialized === null) return null;

  try {
    const value: unknown = JSON.parse(serialized);
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;

    const payload = value as Record<string, unknown>;
    if (
      payload.version !== 1
      || typeof payload.status !== 'string'
      || !persistentStatuses.has(payload.status as PreflightActivationPersistentStatus)
    ) {
      return null;
    }

    return payload.status as PreflightActivationPersistentStatus;
  } catch {
    return null;
  }
}

export function serializePreflightActivationPersistence(
  status: PreflightActivationPersistentStatus,
): string {
  const payload: PreflightActivationPersistencePayload = { version: 1, status };
  return JSON.stringify(payload);
}

export function hasMeaningfulPreflightFirstValue(
  review: UnifiedPreflightReadModel,
): boolean {
  if (review.state === 'refreshing' || review.state === 'empty') return false;

  return Object.values(review.stages).some((stage) => stage.result !== null);
}
