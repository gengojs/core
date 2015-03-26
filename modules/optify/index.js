var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var yamljs = require('yaml-js');


module.exports = function(options) {
  'use strict';
  var settings;
  if (_.isObject(options) && !_.isEmpty(options)) return options;
  else if (_.isString(options)) {
    options = path.normalize(options.replace('yml', 'yaml'));
    if (/.json/.test(options)) settings = require(options);
    else if (/.yaml/.test(options))
      settings = yamljs.safeLoad(fs.readFileSync(options));
    else {
      console.log(
        'Woops! The configuration file must be either JSON or YAML.',
        options
      );
      return {};
    }
  } else return settings || {};
};