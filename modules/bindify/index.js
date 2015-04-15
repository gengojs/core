'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * This modules bind a function to the context.
 */

var _debugify = require('../debugify');

var _debugify2 = _interopRequireWildcard(_debugify);

exports['default'] = function (fn, _this) {
  'use strict';
  _debugify2['default'](fn);
  return fn.bind(_this);
};

module.exports = exports['default'];