import { angular } from 'libraries';

import './storage';

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
                // Make languages and current language available to template scope
                scope.selectedLanguage = languageStorage.get();
                scope.languageChoices = languageStorage.getLanguageChoices();

                // Call this in template when changing language
                //  @param language {object} a single language object as
                //  returned by getLanguageChoices()
                scope.changeLanguage = function () {
                    languageStorage.set(scope.selectedLanguage);
                    $window.location.reload();
                };
            }
        };
    }
]);
