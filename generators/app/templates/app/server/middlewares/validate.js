'use strict';
/**
 * Usage
 *
 * <pre><code>
 *  const Checkit = require('checkit');
 *
 *  function loginValidator(req, res) {
 *     var checkit = new Checkit({
 *        email: 'required',
 *        password: 'required',
 *     });
 *
 *     return checkit.validate(req.body);
 *  }
 *
 *  router.get('/login', rp.builder(handler)
 *    .validator(loginValidator)
 *    .build());
 * </code></pre>
 */
module.exports = function validateMiddleware(validator) {
  return this;
};
