import type { CustomNode } from '@/types/editor';
import type { ExecutionPreviewTargetType } from '@/components/editor/execution-preview/ExecutionPreviewStepCard';
import { resolvePreflightNavigationTarget, shouldIgnoreSelectionChangeForOpenPreflight, type PreflightNavigationResult } from '@/lib/preflight-navigation';

export type ExecutionPreviewNavigationTarget = PreflightNavigationResult;

export function isNewNodeSelection(currentNodeId: string | undefined, nextNodeId: string | undefined): boolean {
  return currentNodeId !== nextNodeId;
}

export function shouldIgnoreSelectionChangeForOpenPreview(isPreviewOpen: boolean): boolean {
  return shouldIgnoreSelectionChangeForOpenPreflight(isPreviewOpen);
}

export function resolveExecutionPreviewNavigationTarget(type: ExecutionPreviewTargetType, id: string | undefined, nodes: readonly CustomNode[]): ExecutionPreviewNavigationTarget {
  if (type === 'crew') return resolvePreflightNavigationTarget({ type }, nodes);
  return id ? resolvePreflightNavigationTarget({ type, id }, nodes) : { kind: 'missing' };
}
