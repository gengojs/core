import pkg from './package';
import inputify from './modules/inputify';
import plugify from './modules/plugify/';
import optify from './modules/optify';
import debugify from './modules/debugify';
import servify from './modules/servify';
import bindify from './modules/bindify';
/* Class Gengo */
class Gengo {
  /* Gengo constructor */
  constructor(options, plugins, defaults) {
    debugify('core',
      // Current version
      'version:', (this.version = pkg.version),
      // Options
      'options:', (this.options = optify(options).options));
    // Set Plugins
    this.plugins = plugify(plugins, this.options, defaults);
    // Backend
    this.plugins.backends.forEach((plugin) => bindify(plugin, this)());
  }
  /* i18ns the input */
  parse(phrase, ...args) {
    debugify('core', 'process:', 'parse');
    // Parser
    this.plugins.parsers.forEach((plugin) =>
      bindify(plugin, this)(inputify(phrase, args)));
    return this.result;
  }
  /* Middleware for Node frameworks*/
  ship(req, res, next) {
    debugify('core', 'process:', 'ship');
    // Headers
    this.plugins.headers.forEach((plugin) => bindify(plugin, this)(req, res));
    // Routers
    this.plugins.routers.forEach((plugin) => bindify(plugin, this)(req, res));
    // Localize(s)
    this.plugins.localizes.forEach((plugin) => bindify(plugin, this)(req, res));
    /* Apply API to the objects/request/response*/
    servify(this).apply(req, res, next);
  }
  /* Apply the API to objects */
  assign(req, res) {
    debugify('core', 'process:', 'assign');
    // APIs
    this.plugins.apis.forEach((plugin) => bindify(plugin, this)(req, res));
    // Return the interface
    return this.api;
  }
}
export
default (options, plugins, defaults) => {
  'use strict';
  return new Gengo(options, plugins, defaults);
};
