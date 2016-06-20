'use strict';

const bcrypt = require('bcrypt');

/**
 *
 * @param str
 */
exports.hash = function (str) {
  return bcrypt.hashSync(str, 10);
};

/**
 *
 * @param str
 * @param hash
 */
exports.verify = function (str, hash) {
  return bcrypt.compareSync(str, hash);
};
