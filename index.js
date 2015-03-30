/*
 * gengojs-core
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 */
(function() {
  'use strict';
  /* Imports */
  var version = require('./package').version,
    extractify = require('./modules/extractify/'),
    plugify = require('./modules/plugify/'),
    optify = require('./modules/optify/'),
    debugify = require('./modules/debugify/'),
    prepify = require('./modules/prepify/'),
    _ = require('lodash'),
    Proto = require('uberproto');
  /* Constructor */
  var Gengo = Proto.extend({
    init: function(options, plugins) {
      debugify('core', 'fn:', 'init');

      /* Gengo properties */

      //Version
      this.version = version;
      // Current server
      this.server = '';
      // i18ned string
      this.result = '';

      // Debug
      debugify('core', 'version:', this.version);


      /* Plugin Options */

      // (String | Object) options
      this.options = _.assign((this.options = {}), optify(options));
      debugify('core', 'options:', this.options);

      /* Utils */

      this.utils = {
        // General debugger
        debug: debugify.debug,
        // Lodash
        _: _
      };

      /* Plugins */

      this.plugins = {};
      this.plugins.parsers = [];
      this.plugins.routers = [];
      this.plugins.backends = [];
      this.plugins.apis = [];
      this.plugins.headers = [];
      this.plugins.localizes = [];
      this.plugins.handlers = [];
      // Set plugins
      this.use(plugins);

      debugify('core', 'plugins:', this.plugins);
      debugify('plugins', 'plugins loaded:');
      debugify('plugins', 'parsers:', this.plugins.parsers);
      debugify('plugins', 'routers:', this.plugins.routers);
      debugify('plugins', 'backends:', this.plugins.backends);
      debugify('plugins', 'apis:', this.plugins.apis);
      debugify('plugins', 'headers:', this.plugins.headers);
      debugify('plugins', 'localizes:', this.plugins.localizes);
      debugify('plugins', 'handlers:', this.plugins.handlers);

      // Backends
      _.forEach(this.plugins.backends, function(plugin) {
        if (plugin) {
          var info = prepify(plugin, this.options);
          this.plugins._backend = info.package();
          this.plugins._backend.options = info.options();
          debugify('backend', 'name:', info.name(),
            'options:', info.options());
          plugin.bind(this)();
        }
      }, this);

      return this;
    },
    /* Parse calls the plugin when called by the API --> __('Hello')*/
    parse: function(phrase) {
      debugify('core', 'fn:', 'parse');
      // Parser properties
      this.parser = {
        length: arguments.length,
        phrase: phrase,
        other: extractify(arguments, this.length),
        arguments: arguments
      };
      // parser
      _.forEach(this.plugins.parsers, function(plugin) {
        if (plugin) {
          var info = prepify(plugin, this.options);
          this.plugins._parser = info.package();
          this.plugins._parser.options = info.options();
          debugify('parser', 'name:', info.name(),
            'options:', info.options());
          debugify('parser', 'phrase:', this.phrase);
          debugify('parser', 'args:', this.other.args);
          debugify('parser', 'values:', this.other.values);
          plugin.bind(this)();
        }
      }, this);
      return this.result;
    },
    /** Ship is the middleware for Express, Koa, and Hapi (can support more)*/
    ship: function() {
      debugify('core', 'fn:', 'ship');

      // Get the request, response
      var req = arguments[0],
        res = arguments[1] || null,
        next = arguments[2] || null;

      /*Set plugins */
      // Headers
      _.forEach(this.plugins.headers, function(plugin) {
        if (plugin) {
          var info = prepify(plugin, this.options);
          this.plugins._header = info.package();
          this.plugins._header.options = info.options();
          debugify('header', 'name:', info.name(),
            'options:', info.options());
          plugin.bind(this)(req, res);
        }
      }, this);
      // Routers
      _.forEach(this.plugins.routers, function(plugin) {
        if (plugin) {
          var info = prepify(plugin, this.options);
          this.plugins._router = info.package();
          this.plugins._router.options = info.options();
          debugify('router', 'name:', info.name(),
            'options:', info.options());
          plugin.bind(this)(req, res);
        }
      }, this);
      // Localize(s)
      _.forEach(this.plugins.localizes, function(plugin) {
        if (plugin) {
          var info = prepify(plugin, this.options);
          this.plugins._localize = info.package();
          this.plugins._localize.options = info.options();
          debugify('localize', 'name:', info.name(),
            'options:', info.options());
          plugin.bind(this)();
        }
      }, this);
      /* Apply API */

      // Koa?
      if (this.isKoa(req)) {
        this.server = 'koa';
        // Apply api to koa
        this.assign(req.request, req.response);
        if (req.req || req.res) this.assign(req.req, req.res);
        if (req.state) this.assign(req.state);
      }
      // Hapi?
      if (this.isHapi(req)) {
        this.server = 'hapi';
        if (req.response)
          if (req.response.variety === 'view')
            this.assign(req.response.source.context);
        this.assign(req);
      }
      // Express ?
      if (this.isExpress(req)) {
        this.server = 'express';
        this.assign(req, res);
        // Apply to API to the view
        if (res && res.locals) this.assign(res.locals);
      }

      debugify('core', 'current server:', this.server);
      // Make sure next exists and call it.
      if (_.isFunction(next)) next();
    },
    /** Use is the function that enables Gengo to accept plugins.*/
    use: function(plugins) {
      debugify('core', 'fn:', 'use');
      if (plugins) {
        // Add plugins to array when plugify
        // begins its callbacks
        plugify(plugins, function(main, pkg) {
          // Initialize an object
          this.plugins[pkg.type] = {};
          // Set the plugin fn
          this.plugins[pkg.type][pkg.name] = main;
          // Set the package
          this.plugins[pkg.type][pkg.name].package = pkg;
          // Insert plugins as callbacks
          this.plugins[pkg.type + 's'].push(main);
        }, this);
      }
      return this;
    },
    /* Assign applies the API to the objects.*/
    assign: function() {
      debugify('core', 'fn:', 'assign');

      // Define the API
      _.forEach(this.plugins.apis, function(plugin) {
        if (plugin) {
          var info = prepify(plugin, this.options);
          this.plugins._api = info.package();
          this.plugins._api.options = info.options();
          debugify('api', 'name:', info.name(),
            'options:', info.options());
          plugin.bind(this)();
        }
      }, this);

      // Apply
      _.forEach(this.plugins.handlers, function(plugin) {
        if (plugin) {
          var info = prepify(plugin, this.options);
          this.plugins._handler = info.package();
          this.plugins._handler.options = _.merge(info.options() || {},
          // In this case, handler uses the same options
          // as the API plugin. But I will merge in case anyone
          // needs to use an handler option on its own.
          this.plugins._api.options);
          debugify('handler', 'name:', info.name(),
            'options:', info.options());
          plugin.bind(this)();
        }
      }, this);
      return this;
    },
    isKoa: function(req) {
      return req && !req.raw ? (req.response && req.request) :
        !_.isEmpty(this.server) ? this.server === 'koa' : false;
    },
    isHapi: function(req) {
      return req ? (req.raw) :
        !_.isEmpty(this.server) ? this.server === 'hapi' : false;
    },
    isExpress: function(req) {
      return req && req.raw ? (req && !req.raw && !req.response) :
        !_.isEmpty(this.server) ? this.server === 'express' : false;
    }
  });

  module.exports = Gengo;
}).call(this);
