'use strict';

const chalk = require('chalk');
const ejs = require('ejs');
const Promise = require('bluebird');
const crypto = require('crypto');
const figlet = require('figlet');
const assign = require('deep-assign');
const ast = require('ast-query');
const esformatter = require('esformatter');

exports.ast = function (source, handler, opts) {
  opts = assign({
    escode: {
      format: {
        compact: false,
        preserveBlankLines: true
      },
      comment: true,
      sourceCode: source
    },
    esprima: {
      ecmaVersion: 6,
      tokens: true,
      range: true
    },
    format: {
      lineBreak: {
        before: {
          EndOfFile: 1
        }
      }
    }
  });

  let tree = ast(source, opts.escode, opts.esprima);

  handler.call(handler, tree);

  return esformatter.format(tree.toString(), opts.format);
};

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
