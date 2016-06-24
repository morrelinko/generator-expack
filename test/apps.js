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
    // helpers.clear([path.join(__dirname, '/temp/generator-apps')], done);
    done();
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

    it('creates app entry', function () {
      assert.file('server/apps/app.js');
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

    it('creates app entry', function () {
      assert.file('server/apps/docs.js');
    });
  });
});
