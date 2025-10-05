AUTOMATION ADACA EXAM
Develop a basic automation test suite for a simple web application using Selenium WebDriver as the primary tool, with a small demonstration of Playwright.

Evaluation Criteria
• Code quality and organisation
• Test coverage and effectiveness
• Use of Selenium WebDriver features
• Implementation of Page Object Model
• Proper use of waits and synchronisation techniques
• Basic error handling
• Clarity of README and documentation

This project demonstrates a modular automation testing framework designed for maintainability, scalability, and readability.
It uses:

Selenium WebDriver for UI test automation
• Mocha as the test runner
• Chai for assertions
• NYC for test coverage
• ESLint for code quality and consistency
• Page Object Model (POM) to separate test logic from page elements

Key Features
• Page Object Model (POM) – clean separation between UI locators and test logic
• Configurable waits – uses until and timeout values from config.js
• Data-Driven testing – reads test data from loginData.json
• Headless mode option – toggle in config.js
• Logging – includes informative logs for every major test step
• Cross-browser ready – currently Chrome, easily extendable for Edge/Firefox
• Error handling – includes graceful failure handling and meaningful messages

Reporting & Logs
• Test execution logs are printed in the terminal.
• Future improvement: integrate Allure Reports or Mochawesome for rich HTML reports.