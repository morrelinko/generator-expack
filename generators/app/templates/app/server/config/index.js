'use strict';

const fs = require('fs');
const path = require('path');
const convict = require('convict');
const _ = require('lodash');

let config = convict({
  env: {
    format: ['production', 'staging', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env'
  }
});

config.consts = {};
config.consts.ROOT_DIR = path.resolve(__dirname, '../..');
config.consts.ENV_DEV = 'development';
config.consts.ENV_PROD = 'production';
config.consts.ENV_STAGING = 'staging';

// Load config files...
config.load(require('./app'));
config.load(require('./database'));
config.load(require('./session'));

config.validate();

module.exports = config;
