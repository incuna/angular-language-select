import { angular } from './libraries';

import './storage';

// This module provides a directive which shows the currently selected language
//  and allows the selected language to be chnaged.

var module = angular.module('language-select.selector', [
    'language-select.storage-service',
]);

module.controller('languageSelectorController', [
    'languageStorage',
    '$window',
    function (
        languageStorage,
        $window
    ) {
        this.selectedLanguage = languageStorage.get();
        this.languageChoices = languageStorage.getLanguageChoices();

        this.changeLanguage = function () {
            languageStorage.set(this.selectedLanguage);
            $window.location.reload();
        };
    },
]);

module.directive('languageSelector', [
    function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/language-select/language-options.html',
            scope: {},
            controller: 'languageSelectorController',
            controllerAs: 'selector',
        };
    },
]);
