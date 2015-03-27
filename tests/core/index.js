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
       assert.isObject(Gengo);
       assert.isDefined(Gengo);
     });
     it('should export init', function() {
       assert.isFunction(Gengo.create().init);
       assert.isDefined(Gengo.create().init);
     });
     it('should export ship', function() {
       assert.isFunction(Gengo.create().ship);
       assert.isDefined(Gengo.create().ship);
     });
     it('should export parse', function() {
       assert.isFunction(Gengo.create().parse);
       assert.isDefined(Gengo.create().parse);
     });
     it('should export ship', function() {
       assert.isFunction(Gengo.create().ship);
       assert.isDefined(Gengo.create().ship);
     });
     it('should export use', function() {
       assert.isFunction(Gengo.create().use);
       assert.isDefined(Gengo.create().use);
     });
     it('should export isKoa', function() {
       assert.isFunction(Gengo.create().isKoa);
       assert.isDefined(Gengo.create().isKoa);
     });
     it('should export isHapi', function() {
       assert.isFunction(Gengo.create().isHapi);
       assert.isDefined(Gengo.create().isHapi);
     });
     it('should export isExpress', function() {
       assert.isFunction(Gengo.create().isExpress);
       assert.isDefined(Gengo.create().isExpress);
     });
   });
   describe('plugins', function() {
     it('should load plugins', function() {
       var gengo = Gengo.create({}, gengopack());
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
   describe('settings', function() {
     describe('plain object', function() {
       var options = Gengo.create({
         hello: 'world'
       }).options;
       assert.isDefined(options);
       assert.isObject(options);
       assert.isTrue(_.has(options, 'hello'));
     });
     describe('json', function() {
       it('should read', function() {
         var options = Gengo.create(path.normalize(
           process.cwd() + '/tests/fixtures/settings/settings.json')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
     describe('yaml', function() {
       it('should read', function() {
         var options = Gengo.create(path.normalize(
           process.cwd() + '/tests/fixtures/settings/settings.yml')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
   });
 });