var gulp = require('gulp');
var clean = require('gulp-clean');
require('./clean');
gulp.task('clean', function() {
  return gulp.src('web/dist', {
    read: false
  }).pipe(clean());
});
