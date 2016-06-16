'use strict';

let ast = require('ast-query');

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let identifier = this.answers.identifier;
    let database = this.answers.database;
    let dotenv = this.read(this.destinationPath('.dotenv'));
    let dbconf = this.read(this.destinationPath('server/config/database.js'));
    let dotenvTpl = null;
    let dbconfTpl = null;

    if (program.helpers.isSQLDatabase(this.answers.database)) {
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

    let tree = ast(dbconf);
    tree.assignment('module.exports').value()
      .key('database')
      .key(identifier)
      .value(dbconfTpl);

    this.fs.write(this.destinationPath('server/config/database.js'), tree.toString());

    // -- Update .project config
    config.set(`database:${this.answers.database}`, {
      identifier: identifier,
      database: database
    });
  };
};
