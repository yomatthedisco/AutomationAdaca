const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
// ensure chromedriver npm package is available so we can point Selenium to the correct binary
const chromedriver = require("chromedriver");
const config = require("../config");
const fs = require("fs");
const path = require("path");

/**
 * Create and return a new Chrome WebDriver instance.
 * Uses chromedriver binary from the chromedriver npm package to avoid relying on PATH.
 * Adds a startup timeout so the test setup doesn't hang indefinitely.
 */
async function createDriver() {
  const options = new chrome.Options();

  const isHeadless = typeof process.env.HEADLESS !== "undefined" ? process.env.HEADLESS === "true" : config.headless;

  if (isHeadless) {
    console.log("[INFO] Running in HEADLESS mode");
    options.addArguments(
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1400,900"
    );
  } else {
    console.log("[INFO] Running in VISIBLE mode");
    options.addArguments("--start-maximized");
  }

  // Optional: improve test reliability
  options.addArguments(
    "--disable-infobars",
    "--disable-extensions",
    "--disable-popup-blocking",
    "--disable-notifications"
  );

  // Try to disable Chrome's built-in password manager / save-password bubble which may interfere with tests
  const prefs = {
    // disable the credential service and password manager UI
    "credentials_enable_service": false,
    "profile.password_manager_enabled": false
  };
  try {
    // set prefs in Chrome options so the browser won't show password manager offers
    // options.setUserPreferences is available on some selenium-webdriver builds
    if (typeof options.setUserPreferences === "function") {
      options.setUserPreferences(prefs);
    }
  } catch (e) {
    // ignore if not supported
  }
  // Also set via generic prefs entry (works as capability fallback)
  try {
    options.set("prefs", prefs);
  } catch (e) {
    // ignore if not supported
  }

  // Add a couple of flags that reduce password manager UI noise
  options.addArguments(
    "--disable-save-password-bubble",
    "--disable-password-manager-reauthentication",
    "--disable-features=PasswordManagerUI"
  );

  // Use chromedriver package binary explicitly via ServiceBuilder to avoid path/matching issues
  const serviceBuilder = new chrome.ServiceBuilder(chromedriver.path);

  // build driver but protect with a startup timeout so the before hook doesn't hang forever
  const buildPromise = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(serviceBuilder)
    .build();

  const startupTimeoutMs = 30000; // 30s to start ChromeDriver

  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`ChromeDriver did not start within ${startupTimeoutMs}ms`));
    }, startupTimeoutMs);
  });

  // If buildPromise resolves first we get the driver, otherwise the timeout will reject
  return Promise.race([buildPromise, timeoutPromise]);
}

/**
 * Save a screenshot (base64) taken by the WebDriver to disk.
 * Ensures the destination directory exists.
 * @param {WebDriver} driver - selenium-webdriver instance
 * @param {string} destPath - absolute or relative path to save PNG file
 */
async function saveScreenshot(driver, destPath) {
  try {
    const buffer = Buffer.from(await driver.takeScreenshot(), "base64");
    // Resolve to absolute path so callers can rely on a consistent location
    const absolutePath = path.isAbsolute(destPath) ? destPath : path.resolve(process.cwd(), destPath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(absolutePath, buffer);
    console.log(`[INFO] Screenshot saved to ${absolutePath}`);
    return absolutePath;
  } catch (err) {
    console.error("[ERROR] Failed to save screenshot:", err && err.message ? err.message : err);
  }
}

// Export functions from this module
module.exports = { createDriver, saveScreenshot };