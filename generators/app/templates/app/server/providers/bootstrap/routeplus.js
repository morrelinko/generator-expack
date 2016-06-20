'use strict';

const rp = require('routeplus');
const middlewares = require('../../middlewares');

module.exports = function (app) {
  Object.keys(middlewares).forEach(name => {
    rp.builder.middleware(name, middlewares[name]);
  });
};
