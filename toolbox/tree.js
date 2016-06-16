      let tree = ast(this.read(this.templatePath('configs/database.js')));
      tree.assignment('module.exports').value();
      this.log(tree.assignment('module.exports').value().key('database').key('main').key('client').value('postgres'));
      this.log(tree.toString());