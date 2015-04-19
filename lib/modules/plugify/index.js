/**
 * This module initializes the plugins.
 */
import _ from 'lodash';
import Hoek from 'hoek';
import optify from '../optify';
import debugify from '../debugify';
var _plugins = {
  parser: require('gengojs-default-parser'),
  router: require('gengojs-default-router'),
  backend: require('gengojs-default-memory'),
  api: require('gengojs-default-api'),
  header: require('gengojs-default-header'),
  localize: require('gengojs-default-localize')
};

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
  constructor(plugins, options) {
    /*
    Definition: 
    A plugin must be either a function, an array containing functions, 
    or an plain object with a set of functions.
    
    1. A plugin must return a plain object 
    with the main (export) function and its package.
    
    2. A package must contain the name and type of plugin.

    3. A package must provide defaults for its options

    // the export function
    function ship(){
      var pkg = require('./package.json');
      //used for options
      pkg.type = 'parser';
      return {
         main:myfunction,
         package:pkg,
         defaults:require('defaults.json')
      };
    }
    
    3. A plain object exporting multiple 
    plugins is called a 'pack' or 'gengo pack'.
    
    //export object
    var gengopack = {
        handler: ship1,
        // ! You should not reference ship2 as ship1
        // ...in short, been there done that! (failed)
        // ...in long, for some reason the package (no matter how different)
        // it will return the package of the last ship
        parser: ship2
        //...
    };
 */
    // Initialize
    this.plugins = this.initialize();
    // Add the defaults first
    _.forOwn(this.plugins, function(plugins, key) {
      var plugin = _plugins[key.slice(0, -1)]();
      // Assert
      assert(plugin);
      // Set the plugin attributes
      this.set(plugin, options);
    }, this);

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
        if (this.plugins[this.pluralize(type, 2)].length === 1) {
          this.plugins[this.pluralize(type, 2)].pop();
          // Set the plugin attributes
          this.set(plugin, options);
        } else if (this.plugins[this.pluralize(type, 2)].length > 1) {
          var length = this.plugins[this.pluralize(type, 2)].length - 1;
          while (length !== 0) {
            this.plugins[type].pop();
            length--;
          }
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