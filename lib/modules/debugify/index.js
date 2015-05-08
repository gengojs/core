/**
 * This modules debugs the core
 */

import debug from 'debug';
import _ from 'lodash';
var debugify = {
  core: debug('core'),
  'core-plugins': debug('core-plugins'),
  'core-parser': debug('core-parser'),
  'core-router': debug('core-router'),
  'core-backend': debug('core-backend'),
  'core-header': debug('core-header'),
  'core-api': debug('core-api'),
  'core-localize': debug('core-localize')
};
export
default

function(type, ...args) {
  'use strict';
  var _args = [];
  var _type = _.isString(type) ? type : '';
  // If type is a package
  if (_.isObject(type) && type.package) {
    // Set type
    _type = type.package.type;
    // Push the package to args
    _args.push(type.package);
  }
  var log = debugify['core-' + _type] || debugify[_type];
  log.apply(null, (() => {
    // Iterate through the arguments
    _.forEach(args, (item) => {
      // If args is a package
      // then recreate the args
      if (_.isPlainObject(item)) {
        _.forOwn(item, (value, key) => {
          switch (key) {
            case 'name':
              _args.push(key + ':');
              _args.push(value);
              break;
            case 'version':
              _args.push(key + ':');
              _args.push(value);
              break;
            case 'type':
              _args.push(key + ':');
              _args.push(value);
              break;
          }
        });
      } else _args = _.merge(_args, args);
    });
    return _args;
  })());
}
