/**
 * This module initializes the plugins.
 */
import _ from 'lodash';
import Hoek from 'hoek';
import optify from '../optify';
import debugify from '../debugify';

function assert(plugin) {
  'use strict';
  Hoek.assert(_.has(plugin, 'main'),
    'Woops! Did you forget the main function?');
  Hoek.assert(_.has(plugin, 'package'),
    'Woops! Did you forget the package?');
  Hoek.assert(_.has(plugin.package, 'type'),
    'Woops! Did you forget the "type" of plugin?');
  Hoek.assert(_.has(plugin.package, 'name'),
    'Woops! Did you forget the "name" of plugin?');
  Hoek.assert(!_.has(plugin.package, 'defaults'),
    'Woops! Did you forget to add "defaults"?');
  Hoek.assert(_.has(plugin, 'defaults'),
    'Woops! Did you forget to add the "defaults"?');
}

class Plugify {
  constructor(plugins, options, defaults) {
    // Initialize the plugin stack
    this.plugins = this.initialize();
    // Check if default plugins were provided
    if(defaults) {
        // Add the defaults first
        _.forOwn(this.plugins, function(plugins, key) {
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
      if (_.isPlainObject(plugins)) {
        // This may be the only ship
        if (_.has(plugins, 'main')) {
          registrations.push(plugins);
        } else
        // This may have multiple ships
          _.forOwn(plugins, (ship) => {
            // Assert that ship is a function
            Hoek.assert(_.isFunction(ship),
              'Uh oh! The ship must be a function!');
            Hoek.assert(_.isPlainObject(ship()),
              'Woops! Did the ship forget to return a plain object?');
            registrations.push(ship());
        });
      }
      if (_.isArray(plugins)) registrations = plugins;
      if (_.isFunction(plugins)) {
        Hoek.assert(_.isPlainObject(plugins()),
          'Woops! Did the ship forget to return a plain object?');
        registrations.push(plugins());
      }
      // Register and then restrict the
      // plugins to one plugin per type
      // and add defaults if none exist
      _.forEach(registrations, function(plugin) {
        // Assert
        assert(plugin);
        var type = this.normalize(plugin.package.type);
        // If the default plugin already exists
        // then remove the default and replace it with
        // the user defined plugin
        if (this.plugins[this.pluralize(type, 2)].length === 1) {
          if(!_.isUndefined(defaults))
            this.plugins[this.pluralize(type, 2)].pop();
          // Set the plugin attributes
          this.set(plugin, options);
          // If there are multiple plugins of the same type
          // restrict it to one plugin
        } else if (this.plugins[this.pluralize(type, 2)].length > 1) {
          var length = this.plugins[this.pluralize(type, 2)].length - 1;
          while (length !== 0) {
            if(!_.isUndefined(defaults))
              this.plugins[type].pop();
            length--;
          }
          // Since no there are no default plugins,
          // just add the plugin to the stack
        }else{
          this.set(plugin, options);
        }
      }, this);
    }
    debugify('core-plugins', 'plugins:', this.plugins);
    return this.plugins;
  }

  set(plugin, options) {
    var {
      main, defaults
    } = plugin;
    var {
      name, type
    } = plugin.package;
    type = this.normalize(type);
    // Initialize an object
    this.plugins[type] = {};
    // Set the plugin fn
    this.plugins[type][name] = main;
    // Set the package
    this.plugins[type][name].package = plugin.package;
    // Insert plugins as callbacks
    this.plugins[this.pluralize(type, 2)].push(main);
    // Set the default options by merging with user's
    options[type] =
      optify(options[type] || {}).merge(defaults);
  }
  /* Pluralizes the string*/
  pluralize(str, count) {
    if (count === 1 || _.isUndefined(count)) return str;
    else return str + 's';
  }
  /* Normalizes a string */
  normalize(str) {
    return str.toLowerCase().replace('-', '');
  }
  // Initialize
  initialize() {
    return _.assign({}, {
      parsers: [],
      routers: [],
      backends: [],
      apis: [],
      headers: [],
      localizes: []
    });
  }
}


export
default (plugins, callback, context) => {
  'use strict';
  return new Plugify(plugins, callback, context);
};
