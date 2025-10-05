/**
 * Lightweight test reporter used by tests to collect pass/fail counts and print a summary.
 */
const counts = { total: 0, passed: 0, failed: 0 };
const logger = require('./logger');

function recordTest(test) {
  if (!test) return;
  counts.total += 1;
  if (test.state === "passed") counts.passed += 1;
  else if (test.state === "failed") counts.failed += 1;
}

function printSummary() {
  logger.info('\n=== Test summary ===');
  logger.info(`Total: ${counts.total}`);
  logger.info(`Passed: ${counts.passed}`);
  logger.info(`Failed: ${counts.failed}`);
  logger.info('====================\n');
}

module.exports = { recordTest, printSummary };
