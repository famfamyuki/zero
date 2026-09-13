import { expect, test } from '@playwright/test';

test('Preview discovery exposes existing sign-in while paid offer is off, without invoking review', async ({ page, context }, testInfo) => {
  const japanese = testInfo.project.name.endsWith('ja');
  let reviewRequests = 0;
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== 'http://127.0.0.1:3107') return route.abort();
    if (url.pathname === '/api/architecture-review/preview-access') return route.fulfill({ json: { enabled: true, allowed: false } });
    if (url.pathname === '/api/architecture-review') { reviewRequests++; return route.abort(); }
    return route.continue();
  });
  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: japanese ? 'Preflightレビュー' : 'Preflight', exact: true }).click();
  await page.getByRole('tab', { name: japanese ? 'アーキテクチャ' : 'Architecture', exact: true }).click();
  await expect(page.getByLabel(japanese ? 'メールアドレス' : 'Email address', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: japanese ? 'サインインリンクをメールで受け取る' : 'Email me a sign-in link', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: japanese ? 'アーキテクチャレビューを実行' : 'Run Architecture Review', exact: true })).toBeDisabled();
  await expect(page.getByText('Preview test mode', { exact: true })).toHaveCount(0);
  expect(reviewRequests).toBe(0);
});
