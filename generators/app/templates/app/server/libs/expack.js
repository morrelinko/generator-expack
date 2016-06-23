'use strict';

const _ = require('lodash');

/**
 * Usage:
 *
 * <pre><code>
 *   let handler = function(req, res) {
 *     req.expack.currentApp(); // {type: 'web' ...}
 *     req.expack.allDatabases(); //
 *     req.expack.allApps();
 *     req.expack.isStandalone();
 *     req.expack.isSubApp();
 *   };
 *
 * </code></pre>
 *
 * @type {{}}
 */

module.exports = function (opts) {
  return {
    currentApp() {
      return opts.project.apps[opts.currentApp];
    },

    allDatabases() {
      return opts.project.database;
    },

    allApps() {
      return opts.project.apps;
    },

    isStandalone() {
      
    },

    isSubApp() {

    }
  }
};
