'use strict';
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

var scripts = ['**/*.js', '!node_modules/**', '!coverage/**'];
var tests = 'test.js';

gulp.task('test', function () {
	return gulp.src(tests)
		.pipe(mocha({reporter: 'spec'}));
});

gulp.task('instrument', function () {
	return gulp.src(scripts.concat(['!' + tests]))
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['instrument'], function () {
	return gulp.src(tests)
		.pipe(mocha({
			reporter: 'dot'
		}))
		.pipe(istanbul.writeReports({
			reporters: ['lcovonly', 'text-summary', 'html']
		}));
});

gulp.task('default', ['coverage']);
