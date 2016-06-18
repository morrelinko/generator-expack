'use strict';

const path = require('path');

module.exports = {
  app: {
    title: process.env.APP_TITLE || 'Application',
    host: process.env.APP_HOST || '127.0.0.1',
    debug: false, // false, 1, 2, 3
    token: process.env.APP_TOKEN || '',
    privateKey: path.resolve(__dirname, '../resources/certs/app.private'),
    publicKey: path.resolve(__dirname, '../resources/certs/app.public')
  }
};
