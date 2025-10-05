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
- Selenium WebDriver  
- Mocha  
- Chai  
- NYC  
- ESLint  
- Page Object Model (POM)  

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
- Node.js 16+ and npm installed
- Chrome installed (chromedriver version in package.json should match your Chrome)

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
- If you see SessionNotCreatedError, update the `chromedriver` devDependency to match your Chrome version or update Chrome.
- Screenshots of failed tests are saved to `mochawesome-report/screenshots/`.

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
