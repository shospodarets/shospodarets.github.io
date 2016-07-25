var path = require('path');
var webpack = require('webpack');

var rootPath = path.resolve();

//var DEBUG_IS_ENABLED = Boolean(process.env.BLOG_DEBUG);// environment variable

module.exports = function (grunt) {
    grunt.initConfig({
        webpack: {
            dist: {
                entry: rootPath + '/_js/main/main.js',
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
                                presets: ['es2015', 'stage-2'],
                                compact: false
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
            critical: {
                options: {
                    outputStyle: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '_scss',
                    src: ['critical.scss'],
                    dest: '_includes/generated',
                    ext: '.css'
                }]
            },
            nonCritical: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: true
                },
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
                        '*/main.scss'
                    ],
                    dest: 'demos',
                    ext: '.css'
                }]
            }
        },

        postcss: {
            options: {
                processors: [
                    require('postcss-cssnext')({
                        browsers: ['last 2 versions', 'IE > 10'],
                        features: {
                            calc: false,
                            rem: false,
                            colorRgba: false
                        }
                    }),
                    require("postcss-reporter")()
                ]
            },
            critical: {
                src: "_includes/critical.css"
            },
            nonCritical: {
                options: {
                    map: true
                },
                src: "css/non-critical.css"
            },
            demos: {
                src: [
                    'demos/*/main.css'
                ]
            }
        },

        shell: {
            jekyllServe: {
                command: "jekyll serve",// --profile
                options: {
                    stdin: false
                }
            },
            jekyllBuild: {
                command: "jekyll build",// --profile
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
                tasks: ["jekyllBuild"]
            },
            js: {
                files: ["_js/main/**"],
                tasks: ["generateJs", "jekyllBuild"]
            },
            css: {
                files: ["_scss/**/*.scss"],
                tasks: ["generateCss", "jekyllBuild"]
            },
            css_demos: {
                files: ["demos/**/*.scss"],
                tasks: ["generateDemosCss", "jekyllBuild"]
            }
        }
    });

    require('jit-grunt')(grunt);

    grunt.registerTask("generateJs", [
        "webpack"
    ]);

    grunt.registerTask("generateCss", [
        "sass:critical", "postcss:critical",
        "sass:nonCritical", "postcss:nonCritical"
    ]);

    grunt.registerTask("generateDemosCss", [
        "sass:demos", "postcss:demos"
    ]);

    grunt.registerTask("serve", ["shell:jekyllServe"]);

    grunt.registerTask("jekyllBuild", [
        // Jekyll build
        "shell:jekyllBuild"
    ]);

    grunt.registerTask("build", [
        "generateJs",

        "generateCss",
        "generateDemosCss",

        "jekyllBuild"
    ]);

    grunt.registerTask("default", [
        "watch"
    ]);
};
