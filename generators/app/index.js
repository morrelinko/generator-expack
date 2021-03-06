'use strict';

let generators = require('yeoman-generator');
let program = require('../../toolbox/program');
let steps = require('./steps');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.argument('name', {type: String, required: false});
  },

  initializing: steps.initializing(program),
  prompting: steps.prompting(program),
  configuring: steps.configuring(program),
  writing: steps.writing(program),
  conflicts: steps.conflicts(program),
  install: steps.install(program),
  end: steps.end(program)
});
