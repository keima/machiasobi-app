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
  image: './app/images/**/*.+(webp|png|jpg|jpeg|gif)'
  copy: [
    './app/*.+(ico|png|txt)',
    './app/manifest.json',
    './app/bower_components/onsenui/build/css/+(font_awesome|ionicons)/css/*.min.css',
    './app/bower_components/onsenui/build/css/+(font_awesome|ionicons)/fonts/*.+(otf|eot|svg|ttf|woff)'
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
  js = gulp.src([config.js]).pipe($.angularFilesort())
  css = gulp.src [config.css], {read: false}

  gulp.src config.index
  .pipe $.inject bower, {ignorePath: 'app', addRootSlash: false, name: 'bower'}
  .pipe $.inject js, {ignorePath: 'app', addRootSlash: false}
  .pipe $.inject css, {ignorePath: 'app', addRootSlash: false}
  .pipe gulp.dest config.dir

gulp.task 'usemin', ->
  cssTask = (files, filename) ->
    files.pipe $.pleeease(
      import: {path: ["dist/bower_components/onsenui/build/css","app/bower_components/onsenui/build/css"]}
      autoprefixer: {browsers: ["last 4 versions", "ios 6", "android 4.0"]}
#      rebaseUrls: false
      out: config.output + filename
    )
    .pipe $.concat(filename)
    .pipe $.rev()

  jsTask = (files, filename) ->
    files.pipe $.ngAnnotate()
    .pipe $.uglify()
    .pipe $.concat(filename)
    .pipe $.rev()

  gulp.src config.index
  .pipe $.spa.html(
    assetsDir: config.dir
    pipelines:
#  main: (files)->
#    files.pipe $.minifyHtml(empty: true, conditionals: true)
      vendorjs: (files)->
        jsTask files, "vendor.js"
      js: (files)->
        jsTask files, "app.js"
      vendorcss: (files)->
        cssTask files, "vendor.css"
      css: (files)->
        cssTask files, "app.css"
  )
  .pipe gulp.dest(config.output)

gulp.task 'imagemin', ->
  gulp.src config.image, {base: config.dir}
  .pipe $.imagemin({
    progressive: true
  })
  .pipe gulp.dest config.output

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
  'clean', 'inject', 'copy', 'usemin', 'imagemin',
  cb
)
