/**
 * Logger utility for debugging.
 */

let isLogging = false;

/**
 * Enables logging output.
 */
export function enableLogging() {
  if (isLogging) return;
  isLogging = true;
  log('Enabled Logging');
}

/**
 * Disables logging output.
 */
export function disableLogging() {
  isLogging = false;
}

/**
 * Logs a message to the console if logging is enabled.
 * @param {...*} args - Arguments to log.
 */
export function log(...args) {
  if (isLogging) {
    console.log(...args);
  }
}

// Export as default for backward compatibility
export default {
  enableLogging,
  disableLogging,
  log,
};
