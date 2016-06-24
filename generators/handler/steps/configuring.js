'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const assign = require('deep-assign');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    this.answers = _.defaults({
      name: this.name,
      app: this.options.app,
      separate: this.options.separate
    }, this.answers);

    if (this.answers.separate) {
      this.answers.name = this.answers.name.toLowerCase();

      let handlerPath = this.destinationPath(`server/handlers/${this.answers.app}/${this.answers.name}.js`);
      if (this.fs.exists(handlerPath)) {
        this.env.error([
          '\n', chalk.red('Error:'), `Handler ${chalk.cyan(this.answers.name)}`,
          `already exists in app ${chalk.cyan(this.answers.app)}`
        ].join(' '));
      }
    }


  };
};
