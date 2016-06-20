'use strict';

module.exports = function (app) {
  require('./checkit')(app);
  require('./routeplus')(app);
};
