const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("../config");

async function createDriver() {
  const options = new chrome.Options();

  if (config.headless) {
    options
      .addArguments(
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--window-size=1400,900"
      );
  } else {
    options.addArguments("--start-maximized");
  }

  // Optional: improve test reliability
  options.addArguments(
    "--disable-infobars",
    "--disable-extensions",
    "--disable-popup-blocking",
    "--disable-notifications"
  );

  // Build the driver
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}

module.exports = { createDriver };
