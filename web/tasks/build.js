var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
require('./clean');
require('./copy');
gulp.task('build', ['copy', 'clean'], function() {
  return gulp.src(['web/src/**/*.js','!web/src/public/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({optional: ['runtime']}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/dist'));
});
