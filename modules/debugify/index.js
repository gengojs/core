'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * This modules debugs the core
 */

var _debug = require('debug');

var _debug2 = _interopRequireWildcard(_debug);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var debugify = {
  core: _debug2['default']('core'),
  'core-plugins': _debug2['default']('core-plugins'),
  'core-parser': _debug2['default']('core-parser'),
  'core-router': _debug2['default']('core-router'),
  'core-backend': _debug2['default']('core-backend'),
  'core-header': _debug2['default']('core-header'),
  'core-api': _debug2['default']('core-api'),
  'core-localize': _debug2['default']('core-localize')
};

exports['default'] = function (type) {
  'use strict';

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var _args = [];
  var _type = _import2['default'].isString(type) ? type : '';
  // If type is a package
  if (_import2['default'].isObject(type) && type['package']) {
    // Set type
    _type = type['package'].type;
    // Push the package to args
    _args.push(type['package']);
  }
  var log = debugify['core-' + _type] || debugify[_type];
  log.apply(null, (function () {

    _import2['default'].forEach(args, function (item) {
      // If args is a package
      // then recreate the args
      if (_import2['default'].isPlainObject(item)) {
        _import2['default'].forOwn(item, function (value, key) {
          switch (key) {
            case 'name':
              _args.push(key + ':');
              _args.push(value);
              break;
            case 'version':
              _args.push(key + ':');
              _args.push(value);
              break;
            case 'type':
              _args.push(key + ':');
              _args.push(value);
              break;
          }
        });
      } else _args = _import2['default'].merge(_args, args);
    });
    return _args;
  })());
};

module.exports = exports['default'];