import { readFileSync } from 'node:fs';
import { evaluateReadiness } from '../lib/readiness';
import { validateGraph } from '../lib/transpiler/validation';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { createExecutionPreviewReadModel } from '../lib/execution-preview';
import { createResourceAnalysisReadModel } from '../lib/resource-analysis';
import { createArchitectureReviewEvidence } from '../lib/architecture-review/evidence';
import { createReviewerEnvelope } from '../lib/architecture-review/reviewer-envelope';
import { ARCHITECTURE_REVIEWER_INSTRUCTION, createArchitectureReviewerDataEnvelope } from '../lib/architecture-review/prompt';
import { calculateUnitEconomics, distribution, pearsonCorrelation, type UnitEconomicsInputs } from '../lib/commercial-calibration';
import { ARCHITECTURE_REVIEW_EVAL_FIXTURES } from './architecture-review-fixtures';

const arg = (name: string) => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1]; };
const reportPath = arg('--report');
if (!reportPath) throw new Error('--report is required. This tool never invokes a provider.');

interface Call {
  fixture: string; run: number; inputTokens: number; cachedInputTokens: number;
  outputTokens: number; reasoningTokens: number; estimatedCostUsd: number;
  result: string; failureCategory?: string | null;
}
const report = JSON.parse(readFileSync(reportPath, 'utf8')) as { calls: Call[] };
const successful = report.calls.filter((call) => call.result === 'valid');
if (successful.length === 0) throw new Error('The report contains no successful calls.');

const metric = (selector: (call: Call) => number) => distribution(successful.map(selector));
const structures = ARCHITECTURE_REVIEW_EVAL_FIXTURES.map((fixture) => {
  const graph = fixture.graph;
  const validation = validateGraph(graph.nodes, graph.edges, graph.crewConfig, 'scaffold');
  if (!validation.isValid) throw new Error(`Fixture ${fixture.id} is invalid.`);
  const plan = createSemanticPlan(graph.nodes, graph.edges, graph.crewConfig, validation);
  const evidence = createArchitectureReviewEvidence({ graph, readiness: evaluateReadiness(graph), execution: createExecutionPreviewReadModel(plan), resources: createResourceAnalysisReadModel(plan) });
  const { providerInput } = createReviewerEnvelope(evidence);
  const evidenceBytes = new TextEncoder().encode(JSON.stringify(evidence)).byteLength;
  const providerInputBytes = new TextEncoder().encode(JSON.stringify(providerInput)).byteLength;
  const providerEnvelopeBytes = new TextEncoder().encode(JSON.stringify({ instruction: ARCHITECTURE_REVIEWER_INSTRUCTION, data: createArchitectureReviewerDataEnvelope(providerInput, 'en') })).byteLength;
  return {
    fixture: fixture.id, name: fixture.name, nodeCount: graph.nodes.length, edgeCount: graph.edges.length,
    agentCount: graph.nodes.filter((node) => node.type === 'agent').length,
    taskCount: graph.nodes.filter((node) => node.type === 'task').length,
    toolCount: graph.nodes.filter((node) => node.type === 'tool').length,
    evidenceItemCount: evidence.items.length, evidenceTargetCount: evidence.targets.length,
    serializedEvidenceBytes: evidenceBytes, providerInputBytes, providerEnvelopeBytes,
    observed: {
      inputTokens: distribution(successful.filter((call) => call.fixture === fixture.id).map((call) => call.inputTokens)),
      outputTokens: distribution(successful.filter((call) => call.fixture === fixture.id).map((call) => call.outputTokens)),
      costUsd: distribution(successful.filter((call) => call.fixture === fixture.id).map((call) => call.estimatedCostUsd)),
    },
  };
});

const unitEconomicsPath = arg('--unit-economics');
const unitEconomics = unitEconomicsPath
  ? calculateUnitEconomics(JSON.parse(readFileSync(unitEconomicsPath, 'utf8')) as UnitEconomicsInputs)
  : null;
console.log(JSON.stringify({
  method: { percentile: 'nearest-rank: rank = ceil(percentile * N)', standardDeviation: 'population' },
  successfulReviews: successful.length,
  distributions: {
    costUsd: metric((call) => call.estimatedCostUsd),
    inputTokens: metric((call) => call.inputTokens),
    cachedInputTokens: metric((call) => call.cachedInputTokens),
    nonCachedInputTokens: metric((call) => call.inputTokens - Math.min(call.cachedInputTokens, call.inputTokens)),
    outputTokens: metric((call) => call.outputTokens),
    reasoningTokens: metric((call) => call.reasoningTokens),
  },
  structures,
  observedFixtureMeanCorrelations: {
    sampleSize: structures.length,
    providerEnvelopeBytesToInputTokens: pearsonCorrelation(structures.map((item) => item.providerEnvelopeBytes), structures.map((item) => item.observed.inputTokens.mean)),
    providerEnvelopeBytesToOutputTokens: pearsonCorrelation(structures.map((item) => item.providerEnvelopeBytes), structures.map((item) => item.observed.outputTokens.mean)),
    providerEnvelopeBytesToCostUsd: pearsonCorrelation(structures.map((item) => item.providerEnvelopeBytes), structures.map((item) => item.observed.costUsd.mean)),
  },
  failedCalls: report.calls.filter((call) => call.result !== 'valid'),
  unitEconomics,
}, null, 2));
