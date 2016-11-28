import { angular } from './libraries';

import './selector';

// This module provides a directive which includes the language select
//   and provides the entry point for the language switch functionality.

const module = angular.module('language-select.switch', [
    'language-select.selector',
]);

module.directive('languageSwitch', [
    function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/language-select/language-switch.html',
        };
    },
]);
