'use strict';

const path = require('path');
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
        path: '/auth',
        withHandler: false,
        withRoute: false,
        withValidator: false
      }
    }, {
      local: path.resolve(__dirname, '../../apps'),
      link: 'strong'
    });

    this.composeWith('expack:handler', {
      args: [],
      options: {
        separate: false,
        app: this.answers.app
      }
    }, {
      local: path.resolve(__dirname, '../../handler')
    });

    if (config.get('auth')) {
      this.env.error([
        '\n', chalk.red('Error: '), `Auth app already exists.`
      ].join(''));
    }
  };
};
