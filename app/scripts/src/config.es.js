import { angular } from 'libraries';

// Module for providing configuration options

const module = angular.module('language-select.config', []);

module.provider('languageSelectConfig', function () {
    var availableLanguages = [{
        id: 'en',
        label: 'English'
    }];
    var defaultLanguage = null;

    return {
        $get: function () {
            return {
                availableLanguages: function () {
                    return availableLanguages;
                },
                defaultLanguage: function () {
                    return defaultLanguage || availableLanguages[0].id;
                }
            };
        },
        setAvailableLanguages: function (value) {
            availableLanguages = value;
        },
        setDefaultLanguage: function (value) {
            defaultLanguage = value;
        }
    }
});
