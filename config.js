/**
 * Global configuration file
 * Contains environment settings and WebDriver options
 */

module.exports = {
  baseUrl: "https://www.saucedemo.com/",  // Application under test
  headless: false,                         // Run Chrome in headless mode if true
  implicitWait: 5000,                      // Default implicit wait (ms)
  defaultTimeout: 10000,                   // Default explicit wait timeout (ms)

  // You can easily extend this later for different environments:
  // env: {
  //   staging: "https://staging.saucedemo.com/",
  //   production: "https://www.saucedemo.com/"
  // }
};
