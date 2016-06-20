'use strict';

/**
 * Logger provider
 *
 * Usage:
 * <pre><code>
 *   const logger = require('./providers/logger');
 *
 *   logger.error();
 *   logger.info();
 * </code></pre>
 */
const path = require('path');
const winston = require('winston');

function createLogger() {
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)()
    ]
  });
}

module.exports = (function () {
  return exports._instance || (exports._instance = createLogger());
})();
