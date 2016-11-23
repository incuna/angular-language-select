'use strict';

var _libraries = require('././libraries.js');

require('././config.js');

// Module which is responsible for working out which language should be used by the app,
//  and storing this between page refreshes

var _module = _libraries.angular.module('language-select.storage-service', ['ngCookies', 'language-select.config']);

_module.factory('languageStorage', ['$rootScope', '$cookies', '$window', 'languageSelectConfig', function ($rootScope, $cookies, $window, languageSelectConfig) {

    var normaliseLanguageCode = function normaliseLanguageCode(languageCode) {
        return languageCode.toLowerCase().replace(/-/g, '_');
    };

    var languageChoices = languageSelectConfig.availableLanguages();

    var normalisedLanguageChoices = _.keyBy(languageChoices, function (choice) {
        return normaliseLanguageCode(choice.id);
    });

    var selectedLanguage = void 0;

    var publicMethods = {
        getLanguageChoices: function getLanguageChoices() {
            return languageChoices;
        },
        getLanguageChoice: function getLanguageChoice() {
            var languageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : selectedLanguage;

            var languageCode = normaliseLanguageCode(languageId);
            return normalisedLanguageChoices[languageCode];
        },
        get: function get() {
            return selectedLanguage;
        },
        set: function set(languageId) {
            selectedLanguage = languageId;
            $cookies.put('selectedLanguage', selectedLanguage);
            $rootScope.$broadcast('language-select:change', selectedLanguage);
        }
    };

    var checkLanguage = function checkLanguage(language) {
        if (_libraries.angular.isDefined(language)) {
            choice = publicMethods.getLanguageChoice(language);
            return choice && choice.id;
        }
    };

    var determineStartingLanguage = function determineStartingLanguage() {
        var cookieLanguage = $cookies.get('selectedLanguage');
        var browserLanguage = $window.navigator.language || $window.navigator.userLanguage;

        var cookieLangaugeChoice = checkLanguage(cookieLanguage);
        var browserLanguageChoice = checkLanguage(browserLanguage);
        var defaultLanguage = languageSelectConfig.defaultLanguage();

        return cookieLangaugeChoice || browserLanguageChoice || defaultLanguage;
    };

    var startingLanguage = determineStartingLanguage();
    publicMethods.set(startingLanguage);

    return publicMethods;
}]);
