'use strict';

let bootstraps = module.exports = {
  get checkit() {
    return require('./checkit').instance;
  },

  get routeplus() {
    return require('./routeplus').instance;
  },

  get nunjucks() {
    return require('./nunjucks').instance;
  }
};

bootstraps.boot = function (app, opts) {
  require('./checkit').boot(app, opts);
  require('./nunjucks').boot(app, opts);
  require('./routeplus').boot(app, opts);
};
