const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const LoginPage = require("../pages/login.page");
const testData = require("../test-data/user_credentials.json");

describe("Login Page Tests", function () {
  this.timeout(30000);
  let driver, loginPage;

  before(async () => {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    console.log("[INFO] Closing browser...");
    await driver.quit();
  });

  it("should login successfully with valid credentials", async () => {
    await loginPage.open();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    await loginPage.waitForPageTitleContains("Swag Labs");
    const title = await driver.getTitle();
    expect(title).to.include("Swag Labs");
  });

  it("should display error message for invalid credentials", async () => {
    await loginPage.open();
    await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);
    const error = await loginPage.getErrorMessage();
    expect(error).to.contain("Epic sadface");
  });
});