'use strict';

let chalk = require('chalk');
let questions = require('../questions/main');

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let promise = this.prompt(questions(program, this));

    promise = promise.then(function (answers) {
      this.answers = Object.assign(this.answers || {}, answers);

      if (this.answers.identifier in config.get('database')) {
        this.log(chalk.red(
          `Database with identifier ${chalk.cyan(
            this.answers.identifier)} already in use.`
        ));
        process.exit(1);
      }
    }.bind(this));

    return promise;
  };
};
