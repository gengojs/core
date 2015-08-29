'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _gengojsCoreModules = require('gengojs-core-modules');

var _gengojsDebug = require('gengojs-debug');

var _gengojsDebug2 = _interopRequireDefault(_gengojsDebug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/* Class Gengo */

var Gengo = (function () {
  /* Gengo constructor */

  function Gengo(options, plugins, defaults) {
    var _this = this;

    _classCallCheck(this, Gengo);

    (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Gengo.name, 'process: constructor');
    (0, _gengojsDebug2['default'])('core', 'info',
    // Current version
    'version: ' + (this.version = _package2['default'].version),
    // Options
    'options: ' + (this.options = (0, _gengojsCoreModules.optify)(options)));
    // Set Plugins
    this.plugins = (0, _gengojsCoreModules.plugify)(plugins, this.options, defaults);
    // Backend plugin
    _lodash2['default'].forEach(this.plugins.backend, function (f) {
      return f.apply(_this);
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

      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Gengo.name, 'process: parse');
      // Parser plugin
      return _lodash2['default'].forEach(this.plugins.parser, function (f) {
        return f.apply(_this2, [(0, _gengojsCoreModules.inputify)(phrase, args)]);
      });
    }

    /* Middleware for Node frameworks */
  }, {
    key: 'ship',
    value: function ship(req, res, next) {
      var _this3 = this,
          _arguments = arguments;

      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Gengo.name, 'process: ship');
      // Header plugin
      _lodash2['default'].forEach(this.plugins.header, function (f) {
        return f.apply(_this3, _arguments);
      });
      // Router plugin
      _lodash2['default'].forEach(this.plugins.router, function (f) {
        return f.apply(_this3, _arguments);
      });
      // Localize plugin
      _lodash2['default'].forEach(this.plugins.localize, function (f) {
        return f.apply(_this3, _arguments);
      });
      /* Apply API to the objects/request/response */
      (0, _gengojsCoreModules.servify)(this).apply(req, res, next);
    }

    /* Apply the API to objects */
  }, {
    key: 'assign',
    value: function assign() {
      var _this4 = this,
          _arguments2 = arguments;

      (0, _gengojsDebug2['default'])('core', 'debug', 'class: ' + Gengo.name, 'process: assign');
      // API plugin
      return _lodash2['default'].forEach(this.plugins.api, function (f) {
        return f.apply(_this4, _arguments2);
      });
    }
  }]);

  return Gengo;
})();

exports['default'] = function (options, plugins, defaults) {
  'use strict';
  return new Gengo(options, plugins, defaults);
};

module.exports = exports['default'];
//# sourceMappingURL=../source maps/core/index.js.map