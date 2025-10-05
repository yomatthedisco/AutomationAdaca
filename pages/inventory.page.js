/**
 * InventoryPage - Page Object Model for the products (inventory) page of Sauce Demo
 */
const { By, until } = require("selenium-webdriver");
const config = require("../config");

class InventoryPage {
  constructor(driver) {
    this.driver = driver;
  }

  async isAtInventoryPage() {
    console.log("[STEP] Verifying inventory (Swag Labs) page title...");
    // Title contains Swag Labs when logged in
    await this.driver.wait(until.titleContains("Swag Labs"), config.defaultTimeout);
    console.log("[INFO] On Swag Labs inventory page.");
    return true;
  }

  /**
   * Wait for the main inventory container to be present. Use this as the canonical
   * signal that the page has loaded its product list.
   */
  async waitForInventoryContainer() {
    const inventoryContainer = By.id("inventory_container");
    await this.driver.wait(until.elementLocated(inventoryContainer), config.defaultTimeout);
    // small stabilization wait
    await this.driver.sleep(200);
  }

  _addButtonXpathFor(name) {
    return `//div[text()="${name}"]//ancestor::div[@class='inventory_item_label']/following-sibling::div/button[text()='Add to cart']`;
  }

  _removeButtonXpathFor(name) {
    return `//div[text()="${name}"]//ancestor::div[@class='inventory_item_label']/following-sibling::div/button[text()='Remove']`;
  }

  async addToCartByName(name) {
    console.log(`[STEP] Adding item to cart: ${name}`);
    // Ensure inventory container is present before searching for the item
    await this.waitForInventoryContainer();

    const itemRootXpath = `//div[text()="${name}"]//ancestor::div[contains(@class,'inventory_item')]`;
    const addBtnXpath = `${itemRootXpath}//button[text()='Add to cart']`;

    const btn = await this.driver.wait(until.elementLocated(By.xpath(addBtnXpath)), config.defaultTimeout);
    await this.driver.wait(until.elementIsVisible(btn), config.defaultTimeout);

    // Capture the displayed item name for verification
    let displayed = name;
    try {
      const nameEl = await this.driver.findElement(By.xpath(`${itemRootXpath}//div[@class='inventory_item_name']`));
      displayed = await nameEl.getText();
      console.log(`[INFO] Found item on page: ${displayed}`);
    } catch (err) {
      console.warn(`[WARN] Could not read displayed item name for ${name}:`, err && err.message ? err.message : err);
    }

    await btn.click();
    // Wait until Remove button appears to ensure the click succeeded
    const removeBtnXpath = `${itemRootXpath}//button[text()='Remove']`;
    await this.driver.wait(until.elementLocated(By.xpath(removeBtnXpath)), config.defaultTimeout);
    console.log(`[INFO] Clicked 'Add to cart' for ${displayed}`);
    return displayed;
  }

  async removeFromCartByName(name) {
    console.log(`[STEP] Removing item from cart (product page): ${name}`);
    const itemRootXpath = `//div[text()="${name}"]//ancestor::div[contains(@class,'inventory_item')]`;
    const removeBtnXpath = `${itemRootXpath}//button[text()='Remove']`;
    const btn = await this.driver.wait(until.elementLocated(By.xpath(removeBtnXpath)), config.defaultTimeout);
    await this.driver.wait(until.elementIsVisible(btn), config.defaultTimeout);
    await btn.click();
    // Wait until Add to cart button reappears as confirmation
    const addBtnXpath = `${itemRootXpath}//button[text()='Add to cart']`;
    await this.driver.wait(until.elementLocated(By.xpath(addBtnXpath)), config.defaultTimeout);
    console.log(`[INFO] Clicked 'Remove' for ${name}`);
  }

  async isRemoveButtonVisible(name) {
    try {
      const xpath = this._removeButtonXpathFor(name);
      console.log(`[STEP] Checking if 'Remove' button is visible for: ${name}`);
      const el = await this.driver.wait(until.elementLocated(By.xpath(xpath)), config.defaultTimeout);
      const visible = !!el;
      console.log(`[INFO] Remove button visible for ${name}: ${visible}`);
      return visible;
    } catch (err) {
      console.log(`[INFO] Remove button not visible for ${name}`);
      return false;
    }
  }

  async clickCart() {
    console.log("[STEP] Clicking cart icon...");
    const cart = await this.driver.wait(until.elementLocated(By.css("a.shopping_cart_link")), config.defaultTimeout);
    await this.driver.wait(until.elementIsVisible(cart), config.defaultTimeout);
    await this.driver.wait(until.elementIsEnabled(cart), config.defaultTimeout);
    await cart.click();
    console.log("[INFO] Clicked cart icon.");
  }

  async isAtCartPage() {
    try {
      console.log("[STEP] Verifying cart page header 'Your Cart'...");
      await this.driver.wait(until.elementLocated(By.xpath("//div[@class='header_secondary_container']/span[text()='Your Cart']")), config.defaultTimeout);
      console.log("[INFO] On Cart page.");
      return true;
    } catch (err) {
      console.log("[WARN] Not on Cart page:", err && err.message ? err.message : err);
      return false;
    }
  }

  async isItemInCart(name) {
    try {
      console.log(`[STEP] Checking if item is present in cart: ${name}`);
      const xpath = `//div[@class='cart_item']//div[text()="${name}"]`;
      await this.driver.wait(until.elementLocated(By.xpath(xpath)), config.defaultTimeout);
      console.log(`[INFO] Item found in cart: ${name}`);
      return true;
    } catch (err) {
      console.log(`[INFO] Item not found in cart: ${name}`);
      return false;
    }
  }
}

module.exports = InventoryPage;
