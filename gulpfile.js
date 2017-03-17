'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
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

// Configure static server with BrowserSync
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "./src/",
            browser: ['google chrome']
        }
    });
});

// Reload browser
gulp.task('bs-reload', () => {
  browserSync.reload();
});

// Compile Sass in development environment with Sourcemaps
gulp.task('sass', () => {
  function onError(err) {
    $.notify.onError({
      title: 'Groundwork Lite',
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
  .pipe(browserSync.stream())
  .pipe($.plumber.stop())
  .pipe($.notify({
    title: 'Groundwork Lite',
    message: 'Yeah! Sass compiled without problems 👌',
    onLast: true
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
  function onError(err) {
    $.notify.onError({
      title: 'Groundwork Lite',
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
    message: 'Yeah! Stylesheets created without problems 👌',
    onLast: true
  }))
});

// Build /dist folder
gulp.task('build', ['clean', 'copy', 'styles']);

// Watch sass files for changes
gulp.task('default', ['browser-sync'], () => {
  gulp.watch(base.src + '**/*.scss', ['sass']);
  gulp.watch(base.src + '*.html', ['bs-reload']);
});
