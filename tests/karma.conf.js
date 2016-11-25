/* eslint-env node */
module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['browserify', 'jasmine'],

        browserify: {
            debug: true,
            transform: [
                ['babelify', {
                    presets: ['es2015']
                }]
            ]
        },

        files: [
            '../node_modules/lodash/lodash.js',
            '../node_modules/angular/angular.js',
            '../node_modules/angular-cookies/angular-cookies.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            '*-spec.js'
        ],

        preprocessors: {
            '*-spec.js': 'browserify'
        },

        reporters: ['progress', 'dots'],

        colors: true,

        logLevel: config.LOG_INFO,

        browsers: ['Firefox'],

        singleRun: true
    });
};
