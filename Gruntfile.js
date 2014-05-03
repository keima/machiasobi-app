'use strict';

module.exports = function(grunt) {

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
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
//        tasks: ['injector'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
//        tasks: ['injector'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['<%= yeoman.test %>/spec/{,*/}*.js'],
        tasks: ['karma']
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

    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/styles/',
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
          }
        ]
      }
    },

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
          '<%= yeoman.app %>/index.html': ['<%= yeoman.app %>/scripts/{,*/}*.js', '<%= yeoman.app %>/styles/{,*/}*.css']
        }
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          // default : { steps: { 'js': ['concat', 'uglifyjs'], 'css': ['concat', 'cssmin']}, post: {}}
          steps: {
            'js': ['concat'],
            'css': ['concat', 'cssmin']
          },
          post: {}
        }
      }
    },

    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html', '<%= yeoman.dist %>/partials/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: ['*.html', 'partials/{,*/}*.html'],
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },

    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            src: ['<%= yeoman.dist %>/scripts/main.js'],
            dest: '<%= yeoman.dist %>/scripts'

            /*
             cwd: '.tmp/concat/scripts',
             src: '*.js',
             dest: '.tmp/concat/scripts'
             */
          }
        ]
      }
    },

    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/index.html']
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'partials/{,*/}*.html',
//              'bower_components/**/*',
              'images/{,*/}*.{webp}',
              'fonts/*'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.dist %>/images',
            src: ['generated/*']
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    concurrent: {
      dist: [
        'imagemin',
        'svgmin'
      ]
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }

  });

  grunt.registerTask('serve', function(target) {
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

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
//    'cdnify',
    'cssmin',
//    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'serve'
  ]);

};
