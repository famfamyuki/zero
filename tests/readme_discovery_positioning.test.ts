import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readme = readFileSync('README.md', 'utf8');

test('README presents the exact CrewAI Preflight Engineering contract', () => {
  assert.match(readme, /^# AgentGraph Studio$/m);
  assert.match(readme, /^\*\*Preflight Engineering for CrewAI Workflows\*\*$/m);
  assert.match(readme, /^Design, review, and export CrewAI workflows before you run them\.$/m);
  assert.match(readme, /pre-execution engineering tool for developers building CrewAI workflows/);
  assert.match(readme, /visual builder, a template, or JSON import/);
});

test('README links to the canonical Production root and templates destinations', () => {
  assert.match(readme, /\[Open AgentGraph Studio\]\(https:\/\/zero-six-khaki\.vercel\.app\/\)/);
  assert.match(readme, /\[Browse templates\]\(https:\/\/zero-six-khaki\.vercel\.app\/templates\)/);
  assert.match(readme, /\[Browse CrewAI templates\]\(https:\/\/zero-six-khaki\.vercel\.app\/templates\)/);
});

test('README accurately names the static review and deterministic handoff capabilities', () => {
  assert.match(readme, /\*\*Readiness\*\* — static findings about workflow and configuration readiness\./);
  assert.match(readme, /\*\*Execution Preview\*\* — the execution structure implied by the current workflow\./);
  assert.match(readme, /\*\*Resource Analysis\*\* — static resource and complexity implications and hotspots\./);
  assert.match(readme, /Unified Preflight Review/);
  assert.match(readme, /deterministic Python/);
  assert.match(readme, /static pre-execution engineering review/);
});

test('README removes stale positioning and discovery metadata', () => {
  assert.doesNotMatch(readme, /Visual AI Agent Workflow Builder & Code Generator for CrewAI\./);
  assert.doesNotMatch(readme, /Marketplace/i);
  assert.doesNotMatch(readme, /Author(?: Email)?\s*:/i);
  assert.doesNotMatch(readme, /Timestamp\s*:/i);
  assert.doesNotMatch(readme, /zero[- ]cost/i);
  assert.doesNotMatch(readme, /open source/i);
});

test('README keeps runtime claims inside the explicit negative scope boundary', () => {
  const negativeScope = 'It does not execute agents, simulate a live run, monitor production workflows, or predict runtime latency, token consumption, or cost.';
  assert.ok(readme.includes(negativeScope));
  const positiveCopy = readme.replace(negativeScope, '');
  const unsupportedPositiveClaims = [
    /executes? agents/i,
    /runs? agents/i,
    /simulates? (?:a )?live run/i,
    /monitors? production workflows/i,
    /live execution tracing/i,
    /predicts? runtime (?:latency|cost)/i,
    /predicts? token consumption/i,
    /production[- ]ready/i,
    /safety guarantee/i,
    /framework[- ](?:neutral|agnostic)/i,
  ];
  for (const claim of unsupportedPositiveClaims) assert.doesNotMatch(positiveCopy, claim);
});
