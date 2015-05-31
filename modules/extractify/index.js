/**
 * This module Extracts the arguments and
 * separates them into arrays and objects.
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
      if (_lodash2['default'].isArray(value)) args = value;else if (_lodash2['default'].isPlainObject(value)) args = [];else args.push(value);
      // Set values {...}
      values = _lodash2['default'].isPlainObject(value) ? value : {};
    }

    this.values = values;
    this.args = args;
  }

  _createClass(Extract, [{
    key: 'hasValues',
    value: function hasValues() {
      return !_lodash2['default'].isEmpty(this.values);
    }
  }, {
    key: 'hasArgs',
    value: function hasArgs() {
      return !_lodash2['default'].isEmpty(this.args);
    }
  }]);

  return Extract;
})();

exports['default'] = function (array, length) {
  /*jshint strict:false*/
  return new Extract(array, length);
};

module.exports = exports['default'];