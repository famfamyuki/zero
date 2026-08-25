'use client';
import { useCallback,useEffect,useMemo,useRef,useState } from 'react';
import type { GraphData } from '@/types/editor';
import type { Language } from '@/lib/i18n/translations';
import type { useUnifiedPreflight } from './useUnifiedPreflight';
import type { ArchitectureReviewClientState,ArchitectureReviewErrorCode,ArchitectureReviewResultV0 } from '@/types/architecture-review';
import { ARCHITECTURE_REVIEW_EVIDENCE_VERSION,ARCHITECTURE_REVIEW_RESULT_VERSION } from '@/types/architecture-review';
import { createArchitectureReviewEvidence,createArchitectureWorkflowFingerprint } from '@/lib/architecture-review/evidence';
import { trackEvent } from '@/lib/analytics';

type Preflight=ReturnType<typeof useUnifiedPreflight>;
const reason=(preflight:Preflight):'empty'|'invalid'|'partial' => preflight.review.state==='empty'?'empty':preflight.review.state==='invalid'?'invalid':'partial';
export function useArchitectureReview(graph:GraphData,preflight:Preflight,lang:Language){
  const fingerprint=useMemo(()=>createArchitectureWorkflowFingerprint(graph),[graph]);
  const evidence=useMemo(()=>{
    if(preflight.review.state!=='available'||!preflight.readiness.result?.evaluable||preflight.execution.state.status!=='available'||preflight.resources.state?.status!=='available')return null;
    return createArchitectureReviewEvidence({graph,readiness:preflight.readiness.result,execution:preflight.execution.state.result,resources:preflight.resources.state.result});
  },[graph,preflight.review.state,preflight.readiness.result,preflight.execution.state,preflight.resources.state]);
  const [state,setState]=useState<ArchitectureReviewClientState>(()=>evidence?{status:'idle',result:null,stale:false,errorCode:null}:{status:'not_ready',reason:reason(preflight),result:null,stale:false,errorCode:null});
  const [displayEvidence,setDisplayEvidence]=useState<typeof evidence>(null);
  const currentFingerprint=useRef(fingerprint); currentFingerprint.current=fingerprint; const busy=useRef(false);
  useEffect(()=>setState((previous)=>{const stale=Boolean(previous.result&&previous.result.workflowFingerprint!==fingerprint); if(previous.status==='loading')return{...previous,stale}; if(previous.result)return previous.status==='error'?{...previous,stale}:{status:'available',result:previous.result,stale,errorCode:null}; return evidence?{status:'idle',result:null,stale:false,errorCode:null}:{status:'not_ready',reason:reason(preflight),result:null,stale:false,errorCode:null};}),[evidence,fingerprint,preflight.review.state]);
  const run=useCallback(async()=>{if(!evidence||busy.current)return; busy.current=true; const previous=state.result; setState({status:'loading',result:previous,stale:Boolean(previous&&previous.workflowFingerprint!==fingerprint),errorCode:null}); trackEvent('architecture_review_requested',{review_version:ARCHITECTURE_REVIEW_RESULT_VERSION,evidence_version:ARCHITECTURE_REVIEW_EVIDENCE_VERSION});
    try{const response=await fetch('/api/architecture-review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:'0.1.0',locale:lang,evidence})}); const payload=await response.json() as {result?:ArchitectureReviewResultV0;error?:ArchitectureReviewErrorCode}; if(!response.ok||!payload.result)throw Object.assign(new Error('review failed'),{code:payload.error??'provider_error'}); const result=payload.result; setDisplayEvidence(evidence); setState({status:'available',result,stale:result.workflowFingerprint!==currentFingerprint.current,errorCode:null}); trackEvent('architecture_review_completed',{review_version:ARCHITECTURE_REVIEW_RESULT_VERSION,evidence_version:ARCHITECTURE_REVIEW_EVIDENCE_VERSION});}
    catch(error){const code=((error as {code?:ArchitectureReviewErrorCode}).code??'provider_error') as ArchitectureReviewErrorCode; setState({status:'error',result:previous,stale:Boolean(previous&&previous.workflowFingerprint!==currentFingerprint.current),errorCode:code}); trackEvent('architecture_review_failed',{review_version:ARCHITECTURE_REVIEW_RESULT_VERSION,error_code:code});}finally{busy.current=false;}},[evidence,fingerprint,lang,state.result]);
  return{state,evidence,displayEvidence:state.result?displayEvidence:evidence,run,currentWorkflowFingerprint:fingerprint};
}
export type ReturnTypeOfUseArchitectureReview=ReturnType<typeof useArchitectureReview>;
