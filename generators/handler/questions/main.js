'use strict';

module.exports = function (program, generator) {
  let config = program.config(generator);
  let apps = Object.keys(config.get('apps'));

  return [
    {
      type: 'input',
      name: 'name',
      message: 'Handler (controller) name: ',
      when: !generator.name
    },
    {
      type: 'rawlist',
      name: 'app',
      message: 'Select application: ',
      choices: apps,
      default: 0
    }
  ];
};
