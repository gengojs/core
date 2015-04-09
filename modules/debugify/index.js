'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

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
  'core-localize': _debug2['default']('core-localize'),
  'core-handler': _debug2['default']('core-handler')
};

exports['default'] = function (type) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  /*jshint strict:false*/
  debugify[type].apply(null, (function () {
    var _args = [];
    _import2['default'].forEach(args, function (item) {
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
          }
        });
      } else _args = args;
    });
    return _args;
  })());
};

module.exports = exports['default'];