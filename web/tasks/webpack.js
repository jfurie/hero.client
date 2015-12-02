var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("gulp-webpack");
var webpackConf = require('../../webpack.web.config');
gulp.task("webpack",['build'], function(done) {
  // run webpack
  return gulp.src('./src/main.web.js').pipe(webpack(webpackConf)).pipe(gulp.dest('./web/dist/public/js/'));
});
