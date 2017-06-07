/*eslint object-curly-newline: ["error", "always"]*/
/* eslint-env node */
/* global module, require */

'use strict';

module.exports = function (grunt) {

    if (grunt.option('help')) {
        // Load all tasks so they can be viewed in the help: grunt -h or --help.
        require('load-grunt-tasks')(grunt, {
            pattern: [
                'grunt-*',
                '@*/grunt-*',
                '!grunt-incuna-plugins',
            ],
        });
    } else {
        // Use jit-grunt to only load necessary tasks for each invocation of grunt.
        require('jit-grunt')(grunt, {
            swig: 'grunt-swig-templates',
            ngtemplates: 'grunt-angular-templates',
        });
    }

    const ngTemplatesPaths = require('grunt-incuna-plugins')['ng-templates-paths']();
    let ngTemplatesForIncLanguageSelect = {};
    try {
        ngTemplatesForIncLanguageSelect = ngTemplatesPaths.generate('inc-language-select', 'app', '<%= config.compiledScriptsDir %>');
    } catch (error) {
        grunt.log.warn('inc-language-select template paths do not exist. Run grunt again until this message does not show.');
    }

    grunt.initConfig({

        config: {
            baseDir: 'app',
            distDir: 'dist',
            testsDir: 'tests',
            tests: '<%= config.testsDir %>/**/*.js',
            libDir: '<%= config.baseDir %>/lib',

            scriptsDir: '<%= config.baseDir %>/scripts',
            srcScriptsDir: '<%= config.scriptsDir %>/src',
            compiledScriptsDir: '<%= config.scriptsDir %>/compiled-es5',

            templates: {
                sourceDir: 'templates/twig-source',
                sourceFiles: '<%= config.templates.sourceDir %>/**/*.html',
                generatedDir: 'templates/generated',
                generatedFiles: '<%= config.templates.generatedDir %>/**/*.html',
            },

            lintFiles: [
                'Gruntfile.js',
                '<%= config.srcScriptsDir %>',
                '<%= config.testsDir %>',
            ],
        },

    });

    grunt.config.merge({
        watch: {
            es: {
                files: [
                    '<%= config.srcScriptsDir %>/**/*.js',
                    '<%= config.compiledScriptsDir %>/**/templates.js',
                ],
                tasks: [
                    'compilejs',
                    'uglify',
                ],
            },
            swig: {
                files: [
                    '<%= config.templates.sourceFiles %>',
                ],
                tasks: [
                    'orderedSwig',
                ],
            },
            ngtemplates: {
                files: [
                    '<%= config.templates.generatedFiles %>',
                ],
                tasks: [
                    'ngtemplates',
                ],
            },
        },
        browserify: {
            all: {
                files: {
                    '<%= config.distDir %>/language-select.js': '<%= config.compiledScriptsDir %>/**/*.js',
                },
            },
        },
        babel: {
            all: {
                options: {
                    presets: [
                        'es2015',
                    ],
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.srcScriptsDir %>',
                    src: ['**/*.js'],
                    dest: '<%= config.compiledScriptsDir %>',
                    ext: '.js',
                }],
            },
        },
        eslint: {
            options: {
                fix: grunt.option('fix-eslint'),
            },
            all: {
                src: '<%= config.lintFiles %>',
            },
        },
        jscs: {
            all: {
                src: '<%= config.lintFiles %>',
            },
        },
        swig: {
            all: {
                expand: true,
                cwd: '<%= config.templates.sourceDir %>',
                src: [
                    '**/*.html',
                ],
                dest: '<%= config.templates.generatedDir %>',
            },
        },
        clean: {
            js: [
                '<%= config.compiledScriptsDir %>',
                '<%= config.distDir %>',
            ],
            swig: [
                '<%= config.templates.generatedDir %>/*',
            ],
        },
        uglify: {
            dist: {
                files: {
                    '<%= config.distDir %>/language-select.min.js': '<%= config.distDir %>/language-select.js',
                },
            },
        },
        ngtemplates: ngTemplatesForIncLanguageSelect,
        karma: {
            options: {
                configFile: 'tests/conf/karma.conf.js',
            },
            ci: {
            },
            dev: {
                options: {
                    singleRun: false,
                },
            },
        },
    });

    // - - - T A S K S - - -

    grunt.registerTask('default', 'dev');

    grunt.registerTask('dev', [
        'build',
        'watch',
    ]);

    grunt.registerTask('compilejs', [
        'babel',
        'browserify',
    ]);

    grunt.registerTask('orderedSwig', [
        'clean:swig',
        'swig:all',
    ]);

    grunt.registerTask('compileTemplates', [
        'orderedSwig',
        'ngtemplates',
    ]);

    grunt.registerTask('test', [
        'eslint',
        'jscs',
        'clean',
        'build',
        'karma:ci',
    ]);

    grunt.registerTask('build', [
        'clean',
        'compileTemplates',
        'compilejs',
        'uglify',
    ]);

};
