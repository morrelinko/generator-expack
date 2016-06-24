'use strict';

const path = require('path');
const Promise = require('bluebird');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:apps', function () {

  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, '/temp/generator-apps'))
      .withArguments(['expack_app'])
      .toPromise();
  });

  after(function (done) {
    helpers.clear([path.join(__dirname, '/temp/generator-apps')], done);
  });

  describe('generates standalone app', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../generators/apps'))
        .withArguments(['app'])
        .inDir(path.join(__dirname, '/temp/generator-apps'))
        .withOptions({
          type: 'web',
          standalone: true,
          host: '127.0.0.1',
          port: 8083
        })
        .on('error', function () {
          console.log('Error');
        })
        .toPromise();
    });

    it('should create app entry file', function () {
      assert.file('server/apps/app.js');
    });

    it('should expose its identifier in index.js', function () {
      assert.file('server/apps/index.js');
      assert.fileContent('server/apps/index.js',
        `app: require('./app')`);
    });

    it('should bootstrap components', function () {
      assert.file('server/handlers/app/index.js');
      assert.file('server/routes/app/index.js');
      assert.file('server/validators/app/index.js');
      assert.file('server/views/layouts/app.nunjucks');
      assert.file('server/views/app');
    });

    it('should create entry in app config', function () {
      assert.file('server/config/app.js');
      assert.fileContent('server/config/app.js', `apps: {\n      app: {`);
    });

    it('should update .project file', function () {
      assert.jsonFileContent('.project', {
        "apps": {
          "app": {
            "name": "app",
            "type": "web",
            "standalone": true,
            "host": "127.0.0.1",
            "port": 8083,
            "mount_app": "",
            "mount_path": ""
          }
        }
      });
    });
  });

  describe('generates mounted app', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../generators/apps'))
        .withArguments(['docs'])
        .inDir(path.join(__dirname, '/temp/generator-apps'))
        .withOptions({
          type: 'web',
          standalone: false,
          app: 'web', // mount_app
          path: '/docs' // mount_path
        })
        .toPromise();
    });

    it('should create app entry file.', function () {
      assert.file('server/apps/docs.js');
    });

    it('should expose its identifier in index.js', function () {
      assert.file('server/apps/index.js');
      assert.fileContent('server/apps/index.js',
        `docs: require('./docs')`);
    });

    it('should bootstrap components', function () {
      assert.file('server/handlers/docs/index.js');
      assert.file('server/routes/docs/index.js');
      assert.file('server/validators/docs/index.js');
      assert.file('server/views/layouts/docs.nunjucks');
      assert.file('server/views/docs');
    });

    it('should not create entry in app config', function () {
      assert.file('server/config/app.js');
      assert.noFileContent('server/config/app.js', `apps: {\n      docs: {`);
    });

    it('should update .project file', function () {
      assert.jsonFileContent('.project', {
        "apps": {
          "docs": {
            "name": "docs",
            "type": "web",
            "standalone": false,
            "host": "",
            "port": "",
            "mount_app": "web",
            "mount_path": "/docs"
          }
        }
      });
    });
  });
});
