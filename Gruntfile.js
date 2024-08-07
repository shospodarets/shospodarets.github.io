const sass = require('sass');

// const DEBUG_IS_ENABLED = Boolean(process.env.BLOG_DEBUG);// environment variable

const supportedBrowsersList = {
    // https://github.com/ai/browserslist
    'browsersList': [
        'last 1 Chrome version',
        'last 1 ChromeAndroid version',
        'last 1 iOS version',
        'last 1 Edge version',
        'last 1 Firefox version'
    ]
};

module.exports = function (grunt) {
    grunt.registerTask('eslint', 'Runs the linting script', function () {
        const done = this.async();
        const nodeUtils = require('./_other/scripts/node-utils');

        nodeUtils.runWithProgress('npm', ['run', 'lint-js', '--', '--quiet'], (code, errData) => {
            if (code !== 0) {
                console.error(`Can not run npm lint-js:\n${errData}`);
                return done(false);
            }

            return done();
        });
    });

    grunt.initConfig({
        sass: {
            critical: {
                files: [{
                    expand: true,
                    cwd: '_css',
                    src: ['critical.scss'],
                    dest: '_includes/generated',
                    ext: '.css'
                }]
            },
            nonCritical: {
                files: [{
                    expand: true,
                    cwd: '_css',
                    src: ['non-critical.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            },
            demos: {// all *.scss files in 'demos' folder
                files: [{
                    expand: true,
                    cwd: 'demos',
                    src: [
                        '*/main.scss'
                    ],
                    dest: 'demos',
                    ext: '.css'
                }]
            },
            options: {
                implementation: sass,
            },
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')(supportedBrowsersList),
                    require('cssnano')({
                        // http://cssnano.co/optimisations/
                        safe: true,
                        autoprefixer: false,
                        minifyFontValues: false,
                        mergeRules: false,
                        colormin: false
                    }),
                    require('postcss-reporter')()
                ]
            },
            critical: {
                files: [{
                    expand: true,
                    cwd: '_includes/generated',
                    src: 'critical.css',
                    dest: '_includes/generated',
                    ext: '.css'
                }]
            },
            nonCritical: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: 'non-critical.css',
                    dest: 'css',
                    ext: '.css'
                }]
            }
        },

        shell: {
            jekyllServe: {
                command: 'jekyll serve', // --profile
                options: {
                    stdin: false
                }
            },
            jekyllBuild: {
                command: 'jekyll build', // --profile
                options: {
                    stdin: false
                }
            }
        },

        watch: {
            site: {
                files: ['./*.md', './*.html', '_layouts/**/*.html', '_posts/*.md', '_includes/**/*.html'],
                tasks: ['jekyllBuild']
            },
            js: {
                files: ['js/modules/**'],
                tasks: ['copy:js']
            },
            css: {
                files: ['_css/**/*.scss'],
                tasks: ['generateCss', 'jekyllBuild']
            },
            css_demos: {
                files: ['demos/**/*.scss'],
                tasks: ['generateDemosCss', 'jekyllBuild']
            }
        },

        open: {
            dist: {
                path: 'http://localhost:4000/'
            }
        },

        stylelint: {
            options: {
                configFile: './.stylelintrc',
                customSyntax: 'postcss-scss',
            },
            src: [
                './_css/**/*.scss',
            ]
        },

        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        src: ['js/modules/**'],
                        dest: '_site/js/modules/'
                    },
                ],
            },
        },
    });

    // load grunt npm tasks
    grunt.loadNpmTasks('@lodder/grunt-postcss');
    require('jit-grunt')(grunt);

    grunt.registerTask('generateCss', [
        'sass:critical',
        'sass:nonCritical',
        'postcss:critical',
        'postcss:nonCritical'
    ]);

    grunt.registerTask('generateDemosCss', [
        'sass:demos'
    ]);

    grunt.registerTask('serve', ['shell:jekyllServe']);

    grunt.registerTask('jekyllBuild', [
        // Jekyll build
        'shell:jekyllBuild'
    ]);

    grunt.registerTask('build', [
        'eslint',

        'stylelint',
        'generateCss',
        'generateDemosCss',

        'jekyllBuild'
    ]);

    grunt.registerTask('default', [
        'build',
        'open',
        'watch'
    ]);
};
