/**
 * Lightweight test reporter used by tests to collect pass/fail counts and print a summary.
 */
const counts = { total: 0, passed: 0, failed: 0 };

function recordTest(test) {
  if (!test) return;
  counts.total += 1;
  if (test.state === "passed") counts.passed += 1;
  else if (test.state === "failed") counts.failed += 1;
}

function printSummary() {
  console.log("\n=== Test summary ===");
  console.log(`Total: ${counts.total}`);
  console.log(`Passed: ${counts.passed}`);
  console.log(`Failed: ${counts.failed}`);
  console.log("====================\n");
}

module.exports = { recordTest, printSummary };
