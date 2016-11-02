'use strict';

var _libraries = require('./libraries.js');

require('././selector.js');

require('././switch.js');

require('././interceptor.js');

require('././storage.js');

_libraries.angular.module('language-select', ['language-select.selector', 'language-select.switch', 'language-select.language-interceptor', 'language-select.storage-service']);
