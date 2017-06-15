'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');

const paths = {
  scss: {
    base: 'assets/scss/**/*.scss',
    src: 'assets/scss/*.scss',
  },
  css: {
    base: 'assets/css',
    src: ['assets/css/*.css', '!assets/css/*.min.css'],
  },
}

// Scope of browsers to be supported
const processors = [
  autoprefixer({browsers: ['last 2 versions']})
];

// Compile Sass with Sourcemaps
gulp.task('compile', () => {
  function onError(err) {
    $.notify.onError({
      title: 'Groundwork Sass',
      subtitle: 'Ups! Sass build failed 😱',
      message: 'Error: <%= error.message %>'
    })(err);
    this.emit('end');
  };

  return gulp.src(paths.scss.src)
  .pipe($.plumber({errorHandler: onError}))
  .pipe($.sourcemaps.init())
  .pipe($.sass({outputStyle: 'expanded'}))
  .pipe($.postcss(processors))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(paths.css.base))
  .pipe($.plumber.stop())
  .pipe($.notify({
    title: 'Groundwork Sass',
    message: 'Yeah! Sass compiled without problems 👌',
    onLast: true
  }))
});

// Compile Sass in a CSS minified version
gulp.task('minify', () => {
  function onError(err) {
    $.notify.onError({
      title: 'Groundwork Sass',
      subtitle: 'Ups! Sass build failed 😱',
      message: 'Error: <%= error.message %>'
    })(err);
    this.emit('end');
  };

  return gulp.src(paths.scss.src)
  .pipe($.plumber({errorHandler: onError}))
  .pipe($.sass({outputStyle: 'expanded'}))
  .pipe($.postcss(processors))
  .pipe($.cssnano({
    discardUnused: {
      fontFace: false
    }
  }))
  .pipe($.rename({suffix: '.min'}))
  .pipe(gulp.dest(paths.css.base))
  .pipe($.plumber.stop())
  .pipe($.notify({
    title: 'Groundwork Sass',
    message: 'Yeah! Minified version created without problems 👌',
    onLast: true
  }))
});

// Compile Sass to CSS and generate a minified version
gulp.task('build', ['compile', 'minify']);

// Watch sass files for changes
gulp.task('default', () => {
  gulp.watch(paths.scss.base, ['compile']);
});
