import { PRESET_TEMPLATES } from '../lib/presets';
import { evaluateReadiness } from '../lib/readiness';
import { validateGraph } from '../lib/transpiler/validation';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { createExecutionPreviewReadModel } from '../lib/execution-preview';
import { createResourceAnalysisReadModel } from '../lib/resource-analysis';
import { createArchitectureReviewEvidence } from '../lib/architecture-review/evidence';
import { OpenAIArchitectureReviewer } from '../lib/architecture-review/providers/openai';
import { assembleArchitectureReviewResult } from '../lib/architecture-review/result-validation';

if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is required for the optional live evaluation.');
const fixtures=PRESET_TEMPLATES.slice(0,10); if(fixtures.length<10)throw new Error('Ten architecture fixtures are required.');
const reviewer=new OpenAIArchitectureReviewer(); let completed=0;
for(const fixture of fixtures){const graph=fixture.graphData;const validation=validateGraph(graph.nodes,graph.edges,graph.crewConfig,'scaffold');if(!validation.isValid)throw new Error(`Fixture ${fixture.id} is invalid.`);const plan=createSemanticPlan(graph.nodes,graph.edges,graph.crewConfig,validation);const evidence=createArchitectureReviewEvidence({graph,readiness:evaluateReadiness(graph),execution:createExecutionPreviewReadModel(plan),resources:createResourceAnalysisReadModel(plan)});for(let run=0;run<3;run++){const draft=await reviewer.review({evidence,locale:'en'});assembleArchitectureReviewResult(draft,evidence,{providerId:reviewer.providerId,modelId:reviewer.model,locale:'en'});completed++;}}
console.log(JSON.stringify({reviews:completed,hardViolations:0,semanticRubric:'manual_release_review_required'}));
