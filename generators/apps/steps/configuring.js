'use strict';

const _ = require('lodash');
const chalk = require('chalk');

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let port = this.answers.port;

    this.answers = _.defaults({
      type: this.options.type,
      standalone: this.options.standalone,
      mount_app: this.options.app,
      mount_path: this.options.path,
      host: this.options.host,
      port: this.options.port
    }, this.answers);

    _.forEach(config.get('apps'), app => {
      if (app.port == this.answers.port) {
        this.env.error(`\n${chalk.red('Error:')} App ${chalk.cyan(app.name)} already using port ${chalk.cyan(port)}\n`);
      }
    });
  };
};
