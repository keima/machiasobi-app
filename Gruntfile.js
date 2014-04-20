'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    yeoman: {
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      test: 'test'
    },

    /* grunt-contrib-watch */
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/**/*.js'],
        tasks: ['injector'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['<%= yeoman.test %>/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/partials/{,*/}*.html',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: '<%= yeoman.app %>/index.html',
        ignorePath: '<%= yeoman.app %>/',
        exclude: [/underscore/]
      }
    },

    // Automatically inject JavaScript into the app
    injector: {
      options: {
        ignorePath: '<%= yeoman.app %>/',
        addRootSlash: false
      },
      app: {
        files: {
          '<%= yeoman.app %>/index.html': ['<%= yeoman.app %>/scripts/{,*/}*.js']
        }
      }
    }


  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'bowerInstall',
      'injector',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('default', [
    'serve'
  ]);

};
