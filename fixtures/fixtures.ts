import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ApiClient } from '../utils/ApiClient';

/**
 * Custom Fixtures — Extend Playwright's base test with shared page objects.
 * Import `test` and `expect` from this file instead of '@playwright/test'.
 */
type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  apiClient: ApiClient;
  authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  apiClient: async ({ request }, use) => {
    const client = new ApiClient(
      request,
      process.env.API_BASE_URL || 'https://reqres.in/api',
      {
        'Content-Type': 'application/json',
      }
    );
    await use(client);
  },

  // Pre-authenticated page fixture — skips login in tests that don't test auth
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto('https://www.saucedemo.com');
    await loginPage.login(
      process.env.TEST_USERNAME || 'standard_user',
      process.env.TEST_PASSWORD || 'secret_sauce'
    );
    await use(page);
  },
});

export { expect };
