/**
 * InventoryPage - Page Object Model for the products (inventory) page of Sauce Demo
 */
const { By, until } = require("selenium-webdriver");
const config = require("../config");
const logger = require('../utils/logger');

class InventoryPage {
  constructor(driver) {
    this.driver = driver;
  }

  async isAtInventoryPage() {
  logger.info('Verifying inventory (Swag Labs) page title...');
    // Title contains Swag Labs when logged in
    await this.driver.wait(until.titleContains("Swag Labs"), config.defaultTimeout);
  logger.info('On Swag Labs inventory page.');
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
  logger.info(`Adding item to cart: ${name}`);
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
  logger.info(`Found item on page: ${displayed}`);
    } catch (err) {
  logger.warn(`Could not read displayed item name for ${name}:`, err && err.message ? err.message : err);
    }

    await btn.click();
    // Wait until Remove button appears to ensure the click succeeded
    const removeBtnXpath = `${itemRootXpath}//button[text()='Remove']`;
    await this.driver.wait(until.elementLocated(By.xpath(removeBtnXpath)), config.defaultTimeout);
  logger.info(`Clicked 'Add to cart' for ${displayed}`);
    return displayed;
  }

  async removeFromCartByName(name) {
  logger.info(`Removing item from cart (product page): ${name}`);
    const itemRootXpath = `//div[text()="${name}"]//ancestor::div[contains(@class,'inventory_item')]`;
    const removeBtnXpath = `${itemRootXpath}//button[text()='Remove']`;
    const btn = await this.driver.wait(until.elementLocated(By.xpath(removeBtnXpath)), config.defaultTimeout);
    await this.driver.wait(until.elementIsVisible(btn), config.defaultTimeout);
    await btn.click();
    // Wait until Add to cart button reappears as confirmation
    const addBtnXpath = `${itemRootXpath}//button[text()='Add to cart']`;
    await this.driver.wait(until.elementLocated(By.xpath(addBtnXpath)), config.defaultTimeout);
  logger.info(`Clicked 'Remove' for ${name}`);
  }

  async isRemoveButtonVisible(name) {
    try {
      const xpath = this._removeButtonXpathFor(name);
      logger.debug(`Checking if 'Remove' button is visible for: ${name}`);
      const el = await this.driver.wait(until.elementLocated(By.xpath(xpath)), config.defaultTimeout);
      const visible = !!el;
      logger.info(`Remove button visible for ${name}: ${visible}`);
      return visible;
    } catch (err) {
      logger.info(`Remove button not visible for ${name}`);
      return false;
    }
  }

  async clickCart() {
  logger.debug('Clicking cart icon...');
    const cart = await this.driver.wait(until.elementLocated(By.css("a.shopping_cart_link")), config.defaultTimeout);
    await this.driver.wait(until.elementIsVisible(cart), config.defaultTimeout);
    await this.driver.wait(until.elementIsEnabled(cart), config.defaultTimeout);
    await cart.click();
  logger.info('Clicked cart icon.');
  }

  async isAtCartPage() {
    try {
  logger.debug("Verifying cart page header 'Your Cart'...");
      await this.driver.wait(until.elementLocated(By.xpath("//div[@class='header_secondary_container']/span[text()='Your Cart']")), config.defaultTimeout);
  logger.info('On Cart page.');
      return true;
    } catch (err) {
  logger.warn('Not on Cart page:', err && err.message ? err.message : err);
      return false;
    }
  }

  async isItemInCart(name) {
    try {
  logger.debug(`Checking if item is present in cart: ${name}`);
      const xpath = `//div[@class='cart_item']//div[text()="${name}"]`;
      await this.driver.wait(until.elementLocated(By.xpath(xpath)), config.defaultTimeout);
      logger.info(`Item found in cart: ${name}`);
      return true;
    } catch (err) {
      logger.info(`Item not found in cart: ${name}`);
      return false;
    }
  }
}

module.exports = InventoryPage;
