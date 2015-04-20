'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * This module detects the server
 * and applies the API to the
 * request and response objects
 */

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _debugify = require('../debugify');

var _debugify2 = _interopRequireWildcard(_debugify);

var Servify = (function () {
  function Servify(_this) {
    _classCallCheck(this, Servify);

    this.server = '';
    this.context = _this;
  }

  _createClass(Servify, [{
    key: 'apply',

    /*Applies the API to the objects */
    value: function apply(req, res, next) {
      var _this = this.context;
      // Koa?
      if (this.isKoa(req) && !_import2['default'].isEmpty(req)) {
        this.server = 'koa';
        // Apply api to koa
        _this.assign(req.request, req.response);
        if (req.req || req.res) _this.assign(req.req, req.res);
        if (req.state) _this.assign(req.state);
      }
      // Hapi?
      if (this.isHapi(req) && !_import2['default'].isEmpty(req)) {
        this.server = 'hapi';
        if (req.response) if (req.response.variety === 'view') _this.assign(req.response.source.context);
        _this.assign(req);
      }
      // Express ?
      if (this.isExpress(req) && !_import2['default'].isEmpty(req)) {
        this.server = 'express';
        _this.assign(req, res);
        // Apply to API to the view
        if (res && res.locals) _this.assign(res.locals);
      }
      _debugify2['default']('core', 'server:', this.server);
      // Make sure next exists and call it.
      if (_import2['default'].isFunction(next)) next();
      return this;
    }
  }, {
    key: 'isKoa',

    /* Framework detection */
    value: function isKoa(req) {
      return req && !req.raw ? req.response && req.request : !_import2['default'].isEmpty(this.server) ? this.server === 'koa' : false;
    }
  }, {
    key: 'isHapi',
    value: function isHapi(req) {
      return req ? req.raw : !_import2['default'].isEmpty(this.server) ? this.server === 'hapi' : false;
    }
  }, {
    key: 'isExpress',
    value: function isExpress(req) {
      return req && !req.raw ? req && !req.raw && !req.response : !_import2['default'].isEmpty(this.server) ? this.server === 'express' : false;
    }
  }]);

  return Servify;
})();

exports['default'] = function (_this) {
  'use strict';
  return new Servify(_this);
};

module.exports = exports['default'];