var debug = require('debug');
var debugify = {
  core: debug('core'),
  plugins: debug('plugins'),
  parser: debug('parser'),
  router: debug('router'),
  backend: debug('backend'),
  header: debug('header'),
  api: debug('api'),
  localize: debug('localize'),
  handler: debug('handler')
};

module.exports = function(type) {
  'use strict';
  debugify[type].apply(null, Array.prototype.slice.call(arguments, 1));
};

module.exports.debug = debug;