import { test, expect } from '../../fixtures/fixtures';
import { Logger } from '../../utils/Logger';

/**
 * UI Test Suite — Login Page
 * Target: https://www.saucedemo.com
 *
 * Tags: @smoke @regression @ui
 */

test.describe('Login Page @ui', () => {

  test.beforeEach(async ({loginPage }) => {
    await loginPage.goto();
  });

  test('should display login page elements correctly @smoke', async ({ loginPage }) => {
    Logger.step('Assert login page is loaded');
    await loginPage.assertLoginPageLoaded();
    Logger.success('Login page loaded with all elements visible');
  });

  test('should login successfully with valid credentials @smoke', async ({ loginPage, dashboardPage }) => {
    Logger.step('Login with valid credentials');
    await loginPage.login(
      process.env.TEST_USERNAME || 'standard_user',
      process.env.TEST_PASSWORD || 'secret_sauce'
    );

    Logger.step('Assert redirect to dashboard');
    await dashboardPage.assertDashboardLoaded();
    Logger.success('Login successful — redirected to Products page');
  });

  test('should show error for invalid credentials @regression', async ({ loginPage }) => {
    Logger.step('Login with wrong password');
    await loginPage.login('standard_user', 'wrong_password');

    Logger.step('Assert error message');
    await loginPage.assertErrorDisplayed('Username and password do not match');
    Logger.success('Error message displayed correctly');
  });

  test('should show error for locked-out user @regression', async ({ loginPage }) => {
    Logger.step('Login with locked-out user');
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.assertErrorDisplayed('Sorry, this user has been locked out');
    Logger.success('Locked-out user error shown');
  });

  test('should show error when username is missing @regression', async ({ loginPage }) => {
    Logger.step('Submit form with empty username');
    await loginPage.login('', 'secret_sauce');

    await loginPage.assertErrorDisplayed('Username is required');
  });

  test('should show error when password is missing @regression', async ({ loginPage }) => {
    Logger.step('Submit form with empty password');
    await loginPage.login('standard_user', '');

    await loginPage.assertErrorDisplayed('Password is required');
  });

  test('should have correct page title @smoke', async ({ page }) => {
    await expect(page).toHaveTitle('Swag Labs');
  });
});
