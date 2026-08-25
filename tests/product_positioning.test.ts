import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { translations } from '../lib/i18n/translations';

const source = (path: string) => readFileSync(path, 'utf8');
const layout = source('app/layout.tsx');
const header = source('components/editor/Header.tsx');
const page = source('app/page.tsx');
const templatesPage = source('app/templates/page.tsx');

const expected = {
  en: {
    subTitle: 'Preflight Engineering for CrewAI • Visual Design • Deterministic Python Export',
    mainCopy: 'Preflight Engineering for CrewAI Workflows',
    subCopy: 'Design visually or import JSON, review readiness, execution structure, and resource implications before you run them, then export deterministic Python.',
    templatesSub: 'Start from a preconfigured CrewAI workflow, inspect readiness, execution structure, and resource implications in Preflight, adapt it on the canvas, then export deterministic Python.',
    templatesFooter: 'AgentGraph Studio • Free & Open Source • Preflight Engineering for CrewAI • Deterministic Python Export',
  },
  ja: {
    subTitle: 'CrewAI向けPreflight Engineering • ビジュアル設計 • Pythonコード出力',
    mainCopy: 'CrewAIワークフローのPreflight Engineering',
    subCopy: 'ビジュアル設計やJSON読込から、実行前に準備状況・実行構造・リソース上の示唆をレビューし、決定的に生成されるPythonコードとして出力できます。',
    templatesSub: '設定済みのCrewAIワークフローから始め、Preflightで準備状況・実行構造・リソース上の示唆を確認し、キャンバスで調整してからPythonコードとして出力できます。',
    templatesFooter: 'AgentGraph Studio • 無料・オープンソース • CrewAI向けPreflight Engineering • Pythonコード出力',
  },
} as const;

test('public metadata matches the canonical positioning contract exactly', () => {
  assert.match(layout, /title: 'AgentGraph Studio \| Preflight Engineering for CrewAI Workflows'/);
  assert.match(layout, /description: 'Design or import CrewAI workflows, review readiness, execution structure, and resource implications before you run them, then export deterministic Python\.'/);
});

test('English and Japanese public positioning copy is exact', () => {
  for (const lang of ['en', 'ja'] as const) {
    for (const [key, value] of Object.entries(expected[lang])) {
      assert.equal(translations[lang][key as keyof typeof expected.en], value, `${lang}.${key}`);
    }
  }
});

test('existing public copy bindings remain unchanged', () => {
  assert.match(header, /t\('subTitle'\)/);
  assert.match(page, /t\('mainCopy'\)/);
  assert.match(page, /t\('subCopy'\)/);
  assert.match(templatesPage, /t\('templatesSub'\)/);
  assert.match(templatesPage, /t\('templatesFooter'\)/);
});

test('protected titles and activation copy remain unchanged', () => {
  assert.equal(translations.en.templatesTitle, 'CrewAI Free Template Library');
  assert.equal(translations.ja.templatesTitle, 'CrewAI 無料テンプレートライブラリ');
  assert.deepEqual(
    {
      title: translations.en.preflightActivationTitle,
      body: translations.en.preflightActivationBody,
      cta: translations.en.preflightActivationCta,
    },
    {
      title: 'Review before export',
      body: 'Check readiness, execution flow, and resource implications in one preflight review.',
      cta: 'Review now',
    },
  );
  assert.equal(translations.en.unifiedPreflightEntry, 'Preflight Review');
  assert.equal(translations.en.unifiedPreflightTitle, 'Preflight Engineering Review');
  assert.equal(translations.ja.unifiedPreflightEntry, '事前レビュー');
  assert.equal(translations.ja.unifiedPreflightTitle, '事前エンジニアリングレビュー');
});

test('approved positioning copy stays within the static pre-execution boundary', () => {
  const approvedCopy = [
    layout,
    ...Object.values(expected.en),
    ...Object.values(expected.ja),
  ].join('\n').toLowerCase();
  const forbiddenClaims = [
    'execute workflows',
    'runtime agent execution',
    'simulation',
    'production monitoring',
    'live execution tracing',
    'runtime cost prediction',
    'latency prediction',
    'token consumption prediction',
    'safety guarantee',
    'production readiness guarantee',
  ];
  for (const claim of forbiddenClaims) assert.doesNotMatch(approvedCopy, new RegExp(claim));
});
