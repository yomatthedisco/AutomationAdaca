const { test, expect } = require('@playwright/test');
const PlaywrightLoginPage = require('../../pages/playwright/login.page');
const PlaywrightInventoryPage = require('../../pages/playwright/inventory.page');
const testData = require('../../test-data/user_credentials.json');

// screenshot on failure or success: attach to report via test.info().attach

test.describe('Playwright Inventory Tests', () => {
  test('Add to cart single item scenario', async ({ page }, testInfo) => {
    const loginPage = new PlaywrightLoginPage(page);
    const inventoryPage = new PlaywrightInventoryPage(page);
    const itemName = testData.testItem.name;

    await loginPage.open();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    expect(await inventoryPage.isAtInventoryPage()).toBeTruthy();

    const displayed = await inventoryPage.addToCartByName(itemName);
    expect(await inventoryPage.isAtInventoryPage()).toBeTruthy();

    // verify remove button
    const removeVisible = await page.$(`xpath=//div[text()="${itemName}"]//ancestor::div[contains(@class,'inventory_item')]//button[text()='Remove']`);
    expect(removeVisible).not.toBeNull();

    await inventoryPage.clickCart();
    expect(await inventoryPage.isAtCartPage()).toBeTruthy();
    expect(await inventoryPage.isItemInCart(displayed)).toBeTruthy();

    // attach screenshot
    const ss = await page.screenshot({ path: `mochawesome-report/screenshots/pw_add_${Date.now()}.png` });
    testInfo.attach('screenshot', { body: ss, contentType: 'image/png' });
  });

  test('Delete an item in Product Page', async ({ page }, testInfo) => {
    const loginPage = new PlaywrightLoginPage(page);
    const inventoryPage = new PlaywrightInventoryPage(page);
    const itemName = testData.testItem.name;

    await loginPage.open();
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    await inventoryPage.addToCartByName(itemName);
    // ensure remove is visible
    expect(await page.$(`xpath=//div[text()="${itemName}"]//ancestor::div[contains(@class,'inventory_item')]//button[text()='Remove']`)).not.toBeNull();

    await inventoryPage.removeFromCartByName(itemName);
    // verify add button reappears
    const addVisible = await page.$( `xpath=//div[text()="${itemName}"]//ancestor::div[contains(@class,'inventory_item')]//button[text()='Add to cart']` );
    expect(addVisible).not.toBeNull();

    const ss = await page.screenshot({ path: `mochawesome-report/screenshots/pw_remove_${Date.now()}.png` });
    testInfo.attach('screenshot', { body: ss, contentType: 'image/png' });
  });
});
