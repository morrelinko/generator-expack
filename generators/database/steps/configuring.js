'use strict';

const _ = require('lodash');
const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    if (this.answers.identifier in (config.get('database') || {})) {
      this.log([
        chalk.red('Error: '), 'Database with identifier',
        chalk.cyan(this.answers.identifier), 'already in use.'
      ].join());
      process.exit(1);
    }
  };
};
