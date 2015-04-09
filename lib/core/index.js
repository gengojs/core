import pkg from './package';
import extractify from './modules/extractify';
import plugify from './modules/plugify/';
import optify from './modules/optify';
import debugify from './modules/debugify';
import _ from 'lodash';

class Gengo {
  /* Gengo constructor */
  constructor(options, plugins) {
    /* Gengo properties */
    //Current version
    this.version = pkg.version;
    // Options
    this.options = optify(options).options;
    // Current server
    this.server = '';
    /* Plugins */
    this.plugins = plugify().initialize((this.plugins = {}));
    // Initialize plugins
    this.use(plugins);
    // Debug core
    debugify('core',
      'version:', this.version,
      'options:', this.options,
      'server:', this.server);
    debugify('core-plugins', 'plugins:', this.plugins);
    // Call backend plugin
    this.plugins.backends.forEach((plugin) => {
      debugify('core-' + plugin.package.type, plugin.package);
      plugin.bind(this)();
    }, this);
  }
  /* i18ns the input*/
  parse(phrase, ...args) {
    debugify('core', 'fn:', 'parse');
    // Parser
    this.plugins.parsers.forEach((plugin) => {
      var input = {
        arguments: args,
        length: args.length,
        phrase: phrase,
        other: extractify(args, args.length)
      };
      debugify('core-' + plugin.package.type, plugin.package);
      debugify('core-' + plugin.package.type, 'input', input);
      plugin.bind(this)(input);
    }, this);
    return this.result;
  }
  /* Sets the plugins */
  use(plugins) {
    debugify('core', 'fn:', 'use');
    // Add plugins to array when plugify
    // begins its callbacks
    if (plugins)
      plugify(plugins, (main, pkg, defaults) => {
        var {
          name, type
        } = pkg;
        // Initialize an object
        this.plugins[type] = {};
        // Set the plugin fn
        this.plugins[type][name] = main;
        // Set the package
        this.plugins[type][name].package = pkg;
        // Insert plugins as callbacks
        this.plugins[type + 's'].push(main);
        // Set the default options by merging with user's
        this.options[type] = optify(this.options[type] || {}).merge(defaults);
      }, this);
  }
  /* Middleware for Node frameworks*/
  ship() {
    debugify('core', 'fn:', 'ship');
    // Get the request, response
    var req = arguments[0],
      res = arguments[1] || null,
      next = arguments[2] || null;
    /*Set plugins */
    // Headers
    this.plugins.headers.forEach((plugin) => {
      debugify('core-' + plugin.package.type, plugin.package);
      plugin.bind(this)(req, res);
    }, this);
    // Routers
    this.plugins.routers.forEach((plugin) => {
      debugify('core-' + plugin.package.type, plugin.package);
      plugin.bind(this)(req, res);
    }, this);
    // Localize(s)
    this.plugins.localizes.forEach((plugin) => {
      debugify('core-' + plugin.package.type, plugin.package);
      plugin.bind(this)();
    }, this);
    /* Apply API */
    // Koa?
    if (this.isKoa(req) && !_.isEmpty(req)) {
      this.server = 'koa';
      // Apply api to koa
      this.assign(req.request, req.response);
      if (req.req || req.res) this.assign(req.req, req.res);
      if (req.state) this.assign(req.state);
    }
    // Hapi?
    if (this.isHapi(req) && !_.isEmpty(req)) {
      this.server = 'hapi';
      if (req.response)
        if (req.response.variety === 'view')
          this.assign(req.response.source.context);
      this.assign(req);
    }
    // Express ?
    if (this.isExpress(req) && !_.isEmpty(req)) {
      this.server = 'express';
      this.assign(req, res);
      // Apply to API to the view
      if (res && res.locals) this.assign(res.locals);
    }
    debugify('core', 'server:', this.server);
    // Make sure next exists and call it.
    if (_.isFunction(next)) next();
  }
  /* Applies the API to objects */
  assign(req, res) {
    debugify('core', 'fn:', 'assign');
    // Define the API
    this.plugins.apis.forEach((plugin) => {
      debugify('core-' + plugin.package.type, plugin.package);
      plugin.bind(this)();
    }, this);
    // Apply the API
    this.plugins.handlers.forEach((plugin) => {
      debugify('core-' + plugin.package.type, plugin.package);
      plugin.bind(this)(req, res);
    }, this);
  }
  /* Framework detection */
  isKoa(req) {
    return req && !req.raw ? (req.response && req.request) :
      !_.isEmpty(this.server) ? this.server === 'koa' : false;
  }
  isHapi(req) {
    return req ? (req.raw) :
      !_.isEmpty(this.server) ? this.server === 'hapi' : false;
  }
  isExpress(req) {
    return req && !req.raw ? (req && !req.raw && !req.response) :
      !_.isEmpty(this.server) ? this.server === 'express' : false;
  }
}
export
default (options, plugins) => {
  'use strict';
  return new Gengo(options, plugins);
};