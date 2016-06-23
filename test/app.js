'use strict';

const path = require('path');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:app', function () {
  describe('create new project', function () {
    before(function () {
      return test.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(__dirname, '/temp/generator-app'))
        .withPrompts({})
        .withArguments(['expack_app'])
        .toPromise();
    });

    after(function (done) {
      helpers.clear([path.join(__dirname, '/temp/generator-app')], done);
    });

    it('creates files', function () {
      assert.file([
        'bin/serve',
        'client',
        'server/apps/index.js',
        'server/config/app.js',
        'server/config/database.js',
        'server/config/index.js',
        'server/config/session.js',
        'server/libs/bag.js',
        'server/libs/expack.js',
        'server/libs/password.js',
        'server/libs/urlpathgen.js',
        'server/libs/utils.js',
        'server/models/index.js',
        'server/middlewares/index.js',
        'server/middlewares/flash.js',
        'server/middlewares/validate.js',
        'server/middlewares/expack.js',
        'server/providers/database/index.js',
        'server/providers/logger/index.js',
        'server/providers/bootstrap/index.js',
        'server/providers/bootstrap/checkit.js',
        'server/providers/bootstrap/nunjucks.js',
        'server/providers/bootstrap/routeplus.js',
        'server/resources/logs/.gitignore',
        'server/views/layouts/template.nunjucks',
        '.project',
        '.gitignore',
        'readme.md',
        '.dotenv'
      ]);
    });

    it('creates and fills package.json', function () {
      assert.file('package.json');
      assert.jsonFileContent('package.json', {
        name: 'expack-app', // app name should be dasherized
        version: '0.0.0'
      });
    });

    it('creates and fills readme.md', function () {
      assert.file('readme.md');
      assert.fileContent('readme.md', '# ExpackApp');
    });
  });
});
