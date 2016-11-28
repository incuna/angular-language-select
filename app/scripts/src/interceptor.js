import { angular } from './libraries';

import './storage';

// Module registers an http interceptor which adds the http header
//  for the currently selected language to every API request

const module = angular.module('language-select.language-interceptor', [
    'language-select.storage-service',
]);

module.factory('languageInterceptor', [
    'languageStorage',
    function (languageStorage) {

        const languageInterceptor = {
            request: function (config) {
                // Do this on every http request
                config.headers['Accept-Language'] = languageStorage.get();
                return config;
            },
        };

        return languageInterceptor;
    },
]);

module.config([
    '$httpProvider',
    function ($httpProvider) {
        $httpProvider.interceptors.push('languageInterceptor');
    }
]);
