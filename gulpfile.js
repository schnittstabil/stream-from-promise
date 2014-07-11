'use strict';
var gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    scripts = ['**/*.js', '!node_modules/**', '!coverage/**'],
    tests = 'test.js';

function lint(fail) {
  return function() {
    var l = gulp.src(scripts)
        /* hint */
      .pipe(jshint())
      .pipe(jshint.reporter())
      /* jscs */
      .pipe(jscs());

    if (fail) {
      return l.pipe(jshint.reporter('fail'));
    } else {
      return l;
    }
  };
}

gulp.task('lint', lint(true));
gulp.task('lint-watch', lint(false));

gulp.task('watch:lint', function() {
  gulp.watch(scripts, ['lint-watch']);
});

gulp.task('watch:test', function() {
  gulp.watch(scripts, ['test']);
});

gulp.task('watch', function() {
  gulp.watch(scripts, ['lint-watch', 'test']);
});

gulp.task('test', function() {
  return gulp.src(tests)
      .pipe(mocha({reporter: 'spec'}));
});

gulp.task('coverage', function (done) {
  gulp.src(scripts.concat(['!' + tests]))
    .pipe(istanbul())
    .on('finish', function () {
      /* tests */
      gulp.src(tests)
        .pipe(mocha({
          reporter: 'dot'
        }))
        .pipe(istanbul.writeReports({
          reporters: ['lcovonly', 'text-summary', 'html']
        }))
        .on('end', done);
    });
});

gulp.task('default', ['lint', 'coverage']);
