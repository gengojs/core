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
  'core-localize': debug('core-localize'),
  'core-handler': debug('core-handler')
};
export
default

function(type, ...args) {
  /*jshint strict:false*/
  debugify[type].apply(null, (() => {
    var _args = [];
    _.forEach(args, (item) => {
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
          }
        });
      } else _args = args;
    });
    return _args;
  })());
}