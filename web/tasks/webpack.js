var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("gulp-webpack");
var webpackConf = require('../../webpack.web.config');
var webpackCordovaConf = require('../../webpack.cordova.config');
gulp.task("webpack",['build'], function(done) {
  // run webpack
  return gulp.src('./src/main.web.js').pipe(webpack(webpackConf)).pipe(gulp.dest('./web/dist/public/js/'));
});

gulp.task("webpack-cordova",['build'], function(done) {
  // run webpack
  return gulp.src('./src/main.web.js').pipe(webpack(webpackCordovaConf)).pipe(gulp.dest('./cordova/www/js/'));
});
