'use strict';

module.exports = function (program) {
  return function () {
    program.helpers.ensureExpack(this);
    return program.helpers.wait(400);
  };
};
