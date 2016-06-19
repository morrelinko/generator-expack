'use strict';

module.exports = function (program) {
  return function () {
    let config = program.config(this);
    let dest = {};

    // create handler file.
    dest.handlerFile = this.destinationPath(`server/handlers/${this.answers.app}/${this.answers.name}.js`);
    this.fs.copyTpl(this.templatePath('controller.js.stub'), dest.handlerFile, {answers: this.answers});

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
  };
};
