import { evaluateReadiness } from '../lib/readiness';
import { validateGraph } from '../lib/transpiler/validation';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { createExecutionPreviewReadModel } from '../lib/execution-preview';
import { createResourceAnalysisReadModel } from '../lib/resource-analysis';
import { createArchitectureReviewEvidence } from '../lib/architecture-review/evidence';
import { OpenAIArchitectureReviewer } from '../lib/architecture-review/providers/openai';
import { assembleArchitectureReviewResult,InvalidReviewerOutputError } from '../lib/architecture-review/result-validation';
import { ARCHITECTURE_REVIEW_EVAL_FIXTURES } from './architecture-review-fixtures';
import { detectHardViolations,scoreSemanticResult,type HardViolation } from './architecture-review-evaluation';
import { ZodError } from 'zod';

async function main(){
  if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is required for the optional live evaluation.');
  if(ARCHITECTURE_REVIEW_EVAL_FIXTURES.length!==10)throw new Error('Architecture fixtures A-J are required.');
  const reviewer=new OpenAIArchitectureReviewer();const hardViolations:HardViolation[]=[];const fixtureScores=new Map<string,{passed:number;total:number}>();let semanticPassed=0;let semanticTotal=0;let reviews=0;
  for(const fixture of ARCHITECTURE_REVIEW_EVAL_FIXTURES){
    const graph=fixture.graph;const validation=validateGraph(graph.nodes,graph.edges,graph.crewConfig,'scaffold');if(!validation.isValid)throw new Error(`Fixture ${fixture.id} is invalid.`);const plan=createSemanticPlan(graph.nodes,graph.edges,graph.crewConfig,validation);const evidence=createArchitectureReviewEvidence({graph,readiness:evaluateReadiness(graph),execution:createExecutionPreviewReadModel(plan),resources:createResourceAnalysisReadModel(plan)});
    for(let run=1;run<=3;run++){reviews++;try{const draft=await reviewer.review({evidence,locale:'en'});const result=assembleArchitectureReviewResult(draft,evidence,{providerId:reviewer.providerId,modelId:reviewer.model,locale:'en'});hardViolations.push(...detectHardViolations(fixture,run,result,evidence));const checks=scoreSemanticResult(fixture,result,evidence);const passed=checks.filter((check)=>check.passed).length;semanticPassed+=passed;semanticTotal+=checks.length;const score=fixtureScores.get(fixture.id)??{passed:0,total:0};score.passed+=passed;score.total+=checks.length;fixtureScores.set(fixture.id,score);}catch(error){const structured=error instanceof InvalidReviewerOutputError||error instanceof ZodError||(error instanceof Error&&error.message==='invalid_reviewer_output');hardViolations.push({fixtureId:fixture.id,run,code:structured?'structured_schema_failure':'provider_or_structured_output_failure'});semanticTotal+=7;const score=fixtureScores.get(fixture.id)??{passed:0,total:0};score.total+=7;fixtureScores.set(fixture.id,score);}}
  }
  const semanticRubricPercent=semanticTotal===0?0:Number((semanticPassed/semanticTotal*100).toFixed(2));const byFixture=Object.fromEntries([...fixtureScores].map(([id,score])=>[id,{...score,percent:score.total===0?0:Number((score.passed/score.total*100).toFixed(2))}]));const report={reviews,fixtures:ARCHITECTURE_REVIEW_EVAL_FIXTURES.map((fixture)=>fixture.id),runsPerFixture:3,hardViolationCount:hardViolations.length,hardViolations,semanticRubric:{passed:semanticPassed,total:semanticTotal,percent:semanticRubricPercent,targetPercent:90,byFixture}};console.log(JSON.stringify(report,null,2));if(reviews!==30||hardViolations.length>0||semanticRubricPercent<90)process.exitCode=1;
}

main().catch((error)=>{console.error(error instanceof Error?error.message:'Architecture review evaluation failed.');process.exitCode=1;});
