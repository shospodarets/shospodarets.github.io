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
                    outputStyle: 'compressed',
                    environment: 'production'
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
                files: ["js/*.js"],
                tasks: ["uglify", "shell:jekyllBuild"]
            },
            css: {
                files: ["scss/**/*.scss"],
                tasks: ["compass", "autoprefixer", "shell:jekyllBuild"]
            },
            svgIcons: {
                files: ["svg/*.svg"],
                tasks: ["svgstore", "shell:jekyllBuild"]
            }
        },

        svgstore: {
            options: {
                prefix: "shape-",
                cleanup: false,
                svg: {
                    style: "display: none;"
                }
            },
            default: {
                files: {
                    "_includes/svg-defs.svg": ["svg/*.svg"]
                }
            }
        }

    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("serve", ["shell:jekyllServe"]);
    grunt.registerTask("default", [
        "uglify",
        "compass",
        "autoprefixer",
        "svgstore",
        "shell:jekyllBuild",
        "watch"
    ]);

};
