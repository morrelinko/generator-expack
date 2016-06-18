'use strict';

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let identifier = this.answers.identifier;
    let database = this.answers.database;
    let dotenv = this.read(this.destinationPath('.dotenv'));
    let dbconf = this.read(this.destinationPath('server/config/database.js'));
    let dotenvTpl = null;
    let dbconfTpl = null;

    if (program.helpers.isRelationalDB(this.answers.database)) {
      dotenvTpl = this.templatePath('sql.dotenv.stub');
      dbconfTpl = this.templatePath('sql.config.stub');
    }

    if (this.answers.database === 'mongodb') {
      dotenvTpl = this.templatePath('mongo.dotenv.stub');
      dbconfTpl = this.templatePath('mongo.config.stub');
    }

    // -- Update .dotenv
    dotenvTpl = program.helpers.readTpl(this, dotenvTpl, {
      database: database,
      identifier: identifier.toUpperCase()
    });

    this.fs.write(this.destinationPath('.dotenv'), `${dotenv}\n${dotenvTpl}`);

    // -- Update database config
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

    this.fs.write(this.destinationPath('server/config/database.js'), dbconfgUpdate);

    // -- Update .project config
    config.set(`database:${this.answers.database}`, {
      identifier: identifier,
      database: database
    });

    // Create a knexfile.js if a relational database is selected
    // this is used by knex lib for migrations and seeding.
    if (program.helpers.isRelationalDB(this.answers.database)) {
      if (!this.fs.exists(this.destinationPath('knexfile.js'))) {
        this.fs.copy(this.templatePath('knexfile.js.stub'), this.destinationPath('knexfile.js'));
      }
    }

    // TODO: Create knexfile.js if 'database' is relational db
  };
};
