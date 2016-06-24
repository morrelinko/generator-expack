'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:database', function () {
  // Create project
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, '/temp/generator-database'))
      .withArguments(['expack_app'])
      .toPromise();
  });

  after(function (done) {
    helpers.clear([path.join(__dirname, '/temp/generator-database')], done);
  });

  describe('generate relational DB', function () {
    before(function () {
      this.beforePckg = JSON.parse(fs.readFileSync('package.json').toString());
      return helpers.run(path.join(__dirname, '../generators/database'))
        .inDir(path.join(__dirname, '/temp/generator-database'))
        .withPrompts({
          database: 'mysql',
          identifier: 'main'
        })
        .toPromise();
    });

    it('creates connection file', function () {
      assert.file('server/providers/database/main.js');
    });

    it('creates entry in database provider', function () {
      assert.file('server/providers/database/index.js');
      assert.fileContent('server/providers/database/index.js',
        `main: require\('\.\/main'\)`);
    });

    it('creates entry in database config', function () {
      assert.file('server/config/database.js');
      assert.fileContent('server/config/database.js', 'database: {\n    main: {');
    });

    it('adds dependencies to package.json', function () {
      this.afterPckg = JSON.parse(fs.readFileSync('package.json').toString());
      assert.ok(!('mysql' in this.beforePckg.dependencies));
      assert.ok('knex' in this.afterPckg.dependencies);
      assert.ok('bookshelf' in this.afterPckg.dependencies);
    });

    it('adds db config to .dotenv file', function () {
      assert.file('.dotenv');
      assert.fileContent('.dotenv', 'DB_MAIN_HOST=localhost');
      assert.fileContent('.dotenv', 'DB_MAIN_DATABASE=expack_app');
      assert.fileContent('.dotenv', 'DB_MAIN_USERNAME=root');
      assert.fileContent('.dotenv', 'DB_MAIN_PASSWORD=123456');
    });

    it('creates base model files', function () {
      assert.file('server/models/base/bookshelf.js');
      assert.file('server/models/base/main.js');
    });

    it('adds database entry to .project', function () {
      assert.jsonFileContent('.project', {
        "database": {
          "main": {
            "identifier": "main",
            "database": "mysql"
          }
        }
      });
    });
  });

  describe('generate mongo DB', function () {

  });

  describe('generate couch DB', function () {

  });
});
