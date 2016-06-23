'use strict';

const path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const test = require('yeoman-test');
const del = require('del');

exports.run = function (Generator, settings) {
  let runner = test.run(Generator, settings);

  runner.inDir = function (dirPath, cb) {
    runner.inDirSet = true;
    runner.targetDirectory = dirPath;
    var release = runner.async();
    var callBackThenRelease = _.flowRight(release,
      (cb || _.noop).bind(runner, path.resolve(dirPath)));
    testDirectory(dirPath, callBackThenRelease);
    return runner;
  };

  function testDirectory(dir, cb) {
    dir = path.resolve(dir);
    process.chdir('/');
    mkdirp.sync(dir);
    process.chdir(dir);
    cb();
  }

  return runner;
};

exports.clear = function (pattern, cb) {
  process.chdir(path.resolve(__dirname, '..'));
  del.sync(pattern);
  cb();
};
