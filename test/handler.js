'use strict';

const path = require('path');
const Promise = require('bluebird');
const test = require('yeoman-test');
const assert = require('yeoman-assert');
const helpers = require('./helpers');

describe('expack:handler', function () {
  // Create project
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, '/temp/generator-handler'))
      .withArguments(['expack_app'])
      .toPromise();
  });

  // Generate apps
  before(function () {
    let promises = [];

    // Application
    promises.push(helpers.run(path.join(__dirname, '../generators/apps'))
      .withArguments(['app'])
      .inDir(path.join(__dirname, '/temp/generator-handler'))
      .withOptions({
        type: 'web',
        standalone: true,
        host: '127.0.0.1',
        port: 8083
      })
      .toPromise());

    // Frontend
    promises.push(helpers.run(path.join(__dirname, '../generators/apps'))
      .withArguments(['frontend'])
      .inDir(path.join(__dirname, '/temp/generator-handler'))
      .withOptions({
        type: 'web',
        standalone: true,
        host: '127.0.0.1',
        port: 8084
      })
      .toPromise());

    return Promise.all(promises);
  });

  after(function (done) {
    helpers.clear([path.join(__dirname, '/temp/generator-handler')], done);
  });

  describe('generates handler and associated components', function () {
    // Running expack:handler with a name, the --separate option is overlooked.
    // and a separate file is generated for each handler and associated components.
    describe('with name argument and --separate', function () {
      before(function () {
        return helpers.run(path.join(__dirname, '../generators/handler'))
          .withArguments(['dashboard'])
          .inDir(path.join(__dirname, '/temp/generator-handler'))
          .withOptions({app: 'app', separate: true})
          .toPromise();
      });

      it('generates handler file', function () {
        assert.file('server/handlers/app/dashboard.js');
        assert.file('server/handlers/app/index.js');

        assert.fileContent('server/handlers/app/index.js',
          `dashboard: require('./dashboard')`);
        assert.fileContent('server/handlers/app/dashboard.js',
          `getIndex (req, res)`);
      });

      it('generates route file', function () {
        assert.file('server/routes/app/index.js');
        assert.file('server/routes/app/dashboard.js');
      });

      it('generates validator file', function () {
        assert.file('server/validators/app/index.js');
        assert.file('server/validators/app/dashboard.js');
      });

      it('generates view file', function () {
        assert.file('server/views/app/dashboard/index.nunjucks');
      });
    });

    // Running expack without a name suggests you want the index.js file
    // to expose your handler. But the --no-separate option is required.
    describe('with no name and --no-separate', function () {
      before(function () {
        return helpers.run(path.join(__dirname, '../generators/handler'))
          .inDir(path.join(__dirname, '/temp/generator-handler'))
          .withOptions({app: 'frontend', separate: false})
          .toPromise();
      });

      it('generates handler file', function () {
        assert.file('server/handlers/frontend/index.js');
        assert.fileContent('server/handlers/frontend/index.js',
          `getIndex (req, res)`);
      });

      it('generates route file', function () {
        assert.file('server/routes/frontend/index.js');
        assert.fileContent('server/routes/frontend/index.js',
          `router.get`);
      });

      it('generates validator file', function () {
        assert.file('server/validators/frontend/index.js');
      });

      it('generates view file', function () {
        assert.file('server/views/frontend/index.nunjucks');
      });
    });

  });
});
