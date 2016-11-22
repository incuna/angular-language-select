import { angular } from './libraries.es';

import './storage.es';

// This module provides a directive which shows the currently selected language
//  and allows the selected language to be chnaged.

var module = angular.module('language-select.selector', [
    'language-select.storage-service'
]);

module.directive('languageSelector', [
    'languageStorage',
    '$window',
    function (languageStorage, $window) {
        return {
            restrict: 'A',
            templateUrl: 'templates/language-select/language-options.html',
            scope: {},
            link: function (scope) {
                scope.selectedLanguage = languageStorage.get();
                scope.languageChoices = languageStorage.getLanguageChoices();

                scope.changeLanguage = function () {
                    languageStorage.set(scope.selectedLanguage);
                    $window.location.reload();
                };
            }
        };
    }
]);
