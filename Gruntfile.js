module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint: {
      src: ['index.js', 'modules/**/*.js', 'tests/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });
  grunt.registerTask('default', [
    'jshint'
  ]);

}