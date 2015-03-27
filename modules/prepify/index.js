/* 
 * Takeshi Iwana
 * MIT 2015
 * Prepify simplifies the package
 * parsing from the plugin
 * and returns the necessaray
 * information.
 * plugins
 */

function Prepify(plugin, options) {
  'use strict';
  this._package = plugin.package;
  this._options = options;
  return this;
}
// Return package
Prepify.prototype.package = function() {
  'use strict';
  return this._package;
};

// Return type
Prepify.prototype.type = function() {
  'use strict';
  return this._package.type;
};

// Return name
Prepify.prototype.name = function() {
  'use strict';
  return this._package.name;
};

//Return options
Prepify.prototype.options = function() {
  'use strict';
  return this._options[this._package.type];
};

module.exports = function(plugin, options) {
  'use strict';
  return new Prepify(plugin, options);
};