'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const assign = require('deep-assign');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    if (this.name && !this.answers.name) {
      this.answers.name = this.name;
    }

    this.answers.name = this.answers.name.toLowerCase();
  };
};
