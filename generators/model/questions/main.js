'use strict';

const inflect = require('i')();

module.exports = function (program, generator) {
  let config = program.config(generator);
  let databases = Object.keys(config.get('database'));

  return [
    {
      type: 'input',
      name: 'name',
      message: 'Model name: ',
      when: !generator.name
    },
    {
      type: 'rawlist',
      name: 'database',
      message: 'Select database connection: ',
      choices: databases,
      default: 0
    },
    {
      type: 'input',
      name: 'table_name',
      message: function (answers) {
        let tableDesc = null;
        let dbType = config.get(`database:${answers.database}`).database;

        if (program.helpers.isRelationalDB(dbType)) {
          tableDesc = 'table';
        } else if (answers.database === 'mongodb') {
          tableDesc = 'collection';
        }

        return `Database ${tableDesc} name`;
      },
      default: function (answers) {
        return inflect.tableize(answers.name || generator.name);
      }
    }
  ];
};
