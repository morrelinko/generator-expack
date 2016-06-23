'use strict';

module.exports = function (program, generator) {
  return [
    {
      type: 'input',
      name: 'name',
      message: 'App Name:',
      default: generator.appname,
      when: !generator.name,
    }
  ];
};
