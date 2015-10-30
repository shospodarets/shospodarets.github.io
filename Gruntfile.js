'use strict';

var path = require('path');
var webpack = require('webpack');

var rootPath = path.resolve();

//var DEBUG_IS_ENABLED = Boolean(process.env.BLOG_DEBUG);// environment variable

module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({
        webpack: {
            dist: {
                entry: rootPath + '/_js/main.js',
                output: {
                    filename: 'js/main.min.js'
                },
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            exclude: [/node_modules/, /bower_components/],
                            loader: 'babel',
                            query: {
                                // https://github.com/babel/babel-loader#options
                                cacheDirectory: true,
                                // http://babeljs.io/docs/usage/options/
                                optional: ['runtime'],

                                //stage: 0// Strawman specification
                                //stage: 1// Proposal specification
                                stage: 2// Draft specification
                                //stage: 3// Candidate specification
                                //stage: 4// Finished specification
                            }
                        }
                    ],
                    noParse: [
                        // do not process any bower modules- just use them
                        /bower_components/
                    ]
                },
                resolve: {
                    extensions: ['', '.js'],
                    root: [
                        '_js'
                    ]
                },
                resolveLoader: {
                    root: path.join(__dirname, 'node_modules')// use common/node_modules for dependencies
                },
                //watch: true,
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        minimize: true,
                        compress: {// http://lisperator.net/uglifyjs/compress
                            dead_code: false,
                            side_effects: false,
                            unused: false
                        }
                    })
                ],
                devtool: 'source-map'
            }
        },

        sass: {
            options: {
                outputStyle: 'compressed',
                sourceMap: true
            },
            critical: {
                files: [{
                    expand: true,
                    cwd: '_scss',
                    src: ['critical.scss'],
                    dest: '_includes',
                    ext: '.css'
                }]
            },
            nonCritical: {
                files: [{
                    expand: true,
                    cwd: '_scss',
                    src: ['non-critical.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            },
            demos: {// all *.scss files in "demos" folder
                files: [{
                    expand: true,
                    cwd: 'demos',
                    src: [
                        '**/*.scss',
                        '!**/bower_components/**/*.scss',
                        '!**/node_modules/**/*.scss'
                    ],
                    dest: 'demos',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            options: {
                map: true
            },
            critical: {
                src: "_includes/critical.css"
            },
            nonCritical: {
                src: "css/non-critical.css"
            },
            demos: {
                src: [
                    'demos/**/*.css',
                    '!demos/**/bower_components/**/*.css',
                    '!demos/**/node_modules/**/*.css'
                ]
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
                tasks: ["generateJs", "shell:jekyllBuild"]
            },
            css: {
                files: ["_scss/**/*.scss"],
                tasks: ["generateCss", "shell:jekyllBuild"]
            },
            css_demos: {
                files: ["demos/**/*.scss"],
                tasks: ["generateDemosCss", "shell:jekyllBuild"]
            }
        }
    });

    require('jit-grunt')(grunt);

    grunt.registerTask("generateJs", [
        "webpack"
    ]);

    grunt.registerTask("generateCss", [
        "sass:critical", "autoprefixer:critical",
        "sass:nonCritical", "autoprefixer:nonCritical"
    ]);

    grunt.registerTask("generateDemosCss", [
        "sass:demos", "autoprefixer:demos"
    ]);

    grunt.registerTask("serve", ["shell:jekyllServe"]);

    grunt.registerTask("build", [
        "generateJs",

        "generateCss",
        "generateDemosCss",

        "shell:jekyllBuild"
    ]);

    grunt.registerTask("default", [
        "build",

        "watch"
    ]);
};
