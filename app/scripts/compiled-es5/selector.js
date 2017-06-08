'use strict';

var _libraries = require('./libraries');

require('./storage');

// This module provides a directive which shows the currently selected language
//  and allows the selected language to be chnaged.

var _module = _libraries.angular.module('language-select.selector', ['language-select.storage-service']);

_module.controller('languageSelectorController', ['languageStorage', 'windowReload', function (languageStorage, windowReload) {
    var _this = this;

    this.languageChoices = languageStorage.getLanguageChoices();

    var refreshLanguageId = function refreshLanguageId() {
        _this.selectedLanguageId = languageStorage.get();
    };
    refreshLanguageId();

    this.changeLanguage = function () {
        var selectedLanguageId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.selectedLanguageId;

        languageStorage.set(selectedLanguageId);
        refreshLanguageId();
        windowReload();
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
