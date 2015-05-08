'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * This modules binds a function to the context.
 */

var _debugify = require('../debugify');

var _debugify2 = _interopRequireDefault(_debugify);

exports['default'] = function (fn, _this) {
  'use strict';
  _debugify2['default'](fn);
  return fn.bind(_this);
};

module.exports = exports['default'];