'use strict';

module.exports = function (program, generator) {
  return [
    {
      type: 'rawlist',
      name: 'type',
      required: true,
      message: 'Application type: ',
      choices: ['web', 'api', 'custom'],
      defaults: 0
    },
    {
      type: 'input',
      name: 'host',
      message: 'Host IP / Domain: ',
      default: '127.0.0.1'
    },
    {
      type: 'input',
      name: 'port',
      message: 'Port: ',
      default: '8080'
    }
  ];
};
