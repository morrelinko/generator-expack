'use strict';

let path = require('path');
let ejs = require('ejs');
let Promise = require('bluebird');
let _ = require('lodash');
let del = require('del');
let glob = require('glob');

module.exports = function (program) {
  return function () {
    let config = program.config(this);

    // Copy folders
    this.directory('app/bin', 'bin');
    this.directory('app/client', 'client');
    this.directory('app/server', 'server');

    // Create .gitignore
    this.fs.copy(
      this.templatePath('.gitignore.stub'),
      this.destinationPath('.gitignore'));

    // Create readme.md
    this.fs.copyTpl(
      this.templatePath('readme.md.stub'),
      this.destinationPath('readme.md'), {
        name: this.answers.name_classified,
        description: this.pck.description
      });

    // Create .dotenv file
    this.fs.copyTpl(
      this.templatePath('.dotenv.stub'),
      this.destinationPath('.dotenv'), {
        title: this.answers.name_classified,
        token: program.helpers.generateToken()
      });

    // Update package.json
    let deps = JSON.parse(this.read(this.templatePath('dependencies.json.stub')));
    this.pck.name = this.answers.name_dasherized;
    this.pck.dependencies = deps.dependencies;
    this.pck.devDependencies = deps.devDependencies;
    this.fs.writeJSON(this.destinationPath('package.json'), this.pck);

    // update .project file
    config.set('app_name', this.answers.name_dasherized);
    config.set('app_title', this.answers.name_classified);
  };
};
