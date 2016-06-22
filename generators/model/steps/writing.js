'use strict';

module.exports = function (program) {
  return {
    run () {
      this.writing._createModel.call(this);
      this.writing._updateIndex.call(this);
    },

    /**
     *
     * @private
     */
    _createModel() {
      let dest = this.destinationPath(`server/models/${this.answers.name_dasherized}.js`);
      let template = this.templatePath('model.js.sql.stub');

      let modelData = program.helpers.readTpl(this, template, {
        answers: this.answers
      });

      this.fs.write(dest, modelData);
    },

    /**
     *
     * @private
     */
    _updateIndex() {
      let dest = this.destinationPath('server/models/index.js');

      let content = program.helpers.ast(this.read(dest), function (tree) {
        tree.assignment('module.exports').value()
          .key(this.answers.name_classified)
          .value(`require('./${this.answers.name_dasherized}').${this.answers.name_classified}`);
      }.bind(this));

      this.fs.write(dest, content);
    }
  };
};
