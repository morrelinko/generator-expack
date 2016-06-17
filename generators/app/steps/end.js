'use strict';

let path = require('path');
let del = require('del');
let chalk = require('chalk');

module.exports = function (program) {
  return function () {
    // Remove all .keep files
    del.sync(path.resolve(this.destinationPath('**/.keep')));

    this.log([
      `Your ${chalk.green(program.title)} Application has been created!`,
      `---`,
      `To start your application, run: ${chalk.cyan('npm start')}`
    ].join('\n'));
  };
}
