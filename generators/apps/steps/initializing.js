'use strict';

const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    program.helpers.ensureExpack(this, program);

    if (config.get(`apps:${this.name.toLowerCase()}`)) {
      this.log(chalk.red(`\nApp ${chalk.cyan(this.name)} already exists.\n`));
      process.exit(1);
    }

    return program.helpers.wait(400);
  };
};
