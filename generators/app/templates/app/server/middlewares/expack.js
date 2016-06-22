'use strict';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

let _project = null;
let readFile = Promise.promisify(fs.readFile, {
  context: fs
});

let middleware = module.exports = function (opts) {
  return function (req, res, next) {
    let promise = Promise.resolve();

    if (!_project) {
      promise = promise.then(() =>
        readFile(path.resolve(__dirname, '../../.project')))
        .then(data => _project = JSON.parse(data));
    } else {
      promise = promise.then(() => _project);
    }

    promise.then(proj => {
      req.expack = _project;
      req.expack.app = opts.app;
      // req.expack = expack(opts.app, _project);
    })
      .then(next);
  };
};

middleware.builder = function (opts) {
  this.use(middleware(opts), -10);
  return this;
};
