'use strict';

let bootstraps = module.exports = {};

bootstraps.boot = function (app, opts) {
  require('./checkit').boot(app, opts);
  require('./nunjucks').boot(app, opts);
  require('./routeplus').boot(app, opts);
};

Object.defineProperty(bootstraps, 'checkit', {
  get: () => require('./checkit').instance
});

Object.defineProperty(bootstraps, 'routeplus', {
  get: () => require('./routeplus').instance
});

Object.defineProperty(bootstraps, 'nunjucks', {
  get: () => require('./nunjucks').instance
});
