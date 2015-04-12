import _ from 'lodash';
import Hoek from 'hoek';
var defaults = {
  parsers: require('gengojs-default-parser'),
  routers: require('gengojs-default-router'),
  backends: require('gengojs-default-memory'),
  apis: require('gengojs-default-api'),
  headers: require('gengojs-default-header'),
  localizes: require('gengojs-default-localize'),
  handlers: require('gengojs-default-handler')
};
class Plugify {
  constructor(plugins, callback, _this) {
    /*jshint strict:false*/
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
      registrations.forEach(plugin => {
        this.assert(plugin);
        console.log(_this.plugins);
        if (_this.plugins[plugin.package.type + 's'].length === 0)
          callback.bind(_this)(plugin.main, plugin.package, plugin.defaults);
        else if (_this.plugins[plugin.package.type + 's'].length > 1)
          _this.plugins[plugin.package.type].pop();
      }, this);
      // Set defaults
      this.defaults(_this, callback);
    }
  }
  // Initialize
  initialize(plugins) {
    return _.assign(plugins, {
      parsers: [],
      routers: [],
      backends: [],
      apis: [],
      headers: [],
      localizes: [],
      handlers: []
    });
  }

  defaults(_this, callback) {
    _.forOwn(_this.plugins, function(plugins, key) {
      if (_this.plugins[key].length === 0) {
        var plugin = defaults[key];
        this.assert(plugin);
        callback.bind(_this)(plugin.main, plugin.package, plugin.defaults);
      }
    });
  }

  assert(plugin) {
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
}


export
default (plugins, callback, context) => {
  'use strict';
  return new Plugify(plugins, callback, context);
};