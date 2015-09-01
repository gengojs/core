var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var mocha  = require('gulp-mocha');
var jshint = require('gulp-jshint');
var changelog = require('gulp-changelog');

gulp.task("lib:entry", function () {
  return gulp.src('./lib/**/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("./source maps/"))
    .pipe(gulp.dest(function(file){
      return file.base.replace('lib/','');
     }));
});

gulp.task('watch', function () {
    return gulp.watch('./lib/**/*.*', ['lib:entry']);
});
gulp.task('test', ['lib:entry'], function() {
  return gulp.src('./tests/**/**/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha());
});

gulp.task('changelog', function(cb){
	changelog(require('./package.json')).then(function(stream){
		stream.pipe(gulp.dest('./')).on('end', cb);
	})
});

gulp.task("default", ['lib:entry','changelog','watch',]);

gulp.task('build', ['lib:entry','changelog','test']);