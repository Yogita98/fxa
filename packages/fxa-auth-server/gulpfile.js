var gulp = require('gulp'),
  inlineCss = require('gulp-inline-css');

gulp.task('default', function () {
  return gulp
    .src('./lib/senders/components/dist/*.html')
    .pipe(inlineCss())
    .pipe(gulp.dest('./lib/senders/components/inlined/'));
});
