import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PaidAccess, PolicyNavigation, reviewFailureMessage } from '../components/editor/unified-preflight/ArchitectureReviewStageContent';

const policyUrls = {
  terms: 'https://policies.agentgraph-studio.com/terms',
  privacy: 'https://policies.agentgraph-studio.com/privacy',
  support: 'https://support.agentgraph-studio.com/',
};
const offer = {
  version: '0.1.0' as const,
  enabled: true,
  displayName: 'Architecture Review',
  price: { currency: 'usd', unitAmount: 1200, interval: 'month' as const },
  includedReviews: 10,
  policyUrls,
};
const quota = { limit: 10, consumed: 1, reserved: 0, remaining: 9, periodEnd: '2026-10-01T00:00:00.000Z' };
const noop = () => undefined;
const paid = (overrides: Record<string, unknown> = {}) => ({
  session: null,
  authLoading: false,
  access: null,
  offer,
  busy: false,
  checkoutSyncing: false,
  message: null,
  canRun: false,
  signIn: noop,
  signOut: noop,
  checkout: noop,
  manageBilling: noop,
  refreshBilling: noop,
  ...overrides,
}) as any;
const renderPaid = (ja: boolean, overrides: Record<string, unknown> = {}) =>
  renderToStaticMarkup(React.createElement(PaidAccess, { paid: paid(overrides), ja }));
const assertOrder = (html: string, values: readonly string[]) => {
  const positions = values.map((value) => html.indexOf(value));
  assert.ok(positions.every((position) => position >= 0), values.filter((_value, index) => positions[index] < 0).join(', '));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
};

test('CPUX-T01/T02 signed-out EN and JA show exact pre-auth commercial summaries before sign-in and policies', () => {
  const en = renderPaid(false);
  assertOrder(en, [
    'Architecture Review',
    'USD 12.00/month · 10 Architecture Reviews per billing period',
    'An evidence-grounded architecture review of your current workflow.',
    'Monthly subscription. Renews each month until canceled.',
    'Unused reviews do not roll over.',
    'A provider, timeout, or result-validation failure',
    'Canceling does not automatically provide a prorated refund',
    'Taxes are calculated separately at Checkout when applicable.',
    'Email me a sign-in link',
    '>Terms<', '>Privacy<', '>Support<',
  ]);
  const ja = renderPaid(true);
  assertOrder(ja, [
    'Architecture Review',
    '月額USD 12.00 · 1請求期間あたりArchitecture Review 10回',
    '現在のワークフローを対象とした、Evidenceに基づくアーキテクチャレビューです。',
    '月額サブスクリプションです。解約するまで毎月更新されます。',
    '未使用のレビュー回数は繰り越されません。',
    '有効なArchitecture Reviewが生成されなかったプロバイダーエラー',
    '解約しても、未使用期間について日割り返金が自動的に行われることはありません。',
    '税金は、該当する場合、Checkoutで別途計算されます。',
    'サインインリンクをメールで受け取る',
    '>利用規約<', '>プライバシー<', '>サポート<',
  ]);
});

test('CPUX-T03 no-entitlement keeps exact summary before Subscribe and policy navigation', () => {
  for (const ja of [false, true]) {
    const html = renderPaid(ja, { session: {}, access: { version: '0.1.0', state: 'no_entitlement', quota: null, cancelAtPeriodEnd: false } });
    assertOrder(html, ja
      ? ['月額USD 12.00', '現在のワークフロー', '月額サブスクリプション', '未使用のレビュー', '有効なArchitecture Review', '日割り返金', 'Checkoutで別途計算', '購読してArchitecture Reviewを利用', '>利用規約<', '>プライバシー<', '>サポート<']
      : ['USD 12.00/month', 'An evidence-grounded', 'Monthly subscription', 'Unused reviews', 'A provider, timeout', 'prorated refund', 'Taxes are calculated', 'Subscribe and unlock Architecture Review', '>Terms<', '>Privacy<', '>Support<']);
  }
});

test('CPUX-T04 policy navigation remains available in every offer-enabled paid state', () => {
  const states = ['active', 'active_canceling', 'quota_exhausted', 'billing_blocked', 'sync_degraded'] as const;
  for (const state of states) {
    const html = renderPaid(false, { session: {}, access: { version: '0.1.0', state, quota, cancelAtPeriodEnd: state === 'active_canceling' } });
    for (const label of ['Terms', 'Privacy', 'Support']) assert.match(html, new RegExp(`>${label}<`), state);
  }
  const syncing = renderPaid(false, { session: {}, checkoutSyncing: true });
  for (const label of ['Terms', 'Privacy', 'Support']) assert.match(syncing, new RegExp(`>${label}<`));
});

test('CPUX-T05 failed paid reviews preserve non-consumption copy and an in-context Support path', () => {
  for (const code of ['provider_error', 'provider_timeout', 'invalid_reviewer_output'] as const) {
    assert.match(reviewFailureMessage(code, false), /no included review was used/);
    assert.match(reviewFailureMessage(code, true), /レビュー回数は使用されませんでした/);
  }
  const html = renderPaid(false, { session: {}, access: { version: '0.1.0', state: 'active', quota, cancelAtPeriodEnd: false } });
  assert.match(html, /Need help with billing, a duplicate charge, a failed review, a refund request, or account deletion\? Contact Support\./);
  assert.match(html, /href="https:\/\/support\.agentgraph-studio\.com\/"/);
});

test('CPUX-T07 enabled offer without all policy URLs cannot expose Subscribe', () => {
  const incompleteOffer = { ...offer, policyUrls: null };
  const html = renderPaid(false, { session: {}, offer: incompleteOffer, access: { version: '0.1.0', state: 'no_entitlement', quota: null, cancelAtPeriodEnd: false } });
  assert.doesNotMatch(html, /Subscribe and unlock Architecture Review/);
  assert.match(html, /Checkout is unavailable until paid-service policy information can be verified/);
});

test('CPUX-T08/T09 policy navigation is semantic, keyboard-visible, new-tab-safe, and wrap-safe', () => {
  const en = renderToStaticMarkup(React.createElement(PolicyNavigation, { policyUrls, ja: false }));
  const ja = renderToStaticMarkup(React.createElement(PolicyNavigation, { policyUrls, ja: true }));
  assert.match(en, /<nav aria-label="Paid service policies"/);
  assert.match(ja, /<nav aria-label="有料サービスポリシー"/);
  for (const html of [en, ja]) {
    assert.equal((html.match(/<a /g) ?? []).length, 3);
    assert.equal((html.match(/target="_blank"/g) ?? []).length, 3);
    assert.equal((html.match(/rel="noreferrer"/g) ?? []).length, 3);
    assert.equal((html.match(/min-h-11/g) ?? []).length, 3);
    assert.match(html, /flex-wrap/);
    assert.match(html, /break-words/);
    assert.match(html, /focus-visible:ring-2/);
  }
  assert.match(en, /opens in a new tab/);
  assert.match(ja, /新しいタブで開きます/);
  const source = readFileSync('components/editor/unified-preflight/ArchitectureReviewStageContent.tsx', 'utf8');
  assert.doesNotMatch(source, /whitespace-nowrap|fixed-height|h-\[[^\]]+\]/);
});

test('CPUX-AC-04 provider disclosure is exact in EN/JA and remains presentation-only', () => {
  const source = readFileSync('components/editor/unified-preflight/ArchitectureReviewStageContent.tsx', 'utf8');
  assert.match(source, /Running Architecture Review sends the minimum necessary workflow-derived representation to the configured AI provider\. Secrets and tool parameter values are excluded\. The review does not change your workflow\./);
  assert.match(source, /Architecture Reviewを実行すると、必要最小限のワークフロー由来情報が設定されたAIプロバイダーへ送信されます。シークレットとツールパラメータの値は除外されます。レビューはワークフローを変更しません。/);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
});
