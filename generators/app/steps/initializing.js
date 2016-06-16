'use strict';

let Promise = require('bluebird');
let figlet = require('figlet');
let chalk = require('chalk');

module.exports = function (program) {
  return function () {
    this.log(program.helpers.header(program.title));

    let promise = program.helpers.wait(300);

    // First create a package.json file in project root
    // If there exists none.
    promise = promise.then(() => {
      if (!this.fs.exists(this.destinationPath('package.json'))) {
        this.log([
          `\nA ${chalk.green('package.json')} file has been created in your project root.`,
          `Update the package.json file with correct details before procceeding.\n`
        ].join('\n'));

        this.fs.copyTpl(
          this.templatePath('package.json'),
          this.destinationPath('package.json'),
          { name: this.appname });

        return Promise.promisify(this.fs.commit, {
          context: this.fs
        })();
      }
    });

    return promise;
  };
};
