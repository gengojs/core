'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * This module Extracts the arguments and
 * separates them into arrays and objects.
 */

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var Extract = (function () {
  function Extract(array, length) {
    _classCallCheck(this, Extract);

    var values = {},
        args = [],
        value;
    // If the arguments is greater than 2 (because of offset)
    if (length > 1) {
      // Just append them to the array
      array.forEach(function (item) {
        return args.push(item);
      });
    }
    // If they are exactly 2 argument
    else if (length === 1) {
      // Get the first value
      value = array[0];
      // Set arguments [...]
      if (_import2['default'].isArray(value)) args = value;else if (_import2['default'].isPlainObject(value)) args = [];else args.push(value);
      // Set values {...}
      values = _import2['default'].isPlainObject(value) ? value : {};
    }

    this.values = values;
    this.args = args;
  }

  _createClass(Extract, [{
    key: 'hasValues',
    value: function hasValues() {
      return !_import2['default'].isEmpty(this.values);
    }
  }, {
    key: 'hasArgs',
    value: function hasArgs() {
      return !_import2['default'].isEmpty(this.args);
    }
  }]);

  return Extract;
})();

exports['default'] = function (array, length) {
  /*jshint strict:false*/
  return new Extract(array, length);
};

module.exports = exports['default'];