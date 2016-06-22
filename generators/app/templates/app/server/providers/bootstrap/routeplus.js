'use strict';

const rp = require('routeplus');
const middlewares = require('../../middlewares');

module.exports = {
  instance: null,
  boot () {
    Object.keys(middlewares).forEach(name => {
      rp.builder.middleware(name, middlewares[name].builder);
    });
  }
};
