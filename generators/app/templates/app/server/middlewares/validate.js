'use strict';

const Promise = require('bluebird');
const Checkit = require('checkit');

/**
 * Exposes 'validate()' to routeplus builder.
 *
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
 *    .validate(loginValidator)
 *    .build());
 * </code></pre>
 */

let middleware = module.exports = function (validator) {
  return function (req, res, next) {
    let resolved = validator(req, res);
    if (!Array.isArray(resolved)) {
      resolved = [resolved];
    }

    Promise.all(resolved)
      .then(validations => next())
      .catch(function (err) {
        // If the current app is a web app
        // flash the errors and try to redirect to previous page.
        if (req.expack.apps[req.expack.app].type == 'web') {
          req.flash('errors', err.toJSON());
          res.redirect(req.headers.referrer
            || ((req.method.toLowerCase() != 'get') ? req.url : '/'));
        }
      });
  }.bind(this);
};

middleware.builder = function validateMiddleware(validator) {
  this.use(middleware(validator), 5);
  return this;
};
