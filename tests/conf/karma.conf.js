'use strict';

module.exports = function (config) {
    config.set({

        basePath: '..',

        frameworks: ['browserify', 'jasmine'],

        browserify: {
            debug: true,
            transform: [
                ['babelify', {
                    presets: [
                        'es2015',
                    ],
                }],
            ],
        },

        files: [
            '../node_modules/lodash/lodash.js',
            '../node_modules/angular/angular.js',
            // For angular 1.2.15
            '../node_modules/angular/lib/angular.min.js',
            '../node_modules/angular-cookies/angular-cookies.js',
            // For angular-cookies 1.2.15
            '../node_modules/angular-cookies/src/angular-cookies.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            '*-spec.js',
        ],

        preprocessors: {'*-spec.js': 'browserify'},

        reporters: ['progress', 'dots'],

        colors: true,

        logLevel: config.LOG_INFO,

        browsers: ['Firefox'],

        singleRun: true,
    });
};
