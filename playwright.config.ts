import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV || 'dev'}` });

/**
 * SDET Playwright Automation Framework — Playwright Configuration
 * Supports: UI, API, E2E testing | Multi-browser | Allure + HTML reporting
 * @author Your Name
 */
export default defineConfig({
  // ─── Test Discovery ─────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ─── Execution Settings ─────────────────────────────────────────────────────
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // ─── Reporting ───────────────────────────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list'],
  ],

  // ─── Global Fixtures ─────────────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || 'https://reqres.in',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'x-api-key': process.env.API_KEY || '',
    },
  },

  // ─── Multi-Browser Projects ──────────────────────────────────────────────────
  projects: [
    // Setup project — runs auth before tests
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    // Browser suites
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },

    // API-only project (no browser needed)
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://reqres.in/api',
      },
    },
  ],

  // ─── Output Directories ───────────────────────────────────────────────────────
  outputDir: 'test-results',
});
