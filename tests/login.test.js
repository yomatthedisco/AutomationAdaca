const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const LoginPage = require("../../pages/login.page");
const testData = require("../../test_data/loginData.json");

describe("Login Tests (POM)", function () {
  this.timeout(60000);
  let driver;
  let loginPage;

  beforeEach(async () => {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
  });

  afterEach(async () => {
    if (driver) await driver.quit();
  });

  it("Should fail with invalid credentials", async () => {
    const { username, password } = testData.invalidUser;
    await loginPage.open();
    await loginPage.login(username, password);
    const error = await loginPage.getErrorMessage();
    expect(error).to.include("Invalid username or password");
  });

  it("Should login successfully with valid credentials", async () => {
    const { username, password } = testData.validUser;
    await loginPage.open();
    await loginPage.login(username, password);
    await loginPage.waitForTitleContains("Dashboard", 15000);
    const title = await driver.getTitle();
    expect(title).to.include("Dashboard");
  });

  // Example of iterating multiple users:
  testData.users.forEach((u) => {
    it(`Iterates user ${u.username} (example)`, async () => {
      await loginPage.open();
      await loginPage.login(u.username, u.password);
    });
  });
});
