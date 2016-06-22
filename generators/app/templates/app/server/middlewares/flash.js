'use strict';

const Bag = require('../libs/bag');
const bootstrap = require('../providers/bootstrap');

let middleware = module.exports = function () {
  return function (req, res, next) {
    let errors = req.flash('errors');
    if (Array.isArray(errors) && errors.length > 0) {
      errors = errors[0];
    } else {
      errors = {};
    }

    bootstrap.nunjucks.addGlobal('errors', new Bag(errors));

    next();
  };
};

middleware.builder = function () {
  this.use(exports.handler(), 10);
  return this;
};
