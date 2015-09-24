'use strict';

var gulp        = require('gulp'),
    sourcemaps  = require('gulp-sourcemaps'),
    babel       = require('gulp-babel'),
    mocha       = require('gulp-mocha'),
    jshint      = require('gulp-jshint'),
    changelog   = require('gulp-changelog'),
    pages       = require('gulp-gh-pages');

gulp.task('lib', function () {
  return gulp.src('./lib/**/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('./source maps/'))
    .pipe(gulp.dest(function(file){
      return file.base.replace('lib/','');
     }));
});

gulp.task('docs', function() {
  return gulp.src('./docs/**/*')
    .pipe(pages());
});

gulp.task('watch', function () {
    return gulp.watch('./lib/**/*.*', ['lib']);
});
gulp.task('test', ['lib'], function() {
  return gulp.src('./tests/**/**/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha());
});

gulp.task('changelog', function(cb){
	changelog(require('./package.json')).then(function(stream){
		stream.pipe(gulp.dest('./')).on('end', cb);
	});
});

gulp.task('default', ['lib','changelog','watch',]);

gulp.task('build', ['lib','changelog','test', 'docs']);