'use strict';

module.exports = function (program) {
  return {
    run() {
      this.writing._generateHandler.call(this);
      this.writing._generateRoute.call(this);
      this.writing._generateValidator.call(this);
      this.writing._generateView.call(this);
    },

    /**
     * Generate handler file.
     * Passing the `--no-separate` option will handler
     * methods in the index.js file as opposed to the
     * `--separate` that will generate a separate file for the
     * handler and a reference to it in the handler file.
     *
     * @private
     */
    _generateHandler() {
      let handlerFile = this.answers.separate
        ? this.destinationPath(`server/handlers/${this.answers.app}/${this.answers.name}.js`)
        : this.destinationPath(`server/handlers/${this.answers.app}/index.js`);
      let templateFile = this.templatePath('handler.js.stub');

      if (this.answers.separate) {
        let handlerIndexFile = this.destinationPath(`server/handlers/${this.answers.app}/index.js`);
        let handlerIndexData = program.helpers.ast(this.read(handlerIndexFile), function (tree) {
          tree.assignment('module.exports').value()
            .key(this.answers.name).value(`require('./${this.answers.name}')`);
        }.bind(this));

        this.fs.write(handlerIndexFile, handlerIndexData);
      }

      this.fs.copyTpl(templateFile, handlerFile, {answers: this.answers});
    },

    /**
     *
     * @private
     */
    _generateRoute() {
      let routeFile = this.answers.separate
        ? this.destinationPath(`server/routes/${this.answers.app}/${this.answers.name}.js`)
        : this.destinationPath(`server/routes/${this.answers.app}/index.js`);
      let templateFile = this.templatePath('route.js.stub');

      if (this.answers.separate) {
        let routeIndexFile = this.destinationPath(`server/routes/${this.answers.app}/index.js`);
        let routeIndexData = program.helpers.ast(this.read(routeIndexFile), function (tree) {
          tree.__body = tree.assignment('module.exports').value().body;
          tree.__body.append(`require('./${this.answers.name}')(app);`);
          tree.__body.node.map(node => {
            if (!node.range) {
              node.range = [node.start, node.end];
            }
          });
        }.bind(this));

        this.fs.write(routeIndexFile, routeIndexData);
      }

      this.fs.copyTpl(templateFile, routeFile, {answers: this.answers});
    },

    /**
     *
     * @private
     */
    _generateValidator() {
      let validatorFile = this.answers.separate
        ? this.destinationPath(`server/validators/${this.answers.app}/${this.answers.name}.js`)
        : this.destinationPath(`server/validators/${this.answers.app}/index.js`);
      let templateFile = this.templatePath('validator.js.stub');

      if (this.answers.separate) {
        let valIndexFile = this.destinationPath(`server/validators/${this.answers.app}/index.js`);
        let valIndexData = program.helpers.ast(this.read(valIndexFile), function (tree) {
          tree.assignment('module.exports').value()
            .key(this.answers.name).value(`require('./${this.answers.name}')`);
        }.bind(this));
        this.fs.write(valIndexFile, valIndexData);
      }

      this.fs.copyTpl(templateFile, validatorFile, {answers: this.answers});
    },

    _generateView() {
      let viewFile = this.answers.separate
        ? this.destinationPath(`server/views/${this.answers.app}/${this.answers.name}/index.nunjucks`)
        : this.destinationPath(`server/views/${this.answers.app}/index.nunjucks`);
      let templatePath = this.templatePath('view.nunjucks.stub');
      this.fs.copyTpl(templatePath, viewFile, {answers: this.answers});
    }
  };
};
