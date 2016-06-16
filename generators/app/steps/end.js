'use strict';

let chalk = require('chalk');

module.exports = function (program) {
  return function () {
    this.log([
      `Your ${chalk.green(program.title)} Application has been created!`,
      `---`,
      `To start your application, run: ${chalk.cyan('npm start')}`
    ].join('\n'));
  };
}
