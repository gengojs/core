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
    this.options = _import2['default'].assign(this.options = {}, _optify2['default'](options));
    // Current server
    this.server = '';
    /* Plugins */
    this.plugins = {
      parsers: [],
      routers: [],
      backends: [],
      apis: [],
      headers: [],
      localizes: [],
      handlers: [] };
    // Initialize plugins
    this.use(plugins);
    // Debug core
    _debugify2['default']('core', 'version:', this.version, 'options:', this.options, 'server:', this.server);
    _debugify2['default']('core-plugins', 'plugins:', this.plugins);
    // Call backend plugin
    this.plugins.backends.forEach(function (plugin) {
      var _plugin$package = plugin['package'];
      var name = _plugin$package.name;
      var version = _plugin$package.version;
      var type = _plugin$package.type;

      _this['_' + type] = {
        'package': plugin['package'],
        options: _this.options[type] || {}
      };
      _debugify2['default']('core-' + type, 'name:', name, 'version:', version);
      plugin.bind(_this)();
    }, this);
  }

  _createClass(Gengo, [{
    key: 'parse',

    /* i18ns the input*/
    value: function parse(phrase) {
      var _this2 = this;

      _debugify2['default']('core', 'fn:', 'parse');
      var args = arguments;
      // Parser
      this.plugins.parsers.forEach(function (plugin) {
        var _plugin$package2 = plugin['package'];
        var name = _plugin$package2.name;
        var version = _plugin$package2.version;
        var type = _plugin$package2.type;

        _this2['_' + type] = {
          'package': plugin['package'],
          options: _this2.options[type] || {},
          input: {
            arguments: args,
            length: args.length,
            phrase: phrase,
            other: _extractify2['default'](args, args.length)
          }
        };
        _debugify2['default']('core-' + type, 'name:', name, 'version:', version);
        _debugify2['default']('core-' + type, 'input', _this2['_' + type].input);
        plugin.bind(_this2)();
      }, this);
      return this.result;
    }
  }, {
    key: 'use',

    /* Sets the plugins */
    value: function use(plugins) {
      var _this3 = this;

      _debugify2['default']('core', 'fn:', 'use');
      // Add plugins to array when plugify
      // begins its callbacks
      if (plugins) _plugify2['default'](plugins, function (main, pkg) {
        var name = pkg.name;
        var type = pkg.type;

        // Initialize an object
        _this3.plugins[type] = {};
        // Set the plugin fn
        _this3.plugins[type][name] = main;
        // Set the package
        _this3.plugins[type][name]['package'] = pkg;
        // Insert plugins as callbacks
        _this3.plugins[type + 's'].push(main);
      }, this);
    }
  }, {
    key: 'ship',

    /* Middleware for Node frameworks*/
    value: function ship() {
      var _this4 = this;

      _debugify2['default']('core', 'fn:', 'ship');
      // Get the request, response
      var req = arguments[0],
          res = arguments[1] || null,
          next = arguments[2] || null;
      /*Set plugins */
      // Headers
      this.plugins.headers.forEach(function (plugin) {
        var _plugin$package3 = plugin['package'];
        var name = _plugin$package3.name;
        var version = _plugin$package3.version;
        var type = _plugin$package3.type;

        _this4['_' + type] = {
          'package': plugin['package'],
          options: _this4.options[type] || {}
        };
        _debugify2['default']('core-' + type, 'name:', name, 'version:', version);
        plugin.bind(_this4)(req, res);
      }, this);
      // Routers
      this.plugins.routers.forEach(function (plugin) {
        var _plugin$package4 = plugin['package'];
        var name = _plugin$package4.name;
        var version = _plugin$package4.version;
        var type = _plugin$package4.type;

        _this4['_' + type] = {
          'package': plugin['package'],
          options: _this4.options[type] || {}
        };
        _debugify2['default']('core-' + type, 'name:', name, 'version:', version);
        plugin.bind(_this4)(req, res);
      }, this);
      // Localize(s)
      this.plugins.localizes.forEach(function (plugin) {
        var _plugin$package5 = plugin['package'];
        var name = _plugin$package5.name;
        var version = _plugin$package5.version;
        var type = _plugin$package5.type;

        _this4['_' + type] = {
          'package': plugin['package'],
          options: _this4.options[type] || {}
        };
        _debugify2['default']('core-' + type, 'name:', name, 'version:', version);
        plugin.bind(_this4)();
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
    value: function assign(req, res) {
      var _this5 = this;

      _debugify2['default']('core', 'fn:', 'assign');
      // Define the API
      this.plugins.apis.forEach(function (plugin) {
        var _plugin$package6 = plugin['package'];
        var name = _plugin$package6.name;
        var version = _plugin$package6.version;
        var type = _plugin$package6.type;

        _this5['_' + type] = {
          'package': plugin['package'],
          options: _this5.options[type] || {}
        };
        _debugify2['default']('core-' + type, 'name:', name, 'version:', version);
        plugin.bind(_this5)();
      }, this);
      // Apply the API
      this.plugins.handlers.forEach(function (plugin) {
        var _plugin$package7 = plugin['package'];
        var name = _plugin$package7.name;
        var version = _plugin$package7.version;
        var type = _plugin$package7.type;

        _this5['_' + type] = {
          'package': plugin['package'],
          options: _this5.options[type] || {},
          api: _this5._api.options || {}
        };
        _debugify2['default']('core-' + type, 'name:', name, 'version:', version);
        plugin.bind(_this5)(req, res);
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
  /*jshint strict:false*/
  return new Gengo(options, plugins);
};

module.exports = exports['default'];
//# sourceMappingURL=index.js.map