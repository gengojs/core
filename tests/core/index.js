 /*global describe, it */
 var assert = require('chai').assert;
 var Gengo = require('../../');
 var gengopack = require('../fixtures/plugins/');
 var _ = require('lodash');
 var path = require('path');
 describe('core', function() {
   'use strict';
   describe('module', function() {
     it('should export the module', function() {
       assert.isFunction(Gengo);
       assert.isDefined(Gengo);
     });
     it('should export ship', function() {
       assert.isFunction(new Gengo().ship);
       assert.isDefined(new Gengo().ship);
     });
     it('should export parse', function() {
       assert.isFunction(new Gengo().parse);
       assert.isDefined(new Gengo().parse);
     });
     it('should export assign', function() {
       assert.isFunction(new Gengo().assign);
       assert.isDefined(new Gengo().assign);
     });
     it('should export use', function() {
       assert.isFunction(new Gengo().use);
       assert.isDefined(new Gengo().use);
     });
     it('should export isKoa', function() {
       assert.isFunction(new Gengo().isKoa);
       assert.isDefined(new Gengo().isKoa);
     });
     it('should export isHapi', function() {
       assert.isFunction(new Gengo().isHapi);
       assert.isDefined(new Gengo().isHapi);
     });
     it('should export isExpress', function() {
       assert.isFunction(new Gengo().isExpress);
       assert.isDefined(new Gengo().isExpress);
     });
   });
   describe('plugins', function() {
     it('should load plugins', function() {
       var gengo = new Gengo({}, gengopack());
       //parsers
       assert.isDefined(gengo.plugins.parsers);
       assert.isTrue(!_.isEmpty(gengo.plugins.parsers));
       _.forEach(gengo.plugins.parsers, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //headers
       assert.isDefined(gengo.plugins.headers);
       assert.isTrue(!_.isEmpty(gengo.plugins.headers));
       _.forEach(gengo.plugins.headers, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //routers
       assert.isDefined(gengo.plugins.routers);
       assert.isTrue(!_.isEmpty(gengo.plugins.routers));
       _.forEach(gengo.plugins.routers, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //backends
       assert.isDefined(gengo.plugins.backends);
       assert.isTrue(!_.isEmpty(gengo.plugins.backends));
       _.forEach(gengo.plugins.backends, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //apis
       assert.isDefined(gengo.plugins.apis);
       assert.isTrue(!_.isEmpty(gengo.plugins.apis));
       _.forEach(gengo.plugins.headers, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //localizes
       assert.isDefined(gengo.plugins.localizes);
       assert.isTrue(!_.isEmpty(gengo.plugins.localizes));
       _.forEach(gengo.plugins.localizes, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //handlers
       assert.isDefined(gengo.plugins.handlers);
       assert.isTrue(!_.isEmpty(gengo.plugins.handlers));
       _.forEach(gengo.plugins.handlers, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
     });
   });
   describe('options', function() {
     describe('plain object', function() {
       var options = new Gengo({
         hello: 'world'
       }).options;
       assert.isDefined(options);
       assert.isObject(options);
       assert.isTrue(_.has(options, 'hello'));
     });
     describe('js', function() {
       it('should read', function() {
         var options = new Gengo(path.normalize(
           process.cwd() + '/tests/fixtures/options/options.js')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
     describe('json', function() {
       it('should read', function() {
         var options = new Gengo(path.normalize(
           process.cwd() + '/tests/fixtures/options/options.json')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
     describe('yaml', function() {
       it('should read', function() {
         var options = new Gengo(path.normalize(
           process.cwd() + '/tests/fixtures/options/options.yml')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
   });
 });