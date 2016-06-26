'use strict';

const path = require('path');
const Promise = require('bluebird');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:auth', function () {
  // Generate project
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, '/temp/generator-auth'))
      .withArguments(['expack_app'])
      .toPromise();
  });

  // Generate app
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/apps'))
      .withArguments(['app'])
      .inDir(path.join(__dirname, '/temp/generator-auth'))
      .withOptions({type: 'web', standalone: true, host: '127.0.0.1', port: 8083})
      .toPromise();
  });

  // Generate database
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/database'))
      .inDir(path.join(__dirname, '/temp/generator-auth'))
      .withPrompts({database: 'mysql', identifier: 'main'})
      .toPromise();
  });

  after(function (done) {
    helpers.clear([path.join(__dirname, '/temp/generator-auth')], done);
  });

  describe('run auth generator', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../generators/auth'))
        .inDir(path.join(__dirname, '/temp/generator-auth'))
        .withPrompts({database: 'main', app: 'app'})
        .toPromise();
    });

    it('should create mounted app', function () {
      assert.file('server/apps/auth.js');
    });

    it('should generate route file', function () {
      assert.file('server/routes/auth/index.js');
      assert.fileContent('server/routes/auth/index.js', `app.get('/auth/login'`);
    });

    it('should create handler file', function () {
      assert.file('server/handlers/auth/index.js');
      assert.noFile('server/handlers/auth/auth.js');
      assert.fileContent('server/handlers/auth/index.js', 'getLogin (req, res) {');
      assert.fileContent('server/handlers/auth/index.js', 'getLogout (req, res) {');
      assert.fileContent('server/handlers/auth/index.js', 'getRegister (req, res) {');
    });

    it('should create passport bootstrap provider', function () {
      assert.file('server/providers/bootstrap/passport.js');
    });

    it('should expose passport in boostrap main file', function () {
      assert.file('server/providers/bootstrap/index.js');
      assert.fileContent('server/providers/bootstrap/index.js',
        `require('./passport').boot(app, opts)`);
      assert.fileContent('server/providers/bootstrap/index.js',
        `get: () => require('./passport').instance`);
    });

    it('should generate middleware files', function () {
      assert.file('server/middlewares/auth.js');
      assert.file('server/middlewares/guest.js');
    });

    it('should generate user model', function () {
      assert.file('server/models/user.js');
      assert.file('server/models/index.js');
      assert.fileContent('server/models/index.js', `User: require('./`);
      assert.fileContent('server/models/user.js',
        `model.set('password', password.hash(attributes.password));`);
    });

    it('should generate validator file', function () {
      assert.file('server/validators/auth/index.js');
      assert.fileContent('server/validators/auth/index.js', `exports.postRegister`);
      assert.fileContent('server/validators/auth/index.js', `exports.postLogin`);
    });

    it('should create view files', function () {
      assert.file('server/views/auth/login.nunjucks');
      assert.file('server/views/auth/password-request.nunjucks');
      assert.file('server/views/auth/password-reset.nunjucks');
      assert.file('server/views/auth/register.nunjucks');
      assert.file('server/views/auth/verify.nunjucks');
    });
  });
});
