const { src, dest, watch, task, series, parallel } = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const render = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();

const srcPath = {
  scss: path.join(__dirname, 'app/src/scss'),
  njk: path.join(__dirname, 'app/src/templates')
};

const distPath = {
  css: path.join(__dirname, 'app/src/css'),
  src: path.join(__dirname, 'app/src')
};

function CompileSCSS() {
  return src(srcPath.scss + '/**/*.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(distPath.css))
    .pipe(browserSync.stream());
}

function CompileHTML() {
  return src(srcPath.njk + '/' + '*.njk')
    .pipe(
      render({
        path: [srcPath.njk]
      })
    )
    .pipe(dest(distPath.src));
}

function WatchChanges() {
  browserSync.init({
    open: 'external',
    server: distPath.src
  });
  watch(srcPath.scss, series(CompileSCSS));
  watch(srcPath.njk, series(CompileHTML));
  watch(distPath.src).on('change', browserSync.reload);
}

exports.default = series(parallel(CompileHTML, CompileSCSS), WatchChanges);
