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
    acorn: {
      ecmaVersion: 6,
      tokens: true,
      range: true
    },
    format: {}
  }, opts);

  let tree = ast(source, opts.escode, opts.acorn);

  handler.call(handler, tree);

  return exports.formatJS(tree.toString(), opts.format);
};

exports.formatJS = function (data, opts) {
  opts = assign({
    lineBreak: {
      before: {
        EndOfFile: 1,
        FunctionExpressionClosingBrace: 1,
        ObjectExpressionClosingBrace: ">=1",
        Property: ">=1"
      },
      after: {
        ObjectExpressionOpeningBrace: ">=1"
      }
    }
  }, opts);

  return esformatter.format(data, opts);
};

exports.header = function (title) {
  return figlet.textSync(title);
};

exports.readTpl = function (gen, file, context) {
  return ejs.render(gen.read(file), context);
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
  return ['mysql', 'pg', 'sqlite'].indexOf(db) !== -1;
};

exports.getDBIdentifier = function (db) {
  if (exports.isRelationalDB(db)) {
    return 'sqldb';
  } else if (['mongodb', 'couchdb'].indexOf(db) !== -1) {
    return db;
  }
};

exports.ensureExpack = function (gen, program) {
  if (!gen.fs.exists(gen.destinationPath('package.json'))
    && !gen.fs.exists(gen.destinationPath('.project'))) {
    gen.env.error(chalk.red([
      'This is not an ' + chalk.green(program.title) + ' application.',
      ' Run "' + chalk.cyan('yo expack') + '" to bootstrap an application'
    ].join('')));
  }
};

exports.readJson = function (gen, file) {
  return JSON.parse(gen.read(file));
};
