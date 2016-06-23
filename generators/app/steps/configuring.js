'use strict';

const _ = require('lodash');
const inflect = require('i')();

module.exports = function (program) {
  return function () {
    this.appname = this.answers.name;
    this.pck = JSON.parse(this.read(this.destinationPath('package.json')));

    this.answers = _.defaults({
      name: this.name
    }, this.answers);

    this.answers.name_dasherized = inflect.dasherize(this.answers.name);
    this.answers.name_classified = inflect.camelize(this.answers.name, true);

    program.config(this).set('name', this.appname);
  };
};
