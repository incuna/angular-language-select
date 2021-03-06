import { angular } from './libraries';

import './config';

// Module which is responsible for working out which language should be used by the app,
//  and storing this between page refreshes

const module = angular.module('language-select.storage-service', [
    'ngCookies',
    'language-select.config',
]);

// Implement a custom cookie handler to deal with older versions of $cookies
module.service('cookieHandler', [
    '$cookies',
    function ($cookies) {
        this.put = function (name, value) {
            if (angular.isFunction($cookies.put)) {
                $cookies.put(name, value);
            } else {
                $cookies[name] = value;
            }
        };

        this.get = function (name) {
            if (angular.isFunction($cookies.get)) {
                return $cookies.get(name);
            }

            return $cookies[name];
        };
    },
]);

module.factory('windowReload', [
    '$window',
    'languageSelectConfig',
    function (
        $window,
        languageSelectConfig
    ) {
        return function () {
            if (languageSelectConfig.reloadOnChange()) {
                $window.location.reload();
            }
        };
    },
]);

module.factory('languageStorage', [
    '$rootScope',
    '$window',
    'languageSelectConfig',
    'cookieHandler',
    'windowReload',
    function (
        $rootScope,
        $window,
        languageSelectConfig,
        cookieHandler,
        windowReload
    ) {
        const cookieSignature = 'selectedLanguage';
        const eventSignature = 'language-select:change';

        const normaliseLanguageCode = function (languageCode) {
            return languageCode && languageCode.toLowerCase().replace(/-/g, '_');
        };

        const convertLanguageChoices = function (choices) {
            let keyedChoices = {};

            choices.forEach((choice) => {
                const normalisedLanguageCode = normaliseLanguageCode(choice.id);
                keyedChoices[normalisedLanguageCode] = choice;
            });

            return keyedChoices;
        };

        const languageChoices = languageSelectConfig.availableLanguages();
        const normalisedLanguageChoices = convertLanguageChoices(languageChoices);

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
                cookieHandler.put(cookieSignature, selectedLanguageId);
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

        const stripCulture = function (navigatorLanguage) {
            if (!navigatorLanguage) {
                return '';
            }

            return navigatorLanguage.replace(/[-_].*/, '');
        };

        const getUserLanguage = function () {
            /*
             * navigator.languages - consistent API supported by latest Chrome and Firefox
             * navigator.language - incosistent (Chrome doesn't reflect user selected language), but widely supported (except for IE < 11)
             * navigator.userLanguage - supported by IE < 11
             */

            if ($window.navigator.languages) {
                return $window.navigator.languages[0];
            }

            return $window.navigator.language || $window.navigator.userLanguage;
        };

        const determineStartingLanguage = function () {
            const rawCookieLanguageId = cookieHandler.get(cookieSignature);
            const rawBrowserLanguageId = stripCulture(getUserLanguage());

            const cookieLangaugeId = getLanguageIdIfValid(rawCookieLanguageId);
            const browserLanguageId = getLanguageIdIfValid(rawBrowserLanguageId);
            const defaultLanguageId = languageSelectConfig.defaultLanguageId();

            return {
                id: cookieLangaugeId || browserLanguageId || defaultLanguageId,
                cookieWasSet: Boolean(rawCookieLanguageId),
            };
        };

        const startingLanguage = determineStartingLanguage();
        publicMethods.set(startingLanguage.id);

        if (!startingLanguage.cookieWasSet) {
            windowReload();
        }

        return publicMethods;
    },
]);
