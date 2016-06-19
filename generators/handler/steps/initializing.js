'use strict';

module.exports = function (program) {
  return function () {
    program.helpers.ensureExpack(this, program);
    return program.helpers.wait(400);
  };
};
