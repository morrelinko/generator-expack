'use strict';

const path = require('path');
const mkdirp = require('mkdirp');

module.exports = function (program) {
  return function () {
    this.name = this.name.toLowerCase();

    let config = program.config(this);
    let type = this.answers.type;

    // -- entry point
    if (['web', 'api'].indexOf(type) !== -1) {
      this.fs.copyTpl(this.templatePath(`app.${type}.js.stub`),
        this.destinationPath(`server/apps/${this.name}.js`), {
          answers: this.answers,
          name: this.name
        });

      // update server/apps/index.js with app entry point
      let indexFile = this.destinationPath('server/apps/index.js');
      let content = program.helpers.ast(this.read(indexFile), function (tree) {
        tree.assignment('module.exports').value()
          .key(this.name).value(`require('./${this.name}')`);
      }.bind(this));

      this.fs.write(indexFile, content);
    }

    // -- handlers
    if (type !== 'custom') {
      let handlersPath = this.destinationPath(`server/handlers/${this.name}`);
      mkdirp.sync(handlersPath);
      this.fs.copy(
        this.templatePath('handlers.index.js.stub'),
        path.resolve(handlersPath, 'index.js'));
    }

    // -- routes
    // routes are only generated for api & web type
    if (type !== 'custom') {
      let routesPath = this.destinationPath(`server/routes/${this.name}`);
      mkdirp.sync(routesPath);
      this.fs.copyTpl(
        this.templatePath('routes.index.js.stub'),
        path.resolve(routesPath, 'index.js'), {
          name: this.name
        }
      );
    }
    
    // -- views
    if (type === 'web') {
      // only generate views for web type
      let viewsPath = this.destinationPath(`server/views/${this.name}`);
      mkdirp.sync(path.resolve(viewsPath, 'layout'));
      this.fs.copyTpl(
        this.templatePath('layout.nunjucks.stub'),
        path.resolve(viewsPath, 'layout', 'template.nunjucks'))
    }

    // -- validators
    if (type !== 'custom') {
      let validatorPath = this.destinationPath(`server/validators/${this.name}`);
      mkdirp.sync(validatorPath);
      this.fs.copyTpl(
        this.templatePath('validator.index.js.stub'),
        path.resolve(validatorPath, 'index.js'), {
          name: this.name
        }
      );
    }

    // -- update server/config/app.js
    if (this.answers.standalone && type !== 'custom') {
      let configFile = this.destinationPath('server/config/app.js');
      let content = program.helpers.ast(this.read(configFile), function (tree) {
        tree.__app = tree.assignment('module.exports').value().key('app');
        tree.__apps = tree.__app.key('apps');

        if (tree.__apps.node.properties.length == 0) {
          // If the 'apps' key hasn't been defined .
          // in the config, create it and set its
          // value to an empty object.
          tree.__apps.value('{}');
        }

        tree.__apps
          .key(this.name)
          .value(program.helpers.readTpl(this, this.templatePath('config.app.js.stub'), {
            name: this.name,
            host: this.answers.host,
            port: this.answers.port
          }));
      }.bind(this));

      this.fs.write(configFile, content);

      // -- update .dotenv
      let dotenv = this.read(this.destinationPath('.dotenv'));
      let dotenvApp = program.helpers.readTpl(this, this.templatePath('.dotenv.stub'), {
        name: this.name,
        host: this.answers.host,
        port: this.answers.port
      });

      this.fs.write(this.destinationPath('.dotenv'), `${dotenv}\n${dotenvApp}\n`);
    }

    // -- update .project
    config.set(`apps:${this.name}`, {
      name: this.name,
      type: type,
      standalone: this.answers.standalone,
      host: this.answers.host || '',
      port: this.answers.port || '',
      mount_app: this.answers.mount_app || '',
      mount_path: this.answers.mount_path || ''
    });
  };
};
