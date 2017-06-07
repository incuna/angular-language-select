import { angular } from './libraries';

const module = angular.module('language-select.config', []);

module.provider('languageSelectConfig', function () {
    let availableLanguages = [
        {
            id: 'en',
            label: 'English',
        },
    ];
    let defaultLanguageId = null;
    let reloadOnChange = true;

    return {
        $get: function () {
            return {
                availableLanguages: function () {
                    return availableLanguages;
                },
                defaultLanguageId: function () {
                    return defaultLanguageId || availableLanguages[0].id;
                },
                reloadOnChange: function () {
                    return reloadOnChange;
                },
            };
        },
        setAvailableLanguages: function (value) {
            availableLanguages = value;
        },
        setDefaultLanguage: function (value) {
            defaultLanguageId = value;
        },
        setReloadOnChange: function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('setReloadOnChange: value must be true or false');
            }
            reloadOnChange = value;
        },
    };
});
