import { angular } from './libraries.es';

import './config.es';

// Module which is responsible for working out which language should be used by the app,
//  and storing this between page refreshes

const module = angular.module('language-select.storage-service', [
    'ngCookies',
    'language-select.config'
]);

module.factory('languageStorage', [
    '$rootScope',
    '$cookies',
    '$window',
    'languageSelectConfig',
    function ($rootScope, $cookies, $window, languageSelectConfig) {

        const normaliseLanguageCode = function (languageCode) {
            return languageCode.toLowerCase().replace(/-/g, '_');
        };

        const languageChoices = languageSelectConfig.availableLanguages();

        const normalisedLanguageChoices = _.keyBy(languageChoices, (choice) => normaliseLanguageCode(choice.id));

        let selectedLanguage;

        const publicMethods = {
            getLanguageChoices: function () {
                return languageChoices;
            },
            getLanguageChoice: function (languageId = selectedLanguage) {
                const languageCode = normaliseLanguageCode(languageId);
                return normalisedLanguageChoices[languageCode];
            },
            get: function () {
                return selectedLanguage;
            },
            set: function (languageId) {
                selectedLanguage = languageId;
                $cookies.put('selectedLanguage', selectedLanguage);
                $rootScope.$broadcast('language-select:change', selectedLanguage);
            }
        };

        const checkLanguage = function (language) {
            if (angular.isDefined(language)) {
                choice = publicMethods.getLanguageChoice(language);
                return choice && choice.id;
            }
        };

        const determineStartingLanguage = function () {
            const cookieLanguage = $cookies.get('selectedLanguage');
            const browserLanguage = $window.navigator.language || $window.navigator.userLanguage;

            const cookieLangaugeChoice = checkLanguage(cookieLanguage);
            const browserLanguageChoice = checkLanguage(browserLanguage);
            const defaultLanguage = languageSelectConfig.defaultLanguage();

            return cookieLangaugeChoice || browserLanguageChoice || defaultLanguage;
        };

        const startingLanguage = determineStartingLanguage();
        publicMethods.set(startingLanguage);

        return publicMethods;
    }
]);
