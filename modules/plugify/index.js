var _ = require('lodash');
/* Defaults */
/*parser =  require(path.normalize(root + '/plugins/parser/default')),
  api = require(path.normalize(root + '/plugins/api/')),
  apply = require(path.normalize(root + '/plugins/apply/')),
  config = require(path.normalize(root + '/plugins/config/')),
  memory = require(path.normalize(root + '/plugins/memory/')),
  router = require(path.normalize(root + '/plugins/router/')),
  accept = require(path.normalize(root + '/plugins/accept/'));
  localize = require(path.normalize(root + '/plugins/localize/'));*/

/**
 * @description Removes any duplicate functions
 * with the same name.
 * @param  {Array} array The array to remove duplicates.
 * @return {Array}       The unique array;
 */
function unique(array) {
  'use strict';
  if (_.isEmpty(array)) return array;
  else
    array = _.uniq(array, false, function(plugin) {
      return plugin.package.name;
    });
  return array;
}


module.exports = function plugify(plugins) {
  'use strict';
  var result = [];
  if (plugins) plugins = _.isArray(plugins) ? plugins : [plugins()] || null;
  if (plugins) {
    _.forEach(plugins, function(plugin) {
      plugin = plugin();
      switch (plugin.package.type) {
        case 'parser':
          // if (plugin.package.name !== parser.package.name) 
          // result.push(plugin);
          // else result.push(parser());
          unique(result);
          break;
        case 'accept':
          // if (plugin.package.name !== accept.package.name) 
          // result.push(plugin);
          // else result.push(accept());
          unique(result);
          break;
        case 'backend':
          // if (plugin.package.name !== backend.package.name) 
          // result.push(plugin);
          // else result.push(backend());
          unique(result);
          break;
        case 'router':
          // if (plugin.package.name !== router.package.name) 
          // result.push(plugin);
          // else result.push(router());
          unique(result);
          break;
        case 'localize':
          // if (plugin.package.name !== localize.package.name) 
          // result.push(plugin);
          // else result.push(localize());
          unique(result);
          break;
        case 'apply':
          // if (plugin.package.name !== apply.package.name) 
          // result.push(plugin);
          // else result.push(apply());
          unique(result);
          break;
        case 'api':
          // if (plugin.package.name !== api.package.name) 
          // result.push(plugin);
          // else result.push(api());
          unique(result);
          break;
      }
    });
  } else result = [];
  return result;
};