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

    if (this.fs.exists(this.destinationPath(`server/handlers/${this.answers.app}/${this.answers.name}.js`))) {
      this.log([
        '\n', chalk.red('Error: '),
        `Handler ${chalk.cyan(this.answers.name)} `,
        `already exists in app ${chalk.cyan(this.answers.app)}`
      ].join(''));
      process.exit(1);
    }
  };
};
