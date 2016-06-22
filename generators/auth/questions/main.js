'use strict';

const inflect = require('i')();

module.exports = function (program, generator) {
  return [
    {
      type: 'rawlist',
      name: 'database',
      message: 'Select database connection: ',
      choices: generator.databases,
      default: 0
    },
    {
      type: 'rawlist',
      name: 'app',
      message: 'App to mount to: ',
      choices: generator.apps,
      default: 0
    }
  ];
};
