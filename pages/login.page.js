const { By, until } = require("selenium-webdriver");
const config = require("../config");
const fs = require("fs");
const path = require("path");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = `${config.baseUrl}/login`;

    // Element locators
    this.locators = {
      usernameInput: By.id("username"),
      passwordInput: By.id("password"),
      loginButton: By.css("button[type='submit']"),
      errorMessage: By.css(".error")
    };

    // Log file path
    this.logPath = path.join(__dirname, "../logs/login.log");
  }

  /**
   * Utility method for structured logs
   */
  log(message) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(this.logPath, logMessage);
  }

  /**
   * Open the login page
   */
  async open() {
    try {
      this.log("Navigating to login page...");
      await this.driver.get(this.url);
      this.log(`Page opened: ${this.url}`);
    } catch (error) {
      this.log(`Failed to open login page: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enter username
   */
  async enterUsername(username) {
    try {
      this.log(`Entering username: ${username}`);
      const el = await this.driver.wait(
        until.elementLocated(this.locators.usernameInput),
        config.defaultTimeout
      );
      await el.clear();
      await el.sendKeys(username);
      this.log("Username entered successfully");
    } catch (error) {
      this.log(`Failed to enter username: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enter password
   */
  async enterPassword(password) {
    try {
      this.log("Entering password...");
      const el = await this.driver.wait(
        until.elementLocated(this.locators.passwordInput),
        config.defaultTimeout
      );
      await el.clear();
      await el.sendKeys(password);
      this.log("Password entered successfully");
    } catch (error) {
      this.log(`Failed to enter password: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    try {
      this.log("Clicking login button...");
      const btn = await this.driver.wait(
        until.elementLocated(this.locators.loginButton),
        config.defaultTimeout
      );
      await this.driver.wait(until.elementIsEnabled(btn), config.defaultTimeout);
      await btn.click();
      this.log("Login button clicked");
    } catch (error) {
      this.log(`Failed to click login button: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform full login action
   */
  async login(username, password) {
    try {
      this.log("Starting login process...");
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.clickLogin();
      this.log("Login process completed");
    } catch (error) {
      this.log(`Login process failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get error message after login attempt
   */
  async getErrorMessage() {
    try {
      this.log("Checking for error message...");
      const el = await this.driver.wait(
        until.elementLocated(this.locators.errorMessage),
        5000
      );
      const message = await el.getText();
      this.log(`Error message displayed: "${message}"`);
      return message;
    } catch {
      this.log("No error message found");
      return null;
    }
  }

  /**
   * Wait for page title to contain specific text
   */
  async waitForTitleContains(text, timeout = 10000) {
    try {
      this.log(`Waiting for page title to contain: "${text}"`);
      await this.driver.wait(until.titleContains(text), timeout);
      this.log("Expected title found");
    } catch (error) {
      this.log(
        `Title did not contain "${text}" within ${timeout}ms: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = LoginPage;