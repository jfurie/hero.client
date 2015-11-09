var gulp = require('gulp');
require('./clean');
gulp.task('copy',['clean','copyPublic','copyViews'], function() {
});

gulp.task('copyPublic',['clean'], function(){
  return gulp.src('./web/src/public/**/*').pipe(gulp.dest('./web/dist/public'));
});

gulp.task('copyViews',['clean'], function(){
  return gulp.src('./web/src/app/views/**/*').pipe(gulp.dest('./web/dist/app/views'));
})
