/**
 * This module initializes the plugins.
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

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

var _optify = require('../optify');

var _optify2 = _interopRequireDefault(_optify);

var _debugify = require('../debugify');

var _debugify2 = _interopRequireDefault(_debugify);

function assert(plugin) {
  'use strict';
  _hoek2['default'].assert(_lodash2['default'].has(plugin, 'main'), 'Woops! Did you forget the main function?');
  _hoek2['default'].assert(_lodash2['default'].has(plugin, 'package'), 'Woops! Did you forget the package?');
  _hoek2['default'].assert(_lodash2['default'].has(plugin['package'], 'type'), 'Woops! Did you forget the "type" of plugin?');
  _hoek2['default'].assert(_lodash2['default'].has(plugin['package'], 'name'), 'Woops! Did you forget the "name" of plugin?');
  _hoek2['default'].assert(!_lodash2['default'].has(plugin['package'], 'defaults'), 'Woops! Did you forget to add "defaults"?');
  _hoek2['default'].assert(_lodash2['default'].has(plugin, 'defaults'), 'Woops! Did you forget to add the "defaults"?');
}

var Plugify = (function () {
  function Plugify(plugins, options, defaults) {
    _classCallCheck(this, Plugify);

    // Initialize the plugin stack
    this.plugins = this.initialize();
    // Check if default plugins were provided
    if (defaults) {
      // Add the defaults first
      _lodash2['default'].forOwn(this.plugins, function (plugins, key) {
        var plugin = defaults[key.slice(0, -1)]();
        // Assert
        assert(plugin);
        // Set the plugin attributes
        this.set(plugin, options);
      }, this);
    }

    if (plugins) {
      var registrations = [];
      // The plugin will return a {}.
      if (_lodash2['default'].isPlainObject(plugins)) {
        // This may be the only ship
        if (_lodash2['default'].has(plugins, 'main')) {
          registrations.push(plugins);
        } else
          // This may have multiple ships
          _lodash2['default'].forOwn(plugins, function (ship) {
            // Assert that ship is a function
            _hoek2['default'].assert(_lodash2['default'].isFunction(ship), 'Uh oh! The ship must be a function!');
            _hoek2['default'].assert(_lodash2['default'].isPlainObject(ship()), 'Woops! Did the ship forget to return a plain object?');
            registrations.push(ship());
          });
      }
      if (_lodash2['default'].isArray(plugins)) registrations = plugins;
      if (_lodash2['default'].isFunction(plugins)) {
        _hoek2['default'].assert(_lodash2['default'].isPlainObject(plugins()), 'Woops! Did the ship forget to return a plain object?');
        registrations.push(plugins());
      }
      // Register and then restrict the
      // plugins to one plugin per type
      // and add defaults if none exist
      _lodash2['default'].forEach(registrations, function (plugin) {
        // Assert
        assert(plugin);
        var type = this.normalize(plugin['package'].type);
        // If the default plugin already exists
        // then remove the default and replace it with
        // the user defined plugin
        if (this.plugins[this.pluralize(type, 2)].length === 1) {
          if (!_lodash2['default'].isUndefined(defaults)) this.plugins[this.pluralize(type, 2)].pop();
          // Set the plugin attributes
          this.set(plugin, options);
          // If there are multiple plugins of the same type
          // restrict it to one plugin
        } else if (this.plugins[this.pluralize(type, 2)].length > 1) {
            var length = this.plugins[this.pluralize(type, 2)].length - 1;
            while (length !== 0) {
              if (!_lodash2['default'].isUndefined(defaults)) this.plugins[type].pop();
              length--;
            }
            // Since no there are no default plugins,
            // just add the plugin to the stack
          } else {
              this.set(plugin, options);
            }
      }, this);
    }
    (0, _debugify2['default'])('core-plugins', 'plugins:', this.plugins);
    return this.plugins;
  }

  _createClass(Plugify, [{
    key: 'set',
    value: function set(plugin, options) {
      var main = plugin.main;
      var defaults = plugin.defaults;
      var _plugin$package = plugin['package'];
      var name = _plugin$package.name;
      var type = _plugin$package.type;

      type = this.normalize(type);
      // Initialize an object
      this.plugins[type] = {};
      // Set the plugin fn
      this.plugins[type][name] = main;
      // Set the package
      this.plugins[type][name]['package'] = plugin['package'];
      // Insert plugins as callbacks
      this.plugins[this.pluralize(type, 2)].push(main);
      // Set the default options by merging with user's
      options[type] = (0, _optify2['default'])(options[type] || {}).merge(defaults);
    }

    /* Pluralizes the string*/
  }, {
    key: 'pluralize',
    value: function pluralize(str, count) {
      if (count === 1 || _lodash2['default'].isUndefined(count)) return str;else return str + 's';
    }

    /* Normalizes a string */
  }, {
    key: 'normalize',
    value: function normalize(str) {
      return str.toLowerCase().replace('-', '');
    }

    // Initialize
  }, {
    key: 'initialize',
    value: function initialize() {
      return _lodash2['default'].assign({}, {
        parsers: [],
        routers: [],
        backends: [],
        apis: [],
        headers: [],
        localizes: []
      });
    }
  }]);

  return Plugify;
})();

exports['default'] = function (plugins, callback, context) {
  'use strict';
  return new Plugify(plugins, callback, context);
};

module.exports = exports['default'];
