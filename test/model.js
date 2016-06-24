'use strict';

const path = require('path');
const Promise = require('bluebird');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:model', function () {
  // Generate project
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, '/temp/generator-model'))
      .withArguments(['expack_app'])
      .toPromise();
  });

  // Generate database
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/database'))
      .inDir(path.join(__dirname, '/temp/generator-model'))
      .withPrompts({database: 'mysql', identifier: 'main'})
      .toPromise();
  });

  after(function (done) {
    helpers.clear([path.join(__dirname, '/temp/generator-model')], done);
  });

  describe('generate relational DB model', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../generators/model'))
        .withArguments(['category'])
        .inDir(path.join(__dirname, '/temp/generator-model'))
        .withOptions({database: 'main', table: 'categories'})
        .toPromise();
    });

    it('should generate model file', function () {
      assert.file('server/models/category.js');
    });

    it('should extend selected database base model', function () {
      assert.fileContent('server/models/category.js',
        `const base = require('./base/main')`);
      assert.fileContent('server/models/category.js',
        'base.Model.extend');
    });
  });

  describe('generate mongo DB model', function () {

  });

  describe('generate couch DB model', function () {

  });
});
