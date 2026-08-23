import type { CustomNode } from '@/types/editor';

export type PreflightTarget =
  | { readonly type: 'task'; readonly id: string }
  | { readonly type: 'agent'; readonly id: string }
  | { readonly type: 'tool'; readonly id: string }
  | { readonly type: 'crew' };

export type PreflightNavigationResult =
  | { kind: 'node'; node: CustomNode }
  | { kind: 'crew' }
  | { kind: 'missing' };

export function resolvePreflightNavigationTarget(target: PreflightTarget, nodes: readonly CustomNode[]): PreflightNavigationResult {
  if (target.type === 'crew') return { kind: 'crew' };
  const node = nodes.find((item) => item.id === target.id && item.type === target.type);
  return node ? { kind: 'node', node } : { kind: 'missing' };
}

export function shouldIgnoreSelectionChangeForOpenPreflight(isPreflightOpen: boolean): boolean {
  return isPreflightOpen;
}
