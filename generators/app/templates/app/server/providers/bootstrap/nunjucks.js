'use strict';

const path = require('path');
const nunjucks = require('nunjucks');
const upg = require('../../libs/urlpathgen');
const config = require('../../config');

module.exports = {
  instance: null,
  boot (app, opts) {
    if (!this.instance) {
      let environment = nunjucks.configure(
        path.resolve(__dirname, '../../views', opts.app), {
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

      this.instance = environment;
    }
  }
};
