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

            // List two sets of files due to a change in the file structure
            //  in angular 1.3. It's safe to list both since only one set
            //  will be available at a given time and karma will only issue
            //  a warning about missing files

            // For angular > 1.2
            '../node_modules/angular/angular.js',
            '../node_modules/angular-cookies/angular-cookies.js',

            // For angular 1.2
            '../node_modules/angular/lib/angular.min.js',
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
