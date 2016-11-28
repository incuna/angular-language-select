import { angular } from './libraries';

const module = angular.module('language-select.config', []);

module.provider('languageSelectConfig', function () {
    let availableLanguages = [
        {
            id: 'en',
            label: 'English',
        },
    ];
    let defaultLanguage = null;

    return {
        $get: function () {
            return {
                availableLanguages: function () {
                    return availableLanguages;
                },
                defaultLanguage: function () {
                    return defaultLanguage || availableLanguages[0].id;
                },
            };
        },
        setAvailableLanguages: function (value) {
            availableLanguages = value;
        },
        setDefaultLanguage: function (value) {
            defaultLanguage = value;
        },
    };
});
