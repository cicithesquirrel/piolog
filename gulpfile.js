"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var concat = require('gulp-concat');

var paths = {
    scripts: ['src/js/*.js', '!src/js/index.js'],
    build: 'piolog.min.js'
};

gulp.task('clean', function (endCallback) {
    // You can use multiple globbing patterns as you would with `gulp.src` 
    del(['build']);
    endCallback();
});

gulp.task('scripts', ['clean'], function () {
    // Minify and copy all JavaScript (except vendor scripts) 
    // with sourcemaps all the way down 
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(paths.build))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('default', ['scripts']);