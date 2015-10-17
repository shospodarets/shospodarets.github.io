'use strict';

module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({
        browserify: {
            global: {
                files: {
                    "js/main.min.js": ["_js/main.js"]
                }
            }
        },

        uglify: {
            global: {
                files: {
                    "js/main.min.js": ["js/main.min.js"]
                }
            }
        },

        sass: {
            global: {
                options: {
                    outputStyle: 'compressed'
                    //sourceComments: true
                },
                files: [{
                    expand: true,
                    cwd: '_scss',
                    src: ['**/*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            },
            demos: {// all *.scss files in "demos" folder
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'demos',
                    src: [
                        '**/*.scss',
                        '!**/bower_components/**/*.scss'
                    ],
                    dest: 'demos',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            global: {
                src: "css/style.css",
                dest: "css/style.css"
            },
            demos: {
                src: "demos/**/*.css"
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
                files: ["*.html", "_layouts/**/*.html", "_posts/*.md", "_includes/**/*.html"],
                tasks: ["shell:jekyllBuild"]
            },
            js: {
                files: ["_js/**/*.js"],
                tasks: ["browserify", "uglify", "shell:jekyllBuild"]
            },
            css: {
                files: ["_scss/**/*.scss"],
                tasks: ["sass", "autoprefixer", "shell:jekyllBuild"]
            },
            css_demos: {
                files: ["demos/**/*.scss"],
                tasks: ["sass:demos", "autoprefixer:demos", "shell:jekyllBuild"]
            }
        }

    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("serve", ["shell:jekyllServe"]);
    grunt.registerTask("default", [
        'browserify',
        "uglify",

        "sass",
        "autoprefixer",
        "sass:demos",
        "autoprefixer:demos",

        "shell:jekyllBuild",
        "watch"
    ]);
};
