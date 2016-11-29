'use strict';

var _libraries = require('./libraries');

require('./config');

// Module which is responsible for working out which language should be used by the app,
//  and storing this between page refreshes

var _module = _libraries.angular.module('language-select.storage-service', ['ngCookies', 'language-select.config']);

// Implement a custom cookie handler to deal with older versions of $cookies
_module.service('cookieHandler', ['$cookies', function ($cookies) {
    this.put = function (name, value) {
        if ($cookies.put) {
            $cookies.put(name, value);
        } else {
            $cookies[name] = value;
        }
    };

    this.get = function (name) {
        if ($cookies.get) {
            return $cookies.get(name);
        }

        return $cookies[name];
    };
}]);

_module.factory('languageStorage', ['$rootScope', '$window', 'languageSelectConfig', 'cookieHandler', function ($rootScope, $window, languageSelectConfig, cookieHandler) {
    var cookieSignature = 'selectedLanguage';
    var eventSignature = 'language-select:change';

    var normaliseLanguageCode = function normaliseLanguageCode(languageCode) {
        return languageCode && languageCode.toLowerCase().replace(/-/g, '_');
    };

    var languageChoices = languageSelectConfig.availableLanguages();

    var normalisedLanguageChoices = _libraries._.keyBy(languageChoices, function (choice) {
        return normaliseLanguageCode(choice.id);
    });

    var selectedLanguageId = void 0;

    var publicMethods = {
        getLanguageChoices: function getLanguageChoices() {
            return languageChoices;
        },
        getLanguageChoice: function getLanguageChoice() {
            var languageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : selectedLanguageId;

            var normalisedLanguageId = normaliseLanguageCode(languageId);
            return normalisedLanguageChoices[normalisedLanguageId];
        },
        get: function get() {
            return selectedLanguageId;
        },
        set: function set(languageId) {
            selectedLanguageId = languageId;
            cookieHandler.put(cookieSignature, selectedLanguageId);
            $rootScope.$broadcast(eventSignature, selectedLanguageId);
        },
        getCookieSingature: function getCookieSingature() {
            return cookieSignature;
        },
        getEventSignature: function getEventSignature() {
            return eventSignature;
        }
    };

    var getLanguageIdIfValid = function getLanguageIdIfValid(languageId) {
        if (_libraries.angular.isDefined(languageId)) {
            var languageChoice = publicMethods.getLanguageChoice(languageId);
            return languageChoice && languageChoice.id;
        }
    };

    var determineStartingLanguageId = function determineStartingLanguageId() {
        var rawCookieLanguageId = cookieHandler.get(cookieSignature);
        var rawBrowserLanguageId = $window.navigator.language || $window.navigator.userLanguage;

        var cookieLangaugeId = getLanguageIdIfValid(rawCookieLanguageId);
        var browserLanguageId = getLanguageIdIfValid(rawBrowserLanguageId);
        var defaultLanguageId = languageSelectConfig.defaultLanguageId();

        return cookieLangaugeId || browserLanguageId || defaultLanguageId;
    };

    var startingLanguageId = determineStartingLanguageId();
    publicMethods.set(startingLanguageId);

    return publicMethods;
}]);
