'use client';
import { useCallback,useEffect,useMemo,useRef,useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { GraphData } from '@/types/editor';
import type { Language } from '@/lib/i18n/translations';
import type { useUnifiedPreflight } from './useUnifiedPreflight';
import type { ArchitectureReviewClientState,ArchitectureReviewErrorCode,ArchitectureReviewResultV0 } from '@/types/architecture-review';
import { ARCHITECTURE_REVIEW_EVIDENCE_VERSION,ARCHITECTURE_REVIEW_RESULT_VERSION } from '@/types/architecture-review';
import type { PaidArchitectureReviewAccess } from '@/types/paid-architecture-review';
import { createArchitectureReviewEvidence,createArchitectureWorkflowFingerprint } from '@/lib/architecture-review/evidence';
import { trackEvent } from '@/lib/analytics';
import { getSupabase } from '@/lib/supabase';

type Preflight=ReturnType<typeof useUnifiedPreflight>;
type Offer={version:'0.1.0';enabled:boolean;displayName:string;price:null|{currency:string;unitAmount:number;interval:'month'};includedReviews:number|null};
const reason=(preflight:Preflight):'empty'|'invalid'|'partial' => preflight.review.state==='empty'?'empty':preflight.review.state==='invalid'?'invalid':'partial';

export function useArchitectureReview(graph:GraphData,preflight:Preflight,lang:Language){
  const fingerprint=useMemo(()=>createArchitectureWorkflowFingerprint(graph),[graph]);
  const evidence=useMemo(()=>{
    if(preflight.review.state!=='available'||!preflight.readiness.result?.evaluable||preflight.execution.state.status!=='available'||preflight.resources.state?.status!=='available')return null;
    return createArchitectureReviewEvidence({graph,readiness:preflight.readiness.result,execution:preflight.execution.state.result,resources:preflight.resources.state.result});
  },[graph,preflight.review.state,preflight.readiness.result,preflight.execution.state,preflight.resources.state]);
  const [state,setState]=useState<ArchitectureReviewClientState>(()=>evidence?{status:'idle',result:null,stale:false,errorCode:null}:{status:'not_ready',reason:reason(preflight),result:null,stale:false,errorCode:null});
  const [displayEvidence,setDisplayEvidence]=useState<typeof evidence>(null);
  const [session,setSession]=useState<Session|null>(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [access,setAccess]=useState<PaidArchitectureReviewAccess|null>(null);
  const [offer,setOffer]=useState<Offer|null|undefined>(undefined);
  const [paidBusy,setPaidBusy]=useState(false);
  const [paidMessage,setPaidMessage]=useState<string|null>(null);
  const [checkoutSyncing,setCheckoutSyncing]=useState(false);
  const currentFingerprint=useRef(fingerprint); currentFingerprint.current=fingerprint; const busy=useRef(false);
  const authHeaders=useCallback(():Record<string,string>=>session?{Authorization:`Bearer ${session.access_token}`}:{},[session]);

  const loadAccess=useCallback(async()=>{
    if(!session){setAccess(null);return null;}
    const response=await fetch('/api/billing/architecture-review/access',{headers:authHeaders(),cache:'no-store'});
    if(response.status===401){setSession(null);setAccess(null);return null;}
    const payload=await response.json() as PaidArchitectureReviewAccess;
    setAccess(payload); return payload;
  },[session,authHeaders]);

  useEffect(()=>{
    let active=true;
    fetch('/api/billing/architecture-review/offer',{cache:'no-store'}).then((r)=>r.json()).then((value:Offer)=>{if(active)setOffer(value);}).catch(()=>{if(active)setOffer(null);});
    try{
      const supabase=getSupabase();
      supabase.auth.getSession().then(({data})=>{if(active){setSession(data.session);setAuthLoading(false);}});
      const {data}=supabase.auth.onAuthStateChange((_event,next)=>{if(active){setSession(next);setAuthLoading(false);}});
      return()=>{active=false;data.subscription.unsubscribe();};
    }catch{setAuthLoading(false);return()=>{active=false;};}
  },[]);
  useEffect(()=>{void loadAccess();},[loadAccess]);
  useEffect(()=>{
    if(!session||typeof window==='undefined'||new URLSearchParams(window.location.search).get('architecture_review_checkout')!=='success')return;
    let cancelled=false;let timer:ReturnType<typeof setTimeout>|undefined;setCheckoutSyncing(true);setPaidMessage(lang==='ja'?'サブスクリプションを確認中…':'Confirming your subscription…');
    const poll=async(attempt:number)=>{const next=await loadAccess().catch(()=>null);if(cancelled)return;if(next&&(next.state==='active'||next.state==='active_canceling'||next.state==='quota_exhausted')){setCheckoutSyncing(false);setPaidMessage(null);window.history.replaceState({},'',window.location.pathname);return;}if(attempt>=4){setCheckoutSyncing(false);setPaidMessage(lang==='ja'?'確認を完了できませんでした。「請求状態を更新」をお試しください。':'Confirmation is taking longer. Use Refresh billing status.');return;}timer=setTimeout(()=>void poll(attempt+1),1500);};void poll(0);return()=>{cancelled=true;if(timer)clearTimeout(timer);};
  },[session,loadAccess,lang]);
  useEffect(()=>{if(access?.state==='quota_exhausted')trackEvent('paid_review_quota_exhausted',{offer_version:'0.1.0'});},[access?.state]);
  useEffect(()=>{if(offer)trackEvent('paid_review_offer_shown',{offer_version:'0.1.0',access_state:session?(access?.state??'loading'):'signed_out'});},[offer,session,access?.state]);

  useEffect(()=>setState((previous)=>{const stale=Boolean(previous.result&&previous.result.workflowFingerprint!==fingerprint); if(previous.status==='loading')return{...previous,stale}; if(previous.result)return previous.status==='error'?{...previous,stale}:{status:'available',result:previous.result,stale,errorCode:null}; return evidence?{status:'idle',result:null,stale:false,errorCode:null}:{status:'not_ready',reason:reason(preflight),result:null,stale:false,errorCode:null};}),[evidence,fingerprint,preflight.review.state]);

  const signIn=useCallback(async(email:string)=>{setPaidBusy(true);setPaidMessage(null);try{const origin=window.location.origin;const {error}=await getSupabase().auth.signInWithOtp({email,options:{emailRedirectTo:`${origin}/?architecture_review_auth=complete`}});if(error)throw error;setPaidMessage(lang==='ja'?'サインインリンクをメールで送信しました。':'We sent a sign-in link to your email.');}catch{setPaidMessage(lang==='ja'?'サインインリンクを送信できませんでした。':'Could not send the sign-in link.');}finally{setPaidBusy(false);}},[lang]);
  const signOut=useCallback(async()=>{setPaidBusy(true);try{await getSupabase().auth.signOut();setAccess(null);}finally{setPaidBusy(false);}},[]);
  const checkout=useCallback(async()=>{if(!session)return;setPaidBusy(true);setPaidMessage(null);try{trackEvent('paid_review_checkout_started',{offer_version:'0.1.0'});const response=await fetch('/api/billing/architecture-review/checkout',{method:'POST',headers:{...authHeaders(),'Idempotency-Key':crypto.randomUUID()}});const payload=await response.json() as {url?:string};if(!response.ok||!payload.url)throw new Error('checkout');window.location.assign(payload.url);}catch{setPaidMessage(lang==='ja'?'Checkoutを開始できませんでした。':'Could not start Checkout.');setPaidBusy(false);}},[session,authHeaders,lang]);
  const manageBilling=useCallback(async()=>{if(!session)return;setPaidBusy(true);try{trackEvent('paid_review_subscription_management_opened',{offer_version:'0.1.0'});const response=await fetch('/api/billing/portal',{method:'POST',headers:authHeaders()});const payload=await response.json() as {url?:string};if(!response.ok||!payload.url)throw new Error('portal');window.location.assign(payload.url);}catch{setPaidMessage(lang==='ja'?'請求管理を開けませんでした。':'Could not open billing management.');setPaidBusy(false);}},[session,authHeaders,lang]);
  const refreshBilling=useCallback(async()=>{if(!session)return;setPaidBusy(true);setPaidMessage(lang==='ja'?'サブスクリプションを確認中…':'Confirming your subscription…');try{const response=await fetch('/api/billing/architecture-review/refresh',{method:'POST',headers:authHeaders()});if(!response.ok)throw new Error('refresh');await loadAccess();setPaidMessage(null);}catch{setPaidMessage(lang==='ja'?'現在アクセスを確認できません。後でもう一度お試しください。':'Access cannot be verified right now. Try again later.');}finally{setPaidBusy(false);}},[session,authHeaders,loadAccess,lang]);

  const run=useCallback(async()=>{if(!evidence||busy.current||!session||(access?.state!=='active'&&access?.state!=='active_canceling'))return; busy.current=true; const previous=state.result; setState({status:'loading',result:previous,stale:Boolean(previous&&previous.workflowFingerprint!==fingerprint),errorCode:null}); trackEvent('architecture_review_requested',{review_version:ARCHITECTURE_REVIEW_RESULT_VERSION,evidence_version:ARCHITECTURE_REVIEW_EVIDENCE_VERSION,access_mode:'paid_subscription_v0'});
    try{const response=await fetch('/api/architecture-review',{method:'POST',headers:{'Content-Type':'application/json',...authHeaders(),'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({version:'0.1.0',locale:lang,evidence})}); const payload=await response.json() as {result?:ArchitectureReviewResultV0;error?:ArchitectureReviewErrorCode}; if(!response.ok||!payload.result)throw Object.assign(new Error('review failed'),{code:payload.error??'provider_error'}); const result=payload.result; setDisplayEvidence(evidence); setState({status:'available',result,stale:result.workflowFingerprint!==currentFingerprint.current,errorCode:null}); trackEvent('architecture_review_completed',{review_version:ARCHITECTURE_REVIEW_RESULT_VERSION,evidence_version:ARCHITECTURE_REVIEW_EVIDENCE_VERSION,access_mode:'paid_subscription_v0'});await loadAccess();}
    catch(error){const code=((error as {code?:ArchitectureReviewErrorCode}).code??'provider_error') as ArchitectureReviewErrorCode; setState({status:'error',result:previous,stale:Boolean(previous&&previous.workflowFingerprint!==currentFingerprint.current),errorCode:code}); trackEvent('architecture_review_failed',{review_version:ARCHITECTURE_REVIEW_RESULT_VERSION,error_code:code,access_mode:'paid_subscription_v0'});await loadAccess();}finally{busy.current=false;}},[evidence,fingerprint,lang,state.result,session,access?.state,authHeaders,loadAccess]);
  const canRun=Boolean(session&&(access?.state==='active'||access?.state==='active_canceling'));
  return{state,evidence,displayEvidence:state.result?displayEvidence:evidence,run,currentWorkflowFingerprint:fingerprint,paid:{session,authLoading,access,offer,busy:paidBusy,checkoutSyncing,message:paidMessage,canRun,signIn,signOut,checkout,manageBilling,refreshBilling}};
}
export type ReturnTypeOfUseArchitectureReview=ReturnType<typeof useArchitectureReview>;
