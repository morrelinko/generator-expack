'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const nunjucks = require('../providers/nunjucks');
const config = require('../config');
const routes = require('../routes/web');

module.exports = function () {
  let app = express.Router();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.use(cookieParser());
  app.use(flash());
  app.use(session({
    secret: config.get('app.token'),
    resave: false,
    saveUninitialized: false
  }));

  nunjucks(app);
  routes(app);

  return app;
};
