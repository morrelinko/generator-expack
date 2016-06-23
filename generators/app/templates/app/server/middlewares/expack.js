'use strict';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const expack = require('../libs/expack');

let _project = null;
let readFile = Promise.promisify(fs.readFile, {
  context: fs
});

let middleware = module.exports = function (opts) {
  return function (req, res, next) {
    req.expack = expack(opts);
    next();
  };
};

middleware.builder = function (opts) {
  this.use(middleware(opts), -10);
  return this;
};
