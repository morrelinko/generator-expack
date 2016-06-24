'use strict';

const path = require('path');
const Promise = require('bluebird');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:model', function () {
  // Generate project
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/model'))
      .inDir(path.join(__dirname, '/temp/generator-database'))
      .withArguments(['expack_app'])
      .toPromise();
  });

  after(function (done) {
    helpers.clear([path.join(__dirname, '/temp/generator-model')], done);
  });
});
