(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _libraries = require('././libraries.js');

var _module = _libraries.angular.module('language-select.config', []);

_module.provider('languageSelectConfig', function () {
    var _availableLanguages = [{
        id: 'en',
        label: 'English'
    }];
    var _defaultLanguage = null;

    return {
        $get: function $get() {
            return {
                availableLanguages: function availableLanguages() {
                    return _availableLanguages;
                },
                defaultLanguage: function defaultLanguage() {
                    return _defaultLanguage || _availableLanguages[0].id;
                }
            };
        },
        setAvailableLanguages: function setAvailableLanguages(value) {
            _availableLanguages = value;
        },
        setDefaultLanguage: function setDefaultLanguage(value) {
            _defaultLanguage = value;
        }
    };
});

},{"././libraries.js":4}],2:[function(require,module,exports){
'use strict';

var _libraries = require('././libraries.js');

require('././storage.js');

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

},{"././libraries.js":4,"././storage.js":7}],3:[function(require,module,exports){
angular.module('-language-select.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/language-select/language-options.html',
    "<div class=select-wrapper><select ng-model=selectedLanguage ng-change=changeLanguage() ng-options=\"language.id as language.label for language in languageChoices\"></select></div>"
  );


  $templateCache.put('templates/language-select/language-switch.html',
    "<div class=language-switch><svg class=\"inline-svg earth\"><use xlink:href=#svg-earth></use></svg><div class=language-switch-inner language-selector></div><svg class=\"inline-svg arrow-down\"><use xlink:href=#svg-arrow-down></use></svg></div>"
  );

}]);

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;
var _ = exports._ = window._;

},{}],5:[function(require,module,exports){
'use strict';

var _libraries = require('././libraries.js');

require('././switch.js');

_libraries.angular.module('language-select', ['language-select.switch']);

},{"././libraries.js":4,"././switch.js":8}],6:[function(require,module,exports){
'use strict';

var _libraries = require('././libraries.js');

require('././storage.js');

// This module provides a directive which shows the currently selected language
//  and allows the selected language to be chnaged.

var _module = _libraries.angular.module('language-select.selector', ['language-select.storage-service']);

_module.directive('languageSelector', ['languageStorage', '$window', function (languageStorage, $window) {
    return {
        restrict: 'A',
        templateUrl: 'templates/language-select/language-options.html',
        scope: {},
        link: function link(scope) {
            scope.selectedLanguage = languageStorage.get();
            scope.languageChoices = languageStorage.getLanguageChoices();

            scope.changeLanguage = function () {
                languageStorage.set(scope.selectedLanguage);
                $window.location.reload();
            };
        }
    };
}]);

},{"././libraries.js":4,"././storage.js":7}],7:[function(require,module,exports){
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

},{"././config.js":1,"././libraries.js":4}],8:[function(require,module,exports){
'use strict';

var _libraries = require('././libraries.js');

require('././selector.js');

// This module provides a directive which includes the language select
//   and provides the entry point for the language switch functionality.

var _module = _libraries.angular.module('language-select.switch', []);

_module.directive('languageSwitch', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/language-select/language-switch.html'
    };
}]);

},{"././libraries.js":4,"././selector.js":6}]},{},[1,2,3,4,5,6,7,8]);
