'use strict';

const _ = require('lodash');
const inflect = require('i')();
const chalk = require('chalk');
const assign = require('deep-assign');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    this.composeWith('expack:apps', {
      args: ['auth'],
      options: {
        type: 'web',
        standalone: false,
        app: this.answers.app,
        path: '/auth'
      }
    });

    this.composeWith('expack:model', {
      args: ['user'],
      options: {
        database: this.answers.database,
        table: 'users'
      }
    });

    if (config.get('auth')) {
      this.log([
        '\n', chalk.red('Error: '), `Auth app already exists.`
      ].join(''));
      process.exit(1);
    }
  };
};
