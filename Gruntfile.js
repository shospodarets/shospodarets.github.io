'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: '_scss',
                    cssDir: 'css',
                    imagesDir: 'images',
                    outputStyle: 'compressed',
                    environment: 'production'
//                    debugInfo: true
                }
            }
        }

    });

    require('load-grunt-tasks')(grunt);// alternative for repeating grunt.loadNpmTasks('*');

    grunt.registerTask('default', [
        'compass:dist',
        'shell:jekyllBuild'
    ]);
};