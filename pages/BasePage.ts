import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — All page objects extend this class.
 * Provides reusable helpers for waits, actions, assertions, and logging.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  // ─── Element Actions ─────────────────────────────────────────────────────────

  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  async getElementText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) ?? '';
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async hoverElement(locator: Locator): Promise<void> {
    await locator.hover();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async assertURL(expectedURL: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async assertTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async assertText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  async assertNotVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  // ─── Waits ───────────────────────────────────────────────────────────────────

  async waitForElement(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForResponse(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForResponse(urlPattern);
  }

  async waitForSeconds(seconds: number): Promise<void> {
    await this.page.waitForTimeout(seconds * 1000);
  }

  // ─── Screenshot / Debug ──────────────────────────────────────────────────────

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}
