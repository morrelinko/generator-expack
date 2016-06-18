'use strict';

const _ = require('lodash');
const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    _.forEach(config.get('database'), db => {
      if (db.identifier == this.answers.identifier) {
        this.log(`\n${chalk.red('Error:')} Database identifier ${chalk.cyan(db.identifier)} already in use\n`);
        process.exit(1);
      }
    });
  };
};
