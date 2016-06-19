'use strict';

const _ = require('lodash');
const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    let config = program.config(this);
  };
};
