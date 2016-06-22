'use strict';

/**
 * 
 * @param name
 * @returns {boolean}
 */
exports.isRelationalDB = function (name) {
  return ['mysql', 'pg', 'sqlite'].indexOf(name) !== -1;
};
