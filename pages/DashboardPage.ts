import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage — Page Object for the main product listing page.
 * Demo target: https://www.saucedemo.com/inventory.html
 */
export class DashboardPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly productItems: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly addToCartButtons: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle       = page.locator('.title');
    this.productItems    = page.locator('.inventory_item');
    this.cartIcon        = page.locator('.shopping_cart_link');
    this.cartBadge       = page.locator('.shopping_cart_badge');
    this.sortDropdown    = page.locator('[data-test="product_sort_container"]');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.burgerMenu      = page.locator('#react-burger-menu-btn');
    this.logoutLink      = page.locator('#logout_sidebar_link');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async addFirstProductToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

  async addProductByIndex(index: number): Promise<void> {
    await this.addToCartButtons.nth(index).click();
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.selectOption(this.sortDropdown, option);
  }

  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  async getCartCount(): Promise<string> {
    return this.getElementText(this.cartBadge);
  }

  async logout(): Promise<void> {
    await this.clickElement(this.burgerMenu);
    await this.waitForElement(this.logoutLink);
    await this.clickElement(this.logoutLink);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertDashboardLoaded(): Promise<void> {
    await this.assertVisible(this.pageTitle);
    await this.assertText(this.pageTitle, 'Products');
    await this.assertURL('/inventory.html');
  }
}
