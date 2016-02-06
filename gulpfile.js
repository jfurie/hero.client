var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
require('./web/tasks/build');
require('./web/tasks/develop');
require('./web/tasks/webpack');
gulp.task('watch-output',function(){
  return gulp.watch('web/dist/public/js/**', ['cordova']);
});
gulp.task('nothing',['cordova'],function(){});
gulp.task('cordova',['nothing'],function(){
  console.log('copy');
  return gulp.src('web/dist/public/js/**')
  .pipe(gulp.dest('cordova/www/js/'));
});
gulp.task('default',['build','develop','watch','webpack','watch-output'], function(){
});
