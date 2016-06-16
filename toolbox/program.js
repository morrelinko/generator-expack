'use strict';

let pck = require('../package.json');

exports.name = pck.generator.name;
exports.title = pck.generator.title;
exports.version = pck.version;
exports.description = pck.description;

exports.helpers = require('./helpers');
exports.config = require('./config');
