'use strict';

const path = require('path');
const nunjucks = require('nunjucks');
const urlgen = require('../libs/urlgen');
const config = require('../config');

let env = module.exports = function (app) {
  let environment = nunjucks.configure(path.resolve(__dirname, '../views/web'), {
    autoescape: options.autoescape || true,
    express: app
  });

  // Make the "config" globally accessible in all views.
  app.locals.config = config;

  // Make "urlgen" globally accessible in all views.
  app.locals.urlgen = urlify;

  environment.addFilter('json', function (data) {
    return JSON.stringify(data);
  });

  env._instance = environment;
};

env.__proto__ = env._instance;
