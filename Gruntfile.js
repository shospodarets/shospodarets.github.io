/* globals module, require */

module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({
        uglify: {
            global: {
                files: {
                    "js/main.min.js": ["_js/main.js"]
                }
            }
        },

        compass: {
            global: {
                options: {
                    sassDir: '_scss',
                    cssDir: 'css',
                    imagesDir: 'images',
                    outputStyle: 'compressed'
//                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            global: {
                src: "css/style.css",
                dest: "css/style.css"
            }
        },

        shell: {
            jekyllServe: {
                command: "jekyll serve",
                options: {
                    stdin: false
                }
            },
            jekyllBuild: {
                command: "jekyll build",
                options: {
                    stdin: false
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            site: {
                files: ["*.html", "_layouts/*.html", "_posts/*.md", "_includes/*.html"],
                tasks: ["shell:jekyllBuild"]
            },
            js: {
                files: ["_js/*.js"],
                tasks: ["uglify", "shell:jekyllBuild"]
            },
            css: {
                files: ["_scss/**/*.scss"],
                tasks: ["compass", "autoprefixer", "shell:jekyllBuild"]
            }
        }

    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("serve", ["shell:jekyllServe"]);
    grunt.registerTask("default", [
        "uglify",
        "compass",
        "autoprefixer",
        "shell:jekyllBuild",
        "watch"
    ]);

};
