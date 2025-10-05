const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const LoginPage = require("../pages/login.page");
const testData = require("../test-data/user_credentials.json");
const logger = require('../utils/logger');

describe("Login Page Tests", function () {
  this.timeout(60000); // Increased timeout for slower startup or loading

  let driver;
  let loginPage;

  before(async function () {
    logger.info('Initializing WebDriver...');
    try {
      driver = await createDriver();
      loginPage = new LoginPage(driver);
      logger.info('WebDriver initialized successfully.');
    } catch (err) {
      logger.error('Failed to initialize WebDriver:', err);
      throw err; // Stop tests if WebDriver fails
    }
  });

  const { recordTest, printSummary } = require("../utils/testReporter");

  after(async function () {
    if (driver) {
      try {
        logger.info('Closing browser...');
        await driver.quit();
        logger.info('Browser closed successfully.');
      } catch (err) {
        logger.warn('Error closing browser:', err);
      }
    }
    // Print a short test summary
    recordTest(this.test); // record the suite test if any
    printSummary();
  });

  // Capture screenshot for every test (passed or failed) and attach to mochawesome
  afterEach(async function () {
    if (this.currentTest && driver) {
      try {
        const { saveScreenshot } = require("../utils/driver");
        const addContext = require("mochawesome/addContext");
        const state = this.currentTest.state || "unknown";
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const safeName = `${this.currentTest.title}__${state}__${ts}`.replace(/[^a-z0-9\-]/gi, "_").toLowerCase();
        const destUnderReport = `mochawesome-report/screenshots/${safeName}.png`;
        await saveScreenshot(driver, destUnderReport);
        const reportRelativePath = `screenshots/${safeName}.png`;
        addContext(this, reportRelativePath);
        // record test outcome
        const { recordTest } = require("../utils/testReporter");
        recordTest(this.currentTest);
      } catch (err) {
        logger.warn('Could not capture screenshot:', err && err.message ? err.message : err);
      }
    }
  });

  it("should login successfully with valid credentials", async function () {
  logger.info('Opening login page...');
  await loginPage.open();

    // Use the shared utility to create a traceable username (not actually used for auth here)
    const { addTimestamp } = require("../utils/stringUtil");
    const traceableUser = addTimestamp(testData.validUser.username);
    logger.info(`Logging in with valid credentials (trace id: ${traceableUser})...`);
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    logger.info("Waiting for page title to contain 'Swag Labs'...");
    await loginPage.waitForPageTitleContains("Swag Labs");
    const title = await driver.getTitle();
    logger.debug(`Page title received: ${title}`);
    expect(title).to.include("Swag Labs");
  });

  it("should display error message for invalid credentials", async function () {
    logger.info('Opening login page...');
    await loginPage.open();

    logger.info('Logging in with invalid credentials...');
    await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);

    logger.info('Fetching error message...');
    const error = await loginPage.getErrorMessage();
    logger.debug(`Error message received: ${error}`);
    expect(error).to.contain("Epic sadface");
  });
});
