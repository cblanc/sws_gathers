"use strict";

var gulp = require("gulp");
var react = require("gulp-react");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var plumber = require("gulp-plumber");

gulp.task('default', ['compile']);

gulp.task('compile', function () {
	return gulp.src('lib/react/**')
		.pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(react())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('watch', function () {
	gulp.watch('lib/react/**', ['compile']);
});