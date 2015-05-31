/**
 * This module detects the server
 * and applies the API to the
 * request and response objects
 */
import _ from 'lodash';
import debugify from '../debugify';
class Servify {
  constructor(_this) {
    this.server = '';
    this.context = _this;
  }
  /* Applies the API to the objects */
  apply(req, res, next) {
    var _this = this.context;
    // Koa?
    if (this.isKoa(req) && !_.isEmpty(req)) {
      this.server = 'koa';
      // Apply api to koa
      _this.assign(req);
      _this.assign(req.request, req.response);
      if (req.req || req.res) _this.assign(req.req, req.res);
      if (req.state) _this.assign(req.state);
    }
    // Hapi?
    if (this.isHapi(req) && !_.isEmpty(req)) {
      this.server = 'hapi';
      if (req.response)
        if (req.response.variety === 'view')
          _this.assign(req.response.source.context);
      _this.assign(req);
    }
    // Express ?
    if (this.isExpress(req) && !_.isEmpty(req)) {
      this.server = 'express';
      _this.assign(req, res);
      // Apply to API to the view
      if (res && res.locals) _this.assign(res.locals);
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
default (_this) => {
  'use strict';
  return new Servify(_this);
};
