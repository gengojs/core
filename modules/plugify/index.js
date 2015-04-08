'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Hoek = require('hoek');

var _Hoek2 = _interopRequireWildcard(_Hoek);

exports['default'] = function (plugins, callback, context) {
  /*jshint strict:false*/
  /*
    Definition: 
    A plugin must be either a function, an array containing functions, 
    or an plain object with a set of functions.
    
    1. A plugin must return a plain object 
    with the main (export) function and its package.
    
    2. A package must contain the name and type of plugin.
      // the export function
    function ship(){
      var pkg = require('./package.json');
      //used for options
      pkg.type = 'parser';
      return {
         main:myfunction,
         package:pkg
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
  var registrations = [];
  // check type!
  if (_import2['default'].isPlainObject(plugins)) {
    _import2['default'].forOwn(plugins, function (ship) {
      // assert
      _Hoek2['default'].assert(_import2['default'].isFunction(ship), 'Uh oh! The ship must be a function!');
      _Hoek2['default'].assert(_import2['default'].isPlainObject(ship()), 'Woops! Did the ship forget to return a plain object?');
      // add the ship
      registrations.push(ship());
    });
  } else if (_import2['default'].isArray(plugins)) registrations = plugins;else if (_import2['default'].isFunction(plugins)) {
    _Hoek2['default'].assert(_import2['default'].isPlainObject(plugins()), 'Woops! Did the ship forget to return a plain object?');
    registrations.push(plugins());
  }
  // callback!
  registrations.forEach(function (plugin) {
    // Assert
    _Hoek2['default'].assert(_import2['default'].has(plugin, 'main'), 'Woops! Did you forget the main function?');
    _Hoek2['default'].assert(_import2['default'].has(plugin, 'package'), 'Woops! Did you forget the package?');
    _Hoek2['default'].assert(_import2['default'].has(plugin['package'], 'type'), 'Woops! Did you forget the "type" of plugin?');
    _Hoek2['default'].assert(_import2['default'].has(plugin['package'], 'name'), 'Woops! Did you forget the "name" of plugin?');
    callback.bind(undefined)(plugin.main, plugin['package']);
  }, context);
};

module.exports = exports['default'];