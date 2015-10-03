"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');

var paths = {
    scripts: ['src/js/*.js', '!src/js/main.js'],
    build: 'piolog.min.js'
};

gulp.task('clean', function (endCallback) {
    // You can use multiple globbing patterns as you would with `gulp.src` 
    del(['build', '.coverdata', 'coverage', 'reports']);
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

gulp.task('test', function () {
    return gulp.src(paths.scripts, {
            read: false
        }).pipe(cover.instrument({
            pattern: ['test/**/*.js'],
            debugDirectory: 'debug'
        })).pipe(mocha())
        .pipe(cover.gather())
        .pipe(cover.format())
        .pipe(gulp.dest('reports'));
});

gulp.task('default', ['clean', 'scripts', 'test']);
