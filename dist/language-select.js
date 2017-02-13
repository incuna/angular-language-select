(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries');

var _module = _libraries.angular.module('language-select.config', []);

_module.provider('languageSelectConfig', function () {
    var _availableLanguages = [{
        id: 'en',
        label: 'English'
    }];
    var _defaultLanguageId = null;

    return {
        $get: function $get() {
            return {
                availableLanguages: function availableLanguages() {
                    return _availableLanguages;
                },
                defaultLanguageId: function defaultLanguageId() {
                    return _defaultLanguageId || _availableLanguages[0].id;
                }
            };
        },
        setAvailableLanguages: function setAvailableLanguages(value) {
            _availableLanguages = value;
        },
        setDefaultLanguage: function setDefaultLanguage(value) {
            _defaultLanguageId = value;
        }
    };
});

},{"./libraries":4}],2:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries');

require('./storage');

// Module registers an http interceptor which adds the http header
//  for the currently selected language to every API request

var _module = _libraries.angular.module('language-select.language-interceptor', ['language-select.storage-service']);

_module.factory('languageInterceptor', ['languageStorage', function (languageStorage) {

    var languageInterceptor = {
        request: function request(config) {
            // Do this on every http request
            config.headers['Accept-Language'] = languageStorage.get();
            return config;
        }
    };

    return languageInterceptor;
}]);

_module.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('languageInterceptor');
}]);

},{"./libraries":4,"./storage":7}],3:[function(require,module,exports){
angular.module('inc-language-select-language-switch.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/inc-language-select/language-switch/language-links.html',
    "<div class=language-links><span class=language-link ng-repeat=\"language in selector.languageChoices\" ng-click=selector.changeLanguage(language.id) ng-class=\"{selected: language.id === selector.selectedLanguageId}\">{{ language.label }}</span></div>"
  );


  $templateCache.put('templates/inc-language-select/language-switch/language-options.html',
    "<div class=select-wrapper><select ng-model=selector.selectedLanguageId ng-change=selector.changeLanguage() ng-options=\"language.id as language.label for language in selector.languageChoices\"></select></div>"
  );


  $templateCache.put('templates/inc-language-select/language-switch/language-switch.html',
    "<div class=language-switch><svg class=\"inline-svg earth\"><use xlink:href=#svg-earth></use></svg><div class=language-switch-inner language-selector></div><svg class=\"inline-svg arrow-down\"><use xlink:href=#svg-arrow-down></use></svg></div>"
  );

}]);

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],5:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries');

require('./switch');

require('./interceptor');

_libraries.angular.module('language-select', ['language-select.switch']);

},{"./interceptor":2,"./libraries":4,"./switch":8}],6:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries');

require('./storage');

// This module provides a directive which shows the currently selected language
//  and allows the selected language to be chnaged.

var _module = _libraries.angular.module('language-select.selector', ['language-select.storage-service']);

_module.controller('languageSelectorController', ['languageStorage', '$window', function (languageStorage, $window) {
    this.selectedLanguageId = languageStorage.get();
    this.languageChoices = languageStorage.getLanguageChoices();

    this.changeLanguage = function () {
        var selectedLanguageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.selectedLanguageId;

        languageStorage.set(selectedLanguageId);
        $window.location.reload();
    };
}]);

_module.directive('incLanguageSelector', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/inc-language-select/language-switch/language-options.html',
        scope: {},
        controller: 'languageSelectorController',
        controllerAs: 'selector'
    };
}]);

_module.directive('incLanguageLinks', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/inc-language-select/language-switch/language-links.html',
        scope: {},
        controller: 'languageSelectorController',
        controllerAs: 'selector'
    };
}]);

},{"./libraries":4,"./storage":7}],7:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries');

require('./config');

// Module which is responsible for working out which language should be used by the app,
//  and storing this between page refreshes

var _module = _libraries.angular.module('language-select.storage-service', ['ngCookies', 'language-select.config']);

// Implement a custom cookie handler to deal with older versions of $cookies
_module.service('cookieHandler', ['$cookies', function ($cookies) {
    this.put = function (name, value) {
        if (_libraries.angular.isFunction($cookies.put)) {
            $cookies.put(name, value);
        } else {
            $cookies[name] = value;
        }
    };

    this.get = function (name) {
        if (_libraries.angular.isFunction($cookies.get)) {
            return $cookies.get(name);
        }

        return $cookies[name];
    };
}]);

_module.factory('windowReload', ['$window', function ($window) {
    return function () {
        $window.location.reload();
    };
}]);

_module.factory('languageStorage', ['$rootScope', '$window', 'languageSelectConfig', 'cookieHandler', 'windowReload', function ($rootScope, $window, languageSelectConfig, cookieHandler, windowReload) {
    var cookieSignature = 'selectedLanguage';
    var eventSignature = 'language-select:change';

    var normaliseLanguageCode = function normaliseLanguageCode(languageCode) {
        return languageCode && languageCode.toLowerCase().replace(/-/g, '_');
    };

    var convertLanguageChoices = function convertLanguageChoices(choices) {
        var keyedChoices = {};

        choices.forEach(function (choice) {
            var normalisedLanguageCode = normaliseLanguageCode(choice.id);
            keyedChoices[normalisedLanguageCode] = choice;
        });

        return keyedChoices;
    };

    var languageChoices = languageSelectConfig.availableLanguages();
    var normalisedLanguageChoices = convertLanguageChoices(languageChoices);

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

    var stripCulture = function stripCulture(navigatorLanguage) {
        if (!navigatorLanguage) {
            return '';
        }

        return navigatorLanguage.replace(/[-_].*/, '');
    };

    var getUserLanguage = function getUserLanguage() {
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

    var determineStartingLanguage = function determineStartingLanguage() {
        var rawCookieLanguageId = cookieHandler.get(cookieSignature);
        var rawBrowserLanguageId = stripCulture(getUserLanguage());

        var cookieLangaugeId = getLanguageIdIfValid(rawCookieLanguageId);
        var browserLanguageId = getLanguageIdIfValid(rawBrowserLanguageId);
        var defaultLanguageId = languageSelectConfig.defaultLanguageId();

        return {
            id: cookieLangaugeId || browserLanguageId || defaultLanguageId,
            cookieWasSet: Boolean(rawCookieLanguageId)
        };
    };

    var startingLanguage = determineStartingLanguage();
    publicMethods.set(startingLanguage.id);

    if (!startingLanguage.cookieWasSet) {
        windowReload();
    }

    return publicMethods;
}]);

},{"./config":1,"./libraries":4}],8:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries');

require('./selector');

// This module provides a directive which includes the language select
//   and provides the entry point for the language switch functionality.

var _module = _libraries.angular.module('language-select.switch', ['language-select.selector']);

_module.directive('incLanguageSwitch', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/inc-language-select/language-switch/language-switch.html'
    };
}]);

},{"./libraries":4,"./selector":6}]},{},[1,2,3,4,5,6,7,8]);
