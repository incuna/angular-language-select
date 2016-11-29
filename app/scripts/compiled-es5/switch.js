'use strict';

var _libraries = require('./libraries');

require('./selector');

// This module provides a directive which includes the language select
//   and provides the entry point for the language switch functionality.

var _module = _libraries.angular.module('language-select.switch', ['language-select.selector']);

_module.directive('languageSwitch', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/language-select/language-switch.html'
    };
}]);
