const { By, until } = require("selenium-webdriver");
const config = require("../config");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = `${config.baseUrl}`;
    this.locators = {
      usernameInput: By.id("user-name"),
      passwordInput: By.id("password"),
      loginButton: By.id("login-button"),
      errorMessage: By.css("h3[data-test='error']")
    };
  }

  async open() {
    console.log("[STEP] Opening login page...");
    await this.driver.get(this.url);
  }

  async enterUsername(username) {
    console.log(`[STEP] Entering username: ${username}`);
    const el = await this.driver.wait(until.elementLocated(this.locators.usernameInput), config.defaultTimeout);
    await el.clear();
    await el.sendKeys(username);
  }

  async enterPassword(password) {
    console.log("[STEP] Entering password...");
    const el = await this.driver.wait(until.elementLocated(this.locators.passwordInput), config.defaultTimeout);
    await el.clear();
    await el.sendKeys(password);
  }

  async clickLogin() {
    console.log("[STEP] Clicking login button...");
    const btn = await this.driver.wait(until.elementLocated(this.locators.loginButton), config.defaultTimeout);
    await this.driver.wait(until.elementIsEnabled(btn), config.defaultTimeout);
    await btn.click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    try {
      const el = await this.driver.wait(until.elementLocated(this.locators.errorMessage), 5000);
      return await el.getText();
    } catch {
      console.warn("[WARN] No error message found.");
      return null;
    }
  }

  async waitForPageTitleContains(text) {
    await this.driver.wait(until.titleContains(text), config.defaultTimeout);
  }
}

module.exports = LoginPage;
