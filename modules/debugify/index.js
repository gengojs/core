'use strict';

var _arguments = arguments;

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireWildcard(_debug);

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
  /*jshint strict:false*/
  debugify[type].apply(null, Array.prototype.slice.call(_arguments, 1));
};

module.exports = exports['default'];
//# sourceMappingURL=index.js.map