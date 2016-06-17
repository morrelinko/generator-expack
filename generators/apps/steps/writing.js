'use strict';

const path = require('path');
const mkdirp = require('mkdirp');

module.exports = function (program) {
  return function () {
    this.name = this.name.toLowerCase();

    let type = this.answers.type;

    // -- entry point
    if (['web', 'api'].indexOf(type) !== -1) {
      this.fs.copy(this.templatePath(`app.${type}.js`),
        this.destinationPath(`server/apps/${type}.js`));
    }

    if (type !== 'custom') {
      // -- routes
      // routes are only generated for api & web type
      let routesPath = this.destinationPath(`server/routes/${this.name}`);
      mkdirp.sync(routesPath);
      this.fs.copyTpl(
        this.templatePath('routes.index.js.stub'),
        path.resolve(routesPath, 'index.js'), {
          name: this.name
        }
      );
    }

    if (type === 'web') {
      // -- views
      // only generate views for web type
      let viewsPath = this.destinationPath(`server/views/${this.name}`);
      mkdirp.sync(viewsPath);
      mkdirp.sync(path.resolve(viewsPath, 'layout'));
      this.fs.copyTpl(
        this.templatePath('layout.nunjucks.stub'),
        path.resolve(viewsPath, 'layout', 'template.nunjucks'))
    }

    if (type !== 'custom') {
      // -- validators
      mkdirp.sync(this.destinationPath(`server/validators/${this.name}`));
    }
  };
};
