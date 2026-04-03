import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — Page Object for authentication flow.
 * Demo target: https://www.saucedemo.com
 */
export class LoginPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput   = page.locator('[data-test="username"]');
    this.passwordInput   = page.locator('[data-test="password"]');
    this.loginButton     = page.locator('[data-test="login-button"]');
    this.errorMessage    = page.locator('[data-test="error"]');
    this.loginLogo       = page.locator('.login_logo');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getElementText(this.errorMessage);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertLoginPageLoaded(): Promise<void> {
    await this.assertVisible(this.loginLogo);
    await this.assertVisible(this.usernameInput);
    await this.assertVisible(this.loginButton);
  }

  async assertErrorDisplayed(message: string): Promise<void> {
    await this.assertVisible(this.errorMessage);
    await this.assertText(this.errorMessage, message);
  }
}
