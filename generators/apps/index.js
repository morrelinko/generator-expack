'use strict';

let generators = require('yeoman-generator');
let program = require('../../toolbox/program');
let steps = require('./steps');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.argument('name', {type: String, required: true, desc: 'App name'});
    this.option('type', {type: String, required: false});
    this.option('standalone', {type: Boolean, required: false});
    this.option('path', {type: String, required: false});
    this.option('app', {type: String, required: false});
    this.option('with-handler', {type: Boolean, required: false, default: true});
    this.option('with-route', {type: Boolean, required: false, default: true});
    this.option('with-validator', {type: Boolean, required: false, default: true});
  },

  initializing: steps.initializing(program),
  prompting: steps.prompting(program),
  configuring: steps.configuring(program),
  writing: steps.writing(program)
});
