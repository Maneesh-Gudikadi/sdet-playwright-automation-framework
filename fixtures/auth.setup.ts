import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

/**
 * Auth Setup — Runs once before any test suite.
 * Saves browser storage state so tests skip login.
 * This is Playwright's recommended pattern for authenticated tests.
 */
setup('authenticate', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.fill('[data-test="username"]', process.env.TEST_USERNAME || 'standard_user');
  await page.fill('[data-test="password"]', process.env.TEST_PASSWORD || 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // Wait for successful login redirect
  await page.waitForURL('**/inventory.html');

  // Save auth state to disk — reused across all tests
  await page.context().storageState({ path: authFile });

  console.log('✅ Auth state saved to', authFile);
});
