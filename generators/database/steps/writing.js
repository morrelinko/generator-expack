'use strict';

const assign = require('deep-assign');

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let identifier = this.answers.identifier;
    let database = this.answers.database;
    let dotenv = this.read(this.destinationPath('.dotenv'));
    let dbconf = this.read(this.destinationPath('server/config/database.js'));
    let dotenvTpl = null;
    let dbconfTpl = null;
    let dbproviderTpl = null;

    if (program.helpers.isRelationalDB(this.answers.database)) {
      dotenvTpl = this.templatePath('sql.dotenv.stub');
      dbconfTpl = this.templatePath('sql.config.stub');
      dbproviderTpl = this.templatePath('provider.sql.js.stub');
    }

    if (this.answers.database === 'mongodb') {
      dotenvTpl = this.templatePath('mongo.dotenv.stub');
      dbconfTpl = this.templatePath('mongo.config.stub');
      dbproviderTpl = this.templatePath('provider.mongo.js.stub');
    }

    // -- update .dotenv with db settings
    dotenvTpl = program.helpers.readTpl(this, dotenvTpl, {
      database: database,
      identifier: identifier.toUpperCase()
    });

    this.fs.write(this.destinationPath('.dotenv'), `${dotenv}\n${dotenvTpl}\n`);

    // -- update database config
    dbconfTpl = program.helpers.readTpl(this, dbconfTpl, {
      database: database,
      identifier: identifier.toUpperCase()
    });

    let dbconfUpdate = program.helpers.ast(dbconf, function (tree) {
      tree.assignment('module.exports').value()
        .key('database')
        .key(identifier)
        .value(dbconfTpl);
    }.bind(this));
    this.fs.write(this.destinationPath('server/config/database.js'), dbconfUpdate);

    // -- update .project config
    config.set(`database:${identifier}`, {
      identifier: identifier,
      database: database
    });

    // -- add to db provider
    this.fs.copy(dbproviderTpl, this.destinationPath(`server/providers/database/${identifier}.js`));
    let dbProviderUpdate = program.helpers.ast(
      this.read(this.destinationPath('server/providers/database/index.js')),
      function (tree) {
        tree.assignment('module.exports').value()
          .key(identifier)
          .value(`require('./${identifier}')(config.get('database.${identifier}'))`);
      }.bind(this)
    );

    this.fs.write(this.destinationPath('server/providers/database/index.js'), dbProviderUpdate);

    // -- update package.json dependencies
    let pkg = program.helpers.readJson(this, this.destinationPath('package.json'));
    let deps = program.helpers.readTpl(this, this.templatePath('dependencies.stub'), {
      relationalDB: program.helpers.isRelationalDB(this.answers.database),
      answers: this.answers
    });

    pkg.dependencies = Object.assign(pkg.dependencies, deps);
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    // TODO: define a better way for handling migrations
    // Create a knexfile.js if a relational database is selected
    // this is used by knex lib for migrations and seeding.
    /** if (program.helpers.isRelationalDB(this.answers.database)) {
      if (!this.fs.exists(this.destinationPath('knexfile.js'))) {
        this.fs.copy(this.templatePath('knexfile.js.stub'), this.destinationPath('knexfile.js'));
      }
    }/**/
  };
};
