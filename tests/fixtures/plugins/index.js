var _ = require('lodash');

function fixture() {
  /*jshint validthis:true, strict: false  */
  return _.isPlainObject(this.options);
}

function fixture1() {
  /*jshint validthis:true, strict: false  */
  return _.isPlainObject(this.options);
}

function fixture2() {
  /*jshint validthis:true, strict: false  */
  return _.isPlainObject(this.options);
}

function fixture3() {
  /*jshint validthis:true, strict: false  */
  return _.isPlainObject(this.options);
}

function fixture4() {
  /*jshint validthis:true, strict: false  */
  return _.isPlainObject(this.options);
}

function fixture5() {
  /*jshint validthis:true, strict: false  */
  return _.isPlainObject(this.options);
}

function fixture6() {
  /*jshint validthis:true, strict: false  */
  return _.isPlainObject(this.options);
}

var gengopack = {
  //exports
  parser: function() {
    'use strict';
    var pkg = {};
    pkg.name = 'mocha-parser';
    pkg.nickname = 'uberParser';
    // ! add type
    pkg.type = 'parser';
    return {
      main: fixture,
      package: pkg
    };
  },
  router: function() {
    'use strict';
    var pkg = {};
    pkg.name = 'mocha-router';
    pkg.type = 'router';
    return {
      main: fixture1,
      package: pkg
    };
  },
  backend: function() {
    'use strict';
    var pkg = {};
    pkg.name = 'mocha-backend';
    pkg.type = 'backend';
    return {
      main: fixture2,
      package: pkg
    };
  },
  api: function() {
    'use strict';
    var pkg = {};
    pkg.name = 'mocha-api';
    pkg.type = 'api';
    return {
      main: fixture3,
      package: pkg
    };
  },
  header: function() {
    'use strict';
    var pkg = {};
    pkg.name = 'mocha-header';
    pkg.type = 'header';
    return {
      main: fixture4,
      package: pkg
    };
  },
  localize: function() {
    'use strict';
    var pkg = {};
    pkg.name = 'mocha-localize';
    pkg.type = 'localize';
    return {
      main: fixture5,
      package: pkg
    };
  },
  handler: function() {
    'use strict';
    var pkg = {};
    pkg.name = 'mocha-handler';
    pkg.type = 'handler';
    return {
      main: fixture6,
      package: pkg
    };
  }
};

module.exports = function() {
  'use strict';
  return gengopack;
};