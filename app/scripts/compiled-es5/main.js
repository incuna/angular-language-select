'use strict';

var _libraries = require('./libraries');

require('./switch');

require('./interceptor');

_libraries.angular.module('language-select', ['language-select.switch']);
