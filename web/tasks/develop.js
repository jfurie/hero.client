var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

gulp.task('develop', ['clean', 'copy', 'build'], function() {
  nodemon({
    script: './web/dist/server.js',
    ext: 'js coffee swig',
    nodeArgs: ['--debug=5878'],
    watch: ['./dist'],
    delay: 2000
  }).on('restart', function() {

  });

});
gulp.task('watch', function() {
  gulp.watch(['./web/src/**/*'], {
  }, ['build']);
  gulp.watch(['./web/src/public/**/*'], {
  }, ['build']);
});
