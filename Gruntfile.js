module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint: {
      src: ['lib/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          './index.js': 'lib/core/index.js',
          './modules/debugify/index.js': 'lib/modules/debugify/index.js',
          './modules/extractify/index.js': 'lib/modules/extractify/index.js',
          './modules/optify/index.js': 'lib/modules/optify/index.js',
          './modules/plugify/index.js': 'lib/modules/plugify/index.js',
          './modules/inputify/index.js': 'lib/modules/inputify/index.js',
          './modules/servify/index.js': 'lib/modules/servify/index.js',
          './modules/bindify/index.js': 'lib/modules/bindify/index.js'
        }
      }
    }
  });
  grunt.registerTask('default', [
    'jshint',
    'babel'
  ]);
};