'use strict';

var _libraries = require('./libraries');

require('./config');

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

    var selectedLanguageId = void 0;

    var publicMethods = {
        getLanguageChoices: function getLanguageChoices() {
            return languageChoices;
        },
        getLanguageChoice: function getLanguageChoice() {
            var languageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : selectedLanguageId;

            var languageCode = normaliseLanguageCode(languageId);
            return normalisedLanguageChoices[languageCode];
        },
        get: function get() {
            return selectedLanguageId;
        },
        set: function set(languageId) {
            selectedLanguageId = languageId;
            $cookies.put('selectedLanguageId', selectedLanguageId);
            $rootScope.$broadcast('language-select:change', selectedLanguageId);
        }
    };

    var getLanguageChoiceIfValid = function getLanguageChoiceIfValid(languageId) {
        if (_libraries.angular.isDefined(languageId)) {
            var choice = publicMethods.getLanguageChoice(languageId);
            return choice && choice.id;
        }
    };

    var determineStartingLanguage = function determineStartingLanguage() {
        var cookieLanguageId = $cookies.get('selectedLanguageId');
        var browserLanguageId = $window.navigator.language || $window.navigator.userLanguage;

        var cookieLangaugeChoice = getLanguageChoiceIfValid(cookieLanguageId);
        var browserLanguageChoice = getLanguageChoiceIfValid(browserLanguageId);
        var defaultLanguage = languageSelectConfig.defaultLanguage();

        return cookieLangaugeChoice || browserLanguageChoice || defaultLanguage;
    };

    var startingLanguage = determineStartingLanguage();
    publicMethods.set(startingLanguage);

    return publicMethods;
}]);
