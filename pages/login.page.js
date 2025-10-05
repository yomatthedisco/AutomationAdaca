/**
 * LoginPage implements the Page Object Model for the login page at Sauce Demo.
 * It encapsulates locators and interactions to keep tests concise and readable.
 *
 * Key behaviours:
 * - open(): navigate to baseUrl
 * - login(username, password): perform form fill and submit
 * - getErrorMessage(): retrieve validation errors (robust with retries)
 * - handle alerts and password manager prompts gracefully
 */
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
    // If the application shows a JavaScript alert on login, accept it to continue the flow
    try {
      await this.acceptAlertIfPresent();
    } catch (err) {
      // Log and continue; tests should still proceed even if alert handling fails
      console.warn("[WARN] Error while handling alert:", err && err.message ? err.message : err);
    }
    // Try to dismiss browser/OS-level password manager prompts (best-effort)
    try {
      await this.acceptPasswordManagerIfPresent();
    } catch (e) {
      // not fatal — log and continue
      console.info("[INFO] Password manager dismissal check finished:", e && e.message ? e.message : e);
    }
    // Additional targeted handler for Google Password Manager "Change your password" warning
    try {
      await this.dismissGooglePasswordManagerWarning();
    } catch (e) {
      console.info("[INFO] Google password warning dismissal finished:", e && e.message ? e.message : e);
    }
  }

  /**
   * Accept a JavaScript alert if present within the configured timeout.
   * Returns true if an alert was present and accepted, false otherwise.
   */
  async acceptAlertIfPresent(timeout = config.defaultTimeout) {
    try {
      await this.driver.wait(until.alertIsPresent(), timeout);
      const alert = await this.driver.switchTo().alert();
      try {
        const text = await alert.getText();
        console.log(`[STEP] Alert present with text: ${text}. Accepting alert...`);
      } catch (e) {
        // ignore getting text failure
      }
      await alert.accept();
      // small pause to allow the page to stabilize after accepting the alert
      await new Promise((res) => setTimeout(res, 250));
      return true;
    } catch (err) {
      // Likely a timeout waiting for alert; no alert present
      // Do not treat as fatal — return false so caller can continue
      // Normalize timeout message handling
      const msg = err && err.name === "TimeoutError" ? "no alert present" : (err && err.message ? err.message : String(err));
      console.log(`[INFO] acceptAlertIfPresent: ${msg}`);
      return false;
    }
  }

  /**
   * Best-effort handler for in-page/bubble password manager dialogs (like the Chrome save-password bubble)
   * This method attempts to locate common buttons (e.g. 'Save', 'Not now', 'OK') and click them.
   * It is intentionally forgiving and will not throw if nothing is found.
   */
  async acceptPasswordManagerIfPresent() {
    // List of candidate selectors/buttons that might appear from the browser or page
    const candidates = [
      "button[aria-label='Close']",
      "button[aria-label='Not now']",
      "button[aria-label='Dismiss']",
      "button[aria-label='OK']",
      "button[aria-label='Cancel']",
      "button:contains('Not now')",
      "button:contains('No thanks')",
      "button:contains('Never')"
    ];

    for (const selector of candidates) {
      try {
        // elementLocated expects a By; try css and fall back if needed
        const el = await this.driver.findElement(By.css(selector));
        if (el) {
          try {
            await el.click();
            console.log(`[INFO] Clicked password-manager candidate: ${selector}`);
            // small pause for UI to settle
            await new Promise((r) => setTimeout(r, 300));
            return true;
          } catch (err) {
            // ignore individual click failures
          }
        }
      } catch (err) {
        // ignore not found
      }
    }
    return false;
  }

  /**
   * Detect a Google Password Manager warning in the page DOM and dismiss it.
   * This searches for the warning text and tries to click a nearby button such as 'OK', 'Not now', or 'Dismiss'.
   * Best-effort and forgiving: returns true if a dismiss action was performed, false otherwise.
   */
  async dismissGooglePasswordManagerWarning(timeout = 3000) {
    const xpathTextCandidates = [
      "//*/text()[contains(., 'The password you just used was found in a data breach')]/..",
      "//*/text()[contains(., 'Google Password Manager recommends changing your password')]/..",
      "//*[contains(., 'Google Password Manager') and contains(., 'data breach')]",
    ];

    const buttonTexts = ["OK", "Ok", "Not now", "Not now", "Dismiss", "Close", "Maybe later", "Later"];

    for (const xp of xpathTextCandidates) {
      try {
        const el = await this.driver.findElement(By.xpath(xp));
        if (el) {
          console.log(`[INFO] Found possible Google password warning using xpath: ${xp}`);
          // try to find a button inside or near this element
          for (const btnText of buttonTexts) {
            try {
              // Try to find button with text under the element
              const btn = await el.findElement(By.xpath(`.//button[contains(normalize-space(.), '${btnText}')]`));
              if (btn) {
                await btn.click();
                console.log(`[INFO] Clicked '${btnText}' button to dismiss password warning`);
                await new Promise((r) => setTimeout(r, 300));
                return true;
              }
            } catch (innerErr) {
              // ignore and continue trying other button texts
            }
          }

          // If no button found inside, try global search for these labels and click the first visible one
          for (const btnText of buttonTexts) {
            try {
              const globalBtn = await this.driver.findElement(By.xpath(`//button[contains(normalize-space(.), '${btnText}')]`));
              if (globalBtn) {
                await globalBtn.click();
                console.log(`[INFO] Clicked global '${btnText}' button to dismiss password warning`);
                await new Promise((r) => setTimeout(r, 300));
                return true;
              }
            } catch (globalErr) {
              // ignore
            }
          }
        }
      } catch (err) {
        // not found: continue to next xpath
      }
    }

    // As a final attempt, wait briefly for any element that has the specific warning text and then try to click a sibling button
    try {
      const found = await this.driver.wait(async () => {
        for (const xp of xpathTextCandidates) {
          try {
            const e = await this.driver.findElement(By.xpath(xp));
            if (e) return e;
          } catch (e) {
            // ignore
          }
        }
        return false;
      }, timeout).catch(() => false);

      if (found && found.click) {
        // attempt to click a nearby button
        for (const btnText of buttonTexts) {
          try {
            const btn = await found.findElement(By.xpath(`.//button[contains(normalize-space(.), '${btnText}')]`));
            if (btn) {
              await btn.click();
              console.log(`[INFO] Clicked '${btnText}' to dismiss (delayed)`);
              return true;
            }
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (e) {
      // ignore
    }

    return false;
  }

  async getErrorMessage() {
    const attempts = 3;
    const backoffMs = 500;

    for (let i = 0; i < attempts; i++) {
      try {
        // Wait using the configured default timeout to be more reliable across environments
        const el = await this.driver.wait(until.elementLocated(this.locators.errorMessage), config.defaultTimeout);
        const text = await el.getText();
        return typeof text === "string" ? text : String(text);
      } catch (err) {
        const msg = err && err.message ? err.message : String(err);
        console.warn(`[WARN] Attempt ${i + 1} to read error message failed: ${msg}`);
        // If last attempt, return empty string. Otherwise wait and retry.
        if (i < attempts - 1) {
          await new Promise((res) => setTimeout(res, backoffMs));
          continue;
        }
        return "";
      }
    }
    // Fallback
    return "";
  }

  async waitForPageTitleContains(text) {
    await this.driver.wait(until.titleContains(text), config.defaultTimeout);
  }
}

module.exports = LoginPage;
