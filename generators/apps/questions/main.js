'use strict';

module.exports = function (program, generator) {
  return [
    {
      type: 'input',
      name: 'host',
      message: 'Host IP / Domain:',
      default: '127.0.0.1'
    },
    {
      type: 'input',
      name: 'port',
      message: 'Port:',
      default: '8080'
    }
  ];
};
