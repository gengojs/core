import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import Hoek from 'hoek';
/*
    Definition: Options must be either a string or a plain object.

    1. Options must be defined similar to how grunt defines their options:
       {
        //plugin name must be exact to the package name
          superPluginName:{
              //...
          }
       }

    Side note: Every plugin created must offer default options and must 
    be responsible with letting the developers know about the options
    for your plugin (through GitHub, etc).
*/
export
default (options) => {
  /*jshint strict:false*/
  var settings;
  if (_.isPlainObject(options) && !_.isEmpty(options)) return options;
  else if (_.isString(options)) {
    // Normalize the string and if it ends in yml replace it
    options = path.normalize(options.replace('yml', 'yaml'));
    // Load the json file
    if (/.json/.test(options)) {
      settings = require(options);
      return settings;
    } else if (/.yaml/.test(options)) {
      // Load yaml
      settings = yaml.safeLoad(fs.readFileSync(options, 'utf8'));
      return settings;
    } else {
      Hoek.assert(false,
        'Woops! The configuration file must be either JSON or YAML.');
      return {};
    }
  } else return settings || {};
};