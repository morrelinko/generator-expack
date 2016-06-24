'use strict';

const util = require('util');
const _ = require('lodash');

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
      when: function (answers) {
        return util.isUndefined(generator.options.type);
      }
    },
    {
      type: 'confirm',
      name: 'standalone',
      required: true,
      message: 'Standalone APP: ',
      when: function (answers) {
        return util.isUndefined(generator.options.standalone);
      }
    },
    {
      type: 'input',
      name: 'host',
      message: 'Host IP / Domain: ',
      default: '127.0.0.1',
      when: function (answers) {
        let standalone = !util.isUndefined(answers.standalone)
          ? answers.standalone
          : generator.options.standalone;
        return (standalone === true) && util.isUndefined(generator.options.host);
      }
    },
    {
      type: 'input',
      name: 'port',
      message: 'Port: ',
      when: function (answers) {
        let standalone = !util.isUndefined(answers.standalone)
          ? answers.standalone
          : generator.options.standalone;
        return standalone === true && util.isUndefined(generator.options.port);
      },
      default: function (answers) {
        let usedPorts = [];
        _.forEach(config.get('apps'), app => {
          usedPorts.push(app.port);
        });

        if (usedPorts.length === 0) {
          return 8080;
        }

        return Number(_.max(usedPorts)) + 1;
      },
    },
    {
      type: 'rawlist',
      name: 'mount_app',
      message: 'Select app to mount to: ',
      choices: apps,
      when: function (answers) {
        let standalone = !util.isUndefined(answers.standalone)
          ? answers.standalone
          : generator.options.standalone;
        return standalone === false && util.isUndefined(generator.options.app);
      }
    },
    {
      type: 'input',
      name: 'mount_path',
      message: 'Enter mount path: ',
      default: generator.options.path,
      when: function (answers) {
        let standalone = !util.isUndefined(answers.standalone)
          ? answers.standalone
          : generator.options.standalone;
        return standalone === false && util.isUndefined(generator.options.path);
      }
    }
  ];
};
