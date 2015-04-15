/**
 * This module reads or sets the
 * initial options
 */
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import Hoek from 'hoek';
/*
    Definition: Options must be either a string or a plain object.

    1. Options must be specified by type such as 'parser', 'api', etc.
       

    Side note: Every plugin created must offer default options and must 
    be responsible with letting the developers know about the options
    for your plugin (through GitHub, etc).
*/
class Optify {
  constructor(options) {
    this.options = {};
    var settings;
    if (_.isPlainObject(options) && !_.isEmpty(options))
      this.options = options;
    else if (_.isString(options)) {
      // Normalize the string and if it ends in yml replace it
      options = path.normalize(options.replace('yml', 'yaml'));
      // Load the json or javascript file
      if (/\.json/.test(options) || /\.js/.test(options)) {
        settings = require(options);
        this.options = settings;
      } else if (/\.yaml/.test(options)) {
        // Load yaml
        settings = yaml.safeLoad(fs.readFileSync(options, 'utf8'));
        this.options = settings;
      } else {
        Hoek.assert(false,
          'Woops! Did you forgt to add the extension? \n' +
          'The supported files are .json, .js, and .yaml.');
        this.options = {};
      }
    } else this.options = settings || {};
  }
  merge(options) {
    return _.defaults(this.options, options);
  }
}

export
default (options) => {
  'use strict';
  return new Optify(options);
};