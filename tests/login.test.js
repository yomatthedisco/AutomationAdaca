const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const LoginPage = require("../pages/login.page");
const testData = require("../test-data/user_credentials.json");

describe("Login Page Tests", function () {
  this.timeout(60000); // Increased timeout for slower startup or loading

  let driver;
  let loginPage;

  before(async function () {
    console.log("[SETUP] Initializing WebDriver...");
    try {
      driver = await createDriver();
      loginPage = new LoginPage(driver);
      console.log("[SETUP] WebDriver initialized successfully.");
    } catch (err) {
      console.error("[ERROR] Failed to initialize WebDriver:", err);
      throw err; // Stop tests if WebDriver fails
    }
  });

  after(async function () {
    if (driver) {
      try {
        console.log("[TEARDOWN] Closing browser...");
        await driver.quit();
        console.log("[TEARDOWN] Browser closed successfully.");
      } catch (err) {
        console.error("[WARN] Error closing browser:", err);
      }
    }
  });

  // Capture screenshot on failure for easier debugging
  afterEach(async function () {
    if (this.currentTest && this.currentTest.state === "failed" && driver) {
      try {
        const { saveScreenshot } = require("../utils/driver");
        const addContext = require("mochawesome/addContext");
        const safeName = this.currentTest.title.replace(/[^a-z0-9\-]/gi, "_").toLowerCase();
  // Save screenshot under mochawesome-report/screenshots so it's next to the report
  const destUnderReport = `mochawesome-report/screenshots/${safeName}.png`;
  const saved = await saveScreenshot(driver, destUnderReport);
  // The mochawesome HTML file lives in mochawesome-report/, so the path it should load is relative
  // to that file: `screenshots/<name>.png` (forward slashes). Do not prefix with 'mochawesome-report/'.
  const reportRelativePath = `screenshots/${safeName}.png`;
  addContext(this, reportRelativePath);
      } catch (err) {
        console.warn("[WARN] Could not capture screenshot:", err && err.message ? err.message : err);
      }
    }
  });

  it("should login successfully with valid credentials", async function () {
    console.log("[TEST] Opening login page...");
    await loginPage.open();

    console.log("[TEST] Logging in with valid credentials...");
    await loginPage.login(testData.validUser.username, testData.validUser.password);

    console.log("[TEST] Waiting for page title to contain 'Swag Labs'...");
    await loginPage.waitForPageTitleContains("Swag Labs");

    const title = await driver.getTitle();
    console.log(`[ASSERT] Page title received: ${title}`);
    expect(title).to.include("Swag Labs");
  });

  it("should display error message for invalid credentials", async function () {
    console.log("[TEST] Opening login page...");
    await loginPage.open();

    console.log("[TEST] Logging in with invalid credentials...");
    await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);

    console.log("[TEST] Fetching error message...");
    const error = await loginPage.getErrorMessage();
    console.log(`[ASSERT] Error message received: ${error}`);
    expect(error).to.contain("Epic sadface");
  });
});
