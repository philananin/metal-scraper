module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true
        },
        src: ['test/*.js']
      },
    },

    watch: {
      scripts: {
        options: {
          spawn: false,
        },
        files: ['**/*.js', '!**/node_modules/**'],
        tasks: ['jshint', 'mochaTest']
      }
    },

    jshint: {
      all: ['*.js', 'utils/*.js', 'processors/*.js', 'test/*.js']
    }
  });

  grunt.registerTask('default', [ 'jshint', 'mochaTest' ]);
};
