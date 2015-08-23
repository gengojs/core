'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _package = require('./package');

var _package2 = _interopRequireDefault(_package);

var _modulesInputify = require('./modules/inputify');

var _modulesInputify2 = _interopRequireDefault(_modulesInputify);

var _modulesPlugify = require('./modules/plugify/');

var _modulesPlugify2 = _interopRequireDefault(_modulesPlugify);

var _modulesOptify = require('./modules/optify');

var _modulesOptify2 = _interopRequireDefault(_modulesOptify);

var _modulesDebugify = require('./modules/debugify');

var _modulesDebugify2 = _interopRequireDefault(_modulesDebugify);

var _modulesServify = require('./modules/servify');

var _modulesServify2 = _interopRequireDefault(_modulesServify);

var _modulesBindify = require('./modules/bindify');

var _modulesBindify2 = _interopRequireDefault(_modulesBindify);

/* Class Gengo */

var Gengo = (function () {
  /* Gengo constructor */

  function Gengo(options, plugins, defaults) {
    var _this = this;

    _classCallCheck(this, Gengo);

    (0, _modulesDebugify2['default'])('core',
    // Current version
    'version:', this.version = _package2['default'].version,
    // Options
    'options:', this.options = (0, _modulesOptify2['default'])(options).options);
    // Set Plugins
    this.plugins = (0, _modulesPlugify2['default'])(plugins, this.options, defaults);
    // Backend
    this.plugins.backends.forEach(function (plugin) {
      return (0, _modulesBindify2['default'])(plugin, _this)();
    });
  }

  /* i18ns the input */

  _createClass(Gengo, [{
    key: 'parse',
    value: function parse(phrase) {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (0, _modulesDebugify2['default'])('core', 'process:', 'parse');
      // Parser
      this.plugins.parsers.forEach(function (plugin) {
        return (0, _modulesBindify2['default'])(plugin, _this2)((0, _modulesInputify2['default'])(phrase, args));
      });
      return this.result;
    }

    /* Middleware for Node frameworks*/
  }, {
    key: 'ship',
    value: function ship(req, res, next) {
      var _this3 = this;

      (0, _modulesDebugify2['default'])('core', 'process:', 'ship');
      // Headers
      this.plugins.headers.forEach(function (plugin) {
        return (0, _modulesBindify2['default'])(plugin, _this3)(req, res);
      });
      // Routers
      this.plugins.routers.forEach(function (plugin) {
        return (0, _modulesBindify2['default'])(plugin, _this3)(req, res);
      });
      // Localize(s)
      this.plugins.localizes.forEach(function (plugin) {
        return (0, _modulesBindify2['default'])(plugin, _this3)(req, res);
      });
      /* Apply API to the objects/request/response*/
      (0, _modulesServify2['default'])(this).apply(req, res, next);
    }

    /* Apply the API to objects */
  }, {
    key: 'assign',
    value: function assign(req, res) {
      var _this4 = this;

      (0, _modulesDebugify2['default'])('core', 'process:', 'assign');
      // APIs
      this.plugins.apis.forEach(function (plugin) {
        return (0, _modulesBindify2['default'])(plugin, _this4)(req, res);
      });
      // Return the interface
      return this.api;
    }
  }]);

  return Gengo;
})();

exports['default'] = function (options, plugins, defaults) {
  'use strict';
  return new Gengo(options, plugins, defaults);
};

module.exports = exports['default'];
