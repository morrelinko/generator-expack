'use strict';

const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    program.helpers.ensureExpack(this, program);

    if (config.get(`apps:${this.name.toLowerCase()}`)) {
      this.env.error([
        '\n', chalk.red('Error:'),
        'App', chalk.cyan(this.name), 'already exists'
      ].join(' '));
    }

    return program.helpers.wait(400);
  };
};
