'use strict';

module.exports = function (program, generator) {
  return [
    {
      type: "input",
      name: "proceed",
      message: "If your package.json file is okay, Press enter to continue..."
    },
    {
      type: 'input',
      name: 'name',
      message: 'App Name:',
      default: generator.appname
    },
  ];
};
