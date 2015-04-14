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
            options: {
                outputStyle: 'compressed'
                //sourceComments: true
            },
            global: {
                files: [{
                    expand: true,
                    cwd: '_scss',
                    src: ['**/*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
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
                files: ["*.html", "_layouts/**/*.html", "_posts/*.md", "_includes/**/*.html"],
                tasks: ["shell:jekyllBuild"]
            },
            js: {
                files: ["_js/**/*.js"],
                tasks: ["browserify", "uglify", "shell:jekyllBuild"]
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
        'browserify',
        "uglify",
        "sass",
        "autoprefixer",
        "shell:jekyllBuild",
        "watch"
    ]);

};
