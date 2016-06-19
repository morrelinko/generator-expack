'use strict';

const rp = require('routeplus');

let middlewares = {};

Object.keys(middlewares).forEach(name => {
  rp.builder.middleware(name, middlewares[name]);
});
