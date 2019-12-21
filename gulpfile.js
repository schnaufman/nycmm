'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const del = require('del');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const named = require('vinyl-named');
const plumber = require('gulp-plumber');
const spawn = require('cross-spawn');
const webpack2 = require('webpack');
const webpackStream = require('webpack-stream');
const yaml = require('js-yaml');
const yargs = require('yargs');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

// configure sass with compiler
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const config = loadConfig();
const isProduction = !!(yargs.argv.production);

let webpackConfig = {
  mode: (isProduction ? 'production' : 'development'),
  watch: false,
  cache: false,
  output: {
    filename: 'bundle-[hash].js'
  },
  devtool: !isProduction && 'source-map'
};


function loadConfig() {
  let ymlFile = fs.readFileSync('gulp/config.yml', 'utf-8');
  return yaml.load(ymlFile);
}

function cleanTask(done) {
  del.sync(config.clean);
  done();
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copyTask(done) {
  return gulp.src(config.copy.assets)
    .pipe(plumber())
    .pipe(gulp.dest(config.copy.dist))
    .on('end', done);
}

// Build the "dist" folder by running all of the below tasks
// Sass must be run later so UnCSS can search for used classes in the others assets.
gulp.task('build',
  gulp.series(cleanTask, jsTask, jekyllBuildTask, copyTask, sassTask));

gulp.task('debug',
  gulp.series(cleanTask, jsTask, jekyllBuildTask));

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

function jekyllBuildTask(done) {
  let processEnv = process.env;
  if (isProduction) {
    processEnv.JEKYLL_ENV = 'production';
  }

  glob.sync(config.javascript.dest.buildDir + '*.js')
    .forEach(file => {
      processEnv.BUNDLE = '/' + config.javascript.dest.jekyllRoot + path.basename(file);
    });

  browserSync.notify(config.jekyll.notification);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit', env: processEnv })
    .on('close', done);
}

function sassTask(done) {
  browserSync.notify(config.sass.notification);

  return gulp.src(config.sass.src)
    .pipe(plumber())
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(config.sass.compatibility))
    .pipe(gulpif(isProduction, cleanCSS()))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(config.sass.dest.buildDir))
    .on('end', done);
}

function jsTask(done) {
  browserSync.notify(config.javascript.notification);

  const fileStream = gulp.src(config.javascript.src)
    .pipe(plumber())
    .pipe(named())
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(webpackStream(webpackConfig, webpack2));

  // replace enviroment variables in js files
  for (const key in process.env) {
    if (key.startsWith('NYCMM_ENV')) {
      const replacementString = '\\${' + key + '}';
      fileStream.pipe(replace(new RegExp(replacementString, 'g'), process.env[key]));
    }
  }

  return fileStream
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(config.javascript.dest.buildDir))
    .on('end', done);
}

function server(done) {
  browserSync.init({
    notify: config.browsersync.notify,
    open: config.browsersync.open,
    port: config.browsersync.port,
    server: {
      baseDir: config.browsersync.server.basedir
    },
    xip: config.browsersync.xip
  });
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch(config.watch.pages, gulp.series('build', browserSyncReload));
  gulp.watch(config.watch.javascript, gulp.series(jsTask, browserSyncReload));
  gulp.watch(config.watch.sass, gulp.series(sassTask, browserSyncReload));
  gulp.watch(config.watch.media, gulp.series(copyTask, browserSyncReload));
}

