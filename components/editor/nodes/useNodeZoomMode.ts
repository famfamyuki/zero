'use client';

import { useStore } from '@xyflow/react';

export type NodeZoomMode = 'overview' | 'compact' | 'condensed' | 'full';

export function useNodeZoomMode(): NodeZoomMode {
  return useStore((state) => {
    const zoom = state.transform[2];
    if (zoom < 0.38) return 'overview';
    if (zoom < 0.62) return 'compact';
    if (zoom < 0.86) return 'condensed';
    return 'full';
  });
}
