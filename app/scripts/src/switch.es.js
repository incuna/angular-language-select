import { angular } from 'libraries';

// This module provides a directive which includes the language select
//   and provides the entry point for the language switch functionality.

var module = angular.module('language-select.switch', []);

module.directive('languageSwitch', [
    function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/language-select/language-switch.html'
        };
    }
]);
