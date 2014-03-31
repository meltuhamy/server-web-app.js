'use strict';

module.exports = function (grunt) {

  // load grunt tasks on demand
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist/*'
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app.js',
        'config/**/*.js',
				'routes/**/*.js',
				'public/**/*.js'
			]
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.',
          dest: 'dist',
          src: [
            'package.json',
            'app.js',
            'config/**/*',
            'public/**/*',
            'routes/**/*',
            'views/**/*',
            'node_modules/**/*',
            '!node_modules/grunt*/**',
            '!node_modules/jit-grunt/**'
          ]
        }]
      }
    },
    'update-version': {
      dist: {
        src: 'dist/package.json'
      }
    }
  });

  grunt.registerTask('build', [
    'jshint'
  ]);

  grunt.registerTask('ci-build', [
    'clean:dist',
    'jshint',
    'copy',
    'update-version'
  ]);

  grunt.registerTask('default', ['build']);

  grunt.registerTask('create-version', function() {
    var buildNumber = process.env.BUILD_NUMBER, // Jenkins build number
        newVersion;
    if (buildNumber) {
      newVersion = grunt.config.get('pkg.version').split('-')[0] + '-' + buildNumber;
      grunt.config.set('pkg.version', newVersion);
    }
  });

  grunt.registerMultiTask('update-version', function () {
    this.filesSrc.forEach(function (file) {
      var pkg = grunt.file.readJSON(file);
      pkg.version = grunt.config.get('pkg.version');
      grunt.file.write(
        file,
        JSON.stringify(pkg, null, 2) + '\n'
      );
      grunt.log.writeln('Updated ' + file.cyan + ' version to ' + pkg.version);
    });
  });

};
