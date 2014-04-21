module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['*.js', 'src/**/*.js']
    },
    nodemon: {
      dev: {
        script: [ 'scraper.js' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', [ 'jshint' ]);
  grunt.registerTask('scrape', 'nodemon');
};
