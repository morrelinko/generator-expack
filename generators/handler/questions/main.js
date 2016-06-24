'use strict';

const util = require('util');

module.exports = function (program, generator) {
  let config = program.config(generator);
  let apps = Object.keys(config.get('apps'));

  return [
    {
      type: 'input',
      name: 'name',
      message: 'Handler (controller) name: ',
      when: util.isUndefined(generator.name) && generator.options.separate
    },
    {
      type: 'rawlist',
      name: 'app',
      message: 'Select application: ',
      choices: apps,
      default: 0,
      when: util.isUndefined(generator.options.app)
    },
    {
      type: 'confirm',
      name: 'separate',
      message: 'Separate file: ',
      default: true,
      when: util.isUndefined(generator.options.separate)
    }
  ];
};
