'use strict';

var convict = require('convict');
var _ = require('lodash');

var config = convict({
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
fs.readdir(__dirname, (err, files) => {
  for (let i = 0; i < items.length; i++) {
    config.load(require(files[i]));
  }
});

config.validate();

module.exports = config;
