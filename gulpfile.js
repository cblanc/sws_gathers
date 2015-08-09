"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var babel = require("gulp-babel");
var plumber = require("gulp-plumber");

gulp.task('default', ['compile']);

gulp.task('compile', function () {
	return gulp.src('lib/react/**')
		.pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(babel())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('watch', function () {
	gulp.watch('lib/react/**', ['compile']);
});