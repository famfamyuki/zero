import type { UnifiedPreflightStage } from '@/types/unified-preflight';

export const unifiedPreflightStages: readonly UnifiedPreflightStage[] = [
  'overview',
  'readiness',
  'execution',
  'resources',
];

export function getUnifiedPreflightTabDestination(
  currentStage: UnifiedPreflightStage,
  key: string,
): UnifiedPreflightStage | null {
  const currentIndex = unifiedPreflightStages.indexOf(currentStage);

  if (key === 'Home') return unifiedPreflightStages[0];
  if (key === 'End') return unifiedPreflightStages[unifiedPreflightStages.length - 1];
  if (key === 'ArrowRight') {
    return unifiedPreflightStages[(currentIndex + 1) % unifiedPreflightStages.length];
  }
  if (key === 'ArrowLeft') {
    return unifiedPreflightStages[
      (currentIndex - 1 + unifiedPreflightStages.length) % unifiedPreflightStages.length
    ];
  }

  return null;
}
