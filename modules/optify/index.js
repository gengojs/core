/**
 * This module reads or sets the
 * initial options
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

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
    if (_lodash2['default'].isPlainObject(options) && !_lodash2['default'].isEmpty(options)) this.options = options;else if (_lodash2['default'].isString(options)) {
      // Normalize the string and if it ends in yml replace it
      options = _path2['default'].normalize(options.replace('yml', 'yaml'));
      // Load the json or javascript file
      if (/\.json/.test(options) || /\.js/.test(options)) {
        settings = require(options);
        this.options = settings;
      } else if (/\.yaml/.test(options)) {
        // Load yaml
        settings = _jsYaml2['default'].safeLoad(_fs2['default'].readFileSync(options, 'utf8'));
        this.options = settings;
      } else {
        _hoek2['default'].assert(false, 'Woops! Did you forgt to add the extension? \n' + 'The supported files are .json, .js, and .yaml.');
        this.options = {};
      }
    } else this.options = settings || {};
  }

  _createClass(Optify, [{
    key: 'merge',
    value: function merge(options) {
      return _lodash2['default'].defaults(this.options, options);
    }
  }]);

  return Optify;
})();

exports['default'] = function (options) {
  'use strict';
  return new Optify(options);
};

module.exports = exports['default'];
