// Minimal Playwright config for the project's demo test
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    // Capture screenshots on failure and keep traces/videos on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  timeout: 30000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
};
