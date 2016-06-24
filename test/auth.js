'use strict';

const path = require('path');
const Promise = require('bluebird');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:auth', function () {
  // Generate project
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/auth'))
      .inDir(path.join(__dirname, '/temp/generator-auth'))
      .withArguments(['expack_app'])
      .toPromise();
  });

  after(function (done) {
    helpers.clear([path.join(__dirname, '/temp/generator-auth')], done);
  });
});
