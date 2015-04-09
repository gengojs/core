import _ from 'lodash';

class Extract {
  constructor(array, length) {
    var values = {},
      args = [],
      value;
    // If the arguments is greater than 2 (because of offset)
    if (length > 1) {
      // Just append them to the array
      array.forEach(item => args.push(item));
    }
    // If they are exactly 2 argument
    else if (length === 1) {
      // Get the first value
      value = array[0];
      // Set arguments [...]
      if (_.isArray(value)) args = value;
      else if (_.isPlainObject(value)) args = [];
      else args.push(value);
      // Set values {...}
      values = _.isPlainObject(value) ? value : {};
    }

    this.values = values;
    this.args = args;
  }
  hasValues() {
    return !_.isEmpty(this.values);
  }
  hasArgs() {
    return !_.isEmpty(this.args);
  }
}

export
default (array, length) => {
  /*jshint strict:false*/
  return new Extract(array, length);
};
