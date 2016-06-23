'use strict';

const path = require('path');
const mkdirp = require('mkdirp');

module.exports = function (program) {
  return {
    run() {
      this.writing._generateEntry.call(this);
      this.writing._generateHandler.call(this);
      this.writing._generateRoute.call(this);
      this.writing._generateViews.call(this);
      this.writing._generateValidators.call(this);
      this.writing._updateAppConfig.call(this);
      this.writing._updateDotEnv.call(this);
      this.writing._updateDotProject.call(this);
    },

    /**
     * Creates application entry / bootstrap script.
     *
     * @private
     */
    _generateEntry() {
      if (['web', 'api'].indexOf(this.answers.type) != -1) {
        let dest = this.destinationPath(`server/apps/${this.name}.js`);
        let template = this.templatePath(`app.${this.answers.type}.js.stub`);

        this.fs.copyTpl(template, dest, {
          name: this.name,
          answers: this.answers
        });
      }

      // update server/apps/index.js with app entry point
      let indexFile = this.destinationPath('server/apps/index.js');
      let indexData = program.helpers.ast(this.read(indexFile), function (tree) {
        tree.assignment('module.exports').value()
          .key(this.name).value(`require('./${this.name}')`);
      }.bind(this));

      this.fs.write(indexFile, indexData);
    },

    /**
     *
     * @private
     */
    _generateHandler() {
      if (this.answers.type !== 'custom') {
        let dest = this.destinationPath(`server/handlers/${this.name}`);
        let template = this.templatePath('handlers.index.js.stub');
        mkdirp.sync(dest);
        this.fs.copy(template, path.resolve(dest, 'index.js'));
      }
    },

    /**
     *
     * @private
     */
    _generateRoute() {
      if (this.answers.type !== 'custom') {
        let dest = this.destinationPath(`server/routes/${this.name}`);
        let template = this.templatePath('routes.index.js.stub');
        mkdirp.sync(dest);
        this.fs.copyTpl(template, path.resolve(dest, 'index.js'), {name: this.name});
      }
    },

    /**
     * Generate app view files & dirs.
     * Views are only generated for 'web' app type.
     *
     * @private
     */
    _generateViews() {
      if (this.answers.type === 'web') {
        let layoutPath = this.destinationPath(`server/views/layouts`);
        let viewsPath = path.resolve(layoutPath, `${this.name}.nunjucks`);
        let templatePath = this.templatePath('layout.nunjucks.stub');
        mkdirp.sync(layoutPath);
        this.fs.copyTpl(templatePath, viewsPath)
      }
    },

    /**
     * Generate route validators
     * Only generated for app types 'web' & 'api'
     *
     * @private
     */
    _generateValidators() {
      if (this.answers.type !== 'custom') {
        let validatorPath = this.destinationPath(`server/validators/${this.name}`);
        let templatePath = this.templatePath('validator.index.js.stub');
        mkdirp.sync(validatorPath);
        this.fs.copyTpl(templatePath, path.resolve(validatorPath, 'index.js'), {name: this.name});
      }
    },

    /**
     * Updates `server/config/app.js`
     *
     * @private
     */
    _updateAppConfig() {
      if (this.answers.standalone && this.answers.type !== 'custom') {
        let configFile = this.destinationPath('server/config/app.js');
        let templateFile = this.templatePath('config.app.js.stub');

        let configData = program.helpers.ast(this.read(configFile), function (tree) {
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
            .value(program.helpers.readTpl(this, templateFile, {
              name: this.name,
              host: this.answers.host,
              port: this.answers.port
            }));
        }.bind(this));

        this.fs.write(configFile, configData);
      }
    },

    /**
     * Update .dotenv file with app host and port details
     *
     * @private
     */
    _updateDotEnv() {
      if (this.answers.standalone && this.answers.type !== 'custom') {
        let dotenvFile = this.destinationPath('.dotenv');
        let templateFile = this.templatePath('.dotenv.stub');
        let dotenvData = program.helpers.readTpl(this, templateFile, {
          name: this.name,
          host: this.answers.host,
          port: this.answers.port
        });

        this.fs.write(dotenvFile, `${this.read(dotenvFile)}\n${dotenvData}\n`);
      }
    },

    /**
     * Updates .project with app details
     *
     * @private
     */
    _updateDotProject() {
      program.config(this).set(`apps:${this.name}`, {
        name: this.name,
        type: this.answers.type,
        standalone: this.answers.standalone,
        host: this.answers.host || '',
        port: this.answers.port || '',
        mount_app: this.answers.mount_app || '',
        mount_path: this.answers.mount_path || ''
      });
    }
  };
};
