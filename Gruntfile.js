const path = require('path');
const webpack = require('webpack');

const rootPath = path.resolve();

//const DEBUG_IS_ENABLED = Boolean(process.env.BLOG_DEBUG);// environment variable

function getPostCssOptions(noCssVars) {
    return {
        processors: [
            require("postcss-import")(),
            require('postcss-cssnext')({
                browsers: ['last 2 versions'],
                features: {
                    customProperties: !!noCssVars // processing custom props
                    /* If applyRule is disabled, processing of mixins stops with
                     "Fatal error: Expected pseudo-class or pseudo-element" */
                    // ,applyRule: false // don't process mixins
                }
            }),
            require('cssnano')({
                // http://cssnano.co/optimisations/
                safe: true,
                autoprefixer: false,
                core: false,
                minifyFontValues: false,
                mergeRules: false,
                colormin: false
            }),
            require("postcss-reporter")()
        ]
    };
}

function getCriticalCssConfig(noCssVars) {
    const config = {
        options: getPostCssOptions(noCssVars),
        files: [{
            expand: true,
            cwd: '_css',
            src: ['critical.pcss'],
            dest: '_includes/generated',
            ext: '.css'
        }]
    };
    if (noCssVars) {
        config.files[0].rename = function () {
            return 'css/critical-no-css-vars.css';
        }
    }
    return config;
}

function getNonCriticalCssConfig(noCssVars) {
    const config = {
        options: getPostCssOptions(noCssVars),
        files: [{
            expand: true,
            cwd: '_css',
            src: ['non-critical.pcss'],
            dest: 'css',
            ext: '.css'
        }]
    };
    if (noCssVars) {
        config.files[0].rename = function () {
            return 'css/non-critical-no-css-vars.css';
        }
    }
    return config;
}

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

        sass: {// ToDo
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
            critical: getCriticalCssConfig(),
            criticalIE: getCriticalCssConfig('noCssVars'),
            nonCritical: getNonCriticalCssConfig(),
            nonCriticalIE: getNonCriticalCssConfig('noCssVars'),
            demos: {
                options: getPostCssOptions('forAllBrowsers'),
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
                files: ["_css/**/*.pcss"],
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
        "postcss:critical",
        "postcss:nonCritical",
        "postcss:criticalIE",
        "postcss:nonCriticalIE"
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

        "jekyllBuild",
        "watch"
    ]);

    grunt.registerTask("default", [
        "build"
    ]);
};
