import { evaluateReadiness } from '../lib/readiness';
import { validateGraph } from '../lib/transpiler/validation';
import { createSemanticPlan } from '../lib/transpiler/semantic-plan';
import { createExecutionPreviewReadModel } from '../lib/execution-preview';
import { createResourceAnalysisReadModel } from '../lib/resource-analysis';
import { createArchitectureReviewEvidence } from '../lib/architecture-review/evidence';
import { OpenAIArchitectureReviewer } from '../lib/architecture-review/providers/openai';
import { assembleArchitectureReviewResult, InvalidReviewerOutputError } from '../lib/architecture-review/result-validation';
import { ARCHITECTURE_REVIEW_EVAL_FIXTURES } from './architecture-review-fixtures';
import { detectHardViolations, scoreSemanticResult, type HardViolation } from './architecture-review-evaluation';
import { ZodError } from 'zod';

const PRICES = { input: 4, cachedInput: 0.4, output: 20 } as const;
type EvalMode = 'diagnostic' | 'full';

const arg = (name: string) => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1]; };
const numberArg = (name: string, fallback: number) => { const value = Number(arg(name) ?? fallback); if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be a positive number.`); return value; };
const estimateCost = (input: number | null, cached: number | null, output: number | null) => {
  if (input === null || output === null) return null;
  const cachedTokens = Math.min(cached ?? 0, input);
  return ((input - cachedTokens) * PRICES.input + cachedTokens * PRICES.cachedInput + output * PRICES.output) / 1_000_000;
};

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required for the optional live evaluation.');
  if (ARCHITECTURE_REVIEW_EVAL_FIXTURES.length !== 10) throw new Error('Architecture fixtures A-J are required.');
  const mode = (arg('--mode') ?? 'full') as EvalMode;
  if (mode !== 'diagnostic' && mode !== 'full') throw new Error('--mode must be diagnostic or full.');
  const maxSpendUsd = numberArg('--max-spend-usd', mode === 'diagnostic' ? 4 : 34);
  const diagnosticCalls = Math.floor(numberArg('--calls', 3));
  if (mode === 'diagnostic' && (diagnosticCalls < 1 || diagnosticCalls > 3)) throw new Error('Diagnostic calls must be between 1 and 3.');
  const schedule = mode === 'full'
    ? ARCHITECTURE_REVIEW_EVAL_FIXTURES.flatMap((fixture) => [1, 2, 3].map((run) => ({ fixture, run })))
    : ARCHITECTURE_REVIEW_EVAL_FIXTURES.filter((fixture) => ['A', 'J', 'B'].includes(fixture.id)).slice(0, diagnosticCalls).map((fixture) => ({ fixture, run: 1 }));
  const reviewer = new OpenAIArchitectureReviewer();
  const hardViolations: HardViolation[] = [];
  const fixtureScores = new Map<string, { passed: number; total: number }>();
  const calls: Array<Record<string, unknown>> = [];
  let semanticPassed = 0, semanticTotal = 0, estimatedSpendUsd = 0;

  for (const { fixture, run } of schedule) {
    const graph = fixture.graph;
    const validation = validateGraph(graph.nodes, graph.edges, graph.crewConfig, 'scaffold');
    if (!validation.isValid) throw new Error(`Fixture ${fixture.id} is invalid.`);
    const plan = createSemanticPlan(graph.nodes, graph.edges, graph.crewConfig, validation);
    const evidence = createArchitectureReviewEvidence({ graph, readiness: evaluateReadiness(graph), execution: createExecutionPreviewReadModel(plan), resources: createResourceAnalysisReadModel(plan) });
    try {
      const draft = await reviewer.review({ evidence, locale: 'en' });
      const result = assembleArchitectureReviewResult(draft, evidence, { providerId: reviewer.providerId, modelId: reviewer.model, locale: 'en' });
      const violations = detectHardViolations(fixture, run, result, evidence);
      const checks = scoreSemanticResult(fixture, result, evidence);
      const estimatedCostUsd = estimateCost(reviewer.usage.inputTokens, reviewer.usageDetails.cachedInputTokens, reviewer.usage.outputTokens);
      if (estimatedCostUsd === null) throw new Error('Provider usage unavailable; stopping to avoid unbounded spend.');
      estimatedSpendUsd += estimatedCostUsd;
      hardViolations.push(...violations); semanticPassed += checks.filter((check) => check.passed).length; semanticTotal += checks.length;
      const score = fixtureScores.get(fixture.id) ?? { passed: 0, total: 0 }; score.passed += checks.filter((check) => check.passed).length; score.total += checks.length; fixtureScores.set(fixture.id, score);
      calls.push({ fixture: fixture.id, run, model: reviewer.model, inputTokens: reviewer.usage.inputTokens, cachedInputTokens: reviewer.usageDetails.cachedInputTokens, outputTokens: reviewer.usage.outputTokens, reasoningTokens: reviewer.usageDetails.reasoningTokens, estimatedCostUsd, result: 'valid', hardViolations: violations, semanticChecks: checks });
      if (violations.length > 0) break;
    } catch (error) {
      const structured = error instanceof InvalidReviewerOutputError || error instanceof ZodError || (error instanceof Error && error.message === 'invalid_reviewer_output');
      const code = structured ? 'structured_schema_failure' : 'provider_or_structured_output_failure';
      const violation = { fixtureId: fixture.id, run, code } satisfies HardViolation;
      hardViolations.push(violation);
      calls.push({ fixture: fixture.id, run, model: reviewer.model, inputTokens: reviewer.usage.inputTokens, cachedInputTokens: reviewer.usageDetails.cachedInputTokens, outputTokens: reviewer.usage.outputTokens, reasoningTokens: reviewer.usageDetails.reasoningTokens, estimatedCostUsd: estimateCost(reviewer.usage.inputTokens, reviewer.usageDetails.cachedInputTokens, reviewer.usage.outputTokens), result: 'invalid', hardViolations: [violation], semanticChecks: [], failureCategory: code });
      break;
    }
    if (estimatedSpendUsd >= maxSpendUsd) break;
  }
  const percent = semanticTotal === 0 ? 0 : Number((semanticPassed / semanticTotal * 100).toFixed(2));
  const byFixture = Object.fromEntries([...fixtureScores].map(([id, score]) => [id, { ...score, percent: Number((score.passed / score.total * 100).toFixed(2)) }]));
  console.log(JSON.stringify({ mode, model: reviewer.model, pricingUsdPerMillionTokens: PRICES, maxSpendUsd, estimatedSpendUsd: Number(estimatedSpendUsd.toFixed(6)), reviews: calls.length, expectedReviews: schedule.length, stoppedEarly: calls.length !== schedule.length, calls, hardViolationCount: hardViolations.length, hardViolations, semanticRubric: { passed: semanticPassed, total: semanticTotal, percent, targetPercent: 90, byFixture } }, null, 2));
  if (calls.length !== schedule.length || hardViolations.length > 0 || percent < 90) process.exitCode = 1;
}

main().catch((error) => { console.error(error instanceof Error ? error.message : 'Architecture review evaluation failed.'); process.exitCode = 1; });
