import type { CustomNode } from '@/types/editor';
import type { ExecutionPreviewTargetType } from '@/components/editor/execution-preview/ExecutionPreviewStepCard';

export type ExecutionPreviewNavigationTarget =
  | { kind: 'node'; node: CustomNode }
  | { kind: 'crew' }
  | { kind: 'missing' };

export function isNewNodeSelection(currentNodeId: string | undefined, nextNodeId: string | undefined): boolean {
  return currentNodeId !== nextNodeId;
}

export function isPreviewOpenSelectionSync(guardedNodeId: string | null, nextNodeId: string | undefined): boolean {
  return guardedNodeId !== null && (nextNodeId === undefined || nextNodeId === guardedNodeId);
}

export function resolveExecutionPreviewNavigationTarget(type: ExecutionPreviewTargetType, id: string | undefined, nodes: readonly CustomNode[]): ExecutionPreviewNavigationTarget {
  if (type === 'crew') return { kind: 'crew' };
  const node = id ? nodes.find((item) => item.id === id && item.type === type) : undefined;
  return node ? { kind: 'node', node } : { kind: 'missing' };
}
