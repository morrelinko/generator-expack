'use strict';

const path = require('path');
const rp = require('routeplus');
const config = require('../config');

let up = module.exports = {};
up.path = up.url = {};

/**
 *
 * @param name
 * @param args
 * @param options
 * @returns {*}
 */
up.route = function (name, args, options) {
  return rp.url(name, args, options);
};

/**
 * @returns {String} path to project root
 */
up.path.root = function () {
  return path.resolve(__dirname, '../..');
};

/**
 * @returns {String} path to client folder
 */
up.path.client = function () {
  return path.join(up.path.root(), '/client');
};

/**
 * @returns {String} path to server folder
 */
up.path.server = function () {
  return path.join(up.path.root(), '/server');
};

/**
 * Exposes url generator for standalone apps.
 * Usage: Say we have a standalone app called 'web'
 * <code>
 *   const upg = require('../urlpathgen');
 *   upg.urls.web(); // Outputs: http://example.com
 *   upg.urls.web('home'); // Outputs: http://example.com/home
 * </code>
 */
Object.keys(config.get('app.apps') || {}).forEach(name => {
  up.url[name] = function (suffix, secure) {
    let cfg = config.get(`app.apps.${name}`);
    return `http${secure ? 's' : ''}://${cfg.host}${
      cfg.port == 80 ? '' : (':' + cfg.port)}${
      suffix ? ('/' + suffix) : ''}`;
  };
});
