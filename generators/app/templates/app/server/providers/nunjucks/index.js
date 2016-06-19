'use strict';

const nunjucks = require('nunjucks');
const upg = require('../../libs/urlpathgen');
const config = require('../../config');

let env = module.exports = function (app, lookup) {
  if (!env._instance) {
    let environment = nunjucks.configure(lookup, {
      autoescape: true,
      express: app
    });

    // Make the "config" globally accessible in all views.
    app.locals.config = config;

    // Make "urlpathgen" lib globally accessible in all views as "upg".
    app.locals.upg = upg;

    environment.addFilter('json', function (data) {
      return JSON.stringify(data);
    });

    env._instance = environment;
  }
};

env.__proto__ = env._instance;
