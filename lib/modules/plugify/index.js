import _ from 'lodash';
import Hoek from 'hoek';

class Plugify {
  constructor(plugins, callback, context) {
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
      // callback!
      registrations.forEach(plugin => {
        // Assert
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
        callback.bind(context)(plugin.main, plugin.package, plugin.defaults);
      });
    }
  }
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
}


export
default (plugins, callback, context) => {
  'use strict';
  return new Plugify(plugins, callback, context);
};