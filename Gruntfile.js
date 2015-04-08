module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint: {
      src: ['lib/*.js', 'lib/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          './index.js': 'lib/index.js',
          './modules/debugify/index.js': 'lib/modules/debugify/index.js',
          './modules/extractify/index.js': 'lib/modules/extractify/index.js',
          './modules/optify/index.js': 'lib/modules/optify/index.js',
          './modules/plugify/index.js': 'lib/modules/plugify/index.js'
        }
      }
    }
  });
  grunt.registerTask('default', [
    'jshint',
    'babel'
  ]);
};