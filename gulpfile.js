'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const del = require('del');


const base = {
  src: './src/',
  dist: './dist/'
};

const paths = {
  scss: {
    src: 'src/assets/scss/*.scss',
  },
  css: {
    base: 'src/assets/css',
    src: ['src/assets/css/*.css', '!src/assets/css/*.min.css'],
    dist: 'dist/assets/css',
  },
  images: {
    src: 'src/assets/images/*',
    dist: 'dist/assets/images/'
  },
  copy: {
    src: [
      'src/*.html',
      'src/assets/js/**/*',
      'src/assets/images/**/*',
      'src/assets/fonts/**/*'
    ]
  }
}

// Scope of browsers to be supported
const processors = [
  autoprefixer({browsers: ['last 2 versions']})
];

// Compile Sass in development environment with Sourcemaps
gulp.task('sass', () => {
  let onError = (err) => {
    $.notify.onError({
      title: 'Gulp Sass',
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
    title: 'Gulp Sass',
    subtitle: '👌 Yeah! Sass compiled without problems~',
  }))
});

// Clean /dist directory
gulp.task('clean', () => {
  del(['dist/**/*']);
});

// Copy all other files and folders from /src to /dist
gulp.task('copy', () => {
 return gulp.src(paths.copy.src, { base: 'src' })
 .pipe(gulp.dest(base.dist));
});

// Stylesheets for production environment with minified version
gulp.task('styles', () => {
  let onError = (err) => {
    $.notify.onError({
      title: 'Gulp Sass',
      subtitle: 'Ups! Sass build failed 😱',
      message: 'Error: <%= error.message %>'
    })(err);
    this.emit('end');
  };

  return gulp.src(paths.scss.src)
  .pipe($.plumber({errorHandler: onError}))
  .pipe($.sass({outputStyle: 'expanded'}))
  .pipe($.postcss(processors))
  .pipe(gulp.dest(paths.css.dist))
  .pipe($.cssnano({
    discardUnused: {
      fontFace: false
    }
  }))
  .pipe($.rename({suffix: '.min'}))
  .pipe(gulp.dest(paths.css.dist))
  .pipe($.plumber.stop())
  .pipe($.notify({
    title: 'Gulp Styles',
    subtitle: '👌 Yeah! Stylesheets created without problems~',
  }))
});

// Build /dist folder
gulp.task('build', ['clean', 'copy', 'styles']);

// Watch sass files for changes
gulp.task('default', () => {
  gulp.watch('src/**/*.scss', ['sass']);
});
