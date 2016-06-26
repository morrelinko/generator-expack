'use strict';

const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    program.helpers.ensureExpack(this, program);

    let config = program.config(this);
    this.databases = Object.keys(config.get('database') || {});
    this.apps = Object.keys(config.get('apps')).filter(app => app.standalone !== false);

    if (this.databases.length === 0) {
      this.env.error([
        '\n', chalk.red('Error:'), 'No databases to use. Run ',
        chalk.cyan('yo expack:database'), 'to setup a database.'
      ].join(' '));
    }

    if (this.apps.length === 0) {
      this.env.error([
        chalk.red('Error:'), 'No apps to mount to. Run ',
        chalk.cyan('yo expack:apps <appname>'), 'to setup an app.'
      ].join(' '));
    }

    return program.helpers.wait(100);
  };
};
