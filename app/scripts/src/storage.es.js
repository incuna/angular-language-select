import { angular } from './libraries';

import './config';

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

        let selectedLanguageId;

        const publicMethods = {
            getLanguageChoices: function () {
                return languageChoices;
            },
            getLanguageChoice: function (languageId = selectedLanguageId) {
                const languageCode = normaliseLanguageCode(languageId);
                return normalisedLanguageChoices[languageCode];
            },
            get: function () {
                return selectedLanguageId;
            },
            set: function (languageId) {
                selectedLanguageId = languageId;
                $cookies.put('selectedLanguageId', selectedLanguageId);
                $rootScope.$broadcast('language-select:change', selectedLanguageId);
            }
        };

        const getLanguageChoiceIfValid = function (languageId) {
            if (angular.isDefined(languageId)) {
                const choice = publicMethods.getLanguageChoice(languageId);
                return choice && choice.id;
            }
        };

        const determineStartingLanguage = function () {
            const cookieLanguageId = $cookies.get('selectedLanguageId');
            const browserLanguageId = $window.navigator.language || $window.navigator.userLanguage;

            const cookieLangaugeChoice = getLanguageChoiceIfValid(cookieLanguageId);
            const browserLanguageChoice = getLanguageChoiceIfValid(browserLanguageId);
            const defaultLanguage = languageSelectConfig.defaultLanguage();

            return cookieLangaugeChoice || browserLanguageChoice || defaultLanguage;
        };

        const startingLanguage = determineStartingLanguage();
        publicMethods.set(startingLanguage);

        return publicMethods;
    }
]);
