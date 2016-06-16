'use strict';

module.exports = function (program) {
  return function () {
    program.helpers.ensureExpack();
    return program.helpers.wait(400);
  };
};
