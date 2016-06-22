'use strict';

const assign = require('deep-assign');

module.exports = function (program) {
  return {
    run() {
      this.writing._updateDotEnv.call(this);
      this.writing._updateConfig.call(this);
      this.writing._createProvider.call(this);
      this.writing._createBaseModels.call(this);
      this.writing._updatePackage.call(this);
      this.writing._updateDotProject.call(this);
    },

    /**
     * Update .dotenv file with db config values
     * consumed by the app wide config located at
     * #server/config/database.js
     *
     * @private
     */
    _updateDotEnv() {
      let template = null;
      if (program.helpers.isRelationalDB(this.answers.database)) {
        template = this.templatePath('dotenv/sql.stub');
      } else if (this.answers.database === 'mongodb') {
        template = this.templatePath('dotenv/mongo.stub');
      }

      let dest = this.destinationPath('.dotenv');
      let dotenv = program.helpers.readTpl(this, template, {answers: this.answers});
      this.fs.write(dest, `${this.read(dest)}\n${dotenv}\n`);
    },

    /**
     * Adds database connection information to app wide db config.
     *
     * @private
     */
    _updateConfig() {
      let template = null;
      let dest = this.destinationPath('server/config/database.js');

      if (program.helpers.isRelationalDB(this.answers.database)) {
        template = this.templatePath('config/sql.stub');
      } else if (this.answers.database === 'mongodb') {
        template = this.templatePath('config/mongo.stub');
      }

      let configStub = program.helpers.readTpl(this, template, {
        answers: this.answers
      });

      let configData = program.helpers.ast(this.read(dest), function (tree) {
        tree.assignment('module.exports').value()
          .key('database').key(this.answers.identifier).value(configStub);
      }.bind(this));
      this.fs.write(dest, configData);
    },

    /**
     * Create database provider
     *
     * @private
     */
    _createProvider() {
      let template = null;
      let dest = this.destinationPath(`server/providers/database/${this.answers.identifier}.js`);

      if (program.helpers.isRelationalDB(this.answers.database)) {
        template = this.templatePath('providers/sql.js.stub');
      } else if (this.answers.database === 'mongodb') {
        template = this.templatePath('providers/mongo.js.stub');
      }

      this.fs.copyTpl(template, dest, {answers: this.answers});

      let providerFile = this.destinationPath('server/providers/database/index.js');
      let providerData = program.helpers.ast(this.read(providerFile), function (tree) {
        tree.assignment('module.exports').value()
          .key(this.answers.identifier)
          .value(`require('./${this.answers.identifier}')`);
      }.bind(this));
      this.fs.write(providerFile, providerData);
    },

    _createBaseModels() {
      if (program.helpers.isRelationalDB(this.answers.database)) {
        this.fs.copyTpl(this.templatePath('models/bookshelf.js.stub'),
          this.destinationPath('server/models/base/bookshelf.js'), {});
        this.fs.copyTpl(this.templatePath('models/base.js.sql.stub'),
          this.destinationPath(`server/models/base/${this.answers.identifier}.js`), {
            answers: this.answers
          });
      } else if (this.answers.database === 'mongodb') {
        this.fs.copyTpl(this.templatePath('models/base.js.mongo.stub'),
          this.destinationPath(`server/models/base/${this.answers.identifier}.js`), {
            answers: this.answers
          });
      }
    },

    /**
     * Update package.json dependencies with database dependencies
     *
     * @private
     */
    _updatePackage() {
      let dest = this.destinationPath('package.json');
      let template = this.templatePath('dependencies.stub');
      let pkg = program.helpers.readJson(this, dest);

      let deps = JSON.parse(program.helpers.readTpl(this, template, {
        relationalDB: program.helpers.isRelationalDB(this.answers.database),
        answers: this.answers
      }));

      pkg.dependencies = Object.assign(pkg.dependencies, deps);
      this.fs.writeJSON(dest, pkg);
    },

    /**
     * Update .project file with database details
     *
     * @private
     */
    _updateDotProject() {
      program.config(this).set(`database:${this.answers.identifier}`, {
        identifier: this.answers.identifier,
        database: this.answers.database
      });
    }
  };
};
