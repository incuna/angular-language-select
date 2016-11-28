'use strict';

var _libraries = require('./libraries');

require('./storage');

// This module provides a directive which shows the currently selected language
//  and allows the selected language to be chnaged.

var _module = _libraries.angular.module('language-select.selector', ['language-select.storage-service']);

_module.controller('languageSelectorController', ['languageStorage', '$window', function (languageStorage, $window) {
    var _this = this;

    this.selectedLanguage = languageStorage.get();
    this.languageChoices = languageStorage.getLanguageChoices();

    this.changeLanguage = function () {
        languageStorage.set(_this.selectedLanguage);
        $window.location.reload();
    };
}]);

_module.directive('languageSelector', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/language-select/language-options.html',
        scope: {},
        controller: 'languageSelectorController',
        controllerAs: 'selector'
    };
}]);
