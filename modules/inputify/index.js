'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * This module extracts the phrase and arguments
 * and uses the extractify module (See extractify).
 */

var _extractify = require('../extractify');

var _extractify2 = _interopRequireWildcard(_extractify);

var _debugify = require('../debugify');

var _debugify2 = _interopRequireWildcard(_debugify);

exports['default'] = function (phrase, args) {
  'use strict';
  _debugify2['default']('core-parser', 'phrase:', phrase, 'args:', args);
  return {
    arguments: args,
    length: args.length,
    phrase: phrase,
    other: _extractify2['default'](args, args.length)
  };
};

module.exports = exports['default'];