'use strict';
var config = require('./theme-config.json');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Project settings
    theme: {
      // configurable paths
      app: 'app',
      dist: 'dist',
      temp: '.tmp',
      public: 'public'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= theme.app %>/assets/scripts/**/*.js'],
        tasks: [
          'concat:dev',
          'newer:jshint:all'
        ],
        options: {
          livereload: true
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      sass: {
        files: ['<%= theme.app %>/assets/styles/**/*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.server.options.livereload %>'
        },
        files: [
          '<%= theme.app %>/*.html',
          '<%= theme.app %>/templates/**/*.html',
          '<%= theme.app %>/schemas/**/*.json',
          '<%= theme.app %>/assets/scripts/**/*.js',
          '<%= theme.temp %>/styles/**/*.css',
          '<%= theme.app %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= theme.app %>/bower_components/edools-school/dist/**/*.js'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      server: {
        options: {
          port: 9000,
          // Change this to '0.0.0.0' to access the server from outside.
          hostname: 'localhost',
          livereload: 35729,
          open: true,
          keepAlive: true,
          base: ['./.tmp', './app'],
          middleware: function (connect, opts, middlewares) {
            var edoolsMiddleware = require('edools-connect-middleware').middleware({
              theme: config.theme_id,
              token: config.token,
              parseSchemas: true
            });
            middlewares.unshift(edoolsMiddleware);
            return middlewares;
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= theme.app %>/scripts/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= theme.temp %>',
            '<%= theme.dist %>/*',
            '!<%= theme.dist %>/.git*'
          ]
        }]
      },
      server: '<%= theme.temp %>'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= theme.temp %>/styles/',
          src: '**/*.css',
          dest: '<%= theme.temp %>/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
     app: {
       src: ['<%= theme.app %>/index.html'],
       ignorePath: '<%= theme.app %>/',
       exclude: [
         'bower_components/font-awesome/css/font-awesome.css'
       ]
     },
     sass: {
       src: ['<%= theme.app %>/styles/**/*.{scss,sass}'],
       ignorePath: '<%= theme.app %>/bower_components/'
     }
   },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        includePaths: ['<%= theme.app %>/bower_components/compass-mixins/lib']
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= theme.app %>/assets/styles',
          src: ['main.scss'],
          dest: '<%= theme.temp %>/styles',
          ext: '.css'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= theme.dist %>/assets/scripts/**/*.js',
            '<%= theme.dist %>/assets/styles/**/*.css',
            '<%= theme.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= theme.app %>/index.html',
      options: {
        dest: '<%= theme.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= theme.dist %>/**/*.html'],
      css: ['<%= theme.dist %>/assets/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= theme.dist %>', '<%= theme.dist %>/images']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: './<%= theme.temp %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= theme.app %>/assets/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= theme.dist %>/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= theme.app %>/assets/images',
          src: '**/*.svg',
          dest: '<%= theme.dist %>/assets/images'
        }]
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
        files: [{
          expand: true,
          cwd: '<%= theme.dist %>',
          src: ['*.html', 'templates/**/*.html'],
          dest: '<%= theme.dist %>'
        }]
      }
    },

    cdnify: {
      html: {
        options: {
          base: '//CDN_THEME_URL::'
        },
        files: [{
          expand: true,
          cwd: '<%= theme.dist %>',
          dest: '<%= theme.dist %>',
          src: ['**/*.html']
        }]
      },

      css: {
        options: {
          base: '//CDN_THEME_URL::/ignored'
        },
        files: [{
          expand: true,
          cwd: '<%= theme.dist %>',
          dest: '<%= theme.dist %>',
          src: ['**/*.css']
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= theme.app %>',
          dest: '<%= theme.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'templates/**/*.html',
            'schemas/**/*.json',
            'static-test/**/*.json',
            'assets/static-test/**/*.json',
            'assets/images/**/*.{webp}',
            'assets/fonts/**/*.{otf,eot,svg,ttf,woff}'
          ]
        }, {
          expand: true,
          cwd: '<%= theme.temp %>/images',
          dest: '<%= theme.dist %>/assets/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= theme.app %>/assets/styles',
        dest: '<%= theme.temp %>/styles/',
        src: '**/*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass:server'
      ],
      test: [
        'sass'
      ],
      dist: [
        'sass:server',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= theme.dist %>/styles/main.css': [
    //         '<%= theme.temp %>/styles/**/*.css',
    //         '<%= theme.app %>/styles/**/*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= theme.dist %>/scripts/scripts.js': [
    //         '<%= theme.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    concat: {
      dev: {
        options: {
          separator: ';',
        },
        src: ['<%= theme.app %>/assets/scripts/**/*.js'],
        dest: '<%= theme.temp %>/dev/scripts.js',
      }
    },

    // Make a zipfile
    compress: {
      main: {
        options: {
          archive: '<%= theme.public %>/<%= pkg.name %>.zip',
        },
        files: [
          {expand: true, cwd: '<%= theme.dist %>/' ,src: ['**']} // includes files in path and its subdirs
        ]
      }
    },

    edools_deploy: {
      options: {
        theme: config.theme_id,
        token: config.token,
        apps: require('./Appfile.json'),
        package_file: '<%= theme.public %>/<%= pkg.name %>.zip'
      },
      dist: {
        files: [
          {expand: true, cwd: '<%= theme.dist %>/' ,src: ['**']}
        ]
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'concat:dev',
      'connect:server',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'cdnify',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'compress',
    'edools_deploy'
  ]);
};
