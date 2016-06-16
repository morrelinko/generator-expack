'use strict';

let generators = require('yeoman-generator');
let program = require('../../toolbox/program');
let steps = require('./steps');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.log(program.helpers.header(program.title));
  },

  initializing: steps.initializing(program),
  prompting: steps.prompting(program),
  writing: steps.writing(program)
});
