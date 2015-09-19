"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var watch = require("gulp-watch");
var babel = require("gulp-babel");
var plumber = require("gulp-plumber");
var compass = require('gulp-compass');


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

// Run Compass on SCSS Files
gulp.task('css', function() {
  gulp.src('public/css/sass')
    .pipe(compass({
        config_file: 'config/config.rb',
        css: 'public/css',
        sass: 'public/css/sass'
      })
    )
    .on('error', function(error) {
      // Spits error out 
      console.log(error);
      this.emit('end');
    })
    .pipe(gulp.dest('public/css'))
});

gulp.task('watchcss', function() {
   gulp.watch('public/css/**/*.scss', ['css']);
});