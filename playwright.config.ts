import { defineConfig, devices } from '@playwright/test';

// Allow overriding base URL for deployed environments
// e.g. BASE_URL=https://pr210.web.koenvangilst.nl npx playwright test
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const useExternalBaseURL = process.env.BASE_URL !== undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    ignoreHTTPSErrors: useExternalBaseURL
  },
  webServer: useExternalBaseURL
    ? undefined
    : {
        command: 'npm run dev -- --host 127.0.0.1',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
