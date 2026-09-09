import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3107',
    browserName: 'chromium',
    serviceWorkers: 'block',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-en', use: { locale: 'en-US', viewport: { width: 1280, height: 900 } } },
    { name: 'mobile-ja', use: { locale: 'ja-JP', viewport: { width: 320, height: 740 } } },
  ],
  webServer: {
    command: 'node scripts/smoke-server.mjs',
    url: 'http://127.0.0.1:3107',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
