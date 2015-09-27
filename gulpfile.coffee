gulp = require 'gulp'
$ = require('gulp-load-plugins')() # injecting gulp-* plugin
browserSync = require 'browser-sync'
bowerFiles = require "main-bower-files"
runSequence = require 'run-sequence'
rimraf = require "rimraf"

# config
config =
  dir: './app/'
  index: './app/index.html'
  js: './app/scripts/**/*.js'
  css: './app/styles/**/*.css'
  partials: './app/partials/**/*.html'
  copy: [
    '*.{ico,png,txt}',
    'manifest.json',
    '*.html',
    'partials/{,*/}*.html',
    'images/{,*/}*.{webp,png,jpg,jpeg,gif}',
    'objects/{,*/}*.json',

    'bower_components/onsenui/build/css/{font_awesome,ionicons}/css/*.min.css',
    'bower_components/onsenui/build/css/{font_awesome,ionicons}/fonts/*.{otf,eot,svg,ttf,woff}'
  ]
  output: './dist/'

#
# Task
#
gulp.task 'browser-sync', ->
  browserSync server:
    baseDir: config.dir

gulp.task 'watch', ->
  gulp.watch config.js, ['inject', browserSync.reload]
  gulp.watch config.css, ['inject', browserSync.reload]

gulp.task 'inject', ->
  bower = gulp.src bowerFiles(), {read: false}
  sources = gulp.src [config.js, config.css], {read: false}

  gulp.src config.index
  .pipe $.inject bower, {ignorePath: 'app', addRootSlash: false, name: 'bower'}
  .pipe $.inject sources, {ignorePath: 'app', addRootSlash: false}
  .pipe gulp.dest config.dir

gulp.task 'usemin', ->
  cssTask = [
    $.pleeease("autoprefixer": {"browsers": ["last 4 versions", "ios 6", "android 4.0"]}),
    $.rev()
  ]
  jsTask = [
    $.ngAnnotate(), $.uglify(), $.rev()
  ]

  gulp.src config.index
  .pipe $.usemin(
    html: [$.minifyHtml(empty: true, conditionals: true)]
    vendorcss: cssTask
    css: cssTask
    vendorjs: jsTask
    js: jsTask
  )
  .pipe gulp.dest(config.output)

gulp.task 'copy', ->
  gulp.src config.partials, {base: config.dir}
  .pipe $.minifyHtml(empty: true)
  .pipe gulp.dest config.output

  # other
  gulp.src config.copy, {base: config.dir}
  .pipe gulp.dest config.output


gulp.task 'clean', (cb) ->
  rimraf(config.output, cb);


gulp.task 'default', ['browser-sync', 'watch']

gulp.task 'build', (cb) -> runSequence(
  'clean', 'inject', 'usemin', 'copy'
  cb
)
