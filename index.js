'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _pkg = require('./package');

var _pkg2 = _interopRequireWildcard(_pkg);

var _inputify = require('./modules/inputify');

var _inputify2 = _interopRequireWildcard(_inputify);

var _plugify = require('./modules/plugify/');

var _plugify2 = _interopRequireWildcard(_plugify);

var _optify = require('./modules/optify');

var _optify2 = _interopRequireWildcard(_optify);

var _debugify = require('./modules/debugify');

var _debugify2 = _interopRequireWildcard(_debugify);

var _servify = require('./modules/servify');

var _servify2 = _interopRequireWildcard(_servify);

var _bindify = require('./modules/bindify');

var _bindify2 = _interopRequireWildcard(_bindify);

/* Class Gengo*/

var Gengo = (function () {
  /* Gengo constructor */

  function Gengo(options, plugins) {
    var _this = this;

    _classCallCheck(this, Gengo);

    _debugify2['default']('core',
    // Current version
    'version:', this.version = _pkg2['default'].version,
    // Options
    'options:', this.options = _optify2['default'](options).options);
    // Set Plugins
    this.plugins = _plugify2['default'](plugins, this.options);
    _debugify2['default']('core-plugins', 'plugins:', this.plugins);
    // Backend
    this.plugins.backends.forEach(function (plugin) {
      return _bindify2['default'](plugin, _this)();
    });
  }

  _createClass(Gengo, [{
    key: 'parse',

    /* i18ns the input*/
    value: function parse(phrase) {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _debugify2['default']('core', 'process:', 'parse');
      // Parser
      this.plugins.parsers.forEach(function (plugin) {
        return _bindify2['default'](plugin, _this2)(_inputify2['default'](phrase, args));
      });
      return this.result;
    }
  }, {
    key: 'ship',

    /* Middleware for Node frameworks*/
    value: function ship(req, res, next) {
      var _this3 = this;

      _debugify2['default']('core', 'process:', 'ship');
      // Headers
      this.plugins.headers.forEach(function (plugin) {
        return _bindify2['default'](plugin, _this3)(req, res);
      });
      // Routers
      this.plugins.routers.forEach(function (plugin) {
        return _bindify2['default'](plugin, _this3)(req, res);
      });
      // Localize(s)
      this.plugins.localizes.forEach(function (plugin) {
        return _bindify2['default'](plugin, _this3)(req, res);
      });
      /* Apply API to the objects/request/response*/
      _servify2['default'](this.assign, req, res, next);
    }
  }, {
    key: 'assign',

    /* Apply the API to objects */
    value: function assign(req, res) {
      var _this4 = this;

      _debugify2['default']('core', 'process:', 'assign');
      // API
      this.plugins.apis.forEach(function (plugin) {
        return _bindify2['default'](plugin, _this4)(req, res);
      });
      // Return the interface
      return this.api.api();
    }
  }]);

  return Gengo;
})();

exports['default'] = function (options, plugins) {
  'use strict';
  return new Gengo(options, plugins);
};

module.exports = exports['default'];