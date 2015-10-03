"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var concat = require('gulp-concat');

var paths = {
    scripts: ['index.js', 'matchers.js', 'model.js', 'readLineByLine.js']
};

gulp.task('clean', function (cb) {
    // You can use multiple globbing patterns as you would with `gulp.src` 
    del(['build'], cb);
});

gulp.task('scripts', /*['clean'],*/ function () {
    // Minify and copy all JavaScript (except vendor scripts) 
    // with sourcemaps all the way down 
    return gulp.src(paths.scripts)
        .on('error', console.log)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});

gulp.task('default', ['scripts']);