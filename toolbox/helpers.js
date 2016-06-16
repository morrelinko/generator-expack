'use strict';

let ejs = require('ejs');
let Promise = require('bluebird');
let crypto = require('crypto');
let figlet = require('figlet');

exports.header = function (title) {
  return figlet.textSync(title);
};

exports.readTpl = function (generator, file, context) {
  return ejs.render(generator.read(file), contexta);
};

exports.generateToken = function (bytes) {
  return crypto.randomBytes(bytes || 32).toString('hex');
};

exports.wait = function (delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), delay);
  });
};

exports.isSQLDatabase = function (db) {
  return ['mysql'].indexOf(db) !== -1;
};

exports.ensureExpack = function (generator) {
  if (!generator.fs.exists(generator.destinationPath('package.json'))
    && !generator.fs.exists(generator.destinationPath('.project'))) {
    generator.log(chalk.red([
      'This is not an ' + chalk.green(program.title) + ' application.',
      ' Run "' + chalk.cyan('yo expack') + '" to bootstrap an application'
    ].join('')));
    process.exit(1);
  }
};
