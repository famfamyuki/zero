import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return url.origin === 'http://127.0.0.1:3107' ? route.continue() : route.abort();
  });
});

test('portable JSON roundtrip and keyboard Preflight remain available without paid services', async ({ page }, testInfo) => {
  const japanese = testInfo.project.name.endsWith('ja');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.name));
  await page.goto('/');
  await expect(page.locator('#overview-heading')).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('banner').getByRole('button', { name: 'AgentGraph JSON', exact: true }).click();
  const artifact = await download;
  const path = await artifact.path();
  expect(path).not.toBeNull();
  const original = JSON.parse(await readFile(path!, 'utf8'));
  expect(original.nodes.length).toBeGreaterThan(0);
  original.crewConfig.name = 'Harness roundtrip';

  page.on('dialog', (dialog) => dialog.accept());
  await page.getByLabel(japanese ? 'JSON読込' : 'Import JSON', { exact: true }).setInputFiles({ name: 'roundtrip.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(original)) });
  await expect(page.getByRole('heading', { name: 'Harness roundtrip', exact: true })).toBeVisible();
  await page.getByRole('navigation').getByRole('button', { name: japanese ? 'Preflightレビュー' : 'Preflight', exact: true }).click();
  await expect(page.locator('#unified-preflight-heading')).toBeVisible();
  // Opening the panel focuses its heading after two animation frames. Wait for
  // that accessibility transition before testing keyboard tab navigation.
  await expect(page.locator('#unified-preflight-heading')).toBeFocused();
  const tabs = page.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  const secondDownload = page.waitForEvent('download');
  await page.getByRole('banner').getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('banner').getByRole('button', { name: 'AgentGraph JSON', exact: true }).click();
  const roundtrip = await secondDownload;
  const restored = JSON.parse(await readFile((await roundtrip.path())!, 'utf8'));
  expect(restored).toEqual(original);
  await page.screenshot({ path: testInfo.outputPath('preflight.png') });
  expect(errors).toEqual([]);
});

test('template discovery and static CrewAI import reach Design without executing Python', async ({ page }, testInfo) => {
  const japanese = testInfo.project.name.endsWith('ja');
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('/');
  await page.getByRole('link', { name: /Example \/ Template/ }).click();
  await expect(page).toHaveURL(/\/templates/);
  await expect(page.getByRole('heading').first()).toBeVisible();
  await page.goto('/');
  await page.locator('input[type="file"][accept=".py,text/x-python"]').first().setInputFiles('tests/fixtures/crewai-import/supported-minimal.py');
  await expect(page.getByRole('dialog')).toBeVisible();
  // Mapping preview must exist before any apply action; imported Python is data.
  const apply = page.getByRole('dialog').getByRole('button', { name: japanese ? 'ワークフローを置換' : 'Replace workflow', exact: true });
  await expect(apply).toBeEnabled();
  await apply.click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('navigation').getByRole('button', { name: japanese ? '設計' : 'Design', exact: true }).click();
  await expect(page.getByText('Researcher', { exact: true }).first()).toBeVisible();
  await page.getByRole('banner').getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('banner').getByRole('button', { name: 'CrewAI Python', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('from crewai import');
});
