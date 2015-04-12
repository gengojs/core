'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _pkg = require('./package');

var _pkg2 = _interopRequireWildcard(_pkg);

var _extractify = require('./modules/extractify');

var _extractify2 = _interopRequireWildcard(_extractify);

var _plugify = require('./modules/plugify/');

var _plugify2 = _interopRequireWildcard(_plugify);

var _optify = require('./modules/optify');

var _optify2 = _interopRequireWildcard(_optify);

var _debugify = require('./modules/debugify');

var _debugify2 = _interopRequireWildcard(_debugify);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var Gengo = (function () {
  /* Gengo constructor */

  function Gengo(options, plugins) {
    var _this = this;

    _classCallCheck(this, Gengo);

    /* Gengo properties */
    //Current version
    this.version = _pkg2['default'].version;
    // Options
    this.options = _optify2['default'](options).options;
    // Current server
    this.server = '';
    /* Plugins */
    this.plugins = _plugify2['default']().initialize(this.plugins = {});
    // Initialize plugins
    this.use(plugins);
    // Debug core
    _debugify2['default']('core', 'version:', this.version, 'options:', this.options, 'server:', this.server);
    _debugify2['default']('core-plugins', 'plugins:', this.plugins);
    // Call backend plugin
    this.plugins.backends.forEach(function (plugin) {
      _debugify2['default']('core-' + plugin['package'].type, plugin['package']);
      plugin.bind(_this)();
    }, this);
  }

  _createClass(Gengo, [{
    key: 'parse',

    /* i18ns the input*/
    value: function parse(phrase) {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _debugify2['default']('core', 'fn:', 'parse');
      // Parser
      this.plugins.parsers.forEach(function (plugin) {
        var input = {
          arguments: args,
          length: args.length,
          phrase: phrase,
          other: _extractify2['default'](args, args.length)
        };
        _debugify2['default']('core-' + plugin['package'].type, plugin['package']);
        _debugify2['default']('core-' + plugin['package'].type, 'input', input);
        plugin.bind(_this2)(input);
      }, this);
      return this.result;
    }
  }, {
    key: 'use',

    /* Sets the plugins */
    value: function use(plugins) {
      _debugify2['default']('core', 'fn:', 'use');
      // Add plugins to array
      _plugify2['default'](plugins, this);
    }
  }, {
    key: 'ship',

    /* Middleware for Node frameworks*/
    value: function ship() {
      var _this3 = this;

      _debugify2['default']('core', 'fn:', 'ship');
      // Get the request, response
      var req = arguments[0],
          res = arguments[1] || null,
          next = arguments[2] || null;
      /*Set plugins */
      // Headers
      this.plugins.headers.forEach(function (plugin) {
        _debugify2['default']('core-' + plugin['package'].type, plugin['package']);
        plugin.bind(_this3)(req, res);
      }, this);
      // Routers
      this.plugins.routers.forEach(function (plugin) {
        _debugify2['default']('core-' + plugin['package'].type, plugin['package']);
        plugin.bind(_this3)(req, res);
      }, this);
      // Localize(s)
      this.plugins.localizes.forEach(function (plugin) {
        _debugify2['default']('core-' + plugin['package'].type, plugin['package']);
        plugin.bind(_this3)();
      }, this);
      /* Apply API */
      // Koa?
      if (this.isKoa(req) && !_import2['default'].isEmpty(req)) {
        this.server = 'koa';
        // Apply api to koa
        this.assign(req.request, req.response);
        if (req.req || req.res) this.assign(req.req, req.res);
        if (req.state) this.assign(req.state);
      }
      // Hapi?
      if (this.isHapi(req) && !_import2['default'].isEmpty(req)) {
        this.server = 'hapi';
        if (req.response) if (req.response.variety === 'view') this.assign(req.response.source.context);
        this.assign(req);
      }
      // Express ?
      if (this.isExpress(req) && !_import2['default'].isEmpty(req)) {
        this.server = 'express';
        this.assign(req, res);
        // Apply to API to the view
        if (res && res.locals) this.assign(res.locals);
      }
      _debugify2['default']('core', 'server:', this.server);
      // Make sure next exists and call it.
      if (_import2['default'].isFunction(next)) next();
    }
  }, {
    key: 'assign',

    /* Applies the API to objects */
    value: function assign(req, res) {
      var _this4 = this;

      _debugify2['default']('core', 'fn:', 'assign');
      // Define the API
      this.plugins.apis.forEach(function (plugin) {
        _debugify2['default']('core-' + plugin['package'].type, plugin['package']);
        plugin.bind(_this4)();
      }, this);
      // Apply the API
      this.plugins.handlers.forEach(function (plugin) {
        _debugify2['default']('core-' + plugin['package'].type, plugin['package']);
        plugin.bind(_this4)(req, res);
      }, this);
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

  return Gengo;
})();

exports['default'] = function (options, plugins) {
  'use strict';
  return new Gengo(options, plugins);
};

module.exports = exports['default'];