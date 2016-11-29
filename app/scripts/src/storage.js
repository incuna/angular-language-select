import { angular, _ } from './libraries';

import './config';

// Module which is responsible for working out which language should be used by the app,
//  and storing this between page refreshes

const module = angular.module('language-select.storage-service', [
    'ngCookies',
    'language-select.config',
]);

module.factory('languageStorage', [
    '$rootScope',
    '$cookies',
    '$window',
    'languageSelectConfig',
    function ($rootScope, $cookies, $window, languageSelectConfig) {
        const cookieSignature = 'selectedLanguage';
        const eventSignature = 'language-select:change';

        const normaliseLanguageCode = function (languageCode) {
            return languageCode && languageCode.toLowerCase().replace(/-/g, '_');
        };

        const languageChoices = languageSelectConfig.availableLanguages();

        const normalisedLanguageChoices = _.keyBy(languageChoices, (choice) => normaliseLanguageCode(choice.id));

        let selectedLanguageId;

        const publicMethods = {
            getLanguageChoices: function () {
                return languageChoices;
            },
            getLanguageChoice: function (languageId = selectedLanguageId) {
                const normalisedLanguageId = normaliseLanguageCode(languageId);
                return normalisedLanguageChoices[normalisedLanguageId];
            },
            get: function () {
                return selectedLanguageId;
            },
            set: function (languageId) {
                selectedLanguageId = languageId;
                $cookies.put(cookieSignature, selectedLanguageId);
                $rootScope.$broadcast(eventSignature, selectedLanguageId);
            },
            getCookieSingature: function () {
                return cookieSignature;
            },
            getEventSignature: function () {
                return eventSignature;
            },
        };

        const getLanguageIdIfValid = function (languageId) {
            if (angular.isDefined(languageId)) {
                const languageChoice = publicMethods.getLanguageChoice(languageId);
                return languageChoice && languageChoice.id;
            }
        };

        const determineStartingLanguageId = function () {
            const rawCookieLanguageId = $cookies.get(cookieSignature);
            const rawBrowserLanguageId = $window.navigator.language || $window.navigator.userLanguage;

            const cookieLangaugeId = getLanguageIdIfValid(rawCookieLanguageId);
            const browserLanguageId = getLanguageIdIfValid(rawBrowserLanguageId);
            const defaultLanguageId = languageSelectConfig.defaultLanguageId();

            return cookieLangaugeId || browserLanguageId || defaultLanguageId;
        };

        const startingLanguageId = determineStartingLanguageId();
        publicMethods.set(startingLanguageId);

        return publicMethods;
    },
]);

