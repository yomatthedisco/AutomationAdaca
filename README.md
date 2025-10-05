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
