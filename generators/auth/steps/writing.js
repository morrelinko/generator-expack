'use strict';

const path = require('path');
const _ = require('lodash');

module.exports = function (program) {
  return {
    run () {
      this.writing._generateRoute.call(this);
      this.writing._generateHandler.call(this);
      this.writing._generateProvider.call(this);
      this.writing._generateMiddlewares.call(this);
      this.writing._generateViews.call(this);
      this.writing._generateValidators.call(this);
      this.writing._finish.call(this);
    },

    _generateHandler() {
      let handlerFile = this.destinationPath('server/handlers/auth/index.js');
      let templateFile = this.templatePath('handlers/auth.js.stub');
      this.fs.copyTpl(templateFile, handlerFile, {answers: this.answers});
    },

    _generateProvider() {
      let config = program.config(this);
      let providerFile = this.destinationPath('server/providers/bootstrap/passport.js');
      let templateFile = this.templatePath('providers/bootstrap/passport.js.stub');

      let identifier = program.helpers.getDBIdentifier(config.databaseOf(this.answers.database));
      let deserializeCodeFile = this.templatePath(`providers/bootstrap/${identifier}/deserialize.stub`);
      let verifyCodeFile = this.templatePath(`providers/bootstrap/${identifier}/verify.stub`);

      let providerData = program.helpers.formatJS(program.helpers.readTpl(this, templateFile, {
        deserialize_user_code: this.read(deserializeCodeFile),
        verify_user_code: this.read(verifyCodeFile)
      }));

      this.fs.write(providerFile, providerData);

      let providerIndexFile = this.destinationPath('server/providers/bootstrap/index.js');
      let providerIndexData = program.helpers.ast(this.read(providerIndexFile), function (tree) {
        let _boot = tree.assignment('bootstraps.boot').value().body;

        _boot.append(`require('./passport').boot(app, opts);`);
        _boot.node.map(node => {
          if (!node.range) {
            node.range = [node.start, node.end];
          }
        });

        tree.body.append(tree.verbatim(`\n Object.defineProperty(bootstraps, 'passport', {
          get: () => require('./passport').instance
        })`));
      }.bind(this));
      this.fs.write(providerIndexFile, providerIndexData);
    },

    _generateMiddlewares() {
      this.fs.copy(this.templatePath('middlewares/auth.js.stub'),
        this.destinationPath('server/middlewares/auth.js'));
      this.fs.copy(this.templatePath('middlewares/guest.js.stub'),
        this.destinationPath('server/middlewares/guest.js'));
    },

    _generateRoute() {
      this.fs.copy(this.templatePath('routes/auth.js.stub'),
        this.destinationPath('server/routes/auth/index.js'));
    },

    _generateViews() {
      let views = ['login', 'register', 'password-request', 'password-reset', 'verify'];
      views.forEach(view => {
        this.fs.copy(this.templatePath(`views/${view}.nunjucks`),
          this.destinationPath(`server/views/auth/${view}.nunjucks`));
      });
    },

    _generateValidators() {
      this.fs.copyTpl(this.templatePath(`validators/auth.js.stub`),
        this.destinationPath('server/validators/auth/index.js'), {
          answers: this.answers
        });
    },

    _finish() {
      let config = program.config(this);
      let identifier = program.helpers.getDBIdentifier(config.databaseOf(this.answers.database));

      this.composeWith('expack:model', {
        args: ['user'],
        options: {
          database: this.answers.database,
          table: 'users',
          template: this.templatePath(`models/user.js.${identifier}.stub`)
        }
      }, {local: path.resolve(__dirname, '../../model')});

      config.set('auth', {
        database: this.answers.database,
        mounted: this.answers.app
      });
    }
  };
};
