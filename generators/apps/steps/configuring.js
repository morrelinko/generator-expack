'use strict';

const _ = require('lodash');
const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let port = this.answers.port;

    _.forEach(config.get('apps'), app => {
      if (app.port == this.answers.port) {
        this.log(`\n${chalk.red('Error:')} App ${chalk.cyan(app.name)} already using port ${chalk.cyan(port)}\n`);
        process.exit(1);
      }
    });
  };
};
