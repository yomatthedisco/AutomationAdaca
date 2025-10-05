const config = require('../../config');
const logger = require('../../utils/logger');

class PlaywrightLoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = config.baseUrl;
    this.selectors = {
      username: '#user-name',
      password: '#password',
      loginButton: '#login-button',
      errorMessage: "h3[data-test='error']"
    };
  }

  async open() {
    logger.info('[PW] Opening login page...');
    await this.page.goto(this.url);
  }

  async login(username, password) {
    logger.debug(`[PW] Logging in as ${username}`);
    await this.page.fill(this.selectors.username, username);
    await this.page.fill(this.selectors.password, password);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {}),
      this.page.click(this.selectors.loginButton)
    ]);
  }

  async getErrorMessage() {
    try {
      const el = await this.page.waitForSelector(this.selectors.errorMessage, { timeout: 3000 });
      return (await el.textContent()) || '';
    } catch (e) {
      return '';
    }
  }
}

module.exports = PlaywrightLoginPage;
