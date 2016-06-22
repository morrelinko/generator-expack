'use strict';

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let dest = {};

    // create handler file.
    dest.handlerFile = this.destinationPath(`server/handlers/${this.answers.app}/${this.answers.name}.js`);
    this.fs.copyTpl(this.templatePath('handler.js.stub'), dest.handlerFile, {answers: this.answers});

    dest.handlerIndexFile = this.destinationPath(`server/handlers/${this.answers.app}/index.js`);
    dest.handlerIndexData = program.helpers.ast(this.read(dest.handlerIndexFile), function (tree) {
      tree.assignment('module.exports').value()
        .key(this.answers.name).value(`require('./${this.answers.name}')`);
    }.bind(this));
    this.fs.write(dest.handlerIndexFile, dest.handlerIndexData);

    // create handler routes.
    dest.routeFile = this.destinationPath(`server/routes/${this.answers.app}/${this.answers.name}.js`);
    this.fs.copyTpl(this.templatePath('route.js.stub'), dest.routeFile, {answers: this.answers});

    dest.routeIndexFile = this.destinationPath(`server/routes/${this.answers.app}/index.js`);
    dest.routeIndexData = program.helpers.ast(this.read(dest.routeIndexFile), function (tree) {
      tree.__body = tree.assignment('module.exports').value().body;
      tree.__body.append(`require('./${this.answers.name}')(app);`);
      tree.__body.node.map(node => {
        if (!node.range) {
          node.range = [node.start, node.end];
        }
      });
    }.bind(this));
    this.fs.write(dest.routeIndexFile, dest.routeIndexData);

    // create handler validator
    dest.valFile = this.destinationPath(`server/validators/${this.answers.app}/${this.answers.name}.js`);
    this.fs.copyTpl(this.templatePath('validator.js.stub'), dest.valFile, {answers: this.answers});

    dest.valIndexFile = this.destinationPath(`server/validators/${this.answers.app}/index.js`);
    dest.valIndexData = program.helpers.ast(this.read(dest.valIndexFile), function (tree) {
      tree.assignment('module.exports').value()
        .key(this.answers.name).value(`require('./${this.answers.name}')`);
    }.bind(this));
    this.fs.write(dest.valIndexFile, dest.valIndexData);

    // create handler layout
    this.fs.copyTpl(this.templatePath('layout.nunjucks.stub'),
      this.destinationPath(`server/views/${this.answers.app}/layouts/${this.answers.name}.nunjucks`), {
        answers: this.answers
      });

    // create handler main
    this.fs.copyTpl(this.templatePath('view.nunjucks.stub'),
      this.destinationPath(`server/views/${this.answers.app}/${this.answers.name}/index.nunjucks`), {
        answers: this.answers
      });
  };
};
