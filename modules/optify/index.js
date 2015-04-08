'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

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

    1. Options must be defined similar to how grunt defines their options:
       {
        //plugin name must be exact to the package name
          superPluginName:{
              //...
          }
       }

    Side note: Every plugin created must offer default options and must 
    be responsible with letting the developers know about the options
    for your plugin (through GitHub, etc).
*/

exports['default'] = function (options) {
  /*jshint strict:false*/
  var settings;
  if (_import2['default'].isPlainObject(options) && !_import2['default'].isEmpty(options)) return options;else if (_import2['default'].isString(options)) {
    // Normalize the string and if it ends in yml replace it
    options = _path2['default'].normalize(options.replace('yml', 'yaml'));
    // Load the json file
    if (/.json/.test(options)) {
      settings = require(options);
      return settings;
    } else if (/.yaml/.test(options)) {
      // Load yaml
      settings = _yaml2['default'].safeLoad(_fs2['default'].readFileSync(options, 'utf8'));
      return settings;
    } else {
      _Hoek2['default'].assert(false, 'Woops! The configuration file must be either JSON or YAML.');
      return {};
    }
  } else return settings || {};
};

module.exports = exports['default'];
//# sourceMappingURL=index.js.map