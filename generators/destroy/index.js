'use strict';

let path = require('path');
let generators = require('yeoman-generator');
let chalk = require('chalk');
let del = require('del');
let program = require('../../toolbox/program');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.log(program.helpers.header(program.title));
    this.option('y');
  },

  initializing: function () {
  },

  prompting: function () {
    if (this.options.y) {
      return Promise.resolve(this.answers = {
        confirm: true
      });
    }

    return this.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'This will delete all files in this project. Continue with caution. Proceed?'
      }
    ]).then(answers => {
      this.answers = Object.assign(this.answers || {}, answers);
    });
  },
  writing: function () {
    let done = this.async();
    if (this.answers.confirm) {
      let paths = del.sync([
        this.destinationPath('*'),
        this.destinationPath('.*'),
        '!' + this.destinationPath('node_modules')
      ], {force: false});

      paths.forEach(path => this.log(chalk.green('Deleted: ') + path));
      done();
    }
  }
});
