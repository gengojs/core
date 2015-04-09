'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Hoek = require('hoek');

var _Hoek2 = _interopRequireWildcard(_Hoek);

var Plugify = (function () {
  function Plugify(plugins, callback, context) {
    _classCallCheck(this, Plugify);

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
      if (_import2['default'].isPlainObject(plugins)) {
        // This may be the only ship
        if (_import2['default'].has(plugins, 'main')) {
          registrations.push(plugins);
        } else
          // This may have multiple ships
          _import2['default'].forOwn(plugins, function (ship) {
            // Assert that ship is a function
            _Hoek2['default'].assert(_import2['default'].isFunction(ship), 'Uh oh! The ship must be a function!');
            _Hoek2['default'].assert(_import2['default'].isPlainObject(ship()), 'Woops! Did the ship forget to return a plain object?');
            registrations.push(ship());
          });
      }
      if (_import2['default'].isArray(plugins)) registrations = plugins;
      if (_import2['default'].isFunction(plugins)) {
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
        _Hoek2['default'].assert(!_import2['default'].has(plugin['package'], 'defaults'), 'Woops! Did you forget to add "defaults"?');
        _Hoek2['default'].assert(_import2['default'].has(plugin, 'defaults'), 'Woops! Did you forget to add the "defaults"?');
        callback.bind(context)(plugin.main, plugin['package'], plugin.defaults);
      });
    }
  }

  _createClass(Plugify, [{
    key: 'initialize',
    value: function initialize(plugins) {
      return _import2['default'].assign(plugins, {
        parsers: [],
        routers: [],
        backends: [],
        apis: [],
        headers: [],
        localizes: [],
        handlers: []
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