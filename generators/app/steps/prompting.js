'use strict';

let questions = require('../questions/main');

module.exports = function (program) {
  return function () {
    let promise = this.prompt(questions(program, this));

    promise = promise.then(function (answers) {
      this.answers = Object.assign(this.answers || {}, answers);
    }.bind(this));

    return promise;
  };
};
