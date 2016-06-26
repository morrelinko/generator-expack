'use strict';

let nconf = require('nconf');

module.exports = function (generator) {
  nconf.file({
    file: generator.destinationPath('.project')
  });

  return {
    set(name, value) {
      nconf.set(name, value);
      nconf.save();
    },

    get(name) {
      return nconf.get(name);
    },

    databaseOf(identifier) {
      let db = this.get(`database:${identifier}`);
      return db.database;
    }
  };
};

