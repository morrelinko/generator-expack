'use strict';

module.exports = function (program, generator) {
  let config = program.config(generator);
  let apps = Object.keys(config.get('apps') || {});

  return [
    {
      type: 'rawlist',
      name: 'type',
      required: true,
      message: 'Application type: ',
      choices: ['web', 'api', 'custom'],
      default: 0
    },
    {
      type: 'confirm',
      name: 'standalone',
      required: true,
      message: 'Standalone APP: '
    },
    {
      type: 'input',
      name: 'host',
      message: 'Host IP / Domain: ',
      default: '127.0.0.1',
      when: answers => answers.standalone == true
    },
    {
      type: 'input',
      name: 'port',
      message: 'Port: ',
      default: '8080',
      when: answers => answers.standalone == true
    },
    {
      type: 'rawlist',
      name: 'mount_app',
      message: 'Select app to mount to: ',
      choices: apps,
      when: answers => answers.standalone == false, //&& apps.length > 0,
      default: 0
    },
    {
      type: 'input',
      name: 'mount_path',
      message: 'Enter mount path: ',
      default: '/'
    }
  ];
};
