class PlaywrightInventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  itemRootSelector(name) {
    return `xpath=//div[text()="${name}"]//ancestor::div[contains(@class,'inventory_item')]`;
  }

  addButtonSelector(name) {
    return `${this.itemRootSelector(name)}//button[text()='Add to cart']`;
  }

  removeButtonSelector(name) {
    return `${this.itemRootSelector(name)}//button[text()='Remove']`;
  }

  cartIconSelector() {
    return 'css=span.shopping_cart_link';
  }

  async isAtInventoryPage() {
    await this.page.waitForLoadState('networkidle');
    return (await this.page.title()).includes('Swag Labs');
  }

  async addToCartByName(name) {
    const addSel = this.addButtonSelector(name);
    console.log(`[PW] Waiting for add button for ${name}`);
    await this.page.waitForSelector(addSel, { state: 'visible', timeout: 10000 });
    await this.page.click(addSel);
    // wait for remove button
    const removeSel = this.removeButtonSelector(name);
    await this.page.waitForSelector(removeSel, { state: 'visible', timeout: 10000 });
    return name;
  }

  async removeFromCartByName(name) {
    const removeSel = this.removeButtonSelector(name);
    await this.page.waitForSelector(removeSel, { state: 'visible', timeout: 10000 });
    await this.page.click(removeSel);
    // wait for add button to reappear
    const addSel = this.addButtonSelector(name);
    await this.page.waitForSelector(addSel, { state: 'visible', timeout: 10000 });
  }

  async clickCart() {
    await this.page.click(this.cartIconSelector());
    await this.page.waitForLoadState('networkidle');
  }

  async isAtCartPage() {
    try {
      await this.page.waitForSelector("xpath=//div[@class='header_secondary_container']/span[text()='Your Cart']", { timeout: 5000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async isItemInCart(name) {
    try {
      await this.page.waitForSelector(`xpath=//div[@class='cart_item']//div[text()="${name}"]`, { timeout: 5000 });
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = PlaywrightInventoryPage;
