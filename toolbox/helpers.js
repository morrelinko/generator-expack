'use strict';

let chalk = require('chalk');
let ejs = require('ejs');
let Promise = require('bluebird');
let crypto = require('crypto');
let figlet = require('figlet');

exports.header = function (title) {
  return figlet.textSync(title);
};

exports.readTpl = function (generator, file, context) {
  return ejs.render(generator.read(file), context);
};

exports.generateToken = function (bytes) {
  return crypto.randomBytes(bytes || 32).toString('hex');
};

exports.wait = function (delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), delay);
  });
};

exports.isRelationalDB = function (db) {
  return ['mysql'].indexOf(db) !== -1;
};

exports.ensureExpack = function (generator, program) {
  if (!generator.fs.exists(generator.destinationPath('package.json'))
    && !generator.fs.exists(generator.destinationPath('.project'))) {
    generator.log(chalk.red([
      'This is not an ' + chalk.green(program.title) + ' application.',
      ' Run "' + chalk.cyan('yo expack') + '" to bootstrap an application'
    ].join('')));
    process.exit(1);
  }
};
