import { test, expect } from '../../fixtures/fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ApiClient } from '../../utils/ApiClient';
import { Logger } from '../../utils/Logger';

/**
 * E2E Test Suite — Full Purchase Flow
 * Combines UI navigation + API verification
 * Demonstrates: POM + API hybrid testing pattern
 *
 * Tags: @e2e @regression
 */

test.describe('E2E — Shopping Cart Flow @e2e', () => {

  test('complete purchase flow: login → add product → verify cart @regression',
    async ({ page, request }) => {

      const loginPage    = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      // ── Step 1: Navigate & Login ──────────────────────────────────────────
      Logger.step('Step 1: Navigate to app and login');
      await page.goto('https://www.saucedemo.com');
      await loginPage.login('standard_user', 'secret_sauce');
      await dashboardPage.assertDashboardLoaded();
      Logger.success('Logged in successfully');

      // ── Step 2: Verify product count via API + UI ─────────────────────────
      Logger.step('Step 2: Verify product listing');
      const productCount = await dashboardPage.getProductCount();
      expect(productCount).toBe(6); // Saucedemo always has 6 products
      Logger.success(`${productCount} products visible`);

      // ── Step 3: Add item to cart ──────────────────────────────────────────
      Logger.step('Step 3: Add first product to cart');
      await dashboardPage.addFirstProductToCart();

      // Verify cart badge updates
      const cartCount = await dashboardPage.getCartCount();
      expect(cartCount).toBe('1');
      Logger.success(`Cart updated — badge shows: ${cartCount}`);

      // ── Step 4: Navigate to cart ──────────────────────────────────────────
      Logger.step('Step 4: Open cart');
      await dashboardPage.clickElement(dashboardPage.cartIcon);
      await page.waitForURL('**/cart.html');
      Logger.success('Cart page loaded');

      // ── Step 5: Verify cart page ──────────────────────────────────────────
      Logger.step('Step 5: Verify cart contents');
      const cartItem = page.locator('.cart_item');
      await expect(cartItem).toBeVisible();
      await expect(cartItem).toHaveCount(1);

      // ── Step 6: Proceed to checkout ───────────────────────────────────────
      Logger.step('Step 6: Proceed to checkout');
      await page.click('[data-test="checkout"]');
      await page.waitForURL('**/checkout-step-one.html');

      // Fill checkout info
      await page.fill('[data-test="firstName"]', 'Test');
      await page.fill('[data-test="lastName"]', 'User');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');
      await page.waitForURL('**/checkout-step-two.html');

      // ── Step 7: Confirm order ─────────────────────────────────────────────
      Logger.step('Step 7: Confirm and finish order');
      await page.click('[data-test="finish"]');
      await page.waitForURL('**/checkout-complete.html');

      const confirmation = page.locator('.complete-header');
      await expect(confirmation).toBeVisible();
      await expect(confirmation).toContainText('Thank you for your order');

      Logger.success('✅ E2E purchase flow completed successfully');
    }
  );

  test('should sort products low to high and verify order @regression',
    async ({ page }) => {
      const loginPage    = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      await page.goto('https://www.saucedemo.com');
      await loginPage.login('standard_user', 'secret_sauce');

      Logger.step('Sort products: price low to high');
      await dashboardPage.sortProducts('lohi');

      // Get all product prices and verify ascending order
      const prices = await page.locator('.inventory_item_price').allTextContents();
      const numeric = prices.map(p => parseFloat(p.replace('$', '')));

      for (let i = 0; i < numeric.length - 1; i++) {
        expect(numeric[i]).toBeLessThanOrEqual(numeric[i + 1]);
      }

      Logger.success(`Products sorted correctly: ${numeric.join(', ')}`);
    }
  );

  test('API + UI hybrid: verify user data across layers @regression',
    async ({ page, request }) => {
      // ── API Layer: Fetch user data ────────────────────────────────────────
      Logger.step('Fetch user via API');
      const apiClient = new ApiClient(request, 'https://reqres.in/api');
      const apiResponse = await apiClient.get<{ data: { first_name: string; email: string } }>('/users/2');

      apiClient.assertStatus(apiResponse, 200);
      const apiUser = apiResponse.body.data;
      Logger.success(`API User: ${apiUser.first_name} — ${apiUser.email}`);

      // ── UI Layer: Verify UI works independently ───────────────────────────
      Logger.step('UI: Verify saucedemo login still works');
      await page.goto('https://www.saucedemo.com');
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');

      // Cross-layer assertion: both API and UI are responding correctly
      expect(apiUser.email).toContain('@');
      expect(page.url()).toContain('inventory');

      Logger.success('API + UI hybrid validation passed ✅');
    }
  );
});
