import { angular } from './libraries';

import './storage';

// This module provides a directive which shows the currently selected language
//  and allows the selected language to be chnaged.

var module = angular.module('language-select.selector', [
    'language-select.storage-service',
]);

module.controller('languageSelectorController', [
    'languageStorage',
    'windowReload',
    function (
        languageStorage,
        windowReload
    ) {
        this.languageChoices = languageStorage.getLanguageChoices();

        const refreshLanguageId = () => {
            this.selectedLanguageId = languageStorage.get();
        };
        refreshLanguageId();

        this.changeLanguage = function (selectedLanguageId = this.selectedLanguageId) {
            languageStorage.set(selectedLanguageId);
            refreshLanguageId();
            windowReload();
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
