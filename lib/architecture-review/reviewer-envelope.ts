import type { ArchitectureReviewEvidenceBundleV0 } from '@/types/architecture-review';

const SINGLE_TARGET_REFERENCE_FIELDS = new Set([
  'nodeId',
  'edgeId',
  'agentId',
  'taskId',
  'toolId',
  'source',
  'target',
]);

const MULTIPLE_TARGET_REFERENCE_FIELDS = new Set([
  'nodeIds',
  'edgeIds',
  'agentIds',
  'taskIds',
  'toolIds',
]);

function aliasStructuredTargetReferences(
  value: unknown,
  rawToAlias: ReadonlyMap<string, string>,
  field?: string,
): unknown {
  if (typeof value === 'string') {
    return field && SINGLE_TARGET_REFERENCE_FIELDS.has(field)
      ? rawToAlias.get(value) ?? value
      : value;
  }
  if (Array.isArray(value)) {
    if (field && MULTIPLE_TARGET_REFERENCE_FIELDS.has(field)) {
      return value.map((item) => typeof item === 'string' ? rawToAlias.get(item) ?? item : item);
    }
    return value.map((item) => aliasStructuredTargetReferences(item, rawToAlias));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        aliasStructuredTargetReferences(item, rawToAlias, key),
      ]),
    );
  }
  return value;
}

export function createReviewerEnvelope(evidence: ArchitectureReviewEvidenceBundleV0) {
  const evidenceAliasToId = new Map<string,string>(); const targetAliasToKey = new Map<string,string>();
  const targetKeyToAlias = new Map(evidence.targets.map((target,index) => { const alias=`T${String(index+1).padStart(3,'0')}`; targetAliasToKey.set(alias,target.targetKey); return [target.targetKey,alias]; }));
  const rawToAlias=new Map<string,string>(); for(const target of evidence.targets){const alias=targetKeyToAlias.get(target.targetKey)!;if(target.kind==='node'&&target.nodeId)rawToAlias.set(target.nodeId,alias);if(target.kind==='edge'&&target.edgeId)rawToAlias.set(target.edgeId,alias);}
  const items = evidence.items.map((item,index) => { const alias=`E${String(index+1).padStart(3,'0')}`; evidenceAliasToId.set(alias,item.evidenceId); return { alias, source:item.source, sourceVersion:item.sourceVersion, kind:item.kind, targets:item.targetKeys.map((key)=>targetKeyToAlias.get(key)).filter(Boolean), fact:aliasStructuredTargetReferences(item.fact,rawToAlias), summary:item.summary, knowledgeStatus:item.knowledgeStatus, deterministicFindingRef:item.deterministicFindingRef }; });
  const targets = evidence.targets.map((target) => ({ alias: targetKeyToAlias.get(target.targetKey)!, kind:target.kind, nodeType:target.nodeType, field:target.field }));
  return { providerInput: { version:evidence.version, sourceVersions:evidence.sourceVersions, targets, evidence:items }, evidenceAliasToId, targetAliasToKey };
}
