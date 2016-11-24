'use strict';

var _libraries = require('./libraries');

require('./switch');

_libraries.angular.module('language-select', ['language-select.switch']);
