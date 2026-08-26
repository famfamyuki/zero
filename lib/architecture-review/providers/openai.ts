import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import type { ArchitectureReviewer, ArchitectureReviewerDraftV0, ArchitectureReviewerInputV0 } from '@/types/architecture-review';
import { architectureReviewerDraftSchema } from '../schemas';
import { createReviewerEnvelope } from '../reviewer-envelope';
import { ARCHITECTURE_REVIEWER_INSTRUCTION, createArchitectureReviewerDataEnvelope } from '../prompt';
import type { ProviderUsageMetadata } from '@/types/paid-architecture-review';

export class OpenAIArchitectureReviewer implements ArchitectureReviewer {
  readonly providerId='openai';
  usage: ProviderUsageMetadata = { inputTokens: null, outputTokens: null, totalTokens: null };
  constructor(private readonly client=new OpenAI({apiKey:process.env.OPENAI_API_KEY}),readonly model=process.env.ARCHITECTURE_REVIEW_MODEL||'gpt-5.6-sol',private readonly maxOutputTokens?:number){}
  async review(input:ArchitectureReviewerInputV0,options?:{signal?:AbortSignal}):Promise<ArchitectureReviewerDraftV0>{
    const {providerInput}=createReviewerEnvelope(input.evidence);
    const response=await this.client.responses.parse({model:this.model,reasoning:{effort:'medium'},store:false,max_output_tokens:this.maxOutputTokens,input:[{role:'developer',content:ARCHITECTURE_REVIEWER_INSTRUCTION},{role:'user',content:createArchitectureReviewerDataEnvelope(providerInput,input.locale)}],text:{format:zodTextFormat(architectureReviewerDraftSchema,'architecture_review_v0')}},{signal:options?.signal});
    this.usage={inputTokens:response.usage?.input_tokens??null,outputTokens:response.usage?.output_tokens??null,totalTokens:response.usage?.total_tokens??null};
    if(!response.output_parsed) throw new Error('invalid_reviewer_output');
    return response.output_parsed as ArchitectureReviewerDraftV0;
  }
}
