import pkg from '../package';
import { inputify, plugify, optify, servify } from 'gengojs-core-modules';
import debug from 'gengojs-debug';
import _ from 'lodash';
/* Class Gengo */
class Gengo {
  /* Gengo constructor */
  constructor (options, plugins, defaults) {
    debug('core', 'debug', `class: ${Gengo.name}`, `process: constructor`);
    debug('core', 'info',
      // Current version
      `version: ${(this.version = pkg.version)}`,
      // Options
      `options: ${(this.options = optify(options))}`);
    // Set Plugins
    this.plugins = plugify(plugins, this.options, defaults);
    // Backend plugin
    if(!_.isEmpty(this.plugins.backend) && this.plugins.backend)
      this.plugins.backend.apply(this);
  }
  /* i18ns the input */
  parse (phrase, ...args) {
    debug('core', 'debug', `class: ${Gengo.name}`, `process: parse`);
    // Parser plugin
    return this.plugins.parser.apply(this, [inputify(phrase, args)]);
  }
  /* Middleware for Node frameworks */
  ship (req, res, next) {
    debug('core', 'debug', `class: ${Gengo.name}`, `process: ship`);
    // Header plugin
    this.plugins.header.apply(this, arguments);
    // Router plugin
    this.plugins.router.apply(this, arguments);
    // Localize plugin
    this.plugins.localize.apply(this, arguments);
    /* Apply API to the objects/request/response */
    servify(this).apply(req, res, next);
  }
  /* Apply the API to objects */
  assign () {
    debug('core', 'debug', `class: ${Gengo.name}`, `process: assign`);
    // API plugin
    return this.plugins.api.apply(this, arguments);
  }
}
export default (options, plugins, defaults) => {
  'use strict';
  return new Gengo(options, plugins, defaults);
};  