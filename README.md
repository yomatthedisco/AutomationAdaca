# AUTOMATION ADACA EXAM  

Develop a basic automation test suite for a simple web application using **Selenium WebDriver** as the primary tool, with a small demonstration of **Playwright**.  

---

## Evaluation Criteria  

- Code quality and organisation  
- Test coverage and effectiveness  
- Use of Selenium WebDriver features  
- Implementation of Page Object Model  
- Proper use of waits and synchronisation techniques  
- Basic error handling  
- Clarity of README and documentation  

---

## Project Overview  

This project demonstrates a **modular automation testing framework** designed for maintainability, scalability, and readability.  

### Tools Used  
- Selenium WebDriver – Automates browsers for functional testing.
- Mocha – Test runner for executing test cases. 
- Mochawesome – Generates beautiful HTML reports. 
- Chai – Assertion library used with Mocha. 
- NYC - Provides test coverage reports.  
- ESLint – Ensures consistent code style and quality.
- Playwright – Demo suite for modern cross-browser automation.  
- Page Object Model (POM) – Design pattern that separates test logic from page locators and actions.  

---

## Key Features  

- Page Object Model (POM) – clean separation between UI locators and test logic  
- Configurable waits and timeouts (`config.js`)  
- Data-driven testing (`user_credentials.json`)  
- Optional headless mode  
- Logging on every major step  
- Error handling and synchronization  
- Extendable for multiple browsers  
 
---

## How to run the tests

Prerequisites:
- Node.js 16.x or 18.x and npm (tested with Node 16/18 and npm 8+)
- Chrome installed (chromedriver version in package.json should match your Chrome)
- Git (https://git-scm.com/)

After installing dependencies you must install Playwright browsers (if you plan to run Playwright tests):

```cmd
npx playwright install
```

Install dependencies:

```cmd
cd C:\path\to\repository
npm install
```

Run tests (visible mode):

```cmd
cmd /c "cd /d C:\path\to\repository && npm test"
```

Run tests in headless mode:

```cmd
cmd /c "cd /d C:\path\to\repository && npm run test:headless"
```

Troubleshooting:
- If PowerShell refuses to run npm scripts, run tests through cmd.exe (examples above) or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in PowerShell for the session.
- If you see SessionNotCreatedError, update the `chromedriver` devDependency to match your Chrome version or update Chrome. Example (replace <major> with your Chrome major version):

```cmd
npm i --save-dev chromedriver@<major>
```

- Screenshots of failed tests are saved to `mochawesome-report/screenshots/`.

Artifacts & reports (quick access):

- Mocha / mochawesome HTML report: `mochawesome-report/mochawesome.html`
	- Open on Windows: `start mochawesome-report\\mochawesome.html`
- Playwright HTML report: generated under `playwright-report/`
	- Show Playwright report: `npx playwright show-report playwright-report`

Note about credentials and secrets:

- `test-data/user_credentials.json` contains demo credentials used by the public saucedemo site. For real projects do NOT store secrets in the repo. Prefer environment variables or a secrets manager. Example (Windows cmd):

```cmd
set TEST_USER=standard_user
set TEST_PASS=secret_sauce
npm test
```

Evaluation criteria mapping (how this repo addresses each item):

- Code quality and organisation: Page Objects under `pages/`, tests under `tests/`, utils under `utils/`, config at `config.js`.
- Test coverage and effectiveness: Tests demonstrate positive and negative login flows; coverage can be extended using `npm run coverage`.
- Use of Selenium WebDriver features: Uses explicit waits (`until.elementLocated`, `until.titleContains`), Chrome options and service builder.
- Implementation of Page Object Model: `pages/login.page.js` encapsulates locators and interactions.
- Proper use of waits and synchronisation techniques: Explicit waits used and error message retrieval has retries/backoff.
- Basic error handling: try/catch blocks in setup, teardown, and helpers; screenshot capture on test failure.
- Clarity of README and documentation: This file includes run steps, troubleshooting, and notes.

---

## Test structure and design

- `pages/` contains Page Objects (`login.page.js`, `inventory.page.js`) which encapsulate locators and actions.
- `tests/` contains Mocha test suites (`login.test.js`, `inventory.test.js`). Each test uses the Page Objects and explicit waits.
- `utils/driver.js` centralizes WebDriver creation, options and screenshot helper.
- `test-data/user_credentials.json` contains credentials and a `testItem` entry used by inventory tests (data-driven).

Data-driven testing

- Inventory tests read `testData.testItem.name` from `test-data/user_credentials.json` so adding more items or iterating would be straightforward.

Assumptions

- Tests run against https://www.saucedemo.com/ (default `config.js` baseUrl).
- Chrome is the target browser; chromedriver should match the installed Chrome version.
- Native OS dialogs (outside the browser DOM) are out of scope for Selenium; best-effort disabling and DOM-based dismissal is implemented.

Playwright

- Playwright tests are available under `tests/playwright/` and use `@playwright/test`.
- npm scripts added:
	- `npm run test:pw` — run Playwright tests (headless by default)
	- `npm run test:pw:headed` — run Playwright tests in headed mode for debugging

To run Playwright tests:

```cmd
cd /d C:\path\to\repository
npm install
npx playwright install
npm run test:pw
```

---

## Summary of files changed/created for this assessment

- `pages/` - Playwright and Selenium Page Objects (login, inventory)
- `tests/` - Mocha (Selenium) tests and `tests/playwright/` Playwright tests
- `utils/` - `driver.js`, `stringUtil.js`, `testReporter.js` helpers
- `mochawesome-report/` and `playwright-report/` - generated reports and screenshots/traces

---

## Framework features

- Page Object Model (POM) implemented for both Selenium and Playwright — keeps locators and interactions encapsulated.
- Centralized WebDriver creation (`utils/driver.js`) with Chrome ServiceBuilder, explicit binary use and configurable headless/visible mode.
- Playwright demo suite under `tests/playwright/` using `@playwright/test` and POM-style pages.
- Robust synchronization: explicit waits, retry/backoff for flaky UI elements (error messages), and load-state checks.
- Screenshot capture on every test (passed/failed) and attachment into mochawesome and Playwright reports.
- Lightweight test reporter (`utils/testReporter.js`) to print a concise summary after Mocha runs.
- Small shared utilities: `utils/stringUtil.js` for traceable strings and `utils/logger.js` for centralized, level-controlled logging.

## Advantages / Pros

- Maintainability: POM structure and organized folder layout (pages, tests, utils) make it easy to extend.
- Reliability: explicit waits, timeouts, and targeted handlers for common flakiness (password manager prompts, alerts).
- Observability: screenshots, consistent logging (LOG_LEVEL), and HTML reports (mochawesome + Playwright) make debugging and review straightforward.
- Dual-tooling: Selenium for the main assessment and Playwright as a modern, fast demonstration — useful for comparison and future migration.
- Minimal friction for reviewers: Windows-friendly run commands, Playwright report viewer, and report screenshots included.

## Future enhancements (nice-to-have / roadmap)

- CI integration: add a GitHub Actions workflow to run Selenium (headless) and Playwright tests on push/PR and publish artifacts.
- Secrets management: move credentials to env vars or a secrets manager; add `.env.example` and `dotenv` support.
- Cross-browser coverage: add Firefox and Edge capabilities and parameterized runs across browsers.
- Test data expansion: add data-driven suites (CSV/JSON matrix) and boundary/negative tests for inventory flows.
- Parallelization and stability: tune driver creation for isolated parallel runs, or run Selenium tests in a grid (Selenium Grid or Selenoid).
- Accessibility & performance checks: integrate lightweight a11y scans (axe-core) and simple performance checks (Lighthouse / Puppeteer scripts).
- Better artifact retention: upload Playwright traces/videos and mochawesome JSON to an artifacts store in CI for long-term review.

