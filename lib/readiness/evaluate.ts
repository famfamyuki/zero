import type { GraphData, ValidationCode } from '@/types/editor';
import { READINESS_RULESET_VERSION, type ReadinessCategory, type ReadinessCounts, type ReadinessFinding, type ReadinessImpact, type ReadinessResult, type ReadinessRuleId, type ReadinessStatus } from '@/types/readiness';
import { validateGraph } from '@/lib/transpiler/validation';
import { createReadinessContext, stableCompare } from './context';
import { READINESS_RULES } from './rules';

const CATEGORIES: readonly ReadinessCategory[] = ['workflow_structure', 'execution_configuration', 'tooling', 'output_contract', 'maintainability'];
const impactRank: Record<ReadinessImpact, number> = { high: 0, medium: 1, low: 2, info: 3 };
const categoryRank = new Map(CATEGORIES.map((category, index) => [category, index]));
const targetRank = { graph: 0, crew: 1, node: 2, edge: 3, field: 4 } as const;

export class ReadinessEvaluationError extends Error {
  constructor(public readonly ruleId: ReadinessRuleId, cause: unknown) {
    super(`Readiness rule ${ruleId} failed: ${cause instanceof Error ? cause.message : 'Unknown error'}`);
    this.name = 'ReadinessEvaluationError';
    this.cause = cause;
  }
}

const emptyCounts = (): ReadinessCounts => ({ high: 0, medium: 0, low: 0, info: 0, total: 0 });
const countFindings = (findings: readonly ReadinessFinding[]): ReadinessCounts => {
  const counts = emptyCounts();
  findings.forEach((finding) => { counts[finding.impact]++; counts.total++; });
  return counts;
};
const statusFromCounts = (counts: ReadinessCounts): ReadinessStatus => counts.high > 0 ? 'needs_improvement' : counts.medium > 0 ? 'needs_attention' : 'ready';
const canonicalEvidence = (finding: ReadinessFinding): string => JSON.stringify(Object.fromEntries(Object.entries(finding.evidence || {}).sort(([a], [b]) => stableCompare(a, b))));

function emptyResult(blockedByValidationCodes: readonly ValidationCode[]): ReadinessResult {
  return {
    rulesetVersion: READINESS_RULESET_VERSION,
    evaluable: false,
    status: 'not_evaluable',
    counts: emptyCounts(),
    categories: CATEGORIES.map((category) => ({ category, status: 'not_evaluable', counts: emptyCounts() })),
    findings: [],
    blockedByValidationCodes,
  };
}

export function evaluateReadiness(graph: GraphData): ReadinessResult {
  const validation = validateGraph(graph.nodes, graph.edges, graph.crewConfig, 'scaffold');
  if (validation.errors.length > 0) {
    return emptyResult([...new Set(validation.errors.map((issue) => issue.code))].sort(stableCompare));
  }
  const context = createReadinessContext(graph, validation);
  const findings: ReadinessFinding[] = [];
  READINESS_RULES.forEach((rule) => {
    try {
      if (!rule.isApplicable(context)) return;
      rule.evaluate(context).forEach((draft) => findings.push({
        ruleId: rule.id, category: rule.category, impact: rule.impact,
        titleKey: rule.titleKey, explanationKey: rule.explanationKey,
        ...(rule.suggestionKey ? { suggestionKey: rule.suggestionKey } : {}), ...draft,
      }));
    } catch (error) {
      throw new ReadinessEvaluationError(rule.id, error);
    }
  });
  findings.sort((a, b) => impactRank[a.impact] - impactRank[b.impact]
    || (categoryRank.get(a.category)! - categoryRank.get(b.category)!)
    || stableCompare(a.ruleId, b.ruleId)
    || targetRank[a.target.scope] - targetRank[b.target.scope]
    || stableCompare(a.target.nodeId || '', b.target.nodeId || '')
    || stableCompare(a.target.edgeId || '', b.target.edgeId || '')
    || stableCompare(a.target.field || '', b.target.field || '')
    || stableCompare(canonicalEvidence(a), canonicalEvidence(b)));
  const counts = countFindings(findings);
  const categories = CATEGORIES.map((category) => {
    const categoryCounts = countFindings(findings.filter((finding) => finding.category === category));
    return { category, status: statusFromCounts(categoryCounts), counts: categoryCounts };
  });
  return { rulesetVersion: READINESS_RULESET_VERSION, evaluable: true, status: statusFromCounts(counts), counts, categories, findings, blockedByValidationCodes: [] };
}
