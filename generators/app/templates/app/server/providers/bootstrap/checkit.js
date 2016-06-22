'use strict';

const Checkit = require('checkit');
const _ = require('lodash');
const utils = require('../../libs/utils');
const config = require('../../config');
const db = require('../database');

let provider = module.exports = {
  instance: null,
  boot() {
    function parseTable(table) {
      let connection;
      let name;

      if (table.indexOf('.') === -1) {
        [connection, name] = table.split('.');
      } else {
        name = table;
        connection = Object.keys(config.get('database'))[0];
      }

      return [connection, name];
    }

    /**
     * Adds 'unique' validation
     *
     * Usage:
     * <pre><code>
     *  let checkit = new Checkit({
   *    'email': 'unique:mysql.users:email'
   *  });
     * </code></pre>
     */
    Checkit.Validator.prototype.unique = function (val, table, column, ignore, idKey) {
      if (!idKey) {
        idKey = 'id';
      }

      console.log(this._target);

      let [tableConn, tableName] = parseTable(table);
      let connection = config.get('database')[tableConn];

      if (utils.isRelationalDB(connection.client)) {
        let qb = db[tableConn].knex(tableName)
          .where(column, '=', val);

        if (ignore) {
          qb = qb.where(idKey, '<>', ignore);
        }

        return qb.then(res => {
          if (res.length > 0) {
            throw new Error('The ' + table + '.' + column + ' field is already in use.');
          }
        });
      }
    };

    /**
     * Adds 'exists' validator
     *
     * Usage:
     * <pre><code>
     *  let checkit = new Checkit({
   *    'email': 'exists:mysql.users:email'
   *  });
     * </code></pre>
     *
     * @param val
     * @param table
     * @param column
     * @returns {*}
     */
    Checkit.Validator.prototype.exists = function (val, table, column) {
      let [tableConn, tableName] = parseTable(table);
      let connection = config.get('database')[tableConn];

      if (utils.isRelationalDB(connection.client)) {
        let qb = db[tableConn].knex(tableName)
          .where(column, '=', val);

        return qb.then(res => {
          if (res.length === 0) {
            throw new Error('The field in ' + table + '.' + column + ' not found.');
          }
        });
      }
    }
  }
};
