'use strict';

let chalk = require('chalk');
let questions = require('../questions/main');

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let promise = this.prompt(questions(program, this));

    promise = promise.then(function (answers) {
      this.answers = Object.assign(this.answers || {}, answers);
    }.bind(this));

    return promise;
  };
};
