/**
 * This module extracts the phrase and arguments
 * and uses the extractify module (See extractify).
 */
import extractify from '../extractify';
import debugify from '../debugify';
export
default (phrase, args) => {
  'use strict';
  debugify('core-parser', 'phrase:', phrase, 'args:', args);
  return {
    arguments: args,
    length: args.length,
    phrase: phrase,
    other: extractify(args, args.length)
  };
};