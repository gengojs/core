 /*global describe, it */
 var assert = require('chai').assert;
 var core = require('../../core');
 var gengopack = require('../fixtures/plugins/');
 var _ = require('lodash');
 var path = require('path');
 describe('core', function() {
   'use strict';
   describe('module', function() {
     it('should export the module', function() {
       assert.isFunction(core);
       assert.isDefined(core);
     });
     it('should export ship', function() {
       assert.isFunction(core().ship);
       assert.isDefined(core().ship);
     });
     it('should export parse', function() {
       assert.isFunction(core().parse);
       assert.isDefined(core().parse);
     });
     it('should export assign', function() {
       assert.isFunction(core().assign);
       assert.isDefined(core().assign);
     });
   });
   describe('plugins', function() {
     it('should load plugins', function() {
       var gengo = core({}, gengopack());
       //parser
       assert.isDefined(gengo.plugins.parser);
       assert.isTrue(!_.isEmpty(gengo.plugins.parser));
       _.forEach(gengo.plugins.parser, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //header
       assert.isDefined(gengo.plugins.header);
       assert.isTrue(!_.isEmpty(gengo.plugins.header));
       _.forEach(gengo.plugins.header, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //router
       assert.isDefined(gengo.plugins.router);
       assert.isTrue(!_.isEmpty(gengo.plugins.router));
       _.forEach(gengo.plugins.router, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //backend
       assert.isDefined(gengo.plugins.backend);
       assert.isTrue(!_.isEmpty(gengo.plugins.backend));
       _.forEach(gengo.plugins.backend, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //api
       assert.isDefined(gengo.plugins.api);
       assert.isTrue(!_.isEmpty(gengo.plugins.api));
       _.forEach(gengo.plugins.header, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
       //localize
       assert.isDefined(gengo.plugins.localize);
       assert.isTrue(!_.isEmpty(gengo.plugins.localize));
       _.forEach(gengo.plugins.localize, function(plugin) {
         assert.isTrue(plugin.bind(this)());
       }, gengo);
     });
   });
   describe('options', function() {
     describe('plain object', function() {
       var options = core({
         hello: 'world'
       }).options;
       assert.isDefined(options);
       assert.isObject(options);
       assert.isTrue(_.has(options, 'hello'));
     });
     describe('js', function() {
       it('should read', function() {
         var options = core(path.normalize(
           process.cwd() + '/tests/fixtures/options/options.js')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
     describe('json', function() {
       it('should read', function() {
         var options = core(path.normalize(
           process.cwd() + '/tests/fixtures/options/options.json')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
     describe('yaml', function() {
       it('should read', function() {
         var options = core(path.normalize(
           process.cwd() + '/tests/fixtures/options/options.yml')).options;
         assert.isDefined(options);
         assert.isObject(options);
         assert.isTrue(_.has(options, 'hello'));
       });
     });
   });
 });
