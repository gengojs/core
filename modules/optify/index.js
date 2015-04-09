'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _yaml = require('js-yaml');

var _yaml2 = _interopRequireWildcard(_yaml);

var _Hoek = require('hoek');

var _Hoek2 = _interopRequireWildcard(_Hoek);

/*
    Definition: Options must be either a string or a plain object.

    1. Options must be specified by type such as 'parser', 'api', etc.
       

    Side note: Every plugin created must offer default options and must 
    be responsible with letting the developers know about the options
    for your plugin (through GitHub, etc).
*/

var Optify = (function () {
  function Optify(options) {
    _classCallCheck(this, Optify);

    this.options = {};
    var settings;
    if (_import2['default'].isPlainObject(options) && !_import2['default'].isEmpty(options)) this.options = options;else if (_import2['default'].isString(options)) {
      // Normalize the string and if it ends in yml replace it
      options = _path2['default'].normalize(options.replace('yml', 'yaml'));
      // Load the json file
      if (/.json/.test(options)) {
        settings = require(options);
        this.options = settings;
      } else if (/.yaml/.test(options)) {
        // Load yaml
        settings = _yaml2['default'].safeLoad(_fs2['default'].readFileSync(options, 'utf8'));
        this.options = settings;
      } else {
        _Hoek2['default'].assert(false, 'Woops! The configuration file must be either JSON or YAML.');
        this.options = {};
      }
    } else this.options = settings || {};
  }

  _createClass(Optify, [{
    key: 'merge',
    value: function merge(options) {
      return _import2['default'].defaults(this.options, options);
    }
  }]);

  return Optify;
})();

exports['default'] = function (options) {
  'use strict';
  return new Optify(options);
};

module.exports = exports['default'];