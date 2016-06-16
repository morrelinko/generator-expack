'use strict';

module.exports = function (program) {
  return function () {
    this.appname = this.answers.name;
    this.pck = JSON.parse(this.read(this.destinationPath('package.json')));

    program.config(this).set('name', this.appname);
  };
};
