const { test, expect } = require('@playwright/test');
const PlaywrightLoginPage = require('../../pages/playwright/login.page');
const PlaywrightInventoryPage = require('../../pages/playwright/inventory.page');
const testData = require('../../test-data/user_credentials.json');
const logger = require('../../utils/logger');

test.describe('Playwright Inventory Tests', () => {
  test('Add to cart single item scenario', async ({ page }, testInfo) => {
    const loginPage = new PlaywrightLoginPage(page);
    const inventoryPage = new PlaywrightInventoryPage(page);
    const { addTimestamp } = require('../../utils/stringUtil');
    const traceable = addTimestamp(testData.validUser.username);
    testInfo.attach('traceableUser', { body: traceable, contentType: 'text/plain' });

    const itemName = testData.testItem.name;

  logger.info('[PW TEST] Open and login');
    await loginPage.open();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    expect(await inventoryPage.isAtInventoryPage()).toBeTruthy();

  logger.info(`[PW TEST] Adding item to cart: ${itemName}`);
    const displayed = await inventoryPage.addToCartByName(itemName);
    expect(await inventoryPage.isAtInventoryPage()).toBeTruthy();

    // verify remove button via POM helper
    expect(await inventoryPage.isRemoveVisible(itemName)).toBeTruthy();

    await inventoryPage.clickCart();
    expect(await inventoryPage.isAtCartPage()).toBeTruthy();
    expect(await inventoryPage.isItemInCart(displayed)).toBeTruthy();

    const ss = await page.screenshot();
    testInfo.attach('screenshot', { body: ss, contentType: 'image/png' });
  });

  test('Delete an item in Product Page', async ({ page }, testInfo) => {
    const loginPage = new PlaywrightLoginPage(page);
    const inventoryPage = new PlaywrightInventoryPage(page);
    const { addTimestamp } = require('../../utils/stringUtil');
    const traceable = addTimestamp(testData.validUser.username);
    testInfo.attach('traceableUser', { body: traceable, contentType: 'text/plain' });

    const itemName = testData.testItem.name;

    await loginPage.open();
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    await inventoryPage.addToCartByName(itemName);
    expect(await inventoryPage.isRemoveVisible(itemName)).toBeTruthy();

    await inventoryPage.removeFromCartByName(itemName);
    // verify add button reappears
    expect(await inventoryPage.isAddVisible(itemName)).toBeTruthy();

    const ss = await page.screenshot();
    testInfo.attach('screenshot', { body: ss, contentType: 'image/png' });
  });
});
