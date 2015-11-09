var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
require('./web/tasks/build');
require('./web/tasks/develop');
require('./web/tasks/webpack');
gulp.task('default',['build','develop','watch','webpack'], function(){
});
