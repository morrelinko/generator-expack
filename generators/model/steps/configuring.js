'use strict';

const _ = require('lodash');
const inflect = require('i')();
const chalk = require('chalk');
const assign = require('deep-assign');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    if (this.name && !this.answers.name) {
      this.answers.name = this.name;
    }

    this.answers.name_dasherized = inflect.dasherize(this.answers.name);
    this.answers.name_classified = inflect.camelize(this.answers.name, true);
    this.answers.name_pluralized = inflect.camelize(inflect.pluralize(this.answers.name), true);

    if (this.fs.exists(this.destinationPath(`server/models/${this.answers.name}.js`))) {
      this.log([
        '\n', chalk.red('Error: '),
        `Model ${chalk.cyan(this.answers.name)} already exists`
      ].join(''));
      process.exit(1);
    }
  };
};