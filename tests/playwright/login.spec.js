const { test, expect } = require('@playwright/test');
const PlaywrightLoginPage = require('../../pages/playwright/login.page');
const PlaywrightInventoryPage = require('../../pages/playwright/inventory.page');
const testData = require('../../test-data/user_credentials.json');
const logger = require('../../utils/logger');

test.describe('Playwright Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }, testInfo) => {
    const loginPage = new PlaywrightLoginPage(page);
    const inventoryPage = new PlaywrightInventoryPage(page);
    const { addTimestamp } = require('../../utils/stringUtil');

    // Dynamic traceable id for logging and reporting
    const traceableUser = addTimestamp(testData.validUser.username);
    testInfo.attach('traceableUser', { body: traceableUser, contentType: 'text/plain' });

  logger.info('[PW TEST] Opening login page');
    await loginPage.open();
  logger.info('[PW TEST] Performing login');
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    // Verify we reached the inventory page
    const atInventory = await inventoryPage.isAtInventoryPage();
    expect(atInventory).toBeTruthy();

    // Attach a screenshot for the report
    const ss = await page.screenshot();
    testInfo.attach('screenshot', { body: ss, contentType: 'image/png' });
  });

  test('should show error with invalid credentials', async ({ page }, testInfo) => {
    const loginPage = new PlaywrightLoginPage(page);
    const { addTimestamp } = require('../../utils/stringUtil');
    const traceableUser = addTimestamp('invalid_user');
    testInfo.attach('traceableUser', { body: traceableUser, contentType: 'text/plain' });

    await loginPage.open();
    await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);

    const err = await loginPage.getErrorMessage();
    expect(err).toBeTruthy();

    const ss = await page.screenshot();
    testInfo.attach('screenshot', { body: ss, contentType: 'image/png' });
  });
});
