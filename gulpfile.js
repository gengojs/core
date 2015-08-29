var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var mocha  = require('gulp-mocha');
var jshint = require('gulp-jshint')
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

gulp.task("default", ['lib:entry','watch']);

gulp.task('build', ['lib:entry', 'test']);