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
        this.selectedLanguageId = languageStorage.get();
        this.languageChoices = languageStorage.getLanguageChoices();

        this.changeLanguage = function (selectedLanguageId = this.selectedLanguageId) {
            languageStorage.set(selectedLanguageId);
            $window.location.reload();
        };
    },
]);

module.directive('incLanguageSelector', [
    function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/inc-language-select/language-switch/language-options.html',
            scope: {},
            controller: 'languageSelectorController',
            controllerAs: 'selector',
        };
    },
]);

module.directive('incLanguageLinks', [
    function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/inc-language-select/language-switch/language-links.html',
            scope: {},
            controller: 'languageSelectorController',
            controllerAs: 'selector',
        };
    },
]);
