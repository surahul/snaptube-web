'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        assets: grunt.file.readJSON('assets.json'),
        uglify: {
            main: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: '<%= assets.main.js %>'
            }
        },
        cssmin: {
            main: {
                files: '<%= assets.main.css %>'
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['cssmin', 'uglify']);
};