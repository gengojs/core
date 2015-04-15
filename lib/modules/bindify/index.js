/**
 * This modules bind a function to the context.
 */
import debugify from '../debugify';
export
default (fn, _this) => {
  'use strict';
  debugify(fn);
  return fn.bind(_this);
};