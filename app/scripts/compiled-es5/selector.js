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
