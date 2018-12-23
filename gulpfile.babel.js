'use strict';

const plugins = require('gulp-load-plugins');

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');
const named = require('vinyl-named');
const plumber = require('gulp-plumber');
const spawn = require('cross-spawn');
const webpack2 = require('webpack');
const webpackStream = require('webpack-stream');
const yaml = require('js-yaml');
const yargs = require('yargs');

// Load all Gulp plugins into one letiable
const $ = plugins();
const config = loadConfig();
const isProduction = !!(yargs.argv.production);

let webpackConfig = {
  mode: (isProduction ? 'production' : 'development'),
  watch: false,
  cache: false,
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ "@babel/preset-env" ],
            compact: false
          }
        }
      }
    ]
  },
  devtool: !isProduction && 'source-map'
};


function loadConfig() {
  let ymlFile = fs.readFileSync('gulp/config.yml', 'utf-8');
  return yaml.load(ymlFile);
}

function clean(done) {
  del.sync(config.clean);
  done();
}

// Copy files out of the assets folder
// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy(done) {
  return gulp.src(config.copy.assets)
    .pipe(plumber())
    .pipe(gulp.dest(config.copy.dist))
    .on('end', done);
}

// Build the "dist" folder by running all of the below tasks
// Sass must be run later so UnCSS can search for used classes in the others assets.
gulp.task('build',
  gulp.series(clean, jekyllBuild, gulp.parallel(javascripts, copy), sass));

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

function jekyllBuild(done) {
  let processEnv = process.env;
  if (isProduction) {
    processEnv.JEKYLL_ENV = 'production';
  }

  browserSync.notify(config.jekyll.notification);
  // Spawn jekyll commands
  return spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit', env: processEnv})
    .on('close', done);
}

function sass(done) {
  browserSync.notify(config.sass.notification);

  return gulp.src(config.sass.src)
    .pipe(plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(autoprefixer(config.sass.compatibility))
    .pipe($.if(isProduction, $.cssnano()))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest(config.sass.dest.jekyllRoot))
    .pipe(gulp.dest(config.sass.dest.buildDir))
    .on('end', done);
}

function javascripts(done) {
  browserSync.notify(config.javascript.notification);

  return gulp.src(config.javascript.src)
    .pipe(plumber())
    .pipe(named())
    .pipe($.sourcemaps.init())
    .pipe(webpackStream(webpackConfig, webpack2))
    .pipe($.if(isProduction, $.uglify({mangle: false})))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
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

function watch() {
  gulp.watch(config.watch.pages).on('all', gulp.series('build', browserSync.reload));
  gulp.watch(config.watch.javascript).on('all', gulp.series(javascripts, browserSync.reload));
  gulp.watch(config.watch.sass).on('all', gulp.series(sass, browserSync.reload));
  gulp.watch(config.watch.media).on('all', gulp.series(copy, browserSync.reload));
}

