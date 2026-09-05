import type { ArchitectureReviewEvidenceBundleV0 } from '@/types/architecture-review';
import { ARCHITECTURE_REVIEW_EVIDENCE_VERSION } from '@/types/architecture-review';
import { canonicalize, sha256 } from './canonicalize';
import { architectureEvidenceSchema } from './schemas';

export function validateArchitectureEvidence(input: unknown): ArchitectureReviewEvidenceBundleV0 | null {
  const parsed=architectureEvidenceSchema.safeParse(input); if(!parsed.success) return null; const bundle=parsed.data as ArchitectureReviewEvidenceBundleV0;
  const targetKeys=bundle.targets.map((item)=>item.targetKey); const evidenceIds=bundle.items.map((item)=>item.evidenceId);
  if(new Set(targetKeys).size!==targetKeys.length||new Set(evidenceIds).size!==evidenceIds.length) return null;
  if(bundle.items.some((item)=>item.targetKeys.length===0||item.targetKeys.some((key)=>!targetKeys.includes(key)))) return null;
  const sourceVersions:Record<string,string>={readiness:bundle.sourceVersions.readiness,execution_preview:bundle.sourceVersions.executionPreview,resource_analysis:bundle.sourceVersions.resourceAnalysis,workflow_semantics:bundle.sourceVersions.workflowSemantics};
  if(bundle.items.some((item)=>item.sourceVersion!==sourceVersions[item.source])) return null;
  const expected=`arev_v0_${sha256(canonicalize({version:ARCHITECTURE_REVIEW_EVIDENCE_VERSION,sourceVersions:bundle.sourceVersions,targets:bundle.targets,items:bundle.items}))}`;
  return expected===bundle.evidenceFingerprint?bundle:null;
}
