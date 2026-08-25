import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { architectureReviewRequestSchema } from '@/lib/architecture-review/schemas';
import { validateArchitectureEvidence } from '@/lib/architecture-review/evidence-validation';
import { OpenAIArchitectureReviewer } from '@/lib/architecture-review/providers/openai';
import { assembleArchitectureReviewResult, InvalidReviewerOutputError } from '@/lib/architecture-review/result-validation';
import type { ArchitectureReviewErrorCode } from '@/types/architecture-review';
import { ZodError } from 'zod';

export const runtime='nodejs'; export const dynamic='force-dynamic'; const MAX_BYTES=512*1024; const TIMEOUT_MS=45_000;
const headers={'Cache-Control':'no-store'};
const failure=(status:number,error:ArchitectureReviewErrorCode)=>NextResponse.json({version:'0.1.0',error},{status,headers});
export async function POST(request:Request){
  const declared=Number(request.headers.get('content-length')||0); if(declared>MAX_BYTES)return failure(413,'input_too_large');
  let text:string; try{text=await request.text();}catch{return failure(400,'invalid_request');} if(new TextEncoder().encode(text).byteLength>MAX_BYTES)return failure(413,'input_too_large');
  let json:unknown; try{json=JSON.parse(text);}catch{return failure(400,'invalid_request');}
  if(typeof json==='object'&&json!==null&&'version'in json&&(json as {version?:unknown}).version!=='0.1.0')return failure(400,'unsupported_contract_version');
  const parsed=architectureReviewRequestSchema.safeParse(json); if(!parsed.success)return failure(400,'invalid_request');
  const evidence=validateArchitectureEvidence(parsed.data.evidence); if(!evidence)return failure(422,'invalid_evidence');
  if(!process.env.OPENAI_API_KEY)return failure(503,'review_unavailable');
  const reviewer=new OpenAIArchitectureReviewer(); const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),TIMEOUT_MS);
  try{const draft=await reviewer.review({evidence,locale:parsed.data.locale},{signal:controller.signal}); const result=assembleArchitectureReviewResult(draft,evidence,{providerId:reviewer.providerId,modelId:reviewer.model,locale:parsed.data.locale}); return NextResponse.json({version:'0.1.0',result},{headers});}
  catch(error){if(error instanceof InvalidReviewerOutputError||error instanceof ZodError||error instanceof SyntaxError||(error instanceof Error&&error.message==='invalid_reviewer_output'))return failure(502,'invalid_reviewer_output'); if(controller.signal.aborted)return failure(504,'provider_timeout'); if(error instanceof OpenAI.RateLimitError)return failure(429,'rate_limited'); if(error instanceof OpenAI.APIError)return failure(502,'provider_error'); return failure(502,'provider_error');}
  finally{clearTimeout(timeout);}
}
