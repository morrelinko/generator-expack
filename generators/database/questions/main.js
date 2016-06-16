'use strict';

module.exports = function (program, generator) {
  let config = program.config(generator);
  let supported = [
    'mysql',
    'mongodb'
  ];

  return [
    {
      type: 'rawlist',
      name: 'database',
      message: 'Choose a database',
      choices: supported,
      defaults: 0
    },
    {
      type: 'input',
      name: 'identifier',
      message: 'Database Identifier',
      default: answers => answers.database
    }
  ];
};
