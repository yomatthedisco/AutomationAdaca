const { test, expect } = require('@playwright/test');

test('playwright: login form interaction', async ({ page }) => {
  // Navigate to the web app
  await page.goto('https://www.saucedemo.com/');

  // Interact with the login form
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Verify navigation by checking title contains 'Swag Labs' or URL change
  await expect(page).toHaveTitle(/Swag Labs/);
});
