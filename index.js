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
    extract = require('./modules/extract/'),
    plugify = require('./modules/plugify/'),
    optify = require('./modules/optify/'),
    _ = require('lodash'),
    Proto = require('uberproto');
  /**
   * @class
   * @description gengo.js Constructor.
   * @private
   */
  var Gengo = Proto.extend({
    init: function(options, plugins) {
      //version
      this.version = version;
      // top level gengo (applied api)
      this.gengo = undefined;
      // (String | Object) internal options
      this.options = optify(options);
      //current server
      this.server = '';
      // i18ned string
      this.result = '';

      /* Plugins */

      this.plugins = {};
      // low level api
      this.plugins.parsers = [];
      this.plugins.routers = [];
      this.plugins.backends = [];
      this.plugins.apis = [];
      this.plugins.accepts = [];
      this.plugins.localizes = [];
      this.plugins.handlers = [];
      // set plugins
      this.use(plugins);
      // backends (MUST initialize this before parsing!)
      _.forEach(this.plugins.backends, function(plugin) {
        if (plugin) {
          this.plugins._backend = plugin.package;
          plugin.apply(this);
        }
      }, this);

      return this;
    },
    /**
     * @method parse
     * @description Calls all parsers for i18n.
     * @param  {(String | Object)} phrase The phrase or object to parse.
     * @param  {Object} other  The arguments and values extracted.
     * @param  {Number} length The number of 'arguments'.
     * @return {String}        The i18ned string.
     * @private
     */
    parse: function(phrase) {
      this.length = arguments.length;
      this.phrase = phrase;
      this.other = extract(arguments, this.length);
      this.arguments = arguments;
      _.forEach(this.plugins.parsers, function(plugin) {
        if (plugin) {
          this.plugins._parser = plugin.package;
          plugin.apply(this);
        }
      }, this);
      return this.result;
    },
    /** Ship is the middleware for Express, Koa, and Hapi */
    ship: function() {
      // get the request, response
      var req = arguments[0],
        res = arguments[1] || null,
        next = arguments[2] || null;

      /*Set plugins */
      // accepts
      _.forEach(this.plugins.accepts, function(plugin) {
        if (plugin) {
          this.plugins._accept = plugin.package;
          plugin.bind(this)(req, res);
        }
      }, this);
      // routers
      _.forEach(this.plugins.routers, function(plugin) {
        if (plugin) {
          this.plugins._router = plugin.package;
          plugin.bind(this)(req, res);
        }
      }, this);
      // localize(s)
      _.forEach(this.plugins.localizes, function(plugin) {
        if (plugin) {
          this.plugins._localize = plugin.package;
          plugin.apply(this);
        }
      }, this);
      /* Apply API */

      // koa?
      if (this.isKoa(req)) {
        this.server = 'koa';
        //apply api to koa
        this.assign(req.request, req.response);
        if (req.req || req.res) this.assign(req.req, req.res);
        if (req.state) this.assign(req.state);
      }
      // hapi?
      if (this.isHapi(req)) {
        this.server = 'hapi';
        if (req.response)
          if (req.response.variety === 'view')
            this.assign(req.response.source.context);
        this.assign(req);
      }
      // express ?
      if (this.isExpress(req)) {
        this.server = 'express';
        this.assign(req, res);
        // apply to API to the view
        if (res && res.locals) this.assign(res.locals);
      }
      if (_.isFunction(next)) next();
    },
    /**
     * @method use
     * @description Enables Gengo to accept a plugins.
     * @param  {Function} fn The plugins parser for Gengo to use.
     * @private
     */
    use: function(plugins) {
      // set defaults and plugins
      _.forEach(plugify(plugins), function(plugin) {
        if (plugin) {
          var _package = plugin.package,
            type = _package.type,
            name = _package.name;

          // example: this.plugins.parser.default
          this.plugins[type] = {};
          this.plugins[type][name] = plugin;
          this.plugins[type][name].package = +_package;
          // insert plugins as callbacks
          this.plugins[type + 's'].push(plugin);
        }

      }, this);
      return this;
    },
    /** 
     * @method assign
     * @description Assigns the API to an object.
     * @private
     */
    assign: function() {
      // apply
      _.forEach(this.plugins.handlers, function(plugin) {
        if (plugin) {
          this.plugins._handler = plugin.package;
          plugin.apply(this);
        }
      }, this);
      return this;
    },
    /** 
     * @method gengo
     * @description Sets up the API.
     * @return {Object} The api for Gengo.
     * @private
     */
    bootstrap: function() {
      // api
      _.forEach(this.plugins.apis, function(plugin) {
        if (plugin) {
          this.plugins._api = plugin.package;
          plugin.bind(this)();
        }
      }, this);
      return this.api;
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