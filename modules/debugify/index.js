/**
 * This modules debugs the core
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var debugify = {
  core: (0, _debug2['default'])('core'),
  'core-plugins': (0, _debug2['default'])('core-plugins'),
  'core-parser': (0, _debug2['default'])('core-parser'),
  'core-router': (0, _debug2['default'])('core-router'),
  'core-backend': (0, _debug2['default'])('core-backend'),
  'core-header': (0, _debug2['default'])('core-header'),
  'core-api': (0, _debug2['default'])('core-api'),
  'core-localize': (0, _debug2['default'])('core-localize')
};

exports['default'] = function (type) {
  'use strict';

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var _args = [];
  var _type = _lodash2['default'].isString(type) ? type : '';
  // If type is a package
  if (_lodash2['default'].isObject(type) && type['package']) {
    // Set type
    _type = type['package'].type;
    // Push the package to args
    _args.push(type['package']);
  }
  var log = debugify['core-' + _type] || debugify[_type];
  log.apply(null, (function () {
    // Iterate through the arguments
    _lodash2['default'].forEach(args, function (item) {
      // If args is a package
      // then recreate the args
      if (_lodash2['default'].isPlainObject(item)) {
        _lodash2['default'].forOwn(item, function (value, key) {
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
      } else _args = _lodash2['default'].merge(_args, args);
    });
    return _args;
  })());
};

module.exports = exports['default'];