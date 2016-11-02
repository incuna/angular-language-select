import { angular } from 'libraries';

// Module which is responsible for working out which language should be used by the app,
//  and storing this between page refreshes

var module = angular.module('language-select.storage-service', [
    'ngCookies',
    'language-select.config'
]);

// Factory which deals with the actual storage and get/set of current language
module.factory('languageStorage', [
    '$rootScope',
    '$cookies',
    '$window',
    'languageSelectConfig',
    function ($rootScope, $cookies, $window, languageSelectConfig) {

        // Return a version of the language code for comparison.
        var sanitise = function (language) {
            return language.toLowerCase().replace(/-/g, '_');
        };

        var languageChoices = languageSelectConfig.availableLanguages();
        // Map of language choices keyed by "sanitised" ids.
        var languageMap = _.keyBy(languageChoices, function (choices) {
            return sanitise(choices.id);
        });

        // Private variable we use to store the selected language
        var selectedLanguage;

        // Methods we will expose as the factory's public API
        var languageStorage = {
            getLanguageChoices: function () {
                return languageChoices;
            },
            getLanguageChoice: function (languageId) {
                return languageMap[sanitise(languageId || selectedLanguage)];
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

        var determineStartingLanguage = function () {
            // First we check to see if a cookie language exists, then we see if its valid.
            // If valid we make it the selected language.
            var cookieLanguage = $cookies.get('selectedLanguage');
            var browserLanguage = $window.navigator.language || $window.navigator.userLanguage;

            var choice;
            if (angular.isDefined(cookieLanguage)) {
                choice = languageStorage.getLanguageChoice(cookieLanguage);
                if (angular.isDefined(choice)) {
                    // We found a valid language in the cookie, so use that
                    return choice.id;
                }
            } else if (angular.isDefined(browserLanguage)) {
                // if the cookie doesn't exist/invalid then check language from the browser to
                // set as default.
                choice = languageStorage.getLanguageChoice(browserLanguage);
                if (angular.isDefined(choice)) {
                    // We found a valid language in the cookie, so use that
                    return choice.id;
                }
            }

            return languageSelectConfig.defaultLanguage();
        };

        // When we first load this factory, set the initial selectedlanguage
        var startingLanguage = determineStartingLanguage();
        languageStorage.set(startingLanguage);

        return languageStorage;
    }
]);
