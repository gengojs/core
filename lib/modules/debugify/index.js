import debug from 'debug';
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
  debugify[type].apply(null, args);
}