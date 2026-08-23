import type { Edge } from '@xyflow/react';
import type { CustomNode } from '@/types/editor';
import type { ReadinessTarget } from '@/types/readiness';

export type ReadinessNavigationTarget =
  | { kind: 'node'; node: CustomNode }
  | { kind: 'edge'; edge: Edge }
  | { kind: 'crew' }
  | { kind: 'graph' }
  | { kind: 'missing' };

export function resolveReadinessNavigationTarget(target: ReadinessTarget, nodes: readonly CustomNode[], edges: readonly Edge[]): ReadinessNavigationTarget {
  if (target.nodeId) {
    const node = nodes.find((item) => item.id === target.nodeId);
    return node ? { kind: 'node', node } : { kind: 'missing' };
  }
  if (target.edgeId) {
    const edge = edges.find((item) => item.id === target.edgeId);
    return edge ? { kind: 'edge', edge } : { kind: 'missing' };
  }
  if (target.scope === 'crew' || (target.scope === 'field' && target.field)) return { kind: 'crew' };
  return { kind: 'graph' };
}
