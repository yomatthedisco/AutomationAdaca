const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const current = (process.env.LOG_LEVEL || 'info').toLowerCase();
const level = LEVELS[current] !== undefined ? LEVELS[current] : LEVELS.info;

function debug(...args) {
  if (level <= LEVELS.debug) console.debug('[DEBUG]', ...args);
}

function info(...args) {
  if (level <= LEVELS.info) console.log('[INFO]', ...args);
}

function warn(...args) {
  if (level <= LEVELS.warn) console.warn('[WARN]', ...args);
}

function error(...args) {
  if (level <= LEVELS.error) console.error('[ERROR]', ...args);
}

module.exports = { debug, info, warn, error };
