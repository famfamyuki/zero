import { expect, test, type Page, type Locator } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const findingKey = 'RDY_JSON_OUTPUT_SCHEMA_IMPLICIT:task-5';
const schema = '{"snapshot_metadata":"object","products":"array[object]"}';

test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => new URL(route.request().url()).origin === 'http://127.0.0.1:3107' ? route.continue() : route.abort());
});

// Reach every action by Tab, not programmatic focus or pointer interaction.
async function keyboardActivate(page: Page, target: Locator) {
  for (let i = 0; i < 180; i++) {
    if (await target.evaluate((element) => element === document.activeElement)) {
      await expect(target).toBeVisible();
      await page.keyboard.press('Enter');
      return;
    }
    await page.keyboard.press('Tab');
  }
  throw new Error('Action was not reachable by keyboard');
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test('representative review loop is keyboard accessible, manual, portable and provider independent', async ({ page }, info) => {
  const ja = info.project.name.endsWith('ja');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Competitor Catalog Review Crew', exact: true })).toBeVisible();
  await expect(page.locator('#launch-guide-heading')).toHaveText(ja ? 'レビューの一連の流れを試す' : 'Try the full review loop');
  await expect(page.getByText('GPT-6 Astra Challenge · September 18, 2026', { exact: true })).toBeVisible();
  const primary = page.getByRole('button', { name: ja ? 'Preflightを確認' : 'Run Preflight', exact: true });
  await expect(primary).toHaveCount(1);
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath('launch-overview.png'), fullPage: true });
  await page.locator('#launch-guide-heading').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('launch-guide.png') });
  await keyboardActivate(page, primary);
  await expect(page.locator('#unified-preflight-heading')).toBeFocused();
  await keyboardActivate(page, page.getByRole('tab', { name: ja ? '概要' : 'Overview', exact: true }));
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: ja ? '準備状況' : 'Readiness', exact: true })).toHaveAttribute('aria-selected', 'true');
  const finding = page.locator(`[data-review-item="${findingKey}"]`);
  await expect(finding).toContainText('Capture Normalized Catalog Snapshot');
  await keyboardActivate(page, finding.getByRole('button', { name: /Locate in Design|Designで場所を表示/ }));
  const field = page.locator('#inspector-output-schema');
  await expect(field).toBeFocused();
  await expect(field).toHaveAccessibleName(ja ? '出力スキーマ' : 'Output schema');
  await page.keyboard.type(schema);
  await expect(field).toHaveValue(schema);
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath('launch-schema-focus.png') });
  await keyboardActivate(page, page.getByRole('button', { name: ja ? '指摘に戻る' : 'Back to finding', exact: true }));
  await expect(finding).toHaveCount(0);
  await expect(page.locator('#unified-preflight-heading')).toBeFocused();
  await expect(page.getByText(ja ? 'ワークフロー変更後、以前のレビュー項目は存在しません。該当ステージを表示しました。' : 'The previous review item is no longer present after the workflow changed. The review stage is open.', { exact: true })).toBeAttached();
  await keyboardActivate(page, page.getByRole('button', { name: /Re-evaluate|再評価/, exact: true }));
  await expect(finding).toHaveCount(0);
  await noOverflow(page);
  await keyboardActivate(page, page.getByRole('banner').getByRole('button', { name: 'Export', exact: true }));
  const download = page.waitForEvent('download');
  await keyboardActivate(page, page.getByRole('banner').getByRole('button', { name: 'AgentGraph JSON', exact: true }));
  const artifact = JSON.parse(await readFile((await (await download).path())!, 'utf8'));
  expect(artifact.nodes.find((node: { id: string }) => node.id === 'task-5').data.outputSchema).toBe(schema);
  await keyboardActivate(page, page.getByRole('banner').getByRole('button', { name: 'Export', exact: true }));
  await keyboardActivate(page, page.getByRole('banner').getByRole('button', { name: 'CrewAI Python', exact: true }));
  await expect(page.getByRole('dialog')).toContainText('from crewai import');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('banner').getByRole('button', { name: 'Export', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test('saved and intentionally empty artifacts survive hydration without the demo guide', async ({ page }) => {
  const saved = JSON.parse(await readFile('tests/fixtures/graph-roundtrip-v1.json', 'utf8'));
  saved.crewConfig.name = 'My saved work';
  await page.addInitScript((artifact) => localStorage.setItem('agentgraph_active_flow', JSON.stringify(artifact)), saved);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'My saved work', exact: true })).toBeVisible();
  await expect(page.locator('#launch-guide-heading')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('agentgraph_active_flow')!))).toEqual(saved);
  const empty = { ...saved, nodes: [], edges: [], crewConfig: { ...saved.crewConfig, name: 'Intentionally empty' } };
  await page.addInitScript((artifact) => localStorage.setItem('agentgraph_active_flow', JSON.stringify(artifact)), empty);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Intentionally empty', exact: true })).toBeVisible();
  await expect(page.locator('#launch-guide-heading')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('agentgraph_active_flow')!).nodes)).toEqual([]);
});

test('canonical pointer edit preserves mobile return action reachability', async ({ page }, info) => {
  const ja = info.project.name.endsWith('ja');
  await page.goto('/');
  await page.getByRole('button', { name: ja ? 'Preflightを確認' : 'Run Preflight', exact: true }).click();
  await page.getByRole('tab', { name: ja ? '準備状況' : 'Readiness', exact: true }).click();
  const finding = page.locator(`[data-review-item="${findingKey}"]`);
  await finding.getByRole('button', { name: /Locate in Design|Designで場所を表示/ }).click();
  await expect(page.locator('#inspector-output-schema')).toBeFocused();
  await page.locator('#inspector-output-schema').fill(schema);
  const back = page.getByRole('button', { name: ja ? '指摘に戻る' : 'Back to finding', exact: true });
  await expect(back).toBeInViewport();
  await back.click();
  await expect(finding).toHaveCount(0);
  await expect(page.locator('#unified-preflight-heading')).toBeFocused();
  await noOverflow(page);
});

test('fieldless Readiness target keeps Inspector fallback and exact return', async ({ page }, info) => {
  const ja = info.project.name.endsWith('ja');
  const saved = JSON.parse(await readFile('tests/fixtures/graph-roundtrip-v1.json', 'utf8'));
  await page.addInitScript((artifact) => localStorage.setItem('agentgraph_active_flow', JSON.stringify(artifact)), saved);
  await page.goto('/');
  await page.getByRole('button', { name: ja ? 'Preflightを確認' : 'Run Preflight', exact: true }).click();
  await page.getByRole('tab', { name: ja ? '準備状況' : 'Readiness', exact: true }).click();
  const finding = page.locator('[data-review-item="RDY_HIERARCHICAL_ASSIGNMENT_IGNORED:task-research"]');
  await finding.getByRole('button', { name: /Locate in Design|Designで場所を表示/ }).click();
  await expect(page.locator('aside h3[tabindex="-1"]')).toBeFocused();
  await page.getByRole('button', { name: ja ? '指摘に戻る' : 'Back to finding', exact: true }).click();
  await expect(finding).toBeFocused();
});

test('HTTP metadata exposes a public repository image with truthful launch copy', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  for (const contract of ['rel="canonical" href="https://zero-six-khaki.vercel.app"', 'property="og:type" content="website"', 'property="og:site_name" content="AgentGraph Studio"', 'name="twitter:card" content="summary_large_image"', 'property="og:image:width" content="1200"', 'property="og:image:height" content="630"', 'property="og:image:alt"', 'name="twitter:image:alt"', 'https://zero-six-khaki.vercel.app/launch-preview.png']) expect(html).toContain(contract);
  expect(html).not.toMatch(/Powered by GPT-6 Astra|Astra-powered|runs on Astra/i);
  const image = await request.get('/launch-preview.png');
  expect(image.ok()).toBe(true);
  const png = await image.body();
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});

test('fault-injected unsupported field falls back; missing target refreshes without navigation', async ({ page }, info) => {
  const ja = info.project.name.endsWith('ja');
  await page.goto('/');
  await page.getByRole('button', { name: ja ? 'Preflightを確認' : 'Run Preflight', exact: true }).click();
  await page.getByRole('tab', { name: ja ? '準備状況' : 'Readiness', exact: true }).click();
  const finding = page.locator(`[data-review-item="${findingKey}"]`);
  // Test-only fault injection through mounted React props: no application debug
  // hook, persisted target identity, or evaluator-rule change is introduced.
  async function locateWith(target: { nodeId: string; field: string }) {
    await finding.evaluate((element, replacement) => {
      type Fiber = { memoizedProps?: { finding?: Record<string, unknown>; onLocateReadiness?: (finding: Record<string, unknown>) => void }; return?: Fiber };
      const key = Object.keys(element).find((key) => key.startsWith('__reactFiber$'))!;
      let fiber = (element as unknown as Record<string, Fiber>)[key];
      let original: Record<string, unknown> | undefined;
      while (fiber) {
        if (fiber.memoizedProps?.finding) original = fiber.memoizedProps.finding;
        if (fiber.memoizedProps?.onLocateReadiness && original) {
          const navigate = fiber.memoizedProps.onLocateReadiness;
          const injected = { ...original, target: { scope: 'field', ...replacement } };
          const button = element.querySelector('button')!;
          button.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            navigate(injected);
          }, { capture: true, once: true });
          button.click();
          return;
        }
        fiber = fiber.return!;
      }
      throw new Error('Mounted Readiness navigation boundary not found');
    }, target);
  }
  await locateWith({ nodeId: 'deleted-task', field: 'outputSchema' });
  await expect(page.locator('#unified-preflight-heading')).toBeVisible();
  await expect(page.getByText(ja ? '対象が変更されたため、Readinessを更新しました。' : 'Target changed. Readiness was refreshed.', { exact: true })).toBeVisible();
  await expect(page.locator('#inspector-output-schema')).toHaveCount(0);
  await expect(finding).toBeVisible();
  await locateWith({ nodeId: 'task-5', field: 'unsupported-field' });
  await expect(page.locator('aside h3[tabindex="-1"]')).toBeFocused();
  await page.getByRole('button', { name: ja ? '指摘に戻る' : 'Back to finding', exact: true }).click();
  await expect(finding).toBeFocused();
  // A node does not gain a Crew-level editable field just because the Inspector
  // also contains its Crew settings disclosure.
  await locateWith({ nodeId: 'task-5', field: 'name' });
  await expect(page.locator('aside h3[tabindex="-1"]')).toBeFocused();
  await page.getByRole('button', { name: ja ? '指摘に戻る' : 'Back to finding', exact: true }).click();
  await expect(finding).toBeFocused();
  await locateWith({ nodeId: 'task-5', field: 'outputFile' });
  await expect(page.locator('[data-inspector-field="node.outputFile"]')).toBeFocused();
  await expect(page.locator('[data-inspector-field="node.outputFile"]')).toBeVisible();
});
