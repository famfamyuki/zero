import type { GraphData } from '@/types/editor';
import type { ResourceAnalysisReadModel } from '@/types/resource-analysis';
import { createResourceAnalysisReadModel } from '@/lib/resource-analysis';
import { createSemanticPlan, stableCompare, type SemanticPlan } from '@/lib/transpiler/semantic-plan';
import { validateGraph } from '@/lib/transpiler/validation';

export type ResourceAnalysisState =
  | { status: 'available'; result: ResourceAnalysisReadModel; blockingCodes: readonly []; error: null }
  | { status: 'empty'; result: null; blockingCodes: readonly []; error: null }
  | { status: 'invalid'; result: null; blockingCodes: readonly string[]; error: null }
  | { status: 'unavailable'; result: null; blockingCodes: readonly []; error: Error };

const unavailable = (cause: unknown): ResourceAnalysisState => ({
  status: 'unavailable',
  result: null,
  blockingCodes: [],
  error: cause instanceof Error ? cause : new Error('Resource Analysis unavailable'),
});

export function projectResourceAnalysis(
  plan: SemanticPlan,
  project: (value: SemanticPlan) => ResourceAnalysisReadModel = createResourceAnalysisReadModel,
): ResourceAnalysisState {
  try {
    return { status: 'available', result: project(plan), blockingCodes: [], error: null };
  } catch (cause) {
    return unavailable(cause);
  }
}

export function evaluateResourceAnalysis(graph: GraphData): ResourceAnalysisState {
  if (graph.nodes.length === 0 && graph.edges.length === 0) {
    return { status: 'empty', result: null, blockingCodes: [], error: null };
  }

  const validation = validateGraph(graph.nodes, graph.edges, graph.crewConfig, 'scaffold');
  if (validation.errors.length > 0) {
    const blockingCodes = [...new Set(validation.errors.map((issue) => issue.code))].sort(stableCompare);
    return { status: 'invalid', result: null, blockingCodes, error: null };
  }

  try {
    const plan = createSemanticPlan(graph.nodes, graph.edges, graph.crewConfig, validation);
    return projectResourceAnalysis(plan);
  } catch (cause) {
    return unavailable(cause);
  }
}
