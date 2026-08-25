import type { ArchitectureReviewEvidenceBundleV0 } from '@/types/architecture-review';

export function createReviewerEnvelope(evidence: ArchitectureReviewEvidenceBundleV0) {
  const evidenceAliasToId = new Map<string,string>(); const targetAliasToKey = new Map<string,string>();
  const targetKeyToAlias = new Map(evidence.targets.map((target,index) => { const alias=`T${String(index+1).padStart(3,'0')}`; targetAliasToKey.set(alias,target.targetKey); return [target.targetKey,alias]; }));
  const rawToAlias=new Map<string,string>(); for(const target of evidence.targets){const alias=targetKeyToAlias.get(target.targetKey)!;if(target.nodeId)rawToAlias.set(target.nodeId,alias);if(target.edgeId)rawToAlias.set(target.edgeId,alias);}
  const redactString=(value:string)=>{let safe=value;for(const [raw,alias] of rawToAlias)safe=safe.split(raw).join(alias);return safe;};
  const redact=(value:unknown):unknown=>{if(typeof value==='string')return redactString(value);if(Array.isArray(value))return value.map(redact);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value as Record<string,unknown>).map(([key,item])=>[redactString(key),redact(item)]));return value;};
  const items = evidence.items.map((item,index) => { const alias=`E${String(index+1).padStart(3,'0')}`; evidenceAliasToId.set(alias,item.evidenceId); return { alias, source:item.source, sourceVersion:item.sourceVersion, kind:item.kind, targets:item.targetKeys.map((key)=>targetKeyToAlias.get(key)).filter(Boolean), fact:redact(item.fact), summary:redact(item.summary), knowledgeStatus:item.knowledgeStatus, deterministicFindingRef:item.deterministicFindingRef }; });
  const targets = evidence.targets.map((target) => ({ alias: targetKeyToAlias.get(target.targetKey)!, kind:target.kind, nodeType:target.nodeType, field:target.field }));
  return { providerInput: { version:evidence.version, sourceVersions:evidence.sourceVersions, targets, evidence:items }, evidenceAliasToId, targetAliasToKey };
}
