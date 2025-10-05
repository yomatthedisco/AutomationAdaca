/**
 * Small utility to manipulate strings for tests.
 * e.g. add a timestamp suffix to a username or label so it's unique and traceable.
 */
function addTimestamp(input) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return `${input}_${ts}`;
}

module.exports = { addTimestamp };
