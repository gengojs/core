/**
 * This module detects the server
 * and applies the API to the
 * request and response objects
 */
import _ from 'lodash';
import debugify from '../debugify';
class Servify {
  constructor(assign, req, res, next) {
    this.server = '';
    this.assign = assign;
    this.apply(req, res, next);
  }
  /*Applies the API to the objects */
  apply(req, res, next) {
    // Koa?
    if (this.isKoa(req) && !_.isEmpty(req)) {
      this.server = 'koa';
      // Apply api to koa
      this.assign(req.request, req.response);
      if (req.req || req.res) this.assign(req.req, req.res);
      if (req.state) this.assign(req.state);
    }
    // Hapi?
    if (this.isHapi(req) && !_.isEmpty(req)) {
      this.server = 'hapi';
      if (req.response)
        if (req.response.variety === 'view')
          this.assign(req.response.source.context);
      this.assign(req);
    }
    // Express ?
    if (this.isExpress(req) && !_.isEmpty(req)) {
      this.server = 'express';
      this.assign(req, res);
      // Apply to API to the view
      if (res && res.locals) this.assign(res.locals);
    }
    debugify('core', 'server:', this.server);
    // Make sure next exists and call it.
    if (_.isFunction(next)) next();
    return this;
  }

  /* Framework detection */
  isKoa(req) {
    return req && !req.raw ? (req.response && req.request) :
      !_.isEmpty(this.server) ? this.server === 'koa' : false;
  }
  isHapi(req) {
    return req ? (req.raw) :
      !_.isEmpty(this.server) ? this.server === 'hapi' : false;
  }
  isExpress(req) {
    return req && !req.raw ? (req && !req.raw && !req.response) :
      !_.isEmpty(this.server) ? this.server === 'express' : false;
  }
}

export
default (assign, req, res, next) => {
  'use strict';
  return new Servify(assign, req, res, next);
};