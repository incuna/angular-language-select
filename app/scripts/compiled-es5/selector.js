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
